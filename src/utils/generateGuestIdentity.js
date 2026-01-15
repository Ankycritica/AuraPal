const ADJECTIVES = ['Spry','Merry','Sly','Sunny','Quiet','Brave','Curious','Jolly']
const ANIMALS = ['Panda','Otter','Fox','Koala','Hummingbird','Badger','Seal','Pigeon']
const EMOJIS = ['🐼','🦦','🦊','🐨','🐦','🦡','🦭','🕊️']
const COUNTRIES = ['USA', 'Canada', 'UK', 'Australia', 'Germany', 'France', 'Japan', 'Brazil']

function pick(arr) { return arr[Math.floor(Math.random()*arr.length)] }

export function generateGuestIdentity() {
  const adj = pick(ADJECTIVES)
  const animal = pick(ANIMALS)
  const idx = Math.floor(Math.random()*EMOJIS.length)
  const country = pick(COUNTRIES)
  const id = `guest_${Date.now()}_${Math.floor(Math.random()*9000)}`
  return { id, name: `${adj} ${animal}`, avatar: EMOJIS[idx], avatarEmoji: EMOJIS[idx], country }
}

export default generateGuestIdentity
