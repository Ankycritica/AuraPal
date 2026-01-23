// Simple in-memory model for demo; replace with MongoDB in production
const users = new Map()

class User {
  constructor(data) {
    this.id = data.id || Date.now().toString()
    this.email = data.email
    this.displayName = data.displayName
    this.avatarUrl = data.avatarUrl
    this.guestName = data.guestName
    this.age = data.age
    this.gender = data.gender
    this.country = data.country
    this.providers = data.providers || []
    this.createdAt = new Date()
    this.updatedAt = new Date()
    users.set(this.id, this)
  }

  static findOne(query) {
    for (const user of users.values()) {
      if (query.email && user.email === query.email) return user
      if (query['providers.provider'] && query['providers.providerId']) {
        const provider = user.providers.find(p => p.provider === query['providers.provider'] && p.providerId === query['providers.providerId'])
        if (provider) return user
      }
    }
    return null
  }

  save() {
    this.updatedAt = new Date()
    users.set(this.id, this)
  }
}

export default User