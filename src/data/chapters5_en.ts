import type { Chapter } from './chapters'
import { chapters5 as chapters5_fr } from './chapters5'

const enVideoMap: Record<number, string> = {
  37: 'Uz-RTurph3c',
  38: 'uX1h0F6wpBY',
  39: '0lDiFNIKepM',
  40: 'WZaIfyvERcA',
  41: 'r9o6GFI87go',
  42: 'F1NU_PPGmHQ',
}

// TODO: Replace with proper English translations
export const chapters5: Chapter[] = chapters5_fr.map(ch => ({
  ...ch,
  videoId: enVideoMap[ch.id] || ch.videoId,
}))
