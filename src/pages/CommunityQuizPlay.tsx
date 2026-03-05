import { useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  RotateCcw,
  Filter,
  ChevronDown,
  Users,
  AlertTriangle,
} from 'lucide-react'
import { useLangStore } from '../stores/langStore'
import { useChapters } from '../hooks/useTranslation'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface CommunityQuestion {
  id: string
  question: string
  options: string[]
  correct: number
  explanation: string
  category: string
  difficulty: 'facile' | 'moyen' | 'difficile'
  authorName: string
  authorId: string
  upvotes: number
  downvotes: number
  userVote: number
  createdAt: string
  status: 'pending' | 'approved'
}

interface ShuffledQuestion extends CommunityQuestion {
  shuffledOptions: string[]
  shuffledCorrect: number
}

type Screen = 'setup' | 'quiz' | 'results'

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = 'nr_community_questions'

const DIFFICULTY_COLORS: Record<string, string> = {
  facile: '#00e5a0',
  moyen: '#f59e0b',
  difficile: '#ef4444',
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function loadQuestions(): CommunityQuestion[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as CommunityQuestion[]
  } catch {
    return []
  }
}

function fisherYatesShuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function shuffleQuestion(q: CommunityQuestion): ShuffledQuestion {
  const indices = q.options.map((_, i) => i)
  const shuffledIndices = fisherYatesShuffle(indices)
  return {
    ...q,
    shuffledOptions: shuffledIndices.map((i) => q.options[i]),
    shuffledCorrect: shuffledIndices.indexOf(q.correct),
  }
}


