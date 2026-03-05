import { useParams } from 'react-router-dom'
import { useLangStore } from '../stores/langStore'
import { useFormationStore, isValidFormation, type FormationType } from '../stores/formationStore'

// Reseaux data
import { chapters } from '../data/chapters'
import { chapters2 } from '../data/chapters2'
import { chapters3 } from '../data/chapters3'
import { chapters4 } from '../data/chapters4'
import { chapters5 } from '../data/chapters5'
import { chapters6 } from '../data/chapters6'
import { chapters as chapters_en } from '../data/chapters_en'
import { chapters2 as chapters2_en } from '../data/chapters2_en'
import { chapters3 as chapters3_en } from '../data/chapters3_en'
import { chapters4 as chapters4_en } from '../data/chapters4_en'
import { chapters5 as chapters5_en } from '../data/chapters5_en'
import { chapters6 as chapters6_en } from '../data/chapters6_en'
import { quizzes } from '../data/quizzes'
import { quizzes2 } from '../data/quizzes2'
import { quizzes3 } from '../data/quizzes3'
import { quizzes4 } from '../data/quizzes4'
import { quizzes5 } from '../data/quizzes5'
import { quizzes6 } from '../data/quizzes6'
import { quizzes as quizzes_en } from '../data/quizzes_en'
import { quizzes2 as quizzes2_en } from '../data/quizzes2_en'
import { quizzes3 as quizzes3_en } from '../data/quizzes3_en'
import { quizzes4 as quizzes4_en } from '../data/quizzes4_en'
import { quizzes5 as quizzes5_en } from '../data/quizzes5_en'
import { quizzes6 as quizzes6_en } from '../data/quizzes6_en'
import { finalExamQuestions } from '../data/finalExam'
import { finalExam2Questions } from '../data/finalExam2'
import { finalExam3Questions } from '../data/finalExam3'
import { finalExam4Questions } from '../data/finalExam4'
import { finalExam5Questions } from '../data/finalExam5'
import { finalExam6Questions } from '../data/finalExam6'
import { finalExamQuestions as finalExamQuestions_en } from '../data/finalExam_en'
import { finalExam2Questions as finalExam2Questions_en } from '../data/finalExam2_en'
import { finalExam3Questions as finalExam3Questions_en } from '../data/finalExam3_en'
import { finalExam4Questions as finalExam4Questions_en } from '../data/finalExam4_en'
import { finalExam5Questions as finalExam5Questions_en } from '../data/finalExam5_en'
import { finalExam6Questions as finalExam6Questions_en } from '../data/finalExam6_en'
import { glossaryTerms } from '../data/glossaryTerms'
import { glossaryTerms as glossaryTerms_en } from '../data/glossaryTerms_en'
import { flashcardData } from '../data/flashcardsData'
import { flashcardData as flashcardData_en } from '../data/flashcardsData_en'
import { protocols, protocolCategories } from '../data/protocols'
import { protocols as protocols_en, protocolCategories as protocolCategories_en } from '../data/protocols_en'
import { levels } from '../data/levels'
import { levels as levels_en } from '../data/levels_en'
import { cliLabs } from '../data/cliLabs'
import { cliLabs as cliLabs_en } from '../data/cliLabs_en'
import { packetScenarios } from '../data/packetScenarios'
import { packetScenarios as packetScenarios_en } from '../data/packetScenarios_en'
import { gridLevels, portMatches, headerFields } from '../data/miniGamesData'
import { gridLevels as gridLevels_en, portMatches as portMatches_en, headerFields as headerFields_en } from '../data/miniGamesData_en'
import { ctfChallenges } from '../data/ctfChallenges'
import { ctfChallenges as ctfChallenges_en } from '../data/ctfChallenges_en'
import { megaExamSections } from '../data/megaExam'
import { megaExamSections_en } from '../data/megaExam_en'

