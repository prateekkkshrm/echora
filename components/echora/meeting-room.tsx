'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { EchoraLogo } from './logo'
import { SelfVideo } from './self-video'
import { ParticipantTile } from './participant-tile'
import { CaptionsBar, type Caption } from './captions-bar'
import { ChatPanel } from './chat-panel'
import { PeoplePanel } from './people-panel'
import { SignsPanel } from './signs-panel'
import { MeetingControls, type PanelMode } from './meeting-controls'
import { useSignLanguage } from '@/lib/echora/use-sign-language'
import { useClock } from '@/lib/echora/use-clock'
import { SIMULATED_PARTICIPANTS, CHAT_SEED, AVATAR_COLORS } from '@/lib/echora/data'
import type { ChatMessage, Participant } from '@/lib/echora/types'
import { cn } from '@/lib/utils'

const SCRIPT = [
  { speaker: 'Maya Chen', text: 'Great, can everyone see my screen now?' },
  { speaker: 'Daniel Osei', text: 'Yes, it looks good on my end.' },
  { speaker: 'Maya Chen', text: 'Let us walk through the accessibility updates.' },
  { speaker: 'Lena Novak', text: 'The new captions are a huge improvement.' },
  { speaker: 'Maya Chen', text: 'Echora translates them live for the whole room.' },
]

export function MeetingRoom({
  code,
  name,
  attach,
  cameraOn,
  micOn,
  initialSigning,
  onToggleCamera,
  onToggleMic,
  onLeave,
}: {
  code: string
  name: string
  attach: (el: HTMLVideoElement | null) => void
  cameraOn: boolean
  micOn: boolean
  initialSigning: boolean
  onToggleCamera: () => void
  onToggleMic: () => void
  onLeave: () => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { time } = useClock()

  const [signing, setSigning] = useState(initialSigning)
  const [captionsOn, setCaptionsOn] = useState(true)
  const [handRaised, setHandRaised] = useState(false)
  const [panel, setPanel] = useState<PanelMode>('none')
  const [captions, setCaptions] = useState<Caption[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>(CHAT_SEED)

  const { status, gesture } = useSignLanguage({ canvasRef, enabled: signing })

  const self: Participant = {
    id: 'self',
    name,
    isSelf: true,
    muted: !micOn,
    cameraOn,
    handRaised,
    speaking: false,
    color: AVATAR_COLORS[0],
    avatarSeed: name,
  }

  const participants = useMemo<Participant[]>(
    () => [self, ...SIMULATED_PARTICIPANTS.map((p) => ({ ...p, isSelf: false }))],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [name, cameraOn, micOn, handRaised],
  )

  // Simulated live spoken captions.
  useEffect(() => {
    if (!captionsOn) return
    let i = 0
    const id = setInterval(() => {
      const line = SCRIPT[i % SCRIPT.length]
      i += 1
      setCaptions((prev) =>
        [...prev, { id: `cap-${Date.now()}`, ...line }].slice(-6),
      )
    }, 4200)
    return () => clearInterval(id)
  }, [captionsOn])

  // Turn the user's recognized signs into captions.
  const lastSignRef = useRef<string | null>(null)
  useEffect(() => {
    if (!signing || !gesture) return
    if (lastSignRef.current === gesture.label) return
    lastSignRef.current = gesture.label
    if (captionsOn) {
      setCaptions((prev) =>
        [
          ...prev,
          {
            id: `sign-${Date.now()}`,
            speaker: name,
            text: gesture.translation,
            signed: true,
          },
        ].slice(-6),
      )
    }
  }, [gesture, signing, captionsOn, name])

  function sendMessage(text: string) {
    setMessages((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        author: name,
        text,
        time: new Date().toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
        }),
        isSelf: true,
      },
    ])
  }

  const panelOpen = panel !== 'none'

  return (
    <div className="flex h-dvh flex-col bg-meet-bg">
      <header className="flex items-center justify-between px-4 py-3 sm:px-6">
        <EchoraLogo onDark />
        <div className="flex items-center gap-2 rounded-full bg-meet-surface px-3 py-1.5 text-xs text-meet-muted">
          <span className="size-1.5 rounded-full bg-accent-teal" />
          Signing &amp; captions on
        </div>
      </header>

      <div className="flex min-h-0 flex-1 gap-3 px-3 pb-2 sm:px-4">
        <div className="relative flex min-w-0 flex-1 flex-col">
          <div
            className={cn(
              'grid min-h-0 flex-1 auto-rows-fr gap-3 py-1',
              'grid-cols-1 sm:grid-cols-2',
            )}
          >
            <div className="relative min-h-0 overflow-hidden rounded-xl ring-2 ring-transparent">
              <SelfVideo
                attach={attach}
                canvasRef={canvasRef}
                cameraOn={cameraOn}
                showOverlay={signing}
                fallbackInitials="YO"
                className="size-full"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-meet-bg/70 to-transparent px-3 pb-2 pt-8">
                <span className="text-sm font-medium text-meet-foreground">
                  {name} (You)
                </span>
                {signing && (
                  <span className="rounded-full bg-accent-teal px-2 py-0.5 text-xs font-medium text-meet-bg">
                    {status === 'running' ? gesture?.emojiFree ?? 'Signing' : 'Signing'}
                  </span>
                )}
              </div>
            </div>

            {SIMULATED_PARTICIPANTS.map((p) => (
              <div key={p.id} className="relative min-h-0">
                <ParticipantTile p={{ ...p, isSelf: false }} />
              </div>
            ))}
          </div>

          {captionsOn && (
            <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10">
              <CaptionsBar captions={captions} />
            </div>
          )}
        </div>

        {panelOpen && (
          <aside className="w-full max-w-sm shrink-0 overflow-hidden rounded-xl bg-card sm:w-80">
            {panel === 'chat' && (
              <ChatPanel
                messages={messages}
                onSend={sendMessage}
                onClose={() => setPanel('none')}
              />
            )}
            {panel === 'people' && (
              <PeoplePanel
                participants={participants}
                onClose={() => setPanel('none')}
              />
            )}
            {panel === 'signs' && (
              <SignsPanel
                active={signing}
                status={status}
                onClose={() => setPanel('none')}
              />
            )}
          </aside>
        )}
      </div>

      <MeetingControls
        time={time}
        code={code}
        micOn={micOn}
        cameraOn={cameraOn}
        signing={signing}
        captionsOn={captionsOn}
        handRaised={handRaised}
        panel={panel}
        onToggleMic={onToggleMic}
        onToggleCamera={onToggleCamera}
        onToggleSigning={() => setSigning((v) => !v)}
        onToggleCaptions={() => setCaptionsOn((v) => !v)}
        onToggleHand={() => setHandRaised((v) => !v)}
        onSetPanel={setPanel}
        onLeave={onLeave}
      />
    </div>
  )
}
