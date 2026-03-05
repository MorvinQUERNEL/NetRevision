import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, ArrowRight, ArrowLeft, Shuffle, BookOpen } from 'lucide-react'
import { type Flashcard } from '../data/flashcardsData'
import { useFlashcards, useTranslation } from '../hooks/useTranslation'

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function Flashcards() {
  const { t } = useTranslation()
  const flashcardData = useFlashcards()
  const categories = useMemo(() => [...new Set(flashcardData.map(f => f.category))], [flashcardData])
  const [selectedCat, setSelectedCat] = useState<string | null>(null)
  const [cards, setCards] = useState<Flashcard[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState(0)
  const [unknown, setUnknown] = useState(0)

  const startCategory = (cat: string | null) => {
    const filtered = cat ? flashcardData.filter(f => f.category === cat) : flashcardData
    setCards(shuffleArray(filtered))
    setCurrentIdx(0)
    setFlipped(false)
    setKnown(0)
    setUnknown(0)
    setSelectedCat(cat)
  }

  const handleAnswer = (isKnown: boolean) => {
    if (isKnown) setKnown(k => k + 1)
    else setUnknown(u => u + 1)
    setFlipped(false)
    setTimeout(() => setCurrentIdx(i => i + 1), 150)
  }

  const isFinished = cards.length > 0 && currentIdx >= cards.length
  const card = cards[currentIdx]

  // Category selection screen
  if (cards.length === 0) {
    return (
      <div style={{ paddingTop: 56 }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px 80px' }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)',
              textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12,
            }}>{t('// flashcards', '// flashcards')}</div>
            <h1 style={{
              fontFamily: 'var(--font-heading)', fontSize: 32, fontWeight: 700,
              marginBottom: 8, letterSpacing: '-1px',
            }}>{t('Fiches de revision', 'Flashcards')}</h1>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 32, fontWeight: 300 }}>
              {flashcardData.length} {t('fiches couvrant tous les sujets. Choisis une categorie ou revise tout.', 'cards covering all topics. Choose a category or review everything.')}
            </p>

            <button onClick={() => startCategory(null)} style={{
              padding: '14px 28px', background: 'var(--accent)', color: 'var(--bg-primary)',
              fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8,
              border: 'none', marginBottom: 24, width: '100%', justifyContent: 'center',
            }}>
              <Shuffle size={18} /> {t('Toutes les fiches', 'All cards')} ({flashcardData.length})
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 2 }}>
              {categories.map(cat => {
                const count = flashcardData.filter(f => f.category === cat).length
                return (
                  <button key={cat} onClick={() => startCategory(cat)} style={{
                    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                    padding: '18px 16px', textAlign: 'left', transition: 'all 0.15s',
                    cursor: 'pointer',
                  }}>
                    <div style={{
                      fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 600, marginBottom: 4,
                      color: 'var(--text-primary)',
                    }}>{cat}</div>
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)',
                    }}>{count} {t('fiches', 'cards')}</div>
                  </button>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // Finished screen
  if (isFinished) {
    const total = known + unknown
    const pct = Math.round((known / total) * 100)
    return (
      <div style={{ paddingTop: 56 }}>
        <div style={{ maxWidth: 500, margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
            <BookOpen size={48} color="var(--accent)" style={{ marginBottom: 24 }} />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
              {t('Session terminee !', 'Session complete!')}
            </h2>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 48, fontWeight: 700,
              color: pct >= 70 ? 'var(--success)' : 'var(--warning)', marginBottom: 8,
            }}>{pct}%</div>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 32 }}>
              <strong style={{ color: 'var(--success)' }}>{known}</strong> {t('connues', 'known')} /
              <strong style={{ color: 'var(--error)' }}> {unknown}</strong> {t('a revoir sur', 'to review out of')} {total} {t('fiches', 'cards')}
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button onClick={() => { setCards([]); setSelectedCat(null) }} style={{
                padding: '10px 20px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                color: 'var(--text-primary)', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <RotateCcw size={14} /> {t('Changer de categorie', 'Change category')}
              </button>
              <button onClick={() => startCategory(selectedCat)} style={{
                padding: '10px 20px', background: 'var(--accent)', color: 'var(--bg-primary)',
                fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, border: 'none',
              }}>
                {t('Recommencer', 'Restart')} <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // Card view
  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{
        background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '12px 24px',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)' }}>
            {currentIdx + 1} / {cards.length}
          </span>
          <div style={{ display: 'flex', gap: 16 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--success)' }}>
              {known} {t('connues', 'known')}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--error)' }}>
              {unknown} {t('a revoir', 'to review')}
            </span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px 80px' }}>
        {/* Progress bar */}
        <div style={{ width: '100%', height: 2, background: 'var(--border)', marginBottom: 32, overflow: 'hidden' }}>
          <div style={{
            width: `${((currentIdx + 1) / cards.length) * 100}%`, height: '100%', background: 'var(--accent)',
            transition: 'width 0.3s',
          }} />
        </div>

        {/* Category badge */}
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)',
          textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16,
        }}>{card.category}</div>

        {/* Flashcard */}
        <AnimatePresence mode="wait">
          <motion.div
            key={card.id + (flipped ? '-back' : '-front')}
            initial={{ opacity: 0, rotateY: flipped ? -90 : 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setFlipped(!flipped)}
            style={{
              background: 'var(--bg-secondary)',
              border: `1px solid ${flipped ? 'var(--accent)' : 'var(--border)'}`,
              padding: '48px 32px',
              minHeight: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              textAlign: 'center',
              marginBottom: 24,
              position: 'relative',
            }}
          >
            <div style={{
              position: 'absolute', top: 12, right: 14,
              fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)',
            }}>{flipped ? t('REPONSE', 'ANSWER') : t('QUESTION', 'QUESTION')}</div>
            <div style={{
              fontFamily: flipped ? 'var(--font-body)' : 'var(--font-heading)',
              fontSize: flipped ? 18 : 22,
              fontWeight: flipped ? 400 : 600,
              color: flipped ? 'var(--accent)' : 'var(--text-primary)',
              lineHeight: 1.5,
            }}>
              {flipped ? card.back : card.front}
            </div>
          </motion.div>
        </AnimatePresence>

        {!flipped ? (
          <div style={{ textAlign: 'center' }}>
            <button onClick={() => setFlipped(true)} style={{
              padding: '12px 32px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
              color: 'var(--text-primary)', fontSize: 14, fontWeight: 500,
            }}>
              {t('Voir la reponse', 'Show answer')}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button onClick={() => handleAnswer(false)} style={{
              padding: '12px 28px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--error)',
              color: 'var(--error)', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <ArrowLeft size={14} /> {t('A revoir', 'Review')}
            </button>
            <button onClick={() => handleAnswer(true)} style={{
              padding: '12px 28px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)',
              color: 'var(--success)', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {t('Connue', 'Known')} <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