// DevOps data
import { chapters as devopsChapters1 } from '../data/devops/chapters1'
import { chapters as devopsChapters2 } from '../data/devops/chapters2'
import { chapters as devopsChapters3 } from '../data/devops/chapters3'
import { chapters as devopsChapters4 } from '../data/devops/chapters4'
import { chapters as devopsChapters5 } from '../data/devops/chapters5'
import { chapters as devopsChapters6 } from '../data/devops/chapters6'
import { quizzes as devopsQuizzes1 } from '../data/devops/quizzes1'
import { quizzes as devopsQuizzes2 } from '../data/devops/quizzes2'
import { quizzes as devopsQuizzes3 } from '../data/devops/quizzes3'
import { quizzes as devopsQuizzes4 } from '../data/devops/quizzes4'
import { quizzes as devopsQuizzes5 } from '../data/devops/quizzes5'
import { quizzes as devopsQuizzes6 } from '../data/devops/quizzes6'
import { finalExamQuestions as devopsFinalExam1 } from '../data/devops/finalExam1'
import { finalExamQuestions as devopsFinalExam2 } from '../data/devops/finalExam2'
import { finalExamQuestions as devopsFinalExam3 } from '../data/devops/finalExam3'
import { finalExamQuestions as devopsFinalExam4 } from '../data/devops/finalExam4'
import { finalExamQuestions as devopsFinalExam5 } from '../data/devops/finalExam5'
import { finalExamQuestions as devopsFinalExam6 } from '../data/devops/finalExam6'
import { glossaryTerms as devopsGlossaryTerms } from '../data/devops/glossaryTerms'
import { flashcardData as devopsFlashcardData } from '../data/devops/flashcardsData'
import { cliLabs as devopsCliLabs } from '../data/devops/cliLabs'
// DevOps EN
import { chapters as devopsChapters1_en } from '../data/devops/chapters1_en'
import { chapters as devopsChapters2_en } from '../data/devops/chapters2_en'
import { chapters as devopsChapters3_en } from '../data/devops/chapters3_en'
import { chapters as devopsChapters4_en } from '../data/devops/chapters4_en'
import { chapters as devopsChapters5_en } from '../data/devops/chapters5_en'
import { chapters as devopsChapters6_en } from '../data/devops/chapters6_en'
import { quizzes as devopsQuizzes1_en } from '../data/devops/quizzes1_en'
import { quizzes as devopsQuizzes2_en } from '../data/devops/quizzes2_en'
import { quizzes as devopsQuizzes3_en } from '../data/devops/quizzes3_en'
import { quizzes as devopsQuizzes4_en } from '../data/devops/quizzes4_en'
import { quizzes as devopsQuizzes5_en } from '../data/devops/quizzes5_en'
import { quizzes as devopsQuizzes6_en } from '../data/devops/quizzes6_en'
import { finalExamQuestions as devopsFinalExam1_en } from '../data/devops/finalExam1_en'
import { finalExamQuestions as devopsFinalExam2_en } from '../data/devops/finalExam2_en'
import { finalExamQuestions as devopsFinalExam3_en } from '../data/devops/finalExam3_en'
import { finalExamQuestions as devopsFinalExam4_en } from '../data/devops/finalExam4_en'
import { finalExamQuestions as devopsFinalExam5_en } from '../data/devops/finalExam5_en'
import { finalExamQuestions as devopsFinalExam6_en } from '../data/devops/finalExam6_en'
import { glossaryTerms as devopsGlossaryTerms_en } from '../data/devops/glossaryTerms_en'
import { flashcardData as devopsFlashcardData_en } from '../data/devops/flashcardsData_en'
import { cliLabs as devopsCliLabs_en } from '../data/devops/cliLabs_en'

// --- Formation from URL hook ---
export function useFormationFromUrl(): string {
  const { formation } = useParams<{ formation: string }>()
  const storeFormation = useFormationStore((s) => s.currentFormation)
  if (formation && isValidFormation(formation)) return formation
  return storeFormation
}

// Simple inline translation: t('French text', 'English text')
export function useTranslation() {
  const lang = useLangStore((s) => s.lang)

  function t(fr: string, en: string): string {
    return lang === 'en' ? en : fr
  }

  return { t, lang }
}

// Data hooks — return the correct language version AND correct formation data
export function useChapters() {
  const lang = useLangStore((s) => s.lang)
  const formation = useFormationFromUrl()

  if (formation === 'devops') {
    if (lang === 'en') return [...devopsChapters1_en, ...devopsChapters2_en, ...devopsChapters3_en, ...devopsChapters4_en, ...devopsChapters5_en, ...devopsChapters6_en]
    return [...devopsChapters1, ...devopsChapters2, ...devopsChapters3, ...devopsChapters4, ...devopsChapters5, ...devopsChapters6]
  }
  if (lang === 'en') {
    return [...chapters_en, ...chapters2_en, ...chapters3_en, ...chapters4_en, ...chapters5_en, ...chapters6_en]
  }
  return [...chapters, ...chapters2, ...chapters3, ...chapters4, ...chapters5, ...chapters6]
}

export function useChaptersByProgram() {
  const lang = useLangStore((s) => s.lang)
  const formation = useFormationFromUrl()

  if (formation === 'devops') {
    if (lang === 'en') return {
      chapters: devopsChapters1_en, chapters2: devopsChapters2_en, chapters3: devopsChapters3_en,
      chapters4: devopsChapters4_en, chapters5: devopsChapters5_en, chapters6: devopsChapters6_en,
    }
    return {
      chapters: devopsChapters1, chapters2: devopsChapters2, chapters3: devopsChapters3,
      chapters4: devopsChapters4, chapters5: devopsChapters5, chapters6: devopsChapters6,
    }
  }
  if (lang === 'en') {
    return { chapters: chapters_en, chapters2: chapters2_en, chapters3: chapters3_en, chapters4: chapters4_en, chapters5: chapters5_en, chapters6: chapters6_en }
  }
  return { chapters, chapters2, chapters3, chapters4, chapters5, chapters6 }
}

