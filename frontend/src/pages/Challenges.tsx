import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Target, Trophy, Flame, Clock, CheckCircle, Star, Zap, BookOpen } from 'lucide-react'
import { useProgressStore, ProgressRecord } from '../stores/progressStore'
import { useAuthStore } from '../stores/authStore'
import { useLangStore } from '../stores/langStore'
import { useChapters, useChaptersByProgram, useFormationFromUrl } from '../hooks/useTranslation'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChallengeTemplate {
  id: string
  type: string
  icon: React.ReactNode
  title: string
  description: string
  target: number
  reward: number
  check: (records: ProgressRecord[], weekRecords: ProgressRecord[], streak: number) => number
}

interface ChallengeState {
  id: string
  progress: number
  completed: boolean
  completedAt: string | null
}

interface WeekData {
  weekNumber: number
  year: number
  challenges: ChallengeState[]
  startDate: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// allChapters and programme slugs are now computed inside the component via hooks

function getWeekNumber(date: Date = new Date()): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

function getWeekYear(date: Date = new Date()): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  return d.getUTCFullYear()
}

function getMondayOfWeek(weekNumber: number, year: number): Date {
  const jan4 = new Date(Date.UTC(year, 0, 4))
  const dayOfWeek = jan4.getUTCDay() || 7
  const monday = new Date(jan4)
  monday.setUTCDate(jan4.getUTCDate() - dayOfWeek + 1 + (weekNumber - 1) * 7)
  return monday
}

function getSundayOfWeek(weekNumber: number, year: number): Date {
  const monday = getMondayOfWeek(weekNumber, year)
  const sunday = new Date(monday)
  sunday.setUTCDate(monday.getUTCDate() + 6)
  return sunday
}

function getNextMonday(): Date {
  const now = new Date()
  const day = now.getDay()
  const diff = day === 0 ? 1 : 8 - day
  const next = new Date(now)
  next.setDate(now.getDate() + diff)
  next.setHours(0, 0, 0, 0)
  return next
}

function formatDate(date: Date, lang: string): string {
  return date.toLocaleDateString(lang === 'en' ? 'en-US' : 'fr-FR', { day: 'numeric', month: 'short' })
}

