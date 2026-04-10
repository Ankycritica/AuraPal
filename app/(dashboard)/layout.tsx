import { auth } from "@/auth"
import { Sidebar } from "@/components/sidebar"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen bg-[#0a0f1e]">
      <Sidebar user={session.user} />
      <main className="flex-1 lg:ml-[280px] min-h-screen">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8 w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
