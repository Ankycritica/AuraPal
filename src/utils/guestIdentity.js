const adjectives = ['Spry', 'Merry', 'Sly', 'Sunny', 'Quiet', 'Brave', 'Curious', 'Jolly']
const animals = ['Panda', 'Otter', 'Fox', 'Koala', 'Hummingbird', 'Badger', 'Seal', 'Pigeon']
const emojis = ['🐼', '🦦', '🦊', '🐨', '🐦', '🦡', '🦭', '🕊️']

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function generateGuestIdentity() {
  const adj = pick(adjectives)
  const animal = pick(animals)
  const emoji = pick(emojis)
  const number = Math.floor(Math.random() * 100) + 10 // 10-99
  const name = `${adj}${animal}${number}`
  return { name, avatar: emoji }
}