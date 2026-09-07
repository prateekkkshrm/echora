'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Video,
  Plus,
  Link2,
  CalendarPlus,
  Keyboard,
  Hand,
  Captions,
  Languages,
  ChevronRight,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScheduleModal } from './schedule-modal'
import { Modal } from './modal'
import { CopyButton } from './copy-button'
import { generateCode, meetingLink } from '@/lib/echora/data'
import type { ScheduledMeeting } from '@/lib/echora/types'

const FEATURES = [
  {
    icon: Hand,
    title: 'Sign language recognition',
    body: 'Real-time hand tracking turns signs into on-screen text as you sign.',
  },
  {
    icon: Captions,
    title: 'Live voice captions',
    body: 'Every spoken word is transcribed instantly for the whole room.',
  },
  {
    icon: Languages,
    title: 'Inline translation',
    body: 'Captions and signs translate across languages so no one is left out.',
  },
]

export function Landing({
  scheduled,
  onSchedule,
  onStartInstant,
  onJoin,
}: {
  scheduled: ScheduledMeeting[]
  onSchedule: (m: ScheduledMeeting) => void
  onStartInstant: (code: string) => void
  onJoin: (code: string) => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [linkModal, setLinkModal] = useState<string | null>(null)
  const [joinCode, setJoinCode] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [menuOpen])

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-16 pt-8 sm:px-8 lg:pt-16">
      <div className="grid flex-1 items-start gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="flex flex-col">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="size-1.5 rounded-full bg-accent-teal" />
            Accessible video calls for everyone
          </span>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
            Meetings that speak
            <span className="text-brand"> everyone&apos;s language</span>
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Echora blends crisp video with real-time sign language recognition,
            live captions, and translation — so every voice, spoken or signed, is
            heard.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative" ref={menuRef}>
              <Button
                size="lg"
                className="h-12 gap-2 bg-brand px-5 text-base text-brand-foreground hover:bg-brand/90"
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
              >
                <Video className="size-5" />
                New meeting
              </Button>
              {menuOpen && (
                <div
                  role="menu"
                  className="absolute left-0 top-14 z-30 w-64 overflow-hidden rounded-xl border border-border bg-popover py-1.5 shadow-lg"
                >
                  <button
                    role="menuitem"
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-popover-foreground transition-colors hover:bg-accent"
                    onClick={() => {
                      setMenuOpen(false)
                      setLinkModal(generateCode())
                    }}
                  >
                    <Link2 className="size-4 text-muted-foreground" />
                    Create a meeting for later
                  </button>
                  <button
                    role="menuitem"
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-popover-foreground transition-colors hover:bg-accent"
                    onClick={() => {
                      setMenuOpen(false)
                      onStartInstant(generateCode())
                    }}
                  >
                    <Plus className="size-4 text-muted-foreground" />
                    Start an instant meeting
                  </button>
                  <button
                    role="menuitem"
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-popover-foreground transition-colors hover:bg-accent"
                    onClick={() => {
                      setMenuOpen(false)
                      setScheduleOpen(true)
                    }}
                  >
                    <CalendarPlus className="size-4 text-muted-foreground" />
                    Schedule in Calendar
                  </button>
                </div>
              )}
            </div>

            <form
              className="flex flex-1 items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                if (joinCode.trim()) onJoin(joinCode.trim())
              }}
            >
              <div className="flex flex-1 items-center gap-2 rounded-lg border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
                <Keyboard className="size-5 text-muted-foreground" />
                <input
                  className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  placeholder="Enter a code or link"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  aria-label="Meeting code or link"
                />
              </div>
              <Button
                type="submit"
                variant="ghost"
                className="h-12 font-semibold text-brand hover:bg-brand-muted disabled:text-muted-foreground"
                disabled={!joinCode.trim()}
              >
                Join
              </Button>
            </form>
          </div>

          <dl className="mt-12 grid gap-x-6 gap-y-6 sm:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex flex-col gap-2">
                <f.icon className="size-5 text-brand" aria-hidden="true" />
                <dt className="text-sm font-semibold text-foreground">{f.title}</dt>
                <dd className="text-sm leading-relaxed text-muted-foreground">
                  {f.body}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <aside className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-card-foreground">
              Upcoming meetings
            </h2>
            <button
              type="button"
              onClick={() => setScheduleOpen(true)}
              className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline"
            >
              <Plus className="size-4" />
              New
            </button>
          </div>
          <ul className="flex flex-col gap-2">
            {scheduled.length === 0 && (
              <li className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
                No meetings scheduled yet.
              </li>
            )}
            {scheduled.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => onJoin(m.code)}
                  className="group flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-3 text-left transition-colors hover:border-border hover:bg-accent/50"
                >
                  <span className="flex size-11 shrink-0 flex-col items-center justify-center rounded-lg bg-brand-muted text-brand">
                    <CalendarPlus className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-card-foreground">
                      {m.title}
                    </span>
                    <span className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                      {m.date} · {m.time}
                      <span className="inline-flex items-center gap-1">
                        <Users className="size-3" />
                        {m.attendees.length}
                      </span>
                    </span>
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <ScheduleModal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        onSchedule={onSchedule}
      />

      <Modal
        open={linkModal !== null}
        onClose={() => setLinkModal(null)}
        title="Here is your meeting link"
      >
        <p className="text-sm leading-relaxed text-muted-foreground">
          Share this link with people you want in the meeting. Be sure to save it
          so you can use it later.
        </p>
        <div className="mt-4 flex items-center justify-between gap-3 rounded-lg bg-muted px-4 py-3">
          <span className="truncate font-mono text-sm text-foreground">
            {linkModal ? meetingLink(linkModal) : ''}
          </span>
          <CopyButton
            value={linkModal ? meetingLink(linkModal) : ''}
            className="shrink-0 text-brand hover:bg-brand-muted"
          />
        </div>
        <div className="mt-5 flex justify-end">
          <Button
            className="bg-brand text-brand-foreground hover:bg-brand/90"
            onClick={() => {
              if (linkModal) onStartInstant(linkModal)
            }}
          >
            Join now
          </Button>
        </div>
      </Modal>
    </main>
  )
}
