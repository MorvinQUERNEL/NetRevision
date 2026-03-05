import type { Chapter } from '../chapters'
import { chapters as chapters_fr } from './chapters2'

const enVideoMap: Record<number, string> = {
  106: 'CRdL1PcherM',
  107: '5WfiTHiU4x8',
  108: 'NiQTs9DbtW4',
  109: '9t9Mp0BGnyI',
  110: 'RGOj5yH7evk',
  111: 'qP8kir2GUgo',
  112: 'eWRfhZUzrAc',
}

// TODO: Replace with proper English translations
export const chapters: Chapter[] = chapters_fr.map(ch => ({
  ...ch,
  videoId: enVideoMap[ch.id] || ch.videoId,
}))
