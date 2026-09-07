'use client'

import { Mic, MicOff, Video, VideoOff, Hand } from 'lucide-react'
import { PanelHeader } from './chat-panel'
import { initials } from '@/lib/echora/data'
import type { Participant } from '@/lib/echora/types'

export function PeoplePanel({
  participants,
  onClose,
}: {
  participants: Participant[]
  onClose: () => void
}) {
  return (
    <div className="flex h-full flex-col">
      <PanelHeader title={`People (${participants.length})`} onClose={onClose} />
      <ul className="flex-1 overflow-y-auto px-2 py-2">
        {participants.map((p) => (
          <li
            key={p.id}
            className="flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-accent/50"
          >
            <span
              className="flex size-9 items-center justify-center rounded-full text-sm font-semibold text-meet-foreground"
              style={{ backgroundColor: p.color }}
            >
              {initials(p.name)}
            </span>
            <span className="flex-1 truncate text-sm font-medium text-foreground">
              {p.name}
              {p.isSelf && (
                <span className="ml-1.5 text-xs text-muted-foreground">(You)</span>
              )}
            </span>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              {p.handRaised && <Hand className="size-4 text-accent-teal" />}
              {p.cameraOn ? (
                <Video className="size-4" />
              ) : (
                <VideoOff className="size-4" />
              )}
              {p.muted ? (
                <MicOff className="size-4 text-destructive" />
              ) : (
                <Mic className="size-4" />
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
