'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  classifyGesture,
  HAND_CONNECTIONS,
  type GestureResult,
  type Landmark,
} from './gestures'

declare global {
  interface Window {
    Hands?: any
    Camera?: any
  }
}

const HANDS_SRC = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/hands.js'
const CAMERA_SRC =
  'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.3/camera_utils.js'

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(
      `script[src="${src}"]`,
    ) as HTMLScriptElement | null
    if (existing) {
      if (existing.getAttribute('data-loaded') === 'true') return resolve()
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error(`Failed ${src}`)))
      return
    }
    const s = document.createElement('script')
    s.src = src
    s.crossOrigin = 'anonymous'
    s.async = true
    s.addEventListener('load', () => {
      s.setAttribute('data-loaded', 'true')
      resolve()
    })
    s.addEventListener('error', () => reject(new Error(`Failed ${src}`)))
    document.head.appendChild(s)
  })
}

interface Options {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  enabled: boolean
}

interface State {
  status: 'idle' | 'loading' | 'running' | 'error'
  gesture: GestureResult | null
  error: string | null
}

export function useSignLanguage({ canvasRef, enabled }: Options): State {
  const [status, setStatus] = useState<State['status']>('idle')
  const [gesture, setGesture] = useState<GestureResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handsRef = useRef<any>(null)
  const cameraRef = useRef<any>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const stableRef = useRef<{ label: string | null; count: number }>({
    label: null,
    count: 0,
  })

  const draw = useCallback(
    (landmarks: Landmark[][] | undefined) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      if (canvas.width !== 640) canvas.width = 640
      if (canvas.height !== 480) canvas.height = 480

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (!landmarks?.length) return

      // Mirror to match the mirrored self-view.
      ctx.save()
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)

      for (const hand of landmarks) {
        ctx.strokeStyle = 'rgba(96, 165, 250, 0.95)'
        ctx.lineWidth = 4
        for (const [a, b] of HAND_CONNECTIONS) {
          ctx.beginPath()
          ctx.moveTo(hand[a].x * canvas.width, hand[a].y * canvas.height)
          ctx.lineTo(hand[b].x * canvas.width, hand[b].y * canvas.height)
          ctx.stroke()
        }
        for (const p of hand) {
          ctx.beginPath()
          ctx.fillStyle = 'rgba(45, 212, 191, 0.95)'
          ctx.arc(p.x * canvas.width, p.y * canvas.height, 5, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      ctx.restore()
    },
    [canvasRef],
  )

  const onResults = useCallback(
    (results: any) => {
      const landmarks: Landmark[][] | undefined = results?.multiHandLandmarks
      draw(landmarks)

      const next = classifyGesture(landmarks?.[0])
      const label = next?.label ?? null
      const stable = stableRef.current
      if (label === stable.label) {
        stable.count += 1
      } else {
        stable.label = label
        stable.count = 1
      }
      if (stable.count === 3) {
        setGesture(next)
      }
    },
    [draw],
  )

  useEffect(() => {
    let cancelled = false

    async function start() {
      if (!enabled) return
      try {
        setStatus('loading')
        setError(null)
        await loadScript(HANDS_SRC)
        await loadScript(CAMERA_SRC)
        if (cancelled) return
        if (!window.Hands || !window.Camera) {
          throw new Error('MediaPipe failed to load')
        }

        const video = document.createElement('video')
        video.playsInline = true
        video.muted = true
        video.style.display = 'none'
        document.body.appendChild(video)
        videoRef.current = video

        const hands = new window.Hands({
          locateFile: (file: string) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/${file}`,
        })
        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.6,
          minTrackingConfidence: 0.6,
        })
        hands.onResults(onResults)
        handsRef.current = hands

        const camera = new window.Camera(video, {
          onFrame: async () => {
            if (handsRef.current && video.readyState >= 2) {
              await handsRef.current.send({ image: video })
            }
          },
          width: 640,
          height: 480,
        })
        await camera.start()
        cameraRef.current = camera
        if (!cancelled) setStatus('running')
      } catch (e) {
        if (!cancelled) {
          setStatus('error')
          setError(e instanceof Error ? e.message : 'Camera unavailable')
        }
      }
    }

    start()

    return () => {
      cancelled = true
      try {
        cameraRef.current?.stop?.()
      } catch {}
      try {
        handsRef.current?.close?.()
      } catch {}
      const v = videoRef.current
      if (v) {
        const stream = v.srcObject as MediaStream | null
        stream?.getTracks().forEach((t) => t.stop())
        v.remove()
      }
      cameraRef.current = null
      handsRef.current = null
      videoRef.current = null
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
      stableRef.current = { label: null, count: 0 }
      setGesture(null)
      setStatus('idle')
    }
  }, [enabled, onResults, canvasRef])

  return { status, gesture, error }
}
