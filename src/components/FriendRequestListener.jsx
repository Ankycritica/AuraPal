import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore, useFriendStore } from '../store/useStore'
import * as socketApi from '../api/socket'

export default function FriendRequestListener() {
    const { isAuthenticated, isGuest } = useAuthStore()
    const incoming = useFriendStore((s) => s.incoming)
    const addIncoming = useFriendStore((s) => s.addIncoming)
    const removeIncoming = useFriendStore((s) => s.removeIncoming)
    const addFriend = useFriendStore((s) => s.addFriend)

    useEffect(() => {
        if (!isAuthenticated || isGuest) return

        // Ensure socket is connected for auth users to receive requests globally
        const identity = JSON.parse(localStorage.getItem('ap-guest-identity') || '{}')
        const s = socketApi.connect(identity)

        const onFriendRequest = ({ fromMeta }) => {
            console.log('[Friend] Received friend request from', fromMeta)
            addIncoming({
                requestId: `req_${Date.now()}_${fromMeta.id}`,
                fromUserId: fromMeta.id,
                fromName: fromMeta.displayName,
                fromAvatar: fromMeta.avatar
            })
        }

        const onFriendAdded = (friendMeta) => {
            console.log('[Friend] Friend added:', friendMeta)
            addFriend(friendMeta)
        }

        const onFriendDeclined = () => {
            // Optional: show a toast that it was declined, or just silently ignore
        }

        s.on('friend_request', onFriendRequest)
        s.on('friend_added', onFriendAdded)
        s.on('friend_declined', onFriendDeclined)

        return () => {
            s.off('friend_request', onFriendRequest)
            s.off('friend_added', onFriendAdded)
            s.off('friend_declined', onFriendDeclined)
        }
    }, [isAuthenticated, isGuest, addIncoming, addFriend])

    const handleAccept = (req) => {
        const s = socketApi.getSocket()
        if (s) {
            s.emit('friend_request_accept', { fromUserId: req.fromUserId })
            // Add locally immediately or wait for friend_added? Wait for server friend_added event is better.
        }
        removeIncoming(req.requestId)
    }

    const handleDecline = (req) => {
        const s = socketApi.getSocket()
        if (s) {
            s.emit('friend_request_decline', { fromUserId: req.fromUserId })
        }
        removeIncoming(req.requestId)
    }

    // Render floating stack of requests in the bottom right
    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3">
            <AnimatePresence>
                {incoming.map((req) => (
                    <motion.div
                        key={req.requestId}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        className="w-80 bg-zinc-900 border border-emerald-500/30 shadow-2xl rounded-2xl p-4 flex flex-col gap-3"
                    >
                        <div className="flex items-start gap-3">
                            {req.fromAvatar ? (
                                <img src={req.fromAvatar} alt={req.fromName} className="w-10 h-10 rounded-full" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl">
                                    {req.fromName?.[0] || '?'}
                                </div>
                            )}
                            <div className="flex-1 min-w-0 pt-0.5">
                                <p className="text-sm font-semibold text-white truncate">{req.fromName}</p>
                                <p className="text-xs text-zinc-400">wants to add you as a friend</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleAccept(req)}
                                className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors"
                            >
                                Accept
                            </button>
                            <button
                                onClick={() => handleDecline(req)}
                                className="flex-1 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium border border-zinc-700 rounded-lg transition-colors"
                            >
                                Decline
                            </button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}
