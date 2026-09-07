'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface Options {
  active: boolean
  cameraOn: boolean
  micOn: boolean
}

export function useWebcam({ active, cameraOn, micOn }: Options) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [status, setStatus] = useState<'idle' | 'requesting' | 'ready' | 'denied'>(
    'idle',
  )

  const attach = useCallback((el: HTMLVideoElement | null) => {
    videoRef.current = el
    if (el && streamRef.current) {
      el.srcObject = streamRef.current
      el.play().catch(() => {})
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    async function start() {
      if (!active) return
      if (streamRef.current) return
      try {
        setStatus('requesting')
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720, facingMode: 'user' },
          audio: true,
        })
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play().catch(() => {})
        }
        setStatus('ready')
      } catch {
        if (!cancelled) setStatus('denied')
      }
    }
    start()
    return () => {
      cancelled = true
    }
  }, [active])

  // Tear down entirely when leaving the flow.
  useEffect(() => {
    if (active) return
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setStatus('idle')
  }, [active])

  useEffect(() => {
    const stream = streamRef.current
    if (!stream) return
    stream.getVideoTracks().forEach((t) => (t.enabled = cameraOn))
  }, [cameraOn, status])

  useEffect(() => {
    const stream = streamRef.current
    if (!stream) return
    stream.getAudioTracks().forEach((t) => (t.enabled = micOn))
  }, [micOn, status])

  return { attach, status }
}
