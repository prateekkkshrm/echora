'use client'

import { useEffect, useState } from 'react'

export function useClock() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000 * 30)
    return () => clearInterval(id)
  }, [])

  const time = now
    ? now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : ''
  const date = now
    ? now.toLocaleDateString([], {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      })
    : ''

  return { time, date }
}
