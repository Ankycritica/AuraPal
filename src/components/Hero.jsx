import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { Shield, MessageSquare, Heart } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-white py-20 px-4 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            AuraPal — Privacy-first community for real connection.
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl">
            Encrypted conversations, mindful matches, zero data mining.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg" className="text-base">
              <Link to="/signup">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base">
              <Link to="/features">See Features</Link>
            </Button>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-primary-100 p-4">
              <Shield className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Privacy First</h3>
            <p className="mt-2 text-sm text-gray-600">
              Your data stays yours. No tracking, no mining, no exploitation.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-primary-100 p-4">
              <MessageSquare className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Encrypted Messages</h3>
            <p className="mt-2 text-sm text-gray-600">
              End-to-end encrypted conversations for secure communication.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-primary-100 p-4">
              <Heart className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Mindful Matches</h3>
            <p className="mt-2 text-sm text-gray-600">
              Connect based on shared interests and values, not algorithms.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

