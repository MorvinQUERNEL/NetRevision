import { create } from 'zustand'

export interface Student {
  id: string
  name: string
  email: string
  totalPoints: number
  coursesCompleted: number
  avgQuizScore: number
  lastActive: string
  needsHelp: boolean
}

export interface Cohort {
  id: string
  name: string
  createdAt: string
  studentEmails: string[]
}

interface TrainerState {
  cohorts: Cohort[]
  loadCohorts: () => void
  createCohort: (name: string, emails: string[]) => void
  deleteCohort: (id: string) => void
}

const STORAGE_KEY = 'nr_trainer_cohorts'

export const useTrainerStore = create<TrainerState>((set) => ({
  cohorts: [],

  loadCohorts: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) set({ cohorts: JSON.parse(stored) })
    } catch {
      set({ cohorts: [] })
    }
  },

  createCohort: (name, emails) => {
    const c: Cohort = {
      id: `cohort-${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
      studentEmails: emails,
    }
    set(state => {
      const updated = [...state.cohorts, c]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return { cohorts: updated }
    })
  },

  deleteCohort: (id) => {
    set(state => {
      const updated = state.cohorts.filter(c => c.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return { cohorts: updated }
    })
  },
}))

const NAMES = [
  'Lucas Martin', 'Emma Bernard', 'Thomas Dubois', 'Chloe Petit',
  'Hugo Durand', 'Lea Leroy', 'Nathan Moreau', 'Manon Simon',
  'Louis Laurent', 'Sarah Michel', 'Arthur Lefebvre', 'Jade Garcia',
  'Jules Roux', 'Camille Robert', 'Maxime Vincent', 'Zoe Fournier',
]

export function generateMockStudents(count: number): Student[] {
  return Array.from({ length: count }, (_, i) => {
    const name = NAMES[i % NAMES.length]
    const avg = 50 + Math.random() * 45
    return {
      id: `student-${i}`,
      name,
      email: name.toLowerCase().replace(' ', '.') + '@example.com',
      totalPoints: Math.floor(Math.random() * 3000),
      coursesCompleted: Math.floor(Math.random() * 32),
      avgQuizScore: Math.round(avg),
      lastActive: new Date(Date.now() - Math.random() * 7 * 86400000).toISOString(),
      needsHelp: avg < 70,
    }
  }).sort((a, b) => b.totalPoints - a.totalPoints)
}
