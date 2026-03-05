import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Swords, Bot, User, Clock, Trophy, RotateCcw, Zap, CheckCircle, XCircle } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useLangStore } from '../stores/langStore'
import { useFormationFromUrl, useQuizzesByProgram } from '../hooks/useTranslation'
import { FORMATIONS } from '../stores/formationStore'
import type { QuizQuestion } from '../data/quizzes'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Programme = 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6' | 'Tous'
type QuestionCount = 5 | 10 | 15
type Screen = 'lobby' | 'duel' | 'results'

interface DuelQuestion extends QuizQuestion {
  playerAnswer: number | null
  botAnswer: number | null
  playerCorrect: boolean | null
  botCorrect: boolean | null
}

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

// getQuestionsForProgramme is now inside the component (uses hooks)

function getBotAccuracy(_programme: Programme): number {
  return 0.7
}

// getProgrammeLabel is now inside the component (uses formation metadata)

function getDifficultyLabel(p: Programme, lang: string): string {
  if (lang === 'en') {
    switch (p) {
      case 'P1': return 'Easy'
      case 'P2': return 'Intermediate'
      case 'P3': return 'Hard'
      case 'P4': return 'Expert'
      case 'P5': return 'Advanced'
      case 'P6': return 'Expert'
      default: return 'Mixed'
    }
  }
  switch (p) {
    case 'P1': return 'Facile'
    case 'P2': return 'Intermediaire'
    case 'P3': return 'Difficile'
    case 'P4': return 'Expert'
    case 'P5': return 'Avance'
    case 'P6': return 'Expert'
    default: return 'Mixte'
  }
}

/* ------------------------------------------------------------------ */
/*  Confetti (lightweight CSS-based)                                   */
/* ------------------------------------------------------------------ */

function ConfettiEffect() {
  const colors = ['#00e5a0', '#00ffb3', '#059669', '#10b981', '#34d399', '#6ee7b7', '#fbbf24', '#f59e0b']
  const pieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: 4 + Math.random() * 6,
    rotation: Math.random() * 360,
  }))

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1000, overflow: 'hidden' }}>
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.left}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: '110vh', opacity: 0, rotate: p.rotation + 720 }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'linear' }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size * 1.5,
            background: p.color,
            borderRadius: 1,
          }}
        />
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Thinking dots animation                                            */
/* ------------------------------------------------------------------ */

function ThinkingDots() {
  return (
    <span style={{ display: 'inline-flex', gap: 3, alignItems: 'center' }}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'var(--accent)',
            display: 'inline-block',
          }}
        />
      ))}
    </span>
  )
}

/* ================================================================== */
/*  MAIN COMPONENT                                                     */
/* ================================================================== */

