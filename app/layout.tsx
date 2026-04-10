import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "react-hot-toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "AuraPal — Premium AI Resume Builder & Career Growth Tools",
    template: "%s | AuraPal"
  },
  description:
    "AuraPal provides a suite of premium AI-powered career tools: free resume builder, cover letter generator, LinkedIn optimizer, ATS resume fixer, interview prep, and business plan generation.",
  keywords: [
    "AI Resume Builder Free",
    "ATS Resume Fixer",
    "AI Career Tools",
    "LinkedIn Profile Optimizer",
    "Cover Letter Generator AI",
    "Roast My Resume",
    "Side Hustle Generator",
    "Startup Business Plan Builder"
  ],
  authors: [{ name: "AuraPal" }],
  creator: "AuraPal",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.aurapal.org",
    title: "AuraPal — Premium AI Resume Builder & Career Growth Tools",
    description: "Fix your resume in 30 seconds with AuraPal's AI career platform.",
    siteName: "AuraPal",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={
          inter.className + " bg-[#0a0f1e] text-white min-h-screen antialiased"
        }
      >
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#1e293b",
              color: "#fff",
              border: "1px solid #334155",
            },
          }}
        />
      </body>
    </html>
  )
}
