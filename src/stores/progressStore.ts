import { create } from 'zustand'
import { api } from '../services/api'

export interface ProgressRecord {
  id: number
  chapterSlug: string
  chapterTitle: string
  courseCompleted: boolean
  quizScore: number | null
  quizCompletedAt: string | null
  examScore: number | null
  examPassed: boolean
  examCompletedAt: string | null
  flashcardsReviewed: number
  updatedAt: string
}

interface ProgressState {
  records: ProgressRecord[]
  isLoading: boolean

  load: () => Promise<void>
  getBySlug: (slug: string) => ProgressRecord | undefined
  markCourseComplete: (slug: string) => Promise<{ totalPoints: number }>
  submitQuizScore: (slug: string, score: number) => Promise<{ totalPoints: number; newBadges: string[] }>
  submitExamScore: (slug: string, score: number) => Promise<{ totalPoints: number; newBadges: string[] }>
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  records: [],
  isLoading: false,

  load: async () => {
    set({ isLoading: true })
    try {
      const { progress } = await api.getProgress()
      set({ records: progress, isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },

  getBySlug: (slug) => get().records.find((r) => r.chapterSlug === slug),

  markCourseComplete: async (slug) => {
    const { progress, totalPoints } = await api.markCourseComplete(slug)
    set((state) => {
      const exists = state.records.find((r) => r.chapterSlug === slug)
      if (exists) {
        return { records: state.records.map((r) => (r.chapterSlug === slug ? progress : r)) }
      }
      return { records: [...state.records, progress] }
    })
    return { totalPoints }
  },

  submitQuizScore: async (slug, score) => {
    const { progress, totalPoints, newBadges } = await api.submitQuizScore(slug, score)
    set((state) => {
      const exists = state.records.find((r) => r.chapterSlug === slug)
      if (exists) {
        return { records: state.records.map((r) => (r.chapterSlug === slug ? progress : r)) }
      }
      return { records: [...state.records, progress] }
    })
    return { totalPoints, newBadges }
  },

  submitExamScore: async (slug, score) => {
    const { progress, totalPoints, newBadges } = await api.submitExamScore(slug, score)
    set((state) => {
      const exists = state.records.find((r) => r.chapterSlug === slug)
      if (exists) {
        return { records: state.records.map((r) => (r.chapterSlug === slug ? progress : r)) }
      }
      return { records: [...state.records, progress] }
    })
    return { totalPoints, newBadges }
  },
}))
