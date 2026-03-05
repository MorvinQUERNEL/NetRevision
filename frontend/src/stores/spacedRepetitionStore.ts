import { create } from 'zustand'
import { flashcardData } from '../data/flashcardsData'

export interface CardReview {
  cardId: string
  easeFactor: number
  interval: number
  repetitions: number
  nextReviewDate: string
  lastReviewed: string | null
  totalReviews: number
}

interface SpacedRepState {
  reviews: CardReview[]
  loadReviews: () => void
  getCardReview: (cardId: string) => CardReview
  submitReview: (cardId: string, quality: 'again' | 'hard' | 'good' | 'easy') => void
  getDueCards: () => string[]
  getStats: () => { dueToday: number; learning: number; mature: number; total: number }
}

const STORAGE_KEY = 'nr_spaced_repetition'

function initCard(cardId: string): CardReview {
  return {
    cardId,
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0,
    nextReviewDate: new Date().toISOString(),
    lastReviewed: null,
    totalReviews: 0,
  }
}

function calcNextReview(current: CardReview, quality: 'again' | 'hard' | 'good' | 'easy'): CardReview {
  const qMap = { again: 0, hard: 3, good: 4, easy: 5 }
  const q = qMap[quality]

  let ef = current.easeFactor
  let interval = current.interval
  let reps = current.repetitions

  if (q >= 3) {
    if (reps === 0) interval = 1
    else if (reps === 1) interval = 6
    else interval = Math.round(current.interval * current.easeFactor)
    reps += 1
  } else {
    reps = 0
    interval = 1
  }

  ef = ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  ef = Math.max(1.3, Math.min(2.5, ef))

  const next = new Date()
  next.setDate(next.getDate() + interval)

  return {
    ...current,
    easeFactor: ef,
    interval,
    repetitions: reps,
    nextReviewDate: next.toISOString(),
    lastReviewed: new Date().toISOString(),
    totalReviews: current.totalReviews + 1,
  }
}

export const useSpacedRepStore = create<SpacedRepState>((set, get) => ({
  reviews: [],

  loadReviews: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        set({ reviews: JSON.parse(stored) })
      } else {
        const initial = flashcardData.map(c => initCard(c.id))
        set({ reviews: initial })
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
      }
    } catch {
      const initial = flashcardData.map(c => initCard(c.id))
      set({ reviews: initial })
    }
  },

  getCardReview: (cardId) => {
    return get().reviews.find(r => r.cardId === cardId) || initCard(cardId)
  },

  submitReview: (cardId, quality) => {
    const current = get().getCardReview(cardId)
    const updated = calcNextReview(current, quality)
    set(state => {
      const newReviews = state.reviews.filter(r => r.cardId !== cardId)
      newReviews.push(updated)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newReviews))
      return { reviews: newReviews }
    })
  },

  getDueCards: () => {
    const now = new Date()
    return get().reviews
      .filter(r => new Date(r.nextReviewDate) <= now)
      .map(r => r.cardId)
  },

  getStats: () => {
    const reviews = get().reviews
    const now = new Date()
    return {
      dueToday: reviews.filter(r => new Date(r.nextReviewDate) <= now).length,
      learning: reviews.filter(r => r.repetitions < 3).length,
      mature: reviews.filter(r => r.repetitions >= 3).length,
      total: reviews.length,
    }
  },
}))