function formatCountdown(ms: number, lang: string): string {
  if (ms <= 0) return lang === 'en' ? '0d 0h 0m' : '0j 0h 0m'
  const totalSeconds = Math.floor(ms / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const d = lang === 'en' ? 'd' : 'j'
  if (days > 0) return `${days}${d} ${hours}h ${minutes}m`
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`
  return `${minutes}m ${seconds}s`
}

function getRecordsForWeek(records: ProgressRecord[], weekNumber: number, year: number): ProgressRecord[] {
  const monday = getMondayOfWeek(weekNumber, year)
  const sunday = getSundayOfWeek(weekNumber, year)
  sunday.setUTCHours(23, 59, 59, 999)

  return records.filter((r) => {
    const updated = new Date(r.updatedAt)
    return updated >= monday && updated <= sunday
  })
}

// ---------------------------------------------------------------------------
// Challenge Templates (8+)
// ---------------------------------------------------------------------------

interface ChallengeI18n {
  title_fr: string
  title_en: string
  description_fr: string
  description_en: string
}

const challengeI18n: Record<string, ChallengeI18n> = {
  complete_3_quiz: { title_fr: 'Complete 3 quiz', title_en: 'Complete 3 quizzes', description_fr: 'Termine 3 quiz cette semaine, quel que soit le score.', description_en: 'Complete 3 quizzes this week, regardless of the score.' },
  perfect_score: { title_fr: 'Score parfait', title_en: 'Perfect score', description_fr: 'Obtiens 100% sur n\'importe quel quiz.', description_en: 'Score 100% on any quiz.' },
  streak_3_days: { title_fr: 'Streak de 3 jours', title_en: '3-day streak', description_fr: 'Connecte-toi 3 jours consecutifs.', description_en: 'Log in for 3 consecutive days.' },
  complete_2_chapters: { title_fr: 'Complete 2 chapitres', title_en: 'Complete 2 chapters', description_fr: 'Lis et termine 2 chapitres de cours.', description_en: 'Read and complete 2 course chapters.' },
  pass_exam: { title_fr: 'Passe un examen', title_en: 'Pass an exam', description_fr: 'Passe un examen final (score >= 70%).', description_en: 'Pass a final exam (score >= 70%).' },
  score_80_on_2: { title_fr: 'Score > 80% sur 2 quiz', title_en: 'Score > 80% on 2 quizzes', description_fr: 'Obtiens plus de 80% sur au moins 2 quiz differents.', description_en: 'Score over 80% on at least 2 different quizzes.' },
  review_flashcards: { title_fr: 'Revise 5 flashcards', title_en: 'Review 5 flashcards', description_fr: 'Revise les flashcards d\'au moins 5 chapitres.', description_en: 'Review flashcards from at least 5 chapters.' },
  complete_chapter_prog1: { title_fr: 'Complete un chapitre du Programme 1', title_en: 'Complete a Program 1 chapter', description_fr: 'Termine un chapitre des Fondamentaux (Programme 1).', description_en: 'Complete a chapter from the Fundamentals (Program 1).' },
  complete_5_quiz: { title_fr: 'Complete 5 quiz', title_en: 'Complete 5 quizzes', description_fr: 'Termine 5 quiz cette semaine pour un bonus massif.', description_en: 'Complete 5 quizzes this week for a massive bonus.' },
  streak_5_days: { title_fr: 'Streak de 5 jours', title_en: '5-day streak', description_fr: 'Connecte-toi 5 jours consecutifs cette semaine.', description_en: 'Log in for 5 consecutive days this week.' },
  complete_chapter_prog2: { title_fr: 'Complete un chapitre du Programme 2', title_en: 'Complete a Program 2 chapter', description_fr: 'Termine un chapitre du Programme Avance.', description_en: 'Complete a chapter from the Advanced Program.' },
  complete_chapter_prog3: { title_fr: 'Complete un chapitre du Programme 3', title_en: 'Complete a Program 3 chapter', description_fr: 'Termine un chapitre du Programme Entreprise.', description_en: 'Complete a chapter from the Enterprise Program.' },
  score_90_on_1: { title_fr: 'Score > 90% sur un quiz', title_en: 'Score > 90% on a quiz', description_fr: 'Obtiens un score superieur a 90% sur un quiz.', description_en: 'Score over 90% on a quiz.' },
  complete_4_chapters: { title_fr: 'Complete 4 chapitres', title_en: 'Complete 4 chapters', description_fr: 'Lis et termine 4 chapitres cette semaine.', description_en: 'Read and complete 4 chapters this week.' },
}

function buildChallengeTemplates(p1Slugs: string[], p2Slugs: string[], p3Slugs: string[]): ChallengeTemplate[] {
  return [
    {
      id: 'complete_3_quiz',
      type: 'quiz_count',
      icon: <Target size={22} />,
      title: 'Complete 3 quiz',
      description: 'Termine 3 quiz cette semaine, quel que soit le score.',
      target: 3,
      reward: 50,
      check: (_all, weekRecords) =>
        weekRecords.filter((r) => r.quizScore !== null).length,
    },
    {
      id: 'perfect_score',
      type: 'perfect_quiz',
      icon: <Star size={22} />,
      title: 'Score parfait',
      description: 'Obtiens 100% sur n\'importe quel quiz.',
      target: 1,
      reward: 75,
      check: (_all, weekRecords) =>
        weekRecords.filter((r) => r.quizScore === 100).length >= 1 ? 1 : 0,
    },
    {
      id: 'streak_3_days',
      type: 'streak',
      icon: <Flame size={22} />,
      title: 'Streak de 3 jours',
      description: 'Connecte-toi 3 jours consecutifs.',
      target: 3,
      reward: 40,
      check: (_all, _week, streak) => Math.min(streak, 3),
    },
    {
      id: 'complete_2_chapters',
      type: 'chapter_count',
      icon: <BookOpen size={22} />,
      title: 'Complete 2 chapitres',
      description: 'Lis et termine 2 chapitres de cours.',
      target: 2,
      reward: 60,
      check: (_all, weekRecords) =>
        weekRecords.filter((r) => r.courseCompleted).length,
    },
    {
      id: 'pass_exam',
      type: 'exam',
      icon: <Trophy size={22} />,
      title: 'Passe un examen',
      description: 'Passe un examen final (score >= 70%).',
      target: 1,
      reward: 100,
      check: (_all, weekRecords) =>
        weekRecords.filter((r) => r.examPassed).length >= 1 ? 1 : 0,
    },
    {
      id: 'score_80_on_2',
      type: 'quiz_quality',
      icon: <Zap size={22} />,
      title: 'Score > 80% sur 2 quiz',
      description: 'Obtiens plus de 80% sur au moins 2 quiz differents.',
      target: 2,
      reward: 65,
      check: (_all, weekRecords) =>
        weekRecords.filter((r) => r.quizScore !== null && r.quizScore > 80).length,
    },
    {
      id: 'review_flashcards',
      type: 'flashcards',
      icon: <Star size={22} />,
      title: 'Revise 5 flashcards',
      description: 'Revise les flashcards d\'au moins 5 chapitres.',
      target: 5,
      reward: 45,
      check: (allRecords) =>
        allRecords.filter((r) => r.flashcardsReviewed > 0).length,
    },
    {
      id: 'complete_chapter_prog1',
      type: 'programme_chapter',
      icon: <BookOpen size={22} />,
      title: 'Complete un chapitre du Programme 1',
      description: 'Termine un chapitre des Fondamentaux (Programme 1).',
      target: 1,
      reward: 55,
      check: (_all, weekRecords) =>
        weekRecords.filter(
          (r) => r.courseCompleted && p1Slugs.includes(r.chapterSlug)
        ).length >= 1
          ? 1
          : 0,
    },
    {
      id: 'complete_5_quiz',
      type: 'quiz_count_5',
      icon: <Target size={22} />,
      title: 'Complete 5 quiz',
      description: 'Termine 5 quiz cette semaine pour un bonus massif.',
      target: 5,
      reward: 90,
      check: (_all, weekRecords) =>
        weekRecords.filter((r) => r.quizScore !== null).length,
    },
    {
      id: 'streak_5_days',
      type: 'streak_5',
      icon: <Flame size={22} />,
      title: 'Streak de 5 jours',
      description: 'Connecte-toi 5 jours consecutifs cette semaine.',
      target: 5,
      reward: 80,
      check: (_all, _week, streak) => Math.min(streak, 5),
    },
    {
      id: 'complete_chapter_prog2',
      type: 'programme2_chapter',
      icon: <BookOpen size={22} />,
      title: 'Complete un chapitre du Programme 2',
      description: 'Termine un chapitre du Programme Avance.',
      target: 1,
      reward: 60,
      check: (_all, weekRecords) =>
        weekRecords.filter(
          (r) => r.courseCompleted && p2Slugs.includes(r.chapterSlug)
        ).length >= 1
          ? 1
          : 0,
    },
    {
      id: 'complete_chapter_prog3',
      type: 'programme3_chapter',
      icon: <BookOpen size={22} />,
      title: 'Complete un chapitre du Programme 3',
      description: 'Termine un chapitre du Programme Entreprise.',
      target: 1,
      reward: 65,
      check: (_all, weekRecords) =>
        weekRecords.filter(
          (r) => r.courseCompleted && p3Slugs.includes(r.chapterSlug)
        ).length >= 1
          ? 1
          : 0,
    },
    {
      id: 'score_90_on_1',
      type: 'quiz_90',
      icon: <Zap size={22} />,
      title: 'Score > 90% sur un quiz',
      description: 'Obtiens un score superieur a 90% sur un quiz.',
      target: 1,
      reward: 55,
      check: (_all, weekRecords) =>
        weekRecords.filter((r) => r.quizScore !== null && r.quizScore > 90).length >= 1
          ? 1
          : 0,
    },
    {
      id: 'complete_4_chapters',
      type: 'chapter_count_4',
      icon: <BookOpen size={22} />,
      title: 'Complete 4 chapitres',
      description: 'Lis et termine 4 chapitres cette semaine.',
      target: 4,
      reward: 100,
      check: (_all, weekRecords) =>
        weekRecords.filter((r) => r.courseCompleted).length,
    },
  ]
}

function getChallengesForWeek(weekNumber: number, templates: ChallengeTemplate[]): ChallengeTemplate[] {
  const seed = weekNumber * 7 + 3
  const indices: number[] = []
  let i = 0
  while (indices.length < 3 && i < 100) {
    const idx = (seed + i * 13) % templates.length
    if (!indices.includes(idx)) {
      indices.push(idx)
    }
    i++
  }
  return indices.map((idx) => templates[idx])
}

// ---------------------------------------------------------------------------
// localStorage helpers
// ---------------------------------------------------------------------------

function getStorageKey(weekNumber: number, year: number): string {
  return `nr_challenges_${year}_${weekNumber}`
}

function loadWeekData(weekNumber: number, year: number): WeekData | null {
  try {
    const raw = localStorage.getItem(getStorageKey(weekNumber, year))
    if (!raw) return null
    return JSON.parse(raw) as WeekData
  } catch {
    return null
  }
}

function saveWeekData(data: WeekData): void {
  localStorage.setItem(getStorageKey(data.weekNumber, data.year), JSON.stringify(data))
}

function initWeekData(weekNumber: number, year: number, allTemplates?: ChallengeTemplate[]): WeekData {
  const templates = allTemplates ? getChallengesForWeek(weekNumber, allTemplates) : []
  const monday = getMondayOfWeek(weekNumber, year)
  return {
    weekNumber,
    year,
    startDate: monday.toISOString(),
    challenges: templates.map((t) => ({
      id: t.id,
      progress: 0,
      completed: false,
      completedAt: null,
    })),
  }
}

function getCompletedHistoryWeeks(): WeekData[] {
  const results: WeekData[] = []
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('nr_challenges_')) {
        const raw = localStorage.getItem(key)
        if (raw) {
          const data = JSON.parse(raw) as WeekData
          const hasCompleted = data.challenges.some((c) => c.completed)
          if (hasCompleted) {
            results.push(data)
          }
        }
      }
    }
  } catch {
    // ignore parse errors
  }
  // Sort by most recent first
  results.sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year
    return b.weekNumber - a.weekNumber
  })
  return results
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Challenges() {
  const lang = useLangStore((s) => s.lang)
  const t = (fr: string, en: string) => lang === 'en' ? en : fr
  const tTitle = (id: string) => lang === 'en' ? (challengeI18n[id]?.title_en ?? id) : (challengeI18n[id]?.title_fr ?? id)
  const tDesc = (id: string) => lang === 'en' ? (challengeI18n[id]?.description_en ?? '') : (challengeI18n[id]?.description_fr ?? '')
  const { records } = useProgressStore()
  const { user } = useAuthStore()
  const formation = useFormationFromUrl()
  const chaptersByProgram = useChaptersByProgram()
  const allChapters = useChapters()

  const programme1Slugs = useMemo(() => chaptersByProgram.chapters.map((c: any) => c.slug), [chaptersByProgram])
  const programme2Slugs = useMemo(() => chaptersByProgram.chapters2.map((c: any) => c.slug), [chaptersByProgram])
  const programme3Slugs = useMemo(() => chaptersByProgram.chapters3.map((c: any) => c.slug), [chaptersByProgram])
  const programme4Slugs = useMemo(() => chaptersByProgram.chapters4.map((c: any) => c.slug), [chaptersByProgram])

  const challengeTemplates = useMemo(
    () => buildChallengeTemplates(programme1Slugs, programme2Slugs, programme3Slugs),
    [programme1Slugs, programme2Slugs, programme3Slugs]
  )

  const now = new Date()
  const currentWeek = getWeekNumber(now)
  const currentYear = getWeekYear(now)

  const [weekData, setWeekData] = useState<WeekData>(() => {
    const saved = loadWeekData(currentWeek, currentYear)
    return saved || { weekNumber: currentWeek, year: currentYear, startDate: '', challenges: [] }
  })

  // Re-init week data when challengeTemplates are available and week has no challenges
  useEffect(() => {
    if (weekData.challenges.length === 0 && challengeTemplates.length > 0) {
      const saved = loadWeekData(currentWeek, currentYear)
      if (saved) {
        setWeekData(saved)
      } else {
        const fresh = initWeekData(currentWeek, currentYear, challengeTemplates)
        setWeekData(fresh)
      }
    }
  }, [challengeTemplates, currentWeek, currentYear])

  const [countdown, setCountdown] = useState('')
  const [historyWeeks, setHistoryWeeks] = useState<WeekData[]>([])

  // Countdown timer
  useEffect(() => {
    const update = () => {
      const nextMon = getNextMonday()
      const diff = nextMon.getTime() - Date.now()
      setCountdown(formatCountdown(diff, lang))
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  // Load history
  useEffect(() => {
    const all = getCompletedHistoryWeeks()
    // Exclude current week from history
    setHistoryWeeks(
      all.filter((w) => !(w.weekNumber === currentWeek && w.year === currentYear))
    )
  }, [currentWeek, currentYear])

  // Auto-detect completion from progress data
  const updateChallengeProgress = useCallback(() => {
    const templates = getChallengesForWeek(currentWeek, challengeTemplates)
    const weekRecords = getRecordsForWeek(records, currentWeek, currentYear)
    const streak = user?.loginStreak ?? 0

    setWeekData((prev) => {
      let changed = false
      const updatedChallenges = prev.challenges.map((cs) => {
        const template = templates.find((t) => t.id === cs.id)
        if (!template) return cs

        const currentProgress = Math.min(
          template.check(records, weekRecords, streak),
          template.target
        )
        const isCompleted = currentProgress >= template.target

        if (currentProgress !== cs.progress || isCompleted !== cs.completed) {
          changed = true
          return {
            ...cs,
            progress: currentProgress,
            completed: isCompleted,
            completedAt: isCompleted && !cs.completedAt ? new Date().toISOString() : cs.completedAt,
          }
        }
        return cs
      })

      if (changed) {
        const newData = { ...prev, challenges: updatedChallenges }
        saveWeekData(newData)
        return newData
      }
      return prev
    })
  }, [records, user, currentWeek, currentYear, challengeTemplates])

  useEffect(() => {
    updateChallengeProgress()
  }, [updateChallengeProgress])

  // Save on change
  useEffect(() => {
    saveWeekData(weekData)
  }, [weekData])

  const weekTemplates = useMemo(() => getChallengesForWeek(currentWeek, challengeTemplates), [currentWeek, challengeTemplates])

  const mondayDate = getMondayOfWeek(currentWeek, currentYear)
  const sundayDate = getSundayOfWeek(currentWeek, currentYear)

  const totalCompleted = useMemo(() => {
    let count = 0
    // Current week
    count += weekData.challenges.filter((c) => c.completed).length
    // History
    historyWeeks.forEach((w) => {
      count += w.challenges.filter((c) => c.completed).length
    })
    return count
  }, [weekData, historyWeeks])

  const totalRewards = useMemo(() => {
    let points = 0
    // Current week
    weekData.challenges.forEach((cs) => {
      if (cs.completed) {
        const tpl = weekTemplates.find((t) => t.id === cs.id)
        if (tpl) points += tpl.reward
      }
    })
    // History
    historyWeeks.forEach((w) => {
      const templates = getChallengesForWeek(w.weekNumber, challengeTemplates)
      w.challenges.forEach((cs) => {
        if (cs.completed) {
          const tpl = templates.find((t) => t.id === cs.id)
          if (tpl) points += tpl.reward
        }
      })
    })
    return points
  }, [weekData, weekTemplates, historyWeeks, challengeTemplates])

  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--accent)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: 12,
            }}
          >
            {t('// defis', '// challenges')}
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: '-1px',
              marginBottom: 10,
              color: 'var(--text-primary)',
            }}
          >
            {t('Defis Hebdomadaires', 'Weekly Challenges')}
          </h1>
          <p
            style={{
              fontSize: 15,
              color: 'var(--text-secondary)',
              fontWeight: 300,
            }}
          >
            {t('Semaine', 'Week')} {currentWeek} &mdash; {formatDate(mondayDate, lang)} {t('au', 'to')}{' '}
            {formatDate(sundayDate, lang)} {currentYear}
          </p>
        </div>

        {/* Timer + Stats bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
            marginBottom: 36,
          }}
        >
          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              flex: '1 1 280px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-tertiary, var(--bg-primary))',
                border: '1px solid var(--border)',
              }}
            >
              <Clock size={20} color="var(--accent)" />
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: 4,
                }}
              >
                {t('Reset dans', 'Resets in')}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 20,
                  fontWeight: 700,
                  color: 'var(--accent)',
                  letterSpacing: '1px',
                }}
              >
                {countdown}
              </div>
            </div>
          </motion.div>

          {/* Completed stat */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{
              flex: '1 1 200px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-tertiary, var(--bg-primary))',
                border: '1px solid var(--border)',
              }}
            >
              <Trophy size={20} color="var(--accent)" />
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: 4,
                }}
              >
                {t('Defis completes', 'Completed challenges')}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 20,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}
              >
                {totalCompleted}
              </div>
            </div>
          </motion.div>

          {/* Total bonus points */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            style={{
              flex: '1 1 200px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-tertiary, var(--bg-primary))',
                border: '1px solid var(--border)',
              }}
            >
              <Zap size={20} color="var(--accent)" />
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: 4,
                }}
              >
                {t('Points bonus gagnes', 'Bonus points earned')}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 20,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}
              >
                +{totalRewards}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Active Challenges */}
        <div style={{ marginBottom: 48 }}>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 20,
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: 20,
              letterSpacing: '-0.5px',
            }}
          >
            {t('Defis de la semaine', 'This week\'s challenges')}
          </h2>

          <div
            className="challenges-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 2,
            }}
          >
            {weekTemplates.map((template, index) => {
              const state = weekData.challenges.find((c) => c.id === template.id)
              const progress = state?.progress ?? 0
              const completed = state?.completed ?? false
              const pct = Math.min((progress / template.target) * 100, 100)

              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: completed
                      ? '1px solid var(--accent)'
                      : '1px solid var(--border)',
                    padding: 28,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Completed overlay glow */}
                  {completed && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 3,
                        background: 'var(--accent)',
                      }}
                    />
                  )}

                  {/* Top row: icon + completion badge */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      marginBottom: 16,
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: completed
                          ? 'rgba(0, 229, 160, 0.1)'
                          : 'var(--bg-tertiary, var(--bg-primary))',
                        border: '1px solid var(--border)',
                        color: completed ? 'var(--accent)' : 'var(--text-secondary)',
                      }}
                    >
                      {completed ? <CheckCircle size={22} /> : template.icon}
                    </div>

                    {completed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 11,
                          color: 'var(--accent)',
                          background: 'rgba(0, 229, 160, 0.1)',
                          padding: '4px 10px',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                        }}
                      >
                        {t('Complete', 'Completed')}
                      </motion.div>
                    )}
                  </div>

                  {/* Title */}
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 16,
                      fontWeight: 700,
                      color: completed ? 'var(--accent)' : 'var(--text-primary)',
                      marginBottom: 6,
                      textDecoration: completed ? 'line-through' : 'none',
                    }}
                  >
                    {tTitle(template.id)}
                  </div>

                  {/* Description */}
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 13,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                      margin: '0 0 20px 0',
                    }}
                  >
                    {tDesc(template.id)}
                  </p>

                  {/* Progress bar */}
                  <div style={{ marginBottom: 14 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 6,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 12,
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {progress}/{template.target}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 12,
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {Math.round(pct)}%
                      </span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: 6,
                        background: 'var(--bg-tertiary, var(--bg-primary))',
                        overflow: 'hidden',
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        style={{
                          height: '100%',
                          background: completed
                            ? 'var(--accent)'
                            : 'var(--text-secondary)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Reward */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontFamily: 'var(--font-mono)',
                      fontSize: 13,
                      color: completed ? 'var(--accent)' : 'var(--text-muted, var(--text-secondary))',
                      fontWeight: 600,
                    }}
                  >
                    <Star size={14} />
                    +{template.reward} {t('points bonus', 'bonus points')}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* History Section */}
        {historyWeeks.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 20,
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: 20,
                letterSpacing: '-0.5px',
              }}
            >
              {t('Historique', 'History')}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {historyWeeks.slice(0, 8).map((week, idx) => {
                const templates = getChallengesForWeek(week.weekNumber, challengeTemplates)
                const completedCount = week.challenges.filter((c) => c.completed).length
                const weekMonday = getMondayOfWeek(week.weekNumber, week.year)
                const weekSunday = getSundayOfWeek(week.weekNumber, week.year)

                return (
                  <motion.div
                    key={`${week.year}-${week.weekNumber}`}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      padding: '16px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 12,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 13,
                          color: 'var(--text-secondary)',
                          minWidth: 60,
                        }}
                      >
                        S{week.weekNumber}
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 14,
                          color: 'var(--text-primary)',
                        }}
                      >
                        {formatDate(weekMonday, lang)} - {formatDate(weekSunday, lang)}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      {/* Challenge dots */}
                      <div style={{ display: 'flex', gap: 6 }}>
                        {week.challenges.map((cs, i) => (
                          <div
                            key={i}
                            title={templates[i]?.title ?? ''}
                            style={{
                              width: 10,
                              height: 10,
                              background: cs.completed
                                ? 'var(--accent)'
                                : 'var(--border)',
                            }}
                          />
                        ))}
                      </div>

                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 13,
                          color:
                            completedCount === 3
                              ? 'var(--accent)'
                              : 'var(--text-secondary)',
                          fontWeight: 600,
                        }}
                      >
                        {completedCount}/3
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {/* Empty history state */}
        {historyWeeks.length === 0 && (
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              padding: '40px 24px',
              textAlign: 'center',
              marginBottom: 48,
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                color: 'var(--text-secondary)',
                marginBottom: 8,
              }}
            >
              {t('Pas encore d\'historique', 'No history yet')}
            </div>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                color: 'var(--text-muted, var(--text-secondary))',
                margin: 0,
              }}
            >
              {t('Complete des defis cette semaine pour commencer a construire ton historique.', 'Complete challenges this week to start building your history.')}
            </p>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .challenges-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .challenges-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
