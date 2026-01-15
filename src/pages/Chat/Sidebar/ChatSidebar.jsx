import React from 'react'
import GuestBadge from '../../../components/GuestBadge'
import ChatControls from '../../../components/ChatControls'

export default function ChatSidebar({ guest, connected, onNext, onExit, onAddFriend, isAuthenticated, activeTab, setActiveTab }) {
  return (
    <aside className="w-72 border-r p-4 bg-gray-800 border-gray-700 hidden lg:block">
      <h3 className="font-semibold text-white mb-4">Chat</h3>

      <GuestBadge identity={guest} />

      <div className="mt-6 flex space-x-2">
        <button
          onClick={() => setActiveTab && setActiveTab('random')}
          className={`flex-1 px-3 py-2 rounded text-sm text-left ${activeTab === 'random' ? 'bg-gradient-to-r from-pink-500 to-orange-400/20 ring-1 ring-pink-500/30' : 'bg-transparent'}`}
        >
          Random
        </button>
        <button
          onClick={() => setActiveTab && setActiveTab('friends')}
          disabled={!isAuthenticated}
          className={`flex-1 px-3 py-2 rounded text-sm text-left ${activeTab === 'friends' ? 'bg-gradient-to-r from-pink-500 to-orange-400/20 ring-1 ring-pink-500/30' : 'bg-transparent'} ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Friends
        </button>
      </div>

      <div className="mt-6">
        <ChatControls onNext={onNext} onExit={onExit} onAddFriend={onAddFriend} disabledNext={!connected} />
      </div>
    </aside>
  )
}
