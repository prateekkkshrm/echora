export type Screen = 'home' | 'greenroom' | 'meeting'

export interface ScheduledMeeting {
  id: string
  title: string
  date: string
  time: string
  code: string
  attendees: string[]
}

export interface Participant {
  id: string
  name: string
  isSelf: boolean
  muted: boolean
  cameraOn: boolean
  handRaised: boolean
  speaking: boolean
  color: string
  avatarSeed: string
}

export interface ChatMessage {
  id: string
  author: string
  text: string
  time: string
  isSelf: boolean
}
