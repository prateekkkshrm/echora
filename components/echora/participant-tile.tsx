'use client'

import { MicOff, Hand, Pin } from 'lucide-react'
import { initials } from '@/lib/echora/data'
import type { Participant } from '@/lib/echora/types'
import { cn } from '@/lib/utils'

export function ParticipantTile({ p }: { p: Participant }) {
  return (
    <div
      className={cn(
        'group relative flex size-full items-center justify-center overflow-hidden rounded-xl bg-meet-surface ring-2 transition-all',
        p.speaking && !p.muted
          ? 'ring-accent-teal'
          : 'ring-transparent',
      )}
    >
      {p.cameraOn ? (
        <div
          className="flex size-full items-center justify-center"
          style={{
            background: `radial-gradient(circle at 50% 35%, ${p.color}, color-mix(in oklab, ${p.color} 45%, black))`,
          }}
        >
          <span className="flex size-24 items-center justify-center rounded-full bg-meet-bg/25 text-3xl font-semibold text-meet-foreground backdrop-blur-sm">
            {initials(p.name)}
          </span>
        </div>
      ) : (
        <span
          className="flex size-20 items-center justify-center rounded-full text-2xl font-semibold text-meet-foreground"
          style={{ backgroundColor: p.color }}
        >
          {initials(p.name)}
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-meet-bg/70 to-transparent px-3 pb-2 pt-8">
        <span className="flex items-center gap-1.5 text-sm font-medium text-meet-foreground">
          {p.muted && <MicOff className="size-3.5 text-destructive" />}
          {p.name}
        </span>
        {p.handRaised && (
          <span className="flex size-6 items-center justify-center rounded-full bg-accent-teal text-meet-bg">
            <Hand className="size-3.5" />
          </span>
        )}
      </div>

      <button
        type="button"
        className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-meet-bg/60 text-meet-foreground opacity-0 transition-opacity hover:bg-meet-bg/80 group-hover:opacity-100"
        aria-label={`Pin ${p.name}`}
      >
        <Pin className="size-4" />
      </button>
    </div>
  )
}
