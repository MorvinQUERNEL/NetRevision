import type { Chapter } from './chapters'
import { chapters4 as chapters4_fr } from './chapters4'

const enVideoMap: Record<number, string> = {
  33: 'VvFuieyTTSw',
  34: 'pakk3v0VNnM',
  35: 'CuxyZiSCSfc',
  36: 'OmhrvD5_hFQ',
}

// TODO: Replace with proper English translations
export const chapters4: Chapter[] = chapters4_fr.map(ch => ({
  ...ch,
  videoId: enVideoMap[ch.id] || ch.videoId,
}))
