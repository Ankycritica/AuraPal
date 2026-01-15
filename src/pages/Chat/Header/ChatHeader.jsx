import React from 'react'

export default function ChatHeader({ peer, onAddFriend }) {
  return (
    <header className="border-b border-gray-700 p-4 bg-gray-800">
      <div className="h-1 w-full bg-gradient-to-r from-pink-500 to-orange-400 mb-3 rounded-sm" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="font-bold text-white">{peer ? peer.name : 'Lobby'}</div>
          <div className="text-xl">{peer ? peer.avatarEmoji : ''}</div>
          <div className="text-sm text-gray-300">{peer ? peer.country : ''}</div>
        </div>

        <div>
          <button
            onClick={onAddFriend}
            disabled={!peer}
            className="px-3 py-1 rounded-md bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow-md disabled:opacity-50"
          >
            Add Friend
          </button>
        </div>
      </div>
    </header>
  )
}
