import type { Chapter } from './chapters'
import { chapters2 as chapters2_fr } from './chapters2'

const enVideoMap: Record<number, string> = {
  12: 'Wi48h6UFhlo',
  13: '6MW5P6Ci7lw',
  14: 'SPloaasxkMQ',
  15: 'gKCkCyxsoCk',
  16: '2_FZD7Cqhlk',
  17: 'CGmTvukObOw',
  18: 'DNG7QLyCiEc',
  19: 'ywVqjGpTCNI',
  20: 'kfvJ8QVJscc',
  21: 'KjNYEzEBRD8',
}

// TODO: Replace with proper English translations
export const chapters2: Chapter[] = chapters2_fr.map(ch => ({
  ...ch,
  videoId: enVideoMap[ch.id] || ch.videoId,
}))
