import type { Participant, ScheduledMeeting } from './types'

const WORDS = 'abcdefghijkmnpqrstuvwxyz'

function segment(len: number) {
  let out = ''
  for (let i = 0; i < len; i++) {
    out += WORDS[Math.floor(Math.random() * WORDS.length)]
  }
  return out
}

export function generateCode() {
  return `${segment(3)}-${segment(4)}-${segment(3)}`
}

export function meetingLink(code: string) {
  return `echora.meet/${code}`
}

export const AVATAR_COLORS = [
  'oklch(0.6 0.18 25)',
  'oklch(0.6 0.15 145)',
  'oklch(0.6 0.16 60)',
  'oklch(0.58 0.18 320)',
  'oklch(0.62 0.13 190)',
]

export function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export const SIMULATED_PARTICIPANTS: Omit<Participant, 'isSelf'>[] = [
  {
    id: 'p-maya',
    name: 'Maya Chen',
    muted: false,
    cameraOn: true,
    handRaised: false,
    speaking: true,
    color: AVATAR_COLORS[1],
    avatarSeed: 'Maya',
  },
  {
    id: 'p-daniel',
    name: 'Daniel Osei',
    muted: true,
    cameraOn: true,
    handRaised: false,
    speaking: false,
    color: AVATAR_COLORS[2],
    avatarSeed: 'Daniel',
  },
  {
    id: 'p-lena',
    name: 'Lena Novak',
    muted: false,
    cameraOn: false,
    handRaised: true,
    speaking: false,
    color: AVATAR_COLORS[3],
    avatarSeed: 'Lena',
  },
]

export function defaultScheduled(): ScheduledMeeting[] {
  return [
    {
      id: 's-1',
      title: 'Design sync — Accessibility team',
      date: 'Today',
      time: '2:30 PM',
      code: 'kfd-mora-pql',
      attendees: ['Maya Chen', 'Daniel Osei'],
    },
    {
      id: 's-2',
      title: 'Weekly all-hands',
      date: 'Tomorrow',
      time: '10:00 AM',
      code: 'zwe-tica-brn',
      attendees: ['Lena Novak', 'Maya Chen', 'Daniel Osei', 'You'],
    },
  ]
}

export const CHAT_SEED = [
  {
    id: 'c-1',
    author: 'Maya Chen',
    text: 'Welcome to Echora! Loving the live captions.',
    time: '2:31 PM',
    isSelf: false,
  },
]
