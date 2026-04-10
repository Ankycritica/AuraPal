import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "react-hot-toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AuraPal — AI Career & Growth Engine",
  description:
    "AI-powered career tools: resume builder, cover letter " +
    "generator, interview prep, LinkedIn optimizer, and " +
    "more.",
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
