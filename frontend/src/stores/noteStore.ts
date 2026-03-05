import { create } from 'zustand'
import { api } from '../services/api'

export interface NoteData {
  id: number
  chapterSlug: string
  content: string
  createdAt: string
  updatedAt: string
}

interface NoteState {
  notes: NoteData[]
  isLoading: boolean

  loadAll: () => Promise<void>
  getBySlug: (slug: string) => NoteData | undefined
  save: (slug: string, content: string) => Promise<number>
}

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: [],
  isLoading: false,

  loadAll: async () => {
    set({ isLoading: true })
    try {
      const { notes } = await api.getNotes()
      set({ notes, isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },

  getBySlug: (slug) => get().notes.find((n) => n.chapterSlug === slug),

  save: async (slug, content) => {
    const { note, totalPoints } = await api.saveNote(slug, content)
    set((state) => {
      const exists = state.notes.find((n) => n.chapterSlug === slug)
      if (exists) {
        return { notes: state.notes.map((n) => (n.chapterSlug === slug ? note : n)) }
      }
      return { notes: [...state.notes, note] }
    })
    return totalPoints
  },
}))
