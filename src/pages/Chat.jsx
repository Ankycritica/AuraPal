import Sidebar from '../components/Sidebar'
import StartChat from '../components/StartChat'

export default function Chat() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <Sidebar />
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <StartChat />
      </main>
    </div>
  )
}
