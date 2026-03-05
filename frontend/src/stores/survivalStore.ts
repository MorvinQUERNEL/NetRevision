import { create } from 'zustand'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface SurvivalHighScore {
  score: number
  questionsAnswered: number
  maxStreak: number
  maxDifficulty: string
  date: string
}

interface SurvivalState {
  highScores: SurvivalHighScore[]
  loadScores: () => void
  saveScore: (score: SurvivalHighScore) => void
  getBestScore: () => number
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = 'nr_survival_scores'

/* ------------------------------------------------------------------ */
/*  Store                                                              */
/* ------------------------------------------------------------------ */

export const useSurvivalStore = create<SurvivalState>((set, get) => ({
  highScores: [],

  loadScores: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed: SurvivalHighScore[] = JSON.parse(raw)
        const sorted = parsed.sort((a, b) => b.score - a.score).slice(0, 10)
        set({ highScores: sorted })
      }
    } catch {
      set({ highScores: [] })
    }
  },

  saveScore: (score) => {
    const current = get().highScores
    const updated = [...current, score]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
    set({ highScores: updated })
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
      /* localStorage full — silently ignore */
    }
  },

  getBestScore: () => {
    const scores = get().highScores
    if (scores.length === 0) return 0
    return scores[0].score
  },
}))
