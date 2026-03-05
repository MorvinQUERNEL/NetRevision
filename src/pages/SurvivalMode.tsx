import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Flame,
  Heart,
  TrendingUp,
  Zap,
  Skull,
  Trophy,
  CheckCircle,
  XCircle,
  ArrowLeft,
  RotateCcw,
  Hash,
  Award,
  Target,
} from 'lucide-react'
import type { QuizQuestion } from '../data/quizzes'
import { useSurvivalStore } from '../stores/survivalStore'
import { useLangStore } from '../stores/langStore'
import { useFormationFromUrl, useQuizzesByProgram } from '../hooks/useTranslation'
import { FORMATIONS } from '../stores/formationStore'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Screen = 'lobby' | 'playing' | 'gameover'

interface ScorePopup {
  id: number
  value: number
  x: number
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

// PROGRAMME_COLORS is now computed inside the component from formation metadata

const OPTION_LETTERS = ['A', 'B', 'C', 'D']

const EXPLANATION_DELAY = 2000

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function buildPool(source: Record<number, QuizQuestion[]>): QuizQuestion[] {
  const pool: QuizQuestion[] = []
  Object.values(source).forEach((qs) => pool.push(...qs))
  return pool
}

function getMultiplier(streak: number): number {
  if (streak >= 9) return 4
  if (streak >= 6) return 3
  if (streak >= 3) return 2
  return 1
}

function getMultiplierColor(mult: number): string {
  switch (mult) {
    case 4: return '#e11d48'
    case 3: return '#f59e0b'
    case 2: return '#6366f1'
    default: return 'var(--accent)'
  }
}

function getDifficultyForQuestion(questionNumber: number): string {
  if (questionNumber <= 8) return 'Programme 1'
  if (questionNumber <= 16) return 'Programme 2'
  if (questionNumber <= 24) return 'Programme 3'
  if (questionNumber <= 30) return 'Programme 4'
  if (questionNumber <= 36) return 'Programme 5'
  return 'Programme 6'
}

function formatDate(date: string, lang: string): string {
  return new Date(date).toLocaleDateString(lang === 'en' ? 'en-US' : 'fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// Question pools and pickQuestion are now inside the component (use hooks)

/* ================================================================== */
/*  MAIN COMPONENT                                                     */
/* ================================================================== */

export default function SurvivalMode() {
  const lang = useLangStore((s) => s.lang)
  const t = (fr: string, en: string) => lang === 'en' ? en : fr
  const { highScores, loadScores, saveScore, getBestScore } = useSurvivalStore()
  const formation = useFormationFromUrl()
  const quizPools = useQuizzesByProgram()
  const programs = FORMATIONS[formation].programs

  const PROGRAMME_COLORS: Record<string, string> = useMemo(() => {
    const colors: Record<string, string> = {}
    programs.forEach((p, i) => { colors[`Programme ${i + 1}`] = p.color })
    return colors
  }, [programs])

  const pools = useMemo(() =>
    quizPools.map(source => buildPool(source)),
    [quizPools]
  )

  const pickQuestion = useCallback((questionNumber: number, usedIds: Set<string>): QuizQuestion | null => {
    let maxPool = 0
    if (questionNumber <= 8) maxPool = 1
    else if (questionNumber <= 16) maxPool = 2
    else if (questionNumber <= 24) maxPool = 3
    else if (questionNumber <= 30) maxPool = 4
    else if (questionNumber <= 36) maxPool = 5
    else maxPool = 6

    const candidates: QuizQuestion[] = []
    for (let i = 0; i < maxPool && i < pools.length; i++) {
      candidates.push(...pools[i].filter(q => !usedIds.has(q.id)))
    }
    if (candidates.length === 0) return null
    return shuffleArray(candidates)[0]
  }, [pools])

  /* ----- screen ----- */
  const [screen, setScreen] = useState<Screen>('lobby')

  /* ----- game state ----- */
  const [lives, setLives] = useState(3)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [questionNumber, setQuestionNumber] = useState(1)
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [scorePopups, setScorePopups] = useState<ScorePopup[]>([])
  const [shakeScreen, setShakeScreen] = useState(false)
  const [shakeLives, setShakeLives] = useState(false)
  const [maxDifficulty, setMaxDifficulty] = useState('Programme 1')
  const [isNewRecord, setIsNewRecord] = useState(false)
  const [multPulse, setMultPulse] = useState(false)

  const usedIdsRef = useRef<Set<string>>(new Set())
  const popupIdRef = useRef(0)
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* ----- load scores on mount ----- */
  useEffect(() => {
    loadScores()
  }, [loadScores])

  /* ----- cleanup ----- */
  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current)
    }
  }, [])

  /* ---------------------------------------------------------------- */
  /*  Start game                                                       */
  /* ---------------------------------------------------------------- */

  const startGame = useCallback(() => {
    usedIdsRef.current = new Set()
    setLives(3)
    setScore(0)
    setStreak(0)
    setMaxStreak(0)
    setQuestionNumber(1)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setScorePopups([])
    setShakeScreen(false)
    setShakeLives(false)
    setMaxDifficulty('Programme 1')
    setIsNewRecord(false)
    setMultPulse(false)

    const first = pickQuestion(1, usedIdsRef.current)
    if (first) {
      usedIdsRef.current.add(first.id)
      setCurrentQuestion(first)
    }
    setScreen('playing')
  }, [])

  /* ---------------------------------------------------------------- */
  /*  Advance to next question                                         */
  /* ---------------------------------------------------------------- */

  const advanceToNext = useCallback(
    (currentLives: number, currentQuestionNumber: number) => {
      if (currentLives <= 0) return

      const nextNum = currentQuestionNumber + 1
      const nextQ = pickQuestion(nextNum, usedIdsRef.current)

      if (!nextQ) {
        /* Pool exhausted — game over with victory */
        const diff = getDifficultyForQuestion(currentQuestionNumber)
        endGame(currentLives, nextNum - 1, diff)
        return
      }

      usedIdsRef.current.add(nextQ.id)
      setQuestionNumber(nextNum)
      setCurrentQuestion(nextQ)
      setSelectedAnswer(null)
      setShowExplanation(false)

      const diff = getDifficultyForQuestion(nextNum)
      setMaxDifficulty((prev) => {
        const order = ['Programme 1', 'Programme 2', 'Programme 3', 'Programme 4', 'Programme 5', 'Programme 6']
        return order.indexOf(diff) > order.indexOf(prev) ? diff : prev
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  /* ---------------------------------------------------------------- */
  /*  End game                                                         */
  /* ---------------------------------------------------------------- */

  const endGame = useCallback(
    (finalLives: number, finalQuestionsAnswered: number, finalMaxDifficulty: string) => {
      void finalLives
      setScreen('gameover')

      const finalScore = score
      const finalMaxStreak = Math.max(maxStreak, streak)
      setMaxStreak(finalMaxStreak)

      const best = getBestScore()
      const newRecord = finalScore > best
      setIsNewRecord(newRecord)

      saveScore({
        score: finalScore,
        questionsAnswered: finalQuestionsAnswered,
        maxStreak: finalMaxStreak,
        maxDifficulty: finalMaxDifficulty,
        date: new Date().toISOString(),
      })
    },
    [score, maxStreak, streak, getBestScore, saveScore]
  )

  /* ---------------------------------------------------------------- */
  /*  Handle answer                                                    */
  /* ---------------------------------------------------------------- */

  const handleAnswer = useCallback(
    (answerIndex: number) => {
      if (selectedAnswer !== null || !currentQuestion) return
      setSelectedAnswer(answerIndex)

      const isCorrect = answerIndex === currentQuestion.correct

      if (isCorrect) {
        const mult = getMultiplier(streak)
        const points = 100 * mult
        setScore((s) => s + points)
        const newStreak = streak + 1
        setStreak(newStreak)
        setMaxStreak((m) => Math.max(m, newStreak))

        /* Check if multiplier changed */
        const newMult = getMultiplier(newStreak)
        if (newMult !== mult) {
          setMultPulse(true)
          setTimeout(() => setMultPulse(false), 500)
        }

        /* Score popup */
        popupIdRef.current += 1
        const popup: ScorePopup = {
          id: popupIdRef.current,
          value: points,
          x: 50 + (Math.random() - 0.5) * 20,
        }
        setScorePopups((prev) => [...prev, popup])
        setTimeout(() => {
          setScorePopups((prev) => prev.filter((p) => p.id !== popup.id))
        }, 1200)
      } else {
        const newLives = lives - 1
        setLives(newLives)
        setStreak(0)

        /* Shake effects */
        setShakeLives(true)
        setShakeScreen(true)
        setTimeout(() => setShakeLives(false), 500)
        setTimeout(() => setShakeScreen(false), 400)

        if (newLives <= 0) {
          /* Game over after showing explanation briefly */
          setShowExplanation(true)
          advanceTimerRef.current = setTimeout(() => {
            const diff = getDifficultyForQuestion(questionNumber)
            endGame(0, questionNumber, diff)
          }, EXPLANATION_DELAY)
          return
        }
      }

      /* Show explanation, then advance */
      setShowExplanation(true)
      advanceTimerRef.current = setTimeout(() => {
        advanceToNext(isCorrect ? lives : lives - 1, questionNumber)
      }, EXPLANATION_DELAY)
    },
    [selectedAnswer, currentQuestion, streak, lives, questionNumber, advanceToNext, endGame]
  )

  /* ---------------------------------------------------------------- */
  /*  Computed values                                                   */
  /* ---------------------------------------------------------------- */

  const multiplier = getMultiplier(streak)
  const currentDifficulty = getDifficultyForQuestion(questionNumber)
  const difficultyColor = PROGRAMME_COLORS[currentDifficulty] ?? 'var(--accent)'

  /* ---------------------------------------------------------------- */
  /*  Top 10 scores for display                                        */
  /* ---------------------------------------------------------------- */

  const topScores = useMemo(() => highScores.slice(0, 10), [highScores])

  /* ================================================================ */
  /*  SCREEN 1 — LOBBY                                                 */
  /* ================================================================ */

  if (screen === 'lobby') {
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
              {t('// mode survie', '// survival mode')}
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 32,
                fontWeight: 700,
                letterSpacing: '-1px',
                marginBottom: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <Flame size={32} style={{ color: 'var(--accent)' }} />
              {t('Mode Survie', 'Survival Mode')}
            </h1>
            <p
              style={{
                fontSize: 15,
                color: 'var(--text-secondary)',
                fontWeight: 300,
              }}
            >
              {t('Reponds aux questions jusqu\'a la fin. 3 vies, difficulte croissante.', 'Answer questions until the end. 3 lives, increasing difficulty.')}
            </p>
          </div>

          {/* Rules cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 16,
              marginBottom: 32,
            }}
          >
            {/* 3 vies */}
            <div
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                textAlign: 'center',
              }}
            >
              <Heart size={28} style={{ color: '#ef4444' }} />
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                {t('3 vies', '3 lives')}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                }}
              >
                {t('Chaque mauvaise reponse coute une vie. A zero, c\'est termine.', 'Each wrong answer costs a life. At zero, it\'s over.')}
              </div>
            </div>

            {/* Difficulte progressive */}
            <div
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                textAlign: 'center',
              }}
            >
              <TrendingUp size={28} style={{ color: '#f59e0b' }} />
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                {t('Difficulte progressive', 'Progressive difficulty')}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                }}
              >
                {t('Les questions deviennent plus dures au fur et a mesure.', 'Questions get harder as you progress.')}
              </div>
            </div>

            {/* Multiplicateur */}
            <div
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                textAlign: 'center',
              }}
            >
              <Zap size={28} style={{ color: '#6366f1' }} />
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                {t('Multiplicateur de streak', 'Streak multiplier')}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                }}
              >
                {t('Enchaine les bonnes reponses pour multiplier tes points.', 'Chain correct answers to multiply your points.')}
              </div>
            </div>
          </motion.div>

          {/* Scoring explanation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              padding: 24,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: 'var(--accent)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: 16,
              }}
            >
              {t('Systeme de points', 'Scoring system')}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 14,
                color: 'var(--text-primary)',
                marginBottom: 8,
              }}
            >
              {t('100 pts x multiplicateur', '100 pts x multiplier')}
            </div>
            <div
              style={{
                display: 'flex',
                gap: 16,
                flexWrap: 'wrap',
                marginBottom: 16,
              }}
            >
              {[
                { label: 'x1', range: '0-2 streak', color: 'var(--accent)' },
                { label: 'x2', range: '3-5 streak', color: '#6366f1' },
                { label: 'x3', range: '6-8 streak', color: '#f59e0b' },
                { label: 'x4', range: '9+ streak', color: '#e11d48' },
              ].map((m) => (
                <div
                  key={m.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 16,
                      fontWeight: 700,
                      color: m.color,
                    }}
                  >
                    {m.label}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      color: 'var(--text-muted)',
                    }}
                  >
                    {m.range}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Difficulty progression */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              padding: 24,
              marginBottom: 32,
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: 'var(--accent)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: 16,
              }}
            >
              {t('Progression de difficulte', 'Difficulty progression')}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Questions 1-8', prog: t('Programme 1', 'Program 1'), color: '#00e5a0' },
                { label: 'Questions 9-16', prog: t('Programme 1 + 2', 'Program 1 + 2'), color: '#6366f1' },
                { label: 'Questions 17-24', prog: t('Programme 1 + 2 + 3', 'Program 1 + 2 + 3'), color: '#f59e0b' },
                { label: 'Questions 25-30', prog: t('Programme 1 + ... + 4', 'Program 1 + ... + 4'), color: '#e11d48' },
                { label: 'Questions 31-36', prog: t('Programme 1 + ... + 5', 'Program 1 + ... + 5'), color: '#8b5cf6' },
                { label: 'Questions 37+', prog: t('Tous les programmes', 'All programs'), color: '#06b6d4' },
              ].map((d, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      background: d.color,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 13,
                      color: 'var(--text-secondary)',
                      minWidth: 130,
                    }}
                  >
                    {d.label}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      color: d.color,
                      fontWeight: 600,
                    }}
                  >
                    {d.prog}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* High scores table */}
          {topScores.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                padding: 24,
                marginBottom: 40,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: 'var(--accent)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Trophy size={14} />
                {t('Meilleurs scores', 'High scores')}
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 13,
                  }}
                >
                  <thead>
                    <tr>
                      {['#', 'Score', 'Questions', t('Streak max', 'Max streak'), 'Date'].map(
                        (h) => (
                          <th
                            key={h}
                            style={{
                              textAlign: 'left',
                              padding: '8px 12px',
                              borderBottom: '1px solid var(--border)',
                              color: 'var(--text-muted)',
                              fontSize: 11,
                              textTransform: 'uppercase',
                              letterSpacing: '1px',
                              fontWeight: 500,
                            }}
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {topScores.map((s, i) => (
                      <tr key={i}>
                        <td
                          style={{
                            padding: '8px 12px',
                            borderBottom: '1px solid var(--border)',
                            color:
                              i === 0
                                ? '#f59e0b'
                                : i === 1
                                ? '#94a3b8'
                                : i === 2
                                ? '#cd7f32'
                                : 'var(--text-secondary)',
                            fontWeight: i < 3 ? 700 : 400,
                          }}
                        >
                          {i + 1}
                        </td>
                        <td
                          style={{
                            padding: '8px 12px',
                            borderBottom: '1px solid var(--border)',
                            color: 'var(--accent)',
                            fontWeight: 700,
                          }}
                        >
                          {s.score.toLocaleString()}
                        </td>
                        <td
                          style={{
                            padding: '8px 12px',
                            borderBottom: '1px solid var(--border)',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {s.questionsAnswered}
                        </td>
                        <td
                          style={{
                            padding: '8px 12px',
                            borderBottom: '1px solid var(--border)',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {s.maxStreak}
                        </td>
                        <td
                          style={{
                            padding: '8px 12px',
                            borderBottom: '1px solid var(--border)',
                            color: 'var(--text-muted)',
                            fontSize: 12,
                          }}
                        >
                          {formatDate(s.date, lang)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Start button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            style={{ textAlign: 'center' }}
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={startGame}
              style={{
                background: 'var(--accent)',
                color: 'var(--bg-primary)',
                border: 'none',
                fontFamily: 'var(--font-heading)',
                fontSize: 18,
                fontWeight: 700,
                padding: '16px 64px',
                cursor: 'pointer',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                boxShadow: '0 0 30px rgba(0, 229, 160, 0.3)',
              }}
            >
              {t('COMMENCER', 'START')}
            </motion.button>
          </motion.div>
        </div>
      </div>
    )
  }

  /* ================================================================ */
  /*  SCREEN 2 — PLAYING                                               */
  /* ================================================================ */

  if (screen === 'playing' && currentQuestion) {
    return (
      <div style={{ paddingTop: 56 }}>
        <motion.div
          animate={shakeScreen ? { x: [-6, 6, -6, 6, 0] } : { x: 0 }}
          transition={{ duration: 0.4 }}
          style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 80px' }}
        >
          {/* Top bar */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 20,
              marginBottom: 40,
              padding: '16px 20px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
            }}
          >
            {/* Lives */}
            <motion.div
              animate={
                shakeLives
                  ? { x: [-5, 5, -5, 5, 0] }
                  : { x: 0 }
              }
              transition={{ duration: 0.4 }}
              style={{ display: 'flex', gap: 6, alignItems: 'center' }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={
                    i === lives && shakeLives
                      ? { scale: [1, 1.4, 0.8, 1], opacity: [1, 0.5, 0.3] }
                      : {}
                  }
                  transition={{ duration: 0.4 }}
                >
                  <Heart
                    size={22}
                    fill={i < lives ? '#ef4444' : 'none'}
                    color={i < lives ? '#ef4444' : 'var(--text-muted)'}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Separator */}
            <div
              style={{
                width: 1,
                height: 24,
                background: 'var(--border)',
              }}
            />

            {/* Score */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Trophy size={16} style={{ color: 'var(--accent)' }} />
              <AnimatePresence mode="wait">
                <motion.span
                  key={score}
                  initial={{ scale: 1.3, color: 'var(--accent)' }}
                  animate={{ scale: 1, color: 'var(--text-primary)' }}
                  transition={{ duration: 0.3 }}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 20,
                    fontWeight: 700,
                  }}
                >
                  {score.toLocaleString()}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Separator */}
            <div
              style={{
                width: 1,
                height: 24,
                background: 'var(--border)',
              }}
            />

            {/* Streak */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Flame
                size={16}
                style={{
                  color: streak > 0 ? getMultiplierColor(multiplier) : 'var(--text-muted)',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 14,
                  color: streak > 0 ? getMultiplierColor(multiplier) : 'var(--text-muted)',
                  fontWeight: streak > 0 ? 700 : 400,
                }}
              >
                Streak: {streak}
              </span>
            </div>

            {/* Multiplier badge */}
            <motion.div
              animate={
                multPulse
                  ? { scale: [1, 1.5, 1] }
                  : {}
              }
              transition={{ duration: 0.4 }}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: multiplier >= 3 ? 18 : multiplier >= 2 ? 16 : 14,
                fontWeight: 700,
                color: getMultiplierColor(multiplier),
                background: 'var(--bg-tertiary)',
                border: `1px solid ${getMultiplierColor(multiplier)}`,
                padding: '4px 12px',
              }}
            >
              x{multiplier}
            </motion.div>

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* Current difficulty badge */}
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                fontWeight: 600,
                color: difficultyColor,
                background: `${difficultyColor}15`,
                border: `1px solid ${difficultyColor}40`,
                padding: '4px 12px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              {currentDifficulty}
            </div>

            {/* Question counter */}
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Hash size={13} />
              Question {questionNumber}
            </div>
          </div>

          {/* Score popups */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'none',
              zIndex: 1000,
            }}
          >
            <AnimatePresence>
              {scorePopups.map((popup) => (
                <motion.div
                  key={popup.id}
                  initial={{ opacity: 1, y: 200, x: `${popup.x}%` }}
                  animate={{ opacity: 0, y: 120 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  style={{
                    position: 'absolute',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 28,
                    fontWeight: 700,
                    color: 'var(--accent)',
                    textShadow: '0 0 20px rgba(0, 229, 160, 0.5)',
                    transform: 'translateX(-50%)',
                  }}
                >
                  +{popup.value}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Question card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
            >
              {/* Question text */}
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  padding: 32,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    lineHeight: 1.6,
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {currentQuestion.question}
                </div>
              </div>

              {/* Options */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedAnswer === idx
                  const isCorrect = idx === currentQuestion.correct
                  const hasAnswered = selectedAnswer !== null

                  let borderColor = 'var(--border)'
                  let bgColor = 'var(--bg-secondary)'
                  let textColor = 'var(--text-primary)'

                  if (hasAnswered) {
                    if (isCorrect) {
                      borderColor = 'var(--success)'
                      bgColor = 'rgba(0, 229, 160, 0.08)'
                    } else if (isSelected && !isCorrect) {
                      borderColor = 'var(--error)'
                      bgColor = 'rgba(239, 68, 68, 0.08)'
                    } else {
                      textColor = 'var(--text-muted)'
                    }
                  }

                  return (
                    <motion.button
                      key={idx}
                      whileHover={!hasAnswered ? { scale: 1.01 } : {}}
                      whileTap={!hasAnswered ? { scale: 0.99 } : {}}
                      onClick={() => handleAnswer(idx)}
                      disabled={hasAnswered}
                      style={{
                        background: bgColor,
                        border: `2px solid ${borderColor}`,
                        padding: '16px 20px',
                        cursor: hasAnswered ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        textAlign: 'left',
                        transition: 'all 0.15s ease',
                        color: textColor,
                        opacity: hasAnswered && !isCorrect && !isSelected ? 0.5 : 1,
                      }}
                    >
                      {/* Letter prefix */}
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 14,
                          fontWeight: 700,
                          color: hasAnswered && isCorrect
                            ? 'var(--success)'
                            : hasAnswered && isSelected && !isCorrect
                            ? 'var(--error)'
                            : 'var(--accent)',
                          minWidth: 24,
                          flexShrink: 0,
                        }}
                      >
                        {OPTION_LETTERS[idx]}
                      </span>

                      {/* Option text */}
                      <span
                        style={{
                          fontSize: 15,
                          fontFamily: 'var(--font-body)',
                          flex: 1,
                        }}
                      >
                        {option}
                      </span>

                      {/* Result icon */}
                      {hasAnswered && isCorrect && (
                        <CheckCircle size={18} style={{ color: 'var(--success)', flexShrink: 0 }} />
                      )}
                      {hasAnswered && isSelected && !isCorrect && (
                        <XCircle size={18} style={{ color: 'var(--error)', flexShrink: 0 }} />
                      )}
                    </motion.button>
                  )
                })}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div
                      style={{
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border)',
                        borderLeft: `3px solid ${
                          selectedAnswer === currentQuestion.correct
                            ? 'var(--success)'
                            : 'var(--error)'
                        }`,
                        padding: '16px 20px',
                        fontSize: 14,
                        color: 'var(--text-secondary)',
                        lineHeight: 1.6,
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      {currentQuestion.explanation}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    )
  }

  /* ================================================================ */
  /*  SCREEN 3 — GAME OVER                                             */
  /* ================================================================ */

  if (screen === 'gameover') {
    const finalMaxStreak = Math.max(maxStreak, streak)
    const maxMultiplier = getMultiplier(finalMaxStreak)

    return (
      <div style={{ paddingTop: 56 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key="gameover"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header */}
              <div
                style={{
                  textAlign: 'center',
                  marginBottom: 48,
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                >
                  <Skull
                    size={56}
                    style={{
                      color: 'var(--error)',
                      marginBottom: 16,
                    }}
                  />
                </motion.div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--error)',
                    textTransform: 'uppercase',
                    letterSpacing: '4px',
                    marginBottom: 12,
                  }}
                >
                  {t('// fin de partie', '// game over')}
                </div>
                <h1
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 40,
                    fontWeight: 700,
                    letterSpacing: '-1px',
                    marginBottom: 8,
                    color: 'var(--text-primary)',
                  }}
                >
                  GAME OVER
                </h1>

                {/* New record */}
                {isNewRecord && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      background: 'rgba(245, 158, 11, 0.15)',
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                      padding: '8px 20px',
                      marginTop: 12,
                    }}
                  >
                    <Award size={18} style={{ color: '#f59e0b' }} />
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 14,
                        fontWeight: 700,
                        color: '#f59e0b',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                      }}
                    >
                      {t('Nouveau record personnel !', 'New personal record!')}
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Final score */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  textAlign: 'center',
                  marginBottom: 40,
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    fontFamily: 'var(--font-mono)',
                    marginBottom: 8,
                  }}
                >
                  {t('Score final', 'Final score')}
                </div>
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 150 }}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 64,
                    fontWeight: 700,
                    color: 'var(--accent)',
                    textShadow: '0 0 40px rgba(0, 229, 160, 0.3)',
                    lineHeight: 1,
                  }}
                >
                  {score.toLocaleString()}
                </motion.div>
              </motion.div>

              {/* Stats grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 16,
                  marginBottom: 40,
                }}
              >
                {[
                  {
                    label: 'Questions',
                    value: questionNumber.toString(),
                    icon: <Target size={20} />,
                    color: 'var(--accent)',
                  },
                  {
                    label: t('Streak max', 'Max streak'),
                    value: finalMaxStreak.toString(),
                    icon: <Flame size={20} />,
                    color: '#f59e0b',
                  },
                  {
                    label: t('Multiplicateur max', 'Max multiplier'),
                    value: `x${maxMultiplier}`,
                    icon: <Zap size={20} />,
                    color: getMultiplierColor(maxMultiplier),
                  },
                  {
                    label: t('Difficulte atteinte', 'Difficulty reached'),
                    value: maxDifficulty.replace('Programme ', 'P'),
                    icon: <TrendingUp size={20} />,
                    color: PROGRAMME_COLORS[maxDifficulty] ?? 'var(--accent)',
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      padding: 20,
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ color: stat.color, marginBottom: 8 }}>
                      {stat.icon}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 24,
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        marginBottom: 4,
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* High scores */}
              {topScores.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    padding: 24,
                    marginBottom: 40,
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 12,
                      color: 'var(--accent)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: 16,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <Trophy size={14} />
                    {t('Meilleurs scores', 'High scores')}
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table
                      style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 13,
                      }}
                    >
                      <thead>
                        <tr>
                          {['#', 'Score', 'Questions', t('Streak max', 'Max streak'), 'Date'].map(
                            (h) => (
                              <th
                                key={h}
                                style={{
                                  textAlign: 'left',
                                  padding: '8px 12px',
                                  borderBottom: '1px solid var(--border)',
                                  color: 'var(--text-muted)',
                                  fontSize: 11,
                                  textTransform: 'uppercase',
                                  letterSpacing: '1px',
                                  fontWeight: 500,
                                }}
                              >
                                {h}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {topScores.map((s, i) => {
                          const isCurrentScore =
                            s.score === score &&
                            s.questionsAnswered === questionNumber &&
                            new Date(s.date).getTime() >
                              Date.now() - 5000

                          return (
                            <tr
                              key={i}
                              style={{
                                background: isCurrentScore
                                  ? 'rgba(0, 229, 160, 0.06)'
                                  : 'transparent',
                              }}
                            >
                              <td
                                style={{
                                  padding: '8px 12px',
                                  borderBottom: '1px solid var(--border)',
                                  color:
                                    i === 0
                                      ? '#f59e0b'
                                      : i === 1
                                      ? '#94a3b8'
                                      : i === 2
                                      ? '#cd7f32'
                                      : 'var(--text-secondary)',
                                  fontWeight: i < 3 ? 700 : 400,
                                }}
                              >
                                {i + 1}
                              </td>
                              <td
                                style={{
                                  padding: '8px 12px',
                                  borderBottom: '1px solid var(--border)',
                                  color: isCurrentScore
                                    ? 'var(--accent)'
                                    : 'var(--text-primary)',
                                  fontWeight: 700,
                                }}
                              >
                                {s.score.toLocaleString()}
                              </td>
                              <td
                                style={{
                                  padding: '8px 12px',
                                  borderBottom: '1px solid var(--border)',
                                  color: 'var(--text-secondary)',
                                }}
                              >
                                {s.questionsAnswered}
                              </td>
                              <td
                                style={{
                                  padding: '8px 12px',
                                  borderBottom: '1px solid var(--border)',
                                  color: 'var(--text-secondary)',
                                }}
                              >
                                {s.maxStreak}
                              </td>
                              <td
                                style={{
                                  padding: '8px 12px',
                                  borderBottom: '1px solid var(--border)',
                                  color: 'var(--text-muted)',
                                  fontSize: 12,
                                }}
                              >
                                {formatDate(s.date, lang)}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                style={{
                  display: 'flex',
                  gap: 16,
                  justifyContent: 'center',
                }}
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={startGame}
                  style={{
                    background: 'var(--accent)',
                    color: 'var(--bg-primary)',
                    border: 'none',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 16,
                    fontWeight: 700,
                    padding: '14px 48px',
                    cursor: 'pointer',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: '0 0 20px rgba(0, 229, 160, 0.25)',
                  }}
                >
                  <RotateCcw size={18} />
                  {t('REJOUER', 'PLAY AGAIN')}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setScreen('lobby')}
                  style={{
                    background: 'var(--bg-tertiary)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border)',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 16,
                    fontWeight: 600,
                    padding: '14px 48px',
                    cursor: 'pointer',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <ArrowLeft size={18} />
                  {t('RETOUR', 'BACK')}
                </motion.button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    )
  }

  /* Fallback — should not reach here */
  return null
}
