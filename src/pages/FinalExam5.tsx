import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy, GraduationCap, Clock, Timer } from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'
import { useAuthStore } from '../stores/authStore'
import { useTranslation, useFinalExam } from '../hooks/useTranslation'

function shuffleIndices(length: number): number[] {
  const arr = Array.from({ length }, (_, i) => i)
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export default function FinalExam5() {
  const { t } = useTranslation()
  const [started, setStarted] = useState(false)
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [startTime] = useState(Date.now())
  const [shuffleKey, setShuffleKey] = useState(0)
  const [timerMode, setTimerMode] = useState<number | null>(null)
  const [timeUp, setTimeUp] = useState(false)

  const questions = useFinalExam(5)

  const shuffledOrders = useMemo(
    () => questions.map(q => shuffleIndices(q.options.length)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [questions, shuffleKey]
  )

  const q = questions[current]
  const order = shuffledOrders[current]

  const handleSelect = (idx: number) => {
    if (showResult || timeUp) return
    setSelected(idx)
  }

  const handleValidate = () => {
    if (selected === null) return
    setShowResult(true)
    const originalIdx = order[selected]
    const correct = originalIdx === q.correct
    setAnswers([...answers, correct])
    if (correct) setScore(s => s + 1)
  }

  const isCorrect = selected !== null && order[selected] === q.correct

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1)
      setSelected(null)
      setShowResult(false)
    } else {
      const finalPct = Math.round((score / questions.length) * 100)
      setFinished(true)
      useProgressStore.getState().submitExamScore('examen-programme-5', finalPct)
        .then(({ totalPoints }) => useAuthStore.getState().updatePoints(totalPoints))
        .catch(() => {})
    }
  }

  const handleRestart = () => {
    setCurrent(0)
    setSelected(null)
    setShowResult(false)
    setScore(0)
    setFinished(false)
    setAnswers([])
    setShuffleKey(k => k + 1)
    setTimeUp(false)
  }

  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000)
    const min = Math.floor(totalSec / 60)
    const sec = totalSec % 60
    return `${min}:${String(sec).padStart(2, '0')}`
  }

  const accentColor = '#8b5cf6'

  // Landing screen
  if (!started) {
    return (
      <div style={{ paddingTop: 56 }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '60px 24px 80px' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center' }}>
            <div style={{
              width: 72, height: 72, margin: '0 auto 28px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)',
            }}>
              <GraduationCap size={36} color={accentColor} />
            </div>

            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, color: accentColor,
              textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12,
            }}>{t('// examen programme 5', '// program 5 exam')}</div>

            <h1 style={{
              fontFamily: 'var(--font-heading)', fontSize: 36, fontWeight: 700,
              letterSpacing: '-1px', marginBottom: 16,
            }}>{t('Examen - Programme 5', 'Exam - Program 5')}</h1>

            <p style={{
              fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 40,
              fontWeight: 300, maxWidth: 480, margin: '0 auto 40px',
            }}>
              {t(
                '50 questions sur les principes Wi-Fi, architectures wireless, infrastructure WLAN, securite wireless, configuration WLC et gestion des equipements.',
                '50 questions on Wi-Fi principles, wireless architectures, WLAN infrastructure, wireless security, WLC configuration and device management.'
              )}
            </p>

            {/* Exam info */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2,
              marginBottom: 32, maxWidth: 480, margin: '0 auto 32px',
            }}>
              {[
                { label: 'Questions', value: '50', icon: <CheckCircle2 size={16} /> },
                { label: t('Chapitres', 'Chapters'), value: '6', icon: <GraduationCap size={16} /> },
                { label: t('Seuil reussite', 'Pass threshold'), value: '70%', icon: <Trophy size={16} /> },
              ].map((item, i) => (
                <div key={i} style={{
                  background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                  padding: '16px 12px', textAlign: 'center',
                }}>
                  <div style={{ color: accentColor, marginBottom: 8, display: 'flex', justifyContent: 'center' }}>{item.icon}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: accentColor, marginBottom: 2 }}>{item.value}</div>
                  <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.label}</div>
                </div>
              ))}
            </div>

            {/* Timer mode selection */}
            <div style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              padding: 20, maxWidth: 480, margin: '0 auto 32px',
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, color: accentColor,
                textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12,
              }}>
                <Timer size={12} style={{ verticalAlign: 'middle' }} /> {t('Mode chronometre', 'Timer mode')}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[
                  { label: t('Sans limite', 'No limit'), value: null },
                  { label: '30 min', value: 30 },
                  { label: '45 min', value: 45 },
                  { label: '60 min', value: 60 },
                ].map(opt => (
                  <button key={opt.label} onClick={() => setTimerMode(opt.value)}
                    style={{
                      padding: '6px 16px',
                      background: timerMode === opt.value ? accentColor : 'var(--bg-primary)',
                      color: timerMode === opt.value ? 'var(--bg-primary)' : 'var(--text-secondary)',
                      border: `1px solid ${timerMode === opt.value ? accentColor : 'var(--border)'}`,
                      fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600,
                    }}>{opt.label}</button>
                ))}
              </div>
            </div>

            <button onClick={() => setStarted(true)} style={{
              padding: '14px 36px', background: accentColor, color: 'white',
              fontSize: 15, fontWeight: 600, fontFamily: 'var(--font-body)',
              border: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer',
            }}>
              {t("Commencer l'examen", 'Start the exam')} <ArrowRight size={18} />
            </button>

            <div style={{ marginTop: 16 }}>
              <Link to="/" style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                {t("\u2190 retour a l'accueil", '\u2190 back to home')}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // Results screen
  if (finished || timeUp) {
    const pct = Math.round((score / questions.length) * 100)
    const passed = pct >= 70
    const elapsed = Date.now() - startTime

    const chapterNames = [t('Principes Wi-Fi', 'Wi-Fi Principles'), t('Archi. Wireless', 'Wireless Arch.'), t('Infra. WLAN', 'WLAN Infra.'), t('Secu. Wireless', 'Wireless Sec.'), t('Config WLC', 'WLC Config'), t('Gestion Equip.', 'Device Mgmt')]
    const ranges = [[0, 8], [8, 17], [17, 25], [25, 34], [34, 42], [42, 50]]
    const chapterScores = ranges.map(([start, end], idx) => {
      let correct = 0
      for (let i = start; i < end; i++) {
        if (answers[i]) correct++
      }
      return { name: chapterNames[idx], correct, total: end - start }
    })

    return (
      <div style={{ paddingTop: 56 }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 24px 80px' }}>
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
            <div style={{
              background: 'var(--bg-secondary)',
              border: `1px solid ${passed ? 'var(--success)' : 'var(--warning)'}30`,
              padding: 40, textAlign: 'center', marginBottom: 24,
            }}>
              <div style={{
                width: 72, height: 72, margin: '0 auto 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: passed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(225, 29, 72, 0.1)',
                border: `1px solid ${passed ? 'var(--success)' : 'var(--warning)'}30`,
              }}>
                <Trophy size={36} color={passed ? 'var(--success)' : 'var(--warning)'} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
                {timeUp ? t('Temps ecoule !', 'Time is up!') : passed ? t('Examen reussi !', 'Exam passed!') : t('Examen non valide', 'Exam not passed')}
              </h2>
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: 48, fontWeight: 700,
                color: passed ? 'var(--success)' : 'var(--warning)', marginBottom: 8,
              }}>{pct}%</p>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>
                <strong style={{ fontFamily: 'var(--font-mono)' }}>{score}/{questions.length}</strong> {t('bonnes reponses en', 'correct answers in')} <Clock size={14} style={{ verticalAlign: 'middle' }} /> {formatTime(elapsed)}
              </p>
            </div>

            <div style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              padding: 20, marginBottom: 24,
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, color: accentColor,
                textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16,
              }}>{t('// detail par chapitre', '// breakdown by chapter')}</div>
              {chapterScores.map((ch, i) => {
                const chPct = Math.round((ch.correct / ch.total) * 100)
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0',
                    borderBottom: i < chapterScores.length - 1 ? '1px solid var(--border)' : 'none',
                  }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', width: 100, flexShrink: 0 }}>{ch.name}</span>
                    <div style={{ flex: 1, height: 4, background: 'var(--border)', overflow: 'hidden' }}>
                      <div style={{
                        width: `${chPct}%`, height: '100%',
                        background: chPct >= 70 ? 'var(--success)' : chPct >= 50 ? 'var(--warning)' : 'var(--error)',
                      }} />
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, width: 40, textAlign: 'right',
                      color: chPct >= 70 ? 'var(--success)' : chPct >= 50 ? 'var(--warning)' : 'var(--error)',
                    }}>{ch.correct}/{ch.total}</span>
                  </div>
                )
              })}
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button onClick={handleRestart} style={{
                padding: '10px 20px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                color: 'var(--text-primary)', fontSize: 13, fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
              }}>
                <RotateCcw size={14} /> {t('Recommencer', 'Restart')}
              </button>
              <Link to="/progression">
                <button style={{
                  padding: '10px 20px', background: accentColor, color: 'white',
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

  // Quiz screen
  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{
        background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '12px 24px',
      }}>
        <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <GraduationCap size={18} color={accentColor} />
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 600 }}>{t('Examen Programme 5', 'Exam Program 5')}</span>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
            {score} {t(`correct${score > 1 ? 's' : ''}`, 'correct')} / {current + 1} {t(`repondu${current + 1 > 1 ? 's' : ''}`, 'answered')}
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '32px 24px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
            {String(current + 1).padStart(2, '0')}/{String(questions.length).padStart(2, '0')}
          </span>
          <div style={{ flex: 1, height: 2, background: 'var(--border)', overflow: 'hidden' }}>
            <motion.div
              animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
              style={{ height: '100%', background: accentColor }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={current} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
            <h3 style={{
              fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 600, marginBottom: 24, lineHeight: 1.4,
            }}>{q.question}</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {order.map((originalIdx, displayIdx) => {
                const opt = q.options[originalIdx]
                const isThisCorrect = originalIdx === q.correct
                const isThisSelected = displayIdx === selected

                let bg = 'var(--bg-secondary)'
                let border = 'var(--border)'

                if (showResult) {
                  if (isThisCorrect) { bg = 'rgba(16, 185, 129, 0.08)'; border = 'var(--success)' }
                  else if (isThisSelected && !isThisCorrect) { bg = 'rgba(239, 68, 68, 0.08)'; border = 'var(--error)' }
                } else if (isThisSelected) { bg = 'rgba(139, 92, 246, 0.1)'; border = accentColor }

                return (
                  <button key={displayIdx} onClick={() => handleSelect(displayIdx)} style={{
                    padding: '14px 16px', background: bg, border: `1px solid ${border}`,
                    color: 'var(--text-primary)', fontSize: 14, fontWeight: 400, textAlign: 'left',
                    transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 12,
                    cursor: showResult ? 'default' : 'pointer', fontFamily: 'var(--font-body)',
                  }}>
                    <span style={{
                      width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, flexShrink: 0,
                      color: showResult && isThisCorrect ? 'var(--success)' : showResult && isThisSelected ? 'var(--error)' : 'var(--text-muted)',
                      background: 'var(--bg-primary)', border: '1px solid var(--border)',
                    }}>
                      {showResult && isThisCorrect ? <CheckCircle2 size={14} /> :
                       showResult && isThisSelected && !isThisCorrect ? <XCircle size={14} /> :
                       String.fromCharCode(65 + displayIdx)}
                    </span>
                    {opt}
                  </button>
                )
              })}
            </div>

            <AnimatePresence>
              {showResult && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  style={{
                    marginTop: 16, padding: 16,
                    background: isCorrect ? 'rgba(16, 185, 129, 0.06)' : 'rgba(239, 68, 68, 0.06)',
                    borderLeft: `3px solid ${isCorrect ? 'var(--success)' : 'var(--error)'}`,
                  }}>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <strong style={{ color: isCorrect ? 'var(--success)' : 'var(--error)' }}>
                      {isCorrect ? t('Correct !', 'Correct!') : t('Incorrect.', 'Incorrect.')}
                    </strong>{' '}
                    {q.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
              {!showResult ? (
                <button onClick={handleValidate} disabled={selected === null} style={{
                  padding: '10px 24px',
                  background: selected !== null ? accentColor : 'var(--bg-tertiary)',
                  color: selected !== null ? 'white' : 'var(--text-muted)',
                  fontSize: 14, fontWeight: 600, cursor: selected !== null ? 'pointer' : 'not-allowed', border: 'none',
                }}>{t('Valider', 'Submit')}</button>
              ) : (
                <button onClick={handleNext} style={{
                  padding: '10px 24px', background: accentColor, color: 'white',
                  fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, border: 'none', cursor: 'pointer',
                }}>
                  {current < questions.length - 1 ? t('Suivante', 'Next') : t('Voir le resultat', 'See results')} <ArrowRight size={14} />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
