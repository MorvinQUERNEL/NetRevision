import type { Chapter } from '../chapters'
import { chapters as chapters6_fr } from './chapters6'

const enVideoMap: Record<number, string> = {
  131: 'R8_veQiYBjI',
  132: 'pMO26j2OUME',
  133: 'h4Sl21AKiDg',
  134: 'a4HBKEda_F8',
  135: 'Tz7FsunBbfQ',
  136: 'X48VuDVv0do',
  137: 'Wf2eSG3owoA',
}

// English translations will be added later
export const chapters: Chapter[] = chapters6_fr.map(ch => ({
  ...ch,
  videoId: enVideoMap[ch.id] || ch.videoId,
}))
