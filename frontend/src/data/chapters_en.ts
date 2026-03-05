import type { Chapter } from './chapters'
import { chapters as chapters_fr } from './chapters'

const enVideoMap: Record<number, string> = {
  1: 'CRdL1PcherM',
  2: '_IOZ8_cPgu8',
  3: 'zbqrNg4C98U',
  4: 'ieTH5lVhNaY',
  5: 'C2FrTZxi_NI',
  6: 'aE0Owyyzyxk',
  7: 'cA9ZJdqzOoU',
  8: 'tZbayqSJISU',
  9: 'irhS0ASkvy8',
  10: 'rurs7cdT5cc',
  11: 'FZR0rG3HKIk',
}

// TODO: Replace with proper English translations
export const chapters: Chapter[] = chapters_fr.map(ch => ({
  ...ch,
  videoId: enVideoMap[ch.id] || ch.videoId,
}))
