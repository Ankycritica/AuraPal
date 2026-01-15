export async function createGuest() {
  const res = await fetch('/api/guest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!res.ok) {
    throw new Error('Failed to create guest session')
  }

  const data = await res.json()
  localStorage.setItem('aurapal-guest-token', data.token)
  localStorage.setItem('aurapal-guest-displayName', data.displayName)
  return data
}


