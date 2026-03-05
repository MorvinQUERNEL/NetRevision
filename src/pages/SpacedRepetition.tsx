import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Clock, CheckCircle, RotateCcw, ArrowRight, Layers, AlertCircle } from 'lucide-react'
import { useFlashcards, useTranslation } from '../hooks/useTranslation'
import { useSpacedRepStore } from '../stores/spacedRepetitionStore'

function calcNextInterval(
  interval: number,
  easeFactor: number,
  repetitions: number,
  quality: 'again' | 'hard' | 'good' | 'easy'
): number {
  if (quality === 'again') return 1
  if (repetitions === 0) return 1
  if (repetitions === 1) return 6
  return Math.round(interval * easeFactor)
}

function formatInterval(days: number, lang: string): string {
  if (lang === 'en') {
    if (days < 7) return `${Math.max(1, Math.round(days))}d`
    if (days < 30) return `${Math.round(days / 7)}w`
    return `${Math.round(days / 30)}mo`
  }
  if (days < 7) return `${Math.max(1, Math.round(days))}j`
  if (days < 30) return `${Math.round(days / 7)}s`
  return `${Math.round(days / 30)}m`
}

export default function SpacedRepetition() {
  const { t, lang } = useTranslation()
  const flashcardData = useFlashcards()
  const { loadReviews, getDueCards, getCardReview, submitReview, getStats } = useSpacedRepStore()

  const [dueCardIds, setDueCardIds] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [sessionComplete, setSessionComplete] = useState(false)
  const [sessionTotal, setSessionTotal] = useState(0)

  useEffect(() => {
    loadReviews()
  }, [loadReviews])

  useEffect(() => {
    const ids = getDueCards()
    setDueCardIds(ids)
    setSessionTotal(ids.length)
  }, [getDueCards])

  const stats = getStats()

  const averageInterval = useMemo(() => {
    const reviews = useSpacedRepStore.getState().reviews
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((acc, r) => acc + r.interval, 0)
    return sum / reviews.length
  }, [stats])

  const currentCardId = dueCardIds[currentIndex]
  const currentCard = currentCardId
    ? flashcardData.find(f => f.id === currentCardId) || null
    : null
  const currentReview = currentCardId ? getCardReview(currentCardId) : null

  const handleReview = (quality: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentCardId) return
    submitReview(currentCardId, quality)
    setFlipped(false)

    if (currentIndex + 1 >= dueCardIds.length) {
      setSessionComplete(true)
    } else {
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1)
      }, 150)
    }
  }

  const handleRestart = () => {
    const ids = getDueCards()
    setDueCardIds(ids)
    setSessionTotal(ids.length)
    setCurrentIndex(0)
    setFlipped(false)
    setSessionComplete(false)
  }

  const nextReviewDate = useMemo(() => {
    const reviews = useSpacedRepStore.getState().reviews
    const now = new Date()
    const futureReviews = reviews
      .filter(r => new Date(r.nextReviewDate) > now)
      .sort((a, b) => new Date(a.nextReviewDate).getTime() - new Date(b.nextReviewDate).getTime())
    if (futureReviews.length === 0) return null
    const next = new Date(futureReviews[0].nextReviewDate)
    const diffMs = next.getTime() - now.getTime()
    const diffHours = Math.round(diffMs / (1000 * 60 * 60))
    if (lang === 'en') {
      if (diffHours < 24) return `in ${diffHours}h`
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
      return `in ${diffDays} day${diffDays > 1 ? 's' : ''}`
    }
    if (diffHours < 24) return `dans ${diffHours}h`
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
    return `dans ${diffDays} jour${diffDays > 1 ? 's' : ''}`
  }, [stats])

  // Session complete screen
  if (sessionComplete) {
    return (
      <div style={{ paddingTop: 56 }}>
        <div style={{ maxWidth: 500, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <CheckCircle
              size={56}
              color="var(--accent)"
              style={{ marginBottom: 24 }}
            />
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 28,
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: 12,
              letterSpacing: '-0.5px',
            }}>
              {t('Session terminee !', 'Session complete!')}
            </h2>
            <p style={{
              fontSize: 16,
              color: 'var(--text-secondary)',
              marginBottom: 8,
              fontFamily: 'var(--font-body)',
              fontWeight: 300,
            }}>
              {t(`Tu as revise`, 'You reviewed')} <strong style={{ color: 'var(--accent)', fontWeight: 600 }}>{sessionTotal}</strong> {t(`carte${sessionTotal > 1 ? 's' : ''} dans cette session.`, `card${sessionTotal > 1 ? 's' : ''} in this session.`)}
            </p>
            <p style={{
              fontSize: 14,
              color: 'var(--text-muted)',
              marginBottom: 32,
              fontFamily: 'var(--font-mono)',
            }}>
              {t('Les intervalles ont ete mis a jour selon tes reponses.', 'Intervals have been updated based on your answers.')}
            </p>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button
                onClick={handleRestart}
                style={{
                  padding: '12px 24px',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  fontSize: 14,
                  fontWeight: 500,
                  fontFamily: 'var(--font-body)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <RotateCcw size={14} /> {t('Nouvelle session', 'New session')}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px 80px' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--accent)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: 12,
          }}>
            {t('// revision espacee', '// spaced repetition')}
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 32,
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 8,
            letterSpacing: '-1px',
          }}>
            {t('Revision Espacee', 'Spaced Repetition')}
          </h1>
          <p style={{
            fontSize: 15,
            color: 'var(--text-secondary)',
            marginBottom: 32,
            fontWeight: 300,
            fontFamily: 'var(--font-body)',
            maxWidth: 600,
          }}>
            {t('Algorithme SM-2 : revise les cartes au bon moment pour ancrer les connaissances dans ta memoire a long terme.', 'SM-2 algorithm: review cards at the right time to anchor knowledge in your long-term memory.')}
          </p>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 2,
            marginBottom: 40,
          }}
        >
          {/* A reviser */}
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            padding: '20px 16px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 12,
            }}>
              <AlertCircle size={16} color="var(--accent)" />
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}>
                {t('A reviser', 'Due for review')}
              </span>
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 28,
              fontWeight: 700,
              color: 'var(--accent)',
            }}>
              {stats.dueToday}
            </div>
          </div>

          {/* Apprentissage */}
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            padding: '20px 16px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 12,
            }}>
              <Brain size={16} color="#f59e0b" />
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}>
                {t('Apprentissage', 'Learning')}
              </span>
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 28,
              fontWeight: 700,
              color: '#f59e0b',
            }}>
              {stats.learning}
            </div>
          </div>

          {/* Maitrisees */}
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            padding: '20px 16px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 12,
            }}>
              <CheckCircle size={16} color="#22c55e" />
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}>
                {t('Maitrisees', 'Mastered')}
              </span>
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 28,
              fontWeight: 700,
              color: '#22c55e',
            }}>
              {stats.mature}
            </div>
          </div>

          {/* Intervalle moyen */}
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            padding: '20px 16px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 12,
            }}>
              <Clock size={16} color="var(--text-muted)" />
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}>
                {t('Intervalle moy.', 'Avg. interval')}
              </span>
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 28,
              fontWeight: 700,
              color: 'var(--text-secondary)',
            }}>
              {formatInterval(averageInterval, lang)}
            </div>
          </div>
        </motion.div>

        {/* Main card area */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {dueCardIds.length === 0 ? (
            /* No due cards */
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              padding: '60px 32px',
              textAlign: 'center',
            }}>
              <CheckCircle
                size={48}
                color="var(--accent)"
                style={{ marginBottom: 20 }}
              />
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 24,
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: 12,
              }}>
                {t('Bravo !', 'Well done!')}
              </h2>
              <p style={{
                fontSize: 15,
                color: 'var(--text-secondary)',
                marginBottom: 8,
                fontFamily: 'var(--font-body)',
                fontWeight: 300,
              }}>
                {t('Toutes les cartes sont a jour.', 'All cards are up to date.')}
              </p>
              {nextReviewDate && (
                <p style={{
                  fontSize: 13,
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                }}>
                  {t('Prochaine revision', 'Next review')} {nextReviewDate}
                </p>
              )}
            </div>
          ) : currentCard && currentReview ? (
            /* Active card */
            <div>
              {/* Progress indicator */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <Layers size={14} color="var(--text-muted)" />
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 13,
                    color: 'var(--text-muted)',
                  }}>
                    {currentIndex + 1} / {dueCardIds.length} {t('cartes', 'cards')}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{
                width: '100%',
                height: 2,
                background: 'var(--border)',
                marginBottom: 24,
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${((currentIndex + 1) / dueCardIds.length) * 100}%`,
                  height: '100%',
                  background: 'var(--accent)',
                  transition: 'width 0.3s',
                }} />
              </div>

              {/* Category badge */}
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--accent)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: 16,
              }}>
                {currentCard.category}
              </div>

              {/* Flashcard */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCard.id + (flipped ? '-back' : '-front')}
                  initial={{ opacity: 0, rotateY: flipped ? -90 : 90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => !flipped && setFlipped(true)}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: `1px solid ${flipped ? 'var(--accent)' : 'var(--border)'}`,
                    padding: '48px 32px',
                    minHeight: 220,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: flipped ? 'default' : 'pointer',
                    textAlign: 'center',
                    marginBottom: 24,
                    position: 'relative',
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: 12,
                    right: 14,
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}>
                    {flipped ? t('REPONSE', 'ANSWER') : 'QUESTION'}
                  </div>

                  <div style={{
                    fontFamily: flipped ? 'var(--font-body)' : 'var(--font-heading)',
                    fontSize: flipped ? 18 : 22,
                    fontWeight: flipped ? 400 : 600,
                    color: flipped ? 'var(--accent)' : 'var(--text-primary)',
                    lineHeight: 1.5,
                  }}>
                    {flipped ? currentCard.back : currentCard.front}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Actions */}
              {!flipped ? (
                <div style={{ textAlign: 'center' }}>
                  <button
                    onClick={() => setFlipped(true)}
                    style={{
                      padding: '12px 32px',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      fontSize: 14,
                      fontWeight: 500,
                      fontFamily: 'var(--font-body)',
                      cursor: 'pointer',
                    }}
                  >
                    {t('Voir la reponse', 'Show answer')}
                  </button>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 8,
                }}>
                  {/* A revoir */}
                  <button
                    onClick={() => handleReview('again')}
                    style={{
                      padding: '14px 8px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#ef4444',
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: 'var(--font-body)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <span>{t('A revoir', 'Again')}</span>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      opacity: 0.8,
                    }}>
                      {t('1j', '1d')}
                    </span>
                  </button>

                  {/* Difficile */}
                  <button
                    onClick={() => handleReview('hard')}
                    style={{
                      padding: '14px 8px',
                      background: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      color: '#f59e0b',
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: 'var(--font-body)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <span>{t('Difficile', 'Hard')}</span>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      opacity: 0.8,
                    }}>
                      {formatInterval(
                        calcNextInterval(
                          currentReview.interval,
                          currentReview.easeFactor,
                          currentReview.repetitions,
                          'hard'
                        ), lang
                      )}
                    </span>
                  </button>

                  {/* Bien */}
                  <button
                    onClick={() => handleReview('good')}
                    style={{
                      padding: '14px 8px',
                      background: 'rgba(34, 197, 94, 0.1)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      color: '#22c55e',
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: 'var(--font-body)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <span>{t('Bien', 'Good')}</span>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      opacity: 0.8,
                    }}>
                      {formatInterval(
                        calcNextInterval(
                          currentReview.interval,
                          currentReview.easeFactor,
                          currentReview.repetitions,
                          'good'
                        ), lang
                      )}
                    </span>
                  </button>

                  {/* Facile */}
                  <button
                    onClick={() => handleReview('easy')}
                    style={{
                      padding: '14px 8px',
                      background: 'rgba(0, 229, 160, 0.1)',
                      border: '1px solid rgba(0, 229, 160, 0.3)',
                      color: 'var(--accent)',
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: 'var(--font-body)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <span>{t('Facile', 'Easy')}</span>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      opacity: 0.8,
                    }}>
                      {formatInterval(
                        calcNextInterval(
                          currentReview.interval,
                          currentReview.easeFactor,
                          currentReview.repetitions,
                          'easy'
                        ), lang
                      )}
                    </span>
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </motion.div>
      </div>
    </div>
  )
}
