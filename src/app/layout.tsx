import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BABAULT Nathan | Développeur Full-Stack",
  description: "Portfolio de Nathan BABAULT, Développeur Full-Stack spécialisé en solutions web et mobiles.",
  icons: {
    icon: '/favicon.png', // Chemin vers ton icône dans le dossier public
    shortcut: '/favicon.png',
    apple: '/apple-touch-icon.png', // Optionnel : pour les appareils iOS
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
