export interface Speaker {
  name: string
  country: string
  timeRemaining: number
}

export interface Motion {
  id: number
  type: string
  proposedBy: string
  duration?: number
  topic?: string
  passed?: boolean
}

