import { useEffect } from 'react'
import { Home } from './Home'

const SEO_DATA = {
  '/omegle-alternative': {
    title: 'Best Omegle Alternative 2026 — Free Random Chat | AuraPal',
    description: 'Looking for an Omegle alternative? AuraPal offers free, anonymous text and video chat with strangers worldwide. Safe, moderated, and no signup required.',
  },
  '/random-chat': {
    title: 'Free Random Chat Online — Talk to Strangers | AuraPal',
    description: 'Start a random chat with strangers from around the world. AuraPal connects you instantly for anonymous text and video conversations. 100% free.',
  },
  '/anonymous-chat': {
    title: 'Anonymous Chat with Strangers — Private & Safe | AuraPal',
    description: 'Chat anonymously with people worldwide. No signup, no tracking. AuraPal provides the safest anonymous chat experience with AI moderation.',
  },
  '/chat-with-strangers': {
    title: 'Chat with Strangers Online — Meet New People | AuraPal',
    description: 'Chat with strangers online for free. AuraPal matches you with random people for text or video chat. Anonymous, safe, and fun.',
  },
  '/chat-platform': {
    title: 'Online Chat Platform — Global Conversations | AuraPal',
    description: 'AuraPal is a modern online chat platform for meaningful anonymous conversations. Interest matching, video chat, and global community.',
  },
}

export default function SEOLanding() {
  useEffect(() => {
    const path = window.location.pathname
    const seo = SEO_DATA[path]
    if (seo) {
      document.title = seo.title
      // Update meta description
      let metaDesc = document.querySelector('meta[name="description"]')
      if (metaDesc) {
        metaDesc.setAttribute('content', seo.description)
      }
    }
    window.scrollTo(0, 0)
  }, [])

  return <Home />
}
