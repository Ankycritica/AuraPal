import Sidebar from '../components/Sidebar'
import StartChat from '../components/StartChat'

export default function Chat() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-950 via-slate-900 to-cyan-950">
      <Sidebar />
      <main className="flex-1 lg:ml-72">
        <StartChat />
      </main>
    </div>
  )
}
