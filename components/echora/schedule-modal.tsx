'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Modal } from './modal'
import { generateCode } from '@/lib/echora/data'
import type { ScheduledMeeting } from '@/lib/echora/types'

const inputClass =
  'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring'

export function ScheduleModal({
  open,
  onClose,
  onSchedule,
}: {
  open: boolean
  onClose: () => void
  onSchedule: (m: ScheduledMeeting) => void
}) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [attendees, setAttendees] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    onSchedule({
      id: `s-${Date.now()}`,
      title: title || 'Untitled meeting',
      date: date || 'Upcoming',
      time: time || '—',
      code: generateCode(),
      attendees: attendees
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean),
    })
    setTitle('')
    setDate('')
    setTime('')
    setAttendees('')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Schedule in Calendar">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm font-medium text-card-foreground">
          Title
          <input
            className={inputClass}
            placeholder="Team standup"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5 text-sm font-medium text-card-foreground">
            Date
            <input
              type="date"
              className={inputClass}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium text-card-foreground">
            Time
            <input
              type="time"
              className={inputClass}
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </label>
        </div>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-card-foreground">
          Attendees
          <input
            className={inputClass}
            placeholder="Comma-separated names or emails"
            value={attendees}
            onChange={(e) => setAttendees(e.target.value)}
          />
        </label>
        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="bg-brand text-brand-foreground hover:bg-brand/90">
            Schedule
          </Button>
        </div>
      </form>
    </Modal>
  )
}
