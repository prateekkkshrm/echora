'use client'

import { Hand } from 'lucide-react'
import { PanelHeader } from './chat-panel'
import { GESTURE_LEGEND } from '@/lib/echora/gestures'

export function SignsPanel({
  onClose,
  active,
  status,
}: {
  onClose: () => void
  active: boolean
  status: 'idle' | 'loading' | 'running' | 'error'
}) {
  return (
    <div className="flex h-full flex-col">
      <PanelHeader title="Sign dictionary" onClose={onClose} />
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
          <Hand className="size-4 text-brand" />
          <span className="text-muted-foreground">
            {!active && 'Turn on sign language to start recognition.'}
            {active && status === 'loading' && 'Loading hand-tracking model…'}
            {active && status === 'running' && 'Recognition active — sign to the camera.'}
            {active && status === 'error' && 'Camera unavailable for tracking.'}
          </span>
        </div>
      </div>
      <ul className="flex-1 overflow-y-auto px-2 py-2">
        {GESTURE_LEGEND.map((g) => (
          <li
            key={g.label}
            className="flex items-center gap-3 rounded-lg px-2 py-2.5"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-muted font-mono text-xs font-semibold text-brand">
              {g.pattern}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium text-foreground">
                {g.translation}
              </span>
              <span className="block text-xs text-muted-foreground">{g.label}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