export function useQuizzes() {
  const lang = useLangStore((s) => s.lang)
  const formation = useFormationFromUrl()

  if (formation === 'devops') {
    if (lang === 'en') return { ...devopsQuizzes1_en, ...devopsQuizzes2_en, ...devopsQuizzes3_en, ...devopsQuizzes4_en, ...devopsQuizzes5_en, ...devopsQuizzes6_en }
    return { ...devopsQuizzes1, ...devopsQuizzes2, ...devopsQuizzes3, ...devopsQuizzes4, ...devopsQuizzes5, ...devopsQuizzes6 }
  }
  if (lang === 'en') {
    return { ...quizzes_en, ...quizzes2_en, ...quizzes3_en, ...quizzes4_en, ...quizzes5_en, ...quizzes6_en }
  }
  return { ...quizzes, ...quizzes2, ...quizzes3, ...quizzes4, ...quizzes5, ...quizzes6 }
}

export function useFinalExam(examNumber: number) {
  const lang = useLangStore((s) => s.lang)
  const formation = useFormationFromUrl()

  if (formation === 'devops') {
    if (lang === 'en') {
      const devopsExamsEn: Record<number, typeof devopsFinalExam1_en> = {
        1: devopsFinalExam1_en, 2: devopsFinalExam2_en, 3: devopsFinalExam3_en,
        4: devopsFinalExam4_en, 5: devopsFinalExam5_en, 6: devopsFinalExam6_en,
      }
      return devopsExamsEn[examNumber] || devopsExamsEn[1]
    }
    const devopsExams: Record<number, typeof devopsFinalExam1> = {
      1: devopsFinalExam1, 2: devopsFinalExam2, 3: devopsFinalExam3,
      4: devopsFinalExam4, 5: devopsFinalExam5, 6: devopsFinalExam6,
    }
    return devopsExams[examNumber] || devopsExams[1]
  }

  const exams = {
    1: lang === 'en' ? finalExamQuestions_en : finalExamQuestions,
    2: lang === 'en' ? finalExam2Questions_en : finalExam2Questions,
    3: lang === 'en' ? finalExam3Questions_en : finalExam3Questions,
    4: lang === 'en' ? finalExam4Questions_en : finalExam4Questions,
    5: lang === 'en' ? finalExam5Questions_en : finalExam5Questions,
    6: lang === 'en' ? finalExam6Questions_en : finalExam6Questions,
  }
  return exams[examNumber as keyof typeof exams] || exams[1]
}

export function useGlossary() {
  const lang = useLangStore((s) => s.lang)
  const formation = useFormationFromUrl()
  if (formation === 'devops') return lang === 'en' ? devopsGlossaryTerms_en : devopsGlossaryTerms
  return lang === 'en' ? glossaryTerms_en : glossaryTerms
}

export function useFlashcards() {
  const lang = useLangStore((s) => s.lang)
  const formation = useFormationFromUrl()
  if (formation === 'devops') return lang === 'en' ? devopsFlashcardData_en : devopsFlashcardData
  return lang === 'en' ? flashcardData_en : flashcardData
}

export function useProtocols() {
  const lang = useLangStore((s) => s.lang)
  return {
    protocols: lang === 'en' ? protocols_en : protocols,
    protocolCategories: lang === 'en' ? protocolCategories_en : protocolCategories,
  }
}

export function useLevels() {
  const lang = useLangStore((s) => s.lang)
  return lang === 'en' ? levels_en : levels
}

export function useCliLabs() {
  const lang = useLangStore((s) => s.lang)
  const formation = useFormationFromUrl()
  if (formation === 'devops') return (lang === 'en' ? devopsCliLabs_en : devopsCliLabs) as any[]
  return lang === 'en' ? cliLabs_en : cliLabs
}

export function useDevOpsCliLabs() {
  return devopsCliLabs
}

export function usePacketScenarios() {
  const lang = useLangStore((s) => s.lang)
  return lang === 'en' ? packetScenarios_en : packetScenarios
}

export function useMiniGamesData() {
  const lang = useLangStore((s) => s.lang)
  return {
    gridLevels: lang === 'en' ? gridLevels_en : gridLevels,
    portMatches: lang === 'en' ? portMatches_en : portMatches,
    headerFields: lang === 'en' ? headerFields_en : headerFields,
  }
}

export function useCtfChallenges() {
  const lang = useLangStore((s) => s.lang)
  return lang === 'en' ? ctfChallenges_en : ctfChallenges
}

export function useMegaExam() {
  const lang = useLangStore((s) => s.lang)
  return lang === 'en' ? megaExamSections_en : megaExamSections
}

export function useQuizzesByProgram() {
  const lang = useLangStore((s) => s.lang)
  const formation = useFormationFromUrl()

  if (formation === 'devops') {
    if (lang === 'en') {
      return [devopsQuizzes1_en, devopsQuizzes2_en, devopsQuizzes3_en, devopsQuizzes4_en, devopsQuizzes5_en, devopsQuizzes6_en]
    }
    return [devopsQuizzes1, devopsQuizzes2, devopsQuizzes3, devopsQuizzes4, devopsQuizzes5, devopsQuizzes6]
  }
  if (lang === 'en') {
    return [quizzes_en, quizzes2_en, quizzes3_en, quizzes4_en, quizzes5_en, quizzes6_en]
  }
  return [quizzes, quizzes2, quizzes3, quizzes4, quizzes5, quizzes6]
}
