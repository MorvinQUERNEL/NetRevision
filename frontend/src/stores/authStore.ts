import { create } from 'zustand'
import { api } from '../services/api'

export interface UserData {
  id: string
  email: string
  firstName: string
  lastName: string
  pseudo: string | null
  avatarUrl: string | null
  authProvider: string
  totalPoints: number
  loginStreak: number
  createdAt: string
  lastLoginAt: string | null
  newsletterOptIn?: boolean
}

interface AuthState {
  user: UserData | null
  isLoading: boolean
  isAuthenticated: boolean

  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, firstName: string, lastName: string, pseudo?: string, newsletterOptIn?: boolean) => Promise<void>
  googleAuth: (credential: string) => Promise<void>
  logout: () => void
  loadUser: () => Promise<void>
  updatePoints: (points: number) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email, password) => {
    const { token, user } = await api.login({ email, password })
    localStorage.setItem('jwt_token', token)
    set({ user, isAuthenticated: true })
  },

  register: async (email, password, firstName, lastName, pseudo?, newsletterOptIn?) => {
    const { token, user } = await api.register({ email, password, firstName, lastName, pseudo, newsletterOptIn })
    localStorage.setItem('jwt_token', token)
    set({ user, isAuthenticated: true })
  },

  googleAuth: async (credential) => {
    const { token, user } = await api.googleAuth(credential)
    localStorage.setItem('jwt_token', token)
    set({ user, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem('jwt_token')
    set({ user: null, isAuthenticated: false })
  },

  loadUser: async () => {
    const token = localStorage.getItem('jwt_token')
    if (!token) {
      set({ isLoading: false })
      return
    }
    try {
      const { user } = await api.getMe()
      set({ user, isAuthenticated: true, isLoading: false })
    } catch {
      localStorage.removeItem('jwt_token')
      set({ isLoading: false })
    }
  },

  updatePoints: (points) => {
    set((state) => ({
      user: state.user ? { ...state.user, totalPoints: points } : null,
    }))
  },
}))
