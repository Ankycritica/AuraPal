import { io } from 'socket.io-client'

const socket = io(process.env.NODE_ENV === 'production' ? 'https://aurapal.vercel.app' : 'http://localhost:3000')

export { socket }