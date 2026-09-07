'use client'

import { useEffect, useRef, useState } from 'react'
import { Send, X } from 'lucide-react'
import type { ChatMessage } from '@/lib/echora/types'
import { cn } from '@/lib/utils'

export function ChatPanel({
  messages,
  onSend,
  onClose,
}: {
  messages: ChatMessage[]
  onSend: (text: string) => void
  onClose: () => void
}) {
  const [text, setText] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    onSend(text.trim())
    setText('')
  }

  return (
    <div className="flex h-full flex-col">
      <PanelHeader title="In-call messages" onClose={onClose} />
      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {messages.map((m) => (
          <div key={m.id} className={cn('flex flex-col', m.isSelf && 'items-end')}>
            <div className="mb-0.5 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">
                {m.isSelf ? 'You' : m.author}
              </span>
              {m.time}
            </div>
            <p
              className={cn(
                'max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed',
                m.isSelf
                  ? 'rounded-tr-sm bg-brand text-brand-foreground'
                  : 'rounded-tl-sm bg-muted text-foreground',
              )}
            >
              {m.text}
            </p>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form onSubmit={submit} className="flex items-center gap-2 border-t border-border p-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (
              e.key === 'Enter' &&
              !e.shiftKey &&
              !e.nativeEvent.isComposing &&
              e.keyCode !== 229
            ) {
              submit(e)
            }
          }}
          placeholder="Send a message"
          className="flex-1 rounded-full border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
          aria-label="Message"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="flex size-10 items-center justify-center rounded-full bg-brand text-brand-foreground transition-colors hover:bg-brand/90 disabled:opacity-40"
          aria-label="Send message"
        >
          <Send className="size-4" />
        </button>
      </form>
    </div>
  )
}

export function PanelHeader({
  title,
  onClose,
}: {
  title: string
  onClose: () => void
}) {
  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-3">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <button
        type="button"
        onClick={onClose}
        className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent"
        aria-label="Close panel"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}
