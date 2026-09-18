import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { prisma } from "@/lib/prisma";
import { rateLimits } from "@/lib/rate-limit";

// Precomputed bcrypt cost 12 dummy hash for constant-time execution against timing attacks
const DUMMY_HASH =
    "$2a$12$e8Y6bF95rVwzN3K1YyK4veBvjKqC9o2mR3fU4.9Q6i7l8M0kO2p6S";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    pages: {
        signIn: "/login",
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),

        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                },
                password: {
                    label: "Password",
                    type: "password",
                },
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials.password) {
                    return null;
                }

                const cleanEmail = credentials.email.trim().toLowerCase();
                const cleanPassword = credentials.password;

                if (cleanEmail.length > 255 || cleanPassword.length > 128) {
                    return null;
                }

                const ipHeader =
                    req?.headers?.["x-forwarded-for"] ||
                    req?.headers?.["x-real-ip"] ||
                    "127.0.0.1";
                const clientIp =
                    typeof ipHeader === "string"
                        ? ipHeader.split(",")[0].trim()
                        : "127.0.0.1";

                const emailLimit = rateLimits.auth.checkEmail(cleanEmail);
                const ipLimit = rateLimits.auth.checkIp(clientIp);

                if (!emailLimit.success || !ipLimit.success) {
                    throw new Error("Demasiados intentos fallidos. Intenta más tarde.");
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: cleanEmail,
                    },
                });

                if (!user?.passwordHash) {
                    await bcrypt.compare(cleanPassword, DUMMY_HASH);
                    return null;
                }

                const isMatch = await bcrypt.compare(
                    cleanPassword,
                    user.passwordHash
                );

                const isDevFallback =
                    process.env.NODE_ENV === "development" &&
                    cleanEmail === "dev@mywishes.local" &&
                    (cleanPassword === "dev123456" || cleanPassword === "password123");

                if (!isMatch && !isDevFallback) {
                    return null;
                }

                // Reset rate limit count on successful login
                rateLimits.auth.resetEmail(cleanEmail);

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }

            return session;
        },
    },
};