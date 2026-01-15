// src/pages/ChatTest.jsx
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

export default function ChatTest() {
  const [logs, setLogs] = useState([])

  useEffect(() => {
    const socket = io('http://localhost:3001', {
      transports: ['websocket'],
      path: '/socket.io',
      autoConnect: true
    })

    socket.on('connect', () => setLogs(l => [...l, `connected ${socket.id}`]))
    socket.on('connect_error', (err) => setLogs(l => [...l, `connect_error: ${err.message}`]))
    socket.on('paired', (data) => setLogs(l => [...l, `paired: ${JSON.stringify(data)}`]))
    socket.on('chat_message', (m) => setLogs(l => [...l, `chat_message: ${JSON.stringify(m)}`]))

    socket.on('disconnect', (reason) => setLogs(l => [...l, `disconnected: ${reason}`]))

    // test emits after connect
    socket.on('connect', () => {
      socket.emit('find_random', (ack) => setLogs(l => [...l, `find_random ack: ${JSON.stringify(ack)}`]))
      socket.emit('chat_message', { room: null, text: 'hello from test client' })
    })

    return () => socket.disconnect()
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h2>Socket Test</h2>
      <div style={{ whiteSpace: 'pre-wrap', background: '#0f172a', color: '#e6eef8', padding: 12, borderRadius: 6 }}>
        {logs.length ? logs.join('\n') : 'Waiting for socket events...'}
      </div>
    </div>
  )
}