'use client'

import { VideoOff } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SelfVideo({
  attach,
  canvasRef,
  cameraOn,
  showOverlay,
  fallbackInitials,
  className,
}: {
  attach: (el: HTMLVideoElement | null) => void
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  cameraOn: boolean
  showOverlay: boolean
  fallbackInitials: string
  className?: string
}) {
  return (
    <div className={cn('relative overflow-hidden bg-meet-elev', className)}>
      <video
        ref={attach}
        muted
        playsInline
        className={cn(
          'size-full -scale-x-100 object-cover transition-opacity',
          cameraOn ? 'opacity-100' : 'opacity-0',
        )}
      />
      <canvas
        ref={canvasRef}
        className={cn(
          'pointer-events-none absolute inset-0 size-full object-cover transition-opacity',
          showOverlay && cameraOn ? 'opacity-100' : 'opacity-0',
        )}
      />
      {!cameraOn && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <span className="flex size-20 items-center justify-center rounded-full bg-brand text-2xl font-semibold text-brand-foreground">
            {fallbackInitials}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-meet-muted">
            <VideoOff className="size-4" />
            Camera is off
          </span>
        </div>
      )}
    </div>
  )
}
