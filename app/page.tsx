'use client'

import { useState } from 'react'
import { LandingHeader } from '@/components/echora/landing-header'
import { Landing } from '@/components/echora/landing'
import { GreenRoom } from '@/components/echora/green-room'
import { MeetingRoom } from '@/components/echora/meeting-room'
import { useWebcam } from '@/lib/echora/use-webcam'
import { defaultScheduled } from '@/lib/echora/data'
import type { Screen, ScheduledMeeting } from '@/lib/echora/types'

export default function Page() {
  const [screen, setScreen] = useState<Screen>('home')
  const [code, setCode] = useState('')
  const [name, setName] = useState('You')
  const [initialSigning, setInitialSigning] = useState(false)
  const [scheduled, setScheduled] = useState<ScheduledMeeting[]>(defaultScheduled)

  const [cameraOn, setCameraOn] = useState(true)
  const [micOn, setMicOn] = useState(true)

  const inCall = screen === 'greenroom' || screen === 'meeting'
  const { attach, status } = useWebcam({ active: inCall, cameraOn, micOn })

  function enterGreenRoom(nextCode: string) {
    setCode(nextCode)
    setScreen('greenroom')
  }

  function addScheduled(m: ScheduledMeeting) {
    setScheduled((prev) => [m, ...prev])
  }

  if (screen === 'greenroom') {
    return (
      <GreenRoom
        code={code}
        attach={attach}
        webcamStatus={status}
        cameraOn={cameraOn}
        micOn={micOn}
        onToggleCamera={() => setCameraOn((v) => !v)}
        onToggleMic={() => setMicOn((v) => !v)}
        onBack={() => setScreen('home')}
        onJoin={(joinName, signing) => {
          setName(joinName)
          setInitialSigning(signing)
          setScreen('meeting')
        }}
      />
    )
  }

  if (screen === 'meeting') {
    return (
      <MeetingRoom
        code={code}
        name={name}
        attach={attach}
        cameraOn={cameraOn}
        micOn={micOn}
        initialSigning={initialSigning}
        onToggleCamera={() => setCameraOn((v) => !v)}
        onToggleMic={() => setMicOn((v) => !v)}
        onLeave={() => setScreen('home')}
      />
    )
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <LandingHeader />
      <Landing
        scheduled={scheduled}
        onSchedule={addScheduled}
        onStartInstant={enterGreenRoom}
        onJoin={enterGreenRoom}
      />
    </div>
  )
}
