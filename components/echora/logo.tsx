import { cn } from '@/lib/utils'

export function EchoraLogo({
  className,
  onDark = false,
}: {
  className?: string
  onDark?: boolean
}) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <span className="flex size-9 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-sm">
        <svg
          viewBox="0 0 24 24"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
          aria-hidden="true"
        >
          <line x1="5" y1="10" x2="5" y2="14" />
          <line x1="9.5" y1="6" x2="9.5" y2="18" />
          <line x1="14" y1="3.5" x2="14" y2="20.5" />
          <line x1="18.5" y1="8" x2="18.5" y2="16" />
        </svg>
      </span>
      <span
        className={cn(
          'text-xl font-semibold tracking-tight',
          onDark ? 'text-meet-foreground' : 'text-foreground',
        )}
      >
        Echora
      </span>
    </div>
  )
}
