import { useQuery } from '@tanstack/react-query'
import { useLangStore } from '../stores/langStore'
import { useFormationFromUrl } from './useTranslation'
import { contentApi } from '../services/contentApi'
import type {
  FormationDTO, ChapterDTO, ChapterDetailDTO,
  QuizQuestionDTO, GlossaryTermDTO, FlashcardDTO, CliLabDTO,
} from '../services/contentApi'

// -- Formations --

export function useFormationsApi() {
  const lang = useLangStore((s) => s.lang)
  return useQuery({
    queryKey: ['formations', lang],
    queryFn: () => contentApi.getFormations(lang).then(r => r.formations),
  })
}

export function useFormationApi(id?: string) {
  const lang = useLangStore((s) => s.lang)
  const formation = useFormationFromUrl()
  const formationId = id || formation
  return useQuery({
    queryKey: ['formation', formationId, lang],
    queryFn: () => contentApi.getFormation(formationId, lang).then(r => r.formation),
    enabled: !!formationId,
  })
}

// -- Chapters --

export function useChaptersApi() {
  const lang = useLangStore((s) => s.lang)
  const formation = useFormationFromUrl()
  return useQuery<ChapterDTO[]>({
    queryKey: ['chapters', formation, lang],
    queryFn: () => contentApi.getChapters(formation, lang).then(r => r.chapters),
    enabled: !!formation,
  })
}

export function useChapterApi(slug: string) {
  const lang = useLangStore((s) => s.lang)
  const formation = useFormationFromUrl()
  return useQuery<ChapterDetailDTO>({
    queryKey: ['chapter', formation, slug, lang],
    queryFn: () => contentApi.getChapter(formation, slug, lang).then(r => r.chapter),
    enabled: !!formation && !!slug,
  })
}

// -- Quizzes --

export function useQuizApi(slug: string) {
  const lang = useLangStore((s) => s.lang)
  const formation = useFormationFromUrl()
  return useQuery<QuizQuestionDTO[]>({
    queryKey: ['quiz', formation, slug, lang],
    queryFn: () => contentApi.getQuiz(formation, slug, lang).then(r => r.questions),
    enabled: !!formation && !!slug,
  })
}

// -- Exams --

export function useExamApi(programNum: number) {
  const lang = useLangStore((s) => s.lang)
  const formation = useFormationFromUrl()
  return useQuery<QuizQuestionDTO[]>({
    queryKey: ['exam', formation, programNum, lang],
    queryFn: () => contentApi.getExam(formation, programNum, lang).then(r => r.questions),
    enabled: !!formation && programNum > 0,
  })
}

// -- Glossary --

export function useGlossaryApi() {
  const lang = useLangStore((s) => s.lang)
  const formation = useFormationFromUrl()
  return useQuery<GlossaryTermDTO[]>({
    queryKey: ['glossary', formation, lang],
    queryFn: () => contentApi.getGlossary(formation, lang).then(r => r.terms),
    enabled: !!formation,
  })
}

// -- Flashcards --

export function useFlashcardsApi() {
  const lang = useLangStore((s) => s.lang)
  const formation = useFormationFromUrl()
  return useQuery<FlashcardDTO[]>({
    queryKey: ['flashcards', formation, lang],
    queryFn: () => contentApi.getFlashcards(formation, lang).then(r => r.flashcards),
    enabled: !!formation,
  })
}

// -- CLI Labs --

export function useCliLabsApi() {
  const lang = useLangStore((s) => s.lang)
  const formation = useFormationFromUrl()
  return useQuery<CliLabDTO[]>({
    queryKey: ['cli-labs', formation, lang],
    queryFn: () => contentApi.getCliLabs(formation, lang).then(r => r.labs),
    enabled: !!formation,
  })
}
