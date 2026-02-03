'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import confetti from 'canvas-confetti'

export default function Home() {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [lastAction, setLastAction] = useState<'start' | 'stop' | 'reset' | 'asleep' | 'idle'>('idle')
  const [messageKey, setMessageKey] = useState(0)
  const [inspirationalMessage, setInspirationalMessage] = useState('Sleep training is one of the hardest things parents do. You\'re not alone. 🤗')
  const [isLoadingMessage, setIsLoadingMessage] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const lastGeneratedContext = useRef<string>('')
  const lastPeriodicMessageTime = useRef<number>(0)

  // Generate inspirational message from OpenAI
  const generateMessage = useCallback(async (action: string, currentTime: number, running: boolean) => {
    // Create a unique context key to avoid regenerating for the same situation
    const contextKey = `${action}-${running}-${Math.floor(currentTime / 30)}`
    
    // Skip if we just generated for this context (unless it's a new action)
    if (contextKey === lastGeneratedContext.current && action !== 'start' && action !== 'stop' && action !== 'reset') {
      return
    }

    lastGeneratedContext.current = contextKey
    setIsLoadingMessage(true)

    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          time: currentTime,
          isRunning: running,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate message')
      }

      const data = await response.json()
      if (data.message) {
        setInspirationalMessage(data.message)
      }
    } catch (error) {
      console.error('Error generating message:', error)
      // Fallback messages if API fails
      const fallbackMessages = [
        "You're doing your best, and that's exactly what your baby needs. ❤️",
        "Sleep training is hard. You're showing up anyway. That's strength. 💪",
        "Every moment you track is progress. Keep going! 🌟",
      ]
      setInspirationalMessage(fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)])
    } finally {
      setIsLoadingMessage(false)
    }
  }, [])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning])

  // Generate initial message on mount
  useEffect(() => {
    generateMessage('idle', 0, false)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Generate message when action changes (only when action actually changes, not on every time update)
  useEffect(() => {
    if (lastAction !== 'idle') {
      generateMessage(lastAction, time, isRunning)
      // Reset periodic message time when action changes
      lastPeriodicMessageTime.current = 0
    }
  }, [lastAction, generateMessage, isRunning]) // Removed 'time' from dependencies

  // Periodically update message while timer is running (every 30 seconds)
  useEffect(() => {
    if (isRunning && time > 0) {
      const currentInterval = Math.floor(time / 30)
      const lastInterval = Math.floor(lastPeriodicMessageTime.current / 30)
      
      // Only generate if we've moved to a new 30-second interval
      if (currentInterval > lastInterval && currentInterval > 0) {
        lastPeriodicMessageTime.current = time
        generateMessage('running', time, isRunning)
      }
    }
  }, [time, isRunning, generateMessage])

  const startTimer = () => {
    setIsRunning(true)
    setLastAction('start')
    setMessageKey(prev => prev + 1)
  }

  const stopTimer = () => {
    setIsRunning(false)
    setLastAction('stop')
    setMessageKey(prev => prev + 1)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTime(0)
    setLastAction('reset')
    setMessageKey(prev => prev + 1)
    lastGeneratedContext.current = '' // Reset context to allow new message
    lastPeriodicMessageTime.current = 0 // Reset periodic message tracking
  }

  const handleBabyAsleep = () => {
    // Trigger celebratory confetti
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: ReturnType<typeof setInterval> = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      
      // Confetti from left
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
      
      // Confetti from right
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    }, 250)

    // Also pause the timer if it's running
    if (isRunning) {
      setIsRunning(false)
    }
    
    setLastAction('asleep')
    setMessageKey(prev => prev + 1)
    lastGeneratedContext.current = '' // Reset context to allow new message
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <main className="min-h-screen flex flex-col lg:flex-row items-center justify-center px-4 py-8 gap-8">
      {/* Left Side - Timer Section */}
      <div className="flex flex-col items-center w-full lg:w-auto">
        <div className="text-center mb-8 lg:mb-0">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            🌙 Baby Sleep Trainer 🌙
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Track those precious sleep moments! Every second counts when baby is catching those Z's 💤
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-md">
          <div className="text-center">
            {/* Timer Display */}
            <div className="mb-8">
              <div className="text-6xl md:text-8xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 mb-4">
                {formatTime(time)}
              </div>
              <p className="text-gray-500 text-sm md:text-base">
                {isRunning ? '⏱️ Timer is running...' : '😴 Timer paused'}
              </p>
            </div>

            {/* Control Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isRunning ? (
                <button
                  onClick={startTimer}
                  className="px-8 py-4 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <span>▶️</span>
                  <span>Start</span>
                </button>
              ) : (
                <button
                  onClick={stopTimer}
                  className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <span>⏸️</span>
                  <span>Pause</span>
                </button>
              )}
              
              <button
                onClick={resetTimer}
                className="px-8 py-4 bg-gradient-to-r from-red-400 to-red-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>🔄</span>
                <span>Reset</span>
              </button>
            </div>

            {/* Celebratory Button */}
            <div className="mt-6">
              <button
                onClick={handleBabyAsleep}
                className="w-full px-8 py-5 text-white rounded-full font-bold text-xl md:text-2xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(45deg, #fbbf24, #ec4899, #a855f7, #fbbf24)',
                  backgroundSize: '300% 300%',
                  animation: 'gradient 3s ease infinite',
                }}
              >
                <span className="text-3xl animate-bounce">🎉</span>
                <span className="relative z-10">My Baby Is Asleep!</span>
                <span className="text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>✨</span>
              </button>
            </div>
          </div>
        </div>

        {/* Fun Footer Messages */}
        <div className="mt-8 text-center lg:hidden">
          <p className="text-gray-600 text-sm md:text-base">
            {time === 0 && 'Ready to start tracking? 🚀'}
            {time > 0 && time < 60 && 'Great start! Keep it going! ⭐'}
            {time >= 60 && time < 300 && 'Amazing! Baby is getting some rest! 😊'}
            {time >= 300 && time < 1800 && 'Wow! That\'s a solid nap! 🌟'}
            {time >= 1800 && 'Incredible! Baby is sleeping like a champ! 🏆'}
          </p>
        </div>
      </div>

      {/* Right Side - Inspirational Messages */}
      <div className="w-full lg:w-96 lg:max-w-md">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 h-full">
          <div className="mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              💝 You've Got This
            </h2>
            <p className="text-sm text-gray-500">
              A little encouragement for your journey
            </p>
          </div>
          
          <div 
            key={messageKey}
            className="mt-6 p-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl border-2 border-pink-200 min-h-[120px] flex items-center"
          >
            {isLoadingMessage ? (
              <div className="w-full flex items-center justify-center">
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-pink-500"></div>
                  <span className="text-sm">Generating encouragement...</span>
                </div>
              </div>
            ) : (
              <p className="text-base md:text-lg text-gray-700 leading-relaxed font-medium">
                {inspirationalMessage}
              </p>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              {isRunning 
                ? "Keep going! You're doing amazing work. 🌟"
                : "Take your time. There's no rush. 🕐"
              }
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none overflow-hidden z-0">
        <div className="text-6xl md:text-8xl opacity-20 text-center">
          <span className="animate-bounce inline-block" style={{ animationDelay: '0s' }}>🌙</span>
          <span className="animate-bounce inline-block mx-4" style={{ animationDelay: '0.2s' }}>⭐</span>
          <span className="animate-bounce inline-block" style={{ animationDelay: '0.4s' }}>💤</span>
        </div>
      </div>
    </main>
  )
}
