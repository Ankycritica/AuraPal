import type { Metadata } from "next";
import { Inter, DM_Sans, Syne } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });

export const metadata: Metadata = {
  title: "AuraPal — AI Career & Growth Engine",
  description: "AuraPal is your AI-powered career engine. Build resumes, generate cover letters, and more.",
  openGraph: {
    title: "AuraPal — AI Career & Growth Engine",
    description: "Your AI-powered career engine.",
    url: "https://www.aurapal.org",
    siteName: "AuraPal",
    images: [
      {
        url: "https://www.aurapal.org/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AuraPal — AI Career & Growth Engine",
    description: "Your AI-powered career engine.",
    images: ["https://www.aurapal.org/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSans.variable} ${syne.variable}`}>
      <body className="bg-[#0A0F1E] text-white">
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
