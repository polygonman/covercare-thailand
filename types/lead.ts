export type Segment = 'corporate' | 'nomad' | 'tech' | 'retiree'

export interface Lead {
  name: string
  email: string
  whatsapp: string
  segment: Segment
  needs: string[]
  message?: string
  score: number
  createdAt: string
}

export const SEGMENT_LABELS: Record<Segment, string> = {
  corporate: 'Corporate Expat',
  nomad: 'Digital Nomad / Freelancer',
  tech: 'Tech Startup Employee',
  retiree: 'Retiree in Thailand',
}

export const NEEDS_OPTIONS = [
  'Hospital coordination support',
  'English-speaking agent',
  'Fast claims assistance',
  'Finding the right plan',
  'Understanding my current coverage',
  'Adding family members',
]

export function scoreLead(segment: Segment, needs: string[]): number {
  const segmentScore: Record<Segment, number> = {
    corporate: 40,
    tech: 35,
    nomad: 25,
    retiree: 30,
  }
  const needsScore = Math.min(needs.length * 10, 40)
  const urgencyBonus = needs.includes('Fast claims assistance') ? 20 : 0
  return Math.min(segmentScore[segment] + needsScore + urgencyBonus, 100)
}
