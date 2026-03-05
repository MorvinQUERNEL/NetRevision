const API_BASE = '/api'

function getToken(): string | null {
  return localStorage.getItem('jwt_token')
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })

  if (res.status === 401) {
    localStorage.removeItem('jwt_token')
    window.location.href = '/login'
    throw new Error(localStorage.getItem('lang') === 'en' ? 'Not authenticated' : 'Non authentifié')
  }

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || (localStorage.getItem('lang') === 'en' ? 'Server error' : 'Erreur serveur'))
  }

  return data as T
}

// Auth
export const api = {
  register: (data: { email: string; password: string; firstName: string; lastName: string; pseudo?: string; newsletterOptIn?: boolean }) =>
    request<{ token: string; user: any }>('/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    request<{ token: string; user: any }>('/login', { method: 'POST', body: JSON.stringify(data) }),

  googleAuth: (credential: string) =>
    request<{ token: string; user: any }>('/oauth/google/callback', { method: 'POST', body: JSON.stringify({ credential }) }),

  getMe: () => request<{ user: any }>('/me'),

  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    request<{ message: string }>('/me/password', { method: 'PUT', body: JSON.stringify(data) }),

  updatePseudo: (pseudo: string) =>
    request<{ user: any }>('/me/pseudo', { method: 'PUT', body: JSON.stringify({ pseudo }) }),

  updateNewsletter: (newsletterOptIn: boolean) =>
    request<{ user: any }>('/me/newsletter', { method: 'PUT', body: JSON.stringify({ newsletterOptIn }) }),

  // Progress
  getProgress: () => request<{ progress: any[] }>('/progress'),

  markCourseComplete: (slug: string) =>
    request<{ progress: any; totalPoints: number }>(`/progress/${slug}/course`, { method: 'POST' }),

  submitQuizScore: (slug: string, score: number) =>
    request<{ progress: any; totalPoints: number; newBadges: string[] }>(`/progress/${slug}/quiz`, { method: 'POST', body: JSON.stringify({ score }) }),

  submitExamScore: (slug: string, score: number) =>
    request<{ progress: any; totalPoints: number; newBadges: string[] }>(`/progress/${slug}/exam`, { method: 'POST', body: JSON.stringify({ score }) }),

  incrementFlashcards: (slug: string) =>
    request<{ progress: any }>(`/progress/${slug}/flashcards`, { method: 'POST' }),

  // Leaderboard
  getLeaderboard: () => request<{ leaderboard: any[] }>('/leaderboard'),
  getMyRank: () => request<{ rank: number; totalPoints: number; totalUsers: number }>('/leaderboard/me'),

  // Badges
  getBadges: () => request<{ badges: any[] }>('/badges'),
  getMyBadges: () => request<{ badges: any[] }>('/badges/mine'),

  // Notes
  getNotes: () => request<{ notes: any[] }>('/notes'),
  getNote: (slug: string) => request<{ note: any | null }>(`/notes/${slug}`),
  saveNote: (slug: string, content: string) =>
    request<{ note: any; totalPoints: number }>(`/notes/${slug}`, { method: 'PUT', body: JSON.stringify({ content }) }),

  // Stats
  getStats: () => request<{ stats: any }>('/stats'),

  // Password reset
  forgotPassword: (email: string) =>
    request<{ message: string }>('/password/forgot', { method: 'POST', body: JSON.stringify({ email }) }),

  resetPassword: (token: string, password: string) =>
    request<{ message: string }>('/password/reset', { method: 'POST', body: JSON.stringify({ token, password }) }),
}
