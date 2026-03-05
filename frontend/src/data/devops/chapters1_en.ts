import type { Chapter } from '../chapters'
import { chapters as chapters_fr } from './chapters1'

const enVideoMap: Record<number, string> = {
  100: 'ROjZy1WbCIA',
  101: 'ZtqBQ68cfJc',
  102: '6WatcfENsOU',
  103: 'Kzpm-rGAXos',
  104: '6WatcfENsOU',
  105: 'tK9Oc6AEnR4',
}

// TODO: Replace with proper English translations
export const chapters: Chapter[] = chapters_fr.map(ch => ({
  ...ch,
  videoId: enVideoMap[ch.id] || ch.videoId,
}))
