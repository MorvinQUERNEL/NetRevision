import type { Chapter } from '../chapters'
import { chapters as chapters4_fr } from './chapters4'

const enVideoMap: Record<number, string> = {
  119: 'X48VuDVv0do',
  120: 's_o8dwzRlu4',
  121: '80Ew_fsV4rM',
  122: '-ykwb1d0DXU',
  123: 'X48VuDVv0do',
  124: 'd6WC5n9G_sM',
}

// English translations will be added later
export const chapters: Chapter[] = chapters4_fr.map(ch => ({
  ...ch,
  videoId: enVideoMap[ch.id] || ch.videoId,
}))
