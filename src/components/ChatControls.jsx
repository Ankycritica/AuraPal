import React from 'react'

export function ChatControls({ onNext, onExit, onAddFriend, disabledNext }) {
  const reduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return (
    <div className="flex items-center gap-2">
      <button
        aria-label="Next stranger"
        onClick={onNext}
        className="px-3 py-1 rounded bg-transparent border"
        style={{ borderColor: 'var(--border)', color: 'var(--ap-accent)' }}
        disabled={disabledNext}
      >
        Next
      </button>

      <button
        aria-label="Exit chat"
        onClick={onExit}
        className="px-3 py-1 rounded"
        style={{ background: 'transparent', color: 'var(--muted)' }}
      >
        Exit
      </button>

      <button
        aria-label="Add friend"
        onClick={onAddFriend}
        className="px-3 py-1 rounded"
        style={{ background: 'var(--ap-accent)', color: 'var(--on-brand)' }}
      >
        Add Friend
      </button>

      <style>{`@media (prefers-reduced-motion: reduce) { button { transition: none !important } }`}</style>
    </div>
  )
}

export default ChatControls
