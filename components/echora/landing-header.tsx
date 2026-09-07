'use client'

import { Settings, HelpCircle } from 'lucide-react'
import { EchoraLogo } from './logo'
import { useClock } from '@/lib/echora/use-clock'

export function LandingHeader() {
  const { time, date } = useClock()

  return (
    <header className="flex items-center justify-between px-4 py-3 sm:px-8">
      <EchoraLogo />
      <div className="flex items-center gap-1 sm:gap-2">
        <span className="mr-2 hidden text-sm text-muted-foreground sm:inline">
          {date} <span className="mx-1 text-border">|</span> {time}
        </span>
        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          aria-label="Help"
        >
          <HelpCircle className="size-5" />
        </button>
        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          aria-label="Settings"
        >
          <Settings className="size-5" />
        </button>
        <button
          type="button"
          className="ml-1 flex size-9 items-center justify-center rounded-full bg-brand text-sm font-semibold text-brand-foreground"
          aria-label="Your account"
        >
          YO
        </button>
      </div>
    </header>
  )
}
