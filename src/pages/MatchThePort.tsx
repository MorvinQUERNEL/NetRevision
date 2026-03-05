import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Network, Star, Timer, Footprints, RotateCcw, Trophy, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLangStore } from '../stores/langStore'
import { useMiniGamesData } from '../hooks/useTranslation'

type Difficulty = 'facile' | 'moyen' | 'difficile'

interface Card {
  id: string
  pairId: number
  display: string
  type: 'service' | 'port'
  revealed: boolean
  matched: boolean
}

interface SaveData {
  bestScores: Record<Difficulty, { moves: number; time: number; stars: number } | null>
  bestStars: number
}

function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem('nr_minigame_match')
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return { bestScores: { facile: null, moyen: null, difficile: null }, bestStars: 0 }
}

function writeSave(data: SaveData) {
  localStorage.setItem('nr_minigame_match', JSON.stringify(data))
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const DIFFICULTY_CONFIG: Record<Difficulty, { pairs: number; cols: number; rows: number; label_fr: string; label_en: string }> = {
  facile: { pairs: 6, cols: 4, rows: 3, label_fr: 'Facile', label_en: 'Easy' },
  moyen: { pairs: 8, cols: 4, rows: 4, label_fr: 'Moyen', label_en: 'Medium' },
  difficile: { pairs: 12, cols: 6, rows: 4, label_fr: 'Difficile', label_en: 'Hard' },
}

export default function MatchThePort() {
  const lang = useLangStore((s) => s.lang)
  const t = (fr: string, en: string) => lang === 'en' ? en : fr
  const { portMatches } = useMiniGamesData()
  const dl = (d: Difficulty) => lang === 'en' ? DIFFICULTY_CONFIG[d].label_en : DIFFICULTY_CONFIG[d].label_fr
  const [save, setSave] = useState<SaveData>(loadSave)
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null)
  const [cards, setCards] = useState<Card[]>([])
  const [flippedIds, setFlippedIds] = useState<string[]>([])
  const [moves, setMoves] = useState(0)
  const [pairsFound, setPairsFound] = useState(0)
  const [timer, setTimer] = useState(0)
  const [gameState, setGameState] = useState<'select' | 'playing' | 'complete'>('select')
  const [earnedStars, setEarnedStars] = useState(0)
  const [lockBoard, setLockBoard] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startGame = useCallback((diff: Difficulty) => {
    const config = DIFFICULTY_CONFIG[diff]
    const selectedPairs = shuffleArray(portMatches).slice(0, config.pairs)

    const newCards: Card[] = []
    selectedPairs.forEach((pm, idx) => {
      newCards.push({ id: `s-${idx}`, pairId: idx, display: pm.service, type: 'service', revealed: false, matched: false })
      newCards.push({ id: `p-${idx}`, pairId: idx, display: String(pm.port), type: 'port', revealed: false, matched: false })
    })

    setCards(shuffleArray(newCards))
    setFlippedIds([])
    setMoves(0)
    setPairsFound(0)
    setTimer(0)
    setDifficulty(diff)
    setGameState('playing')
    setEarnedStars(0)
    setLockBoard(false)
  }, [])

  const handleCardClick = useCallback((cardId: string) => {
    if (lockBoard || gameState !== 'playing') return

    const card = cards.find(c => c.id === cardId)
    if (!card || card.revealed || card.matched) return
    if (flippedIds.includes(cardId)) return

    const newFlipped = [...flippedIds, cardId]
    setFlippedIds(newFlipped)

    // Reveal the card
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, revealed: true } : c))

    if (newFlipped.length === 2) {
      setMoves(m => m + 1)
      setLockBoard(true)

      const first = cards.find(c => c.id === newFlipped[0])!
      const second = cards.find(c => c.id === newFlipped[1])!

      if (first.pairId === second.pairId && first.type !== second.type) {
        // Match!
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.pairId === first.pairId ? { ...c, matched: true, revealed: true } : c
          ))
          const newPairs = pairsFound + 1
          setPairsFound(newPairs)
          setFlippedIds([])
          setLockBoard(false)

          // Check win
          const config = DIFFICULTY_CONFIG[difficulty!]
          if (newPairs === config.pairs) {
            const totalMoves = moves + 1
            const threshold = config.pairs * 2.5
            let stars = 1
            if (totalMoves <= threshold * 0.7) stars = 3
            else if (totalMoves <= threshold) stars = 2
            setEarnedStars(stars)
            setGameState('complete')

            const newSave = { ...save }
            const prev = newSave.bestScores[difficulty!]
            if (!prev || stars > prev.stars || (stars === prev.stars && totalMoves < prev.moves)) {
              newSave.bestScores[difficulty!] = { moves: totalMoves, time: timer, stars }
              newSave.bestStars = Object.values(newSave.bestScores).reduce((a, b) => a + (b?.stars || 0), 0)
              setSave(newSave)
              writeSave(newSave)
            }
          }
        }, 300)
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            newFlipped.includes(c.id) && !c.matched ? { ...c, revealed: false } : c
          ))
          setFlippedIds([])
          setLockBoard(false)
        }, 1000)
      }
    }
  }, [lockBoard, gameState, cards, flippedIds, pairsFound, moves, timer, difficulty, save])

  // Timer
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [gameState])

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  // Difficulty selection
  if (gameState === 'select' || !difficulty) {
    return (
      <div style={{ paddingTop: 56 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px' }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/mini-jeux" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 13, textDecoration: 'none', marginBottom: 24 }}>
              <ArrowLeft size={14} /> {t('Mini-Jeux', 'Mini-Games')}
            </Link>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12 }}>
              // MATCH THE PORT
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 32, fontWeight: 700, marginBottom: 8, letterSpacing: '-1px' }}>
              Match the Port
            </h1>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 40, fontWeight: 300 }}>
              {t('Retrouve les paires service / port dans ce jeu de memoire. Retourne deux cartes et associe chaque service a son numero de port.', 'Find the service/port pairs in this memory game. Flip two cards and match each service to its port number.')}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 2 }}>
              {(['facile', 'moyen', 'difficile'] as Difficulty[]).map(diff => {
                const config = DIFFICULTY_CONFIG[diff]
                const best = save.bestScores[diff]
                const colors: Record<Difficulty, string> = { facile: '#00e5a0', moyen: '#6366f1', difficile: '#ef4444' }
                return (
                  <motion.button
                    key={diff}
                    whileHover={{ y: -2 }}
                    onClick={() => startGame(diff)}
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      padding: 28,
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = colors[diff])}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                  >
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, marginBottom: 8, color: colors[diff] }}>
                      {dl(diff)}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
                      {config.cols}x{config.rows} — {config.pairs} {t('paires', 'pairs')}
                    </div>
                    {best ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ display: 'flex', gap: 2 }}>
                          {[1, 2, 3].map(s => (
                            <Star key={s} size={13} style={{ color: s <= best.stars ? '#f59e0b' : 'var(--border)', fill: s <= best.stars ? '#f59e0b' : 'none' }} />
                          ))}
                        </div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                          {best.moves} {t('coups', 'moves')} — {formatTime(best.time)}
                        </span>
                      </div>
                    ) : (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                        {t('Pas encore joue', 'Not played yet')}
                      </span>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  const config = DIFFICULTY_CONFIG[difficulty]
  const cardWidth = Math.min(120, Math.floor((Math.min(window.innerWidth - 48, 720)) / config.cols) - 8)

  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px' }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          {/* Top bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
            <button onClick={() => { setGameState('select'); setDifficulty(null) }} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <ArrowLeft size={14} /> {t('Difficulte', 'Difficulty')}
            </button>
            <div style={{ flex: 1 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              {(['facile', 'moyen', 'difficile'] as Difficulty[]).map(d => (
                <button
                  key={d}
                  onClick={() => startGame(d)}
                  style={{
                    padding: '5px 12px',
                    background: d === difficulty ? '#6366f1' : 'var(--bg-secondary)',
                    color: d === difficulty ? '#fff' : 'var(--text-secondary)',
                    border: `1px solid ${d === difficulty ? '#6366f1' : 'var(--border)'}`,
                    fontSize: 12, fontFamily: 'var(--font-mono)', cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {dl(d)}
                </button>
              ))}
            </div>
          </div>

          {/* HUD */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 28, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Footprints size={14} style={{ color: '#6366f1' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14 }}>{moves} {t('coups', 'moves')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle size={14} style={{ color: 'var(--accent)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14 }}>{pairsFound} / {config.pairs} {t('paires', 'pairs')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Timer size={14} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14 }}>{formatTime(timer)}</span>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => startGame(difficulty)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: 12, fontFamily: 'var(--font-mono)', cursor: 'pointer' }}
              >
                <RotateCcw size={12} /> {t('Recommencer', 'Restart')}
              </motion.button>
            </div>
          </div>

          {/* Card Grid */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${config.cols}, ${cardWidth}px)`,
                gap: 8,
              }}
            >
              {cards.map(card => {
                const isFlipped = card.revealed || card.matched
                return (
                  <motion.div
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    style={{
                      width: cardWidth,
                      height: cardWidth * 1.2,
                      perspective: 600,
                      cursor: isFlipped ? 'default' : 'pointer',
                    }}
                  >
                    <motion.div
                      animate={{ rotateY: isFlipped ? 0 : 180 }}
                      transition={{ duration: 0.4 }}
                      style={{
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      {/* Front (content) */}
                      <div style={{
                        position: 'absolute', inset: 0,
                        backfaceVisibility: 'hidden',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        background: card.matched ? '#00e5a015' : 'var(--bg-secondary)',
                        border: `1px solid ${card.matched ? '#00e5a040' : 'var(--border)'}`,
                        boxShadow: card.matched ? '0 0 12px #00e5a020' : 'none',
                        padding: 8,
                      }}>
                        <div style={{
                          fontFamily: card.type === 'port' ? 'var(--font-mono)' : 'var(--font-heading)',
                          fontSize: card.type === 'port' ? 20 : Math.min(14, cardWidth * 0.14),
                          fontWeight: 700,
                          color: card.matched ? 'var(--accent)' : 'var(--text-primary)',
                          textAlign: 'center',
                          lineHeight: 1.2,
                        }}>
                          {card.display}
                        </div>
                        <div style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 9,
                          color: 'var(--text-muted)',
                          marginTop: 6,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}>
                          {card.type === 'service' ? 'service' : 'port'}
                        </div>
                      </div>

                      {/* Back (hidden) */}
                      <div style={{
                        position: 'absolute', inset: 0,
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border)',
                      }}>
                        <Network size={cardWidth * 0.3} style={{ color: '#6366f140' }} />
                      </div>
                    </motion.div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Complete Modal */}
        <AnimatePresence>
          {gameState === 'complete' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 100,
              }}
              onClick={() => { setGameState('select'); setDifficulty(null) }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  padding: 40,
                  maxWidth: 400,
                  width: '90%',
                  textAlign: 'center',
                }}
              >
                <Trophy size={40} style={{ color: '#6366f1', marginBottom: 16 }} />
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
                  {t('Bravo !', 'Well done!')}
                </h2>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20, textTransform: 'capitalize' }}>
                  {dl(difficulty)} — {config.pairs} {t('paires', 'pairs')}
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
                  {[1, 2, 3].map(s => (
                    <motion.div
                      key={s}
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: s * 0.15, type: 'spring' }}
                    >
                      <Star size={32} style={{ color: s <= earnedStars ? '#f59e0b' : 'var(--border)', fill: s <= earnedStars ? '#f59e0b' : 'none' }} />
                    </motion.div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 28 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{t('Coups', 'Moves')}</div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700 }}>{moves}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{t('Temps', 'Time')}</div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700 }}>{formatTime(timer)}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => startGame(difficulty)}
                    style={{ flex: 1, padding: '10px 16px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                  >
                    <RotateCcw size={14} /> {t('Rejouer', 'Replay')}
                  </button>
                  <button
                    onClick={() => { setGameState('select'); setDifficulty(null) }}
                    style={{ flex: 1, padding: '10px 16px', background: '#6366f1', border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                  >
                    {t('Changer difficulte', 'Change difficulty')}
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
