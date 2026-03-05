import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Shield, CheckCircle2, XCircle, ArrowRight, ArrowLeft, RotateCcw, Trophy,
  Clock, ChevronUp, ChevronDown, CheckSquare, ToggleLeft, PenLine, Link2,
  ArrowUpDown, FileCode, Network, Menu, X, AlertTriangle, Lock, Download,
  Eye, ChevronDown as ChevronDownIcon
} from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'
import { useAuthStore } from '../stores/authStore'
import { useTranslation, useMegaExam, useFormationFromUrl } from '../hooks/useTranslation'
import type { MegaSection, MegaExercise, ScenarioExercise } from '../data/megaExam'

const sectionIcons: Record<string, React.ReactNode> = {
  CheckCircle2: <CheckCircle2 size={16} />,
  CheckSquare: <CheckSquare size={16} />,
  ToggleLeft: <ToggleLeft size={16} />,
  PenLine: <PenLine size={16} />,
  Link2: <Link2 size={16} />,
  ArrowUpDown: <ArrowUpDown size={16} />,
  FileCode: <FileCode size={16} />,
  Network: <Network size={16} />,
}

// Count total scoreable points for a section
function getSectionMaxPoints(section: MegaSection): number {
  return section.exercises.reduce((sum, ex) => {
    if (ex.type === 'scenario') return sum + ex.subQuestions.length
    return sum + 1
  }, 0)
}

// Count total scoreable points across all sections
function getTotalMaxPoints(sections: MegaSection[]): number {
  return sections.reduce((sum, s) => sum + getSectionMaxPoints(s), 0)
}

