import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Select } from './ui/select'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import SocialButtons from './SocialButtons'
import { generateGuestIdentity } from '../utils/guestIdentity'
import { getCountry } from '../utils/geolocation'

export default function Onboarding({ onComplete }) {
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [country, setCountry] = useState('')
  const [guestIdentity, setGuestIdentity] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const detectedCountry = await getCountry()
      setCountry(detectedCountry)
      const identity = generateGuestIdentity()
      setGuestIdentity(identity)
      setLoading(false)
    }
    init()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!age || !gender) return
    console.log('Start Chat clicked, submitting onboarding data')
    const onboardingData = {
      age: parseInt(age),
      gender,
      country,
      guestName: guestIdentity.name,
      avatar: guestIdentity.avatar,
      createdAt: new Date().toISOString()
    }
    localStorage.setItem('ap-guest-identity', JSON.stringify(onboardingData))
    localStorage.setItem('ap-anonymous-onboarded', 'true')
    onComplete(onboardingData)
  }

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Welcome to AuraPal</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Age</label>
              <Input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="13"
                max="120"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <Select 
                options={[
                  { value: 'Male', label: 'Male' },
                  { value: 'Female', label: 'Female' },
                  { value: 'Other', label: 'Other' }
                ]}
                value={gender}
                onChange={setGender}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <Input value={country} readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Your Guest Name</label>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{guestIdentity.avatar}</span>
                <Input value={guestIdentity.name} readOnly />
              </div>
              <p className="text-xs text-gray-500 mt-1">You can change this after signing in.</p>
            </div>
            <div className="space-y-2">
              <SocialButtons guestIdentity={guestIdentity} />
            </div>
            <div className="flex flex-col items-center gap-2 mt-4">
              <p className="text-xs text-gray-500">Support AuraPal</p>
              <div className="flex gap-2">
                <a
                  href="https://paypal.me/AnkitD538"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Donate via PayPal"
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border hover:bg-white hover:bg-opacity-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-start)] transition-colors"
                  style={{
                    color: 'var(--text)',
                    borderColor: 'var(--brand-start)',
                    background: 'rgba(255,255,255,0.05)'
                  }}
                >
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.622 1.566 1.035.974 1.481 2.408 1.34 3.948-.173 1.92-.754 3.337-1.622 4.366-.912 1.084-2.262 1.698-4.003 1.698h-3.711l.614 3.632c.062.375.497.564.852.283l.95-.779s-.059-.087-.059-.087c.881-.661 1.52-1.74 1.682-3.027.511-4.056-.003-6.634-4.22-6.634h-1.827l-1.52 9.055h1.92c2.587 0 4.63.58 5.927 1.715 1.286 1.126 1.782 2.88 1.496 4.797-.336 2.254-1.52 3.91-3.237 4.666-1.72.756-3.953.67-6.15-.24-1.64-.679-2.853-1.925-3.568-3.552-.66-1.5-.864-3.215-.498-4.907l.197-1.084h-1.827l-.46 2.726zm6.482-9.828h3.733c.904 0 1.592-.078 2.15-.233.562-.157.95-.396 1.167-.717.215-.321.301-.708.254-1.16-.09-.825-.531-1.458-1.324-1.8-.793-.342-1.858-.393-3.106-.14-.928.187-1.822.683-2.511 1.382-.688.7-1.07 1.603-1.07 2.509 0 .9.382 1.8 1.07 2.509.689.699 1.583 1.195 2.511 1.382 1.248.253 2.313.202 3.106-.14.793-.342 1.234-.975 1.324-1.8.047-.452-.039-.839-.254-1.16-.217-.321-.605-.56-1.167-.717-.558-.155-1.246-.233-2.15-.233h-3.733l.546-3.233zm-6.172 9.828h-1.827l.46-2.726c-.366 1.692-.162 3.407.498 4.907.715 1.627 1.928 2.873 3.568 3.552 2.197.91 4.43.996 6.15.24 1.717-.756 2.901-2.412 3.237-4.666.286-1.917-.21-3.671-1.496-4.797-1.297-1.135-3.34-1.715-5.927-1.715h-1.92l1.52-9.055h1.827c4.217 0 4.731 2.578 4.22 6.634-.162 1.287-.801 2.366-1.682 3.027l.059.087-.95.779c-.355.281-.79.092-.852-.283l-.614-3.632h3.711c1.741 0 3.091-.614 4.003-1.698.868-1.029 1.449-2.446 1.622-4.366.141-1.54-.305-2.974-1.34-3.948C19.538.543 17.53 0 14.96 0H7.5c-.524 0-.972.382-1.054.901L2.837 20.597a.641.641 0 0 0 .633.74h4.606l.546-3.233z"/>
                  </svg>
                  PayPal
                </a>
                <a
                  href="https://cash.app/$AuraAnky"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Donate via Cash App"
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border hover:bg-white hover:bg-opacity-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-start)] transition-colors"
                  style={{
                    color: 'var(--text)',
                    borderColor: 'var(--brand-end)',
                    background: 'rgba(255,255,255,0.05)'
                  }}
                >
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  Cash App
                </a>
              </div>
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-cyan-400">
              Start Chat
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}