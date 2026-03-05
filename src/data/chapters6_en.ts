import type { Chapter } from './chapters'
import { chapters6 as chapters6_fr } from './chapters6'

const enVideoMap: Record<number, string> = {
  43: '4tsBgMCPVuc',
  44: 'hKclRevrkkQ',
  45: '7HhWCeXDTpA',
  46: 'AJshu0gZKdw',
  47: 'Fl0cD44-Vao',
  48: 'Kog9gHTjALI',
  49: 'nohde2-QNJ4',
}

// TODO: Replace with proper English translations
export const chapters6: Chapter[] = chapters6_fr.map(ch => ({
  ...ch,
  videoId: enVideoMap[ch.id] || ch.videoId,
}))