/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const pillStyle: React.CSSProperties = {
  padding: '10px 20px',
  fontFamily: 'var(--font-mono)',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.15s ease',
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function CommunityQuizPlay() {
  const lang = useLangStore((s) => s.lang)
  const t = (fr: string, en: string) => lang === 'en' ? en : fr
  const allChapters = useChapters()

  const CATEGORIES = useMemo(() => [
    { value: 'all', label: t('Toutes les categories', 'All categories') },
    ...allChapters.map((ch) => ({ value: ch.slug, label: ch.title })),
    { value: 'general', label: t('General', 'General') },
  ], [allChapters, lang])

  const getCategoryLabel = useCallback((slug: string): string => {
    if (slug === 'general') return t('General', 'General')
    if (slug === 'all') return t('Toutes', 'All')
    const ch = allChapters.find((c) => c.slug === slug)
    return ch ? ch.title : slug
  }, [allChapters, lang])

  /* ----- Setup state ----- */
  const [screen, setScreen] = useState<Screen>('setup')
  const [numQuestions, setNumQuestions] = useState(10)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all')

  /* ----- Quiz state ----- */
  const [questions, setQuestions] = useState<ShuffledQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [revealed, setRevealed] = useState<boolean[]>([])

  /* ----- Derived ----- */
  const currentQ = questions[currentIndex] ?? null
  const totalQuestions = questions.length

  /* ----- Available count ----- */
  const allCommunity = useMemo(() => loadQuestions(), [])
  const availableCount = useMemo(() => {
    let list = allCommunity
    if (categoryFilter !== 'all') list = list.filter((q) => q.category === categoryFilter)
    if (difficultyFilter !== 'all') list = list.filter((q) => q.difficulty === difficultyFilter)
    return list.length
  }, [allCommunity, categoryFilter, difficultyFilter])

  /* ----- Launch quiz ----- */
  const launchQuiz = useCallback(() => {
    let pool = loadQuestions()
    if (categoryFilter !== 'all') pool = pool.filter((q) => q.category === categoryFilter)
    if (difficultyFilter !== 'all') pool = pool.filter((q) => q.difficulty === difficultyFilter)

    const shuffled = fisherYatesShuffle(pool)
    const picked = shuffled.slice(0, Math.min(numQuestions, shuffled.length))
    const shuffledQuestions = picked.map(shuffleQuestion)

    setQuestions(shuffledQuestions)
    setCurrentIndex(0)
    setAnswers(new Array(shuffledQuestions.length).fill(null))
    setRevealed(new Array(shuffledQuestions.length).fill(false))
    setScreen('quiz')
  }, [numQuestions, categoryFilter, difficultyFilter])

  /* ----- Answer a question ----- */
  const selectAnswer = useCallback(
    (optionIndex: number) => {
      if (answers[currentIndex] !== null) return
      setAnswers((prev) => {
        const next = [...prev]
        next[currentIndex] = optionIndex
        return next
      })
      setRevealed((prev) => {
        const next = [...prev]
        next[currentIndex] = true
        return next
      })
    },
    [currentIndex, answers]
  )

  /* ----- Navigation ----- */
  const goNext = useCallback(() => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((i) => i + 1)
    } else {
      setScreen('results')
    }
  }, [currentIndex, totalQuestions])

  /* ----- Score ----- */
  const score = useMemo(() => {
    let correct = 0
    questions.forEach((q, i) => {
      if (answers[i] === q.shuffledCorrect) correct++
    })
    return correct
  }, [questions, answers])

  /* ----- Restart ----- */
  const restart = useCallback(() => {
    setScreen('setup')
    setQuestions([])
    setCurrentIndex(0)
    setAnswers([])
    setRevealed([])
  }, [])

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px 80px' }}>
        <AnimatePresence mode="wait">
          {/* ====================================================== */}
          {/*  SCREEN 1: SETUP                                        */}
          {/* ====================================================== */}
          {screen === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
              <div style={{ marginBottom: 40 }}>
                <Link
                  to="/quiz-communautaire"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 12,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-muted)',
                    marginBottom: 14,
                    textDecoration: 'none',
                  }}
                >
                  <ArrowLeft size={12} /> {t('retour au quiz communautaire', 'back to community quiz')}
                </Link>
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
                  {t('// quiz communautaire', '// community quiz')}
                </div>
                <h1
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 32,
                    fontWeight: 700,
                    letterSpacing: '-1px',
                    marginBottom: 10,
                  }}
                >
                  {t('Jouer un Quiz', 'Play a Quiz')}
                </h1>
                <p
                  style={{
                    fontSize: 15,
                    color: 'var(--text-secondary)',
                    fontWeight: 300,
                  }}
                >
                  {t('Testez-vous sur les questions creees par la communaute', 'Test yourself on community-created questions')}
                </p>
              </div>

              {/* Number of questions */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  marginBottom: 12,
                }}
              >
                <Users size={16} />
                {t('Nombre de questions', 'Number of questions')}
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
                {[5, 10, 15].map((n) => (
                  <button
                    key={n}
                    onClick={() => setNumQuestions(n)}
                    style={{
                      ...pillStyle,
                      background: numQuestions === n ? 'var(--accent)' : 'var(--bg-secondary)',
                      color: numQuestions === n ? 'var(--bg-primary)' : 'var(--text-secondary)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>

              {/* Category filter */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  marginBottom: 12,
                }}
              >
                <Filter size={16} />
                {t('Categorie (optionnel)', 'Category (optional)')}
              </div>
              <div style={{ position: 'relative', marginBottom: 32, maxWidth: 400 }}>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 13,
                    padding: '10px 12px',
                    outline: 'none',
                    cursor: 'pointer',
                    appearance: 'none',
                    paddingRight: 30,
                  }}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              </div>

              {/* Difficulty filter */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  marginBottom: 12,
                }}
              >
                <Filter size={16} />
                {t('Difficulte (optionnel)', 'Difficulty (optional)')}
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
                <button
                  onClick={() => setDifficultyFilter('all')}
                  style={{
                    ...pillStyle,
                    background: difficultyFilter === 'all' ? 'var(--accent)' : 'var(--bg-secondary)',
                    color: difficultyFilter === 'all' ? 'var(--bg-primary)' : 'var(--text-secondary)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {t('Toutes', 'All')}
                </button>
                {(['facile', 'moyen', 'difficile'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficultyFilter(d)}
                    style={{
                      ...pillStyle,
                      background: difficultyFilter === d ? `${DIFFICULTY_COLORS[d]}20` : 'var(--bg-secondary)',
                      color: difficultyFilter === d ? DIFFICULTY_COLORS[d] : 'var(--text-secondary)',
                      border: difficultyFilter === d
                        ? `1px solid ${DIFFICULTY_COLORS[d]}`
                        : '1px solid var(--border)',
                      textTransform: 'capitalize',
                    }}
                  >
                    {t(d, d === 'facile' ? 'easy' : d === 'moyen' ? 'medium' : 'hard')}
                  </button>
                ))}
              </div>

              {/* Available count */}
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: 'var(--text-muted)',
                  marginBottom: 24,
                }}
              >
                {availableCount} question{availableCount !== 1 ? 's' : ''} {t(`disponible${availableCount !== 1 ? 's' : ''}`, 'available')}
              </div>

              {/* Not enough warning */}
              {availableCount < numQuestions && availableCount > 0 && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    background: '#f59e0b0d',
                    border: '1px solid #f59e0b33',
                    padding: '12px 16px',
                    marginBottom: 20,
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    color: '#f59e0b',
                  }}
                >
                  <AlertTriangle size={16} />
                  {t(
                    `Seulement ${availableCount} question${availableCount !== 1 ? 's' : ''} disponible${availableCount !== 1 ? 's' : ''}. Le quiz sera plus court.`,
                    `Only ${availableCount} question${availableCount !== 1 ? 's' : ''} available. The quiz will be shorter.`
                  )}
                </div>
              )}

              {/* No questions warning */}
              {availableCount === 0 && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    background: 'rgba(239, 68, 68, 0.05)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    padding: '12px 16px',
                    marginBottom: 20,
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    color: 'var(--error)',
                  }}
                >
                  <AlertTriangle size={16} />
                  {t('Aucune question disponible avec ces filtres.', 'No questions available with these filters.')}
                </div>
              )}

              {/* Launch button */}
              <button
                onClick={launchQuiz}
                disabled={availableCount === 0}
                style={{
                  width: '100%',
                  padding: '16px 32px',
                  background: availableCount > 0 ? 'var(--accent)' : 'var(--bg-tertiary)',
                  color: availableCount > 0 ? 'var(--bg-primary)' : 'var(--text-muted)',
                  border: 'none',
                  fontFamily: 'var(--font-heading)',
                  fontSize: 18,
                  fontWeight: 700,
                  cursor: availableCount > 0 ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  transition: 'opacity 0.15s ease',
                }}
                onMouseEnter={(e) => { if (availableCount > 0) e.currentTarget.style.opacity = '0.85' }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
              >
                <Play size={20} />
                {t('COMMENCER', 'START')}
              </button>
            </motion.div>
          )}

          {/* ====================================================== */}
          {/*  SCREEN 2: QUIZ                                          */}
          {/* ====================================================== */}
          {screen === 'quiz' && currentQ && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Top bar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 12,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 13,
                    color: 'var(--text-secondary)',
                  }}
                >
                  Question {currentIndex + 1} / {totalQuestions}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--text-muted)',
                  }}
                >
                  {t('par', 'by')} {currentQ.authorName}
                </span>
              </div>

              {/* Progress bar */}
              <div
                style={{
                  width: '100%',
                  height: 4,
                  background: 'var(--border)',
                  marginBottom: 32,
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  style={{
                    height: '100%',
                    background: 'var(--accent)',
                  }}
                  initial={false}
                  animate={{
                    width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Category + difficulty badges */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    padding: '3px 8px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-tertiary)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {getCategoryLabel(currentQ.category)}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    padding: '3px 8px',
                    border: `1px solid ${DIFFICULTY_COLORS[currentQ.difficulty]}33`,
                    background: `${DIFFICULTY_COLORS[currentQ.difficulty]}0d`,
                    color: DIFFICULTY_COLORS[currentQ.difficulty],
                  }}
                >
                  {t(currentQ.difficulty, currentQ.difficulty === 'facile' ? 'easy' : currentQ.difficulty === 'moyen' ? 'medium' : 'hard')}
                </span>
              </div>

              {/* Question text */}
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: '-0.5px',
                  lineHeight: 1.4,
                  marginBottom: 28,
                  color: 'var(--text-primary)',
                }}
              >
                {currentQ.question}
              </h2>

              {/* Answer options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
                {currentQ.shuffledOptions.map((opt, i) => {
                  const isSelected = answers[currentIndex] === i
                  const isCorrect = i === currentQ.shuffledCorrect
                  const isRevealed = revealed[currentIndex]

                  let bg = 'var(--bg-secondary)'
                  let borderColor = 'var(--border)'
                  let textColor = 'var(--text-primary)'

                  if (isRevealed) {
                    if (isCorrect) {
                      bg = 'rgba(0, 229, 160, 0.1)'
                      borderColor = 'var(--accent)'
                      textColor = 'var(--accent)'
                    } else if (isSelected && !isCorrect) {
                      bg = 'rgba(239, 68, 68, 0.1)'
                      borderColor = 'var(--error)'
                      textColor = 'var(--error)'
                    }
                  } else if (isSelected) {
                    bg = 'var(--bg-secondary)'
                    borderColor = 'var(--accent)'
                    textColor = 'var(--accent)'
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => selectAnswer(i)}
                      disabled={isRevealed}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '14px 18px',
                        background: bg,
                        border: `1px solid ${borderColor}`,
                        color: textColor,
                        fontFamily: 'var(--font-body)',
                        fontSize: 15,
                        lineHeight: 1.5,
                        cursor: isRevealed ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        transition: 'all 0.15s ease',
                        opacity: isRevealed && !isCorrect && !isSelected ? 0.5 : 1,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 12,
                          width: 26,
                          height: 26,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: `1px solid ${borderColor}`,
                          flexShrink: 0,
                        }}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span style={{ flex: 1 }}>{opt}</span>
                      {isRevealed && isCorrect && (
                        <CheckCircle size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                      )}
                      {isRevealed && isSelected && !isCorrect && (
                        <XCircle size={18} style={{ color: 'var(--error)', flexShrink: 0 }} />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Explanation */}
              {revealed[currentIndex] && currentQ.explanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.25 }}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    padding: 20,
                    marginBottom: 32,
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--accent)',
                      textTransform: 'uppercase',
                      letterSpacing: '1.5px',
                      marginBottom: 8,
                    }}
                  >
                    {t('Explication', 'Explanation')}
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 14,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.7,
                      margin: 0,
                    }}
                  >
                    {currentQ.explanation}
                  </p>
                </motion.div>
              )}

              {/* Navigation */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}
              >
                {revealed[currentIndex] && (
                  <button
                    onClick={goNext}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '12px 24px',
                      background: 'var(--accent)',
                      color: 'var(--bg-primary)',
                      border: 'none',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'opacity 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                  >
                    {currentIndex < totalQuestions - 1 ? (
                      <>{t('Suivant', 'Next')} <ArrowRight size={16} /></>
                    ) : (
                      <>{t('Voir les resultats', 'See results')} <ArrowRight size={16} /></>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* ====================================================== */}
          {/*  SCREEN 3: RESULTS                                       */}
          {/* ====================================================== */}
          {screen === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
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
                  {t('// resultats', '// results')}
                </div>
                <h1
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 32,
                    fontWeight: 700,
                    letterSpacing: '-1px',
                    marginBottom: 10,
                  }}
                >
                  {t('Quiz termine', 'Quiz complete')}
                </h1>
              </div>

              {/* Score cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: 2,
                  marginBottom: 40,
                }}
              >
                {/* Score */}
                <div
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    padding: 24,
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--text-secondary)',
                      textTransform: 'uppercase',
                      letterSpacing: '1.5px',
                      marginBottom: 12,
                    }}
                  >
                    Score
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 40,
                      fontWeight: 700,
                      color: score / totalQuestions >= 0.7 ? 'var(--accent)' : 'var(--error)',
                    }}
                  >
                    {score}/{totalQuestions}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 14,
                      color: 'var(--text-secondary)',
                      marginTop: 4,
                    }}
                  >
                    {totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0}%
                  </div>
                </div>

                {/* Correct */}
                <div
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    padding: 24,
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--text-secondary)',
                      textTransform: 'uppercase',
                      letterSpacing: '1.5px',
                      marginBottom: 12,
                    }}
                  >
                    {t('Correctes', 'Correct')}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 40,
                      fontWeight: 700,
                      color: 'var(--accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                  >
                    <CheckCircle size={28} />
                    {score}
                  </div>
                </div>

                {/* Wrong */}
                <div
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    padding: 24,
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--text-secondary)',
                      textTransform: 'uppercase',
                      letterSpacing: '1.5px',
                      marginBottom: 12,
                    }}
                  >
                    {t('Incorrectes', 'Incorrect')}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 40,
                      fontWeight: 700,
                      color: totalQuestions - score > 0 ? 'var(--error)' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                  >
                    <XCircle size={28} />
                    {totalQuestions - score}
                  </div>
                </div>
              </div>

              {/* Per-question review */}
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                  marginBottom: 16,
                }}
              >
                {t('Detail des reponses', 'Answer details')}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {questions.map((q, i) => {
                  const userAnswer = answers[i]
                  const isCorrect = userAnswer === q.shuffledCorrect
                  const userText =
                    userAnswer !== null ? q.shuffledOptions[userAnswer] : t('Pas de reponse', 'No answer')
                  const correctText = q.shuffledOptions[q.shuffledCorrect]

                  return (
                    <div
                      key={q.id + '-' + i}
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border)',
                        borderLeft: `3px solid ${isCorrect ? 'var(--accent)' : 'var(--error)'}`,
                        padding: 20,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 12,
                        }}
                      >
                        <div style={{ flexShrink: 0, marginTop: 2 }}>
                          {isCorrect ? (
                            <CheckCircle size={18} style={{ color: 'var(--accent)' }} />
                          ) : (
                            <XCircle size={18} style={{ color: 'var(--error)' }} />
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: 10,
                              color: 'var(--text-secondary)',
                              textTransform: 'uppercase',
                              letterSpacing: '1px',
                              marginBottom: 6,
                            }}
                          >
                            Question {i + 1} — {getCategoryLabel(q.category)} — {t('par', 'by')} {q.authorName}
                          </div>
                          <div
                            style={{
                              fontFamily: 'var(--font-heading)',
                              fontSize: 15,
                              fontWeight: 600,
                              color: 'var(--text-primary)',
                              lineHeight: 1.4,
                              marginBottom: 10,
                            }}
                          >
                            {q.question}
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <div
                              style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: 13,
                                color: isCorrect ? 'var(--accent)' : 'var(--error)',
                              }}
                            >
                              {t('Votre reponse', 'Your answer')} : {userText}
                            </div>
                            {!isCorrect && (
                              <div
                                style={{
                                  fontFamily: 'var(--font-body)',
                                  fontSize: 13,
                                  color: 'var(--accent)',
                                }}
                              >
                                Bonne reponse : {correctText}
                              </div>
                            )}
                          </div>

                          {q.explanation && (
                            <p
                              style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: 13,
                                color: 'var(--text-secondary)',
                                lineHeight: 1.6,
                                margin: '10px 0 0',
                              }}
                            >
                              {q.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' }}>
                <button
                  onClick={restart}
                  style={{
                    flex: 1,
                    minWidth: 200,
                    padding: '16px 32px',
                    background: 'var(--accent)',
                    color: 'var(--bg-primary)',
                    border: 'none',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 18,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12,
                    transition: 'opacity 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  <RotateCcw size={20} />
                  Rejouer
                </button>
                <Link
                  to="/quiz-communautaire"
                  style={{
                    flex: 1,
                    minWidth: 200,
                    padding: '16px 32px',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border)',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 18,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12,
                    textDecoration: 'none',
                    transition: 'opacity 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  <ArrowLeft size={20} />
                  Retour
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