export default function MegaExam() {
  const { t } = useTranslation()
  const formation = useFormationFromUrl()
  const sections = useMegaExam()
  const records = useProgressStore((s) => s.records)
  const recapRef = useRef<HTMLDivElement>(null)

  // Check if all 4 exams are passed (>= 70%)
  const examSlugs = ['examen-programme-1', 'examen-programme-2', 'examen-programme-3', 'examen-programme-4']
  const examStatuses = examSlugs.map(slug => {
    const rec = records.find(r => r.chapterSlug === slug)
    return { slug, passed: rec?.examPassed === true, score: rec?.examScore ?? null }
  })
  const allExamsPassed = examStatuses.every(e => e.passed)
  const [showWarning, setShowWarning] = useState(false)

  // Show warning popup on mount if not eligible
  useEffect(() => {
    if (!allExamsPassed) setShowWarning(true)
  }, [allExamsPassed])

  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0)
  const [currentExIdx, setCurrentExIdx] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [reviewExpanded, setReviewExpanded] = useState<Record<string, boolean>>({})

  // Answers storage: exerciseId -> answer value
  const [answers, setAnswers] = useState<Record<string, unknown>>({})
  // Validated exercises (locked answers, no feedback shown)
  const [validated, setValidated] = useState<Record<string, boolean>>({})
  // Correct/incorrect per exercise (computed at validation but NOT shown)
  const [results, setResults] = useState<Record<string, boolean>>({})
  // For scenario: track sub-question answers { scenarioId: { subIdx: answerIdx } }
  const [scenarioAnswers, setScenarioAnswers] = useState<Record<string, Record<number, number>>>({})
  const [scenarioValidated, setScenarioValidated] = useState<Record<string, Record<number, boolean>>>({})
  const [scenarioResults, setScenarioResults] = useState<Record<string, Record<number, boolean>>>({})
  const [currentSubQ, setCurrentSubQ] = useState(0)

  const section = sections[currentSectionIdx]
  const exercise = section.exercises[currentExIdx]

  // Timer
  useEffect(() => {
    if (!started || finished) return
    const interval = setInterval(() => setElapsed(Date.now() - startTime), 1000)
    return () => clearInterval(interval)
  }, [started, finished, startTime])

  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000)
    const h = Math.floor(totalSec / 3600)
    const m = Math.floor((totalSec % 3600) / 60)
    const s = totalSec % 60
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    return `${m}:${String(s).padStart(2, '0')}`
  }

  // Compute scores
  const computeScores = useCallback(() => {
    let total = 0
    const perSection: Record<string, { correct: number; max: number }> = {}
    const perProgram: Record<string, { correct: number; max: number }> = {}

    for (const sec of sections) {
      let secCorrect = 0
      const secMax = getSectionMaxPoints(sec)

      for (const ex of sec.exercises) {
        if (ex.type === 'scenario') {
          const subRes = scenarioResults[ex.id] || {}
          for (let i = 0; i < ex.subQuestions.length; i++) {
            if (subRes[i]) secCorrect++
          }
          const prog = ex.topic
          if (!perProgram[prog]) perProgram[prog] = { correct: 0, max: 0 }
          perProgram[prog].max += ex.subQuestions.length
          const subCorrectCount = Object.values(subRes).filter(Boolean).length
          perProgram[prog].correct += subCorrectCount
        } else {
          if (results[ex.id]) secCorrect++
          const prog = ex.topic
          if (!perProgram[prog]) perProgram[prog] = { correct: 0, max: 0 }
          perProgram[prog].max += 1
          if (results[ex.id]) perProgram[prog].correct += 1
        }
      }

      perSection[sec.id] = { correct: secCorrect, max: secMax }
      total += secCorrect
    }

    return { total, maxTotal: getTotalMaxPoints(sections), perSection, perProgram }
  }, [sections, results, scenarioResults])

  // Progress: how many exercises validated
  const totalValidated = useMemo(() => {
    let count = 0
    Object.values(validated).forEach(v => { if (v) count++ })
    for (const sec of sections) {
      for (const ex of sec.exercises) {
        if (ex.type === 'scenario') {
          const sv = scenarioValidated[ex.id] || {}
          const allDone = ex.subQuestions.every((_, i) => sv[i])
          if (allDone) count++
        }
      }
    }
    return count
  }, [validated, scenarioValidated, sections])

  const totalExercises = useMemo(() => sections.reduce((s, sec) => s + sec.exercises.length, 0), [sections])

  // Section completion
  const getSectionCompletion = (sec: MegaSection) => {
    let done = 0
    for (const ex of sec.exercises) {
      if (ex.type === 'scenario') {
        const sv = scenarioValidated[ex.id] || {}
        if (ex.subQuestions.every((_, i) => sv[i])) done++
      } else if (validated[ex.id]) {
        done++
      }
    }
    return { done, total: sec.exercises.length }
  }

  // Check if exercise is answered (for validate button)
  const isExerciseAnswered = (): boolean => {
    if (validated[exercise.id] && exercise.type !== 'scenario') return false
    switch (exercise.type) {
      case 'qcm':
      case 'config':
        return answers[exercise.id] !== undefined
      case 'multi':
        return Array.isArray(answers[exercise.id]) && (answers[exercise.id] as number[]).length > 0
      case 'truefalse':
        return answers[exercise.id] !== undefined
      case 'short':
        return typeof answers[exercise.id] === 'string' && (answers[exercise.id] as string).trim().length > 0
      case 'matching': {
        const matchAns = answers[exercise.id] as Record<number, number> | undefined
        return !!matchAns && Object.keys(matchAns).length === exercise.pairs.length
      }
      case 'ordering':
        return true
      case 'scenario': {
        const sv = scenarioValidated[exercise.id] || {}
        if (sv[currentSubQ]) return false
        const sa = scenarioAnswers[exercise.id] || {}
        return sa[currentSubQ] !== undefined
      }
      default:
        return false
    }
  }

  // Validate current exercise — records answer internally but NO visual feedback
  const handleValidate = () => {
    if (exercise.type === 'scenario') {
      const sa = scenarioAnswers[exercise.id] || {}
      const selected = sa[currentSubQ]
      if (selected === undefined) return
      const correct = selected === (exercise as ScenarioExercise).subQuestions[currentSubQ].correct
      setScenarioValidated(prev => ({
        ...prev,
        [exercise.id]: { ...(prev[exercise.id] || {}), [currentSubQ]: true }
      }))
      setScenarioResults(prev => ({
        ...prev,
        [exercise.id]: { ...(prev[exercise.id] || {}), [currentSubQ]: correct }
      }))
      return
    }

    const exId = exercise.id
    let correct = false

    switch (exercise.type) {
      case 'qcm':
        correct = answers[exId] === exercise.correct
        break
      case 'multi': {
        const selected = (answers[exId] as number[] || []).sort()
        const expected = [...exercise.correct].sort()
        correct = selected.length === expected.length && selected.every((v, i) => v === expected[i])
        break
      }
      case 'truefalse':
        correct = answers[exId] === exercise.correct
        break
      case 'short': {
        const userAnswer = (answers[exId] as string || '').trim().toLowerCase()
        correct = exercise.acceptedAnswers.some(a => a.toLowerCase() === userAnswer)
        break
      }
      case 'matching': {
        const matchAns = answers[exId] as Record<number, number> | undefined
        if (matchAns) {
          correct = exercise.pairs.every((_, idx) => matchAns[idx] === idx)
        }
        break
      }
      case 'ordering': {
        const orderAns = answers[exId] as number[] | undefined
        if (orderAns) {
          correct = orderAns.every((v, i) => v === i)
        }
        break
      }
      case 'config':
        correct = answers[exId] === exercise.correct
        break
    }

    setValidated(prev => ({ ...prev, [exId]: true }))
    setResults(prev => ({ ...prev, [exId]: correct }))
  }

  // Navigate
  const goToExercise = (sIdx: number, eIdx: number) => {
    setCurrentSectionIdx(sIdx)
    setCurrentExIdx(eIdx)
    setCurrentSubQ(0)
    setSidebarOpen(false)
  }

  const handleNext = () => {
    if (exercise.type === 'scenario') {
      const sv = scenarioValidated[exercise.id] || {}
      if (sv[currentSubQ] && currentSubQ < (exercise as ScenarioExercise).subQuestions.length - 1) {
        setCurrentSubQ(q => q + 1)
        return
      }
    }
    if (currentExIdx < section.exercises.length - 1) {
      setCurrentExIdx(i => i + 1)
      setCurrentSubQ(0)
    } else if (currentSectionIdx < sections.length - 1) {
      setCurrentSectionIdx(s => s + 1)
      setCurrentExIdx(0)
      setCurrentSubQ(0)
    }
  }

  const handlePrev = () => {
    if (exercise.type === 'scenario' && currentSubQ > 0) {
      setCurrentSubQ(q => q - 1)
      return
    }
    if (currentExIdx > 0) {
      setCurrentExIdx(i => i - 1)
      setCurrentSubQ(0)
    } else if (currentSectionIdx > 0) {
      const prevSec = sections[currentSectionIdx - 1]
      setCurrentSectionIdx(s => s - 1)
      setCurrentExIdx(prevSec.exercises.length - 1)
      setCurrentSubQ(0)
    }
  }

  const handleFinish = () => {
    const { total, maxTotal } = computeScores()
    const finalPct = Math.round((total / maxTotal) * 100)
    setFinished(true)
    useProgressStore.getState().submitExamScore('examen-global', finalPct)
      .then(({ totalPoints }) => useAuthStore.getState().updatePoints(totalPoints))
      .catch(() => {})
  }

  const handleRestart = () => {
    setStarted(false)
    setFinished(false)
    setCurrentSectionIdx(0)
    setCurrentExIdx(0)
    setCurrentSubQ(0)
    setAnswers({})
    setValidated({})
    setResults({})
    setScenarioAnswers({})
    setScenarioValidated({})
    setScenarioResults({})
    setElapsed(0)
    setReviewExpanded({})
  }

  const handleStart = () => {
    setStarted(true)
    setStartTime(Date.now())
  }

  // PDF export
  const handleDownloadPDF = () => {
    const el = recapRef.current
    if (!el) return
    // Add print class, trigger print, remove
    el.classList.add('mega-exam-print')
    document.body.classList.add('mega-exam-printing')
    window.print()
    setTimeout(() => {
      el.classList.remove('mega-exam-print')
      document.body.classList.remove('mega-exam-printing')
    }, 500)
  }

  const isLast = currentSectionIdx === sections.length - 1 && currentExIdx === section.exercises.length - 1
  const isScenarioLast = exercise.type === 'scenario' && currentSubQ === (exercise as ScenarioExercise).subQuestions.length - 1
  const showFinish = isLast && (exercise.type !== 'scenario' || isScenarioLast)

  // Initialize ordering answers with shuffled indices
  useEffect(() => {
    if (exercise.type === 'ordering' && answers[exercise.id] === undefined) {
      const n = exercise.items.length
      const shuffled = Array.from({ length: n }, (_, i) => i)
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      setAnswers(prev => ({ ...prev, [exercise.id]: shuffled }))
    }
  }, [exercise, answers])

  // Print styles (injected once)
  useEffect(() => {
    const styleId = 'mega-exam-print-styles'
    if (document.getElementById(styleId)) return
    const style = document.createElement('style')
    style.id = styleId
    style.textContent = `
      @media print {
        body.mega-exam-printing * { visibility: hidden !important; }
        body.mega-exam-printing .mega-exam-print,
        body.mega-exam-printing .mega-exam-print * { visibility: visible !important; }
        body.mega-exam-printing .mega-exam-print {
          position: absolute !important; left: 0 !important; top: 0 !important;
          width: 100% !important; padding: 20px !important;
          background: white !important; color: #000 !important;
        }
        body.mega-exam-printing .mega-exam-print div,
        body.mega-exam-printing .mega-exam-print span,
        body.mega-exam-printing .mega-exam-print p,
        body.mega-exam-printing .mega-exam-print h2,
        body.mega-exam-printing .mega-exam-print h3,
        body.mega-exam-printing .mega-exam-print h4,
        body.mega-exam-printing .mega-exam-print pre {
          color: #000 !important; background: white !important;
          border-color: #ccc !important;
        }
        body.mega-exam-printing .mega-exam-print .review-correct {
          color: #059669 !important; border-color: #059669 !important;
        }
        body.mega-exam-printing .mega-exam-print .review-incorrect {
          color: #dc2626 !important; border-color: #dc2626 !important;
        }
        body.mega-exam-printing .mega-exam-print pre {
          background: #f5f5f5 !important; color: #333 !important;
        }
        body.mega-exam-printing .mega-exam-print button { display: none !important; }
        body.mega-exam-printing nav, body.mega-exam-printing footer { display: none !important; }
        @page { margin: 15mm; }
      }
    `
    document.head.appendChild(style)
  }, [])

  // === LANDING SCREEN ===
  if (!started) {
    return (
      <div style={{ paddingTop: 56 }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '60px 24px 80px' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center' }}>
            <div style={{
              width: 72, height: 72, margin: '0 auto 28px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(236,72,153,0.15))',
              border: '1px solid rgba(99,102,241,0.4)',
            }}>
              <Shield size={36} color="#6366f1" />
            </div>

            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6366f1',
              textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12,
            }}>
              {t('// examen global', '// comprehensive exam')}
            </div>

            <h1 style={{
              fontFamily: 'var(--font-heading)', fontSize: 36, fontWeight: 700,
              letterSpacing: '-1px', marginBottom: 16,
            }}>
              {t('Examen Global', 'Comprehensive Exam')}
            </h1>

            <p style={{
              fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7,
              marginBottom: 40, fontWeight: 300, maxWidth: 520, margin: '0 auto 40px',
            }}>
              {t(
                'Examen complet couvrant les 6 programmes avec 8 types d\'exercices varies. Duree estimee : ~2 heures. Seuil de reussite : 70%.',
                'Complete exam covering all 6 programs with 8 varied exercise types. Estimated duration: ~2 hours. Pass threshold: 70%.'
              )}
            </p>

            {/* Info cards */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2,
              marginBottom: 40, maxWidth: 520, margin: '0 auto 40px',
            }}>
              {[
                { label: 'Exercises', value: String(totalExercises), icon: <CheckCircle2 size={16} /> },
                { label: t('Duree', 'Duration'), value: '~2h', icon: <Clock size={16} /> },
                { label: t('Seuil', 'Threshold'), value: '70%', icon: <Trophy size={16} /> },
              ].map((item, i) => (
                <div key={i} style={{
                  background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                  padding: '16px 12px', textAlign: 'center',
                }}>
                  <div style={{ color: '#6366f1', marginBottom: 8, display: 'flex', justifyContent: 'center' }}>{item.icon}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: '#6366f1', marginBottom: 2 }}>{item.value}</div>
                  <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.label}</div>
                </div>
              ))}
            </div>

            {/* Sections preview */}
            <div style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              padding: 20, textAlign: 'left', maxWidth: 520, margin: '0 auto 32px',
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6366f1',
                textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16,
              }}>
                {t('8 sections', '8 sections')}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {sections.map(sec => (
                  <div key={sec.id} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 12px', background: 'var(--bg-primary)', border: '1px solid var(--border)',
                  }}>
                    <span style={{ color: sec.color, display: 'flex' }}>{sectionIcons[sec.icon]}</span>
                    <span style={{ fontSize: 13, flex: 1 }}>
                      <strong style={{ fontWeight: 600 }}>{sec.id}.</strong> {sec.title}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)',
                    }}>
                      {sec.exercises.length} {t('ex.', 'ex.')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Prerequisite status */}
            {!allExamsPassed && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.25)',
                padding: 16, maxWidth: 520, margin: '0 auto 24px', textAlign: 'left',
              }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <Lock size={18} style={{ color: 'var(--error)', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--error)', marginBottom: 8 }}>
                      {t('Prerequis non remplis', 'Prerequisites not met')}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {examStatuses.map((es, i) => (
                        <div key={es.slug} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {es.passed
                            ? <CheckCircle2 size={14} color="var(--success)" />
                            : <XCircle size={14} color="var(--error)" />}
                          <span style={{
                            fontSize: 12, fontFamily: 'var(--font-mono)',
                            color: es.passed ? 'var(--success)' : 'var(--text-secondary)',
                          }}>
                            {t(`Programme ${i + 1}`, `Program ${i + 1}`)} — {es.passed
                              ? `${es.score}% ✓`
                              : es.score !== null ? `${es.score}% (< 70%)` : t('non passe', 'not taken')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button onClick={allExamsPassed ? handleStart : undefined} disabled={!allExamsPassed} style={{
              padding: '14px 36px',
              background: allExamsPassed ? '#6366f1' : 'var(--bg-tertiary)',
              color: allExamsPassed ? 'white' : 'var(--text-muted)',
              fontSize: 15, fontWeight: 600, fontFamily: 'var(--font-body)',
              border: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
              cursor: allExamsPassed ? 'pointer' : 'not-allowed',
              opacity: allExamsPassed ? 1 : 0.6,
            }}>
              {allExamsPassed
                ? <>{t("Commencer l'examen", 'Start the exam')} <ArrowRight size={18} /></>
                : <><Lock size={16} /> {t('Examen verrouille', 'Exam locked')}</>}
            </button>

            <div style={{ marginTop: 16 }}>
              <Link to={`/${formation}/examens`} style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                {t('\u2190 retour aux examens', '\u2190 back to exams')}
              </Link>
            </div>
          </motion.div>

          {/* Warning popup */}
          <AnimatePresence>
            {showWarning && !allExamsPassed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                  background: 'rgba(0,0,0,0.6)', zIndex: 100,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: 24,
                }}
                onClick={() => setShowWarning(false)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  onClick={e => e.stopPropagation()}
                  style={{
                    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                    padding: 32, maxWidth: 460, width: '100%',
                  }}
                >
                  <div style={{
                    width: 56, height: 56, margin: '0 auto 20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)',
                  }}>
                    <AlertTriangle size={28} color="var(--warning)" />
                  </div>

                  <h3 style={{
                    fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700,
                    textAlign: 'center', marginBottom: 12,
                  }}>
                    {t('Attention', 'Warning')}
                  </h3>

                  <p style={{
                    fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7,
                    textAlign: 'center', marginBottom: 24,
                  }}>
                    {t(
                      "Tu n'as pas encore complete les examens necessaires pour participer a celui-ci. Tu dois obtenir au moins 70% aux 4 examens de programme avant de pouvoir acceder a l'examen global.",
                      "You haven't completed the required exams to participate in this one. You must score at least 70% on all 4 program exams before accessing the comprehensive exam."
                    )}
                  </p>

                  <div style={{
                    background: 'var(--bg-primary)', border: '1px solid var(--border)',
                    padding: 16, marginBottom: 24,
                  }}>
                    {examStatuses.map((es, i) => (
                      <div key={es.slug} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '8px 0',
                        borderBottom: i < 3 ? '1px solid var(--border)' : 'none',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {es.passed
                            ? <CheckCircle2 size={16} color="var(--success)" />
                            : <XCircle size={16} color="var(--error)" />}
                          <span style={{ fontSize: 13, fontWeight: 500 }}>
                            {t(`Examen Programme ${i + 1}`, `Program ${i + 1} Exam`)}
                          </span>
                        </div>
                        <span style={{
                          fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600,
                          color: es.passed ? 'var(--success)' : es.score !== null ? 'var(--error)' : 'var(--text-muted)',
                        }}>
                          {es.passed ? `${es.score}%` : es.score !== null ? `${es.score}%` : '—'}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                    <Link to={`/${formation}/examens`}>
                      <button style={{
                        padding: '10px 24px', background: '#6366f1', color: 'white',
                        fontSize: 14, fontWeight: 600, border: 'none',
                        display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                      }}>
                        {t('Aller aux examens', 'Go to exams')} <ArrowRight size={14} />
                      </button>
                    </Link>
                    <button onClick={() => setShowWarning(false)} style={{
                      padding: '10px 24px', background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border)', color: 'var(--text-primary)',
                      fontSize: 14, fontWeight: 500, cursor: 'pointer',
                    }}>
                      {t('Fermer', 'Close')}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  // === RESULTS SCREEN ===
  if (finished) {
    const { total, maxTotal, perSection, perProgram } = computeScores()
    const pct = Math.round((total / maxTotal) * 100)
    const passed = pct >= 70

    const programNames: Record<string, string> = {
      P1: t('Programme 1 — Fondamentaux', 'Program 1 — Fundamentals'),
      P2: t('Programme 2 — Approfondissement', 'Program 2 — Advanced'),
      P3: t('Programme 3 — Entreprise', 'Program 3 — Enterprise'),
      P4: t('Programme 4 — Expert', 'Program 4 — Expert'),
    }

    const programColors: Record<string, string> = {
      P1: '#00e5a0', P2: '#6366f1', P3: '#f59e0b', P4: '#e11d48',
    }

    // Helper to render user answer text for review
    const getUserAnswerText = (ex: MegaExercise): string => {
      switch (ex.type) {
        case 'qcm':
        case 'config': {
          const idx = answers[ex.id] as number | undefined
          return idx !== undefined ? ex.options[idx] : t('Pas de reponse', 'No answer')
        }
        case 'multi': {
          const idxs = (answers[ex.id] as number[]) || []
          return idxs.length > 0 ? idxs.map(i => ex.options[i]).join(', ') : t('Pas de reponse', 'No answer')
        }
        case 'truefalse': {
          const val = answers[ex.id] as boolean | undefined
          return val === true ? t('Vrai', 'True') : val === false ? t('Faux', 'False') : t('Pas de reponse', 'No answer')
        }
        case 'short':
          return (answers[ex.id] as string) || t('Pas de reponse', 'No answer')
        case 'matching': {
          const matchAns = answers[ex.id] as Record<number, number> | undefined
          if (!matchAns) return t('Pas de reponse', 'No answer')
          return ex.pairs.map((pair, idx) => {
            const selectedIdx = matchAns[idx]
            const selectedLabel = selectedIdx !== undefined ? ex.pairs[selectedIdx]?.right || '?' : '?'
            return `${pair.left} → ${selectedLabel}`
          }).join(' | ')
        }
        case 'ordering': {
          const orderAns = answers[ex.id] as number[] | undefined
          if (!orderAns) return t('Pas de reponse', 'No answer')
          return orderAns.map((itemIdx, pos) => `${pos + 1}. ${ex.items[itemIdx]}`).join(' → ')
        }
        default:
          return ''
      }
    }

    const getCorrectAnswerText = (ex: MegaExercise): string => {
      switch (ex.type) {
        case 'qcm':
        case 'config':
          return ex.options[ex.correct]
        case 'multi':
          return ex.correct.map(i => ex.options[i]).join(', ')
        case 'truefalse':
          return ex.correct ? t('Vrai', 'True') : t('Faux', 'False')
        case 'short':
          return ex.acceptedAnswers.join(', ')
        case 'matching':
          return ex.pairs.map(p => `${p.left} → ${p.right}`).join(' | ')
        case 'ordering':
          return ex.items.map((item, i) => `${i + 1}. ${item}`).join(' → ')
        default:
          return ''
      }
    }

    const toggleSection = (secId: string) => {
      setReviewExpanded(prev => ({ ...prev, [secId]: !prev[secId] }))
    }

    const expandAll = () => {
      const all: Record<string, boolean> = {}
      sections.forEach(s => { all[s.id] = true })
      setReviewExpanded(all)
    }

    const collapseAll = () => {
      setReviewExpanded({})
    }

    return (
      <div style={{ paddingTop: 56 }}>
        <div ref={recapRef} style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px 80px' }}>
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
            {/* Score header */}
            <div style={{
              background: 'var(--bg-secondary)',
              border: `1px solid ${passed ? 'var(--success)' : 'var(--warning)'}30`,
              padding: 40, textAlign: 'center', marginBottom: 24,
            }}>
              <div style={{
                width: 72, height: 72, margin: '0 auto 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: passed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                border: `1px solid ${passed ? 'var(--success)' : 'var(--warning)'}30`,
              }}>
                <Trophy size={36} color={passed ? 'var(--success)' : 'var(--warning)'} />
              </div>

              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
                {passed ? t('Examen reussi !', 'Exam passed!') : t('Examen non valide', 'Exam not passed')}
              </h2>

              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 48, fontWeight: 700, color: passed ? 'var(--success)' : 'var(--warning)', marginBottom: 8 }}>
                {pct}%
              </p>

              <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>
                <strong style={{ fontFamily: 'var(--font-mono)' }}>{total}/{maxTotal}</strong> {t('bonnes reponses en', 'correct answers in')} <Clock size={14} style={{ verticalAlign: 'middle' }} /> {formatTime(elapsed)}
              </p>
            </div>

            {/* Per-section breakdown */}
            <div style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              padding: 20, marginBottom: 24,
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6366f1',
                textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16,
              }}>
                {t('// detail par section', '// breakdown by section')}
              </div>
              {sections.map((sec, i) => {
                const s = perSection[sec.id] || { correct: 0, max: 1 }
                const secPct = Math.round((s.correct / s.max) * 100)
                return (
                  <div key={sec.id} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0',
                    borderBottom: i < sections.length - 1 ? '1px solid var(--border)' : 'none',
                  }}>
                    <span style={{ color: sec.color, display: 'flex', width: 20 }}>{sectionIcons[sec.icon]}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', width: 120, flexShrink: 0 }}>
                      {sec.id}. {sec.title}
                    </span>
                    <div style={{ flex: 1, height: 4, background: 'var(--border)', overflow: 'hidden' }}>
                      <div style={{
                        width: `${secPct}%`, height: '100%',
                        background: secPct >= 70 ? 'var(--success)' : secPct >= 50 ? 'var(--warning)' : 'var(--error)',
                      }} />
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, width: 40, textAlign: 'right',
                      color: secPct >= 70 ? 'var(--success)' : secPct >= 50 ? 'var(--warning)' : 'var(--error)',
                    }}>{s.correct}/{s.max}</span>
                  </div>
                )
              })}
            </div>

            {/* Per-program breakdown */}
            <div style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              padding: 20, marginBottom: 24,
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6366f1',
                textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16,
              }}>
                {t('// detail par programme', '// breakdown by program')}
              </div>
              {['P1', 'P2', 'P3', 'P4'].map((prog, i) => {
                const p = perProgram[prog] || { correct: 0, max: 1 }
                const progPct = p.max > 0 ? Math.round((p.correct / p.max) * 100) : 0
                return (
                  <div key={prog} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0',
                    borderBottom: i < 3 ? '1px solid var(--border)' : 'none',
                  }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: programColors[prog], width: 140, flexShrink: 0 }}>
                      {programNames[prog]}
                    </span>
                    <div style={{ flex: 1, height: 4, background: 'var(--border)', overflow: 'hidden' }}>
                      <div style={{
                        width: `${progPct}%`, height: '100%',
                        background: progPct >= 70 ? 'var(--success)' : progPct >= 50 ? 'var(--warning)' : 'var(--error)',
                      }} />
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, width: 40, textAlign: 'right',
                      color: progPct >= 70 ? 'var(--success)' : progPct >= 50 ? 'var(--warning)' : 'var(--error)',
                    }}>{p.correct}/{p.max}</span>
                  </div>
                )
              })}
            </div>

            {/* FULL REVIEW — Question by question */}
            <div style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              padding: 20, marginBottom: 24,
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16,
              }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6366f1',
                  textTransform: 'uppercase', letterSpacing: '1px',
                }}>
                  <Eye size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                  {t('// recapitulatif complet', '// full review')}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={expandAll} style={{
                    padding: '4px 10px', fontSize: 11, fontFamily: 'var(--font-mono)',
                    background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                    color: 'var(--text-secondary)', cursor: 'pointer',
                  }}>
                    {t('Tout ouvrir', 'Expand all')}
                  </button>
                  <button onClick={collapseAll} style={{
                    padding: '4px 10px', fontSize: 11, fontFamily: 'var(--font-mono)',
                    background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                    color: 'var(--text-secondary)', cursor: 'pointer',
                  }}>
                    {t('Tout fermer', 'Collapse all')}
                  </button>
                </div>
              </div>

              {sections.map(sec => {
                const isExpanded = reviewExpanded[sec.id]
                const secData = perSection[sec.id] || { correct: 0, max: 1 }
                const secPct = Math.round((secData.correct / secData.max) * 100)

                return (
                  <div key={sec.id} style={{ marginBottom: 4 }}>
                    {/* Section header — collapsible */}
                    <button onClick={() => toggleSection(sec.id)} style={{
                      width: '100%', padding: '12px 14px', textAlign: 'left',
                      background: 'var(--bg-primary)', border: '1px solid var(--border)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                      color: 'var(--text-primary)',
                    }}>
                      <span style={{ color: sec.color, display: 'flex' }}>{sectionIcons[sec.icon]}</span>
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 600, flex: 1 }}>
                        {sec.id}. {sec.title}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600,
                        color: secPct >= 70 ? 'var(--success)' : secPct >= 50 ? 'var(--warning)' : 'var(--error)',
                      }}>
                        {secData.correct}/{secData.max}
                      </span>
                      <ChevronDownIcon size={16} style={{
                        color: 'var(--text-muted)',
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                      }} />
                    </button>

                    {/* Exercise list */}
                    {isExpanded && (
                      <div style={{ borderLeft: `2px solid ${sec.color}30`, marginLeft: 12, paddingLeft: 16, paddingTop: 8, paddingBottom: 8 }}>
                        {sec.exercises.map((ex, exIdx) => {
                          if (ex.type === 'scenario') {
                            // Scenario: show each sub-question
                            const scenarioEx = ex as ScenarioExercise
                            const sr = scenarioResults[ex.id] || {}
                            const sa = scenarioAnswers[ex.id] || {}
                            return (
                              <div key={ex.id} style={{ marginBottom: 16 }}>
                                <div style={{
                                  fontSize: 13, color: 'var(--text-muted)', marginBottom: 8,
                                  fontFamily: 'var(--font-mono)',
                                }}>
                                  {t('Scenario', 'Scenario')} {exIdx + 1} — {ex.topic}
                                </div>
                                <div style={{
                                  background: 'var(--bg-primary)', border: '1px solid var(--border)',
                                  padding: 12, marginBottom: 8, fontSize: 13, lineHeight: 1.6,
                                  color: 'var(--text-secondary)',
                                }}>
                                  {scenarioEx.scenario}
                                </div>
                                {scenarioEx.diagram && (
                                  <pre style={{
                                    background: 'var(--bg-primary)', border: '1px solid var(--border)',
                                    padding: 10, fontSize: 11, fontFamily: 'var(--font-mono)',
                                    color: 'var(--accent)', overflow: 'auto', marginBottom: 8,
                                    whiteSpace: 'pre',
                                  }}>
                                    {scenarioEx.diagram}
                                  </pre>
                                )}
                                {scenarioEx.subQuestions.map((subQ, subIdx) => {
                                  const isCorrect = sr[subIdx]
                                  const userIdx = sa[subIdx]
                                  const userText = userIdx !== undefined ? subQ.options[userIdx] : t('Pas de reponse', 'No answer')
                                  const correctText = subQ.options[subQ.correct]
                                  return (
                                    <div key={subIdx} style={{
                                      padding: '10px 12px', marginBottom: 4,
                                      background: 'var(--bg-secondary)',
                                      borderLeft: `3px solid ${isCorrect ? 'var(--success)' : 'var(--error)'}`,
                                    }}>
                                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                                        <span className={isCorrect ? 'review-correct' : 'review-incorrect'} style={{
                                          display: 'flex', flexShrink: 0, marginTop: 2,
                                          color: isCorrect ? 'var(--success)' : 'var(--error)',
                                        }}>
                                          {isCorrect ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                                        </span>
                                        <span style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4 }}>
                                          Q{subIdx + 1}. {subQ.question}
                                        </span>
                                      </div>
                                      <div style={{ paddingLeft: 22, fontSize: 12, lineHeight: 1.6 }}>
                                        <div style={{ color: isCorrect ? 'var(--success)' : 'var(--error)' }}>
                                          {t('Ta reponse', 'Your answer')}: <strong>{userText}</strong>
                                        </div>
                                        {!isCorrect && (
                                          <div style={{ color: 'var(--success)' }}>
                                            {t('Bonne reponse', 'Correct answer')}: <strong>{correctText}</strong>
                                          </div>
                                        )}
                                        <div style={{ color: 'var(--text-muted)', marginTop: 4, fontStyle: 'italic' }}>
                                          {subQ.explanation}
                                        </div>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            )
                          }

                          // Non-scenario exercise
                          const isCorrect = results[ex.id]
                          const userText = getUserAnswerText(ex)
                          const correctText = getCorrectAnswerText(ex)
                          const explanation = 'explanation' in ex ? ex.explanation : ''
                          const questionText = ex.type === 'truefalse' ? ex.statement
                            : ex.type === 'matching' || ex.type === 'ordering' ? ex.instruction
                            : ex.type === 'config' ? ex.question
                            : 'question' in ex ? ex.question : ''

                          return (
                            <div key={ex.id} style={{
                              padding: '10px 12px', marginBottom: 4,
                              background: 'var(--bg-secondary)',
                              borderLeft: `3px solid ${isCorrect ? 'var(--success)' : 'var(--error)'}`,
                            }}>
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                                <span className={isCorrect ? 'review-correct' : 'review-incorrect'} style={{
                                  display: 'flex', flexShrink: 0, marginTop: 2,
                                  color: isCorrect ? 'var(--success)' : 'var(--error)',
                                }}>
                                  {isCorrect ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                                </span>
                                <span style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4 }}>
                                  {exIdx + 1}. {questionText}
                                </span>
                              </div>

                              {/* Config snippet in review */}
                              {ex.type === 'config' && (
                                <pre style={{
                                  background: 'var(--bg-primary)', border: '1px solid var(--border)',
                                  padding: 8, fontSize: 11, fontFamily: 'var(--font-mono)',
                                  color: 'var(--accent)', overflow: 'auto', marginBottom: 6, marginLeft: 22,
                                  whiteSpace: 'pre-wrap', lineHeight: 1.4,
                                }}>
                                  {ex.configSnippet}
                                </pre>
                              )}

                              <div style={{ paddingLeft: 22, fontSize: 12, lineHeight: 1.6 }}>
                                <div style={{ color: isCorrect ? 'var(--success)' : 'var(--error)' }}>
                                  {t('Ta reponse', 'Your answer')}: <strong>{userText}</strong>
                                </div>
                                {!isCorrect && (
                                  <div style={{ color: 'var(--success)' }}>
                                    {t('Bonne reponse', 'Correct answer')}: <strong>{correctText}</strong>
                                  </div>
                                )}
                                <div style={{ color: 'var(--text-muted)', marginTop: 4, fontStyle: 'italic' }}>
                                  {explanation}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={handleDownloadPDF} style={{
                padding: '10px 20px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                color: 'var(--text-primary)', fontSize: 13, fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
              }}>
                <Download size={14} /> {t('Telecharger PDF', 'Download PDF')}
              </button>
              <button onClick={handleRestart} style={{
                padding: '10px 20px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                color: 'var(--text-primary)', fontSize: 13, fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
              }}>
                <RotateCcw size={14} /> {t('Recommencer', 'Restart')}
              </button>
              <Link to={`/${formation}/progression`}>
                <button style={{
                  padding: '10px 20px', background: '#6366f1', color: 'white',
                  fontSize: 13, fontWeight: 600, border: 'none',
                  display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                }}>
                  {t('Voir ma progression', 'View my progress')} <ArrowRight size={14} />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // === EXAM SCREEN ===

  // Render exercise based on type — NO FEEDBACK after validation, just lock answers
  const renderExercise = (ex: MegaExercise) => {
    const isValidated = validated[ex.id]

    switch (ex.type) {
      case 'qcm': {
        const selected = answers[ex.id] as number | undefined
        return (
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 600, marginBottom: 24, lineHeight: 1.4 }}>
              {ex.question}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {ex.options.map((opt, idx) => {
                const isSelected = idx === selected
                let bg = 'var(--bg-secondary)'
                let border = 'var(--border)'
                if (isSelected) { bg = isValidated ? 'var(--bg-tertiary)' : 'var(--accent-glow)'; border = isValidated ? 'var(--text-muted)' : 'var(--accent)' }
                return (
                  <button key={idx} onClick={() => !isValidated && setAnswers(p => ({ ...p, [ex.id]: idx }))} style={{
                    padding: '14px 16px', background: bg, border: `1px solid ${border}`,
                    color: 'var(--text-primary)', fontSize: 14, textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: 12,
                    cursor: isValidated ? 'default' : 'pointer', fontFamily: 'var(--font-body)',
                  }}>
                    <span style={{
                      width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, flexShrink: 0,
                      color: isSelected && isValidated ? 'var(--text-primary)' : 'var(--text-muted)',
                      background: 'var(--bg-primary)', border: '1px solid var(--border)',
                    }}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {opt}
                  </button>
                )
              })}
            </div>
            {isValidated && (
              <div style={{ marginTop: 12, padding: '8px 14px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  {t('Reponse enregistree', 'Answer recorded')} <CheckCircle2 size={12} style={{ verticalAlign: 'middle' }} />
                </span>
              </div>
            )}
          </div>
        )
      }

      case 'multi': {
        const selected = (answers[ex.id] as number[]) || []
        return (
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 600, marginBottom: 24, lineHeight: 1.4 }}>
              {ex.question}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {ex.options.map((opt, idx) => {
                const isChecked = selected.includes(idx)
                let bg = 'var(--bg-secondary)'
                let border = 'var(--border)'
                if (isChecked) { bg = isValidated ? 'var(--bg-tertiary)' : 'var(--accent-glow)'; border = isValidated ? 'var(--text-muted)' : 'var(--accent)' }
                return (
                  <button key={idx} onClick={() => {
                    if (isValidated) return
                    const newSel = isChecked ? selected.filter(i => i !== idx) : [...selected, idx]
                    setAnswers(p => ({ ...p, [ex.id]: newSel }))
                  }} style={{
                    padding: '14px 16px', background: bg, border: `1px solid ${border}`,
                    color: 'var(--text-primary)', fontSize: 14, textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: 12,
                    cursor: isValidated ? 'default' : 'pointer', fontFamily: 'var(--font-body)',
                  }}>
                    <span style={{
                      width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: `2px solid ${isChecked ? (isValidated ? 'var(--text-muted)' : 'var(--accent)') : 'var(--border)'}`,
                      background: isChecked ? (isValidated ? 'var(--text-muted)' : 'var(--accent)') : 'transparent', flexShrink: 0,
                    }}>
                      {isChecked && <CheckCircle2 size={12} color="var(--bg-primary)" />}
                    </span>
                    {opt}
                  </button>
                )
              })}
            </div>
            {isValidated && (
              <div style={{ marginTop: 12, padding: '8px 14px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  {t('Reponse enregistree', 'Answer recorded')} <CheckCircle2 size={12} style={{ verticalAlign: 'middle' }} />
                </span>
              </div>
            )}
          </div>
        )
      }

      case 'truefalse': {
        const selected = answers[ex.id] as boolean | undefined
        return (
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 600, marginBottom: 24, lineHeight: 1.4 }}>
              {ex.statement}
            </h3>
            <div style={{ display: 'flex', gap: 8 }}>
              {[true, false].map(val => {
                const label = val ? t('Vrai', 'True') : t('Faux', 'False')
                const isSelected = selected === val
                let bg = 'var(--bg-secondary)'
                let border = 'var(--border)'
                if (isSelected) { bg = isValidated ? 'var(--bg-tertiary)' : 'var(--accent-glow)'; border = isValidated ? 'var(--text-muted)' : 'var(--accent)' }
                return (
                  <button key={String(val)} onClick={() => !isValidated && setAnswers(p => ({ ...p, [ex.id]: val }))} style={{
                    flex: 1, padding: '18px 16px', background: bg, border: `1px solid ${border}`,
                    color: 'var(--text-primary)', fontSize: 16, fontWeight: 600, textAlign: 'center',
                    cursor: isValidated ? 'default' : 'pointer', fontFamily: 'var(--font-body)',
                  }}>
                    {label}
                  </button>
                )
              })}
            </div>
            {isValidated && (
              <div style={{ marginTop: 12, padding: '8px 14px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  {t('Reponse enregistree', 'Answer recorded')} <CheckCircle2 size={12} style={{ verticalAlign: 'middle' }} />
                </span>
              </div>
            )}
          </div>
        )
      }

      case 'short': {
        const userAnswer = (answers[ex.id] as string) || ''
        return (
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 600, marginBottom: 24, lineHeight: 1.4 }}>
              {ex.question}
            </h3>
            {ex.hint && (
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12, fontStyle: 'italic' }}>
                {t('Indice', 'Hint')}: {ex.hint}
              </p>
            )}
            <input
              type="text"
              value={userAnswer}
              onChange={e => !isValidated && setAnswers(p => ({ ...p, [ex.id]: e.target.value }))}
              disabled={isValidated}
              placeholder={t('Tape ta reponse ici...', 'Type your answer here...')}
              style={{
                width: '100%', padding: '14px 16px', fontSize: 16,
                fontFamily: 'var(--font-mono)', background: 'var(--bg-secondary)',
                border: `1px solid ${isValidated ? 'var(--text-muted)' : 'var(--border)'}`,
                color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box',
              }}
            />
            {isValidated && (
              <div style={{ marginTop: 12, padding: '8px 14px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  {t('Reponse enregistree', 'Answer recorded')} <CheckCircle2 size={12} style={{ verticalAlign: 'middle' }} />
                </span>
              </div>
            )}
          </div>
        )
      }

      case 'matching': {
        const matchAns = (answers[ex.id] as Record<number, number>) || {}
        const rightOptions = ex.pairs.map((p, i) => ({ label: p.right, idx: i }))
        return (
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 600, marginBottom: 24, lineHeight: 1.4 }}>
              {ex.instruction}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ex.pairs.map((pair, idx) => {
                const selectedRight = matchAns[idx]
                return (
                  <div key={idx} style={{
                    display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
                    padding: '10px 14px', background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                  }}>
                    <span style={{ fontWeight: 600, fontSize: 14, minWidth: 140, color: 'var(--text-primary)' }}>
                      {pair.left}
                    </span>
                    <ArrowRight size={14} color="var(--text-muted)" />
                    <select
                      value={selectedRight !== undefined ? selectedRight : ''}
                      onChange={e => {
                        if (isValidated) return
                        const val = e.target.value === '' ? undefined : Number(e.target.value)
                        setAnswers(p => ({
                          ...p,
                          [ex.id]: { ...(matchAns), [idx]: val }
                        }))
                      }}
                      disabled={isValidated}
                      style={{
                        flex: 1, minWidth: 140, padding: '8px 12px', fontSize: 13,
                        fontFamily: 'var(--font-mono)', background: 'var(--bg-primary)',
                        border: `1px solid ${isValidated ? 'var(--text-muted)' : 'var(--border)'}`,
                        color: 'var(--text-primary)', outline: 'none',
                      }}
                    >
                      <option value="">--</option>
                      {rightOptions.map(ro => (
                        <option key={ro.idx} value={ro.idx}>{ro.label}</option>
                      ))}
                    </select>
                  </div>
                )
              })}
            </div>
            {isValidated && (
              <div style={{ marginTop: 12, padding: '8px 14px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  {t('Reponse enregistree', 'Answer recorded')} <CheckCircle2 size={12} style={{ verticalAlign: 'middle' }} />
                </span>
              </div>
            )}
          </div>
        )
      }

      case 'ordering': {
        const orderAns = (answers[ex.id] as number[]) || []
        const moveItem = (from: number, to: number) => {
          if (isValidated || to < 0 || to >= orderAns.length) return
          const newOrder = [...orderAns]
          const [item] = newOrder.splice(from, 1)
          newOrder.splice(to, 0, item)
          setAnswers(p => ({ ...p, [ex.id]: newOrder }))
        }
        return (
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 600, marginBottom: 24, lineHeight: 1.4 }}>
              {ex.instruction}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {orderAns.map((itemIdx, pos) => (
                <div key={pos} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '12px 14px', background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600,
                    color: 'var(--text-muted)', width: 24, textAlign: 'center',
                  }}>{pos + 1}</span>
                  <span style={{ flex: 1, fontSize: 14 }}>{ex.items[itemIdx]}</span>
                  {!isValidated && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <button onClick={() => moveItem(pos, pos - 1)} disabled={pos === 0} style={{
                        background: 'var(--bg-primary)', border: '1px solid var(--border)',
                        cursor: pos === 0 ? 'not-allowed' : 'pointer', padding: '2px 6px',
                        color: pos === 0 ? 'var(--text-muted)' : 'var(--text-primary)', display: 'flex',
                      }}>
                        <ChevronUp size={14} />
                      </button>
                      <button onClick={() => moveItem(pos, pos + 1)} disabled={pos === orderAns.length - 1} style={{
                        background: 'var(--bg-primary)', border: '1px solid var(--border)',
                        cursor: pos === orderAns.length - 1 ? 'not-allowed' : 'pointer', padding: '2px 6px',
                        color: pos === orderAns.length - 1 ? 'var(--text-muted)' : 'var(--text-primary)', display: 'flex',
                      }}>
                        <ChevronDown size={14} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {isValidated && (
              <div style={{ marginTop: 12, padding: '8px 14px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  {t('Reponse enregistree', 'Answer recorded')} <CheckCircle2 size={12} style={{ verticalAlign: 'middle' }} />
                </span>
              </div>
            )}
          </div>
        )
      }

      case 'config': {
        const selected = answers[ex.id] as number | undefined
        return (
          <div>
            <pre style={{
              background: 'var(--bg-primary)', border: '1px solid var(--border)',
              padding: 16, fontSize: 13, fontFamily: 'var(--font-mono)',
              color: 'var(--accent)', overflow: 'auto', marginBottom: 20,
              whiteSpace: 'pre-wrap', lineHeight: 1.5,
            }}>
              {ex.configSnippet}
            </pre>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 600, marginBottom: 20, lineHeight: 1.4 }}>
              {ex.question}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {ex.options.map((opt, idx) => {
                const isSelected = idx === selected
                let bg = 'var(--bg-secondary)'
                let border = 'var(--border)'
                if (isSelected) { bg = isValidated ? 'var(--bg-tertiary)' : 'var(--accent-glow)'; border = isValidated ? 'var(--text-muted)' : 'var(--accent)' }
                return (
                  <button key={idx} onClick={() => !isValidated && setAnswers(p => ({ ...p, [ex.id]: idx }))} style={{
                    padding: '12px 14px', background: bg, border: `1px solid ${border}`,
                    color: 'var(--text-primary)', fontSize: 14, textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: 10,
                    cursor: isValidated ? 'default' : 'pointer', fontFamily: 'var(--font-body)',
                  }}>
                    <span style={{
                      width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, flexShrink: 0,
                      color: 'var(--text-muted)',
                      background: 'var(--bg-primary)', border: '1px solid var(--border)',
                    }}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {opt}
                  </button>
                )
              })}
            </div>
            {isValidated && (
              <div style={{ marginTop: 12, padding: '8px 14px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  {t('Reponse enregistree', 'Answer recorded')} <CheckCircle2 size={12} style={{ verticalAlign: 'middle' }} />
                </span>
              </div>
            )}
          </div>
        )
      }

      case 'scenario': {
        const scenarioEx = ex as ScenarioExercise
        const sa = scenarioAnswers[ex.id] || {}
        const sv = scenarioValidated[ex.id] || {}
        const subQ = scenarioEx.subQuestions[currentSubQ]
        const subSelected = sa[currentSubQ]
        const subValidated = sv[currentSubQ]

        return (
          <div>
            <div style={{
              background: 'var(--bg-primary)', border: '1px solid var(--border)',
              padding: 16, marginBottom: 20,
            }}>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)' }}>{scenarioEx.scenario}</p>
              {scenarioEx.diagram && (
                <pre style={{
                  marginTop: 12, padding: 12, background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)', fontFamily: 'var(--font-mono)',
                  fontSize: 12, color: 'var(--accent)', overflow: 'auto', whiteSpace: 'pre',
                }}>
                  {scenarioEx.diagram}
                </pre>
              )}
            </div>

            {/* Sub-question navigation — neutral colors, just show done/current/pending */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
              {scenarioEx.subQuestions.map((_, i) => (
                <button key={i} onClick={() => setCurrentSubQ(i)} style={{
                  width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600,
                  background: i === currentSubQ ? '#6366f1' : sv[i] ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                  color: i === currentSubQ ? 'white' : sv[i] ? 'var(--text-primary)' : 'var(--text-muted)',
                  border: `1px solid ${i === currentSubQ ? '#6366f1' : 'var(--border)'}`,
                  cursor: 'pointer',
                }}>
                  {sv[i] ? '\u2713' : i + 1}
                </button>
              ))}
            </div>

            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 600, marginBottom: 20, lineHeight: 1.4 }}>
              {subQ.question}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {subQ.options.map((opt, idx) => {
                const isSelected = idx === subSelected
                let bg = 'var(--bg-secondary)'
                let border = 'var(--border)'
                if (isSelected) { bg = subValidated ? 'var(--bg-tertiary)' : 'var(--accent-glow)'; border = subValidated ? 'var(--text-muted)' : 'var(--accent)' }
                return (
                  <button key={idx} onClick={() => {
                    if (subValidated) return
                    setScenarioAnswers(p => ({
                      ...p, [ex.id]: { ...(p[ex.id] || {}), [currentSubQ]: idx }
                    }))
                  }} style={{
                    padding: '12px 14px', background: bg, border: `1px solid ${border}`,
                    color: 'var(--text-primary)', fontSize: 14, textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: 10,
                    cursor: subValidated ? 'default' : 'pointer', fontFamily: 'var(--font-body)',
                  }}>
                    <span style={{
                      width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, flexShrink: 0,
                      color: 'var(--text-muted)',
                      background: 'var(--bg-primary)', border: '1px solid var(--border)',
                    }}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {opt}
                  </button>
                )
              })}
            </div>

            {subValidated && (
              <div style={{ marginTop: 12, padding: '8px 14px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  {t('Reponse enregistree', 'Answer recorded')} <CheckCircle2 size={12} style={{ verticalAlign: 'middle' }} />
                </span>
              </div>
            )}
          </div>
        )
      }

      default:
        return null
    }
  }

  // Is the current exercise/sub-question validated?
  const isCurrentValidated = exercise.type === 'scenario'
    ? !!(scenarioValidated[exercise.id]?.[currentSubQ])
    : !!validated[exercise.id]

  // Can we show the next button?
  const canGoNext = isCurrentValidated

  return (
    <div style={{ paddingTop: 56 }}>
      {/* Header bar */}
      <div style={{
        background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)',
        padding: '10px 24px', position: 'sticky', top: 56, zIndex: 10,
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
              background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', padding: 4,
            }}>
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span style={{ color: section.color, display: 'flex' }}>{sectionIcons[section.icon]}</span>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 600 }}>
              {section.id}. {section.title}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
              <Clock size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />{formatTime(elapsed)}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
              {totalValidated}/{totalExercises}
            </span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', gap: 0 }}>
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 220, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              style={{
                background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)',
                overflow: 'hidden', flexShrink: 0, padding: '16px 0',
              }}
            >
              <div style={{ padding: '0 12px' }}>
                {sections.map((sec, sIdx) => {
                  const comp = getSectionCompletion(sec)
                  const isCurrent = sIdx === currentSectionIdx
                  return (
                    <div key={sec.id} style={{ marginBottom: 4 }}>
                      <button onClick={() => goToExercise(sIdx, 0)} style={{
                        width: '100%', padding: '8px 10px', textAlign: 'left',
                        background: isCurrent ? 'var(--bg-tertiary)' : 'transparent',
                        border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                        color: 'var(--text-primary)',
                      }}>
                        <span style={{ color: sec.color, display: 'flex' }}>{sectionIcons[sec.icon]}</span>
                        <span style={{ fontSize: 12, fontWeight: isCurrent ? 600 : 400, flex: 1 }}>{sec.id}. {sec.title}</span>
                        <span style={{
                          fontFamily: 'var(--font-mono)', fontSize: 10,
                          color: comp.done === comp.total ? 'var(--success)' : 'var(--text-muted)',
                        }}>
                          {comp.done}/{comp.total}
                        </span>
                      </button>
                      {isCurrent && (
                        <div style={{ paddingLeft: 28 }}>
                          {sec.exercises.map((_, eIdx) => {
                            const exId = sec.exercises[eIdx].id
                            const isDone = sec.exercises[eIdx].type === 'scenario'
                              ? !!(scenarioValidated[exId] && sec.exercises[eIdx].type === 'scenario' && (sec.exercises[eIdx] as ScenarioExercise).subQuestions.every((__, si) => scenarioValidated[exId]?.[si]))
                              : !!validated[exId]
                            return (
                              <button key={eIdx} onClick={() => goToExercise(sIdx, eIdx)} style={{
                                display: 'block', width: '100%', padding: '4px 8px', textAlign: 'left',
                                background: eIdx === currentExIdx ? 'var(--accent-glow)' : 'transparent',
                                border: 'none', cursor: 'pointer', fontSize: 11, fontFamily: 'var(--font-mono)',
                                color: isDone ? 'var(--text-primary)' : eIdx === currentExIdx ? 'var(--accent)' : 'var(--text-muted)',
                              }}>
                                {eIdx + 1}. {isDone ? '\u2713' : '\u25CB'}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div style={{ flex: 1, padding: '32px 24px 80px', minWidth: 0 }}>
          {/* Progress bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              {section.id}.{String(currentExIdx + 1).padStart(2, '0')}
            </span>
            <div style={{ flex: 1, height: 2, background: 'var(--border)', overflow: 'hidden' }}>
              <motion.div
                animate={{ width: `${((currentExIdx + 1) / section.exercises.length) * 100}%` }}
                style={{ height: '100%', background: section.color }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentSectionIdx}-${currentExIdx}-${currentSubQ}`}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
            >
              {renderExercise(exercise)}
            </motion.div>
          </AnimatePresence>

          {/* Action buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
            <button onClick={handlePrev} disabled={currentSectionIdx === 0 && currentExIdx === 0 && currentSubQ === 0} style={{
              padding: '10px 20px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
              color: 'var(--text-primary)', fontSize: 13, fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: 6,
              cursor: currentSectionIdx === 0 && currentExIdx === 0 && currentSubQ === 0 ? 'not-allowed' : 'pointer',
              opacity: currentSectionIdx === 0 && currentExIdx === 0 && currentSubQ === 0 ? 0.4 : 1,
            }}>
              <ArrowLeft size={14} /> {t('Precedent', 'Previous')}
            </button>

            <div style={{ display: 'flex', gap: 8 }}>
              {!isCurrentValidated && (
                <button onClick={handleValidate} disabled={!isExerciseAnswered()} style={{
                  padding: '10px 24px',
                  background: isExerciseAnswered() ? '#6366f1' : 'var(--bg-tertiary)',
                  color: isExerciseAnswered() ? 'white' : 'var(--text-muted)',
                  fontSize: 14, fontWeight: 600, border: 'none',
                  cursor: isExerciseAnswered() ? 'pointer' : 'not-allowed',
                }}>
                  {t('Valider', 'Submit')}
                </button>
              )}
              {canGoNext && !showFinish && (
                <button onClick={handleNext} style={{
                  padding: '10px 24px', background: '#6366f1', color: 'white',
                  fontSize: 14, fontWeight: 600, border: 'none',
                  display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                }}>
                  {t('Suivant', 'Next')} <ArrowRight size={14} />
                </button>
              )}
              {showFinish && canGoNext && (
                <button onClick={handleFinish} style={{
                  padding: '10px 24px', background: 'var(--success)', color: 'white',
                  fontSize: 14, fontWeight: 600, border: 'none',
                  display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                }}>
                  {t('Terminer', 'Finish')} <Trophy size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
