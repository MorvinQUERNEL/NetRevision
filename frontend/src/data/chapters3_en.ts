import type { Chapter } from './chapters'
import { chapters3 as chapters3_fr } from './chapters3'

const enVideoMap: Record<number, string> = {
  22: 'FTUV0t6JaDA',
  23: 'eTedUK4DZp8',
  24: 'mpQZVYPuDGU',
  25: 'oCtkwEjhyD4',
  26: 'Lq7j-QipNrI',
  27: 'BMVHHX02T4Q',
  28: 'H6FKJMiiL6E',
  29: '5JvLV2-ngCI',
  30: 'tOj8MSEIbfA',
  31: 'CtZ81OvJxlI',
  32: 'vMshgkItW5g',
}

// TODO: Replace with proper English translations
export const chapters3: Chapter[] = chapters3_fr.map(ch => ({
  ...ch,
  videoId: enVideoMap[ch.id] || ch.videoId,
}))
