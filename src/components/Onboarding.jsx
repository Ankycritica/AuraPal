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
            <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-cyan-400">
              Start Chat
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}