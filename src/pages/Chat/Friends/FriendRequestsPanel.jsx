import React from 'react'

export default function FriendRequestsPanel({ requests = [], onAccept, onDecline }) {
  return (
    <aside className="w-80 border-l p-4 bg-gray-800 border-gray-700 hidden lg:block">
      <h4 className="font-semibold text-white">Friend Requests</h4>

      <div className="mt-4 space-y-3">
        {requests.length === 0 && <div className="text-gray-400">No pending requests</div>}

        {requests.map((r) => (
          <div key={r.id} className="p-3 border border-gray-700 rounded-md bg-gray-900">
            <div className="font-medium text-white">{r.fromMeta?.name || r.fromId}</div>
            <div className="mt-2 flex gap-2">
              <button onClick={() => onAccept && onAccept(r)} className="px-3 py-1 rounded-md bg-gradient-to-r from-pink-500 to-orange-400 text-white">Accept</button>
              <button onClick={() => onDecline && onDecline(r)} className="px-3 py-1 rounded-md bg-transparent border border-gray-700 text-gray-300">Decline</button>
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}
