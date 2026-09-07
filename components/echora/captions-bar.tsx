'use client'

import { Captions, Hand } from 'lucide-react'

export interface Caption {
  id: string
  speaker: string
  text: string
  signed?: boolean
}

export function CaptionsBar({ captions }: { captions: Caption[] }) {
  if (captions.length === 0) return null
  return (
    <div className="pointer-events-none mx-auto w-full max-w-3xl px-4">
      <div className="rounded-xl bg-meet-bg/85 px-4 py-3 backdrop-blur-md">
        <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-meet-muted">
          <Captions className="size-3.5" />
          Live captions
        </div>
        <ul className="flex flex-col gap-1">
          {captions.slice(-3).map((c) => (
            <li key={c.id} className="text-[15px] leading-snug text-meet-foreground">
              <span className="mr-2 font-semibold text-accent-teal">
                {c.speaker}
                {c.signed && (
                  <Hand className="ml-1 inline size-3.5 align-[-2px]" />
                )}
                :
              </span>
              {c.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
