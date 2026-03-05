import type { Chapter } from '../chapters'
import { chapters as chapters3_fr } from './chapters3'

const enVideoMap: Record<number, string> = {
  113: 'pg19Z8LL06w',
  114: '3c-iBn73dDE',
  115: 'SXwC9fSwSPg',
  116: '3c-iBn73dDE',
  117: '8vXoMqWgbQQ',
  118: 'fqMOX6JJhGo',
}

// English translations will be added later
export const chapters: Chapter[] = chapters3_fr.map(ch => ({
  ...ch,
  videoId: enVideoMap[ch.id] || ch.videoId,
}))
