import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy, BookOpen, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { QuizQuestion } from '../data/quizzes'
import { useTranslation, useFormationFromUrl } from '../hooks/useTranslation'

function shuffleIndices(length: number): number[] {
  const arr = Array.from({ length }, (_, i) => i)
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

interface Props {
  questions: QuizQuestion[]
  chapterId: number
  onComplete: (score: number) => void
  chapterSlug?: string
  nextChapterSlug?: string | null
}

export default function Quiz({ questions, onComplete, chapterSlug, nextChapterSlug }: Props) {
  const { t } = useTranslation()
  const formation = useFormationFromUrl()
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [shuffleKey, setShuffleKey] = useState(0)

  const shuffledOrders = useMemo(
    () => questions.map(q => shuffleIndices(q.options.length)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [questions, shuffleKey]
  )

  const q = questions[current]
  const order = shuffledOrders[current]

  const handleSelect = (idx: number) => {
    if (showResult) return
    setSelected(idx)
  }

  const handleValidate = () => {
    if (selected === null) return
    setShowResult(true)
    const originalIdx = order[selected]
    const newAnswers = [...answers, selected]
    setAnswers(newAnswers)
    if (originalIdx === q.correct) {
      setScore(s => s + 1)
    }
  }

  const isCorrect = selected !== null && order[selected] === q.correct

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1)
      setSelected(null)
      setShowResult(false)
    } else {
      setFinished(true)
      onComplete(Math.round((score / questions.length) * 100))
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
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          padding: 48,
          textAlign: 'center',
          maxWidth: 500,
          margin: '0 auto',
        }}
      >
        <div style={{
          width: 64,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          background: pct >= 70 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
          border: `1px solid ${pct >= 70 ? 'var(--success)' : 'var(--warning)'}30`,
        }}>
          <Trophy size={32} color={pct >= 70 ? 'var(--success)' : 'var(--warning)'} />
        </div>
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 24,
          fontWeight: 700,
          marginBottom: 8,
        }}>
          {pct >= 70 ? t('Bravo !', 'Well done!') : t('Ne perds pas tes efforts !', "Don't give up!")}
        </h2>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: pct >= 70 ? 28 : 12 }}>
          {t('Tu as obtenu', 'You got')} <strong style={{ color: pct >= 70 ? 'var(--success)' : 'var(--warning)', fontFamily: 'var(--font-mono)' }}>{score}/{questions.length}</strong> {t('bonnes reponses', 'correct answers')} ({pct}%)
        </p>

        {pct < 70 && (
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.5 }}>
            {t('Revise le cours pour bien maitriser les notions, puis retente le quiz.', 'Review the course to master the concepts, then try the quiz again.')}
          </p>
        )}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={handleRestart} style={{
            padding: '10px 20px',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            fontSize: 13,
            fontWeight: 500,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
          }}>
            <RotateCcw size={14} /> {t('Recommencer', 'Restart')}
          </button>

          {pct < 70 && chapterSlug && (
            <Link to={`/${formation}/cours/${chapterSlug}`} style={{
              padding: '10px 20px',
              background: 'var(--accent)',
              color: 'var(--bg-primary)',
              fontSize: 13,
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              textDecoration: 'none',
              border: 'none',
            }}>
              <BookOpen size={14} /> {t('Reviser le cours', 'Review the course')}
            </Link>
          )}

          {pct >= 70 && nextChapterSlug && (
            <Link to={`/${formation}/cours/${nextChapterSlug}`} style={{
              padding: '10px 20px',
              background: 'var(--accent)',
              color: 'var(--bg-primary)',
              fontSize: 13,
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              textDecoration: 'none',
              border: 'none',
            }}>
              {t('Chapitre suivant', 'Next chapter')} <ChevronRight size={14} />
            </Link>
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      {/* Progress bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 28,
      }}>
        <span style={{
          fontSize: 12,
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          whiteSpace: 'nowrap',
        }}>
          {String(current + 1).padStart(2, '0')}/{String(questions.length).padStart(2, '0')}
        </span>
        <div style={{
          flex: 1,
          height: 2,
          background: 'var(--border)',
          overflow: 'hidden',
        }}>
          <motion.div
            animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
            style={{
              height: '100%',
              background: 'var(--accent)',
            }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
        >
          <h3 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 20,
            fontWeight: 600,
            marginBottom: 24,
            lineHeight: 1.4,
          }}>
            {q.question}
          </h3>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {order.map((originalIdx, displayIdx) => {
              const opt = q.options[originalIdx]
              const isThisCorrect = originalIdx === q.correct
              const isThisSelected = displayIdx === selected

              let bg = 'var(--bg-secondary)'
              let border = 'var(--border)'

              if (showResult) {
                if (isThisCorrect) {
                  bg = 'rgba(16, 185, 129, 0.08)'
                  border = 'var(--success)'
                } else if (isThisSelected && !isThisCorrect) {
                  bg = 'rgba(239, 68, 68, 0.08)'
                  border = 'var(--error)'
                }
              } else if (isThisSelected) {
                bg = 'var(--accent-glow)'
                border = 'var(--accent)'
              }

              return (
                <button
                  key={displayIdx}
                  onClick={() => handleSelect(displayIdx)}
                  style={{
                    padding: '14px 16px',
                    background: bg,
                    border: `1px solid ${border}`,
                    color: 'var(--text-primary)',
                    fontSize: 14,
                    fontWeight: 400,
                    textAlign: 'left',
                    transition: 'all 0.15s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    cursor: showResult ? 'default' : 'pointer',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  <span style={{
                    width: 26,
                    height: 26,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    fontWeight: 600,
                    flexShrink: 0,
                    color: showResult && isThisCorrect ? 'var(--success)' : showResult && isThisSelected ? 'var(--error)' : 'var(--text-muted)',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border)',
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

          {/* Explanation */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  marginTop: 16,
                  padding: 16,
                  background: isCorrect ? 'rgba(16, 185, 129, 0.06)' : 'rgba(239, 68, 68, 0.06)',
                  borderLeft: `3px solid ${isCorrect ? 'var(--success)' : 'var(--error)'}`,
                }}
              >
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  <strong style={{ color: isCorrect ? 'var(--success)' : 'var(--error)' }}>
                    {isCorrect ? t('Correct !', 'Correct!') : t('Incorrect.', 'Incorrect.')}
                  </strong>{' '}
                  {q.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
            {!showResult ? (
              <button
                onClick={handleValidate}
                disabled={selected === null}
                style={{
                  padding: '10px 24px',
                  background: selected !== null ? 'var(--accent)' : 'var(--bg-tertiary)',
                  color: selected !== null ? 'var(--bg-primary)' : 'var(--text-muted)',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: selected !== null ? 'pointer' : 'not-allowed',
                  transition: 'all 0.15s',
                  border: 'none',
                }}
              >
                {t('Valider', 'Submit')}
              </button>
            ) : (
              <button
                onClick={handleNext}
                style={{
                  padding: '10px 24px',
                  background: 'var(--accent)',
                  color: 'var(--bg-primary)',
                  fontSize: 14,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  border: 'none',
                }}
              >
                {current < questions.length - 1 ? t('Suivante', 'Next') : t('Voir le resultat', 'See results')}
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
