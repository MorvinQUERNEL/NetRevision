const API_BASE = '/api'

function getToken(): string | null {
  return localStorage.getItem('jwt_token')
}

async function request<T>(path: string): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${path}`, { headers })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || 'Server error')
  }

  return res.json() as Promise<T>
}

function langParam(lang: string): string {
  return lang === 'en' ? '?lang=en' : ''
}

export interface FormationDTO {
  id: string
  name: string
  description: string
  accentColor: string
  icon: string
  orderIndex: number
  isActive: boolean
  programs: ProgramDTO[]
}

export interface ProgramDTO {
  id: string
  formationId: string
  name: string
  color: string
  description: string
  orderIndex: number
}

export interface ChapterDTO {
  id: number
  slug: string
  title: string
  subtitle: string | null
  description: string | null
  icon: string | null
  color: string | null
  duration: string | null
  level: string | null
  videoId: string | null
  orderIndex: number
  program: string | null
  programId: string | null
  programName: string | null
  programColor: string | null
}

export interface ChapterDetailDTO {
  id: number
  slug: string
  title: string
  subtitle: string | null
  description: string | null
  videoId: string | null
  sections: { id: number; title: string; content: string; orderIndex: number }[]
}

export interface QuizQuestionDTO {
  id: number
  question: string
  options: string[]
  correctIndex: number
  explanation: string | null
}

export interface GlossaryTermDTO {
  id: number
  term: string
  definition: string
  category: string | null
}

export interface FlashcardDTO {
  id: number
  question: string
  answer: string
  category: string | null
  difficulty: string
}

export interface CliLabDTO {
  id: number
  title: string
  description: string | null
  scenario: any
  difficulty: string
  orderIndex: number
}

export const contentApi = {
  getFormations: (lang: string = 'fr') =>
    request<{ formations: FormationDTO[] }>(`/formations${langParam(lang)}`),

  getFormation: (id: string, lang: string = 'fr') =>
    request<{ formation: FormationDTO }>(`/formations/${id}${langParam(lang)}`),

  getChapters: (formationId: string, lang: string = 'fr') =>
    request<{ chapters: ChapterDTO[] }>(`/formations/${formationId}/chapters${langParam(lang)}`),

  getChapter: (formationId: string, slug: string, lang: string = 'fr') =>
    request<{ chapter: ChapterDetailDTO }>(`/formations/${formationId}/chapters/${slug}${langParam(lang)}`),

  getQuiz: (formationId: string, slug: string, lang: string = 'fr') =>
    request<{ questions: QuizQuestionDTO[] }>(`/formations/${formationId}/quizzes/${slug}${langParam(lang)}`),

  getExam: (formationId: string, programNum: number, lang: string = 'fr') =>
    request<{ questions: QuizQuestionDTO[] }>(`/formations/${formationId}/exams/${programNum}${langParam(lang)}`),

  getGlossary: (formationId: string, lang: string = 'fr') =>
    request<{ terms: GlossaryTermDTO[] }>(`/formations/${formationId}/glossary${langParam(lang)}`),

  getFlashcards: (formationId: string, lang: string = 'fr') =>
    request<{ flashcards: FlashcardDTO[] }>(`/formations/${formationId}/flashcards${langParam(lang)}`),

  getCliLabs: (formationId: string, lang: string = 'fr') =>
    request<{ labs: CliLabDTO[] }>(`/formations/${formationId}/cli-labs${langParam(lang)}`),
}
