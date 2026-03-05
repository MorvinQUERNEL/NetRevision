import type { Chapter } from '../chapters'
import { chapters as chapters5_fr } from './chapters5'

const enVideoMap: Record<number, string> = {
  125: '2LaAJq1lB1Q',
  126: 'SOTamWNgDKc',
  127: 'UGRDM86MBIQ',
  128: 'SLB_c_ayRMo',
  129: 'EtEb40LE5zQ',
  130: 'V4waklkBC38',
}

// English translations will be added later
export const chapters: Chapter[] = chapters5_fr.map(ch => ({
  ...ch,
  videoId: enVideoMap[ch.id] || ch.videoId,
}))
