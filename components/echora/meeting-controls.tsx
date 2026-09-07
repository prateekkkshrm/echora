'use client'

import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Hand,
  Captions,
  MessageSquare,
  Users,
  PhoneOff,
  Languages,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type PanelMode = 'none' | 'chat' | 'people' | 'signs'

interface Props {
  time: string
  code: string
  micOn: boolean
  cameraOn: boolean
  signing: boolean
  captionsOn: boolean
  handRaised: boolean
  panel: PanelMode
  onToggleMic: () => void
  onToggleCamera: () => void
  onToggleSigning: () => void
  onToggleCaptions: () => void
  onToggleHand: () => void
  onSetPanel: (p: PanelMode) => void
  onLeave: () => void
}

export function MeetingControls(props: Props) {
  return (
    <div className="flex items-center justify-between gap-2 px-3 py-3 sm:px-6">
      <div className="hidden min-w-0 items-center gap-2 text-sm text-meet-muted md:flex md:w-56">
        <span className="tabular-nums text-meet-foreground">{props.time}</span>
        <span className="text-meet-border">|</span>
        <span className="truncate font-mono">{props.code}</span>
      </div>

      <div className="flex flex-1 items-center justify-center gap-2">
        <RoundToggle
          active={props.micOn}
          danger
          onClick={props.onToggleMic}
          on={<Mic className="size-5" />}
          off={<MicOff className="size-5" />}
          label={props.micOn ? 'Mute microphone' : 'Unmute microphone'}
        />
        <RoundToggle
          active={props.cameraOn}
          danger
          onClick={props.onToggleCamera}
          on={<Video className="size-5" />}
          off={<VideoOff className="size-5" />}
          label={props.cameraOn ? 'Turn off camera' : 'Turn on camera'}
        />
        <AccentToggle
          active={props.signing}
          onClick={props.onToggleSigning}
          icon={<Languages className="size-5" />}
          label="Sign language recognition"
        />
        <AccentToggle
          active={props.captionsOn}
          onClick={props.onToggleCaptions}
          icon={<Captions className="size-5" />}
          label="Live captions"
        />
        <AccentToggle
          active={props.handRaised}
          onClick={props.onToggleHand}
          icon={<Hand className="size-5" />}
          label="Raise hand"
        />

        <button
          type="button"
          onClick={props.onLeave}
          className="ml-1 flex h-12 items-center gap-2 rounded-full bg-destructive px-5 text-primary-foreground transition-colors hover:bg-destructive/90"
          aria-label="Leave call"
        >
          <PhoneOff className="size-5" />
        </button>
      </div>

      <div className="flex w-auto items-center justify-end gap-1 md:w-56">
        <PanelButton
          active={props.panel === 'chat'}
          onClick={() =>
            props.onSetPanel(props.panel === 'chat' ? 'none' : 'chat')
          }
          icon={<MessageSquare className="size-5" />}
          label="Chat"
        />
        <PanelButton
          active={props.panel === 'people'}
          onClick={() =>
            props.onSetPanel(props.panel === 'people' ? 'none' : 'people')
          }
          icon={<Users className="size-5" />}
          label="People"
        />
        <PanelButton
          active={props.panel === 'signs'}
          onClick={() =>
            props.onSetPanel(props.panel === 'signs' ? 'none' : 'signs')
          }
          icon={<Hand className="size-5" />}
          label="Sign dictionary"
        />
      </div>
    </div>
  )
}

function RoundToggle({
  active,
  danger,
  onClick,
  on,
  off,
  label,
}: {
  active: boolean
  danger?: boolean
  onClick: () => void
  on: React.ReactNode
  off: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={cn(
        'flex size-12 items-center justify-center rounded-full transition-colors',
        active
          ? 'bg-meet-elev text-meet-foreground hover:bg-meet-border'
          : danger
            ? 'bg-destructive text-primary-foreground hover:bg-destructive/90'
            : 'bg-meet-elev text-meet-foreground',
      )}
    >
      {active ? on : off}
    </button>
  )
}

function AccentToggle({
  active,
  onClick,
  icon,
  labelIcon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  labelIcon?: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={cn(
        'flex size-12 items-center justify-center rounded-full transition-colors',
        active
          ? 'bg-accent-teal text-meet-bg'
          : 'bg-meet-elev text-meet-foreground hover:bg-meet-border',
      )}
    >
      {labelIcon ?? icon}
    </button>
  )
}

function PanelButton({
  active,
  onClick,
  icon,
  label,
  hidden,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  hidden?: boolean
}) {
  if (hidden) return null
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={cn(
        'flex size-11 items-center justify-center rounded-full transition-colors',
        active
          ? 'bg-brand-muted text-brand'
          : 'text-meet-muted hover:bg-meet-elev hover:text-meet-foreground',
      )}
    >
      {icon}
    </button>
  )
}
