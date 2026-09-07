'use client'

import { useRef, useState } from 'react'
import { Mic, MicOff, Video, VideoOff, Hand, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EchoraLogo } from './logo'
import { SelfVideo } from './self-video'
import { useSignLanguage } from '@/lib/echora/use-sign-language'
import { meetingLink } from '@/lib/echora/data'
import { cn } from '@/lib/utils'

export function GreenRoom({
  code,
  attach,
  webcamStatus,
  cameraOn,
  micOn,
  onToggleCamera,
  onToggleMic,
  onJoin,
  onBack,
}: {
  code: string
  attach: (el: HTMLVideoElement | null) => void
  webcamStatus: 'idle' | 'requesting' | 'ready' | 'denied'
  cameraOn: boolean
  micOn: boolean
  onToggleCamera: () => void
  onToggleMic: () => void
  onJoin: (name: string, signing: boolean) => void
  onBack: () => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [signing, setSigning] = useState(false)
  const [name, setName] = useState('You')
  const { status, gesture } = useSignLanguage({ canvasRef, enabled: signing })

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="flex items-center justify-between px-4 py-3 sm:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent"
            aria-label="Back to home"
          >
            <ChevronLeft className="size-5" />
          </button>
          <EchoraLogo />
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-5xl flex-1 items-center gap-8 px-4 pb-12 sm:px-8 lg:grid-cols-[1.3fr_1fr]">
        <div className="flex flex-col gap-4">
          <div className="relative aspect-video w-full rounded-2xl border border-meet-border bg-meet-bg shadow-lg">
            <SelfVideo
              attach={attach}
              canvasRef={canvasRef}
              cameraOn={cameraOn}
              showOverlay={signing}
              fallbackInitials="YO"
              className="size-full rounded-2xl"
            />

            {webcamStatus === 'denied' && (
              <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-meet-bg/80 px-6 text-center text-sm text-meet-muted">
                Camera access is blocked. Enable it in your browser to preview
                video.
              </div>
            )}

            {signing && (
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-center">
                <div className="flex items-center gap-2 rounded-full bg-meet-bg/85 px-4 py-2 text-sm text-meet-foreground backdrop-blur">
                  <Hand className="size-4 text-accent-teal" />
                  {status === 'loading' && 'Loading hand tracking…'}
                  {status === 'running' &&
                    (gesture ? (
                      <span>
                        <span className="font-semibold">{gesture.translation}</span>
                        <span className="ml-2 text-meet-muted">
                          {gesture.label}
                        </span>
                      </span>
                    ) : (
                      'Show a sign to the camera'
                    ))}
                  {status === 'error' && 'Hand tracking unavailable'}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-3">
            <ControlToggle
              active={micOn}
              onClick={onToggleMic}
              onIcon={<Mic className="size-5" />}
              offIcon={<MicOff className="size-5" />}
              label={micOn ? 'Turn off microphone' : 'Turn on microphone'}
            />
            <ControlToggle
              active={cameraOn}
              onClick={onToggleCamera}
              onIcon={<Video className="size-5" />}
              offIcon={<VideoOff className="size-5" />}
              label={cameraOn ? 'Turn off camera' : 'Turn on camera'}
            />
            <button
              type="button"
              onClick={() => setSigning((v) => !v)}
              aria-pressed={signing}
              className={cn(
                'flex h-12 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors',
                signing
                  ? 'border-transparent bg-accent-teal text-meet-bg'
                  : 'border-border bg-card text-foreground hover:bg-accent',
              )}
            >
              <Hand className="size-5" />
              Sign language
            </button>
          </div>
        </div>

        <div className="flex flex-col items-start gap-5 text-center lg:text-left">
          <div className="w-full">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Ready to join?
            </h1>
            <p className="mt-1 font-mono text-sm text-muted-foreground">
              {meetingLink(code)}
            </p>
          </div>
          <label className="flex w-full flex-col gap-1.5 text-left text-sm font-medium text-foreground">
            Your name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter your name"
            />
          </label>
          <Button
            size="lg"
            className="h-12 w-full bg-brand text-base text-brand-foreground hover:bg-brand/90"
            onClick={() => onJoin(name.trim() || 'You', signing)}
          >
            Join now
          </Button>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Joining with sign language on shares your gesture captions with the
            room. You can toggle it anytime during the call.
          </p>
        </div>
      </div>
    </div>
  )
}

function ControlToggle({
  active,
  onClick,
  onIcon,
  offIcon,
  label,
}: {
  active: boolean
  onClick: () => void
  onIcon: React.ReactNode
  offIcon: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={cn(
        'flex size-12 items-center justify-center rounded-full border transition-colors',
        active
          ? 'border-border bg-card text-foreground hover:bg-accent'
          : 'border-transparent bg-destructive text-primary-foreground hover:bg-destructive/90',
      )}
    >
      {active ? onIcon : offIcon}
    </button>
  )
}
