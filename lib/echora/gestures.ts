// A single hand landmark from MediaPipe Hands (normalized 0..1 coordinates).
export interface Landmark {
  x: number
  y: number
  z: number
}

export interface GestureResult {
  label: string
  translation: string
  emojiFree: string // short glyph-free tag used for badges
}

// Connections between the 21 hand landmarks, used to draw the skeleton overlay.
export const HAND_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], // thumb
  [0, 5], [5, 6], [6, 7], [7, 8], // index
  [5, 9], [9, 10], [10, 11], [11, 12], // middle
  [9, 13], [13, 14], [14, 15], [15, 16], // ring
  [13, 17], [17, 18], [18, 19], [19, 20], // pinky
  [0, 17], // palm base
]

// Determine which fingers are extended.
// Returns [thumb, index, middle, ring, pinky] as 0 | 1.
function extendedFingers(lm: Landmark[]): number[] {
  const fingers: number[] = []

  // Thumb: compare tip (4) and ip (3) against the hand's horizontal direction.
  // Use distance from wrist as a robust heuristic across left/right hands.
  const wrist = lm[0]
  const thumbTip = lm[4]
  const thumbIp = lm[3]
  const dTip = Math.hypot(thumbTip.x - wrist.x, thumbTip.y - wrist.y)
  const dIp = Math.hypot(thumbIp.x - wrist.x, thumbIp.y - wrist.y)
  fingers.push(dTip > dIp * 1.05 ? 1 : 0)

  // Other fingers: tip above the PIP joint (smaller y = higher on screen).
  const tips = [8, 12, 16, 20]
  const pips = [6, 10, 14, 18]
  for (let i = 0; i < tips.length; i++) {
    fingers.push(lm[tips[i]].y < lm[pips[i]].y - 0.02 ? 1 : 0)
  }
  return fingers
}

// Map a finger pattern to an Echora gesture + translation.
// The dictionary is intentionally explicit so it can be extended easily.
const DICTIONARY: Record<string, GestureResult> = {
  '11111': { label: 'Open Palm', translation: 'Hello', emojiFree: 'HELLO' },
  '00000': { label: 'Closed Fist', translation: 'Stop', emojiFree: 'STOP' },
  '10000': { label: 'Thumbs Up', translation: 'Yes / Good', emojiFree: 'YES' },
  '01000': { label: 'Point Up', translation: 'You', emojiFree: 'YOU' },
  '01100': { label: 'Victory', translation: 'Peace', emojiFree: 'PEACE' },
  '01110': { label: 'Three Fingers', translation: 'Three', emojiFree: 'THREE' },
  '01111': { label: 'Four Fingers', translation: 'Four', emojiFree: 'FOUR' },
  '10001': { label: 'Call Me', translation: 'Call me', emojiFree: 'CALL' },
  '10011': { label: 'I Love You', translation: 'I love you', emojiFree: 'ILY' },
  '00001': { label: 'Pinky Up', translation: 'Promise', emojiFree: 'PROMISE' },
  '11000': { label: 'Pinch / L', translation: 'Wait', emojiFree: 'WAIT' },
}

export function classifyGesture(lm: Landmark[] | undefined): GestureResult | null {
  if (!lm || lm.length < 21) return null
  const pattern = extendedFingers(lm).join('')
  return DICTIONARY[pattern] ?? null
}

export const GESTURE_LEGEND: { pattern: string; label: string; translation: string }[] =
  Object.entries(DICTIONARY).map(([, v]) => ({
    pattern: v.emojiFree,
    label: v.label,
    translation: v.translation,
  }))
