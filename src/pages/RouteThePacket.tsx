import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Shield, Unlink, RefreshCw, Monitor, Server, PackageOpen, Star, Timer, RotateCcw, Lock, ChevronRight, Trophy, Footprints } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLangStore } from '../stores/langStore'
import { useMiniGamesData } from '../hooks/useTranslation'

interface SaveData {
  completed: Record<number, number> // levelId -> stars
  bestStars: number
}

function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem('nr_minigame_route')
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return { completed: {}, bestStars: 0 }
}

function writeSave(data: SaveData) {
  localStorage.setItem('nr_minigame_route', JSON.stringify(data))
}

function isAdjacent(a: { x: number; y: number }, b: { x: number; y: number }): boolean {
  const dx = Math.abs(a.x - b.x)
  const dy = Math.abs(a.y - b.y)
  return (dx + dy) === 1
}

export default function RouteThePacket() {
  const lang = useLangStore((s) => s.lang)
  const t = (fr: string, en: string) => lang === 'en' ? en : fr
  const { gridLevels } = useMiniGamesData()
  const [save, setSave] = useState<SaveData>(loadSave)
  const [currentLevelId, setCurrentLevelId] = useState<number | null>(null)
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 })
  const [moves, setMoves] = useState(0)
  const [collectedRouters, setCollectedRouters] = useState<Set<string>>(new Set())
  const [timer, setTimer] = useState(0)
  const [gameState, setGameState] = useState<'select' | 'playing' | 'complete'>('select')
  const [earnedStars, setEarnedStars] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const level = currentLevelId !== null ? gridLevels.find(l => l.id === currentLevelId) : null

  const isLevelUnlocked = (id: number): boolean => {
    if (id === 1) return true
    return !!(save.completed[id - 1])
  }

  const startLevel = (id: number) => {
    const lvl = gridLevels.find(l => l.id === id)
    if (!lvl) return
    setCurrentLevelId(id)
    setPlayerPos({ ...lvl.start })
    setMoves(0)
    setCollectedRouters(new Set())
    setTimer(0)
    setGameState('playing')
    setEarnedStars(0)
  }

  const isObstacle = useCallback((x: number, y: number): boolean => {
    if (!level) return false
    return level.obstacles.some(o => o.x === x && o.y === y)
  }, [level])

  const movePlayer = useCallback((dx: number, dy: number) => {
    if (gameState !== 'playing' || !level) return
    const nx = playerPos.x + dx
    const ny = playerPos.y + dy
    if (nx < 0 || nx >= level.width || ny < 0 || ny >= level.height) return
    if (isObstacle(nx, ny)) return

    const newPos = { x: nx, y: ny }
    setPlayerPos(newPos)
    setMoves(m => m + 1)

    // Collect router
    const key = `${nx},${ny}`
    if (level.routers.some(r => r.x === nx && r.y === ny)) {
      setCollectedRouters(prev => {
        const next = new Set(prev)
        next.add(key)
        return next
      })
    }

    // Check win
    if (nx === level.end.x && ny === level.end.y) {
      const totalMoves = moves + 1
      let stars = 1
      if (totalMoves <= level.optimalMoves) stars = 3
      else if (totalMoves <= Math.floor(level.optimalMoves * 1.5)) stars = 2
      setEarnedStars(stars)
      setGameState('complete')

      const newSave = { ...save }
      const prev = newSave.completed[level.id] || 0
      if (stars > prev) {
        newSave.completed[level.id] = stars
        const total = Object.values(newSave.completed).reduce((a, b) => a + b, 0)
        newSave.bestStars = total
        setSave(newSave)
        writeSave(newSave)
      }
    }
  }, [gameState, level, playerPos, moves, isObstacle, save])

  const handleCellClick = useCallback((x: number, y: number) => {
    if (gameState !== 'playing' || !level) return
    if (isAdjacent(playerPos, { x, y })) {
      movePlayer(x - playerPos.x, y - playerPos.y)
    }
  }, [gameState, level, playerPos, movePlayer])

  // Keyboard controls
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return
      switch (e.key) {
        case 'ArrowUp': case 'w': case 'z': e.preventDefault(); movePlayer(0, -1); break
        case 'ArrowDown': case 's': e.preventDefault(); movePlayer(0, 1); break
        case 'ArrowLeft': case 'q': case 'a': e.preventDefault(); movePlayer(-1, 0); break
        case 'ArrowRight': case 'd': e.preventDefault(); movePlayer(1, 0); break
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [gameState, movePlayer])

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

  // Level selection
  if (gameState === 'select' || !level) {
    const totalStars = Object.values(save.completed).reduce((a, b) => a + b, 0)
    return (
      <div style={{ paddingTop: 56 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px' }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/mini-jeux" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 13, textDecoration: 'none', marginBottom: 24 }}>
              <ArrowLeft size={14} /> {t('Mini-Jeux', 'Mini-Games')}
            </Link>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12 }}>
              // ROUTE THE PACKET
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 32, fontWeight: 700, marginBottom: 8, letterSpacing: '-1px' }}>
              Route the Packet
            </h1>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 12, fontWeight: 300 }}>
              {t('Guide le paquet de la source a la destination en evitant les obstacles.', 'Guide the packet from source to destination while avoiding obstacles.')}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
              <Star size={16} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--text-secondary)' }}>
                {totalStars} / {gridLevels.length * 3} {t('etoiles', 'stars')}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 2 }}>
              {gridLevels.map(lvl => {
                const unlocked = isLevelUnlocked(lvl.id)
                const stars = save.completed[lvl.id] || 0
                return (
                  <motion.button
                    key={lvl.id}
                    whileHover={unlocked ? { y: -2 } : {}}
                    onClick={() => unlocked && startLevel(lvl.id)}
                    style={{
                      background: 'var(--bg-secondary)',
                      border: `1px solid ${stars > 0 ? '#00e5a030' : 'var(--border)'}`,
                      padding: 20,
                      textAlign: 'left',
                      cursor: unlocked ? 'pointer' : 'not-allowed',
                      opacity: unlocked ? 1 : 0.4,
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)' }}>
                        {t('Niveau', 'Level')} {lvl.id}
                      </span>
                      {!unlocked && <Lock size={14} style={{ color: 'var(--text-muted)' }} />}
                    </div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 600, marginBottom: 6 }}>
                      {lvl.name}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>
                      {lvl.width}x{lvl.height} — {lvl.obstacles.length} obstacles — {lvl.routers.length} {t('routeurs', 'routers')}
                    </div>
                    <div style={{ display: 'flex', gap: 3 }}>
                      {[1, 2, 3].map(s => (
                        <Star key={s} size={14} style={{ color: s <= stars ? '#f59e0b' : 'var(--border)', fill: s <= stars ? '#f59e0b' : 'none' }} />
                      ))}
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Legend */}
            <div style={{ marginTop: 32, padding: 20, background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>{t('Legende', 'Legend')}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
                {[
                  { icon: <Shield size={14} />, color: '#ef4444', label: t('Pare-feu', 'Firewall') },
                  { icon: <Unlink size={14} />, color: '#f97316', label: t('Lien casse', 'Broken link') },
                  { icon: <RefreshCw size={14} />, color: '#eab308', label: t('Boucle', 'Loop') },
                  { icon: <Monitor size={14} />, color: '#06b6d4', label: 'Source' },
                  { icon: <Server size={14} />, color: 'var(--accent)', label: 'Destination' },
                  { icon: <PackageOpen size={14} />, color: 'var(--accent)', label: t('Paquet (vous)', 'Packet (you)') },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                    <span style={{ color: item.color }}>{item.icon}</span> {item.label}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  const cellSize = Math.min(Math.floor(600 / level.width), Math.floor(600 / level.height))

  const getCellContent = (x: number, y: number) => {
    // Player
    if (playerPos.x === x && playerPos.y === y) {
      return { icon: <PackageOpen size={cellSize * 0.45} />, bg: 'var(--accent)', color: '#080b1a', glow: '0 0 12px var(--accent)' }
    }
    // Start
    if (level.start.x === x && level.start.y === y) {
      return { icon: <Monitor size={cellSize * 0.4} />, bg: '#06b6d420', color: '#06b6d4', glow: '0 0 8px #06b6d440' }
    }
    // End
    if (level.end.x === x && level.end.y === y) {
      return { icon: <Server size={cellSize * 0.4} />, bg: 'var(--accent)20', color: 'var(--accent)', glow: '0 0 8px var(--accent-glow)' }
    }
    // Obstacles
    const obstacle = level.obstacles.find(o => o.x === x && o.y === y)
    if (obstacle) {
      if (obstacle.type === 'firewall') return { icon: <Shield size={cellSize * 0.35} />, bg: '#ef444425', color: '#ef4444', glow: 'none' }
      if (obstacle.type === 'broken_link') return { icon: <Unlink size={cellSize * 0.35} />, bg: '#f9731625', color: '#f97316', glow: 'none' }
      if (obstacle.type === 'loop') return { icon: <RefreshCw size={cellSize * 0.35} />, bg: '#eab30825', color: '#eab308', glow: 'none' }
    }
    // Router (bonus waypoint)
    const isRouter = level.routers.some(r => r.x === x && r.y === y)
    if (isRouter) {
      const collected = collectedRouters.has(`${x},${y}`)
      if (collected) {
        return { icon: null, bg: '#00e5a010', color: '', glow: 'none' }
      }
      return { icon: <div style={{ width: cellSize * 0.25, height: cellSize * 0.25, background: '#00e5a0', boxShadow: '0 0 6px #00e5a060' }} />, bg: '#00e5a010', color: '#00e5a0', glow: 'none' }
    }
    return null
  }

  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px' }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          {/* Top bar: back + level selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
            <button onClick={() => { setGameState('select'); setCurrentLevelId(null) }} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <ArrowLeft size={14} /> {t('Niveaux', 'Levels')}
            </button>
            <div style={{ flex: 1 }} />
            <div style={{ display: 'flex', gap: 2 }}>
              {gridLevels.map(lvl => {
                const unlocked = isLevelUnlocked(lvl.id)
                const active = lvl.id === currentLevelId
                const stars = save.completed[lvl.id] || 0
                return (
                  <button
                    key={lvl.id}
                    onClick={() => unlocked && startLevel(lvl.id)}
                    style={{
                      width: 32, height: 32,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: active ? 'var(--accent)' : 'var(--bg-secondary)',
                      color: active ? '#080b1a' : stars > 0 ? 'var(--accent)' : unlocked ? 'var(--text-secondary)' : 'var(--text-muted)',
                      border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                      fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)',
                      cursor: unlocked ? 'pointer' : 'not-allowed',
                      opacity: unlocked ? 1 : 0.35,
                    }}
                  >
                    {unlocked ? lvl.id : <Lock size={10} />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* HUD */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 20, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 2 }}>{t('Niveau', 'Level')}</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700 }}>{level.name}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Footprints size={14} style={{ color: 'var(--accent)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14 }}>{moves}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>/ {level.optimalMoves} optimal</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <PackageOpen size={14} style={{ color: '#00e5a0' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14 }}>
                {collectedRouters.size} / {level.routers.length}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>{t('routeurs', 'routers')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Timer size={14} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14 }}>{formatTime(timer)}</span>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => startLevel(level.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: 12, fontFamily: 'var(--font-mono)', cursor: 'pointer' }}
              >
                <RotateCcw size={12} /> {t('Recommencer', 'Restart')}
              </motion.button>
            </div>
          </div>

          {/* Game Board */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${level.width}, ${cellSize}px)`,
                gridTemplateRows: `repeat(${level.height}, ${cellSize}px)`,
                gap: 1,
                background: 'var(--border)',
                border: '1px solid var(--border)',
                padding: 1,
              }}
            >
              {Array.from({ length: level.height }, (_, y) =>
                Array.from({ length: level.width }, (_, x) => {
                  const content = getCellContent(x, y)
                  const isClickable = gameState === 'playing' && isAdjacent(playerPos, { x, y }) && !isObstacle(x, y)
                  return (
                    <div
                      key={`${x}-${y}`}
                      onClick={() => handleCellClick(x, y)}
                      style={{
                        width: cellSize,
                        height: cellSize,
                        background: content?.bg || 'var(--bg-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: isClickable ? 'pointer' : 'default',
                        color: content?.color || 'transparent',
                        boxShadow: content?.glow || 'none',
                        transition: 'background 0.15s',
                        outline: isClickable ? '1px solid var(--accent)30' : 'none',
                      }}
                    >
                      {content?.icon}
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Controls hint */}
          <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
            {t('Utilise les fleches du clavier ou clique sur une case adjacente pour deplacer le paquet', 'Use arrow keys or click on an adjacent cell to move the packet')}
          </div>
        </motion.div>

        {/* Level Complete Modal */}
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
              onClick={() => setGameState('select')}
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
                <Trophy size={40} style={{ color: 'var(--accent)', marginBottom: 16 }} />
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
                  {t('Niveau termine !', 'Level complete!')}
                </h2>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
                  {level.name}
                </p>

                {/* Stars */}
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
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{t('Mouvements', 'Moves')}</div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700 }}>{moves}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>{t('optimal', 'optimal')}: {level.optimalMoves}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{t('Temps', 'Time')}</div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700 }}>{formatTime(timer)}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{t('Routeurs', 'Routers')}</div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700 }}>{collectedRouters.size}/{level.routers.length}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => startLevel(level.id)}
                    style={{ flex: 1, padding: '10px 16px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                  >
                    <RotateCcw size={14} /> {t('Rejouer', 'Replay')}
                  </button>
                  {currentLevelId !== null && currentLevelId < 10 && (
                    <button
                      onClick={() => currentLevelId !== null && startLevel(currentLevelId + 1)}
                      style={{ flex: 1, padding: '10px 16px', background: 'var(--accent)', border: 'none', color: '#080b1a', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                    >
                      {t('Niveau suivant', 'Next level')} <ChevronRight size={14} />
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
