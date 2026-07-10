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
  metadataBase: new URL("https://mywishes.space"),

  title: {
    default: "MyWishes | Crea y comparte listas de regalos",
    template: "%s | MyWishes",
  },

  description:
    "Crea listas de regalos para cumpleaños, Navidad, matrimonios y baby showers. Comparte un enlace con familiares y amigos y evita regalos repetidos.",

  keywords: [
    "lista de regalos",
    "lista de deseos",
    "crear lista de regalos",
    "lista de regalos online",
    "lista de cumpleaños",
    "lista para baby shower",
    "lista de matrimonio",
    "lista de navidad",
  ],

  icons: {
    icon: "/icon.svg",
  },
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