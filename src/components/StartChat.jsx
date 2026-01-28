import React, { useState, useEffect, useCallback } from 'react'
import SearchOverlay from './SearchOverlay'
import socketAPI from '../api/socket.js'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'

const TRENDING_TAGS = ['anime', 'gaming', 'music', 'fitness', 'movies', 'reading', 'coding', 'art', 'travel', 'cooking', 'photography', 'sports']

export default function StartChat({ onPaired }) {
  const [searching, setSearching] = useState(false)
  const [genderFilter, setGenderFilter] = useState('any')
  const [selectedInterests, setSelectedInterests] = useState([])
  const [customInterest, setCustomInterest] = useState('')
  const navigate = useNavigate()

  const identity = React.useMemo(
    () => JSON.parse(localStorage.getItem('ap-guest-identity') || '{}'),
    []
  )

  useEffect(() => {
    const saved = localStorage.getItem('ap-interests')
    if (saved) {
      try {
        setSelectedInterests(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load interests:', e)
      }
    }
    const savedGender = localStorage.getItem('ap-gender')
    if (savedGender) {
      setGenderFilter(savedGender)
    }
  }, [])

  useEffect(() => {
    if (!identity.guestName) {
      console.error('Identity missing, redirecting to onboarding')
      navigate('/onboarding')
      return
    }
    console.log('Loaded identity:', identity)
  }, [identity, navigate])

  // Handler to run when a paired event arrives
  const handlePairedEvent = useCallback(
    (data) => {
      console.log("Received paired event:", data);
      setSearching(false);
      if (onPaired) onPaired(data);
    },
    [onPaired]
  );

  // Setup socket listeners once when component mounts
  useEffect(() => {
    if (!identity.guestName) return;

    // Connect socket with identity (no-op if already connected)
    try {
      socketAPI.connect(identity);
    } catch (err) {
      console.warn("socketAPI.connect error:", err);
    }

    // Register paired listener
    const offPaired = socketAPI.on("paired", handlePairedEvent);

    // Optional: listen for disconnects or errors for UX
    const offDisconnect = socketAPI.on("disconnect", () => {
      console.warn("Socket disconnected");
      setSearching(false);
    });

    const offConnectError = socketAPI.on("connect_error", (err) => {
      console.warn("Socket connect_error", err);
      setSearching(false);
    });

    return () => {
      // cleanup listeners
      if (offPaired) offPaired();
      if (offDisconnect) offDisconnect();
      if (offConnectError) offConnectError();
    };
  }, [identity, handlePairedEvent]);

  const handleAddInterest = () => {
    if (customInterest.trim() && !selectedInterests.includes(customInterest.toLowerCase())) {
      const newInterests = [...selectedInterests, customInterest.toLowerCase()]
      setSelectedInterests(newInterests)
      localStorage.setItem('ap-interests', JSON.stringify(newInterests))
      setCustomInterest('')
    }
  }

  const handleRemoveInterest = (interest) => {
    const newInterests = selectedInterests.filter((i) => i !== interest)
    setSelectedInterests(newInterests)
    localStorage.setItem('ap-interests', JSON.stringify(newInterests))
  }

  const handleToggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      handleRemoveInterest(interest)
    } else {
      const newInterests = [...selectedInterests, interest]
      setSelectedInterests(newInterests)
      localStorage.setItem('ap-interests', JSON.stringify(newInterests))
    }
  }

  const handleGenderFilter = (gender) => {
    setGenderFilter(gender)
    localStorage.setItem('ap-gender', gender)
  }

  const handleStartChat = () => {
    console.log('Start Text Chat button clicked')
    if (!identity.guestName) {
      console.error('Identity missing, redirecting to onboarding')
      navigate('/onboarding')
      return
    }
    setSearching(true)
    try {
      const s = socketAPI.connect(identity)
      if (s && s.connected) {
        socketAPI.findRandom({
          ...identity,
          genderFilter,
          interests: selectedInterests,
          isPremium: localStorage.getItem('ap-premium') === 'true'
        })
        console.log('Emitting find_random with:', { genderFilter, interests: selectedInterests })
        return
      }
      if (s && typeof s.once === 'function') {
        s.once('connect', () => {
          console.log('Socket connected, emitting find_random')
          socketAPI.findRandom({
            ...identity,
            genderFilter,
            interests: selectedInterests,
            isPremium: localStorage.getItem('ap-premium') === 'true'
          })
        })
        setTimeout(() => {
          const current = socketAPI.getSocket && socketAPI.getSocket()
          if (!current || !current.connected) {
            console.error('Socket failed to connect after 5s timeout')
            setSearching(false)
          }
        }, 5000)
      }
    } catch (err) {
      console.error('Error starting chat:', err)
      setSearching(false)
    }
  }

  const handleStartVideo = () => {
    console.log('Start Video Chat button clicked')
    alert('Video chat coming soon!')
  }

  const handleSkip = () => {
    console.log('Skip clicked')
    try {
      socketAPI.skipRandom()
    } catch (err) {
      console.error('Error emitting skip_random:', err)
    }
  }

  const handleExit = () => {
    console.log('Exit clicked')
    setSearching(false)
    try {
      socketAPI.stopRandom()
    } catch (err) {
      console.error('Error emitting exit:', err)
    }
  }

  if (searching) {
    return <SearchOverlay onSkip={handleSkip} onExit={handleExit} />
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            Ready to Connect?
          </h1>
          <p className="text-purple-200/70 text-base sm:text-lg">Find meaningful conversations with people worldwide</p>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-purple-200">Chat with:</label>
          <div className="flex gap-3 flex-wrap justify-center">
            {['male', 'female', 'any'].map((gender) => (
              <button
                key={gender}
                onClick={() => handleGenderFilter(gender)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 transform ${
                  genderFilter === gender
                    ? 'bg-gradient-to-r from-purple-500 to-cyan-400 text-white shadow-lg scale-110'
                    : 'bg-purple-500/10 border border-purple-500/30 text-purple-200 hover:border-purple-500/60 hover:bg-purple-500/15 hover:scale-105'
                }`}
              >
                {gender === 'any' ? 'Everyone' : gender.charAt(0).toUpperCase() + gender.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-semibold text-purple-200">Interests (optional):</label>
          <div className="space-y-3">
            <div className="space-y-2">
              <p className="text-xs text-purple-300/60 text-center">Trending:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {TRENDING_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleToggleInterest(tag)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 transform ${
                      selectedInterests.includes(tag)
                        ? 'bg-gradient-to-r from-purple-500 to-cyan-400 text-white shadow-md scale-110'
                        : 'bg-purple-500/10 border border-purple-500/30 text-purple-200 hover:border-purple-500/60 hover:bg-purple-500/15 hover:scale-105'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                onKeyPress={(e) => { if (e.key === 'Enter') { handleAddInterest() } }}
                placeholder="Add custom interest..."
                className="flex-1 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-200 placeholder-purple-400/50 focus:outline-none focus:border-purple-500/60 focus:bg-purple-500/15 transition-all"
              />
              <button
                onClick={handleAddInterest}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-400 hover:from-purple-600 hover:to-cyan-500 text-white font-medium rounded-lg transition-all hover:scale-105 active:scale-95"
              >
                Add
              </button>
            </div>
            {selectedInterests.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 justify-center">
                {selectedInterests.map((interest) => (
                  <div key={interest} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500/40 to-cyan-400/40 border border-purple-400/50 text-sm text-purple-100">
                    <span>{interest}</span>
                    <button onClick={() => handleRemoveInterest(interest)} className="hover:text-purple-300 transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
          <button
            onClick={handleStartChat}
            className="flex-1 sm:flex-initial px-8 py-4 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-105 active:scale-95"
          >
            💬 Start Text Chat
          </button>
          <button
            onClick={handleStartVideo}
            className="flex-1 sm:flex-initial px-8 py-4 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-orange-500/50 transition-all hover:scale-105 active:scale-95 opacity-75 cursor-not-allowed"
            disabled
          >
            🎥 Start Video Chat
          </button>
        </div>

        <div className="text-center text-sm text-purple-300/70 bg-purple-500/5 border border-purple-500/20 rounded-lg p-4 mx-auto max-w-lg">
          ✨ <strong>Be respectful</strong> and follow our{' '}
          <a href="/safety" className="text-purple-300 hover:text-purple-200 underline">
            chat rules
          </a>
          . Report any inappropriate behavior.
        </div>
      </div>
    </div>
  )
}
