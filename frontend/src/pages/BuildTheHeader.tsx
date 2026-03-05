import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Star, Timer, RotateCcw, Trophy, CheckCircle, XCircle, ChevronRight, GripVertical } from 'lucide-react'
import { Link } from 'react-router-dom'
import { type HeaderField } from '../data/miniGamesData'
import { useLangStore } from '../stores/langStore'
import { useMiniGamesData } from '../hooks/useTranslation'

type Category = 'Ethernet' | 'IP' | 'TCP'

interface PlacedField {
  slotIndex: number
  field: HeaderField
  correct: boolean
}

interface RoundResult {
  category: Category
  score: number
  maxScore: number
  time: number
}

interface SaveData {
  bestScore: number | null
  bestTime: number | null
  bestStars: number
  rounds: Record<Category, { score: number; time: number } | null>
}

function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem('nr_minigame_header')
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return { bestScore: null, bestTime: null, bestStars: 0, rounds: { Ethernet: null, IP: null, TCP: null } }
}

function writeSave(data: SaveData) {
  localStorage.setItem('nr_minigame_header', JSON.stringify(data))
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const ROUND_ORDER: Category[] = ['Ethernet', 'IP', 'TCP']
const ROUND_LABELS_FR: Record<Category, string> = {
  Ethernet: 'Trame Ethernet',
  IP: 'En-tete IP',
  TCP: 'En-tete TCP',
}
const ROUND_LABELS_EN: Record<Category, string> = {
  Ethernet: 'Ethernet Frame',
  IP: 'IP Header',
  TCP: 'TCP Header',
}
const ROUND_COLORS: Record<Category, string> = {
  Ethernet: '#f59e0b',
  IP: '#6366f1',
  TCP: '#00e5a0',
}

export default function BuildTheHeader() {
  const lang = useLangStore((s) => s.lang)
  const t = (fr: string, en: string) => lang === 'en' ? en : fr
  const { headerFields } = useMiniGamesData()
  const ROUND_LABELS = lang === 'en' ? ROUND_LABELS_EN : ROUND_LABELS_FR
  const [save, setSave] = useState<SaveData>(loadSave)
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'round_complete' | 'final'>('intro')
  const [roundIndex, setRoundIndex] = useState(0)
  const [availableFields, setAvailableFields] = useState<HeaderField[]>([])
  const [slots, setSlots] = useState<(HeaderField | null)[]>([])
  const [correctSlots, setCorrectSlots] = useState<Set<number>>(new Set())
  const [wrongSlot, setWrongSlot] = useState<number | null>(null)
  const [selectedField, setSelectedField] = useState<HeaderField | null>(null)
  const [draggedField, setDraggedField] = useState<HeaderField | null>(null)
  const [timer, setTimer] = useState(0)
  const [roundResults, setRoundResults] = useState<RoundResult[]>([])
  const [roundTimer, setRoundTimer] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const currentCategory = ROUND_ORDER[roundIndex]
  const categoryFields = headerFields.filter(f => f.category === currentCategory).sort((a, b) => a.position - b.position)

  const startGame = useCallback(() => {
    setRoundIndex(0)
    setRoundResults([])
    setTimer(0)
    setGameState('playing')
    initRound(0)
  }, [])

  const initRound = (idx: number) => {
    const cat = ROUND_ORDER[idx]
    const fields = headerFields.filter(f => f.category === cat).sort((a, b) => a.position - b.position)
    setAvailableFields(shuffleArray(fields))
    setSlots(new Array(fields.length).fill(null))
    setCorrectSlots(new Set())
    setWrongSlot(null)
    setSelectedField(null)
    setDraggedField(null)
    setRoundTimer(0)
  }

  // Timer
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimer(t => t + 1)
        setRoundTimer(t => t + 1)
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [gameState])

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  const placeFieldInSlot = useCallback((field: HeaderField, slotIndex: number) => {
    if (correctSlots.has(slotIndex)) return
    if (slots[slotIndex] !== null) return

    const isCorrect = field.position === slotIndex

    if (isCorrect) {
      const newSlots = [...slots]
      newSlots[slotIndex] = field
      setSlots(newSlots)
      setAvailableFields(prev => prev.filter(f => f.name !== field.name))
      setCorrectSlots(prev => {
        const next = new Set(prev)
        next.add(slotIndex)
        return next
      })
      setSelectedField(null)
      setDraggedField(null)

      // Check round complete
      const newCorrectCount = correctSlots.size + 1
      const totalFields = headerFields.filter(f => f.category === currentCategory).length
      if (newCorrectCount === totalFields) {
        const score = totalFields // All correct since we only accept correct placements
        const result: RoundResult = {
          category: currentCategory,
          score,
          maxScore: totalFields,
          time: roundTimer,
        }
        const newResults = [...roundResults, result]
        setRoundResults(newResults)

        if (roundIndex < 2) {
          setGameState('round_complete')
        } else {
          // All rounds done
          setGameState('final')
          const totalScore = newResults.reduce((a, r) => a + r.score, 0)
          const maxTotal = newResults.reduce((a, r) => a + r.maxScore, 0)
          const pct = totalScore / maxTotal
          let stars = 1
          if (pct >= 0.95) stars = 3
          else if (pct >= 0.7) stars = 2

          const newSave = { ...save }
          if (!newSave.bestScore || totalScore > newSave.bestScore) {
            newSave.bestScore = totalScore
          }
          if (!newSave.bestTime || timer < newSave.bestTime) {
            newSave.bestTime = timer
          }
          newSave.bestStars = Math.max(newSave.bestStars, stars)
          newResults.forEach(r => {
            const prev = newSave.rounds[r.category]
            if (!prev || r.score > prev.score) {
              newSave.rounds[r.category] = { score: r.score, time: r.time }
            }
          })
          setSave(newSave)
          writeSave(newSave)
        }
      }
    } else {
      // Wrong placement
      setWrongSlot(slotIndex)
      setTimeout(() => setWrongSlot(null), 600)
      setSelectedField(null)
      setDraggedField(null)
    }
  }, [slots, correctSlots, currentCategory, roundTimer, roundResults, roundIndex, timer, save])

  const handleSlotClick = useCallback((slotIndex: number) => {
    if (!selectedField) return
    placeFieldInSlot(selectedField, slotIndex)
  }, [selectedField, placeFieldInSlot])

  const handleFieldClick = useCallback((field: HeaderField) => {
    if (selectedField?.name === field.name) {
      setSelectedField(null)
    } else {
      setSelectedField(field)
    }
  }, [selectedField])

  const handleDragStart = (field: HeaderField) => {
    setDraggedField(field)
    setSelectedField(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (slotIndex: number) => {
    if (draggedField) {
      placeFieldInSlot(draggedField, slotIndex)
    }
  }

  const nextRound = () => {
    const next = roundIndex + 1
    setRoundIndex(next)
    initRound(next)
    setGameState('playing')
  }

  // Intro screen
  if (gameState === 'intro') {
    return (
      <div style={{ paddingTop: 56 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px' }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/mini-jeux" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 13, textDecoration: 'none', marginBottom: 24 }}>
              <ArrowLeft size={14} /> {t('Mini-Jeux', 'Mini-Games')}
            </Link>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12 }}>
              // BUILD THE HEADER
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 32, fontWeight: 700, marginBottom: 8, letterSpacing: '-1px' }}>
              Build the Header
            </h1>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 32, fontWeight: 300, maxWidth: 600 }}>
              {t('Reconstitue les en-tetes reseau en placant les champs dans le bon ordre. 3 rounds : Trame Ethernet, en-tete IP, puis en-tete TCP.', 'Rebuild network headers by placing fields in the correct order. 3 rounds: Ethernet frame, IP header, then TCP header.')}
            </p>

            {/* Round preview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 2, marginBottom: 32 }}>
              {ROUND_ORDER.map((cat, i) => {
                const fields = headerFields.filter(f => f.category === cat)
                const best = save.rounds[cat]
                return (
                  <div key={cat} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: 20 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: ROUND_COLORS[cat], marginBottom: 6 }}>
                      Round {i + 1}
                    </div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
                      {ROUND_LABELS[cat]}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                      {fields.length} {t('champs', 'fields')}
                    </div>
                    {best ? (
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)' }}>
                        {t('Meilleur', 'Best')}: {best.score}/{fields.length} — {formatTime(best.time)}
                      </div>
                    ) : (
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                        {t('Pas encore joue', 'Not played yet')}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {save.bestScore !== null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <Star size={16} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-secondary)' }}>
                  {t('Meilleur score', 'Best score')}: {save.bestScore} — {t('Meilleur temps', 'Best time')}: {save.bestTime !== null ? formatTime(save.bestTime) : '--'}
                </span>
              </div>
            )}

            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.97 }}
              onClick={startGame}
              style={{
                padding: '14px 32px',
                background: '#f59e0b',
                color: '#080b1a',
                fontSize: 15,
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {t('COMMENCER', 'START')}
            </motion.button>
          </motion.div>
        </div>
      </div>
    )
  }

  // Final results
  if (gameState === 'final') {
    const totalScore = roundResults.reduce((a, r) => a + r.score, 0)
    const maxTotal = roundResults.reduce((a, r) => a + r.maxScore, 0)
    const pct = totalScore / maxTotal
    let stars = 1
    if (pct >= 0.95) stars = 3
    else if (pct >= 0.7) stars = 2

    return (
      <div style={{ paddingTop: 56 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px' }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', maxWidth: 500, margin: '0 auto' }}>
            <Trophy size={48} style={{ color: '#f59e0b', marginBottom: 20 }} />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
              {t('Felicitations !', 'Congratulations!')}
            </h2>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>
              {t('Les 3 en-tetes sont reconstitues', 'All 3 headers are rebuilt')}
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
              {[1, 2, 3].map(s => (
                <motion.div
                  key={s}
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: s * 0.15, type: 'spring' }}
                >
                  <Star size={36} style={{ color: s <= stars ? '#f59e0b' : 'var(--border)', fill: s <= stars ? '#f59e0b' : 'none' }} />
                </motion.div>
              ))}
            </div>

            {/* Per-round results */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 24, textAlign: 'left' }}>
              {roundResults.map((r, i) => (
                <div key={r.category} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: ROUND_COLORS[r.category] }}>Round {i + 1}</div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 600 }}>{ROUND_LABELS[r.category]}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700 }}>{r.score}/{r.maxScore}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>{formatTime(r.time)}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 28 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{t('Score total', 'Total score')}</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 700 }}>{totalScore}/{maxTotal}</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{t('Temps total', 'Total time')}</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 700 }}>{formatTime(timer)}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={startGame}
                style={{ flex: 1, padding: '10px 16px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              >
                <RotateCcw size={14} /> {t('Rejouer', 'Replay')}
              </button>
              <Link to="/mini-jeux" style={{ flex: 1, textDecoration: 'none' }}>
                <button
                  style={{ width: '100%', padding: '10px 16px', background: '#f59e0b', border: 'none', color: '#080b1a', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                >
                  {t('Retour aux jeux', 'Back to games')}
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // Round complete interstitial
  if (gameState === 'round_complete') {
    const lastResult = roundResults[roundResults.length - 1]
    return (
      <div style={{ paddingTop: 56 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px' }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', maxWidth: 450, margin: '0 auto' }}>
            <CheckCircle size={40} style={{ color: ROUND_COLORS[lastResult.category], marginBottom: 16 }} />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
              {t(`Round ${roundIndex + 1} termine !`, `Round ${roundIndex + 1} complete!`)}
            </h2>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: 16, color: ROUND_COLORS[lastResult.category], marginBottom: 20 }}>
              {ROUND_LABELS[lastResult.category]}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 28 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Score</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700 }}>{lastResult.score}/{lastResult.maxScore}</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Temps</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700 }}>{formatTime(lastResult.time)}</div>
              </div>
            </div>
            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.97 }}
              onClick={nextRound}
              style={{
                padding: '12px 28px',
                background: ROUND_COLORS[ROUND_ORDER[roundIndex + 1]],
                color: '#080b1a',
                fontSize: 14,
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.5px',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              Round {roundIndex + 2} : {ROUND_LABELS[ROUND_ORDER[roundIndex + 1]]} <ChevronRight size={16} />
            </motion.button>
          </motion.div>
        </div>
      </div>
    )
  }

  // Playing state
  const color = ROUND_COLORS[currentCategory]

  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px' }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          {/* Top bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
            <button onClick={() => setGameState('intro')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <ArrowLeft size={14} /> {t('Quitter', 'Quit')}
            </button>
            <div style={{ flex: 1 }} />
            {/* Round indicators */}
            <div style={{ display: 'flex', gap: 4 }}>
              {ROUND_ORDER.map((cat, i) => (
                <div
                  key={cat}
                  style={{
                    padding: '4px 12px',
                    background: i === roundIndex ? ROUND_COLORS[cat] : i < roundIndex ? `${ROUND_COLORS[cat]}30` : 'var(--bg-secondary)',
                    color: i === roundIndex ? '#080b1a' : i < roundIndex ? ROUND_COLORS[cat] : 'var(--text-muted)',
                    fontSize: 11,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    border: `1px solid ${i <= roundIndex ? ROUND_COLORS[cat] : 'var(--border)'}`,
                  }}
                >
                  {i + 1}. {cat}
                </div>
              ))}
            </div>
          </div>

          {/* HUD */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 20, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 2 }}>Round {roundIndex + 1}/3</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, color }}>{ROUND_LABELS[currentCategory]}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle size={14} style={{ color }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14 }}>{correctSlots.size} / {categoryFields.length}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Timer size={14} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14 }}>{formatTime(timer)}</span>
            </div>
          </div>

          {/* Available fields (scrambled) */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10 }}>
              {t('Champs disponibles', 'Available fields')}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <AnimatePresence>
                {availableFields.map(field => (
                  <motion.div
                    key={field.name}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    draggable
                    onDragStart={() => handleDragStart(field)}
                    onClick={() => handleFieldClick(field)}
                    style={{
                      padding: '8px 14px',
                      background: selectedField?.name === field.name ? `${color}20` : 'var(--bg-secondary)',
                      border: `1px solid ${selectedField?.name === field.name ? color : 'var(--border)'}`,
                      boxShadow: selectedField?.name === field.name ? `0 0 10px ${color}30` : 'none',
                      cursor: 'grab',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      userSelect: 'none',
                      transition: 'border-color 0.15s, box-shadow 0.15s',
                    }}
                  >
                    <GripVertical size={12} style={{ color: 'var(--text-muted)' }} />
                    <div>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 13, fontWeight: 600 }}>{field.name}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>{field.size}</div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {availableFields.length === 0 && (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', padding: '8px 14px' }}>
                  {t('Tous les champs sont places !', 'All fields are placed!')}
                </div>
              )}
            </div>
          </div>

          {/* Slots (target) */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10 }}>
              {t('En-tete a construire', 'Header to build')}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {categoryFields.map((expectedField, idx) => {
                const placed = slots[idx]
                const isCorrect = correctSlots.has(idx)
                const isWrong = wrongSlot === idx
                return (
                  <motion.div
                    key={idx}
                    animate={isWrong ? { x: [0, -8, 8, -4, 4, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(idx)}
                    onClick={() => handleSlotClick(idx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 16px',
                      background: isCorrect ? `${color}10` : isWrong ? '#ef444415' : 'var(--bg-secondary)',
                      border: `1px solid ${isCorrect ? `${color}50` : isWrong ? '#ef4444' : selectedField ? `${color}30` : 'var(--border)'}`,
                      cursor: selectedField && !isCorrect ? 'pointer' : 'default',
                      transition: 'border-color 0.15s, background 0.15s',
                      minHeight: 48,
                    }}
                  >
                    <div style={{
                      width: 28, height: 28,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isCorrect ? color : 'var(--bg-tertiary)',
                      color: isCorrect ? '#080b1a' : 'var(--text-muted)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}>
                      {isCorrect ? <CheckCircle size={14} /> : idx + 1}
                    </div>

                    {placed ? (
                      <div style={{ flex: 1 }}>
                        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 600, color: isCorrect ? color : 'var(--text-primary)' }}>
                          {placed.name}
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>
                          {placed.size}
                        </span>
                        {isCorrect && (
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginLeft: 12 }}>
                            — {placed.description}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        {isWrong ? t('Mauvais champ !', 'Wrong field!') : t('Glisse ou clique un champ ici...', 'Drag or click a field here...')}
                      </div>
                    )}

                    {isWrong && <XCircle size={16} style={{ color: '#ef4444', flexShrink: 0 }} />}
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Hint */}
          <div style={{ textAlign: 'center', marginTop: 20, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
            {selectedField
              ? t(`"${selectedField.name}" selectionne — clique sur un emplacement pour le placer`, `"${selectedField.name}" selected — click a slot to place it`)
              : t('Clique sur un champ puis sur un emplacement, ou glisse-depose directement', 'Click a field then a slot, or drag and drop directly')}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
