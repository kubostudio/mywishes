import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";

const fontSans = Quicksand({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MyWishes",
  description: "Lista de regalos para un evento especial.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={fontSans.variable}>
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}