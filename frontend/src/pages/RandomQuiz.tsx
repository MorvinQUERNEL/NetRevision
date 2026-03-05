import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shuffle,
  Play,
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  Timer,
} from 'lucide-react'
import type { QuizQuestion } from '../data/quizzes'
import { useTranslation, useChapters, useQuizzes } from '../hooks/useTranslation'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Mode = 'entrainement' | 'examen'
type Screen = 'config' | 'quiz' | 'results'

interface ShuffledQuestion extends QuizQuestion {
  /** Mapping from shuffled index -> original index so we can check correctness */
  shuffledOptions: string[]
  /** The index in shuffledOptions that is correct */
  shuffledCorrect: number
  /** The chapter id this question belongs to */
  chapterId: number
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function fisherYatesShuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function shuffleQuestion(q: QuizQuestion, chapterId: number): ShuffledQuestion {
  const indices = q.options.map((_, i) => i)
  const shuffledIndices = fisherYatesShuffle(indices)
  return {
    ...q,
    chapterId,
    shuffledOptions: shuffledIndices.map((i) => q.options[i]),
    shuffledCorrect: shuffledIndices.indexOf(q.correct),
  }
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function RandomQuiz() {
  const { t } = useTranslation()
  const allChapters = useChapters()
  const allQuizzes = useQuizzes()

  /* ----- Chapter label map ----- */
  const chapterLabelMap: Record<number, string> = useMemo(() => {
    const map: Record<number, string> = {}
    allChapters.forEach((ch) => {
      map[ch.id] = ch.title
    })
    return map
  }, [allChapters])

  /* ----- Question pools by programme ----- */
  const getPoolForProgramme = useCallback((programme: number): { chapterId: number; q: QuizQuestion }[] => {
    const pool: { chapterId: number; q: QuizQuestion }[] = []
    // Filter quizzes by programme based on chapter id ranges
    for (const [chId, questions] of Object.entries(allQuizzes)) {
      const id = Number(chId)
      const inProgramme =
        programme === 1 ? id >= 1 && id <= 11
        : programme === 2 ? id >= 12 && id <= 21
        : programme === 3 ? id >= 22 && id <= 32
        : programme === 4 ? id >= 33 && id <= 36
        : programme === 5 ? id >= 37 && id <= 42
        : id >= 43 && id <= 49
      if (inProgramme) {
        for (const q of questions) {
          pool.push({ chapterId: id, q })
        }
      }
    }
    return pool
  }, [allQuizzes])

  /* ----- Config state ----- */
  const [screen, setScreen] = useState<Screen>('config')
  const [numQuestions, setNumQuestions] = useState(10)
  const [selectedProgrammes, setSelectedProgrammes] = useState<Set<number>>(new Set([1, 2, 3, 4, 5, 6]))
  const [mode, setMode] = useState<Mode>('entrainement')
  const [timerEnabled, setTimerEnabled] = useState(false)
  const [timerMinutes, setTimerMinutes] = useState(20)

  /* ----- Quiz state ----- */
  const [questions, setQuestions] = useState<ShuffledQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [revealed, setRevealed] = useState<boolean[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  /* ----- Derived ----- */
  const currentQ = questions[currentIndex] ?? null
  const totalQuestions = questions.length

  /* ----- Timer effect ----- */
  useEffect(() => {
    if (screen !== 'quiz' || !timerEnabled) return
    if (timeLeft <= 0 && timerEnabled && screen === 'quiz') {
      finishQuiz()
      return
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, timerEnabled, timeLeft])

  /* ----- Programme toggle ----- */
  const toggleProgramme = useCallback((p: number) => {
    setSelectedProgrammes((prev) => {
      const next = new Set(prev)
      if (next.has(p)) {
        if (next.size > 1) next.delete(p)
      } else {
        next.add(p)
      }
      return next
    })
  }, [])

  /* ----- Launch quiz ----- */
  const launchQuiz = useCallback(() => {
    let pool: { chapterId: number; q: QuizQuestion }[] = []
    selectedProgrammes.forEach((p) => {
      pool = pool.concat(getPoolForProgramme(p))
    })

    const shuffledPool = fisherYatesShuffle(pool)
    const picked = shuffledPool.slice(0, Math.min(numQuestions, shuffledPool.length))
    const shuffledQuestions = picked.map((item) => shuffleQuestion(item.q, item.chapterId))

    setQuestions(shuffledQuestions)
    setCurrentIndex(0)
    setAnswers(new Array(shuffledQuestions.length).fill(null))
    setRevealed(new Array(shuffledQuestions.length).fill(false))
    setStartTime(Date.now())
    setEndTime(0)

    if (timerEnabled) {
      setTimeLeft(timerMinutes * 60)
    } else {
      setTimeLeft(0)
    }

    setScreen('quiz')
  }, [numQuestions, selectedProgrammes, mode, timerEnabled, timerMinutes, getPoolForProgramme])

  /* ----- Answer a question ----- */
  const selectAnswer = useCallback(
    (optionIndex: number) => {
      if (answers[currentIndex] !== null && mode === 'entrainement') return
      if (mode === 'examen' || answers[currentIndex] === null) {
        setAnswers((prev) => {
          const next = [...prev]
          next[currentIndex] = optionIndex
          return next
        })
      }
      if (mode === 'entrainement') {
        setRevealed((prev) => {
          const next = [...prev]
          next[currentIndex] = true
          return next
        })
      }
    },
    [currentIndex, answers, mode]
  )

  /* ----- Navigation ----- */
  const goNext = useCallback(() => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((i) => i + 1)
    }
  }, [currentIndex, totalQuestions])

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1)
    }
  }, [currentIndex])

  /* ----- Finish ----- */
  const finishQuiz = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    setEndTime(Date.now())
    setScreen('results')
  }, [])

  /* ----- Restart ----- */
  const restart = useCallback(() => {
    setScreen('config')
    setQuestions([])
    setCurrentIndex(0)
    setAnswers([])
    setRevealed([])
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  /* ----- Score ----- */
  const score = useMemo(() => {
    let correct = 0
    questions.forEach((q, i) => {
      if (answers[i] === q.shuffledCorrect) correct++
    })
    return correct
  }, [questions, answers])

  const timeTakenSeconds = useMemo(() => {
    if (!startTime) return 0
    const end = endTime || Date.now()
    return Math.floor((end - startTime) / 1000)
  }, [startTime, endTime])

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px 80px' }}>
        <AnimatePresence mode="wait">
          {/* ====================================================== */}
          {/*  SCREEN 1 : CONFIGURATION                               */}
          {/* ====================================================== */}
          {screen === 'config' && (
            <motion.div
              key="config"
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
                  {t('// quiz aleatoire', '// random quiz')}
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
                  {t('Generateur de Quiz', 'Quiz Generator')}
                </h1>
                <p
                  style={{
                    fontSize: 15,
                    color: 'var(--text-secondary)',
                    fontWeight: 300,
                  }}
                >
                  {t(
                    "Configurez votre quiz personnalise a partir de l'ensemble des questions disponibles. Les questions et les reponses sont melangees aleatoirement.",
                    "Configure your custom quiz from the full pool of available questions. Questions and answers are shuffled randomly."
                  )}
                </p>
              </div>

              {/* Number of questions */}
              <SectionLabel icon={<Shuffle size={16} />} label={t('Nombre de questions', 'Number of questions')} />
              <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
                {[5, 10, 15, 20, 30].map((n) => (
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

              {/* Programme selection */}
              <SectionLabel icon={<Shuffle size={16} />} label={t('Programmes', 'Programs')} />
              <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
                {[1, 2, 3, 4, 5, 6].map((p) => {
                  const checked = selectedProgrammes.has(p)
                  return (
                    <button
                      key={p}
                      onClick={() => toggleProgramme(p)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '12px 20px',
                        background: checked ? 'var(--bg-secondary)' : 'var(--bg-secondary)',
                        border: checked
                          ? '1px solid var(--accent)'
                          : '1px solid var(--border)',
                        color: checked ? 'var(--accent)' : 'var(--text-secondary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 13,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span
                        style={{
                          width: 18,
                          height: 18,
                          border: checked
                            ? '2px solid var(--accent)'
                            : '2px solid var(--text-muted, var(--text-secondary))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12,
                          flexShrink: 0,
                        }}
                      >
                        {checked && (
                          <CheckCircle
                            size={14}
                            style={{ color: 'var(--accent)' }}
                          />
                        )}
                      </span>
                      {t(`Programme ${p}`, `Program ${p}`)}
                    </button>
                  )
                })}
              </div>

              {/* Mode */}
              <SectionLabel icon={<Play size={16} />} label="Mode" />
              <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
                {(['entrainement', 'examen'] as Mode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    style={{
                      ...pillStyle,
                      padding: '10px 24px',
                      background: mode === m ? 'var(--accent)' : 'var(--bg-secondary)',
                      color: mode === m ? 'var(--bg-primary)' : 'var(--text-secondary)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    {m === 'entrainement' ? t('Entrainement', 'Practice') : t('Examen', 'Exam')}
                  </button>
                ))}
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                  marginTop: -20,
                  marginBottom: 32,
                  lineHeight: 1.6,
                }}
              >
                {mode === 'entrainement'
                  ? t('La correction est affichee apres chaque question.', 'The answer is shown after each question.')
                  : t('Les resultats sont affiches a la fin du quiz.', 'Results are shown at the end of the quiz.')}
              </p>

              {/* Timer */}
              <SectionLabel icon={<Timer size={16} />} label={t('Chronometre', 'Timer')} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                <button
                  onClick={() => setTimerEnabled(!timerEnabled)}
                  style={{
                    ...pillStyle,
                    padding: '10px 24px',
                    background: timerEnabled ? 'var(--accent)' : 'var(--bg-secondary)',
                    color: timerEnabled ? 'var(--bg-primary)' : 'var(--text-secondary)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {timerEnabled ? t('Active', 'Enabled') : t('Desactive', 'Disabled')}
                </button>
              </div>
              {timerEnabled && (
                <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
                  {[10, 20, 30].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setTimerMinutes(mins)}
                      style={{
                        ...pillStyle,
                        background:
                          timerMinutes === mins ? 'var(--accent)' : 'var(--bg-secondary)',
                        color:
                          timerMinutes === mins ? 'var(--bg-primary)' : 'var(--text-secondary)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      {mins} min
                    </button>
                  ))}
                </div>
              )}
              {!timerEnabled && <div style={{ marginBottom: 32 }} />}

              {/* Launch button */}
              <button
                onClick={launchQuiz}
                style={{
                  width: '100%',
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
                <Play size={20} />
                {t('Lancer le quiz', 'Start quiz')}
              </button>
            </motion.div>
          )}

          {/* ====================================================== */}
          {/*  SCREEN 2 : QUIZ IN PROGRESS                            */}
          {/* ====================================================== */}
          {screen === 'quiz' && currentQ && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Top bar: progress + timer */}
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
                {timerEnabled && (
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 14,
                      color: timeLeft <= 60 ? 'var(--error)' : 'var(--accent)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <Clock size={14} />
                    {formatTime(timeLeft)}
                  </span>
                )}
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

              {/* Chapter label */}
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: 'var(--accent)',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  marginBottom: 12,
                }}
              >
                {chapterLabelMap[currentQ.chapterId] ?? `${t('Chapitre', 'Chapter')} ${currentQ.chapterId}`}
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

                  if (mode === 'entrainement' && isRevealed) {
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
                      disabled={mode === 'entrainement' && isRevealed}
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
                        cursor:
                          mode === 'entrainement' && isRevealed ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        transition: 'all 0.15s ease',
                        opacity: mode === 'entrainement' && isRevealed && !isCorrect && !isSelected ? 0.5 : 1,
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
                      {mode === 'entrainement' && isRevealed && isCorrect && (
                        <CheckCircle size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                      )}
                      {mode === 'entrainement' && isRevealed && isSelected && !isCorrect && (
                        <XCircle size={18} style={{ color: 'var(--error)', flexShrink: 0 }} />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Explanation (entrainement mode) */}
              {mode === 'entrainement' && revealed[currentIndex] && (
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
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', gap: 8 }}>
                  {(mode === 'examen' || (mode === 'entrainement' && currentIndex > 0)) && (
                    <button
                      onClick={goPrev}
                      disabled={currentIndex === 0}
                      style={{
                        ...navBtnStyle,
                        opacity: currentIndex === 0 ? 0.4 : 1,
                        cursor: currentIndex === 0 ? 'default' : 'pointer',
                      }}
                    >
                      <ArrowLeft size={16} />
                      {t('Precedent', 'Previous')}
                    </button>
                  )}
                  {currentIndex < totalQuestions - 1 && (
                    <button
                      onClick={goNext}
                      disabled={
                        mode === 'entrainement' && !revealed[currentIndex]
                      }
                      style={{
                        ...navBtnStyle,
                        opacity:
                          mode === 'entrainement' && !revealed[currentIndex] ? 0.4 : 1,
                        cursor:
                          mode === 'entrainement' && !revealed[currentIndex]
                            ? 'default'
                            : 'pointer',
                      }}
                    >
                      {t('Suivant', 'Next')}
                      <ArrowRight size={16} />
                    </button>
                  )}
                </div>

                <button
                  onClick={finishQuiz}
                  style={{
                    padding: '10px 24px',
                    background: 'var(--accent)',
                    color: 'var(--bg-primary)',
                    border: 'none',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'opacity 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  {t('Terminer', 'Finish')}
                </button>
              </div>
            </motion.div>
          )}

          {/* ====================================================== */}
          {/*  SCREEN 3 : RESULTS                                     */}
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
                  {t('Quiz termine', 'Quiz completed')}
                </h1>
              </div>

              {/* Score card */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
                      color:
                        score / totalQuestions >= 0.7 ? 'var(--accent)' : 'var(--error)',
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

                {/* Time taken */}
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
                    {t('Temps', 'Time')}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 40,
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 10,
                    }}
                  >
                    <Clock size={28} style={{ color: 'var(--text-secondary)' }} />
                    {formatTime(timeTakenSeconds)}
                  </div>
                </div>

                {/* Mode */}
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
                    Mode
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 20,
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      marginTop: 10,
                    }}
                  >
                    {mode === 'entrainement' ? t('Entrainement', 'Practice') : t('Examen', 'Exam')}
                  </div>
                </div>
              </div>

              {/* Summary per question */}
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
                          marginBottom: 12,
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
                            Question {i + 1} — {chapterLabelMap[q.chapterId] ?? `Ch. ${q.chapterId}`}
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
                              {t('Votre reponse :', 'Your answer:')} {userText}
                            </div>
                            {!isCorrect && (
                              <div
                                style={{
                                  fontFamily: 'var(--font-body)',
                                  fontSize: 13,
                                  color: 'var(--accent)',
                                }}
                              >
                                {t('Bonne reponse :', 'Correct answer:')} {correctText}
                              </div>
                            )}
                          </div>

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
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Restart button */}
              <button
                onClick={restart}
                style={{
                  width: '100%',
                  marginTop: 40,
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
                {t('Nouveau quiz', 'New quiz')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Shared sub-components & styles                                     */
/* ------------------------------------------------------------------ */

function SectionLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
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
      {icon}
      {label}
    </div>
  )
}

const pillStyle: React.CSSProperties = {
  padding: '10px 20px',
  fontFamily: 'var(--font-mono)',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.15s ease',
}

const navBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '10px 18px',
  background: 'var(--bg-secondary)',
  border: '1px solid var(--border)',
  color: 'var(--text-secondary)',
  fontFamily: 'var(--font-mono)',
  fontSize: 13,
  cursor: 'pointer',
  transition: 'all 0.15s ease',
}