export default function DuelMode() {
  const lang = useLangStore((s) => s.lang)
  const t = (fr: string, en: string) => lang === 'en' ? en : fr
  const { user } = useAuthStore()
  const formation = useFormationFromUrl()
  const quizPools = useQuizzesByProgram()
  const programs = FORMATIONS[formation].programs

  function getQuestionsForProgramme(programme: Programme): QuizQuestion[] {
    const pool: QuizQuestion[] = []
    const indices = programme === 'Tous' ? [0,1,2,3,4,5] : [parseInt(programme.slice(1)) - 1]
    indices.forEach(i => {
      if (quizPools[i]) Object.values(quizPools[i]).forEach((qs: any) => pool.push(...qs))
    })
    return pool
  }

  function getProgrammeLabel(p: Programme): string {
    if (p === 'Tous') return lang === 'en' ? 'All programs' : 'Tous les programmes'
    const idx = parseInt(p.slice(1)) - 1
    const prog = programs[idx]
    if (!prog) return p
    const name = lang === 'en' ? prog.nameEn : prog.name
    return `${lang === 'en' ? 'Program' : 'Programme'} ${idx + 1} — ${name}`
  }

  /* ----- lobby state ----- */
  const [programme, setProgramme] = useState<Programme>('Tous')
  const [questionCount, setQuestionCount] = useState<QuestionCount>(10)

  /* ----- screen state ----- */
  const [screen, setScreen] = useState<Screen>('lobby')

  /* ----- duel state ----- */
  const [questions, setQuestions] = useState<DuelQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [playerScore, setPlayerScore] = useState(0)
  const [botScore, setBotScore] = useState(0)
  const [timer, setTimer] = useState(15)
  const [playerAnswered, setPlayerAnswered] = useState(false)
  const [botAnswered, setBotAnswered] = useState(false)
  const [botThinking, setBotThinking] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [advancing, setAdvancing] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const botTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* ---------------------------------------------------------------- */
  /*  Cleanup                                                          */
  /* ---------------------------------------------------------------- */

  const clearAllTimers = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (botTimeoutRef.current) clearTimeout(botTimeoutRef.current)
    if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current)
    timerRef.current = null
    botTimeoutRef.current = null
    advanceTimeoutRef.current = null
  }, [])

  useEffect(() => {
    return () => clearAllTimers()
  }, [clearAllTimers])

  /* ---------------------------------------------------------------- */
  /*  Start duel                                                       */
  /* ---------------------------------------------------------------- */

  const startDuel = useCallback(() => {
    const pool = getQuestionsForProgramme(programme)
    const selected = shuffleArray(pool).slice(0, questionCount)
    const duelQs: DuelQuestion[] = selected.map((q) => ({
      ...q,
      playerAnswer: null,
      botAnswer: null,
      playerCorrect: null,
      botCorrect: null,
    }))
    setQuestions(duelQs)
    setCurrentIndex(0)
    setPlayerScore(0)
    setBotScore(0)
    setTimer(15)
    setPlayerAnswered(false)
    setBotAnswered(false)
    setBotThinking(false)
    setShowResults(false)
    setAdvancing(false)
    setShowConfetti(false)
    setScreen('duel')
  }, [programme, questionCount])

  /* ---------------------------------------------------------------- */
  /*  Bot answer logic                                                 */
  /* ---------------------------------------------------------------- */

  const botAnswer = useCallback(
    (qIndex: number) => {
      if (botAnswered) return
      setBotThinking(true)
      const delay = 1000 + Math.random() * 2000
      botTimeoutRef.current = setTimeout(() => {
        const q = questions[qIndex]
        if (!q) return
        const accuracy = getBotAccuracy(programme)
        const isCorrect = Math.random() < accuracy
        let answer: number
        if (isCorrect) {
          answer = q.correct
        } else {
          const wrongOptions = q.options.map((_, i) => i).filter((i) => i !== q.correct)
          answer = wrongOptions[Math.floor(Math.random() * wrongOptions.length)]
        }
        setQuestions((prev) => {
          const updated = [...prev]
          updated[qIndex] = {
            ...updated[qIndex],
            botAnswer: answer,
            botCorrect: answer === q.correct,
          }
          return updated
        })
        if (answer === q.correct) {
          setBotScore((s) => s + 1)
        }
        setBotAnswered(true)
        setBotThinking(false)
      }, delay)
    },
    [botAnswered, questions, programme]
  )

  /* ---------------------------------------------------------------- */
  /*  Player answer                                                    */
  /* ---------------------------------------------------------------- */

  const handlePlayerAnswer = useCallback(
    (answerIndex: number) => {
      if (playerAnswered || advancing) return
      const q = questions[currentIndex]
      if (!q) return

      const isCorrect = answerIndex === q.correct
      setQuestions((prev) => {
        const updated = [...prev]
        updated[currentIndex] = {
          ...updated[currentIndex],
          playerAnswer: answerIndex,
          playerCorrect: isCorrect,
        }
        return updated
      })
      if (isCorrect) {
        setPlayerScore((s) => s + 1)
      }
      setPlayerAnswered(true)

      /* stop the countdown */
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }

      /* trigger bot if not already answering */
      if (!botAnswered && !botThinking) {
        botAnswer(currentIndex)
      }
    },
    [playerAnswered, advancing, questions, currentIndex, botAnswered, botThinking, botAnswer]
  )

  /* ---------------------------------------------------------------- */
  /*  Timer auto-answer on timeout                                     */
  /* ---------------------------------------------------------------- */

  const handleTimeout = useCallback(() => {
    if (playerAnswered) return
    /* Player didn't answer: mark as wrong with null */
    setQuestions((prev) => {
      const updated = [...prev]
      updated[currentIndex] = {
        ...updated[currentIndex],
        playerAnswer: -1,
        playerCorrect: false,
      }
      return updated
    })
    setPlayerAnswered(true)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    if (!botAnswered && !botThinking) {
      botAnswer(currentIndex)
    }
  }, [playerAnswered, currentIndex, botAnswered, botThinking, botAnswer])

  /* ---------------------------------------------------------------- */
  /*  Advance to next question                                         */
  /* ---------------------------------------------------------------- */

  const advanceToNext = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      setScreen('results')
      const finalPlayerScore = questions.reduce((acc, q) => acc + (q.playerCorrect ? 1 : 0), 0) + (questions[currentIndex]?.playerCorrect ? 0 : 0)
      const finalBotScore = questions.reduce((acc, q) => acc + (q.botCorrect ? 1 : 0), 0) + (questions[currentIndex]?.botCorrect ? 0 : 0)
      if (finalPlayerScore > finalBotScore) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 5000)
      }
      return
    }
    setCurrentIndex((i) => i + 1)
    setTimer(15)
    setPlayerAnswered(false)
    setBotAnswered(false)
    setBotThinking(false)
    setShowResults(false)
    setAdvancing(false)
  }, [currentIndex, questions])

  /* ---------------------------------------------------------------- */
  /*  Auto-advance once both have answered                             */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    if (screen !== 'duel') return
    if (playerAnswered && botAnswered && !advancing) {
      setShowResults(true)
      setAdvancing(true)
      advanceTimeoutRef.current = setTimeout(() => {
        advanceToNext()
      }, 2500)
    }
  }, [playerAnswered, botAnswered, advancing, screen, advanceToNext])

  /* ---------------------------------------------------------------- */
  /*  Timer countdown                                                  */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    if (screen !== 'duel' || playerAnswered) return

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          handleTimeout()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [screen, currentIndex, playerAnswered, handleTimeout])

  /* ---------------------------------------------------------------- */
  /*  Start bot on each new question                                   */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    if (screen !== 'duel' || botAnswered || botThinking) return
    botAnswer(currentIndex)
  }, [screen, currentIndex, botAnswered, botThinking, botAnswer])

  /* ---------------------------------------------------------------- */
  /*  Reset for rematch                                                */
  /* ---------------------------------------------------------------- */

  const handleRematch = useCallback(() => {
    clearAllTimers()
    startDuel()
  }, [clearAllTimers, startDuel])

  const handleNewDuel = useCallback(() => {
    clearAllTimers()
    setScreen('lobby')
    setShowConfetti(false)
  }, [clearAllTimers])

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  const currentQuestion = questions[currentIndex] ?? null
  const playerName = user?.firstName ?? t('Joueur', 'Player')

  /* ================================================================ */
  /*  SCREEN 1 — LOBBY                                                 */
  /* ================================================================ */

  if (screen === 'lobby') {
    return (
      <div style={{ paddingTop: 56 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px 80px' }}>
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
              {t('// mode duel', '// duel mode')}
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
              {t('Mode Duel', 'Duel Mode')}
            </h1>
            <p
              style={{
                fontSize: 15,
                color: 'var(--text-secondary)',
                fontWeight: 300,
              }}
            >
              {t('Affronte le bot NetBot dans un duel de connaissances reseau', 'Challenge the NetBot in a network knowledge duel')}
            </p>
          </div>

          {/* Configuration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              padding: 28,
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
                marginBottom: 20,
              }}
            >
              {t('Configuration du duel', 'Duel configuration')}
            </div>

            {/* Programme selection */}
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  color: 'var(--text-secondary)',
                  marginBottom: 10,
                }}
              >
                {t('Programme', 'Program')}
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {(['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'Tous'] as Programme[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setProgramme(p)}
                    style={{
                      background: programme === p ? 'var(--accent)' : 'var(--bg-tertiary)',
                      border: '1px solid',
                      borderColor: programme === p ? 'var(--accent)' : 'var(--border)',
                      color: programme === p ? 'var(--bg-primary)' : 'var(--text-secondary)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 13,
                      padding: '8px 18px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      fontWeight: programme === p ? 700 : 400,
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: 'var(--text-muted)',
                  marginTop: 6,
                }}
              >
                {getProgrammeLabel(programme)}
              </div>
            </div>

            {/* Number of questions */}
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  color: 'var(--text-secondary)',
                  marginBottom: 10,
                }}
              >
                {t('Nombre de questions', 'Number of questions')}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {([5, 10, 15] as QuestionCount[]).map((n) => (
                  <button
                    key={n}
                    onClick={() => setQuestionCount(n)}
                    style={{
                      background: questionCount === n ? 'var(--accent)' : 'var(--bg-tertiary)',
                      border: '1px solid',
                      borderColor: questionCount === n ? 'var(--accent)' : 'var(--border)',
                      color: questionCount === n ? 'var(--bg-primary)' : 'var(--text-secondary)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 13,
                      padding: '8px 18px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      fontWeight: questionCount === n ? 700 : 400,
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty display */}
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  color: 'var(--text-secondary)',
                  marginBottom: 6,
                }}
              >
                {t('Difficulte', 'Difficulty')}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 13,
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Zap size={14} />
                {getDifficultyLabel(programme, lang)}
              </div>
            </div>
          </motion.div>

          {/* Player vs Bot cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              gap: 20,
              alignItems: 'center',
              marginBottom: 40,
            }}
          >
            {/* Player card */}
            <div
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                padding: 28,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  background: 'var(--bg-tertiary)',
                  border: '2px solid var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px',
                }}
              >
                <User size={28} style={{ color: 'var(--accent)' }} />
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 18,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: 4,
                }}
              >
                {playerName}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Challenger
              </div>
            </div>

            {/* VS */}
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 28,
                fontWeight: 700,
                color: 'var(--accent)',
                textAlign: 'center',
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                VS
              </motion.div>
            </div>

            {/* Bot card */}
            <div
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                padding: 28,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  background: 'var(--bg-tertiary)',
                  border: '2px solid var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px',
                }}
              >
                <Bot size={28} style={{ color: 'var(--accent)' }} />
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 18,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: 4,
                }}
              >
                NetBot
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                {getDifficultyLabel(programme, lang)}
              </div>
            </div>
          </motion.div>

          {/* Launch button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            style={{ textAlign: 'center' }}
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={startDuel}
              style={{
                background: 'var(--accent)',
                border: 'none',
                color: 'var(--bg-primary)',
                fontFamily: 'var(--font-heading)',
                fontSize: 18,
                fontWeight: 700,
                padding: '16px 48px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                letterSpacing: '-0.5px',
                transition: 'background 0.15s ease',
              }}
            >
              <Swords size={22} />
              {t('Lancer le duel', 'Start the duel')}
            </motion.button>
          </motion.div>
        </div>

        <style>{`
          @media (max-width: 640px) {
            .duel-lobby-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    )
  }

  /* ================================================================ */
  /*  SCREEN 2 — DUEL IN PROGRESS                                     */
  /* ================================================================ */

  if (screen === 'duel' && currentQuestion) {
    const timerColor = timer <= 5 ? 'var(--error)' : timer <= 10 ? '#fbbf24' : 'var(--accent)'

    return (
      <div style={{ paddingTop: 56 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px 80px' }}>
          {/* Score bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              alignItems: 'center',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              padding: '16px 24px',
              marginBottom: 24,
            }}
          >
            {/* Player score */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <User size={18} style={{ color: 'var(--accent)' }} />
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 14,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}
              >
                {playerName}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 20,
                  fontWeight: 700,
                  color: 'var(--accent)',
                }}
              >
                {playerScore}
              </span>
            </div>

            {/* Question indicator */}
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                color: 'var(--text-secondary)',
                textAlign: 'center',
              }}
            >
              Question {currentIndex + 1}/{questions.length}
            </div>

            {/* Bot score */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 20,
                  fontWeight: 700,
                  color: 'var(--accent)',
                }}
              >
                {botScore}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 14,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}
              >
                NetBot
              </span>
              <Bot size={18} style={{ color: 'var(--accent)' }} />
            </div>
          </motion.div>

          {/* Timer */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <motion.div
              key={timer}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: 'var(--font-mono)',
                fontSize: 24,
                fontWeight: 700,
                color: timerColor,
                transition: 'color 0.3s ease',
              }}
            >
              <Clock size={20} />
              {timer}s
            </motion.div>
            {/* Timer bar */}
            <div
              style={{
                width: '100%',
                height: 3,
                background: 'var(--bg-tertiary)',
                marginTop: 10,
              }}
            >
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: `${(timer / 15) * 100}%` }}
                transition={{ duration: 0.5, ease: 'linear' }}
                style={{
                  height: '100%',
                  background: timerColor,
                }}
              />
            </div>
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
            >
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  padding: 28,
                  marginBottom: 20,
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 17,
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {currentQuestion.question}
                </p>
              </div>

              {/* Answer buttons */}
              <div style={{ display: 'grid', gap: 10 }}>
                {currentQuestion.options.map((option, idx) => {
                  const isPlayerChoice = currentQuestion.playerAnswer === idx
                  const isBotChoice = currentQuestion.botAnswer === idx
                  const isCorrectAnswer = idx === currentQuestion.correct
                  const revealed = showResults || playerAnswered

                  let bg = 'var(--bg-secondary)'
                  let borderColor = 'var(--border)'
                  let textColor = 'var(--text-primary)'

                  if (revealed && isCorrectAnswer) {
                    bg = 'rgba(0, 229, 160, 0.12)'
                    borderColor = 'var(--accent)'
                  }
                  if (revealed && isPlayerChoice && !isCorrectAnswer) {
                    bg = 'rgba(239, 68, 68, 0.12)'
                    borderColor = 'var(--error)'
                  }
                  if (!revealed && !playerAnswered) {
                    /* hoverable */
                  }

                  return (
                    <motion.button
                      key={idx}
                      whileHover={!playerAnswered ? { scale: 1.01, x: 4 } : {}}
                      whileTap={!playerAnswered ? { scale: 0.99 } : {}}
                      onClick={() => handlePlayerAnswer(idx)}
                      disabled={playerAnswered}
                      style={{
                        background: bg,
                        border: `1px solid ${borderColor}`,
                        color: textColor,
                        fontFamily: 'var(--font-body)',
                        fontSize: 15,
                        padding: '14px 20px',
                        textAlign: 'left',
                        cursor: playerAnswered ? 'default' : 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 12,
                        opacity: playerAnswered && !isCorrectAnswer && !isPlayerChoice && !isBotChoice ? 0.5 : 1,
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 12,
                            color: revealed && isCorrectAnswer ? 'var(--accent)' : 'var(--text-muted)',
                            minWidth: 20,
                          }}
                        >
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        {option}
                      </span>

                      {/* Indicators */}
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {revealed && isCorrectAnswer && (
                          <CheckCircle size={18} style={{ color: 'var(--accent)' }} />
                        )}
                        {revealed && isPlayerChoice && !isCorrectAnswer && (
                          <XCircle size={18} style={{ color: 'var(--error)' }} />
                        )}
                        {revealed && isPlayerChoice && (
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: 10,
                              color: isCorrectAnswer ? 'var(--accent)' : 'var(--error)',
                              background: isCorrectAnswer ? 'rgba(0,229,160,0.15)' : 'rgba(239,68,68,0.15)',
                              padding: '2px 6px',
                            }}
                          >
                            {t('TOI', 'YOU')}
                          </span>
                        )}
                        {showResults && isBotChoice && (
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: 10,
                              color: isCorrectAnswer ? 'var(--accent)' : 'var(--error)',
                              background: isCorrectAnswer ? 'rgba(0,229,160,0.15)' : 'rgba(239,68,68,0.15)',
                              padding: '2px 6px',
                            }}
                          >
                            BOT
                          </span>
                        )}
                      </span>
                    </motion.button>
                  )
                })}
              </div>

              {/* Bot thinking indicator */}
              {botThinking && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    marginTop: 16,
                    fontFamily: 'var(--font-mono)',
                    fontSize: 13,
                    color: 'var(--text-muted)',
                  }}
                >
                  <Bot size={16} style={{ color: 'var(--accent)' }} />
                  {t('NetBot reflechit', 'NetBot is thinking')} <ThinkingDots />
                </motion.div>
              )}

              {/* Show explanation on results */}
              {showResults && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border)',
                    padding: 16,
                    marginTop: 16,
                    fontFamily: 'var(--font-body)',
                    fontSize: 13,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                  }}
                >
                  {currentQuestion.explanation}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    )
  }

  /* ================================================================ */
  /*  SCREEN 3 — RESULTS                                               */
  /* ================================================================ */

  if (screen === 'results') {
    const playerWins = playerScore > botScore
    const tie = playerScore === botScore
    const winnerText = playerWins
      ? `${playerName} ${t('remporte le duel !', 'wins the duel!')}`
      : tie
        ? t('Egalite !', 'Tie!')
        : `NetBot ${t('remporte le duel !', 'wins the duel!')}`

    return (
      <div style={{ paddingTop: 56 }}>
        {showConfetti && <ConfettiEffect />}
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px 80px' }}>
          {/* Winner announcement */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            style={{ textAlign: 'center', marginBottom: 40 }}
          >
            <motion.div
              animate={playerWins ? { rotate: [0, -5, 5, -5, 0] } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Trophy
                size={56}
                style={{
                  color: playerWins ? '#fbbf24' : tie ? 'var(--text-muted)' : 'var(--error)',
                  marginBottom: 16,
                }}
              />
            </motion.div>
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
              {t('// resultat du duel', '// duel result')}
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 32,
                fontWeight: 700,
                letterSpacing: '-1px',
                color: playerWins ? 'var(--accent)' : tie ? 'var(--text-primary)' : 'var(--error)',
                marginBottom: 8,
              }}
            >
              {winnerText}
            </h1>
            {playerWins && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{
                  fontSize: 15,
                  color: 'var(--text-secondary)',
                  fontWeight: 300,
                }}
              >
                {t('Bien joue ! Tu as domine NetBot sur ce duel.', 'Well done! You dominated NetBot in this duel.')}
              </motion.p>
            )}
          </motion.div>

          {/* Final scores */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              alignItems: 'center',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              padding: '28px 32px',
              marginBottom: 32,
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <User size={24} style={{ color: 'var(--accent)', marginBottom: 8 }} />
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 15,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: 4,
                }}
              >
                {playerName}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 36,
                  fontWeight: 700,
                  color: playerWins || tie ? 'var(--accent)' : 'var(--text-primary)',
                }}
              >
                {playerScore}
              </div>
            </div>

            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 20,
                fontWeight: 700,
                color: 'var(--text-muted)',
                padding: '0 20px',
              }}
            >
              -
            </div>

            <div style={{ textAlign: 'center' }}>
              <Bot size={24} style={{ color: 'var(--accent)', marginBottom: 8 }} />
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 15,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: 4,
                }}
              >
                NetBot
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 36,
                  fontWeight: 700,
                  color: !playerWins && !tie ? 'var(--accent)' : 'var(--text-primary)',
                }}
              >
                {botScore}
              </div>
            </div>
          </motion.div>

          {/* Detail per question */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
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
              {t('Detail par question', 'Question breakdown')}
            </div>

            <div style={{ display: 'grid', gap: 6 }}>
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '36px 1fr 80px 80px',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 12px',
                    background: idx % 2 === 0 ? 'var(--bg-tertiary)' : 'transparent',
                    fontSize: 13,
                  }}
                >
                  {/* Question number */}
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 12,
                      color: 'var(--text-muted)',
                    }}
                  >
                    Q{idx + 1}
                  </span>

                  {/* Question text (truncated) */}
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: 'var(--text-secondary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {q.question}
                  </span>

                  {/* Player result */}
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      color: q.playerCorrect ? 'var(--accent)' : 'var(--error)',
                    }}
                  >
                    {q.playerCorrect ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    {playerName.slice(0, 6)}
                  </span>

                  {/* Bot result */}
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      color: q.botCorrect ? 'var(--accent)' : 'var(--error)',
                    }}
                  >
                    {q.botCorrect ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    NetBot
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleRematch}
              style={{
                background: 'var(--accent)',
                border: 'none',
                color: 'var(--bg-primary)',
                fontFamily: 'var(--font-heading)',
                fontSize: 16,
                fontWeight: 700,
                padding: '14px 32px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <RotateCcw size={18} />
              {t('Revanche', 'Rematch')}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleNewDuel}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-heading)',
                fontSize: 16,
                fontWeight: 700,
                padding: '14px 32px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Swords size={18} />
              {t('Nouveau duel', 'New duel')}
            </motion.button>
          </motion.div>
        </div>
      </div>
    )
  }

  /* Fallback — should not reach here */
  return null
}
