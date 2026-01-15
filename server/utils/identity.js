// server/utils/identity.js
// Generate playful guest identities with initials and simple SVG avatar data URL

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function initialsFromName(name) {
  if (!name) return 'G'
  const parts = name.replace(/[^A-Za-z0-9 ]/g, ' ').trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

function stringToColor(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
    hash = hash & hash
  }
  const hue = Math.abs(hash) % 360
  return `hsl(${hue} 70% 50%)`
}

function generateAvatarDataUrl(name) {
  const initials = initialsFromName(name)
  const bg = stringToColor(name)
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 128 128'>
    <rect width='100%' height='100%' fill='${bg}' rx='24' />
    <text x='50%' y='60%' text-anchor='middle' font-family='Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial' font-size='48' fill='#fff' font-weight='700'>${initials}</text>
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export function generateGuestIdentity() {
  const ADJ = ['Curious', 'Witty', 'Playful', 'Clever', 'Gentle', 'Breezy', 'Mellow', 'Sunny']
  const NOUN = ['Koala', 'Falcon', 'Otter', 'Panda', 'Fox', 'Hummingbird', 'Heron', 'Kite']
  const name = `${rand(ADJ)} ${rand(NOUN)} 🐨`
  const id = `guest-${Date.now()}-${Math.floor(Math.random() * 9999)}`
  const initials = initialsFromName(name)
  const avatar = generateAvatarDataUrl(name)
  return { id, name, initials, avatar }
}
