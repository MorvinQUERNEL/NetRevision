import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Flag, Shield, Search, Terminal, Network,
  CheckCircle, Eye, EyeOff, AlertTriangle, Clock,
  ChevronRight, Star, Lightbulb, Send, XCircle,
  FileText, Copy, Check, Trophy,
} from 'lucide-react'
import { type CTFChallenge, type CTFArtifact } from '../data/ctfChallenges'
import { useCtfChallenges, useTranslation } from '../hooks/useTranslation'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ChallengeProgress {
  solved: boolean
  solvedAt: string | null
  score: number
  hintsUsed: number[]
  attempts: number
}

type CTFProgress = Record<string, ChallengeProgress>

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = 'nr_ctf_progress'

/* categoryMeta and difficultyMeta are defined inside the component for i18n */

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function loadProgress(): CTFProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

function saveProgress(p: CTFProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p))
}

function getNextChallengeId(currentId: string, challenges: CTFChallenge[]): string | null {
  const idx = challenges.findIndex(c => c.id === currentId)
  if (idx < 0 || idx >= challenges.length - 1) return null
  return challenges[idx + 1].id
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function ArtifactViewer({ artifact, index }: { artifact: CTFArtifact; index: number }) {
  const [copied, setCopied] = useState(false)
  const lines = artifact.content.split('\n')

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(artifact.content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [artifact.content])

  const typeIcons: Record<CTFArtifact['type'], React.ReactNode> = {
    config:  <FileText size={14} />,
    log:     <Terminal size={14} />,
    capture: <Network size={14} />,
    diagram: <Search size={14} />,
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      style={{ marginBottom: 16 }}
    >
      {/* Artifact header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '8px 12px', background: '#0a0f1e', borderBottom: '1px solid #1a2040',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#00e5a0' }}>
          {typeIcons[artifact.type]}
          <span style={{ fontFamily: 'var(--font-mono)' }}>{artifact.name}</span>
          <span style={{
            fontSize: 10, textTransform: 'uppercase', letterSpacing: '1px',
            padding: '2px 6px', background: 'rgba(0,229,160,0.1)', color: '#00e5a0',
          }}>{artifact.type}</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          style={{
            background: 'none', border: '1px solid #1a2040', padding: '4px 10px',
            fontSize: 11, color: '#94a3b8', cursor: 'pointer', display: 'flex',
            alignItems: 'center', gap: 4,
          }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'OK' : 'Copy'}
        </motion.button>
      </div>

      {/* Artifact content */}
      <div style={{
        background: '#060a16', padding: '12px 0', overflowX: 'auto',
        maxHeight: 400, overflowY: 'auto', border: '1px solid #1a2040', borderTop: 'none',
      }}>
        {lines.map((line, i) => (
          <div key={i} style={{
            display: 'flex', fontFamily: 'var(--font-mono)', fontSize: 12,
            lineHeight: '20px', minHeight: 20,
          }}>
            <span style={{
              width: 44, minWidth: 44, textAlign: 'right', paddingRight: 12,
              color: '#334155', userSelect: 'none', borderRight: '1px solid #1a2040',
            }}>
              {i + 1}
            </span>
            <span style={{
              paddingLeft: 12, color: '#94e8b0', whiteSpace: 'pre',
            }}>
              {line}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function CTFPlay() {
  const { t } = useTranslation()
  const ctfChallenges = useCtfChallenges()
  const { challengeId } = useParams<{ challengeId: string }>()
  const navigate = useNavigate()

  const categoryMeta: Record<CTFChallenge['category'], { label: string; icon: React.ReactNode; color: string }> = {
    'network-config':    { label: 'Configuration', icon: <Network size={16} />,  color: 'var(--accent)' },
    'security':          { label: t('Securite', 'Security'),      icon: <Shield size={16} />,   color: '#ef4444' },
    'forensics':         { label: 'Forensics',     icon: <Search size={16} />,   color: '#f59e0b' },
    'protocol-analysis': { label: t('Protocoles', 'Protocols'),    icon: <Terminal size={16} />, color: '#6366f1' },
  }

  const difficultyMeta: Record<number, { label: string; color: string; bg: string }> = {
    1: { label: t('Facile', 'Easy'),        color: '#00e5a0', bg: 'rgba(0,229,160,0.12)' },
    2: { label: t('Intermediaire', 'Intermediate'), color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    3: { label: t('Difficile', 'Hard'),     color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
    4: { label: t('Expert', 'Expert'),        color: '#e11d48', bg: 'rgba(225,29,72,0.12)' },
  }

  const challenge = useMemo(
    () => ctfChallenges.find(c => c.id === challengeId) ?? null,
    [challengeId, ctfChallenges],
  )

  const [progress, setProgress] = useState<CTFProgress>(loadProgress)
  const [flagInput, setFlagInput] = useState('')
  const [activeArtifact, setActiveArtifact] = useState(0)
  const [revealedHints, setRevealedHints] = useState<number[]>([])
  const [showConfirmHint, setShowConfirmHint] = useState<number | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [shakeInput, setShakeInput] = useState(false)
  const [wrongMsg, setWrongMsg] = useState(false)
  const [justSolved, setJustSolved] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const isSolved = challenge ? (progress[challenge.id]?.solved ?? false) : false

  /* ---- Load existing state for this challenge ---- */
  useEffect(() => {
    if (!challenge) return
    const cp = progress[challenge.id]
    if (cp) {
      setRevealedHints(cp.hintsUsed)
      setAttempts(cp.attempts)
    }
  }, [challenge, progress])

  /* ---- Timer ---- */
  useEffect(() => {
    if (isSolved || justSolved) return
    timerRef.current = setInterval(() => setElapsedSeconds(s => s + 1), 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isSolved, justSolved])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  /* ---- Hint cost ---- */
  const totalHintCost = useMemo(() => {
    if (!challenge) return 0
    return challenge.hints.filter(h => revealedHints.includes(h.id)).reduce((s, h) => s + h.cost, 0)
  }, [challenge, revealedHints])

  const currentPoints = challenge ? Math.max(0, challenge.points - totalHintCost) : 0

  /* ---- Reveal hint ---- */
  const confirmRevealHint = useCallback((hintId: number) => {
    if (!challenge || isSolved) return
    setShowConfirmHint(null)
    setRevealedHints(prev => {
      const next = [...prev, hintId]
      // Save partial progress
      const p = loadProgress()
      p[challenge.id] = {
        solved: false,
        solvedAt: null,
        score: 0,
        hintsUsed: next,
        attempts,
      }
      saveProgress(p)
      setProgress({ ...p })
      return next
    })
  }, [challenge, isSolved, attempts])

  /* ---- Submit flag ---- */
  const handleSubmit = useCallback(() => {
    if (!challenge || isSolved || !flagInput.trim()) return

    const newAttempts = attempts + 1
    setAttempts(newAttempts)

    if (flagInput.trim() === challenge.flag) {
      // Correct!
      const finalScore = currentPoints
      const p = loadProgress()
      p[challenge.id] = {
        solved: true,
        solvedAt: new Date().toISOString(),
        score: finalScore,
        hintsUsed: revealedHints,
        attempts: newAttempts,
      }
      saveProgress(p)
      setProgress({ ...p })
      setJustSolved(true)
      if (timerRef.current) clearInterval(timerRef.current)
    } else {
      // Wrong
      setShakeInput(true)
      setWrongMsg(true)
      setTimeout(() => setShakeInput(false), 500)
      setTimeout(() => setWrongMsg(false), 3000)
      // Save attempts
      const p = loadProgress()
      p[challenge.id] = {
        solved: false,
        solvedAt: null,
        score: 0,
        hintsUsed: revealedHints,
        attempts: newAttempts,
      }
      saveProgress(p)
      setProgress({ ...p })
    }
  }, [challenge, isSolved, flagInput, attempts, currentPoints, revealedHints])

  /* ---- 404 ---- */
  if (!challenge) {
    return (
      <div style={{ paddingTop: 56 }}>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
          <AlertTriangle size={48} style={{ color: 'var(--error)', marginBottom: 16 }} />
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, marginBottom: 8 }}>{t('Challenge introuvable', 'Challenge not found')}</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>{t("Ce challenge n'existe pas ou a ete supprime.", 'This challenge does not exist or has been removed.')}</p>
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/ctf')}
            style={{
              padding: '12px 24px', background: 'var(--accent)', color: 'var(--bg-primary)',
              border: 'none', fontWeight: 600, cursor: 'pointer',
            }}
          >
            {t('Retour aux challenges', 'Back to challenges')}
          </motion.button>
        </div>
      </div>
    )
  }

  const catMeta = categoryMeta[challenge.category]
  const diffMeta = difficultyMeta[challenge.difficulty]
  const nextId = getNextChallengeId(challenge.id, ctfChallenges)

  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* ── Header ────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          {/* Back link */}
          <motion.button
            whileHover={{ x: -3 }}
            onClick={() => navigate('/ctf')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, background: 'none',
              border: 'none', color: 'var(--text-secondary)', fontSize: 13,
              cursor: 'pointer', marginBottom: 20, padding: 0,
            }}
          >
            <ArrowLeft size={16} /> {t('Retour aux challenges', 'Back to challenges')}
          </motion.button>

          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px',
              padding: '3px 8px', background: diffMeta.bg, color: diffMeta.color,
            }}>
              {'★'.repeat(challenge.difficulty)} {diffMeta.label}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: catMeta.color }}>
              {catMeta.icon} {catMeta.label}
            </span>
            {(isSolved || justSolved) && (
              <span style={{
                display: 'flex', alignItems: 'center', gap: 4, fontSize: 12,
                color: 'var(--success)', fontWeight: 600,
              }}>
                <CheckCircle size={14} /> {t('Resolu', 'Solved')}
              </span>
            )}
          </div>

          <h1 style={{
            fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700,
            letterSpacing: '-1px', marginBottom: 4,
          }}>
            <Flag size={22} style={{ marginRight: 8, color: 'var(--accent)' }} />
            {challenge.title}
          </h1>

          {/* Points + timer strip */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32,
            fontSize: 13, color: 'var(--text-muted)',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Star size={14} style={{ color: 'var(--accent)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent)' }}>{currentPoints}</span> pts
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={14} />
              {formatTime(elapsedSeconds)}
            </span>
            {attempts > 0 && (
              <span>{attempts} {t('tentative', 'attempt')}{attempts > 1 ? 's' : ''}</span>
            )}
          </div>
        </motion.div>

        {/* ── Two-column layout ─────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }} className="ctf-play-layout">

          {/* ── LEFT: Scenario + Artifacts (60%) ─────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            style={{ flex: '0 0 60%', minWidth: 0 }}
            className="ctf-play-left"
          >
            {/* Scenario */}
            <div style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              padding: '20px', marginBottom: 16,
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)',
                textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12,
              }}>{'// scenario'}</div>
              {challenge.scenario.split('\n').map((para, i) => (
                <p key={i} style={{
                  fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7,
                  margin: para.trim() ? '0 0 12px' : '0 0 4px',
                }}>
                  {para}
                </p>
              ))}
            </div>

            {/* Artifact tabs */}
            {challenge.artifacts.length > 1 && (
              <div style={{ display: 'flex', gap: 2, marginBottom: 2 }}>
                {challenge.artifacts.map((a, i) => (
                  <motion.button
                    key={i}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveArtifact(i)}
                    style={{
                      padding: '8px 14px', fontSize: 12,
                      fontFamily: 'var(--font-mono)',
                      background: activeArtifact === i ? '#0a0f1e' : 'var(--bg-secondary)',
                      color: activeArtifact === i ? '#00e5a0' : 'var(--text-muted)',
                      border: `1px solid ${activeArtifact === i ? '#1a2040' : 'var(--border)'}`,
                      borderBottom: activeArtifact === i ? '1px solid #0a0f1e' : '1px solid var(--border)',
                      cursor: 'pointer',
                    }}
                  >
                    {a.name}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Active artifact viewer */}
            <AnimatePresence mode="wait">
              <ArtifactViewer
                key={activeArtifact}
                artifact={challenge.artifacts[activeArtifact]}
                index={0}
              />
            </AnimatePresence>
          </motion.div>

          {/* ── RIGHT: Action panel (40%) ────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            style={{ flex: '0 0 calc(40% - 24px)', minWidth: 0 }}
            className="ctf-play-right"
          >
            {/* ── Success panel ── */}
            <AnimatePresence>
              {(justSolved || (isSolved && !justSolved)) && (
                <motion.div
                  initial={justSolved ? { opacity: 0, scale: 0.9 } : { opacity: 1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    background: 'var(--bg-secondary)', border: '2px solid var(--success)',
                    padding: '24px', marginBottom: 16, textAlign: 'center',
                  }}
                >
                  <motion.div
                    initial={justSolved ? { rotate: -180, scale: 0 } : {}}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  >
                    <Trophy size={40} style={{ color: 'var(--success)', marginBottom: 12 }} />
                  </motion.div>
                  <div style={{
                    fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700,
                    color: 'var(--success)', marginBottom: 8,
                  }}>
                    {justSolved ? t('Challenge resolu !', 'Challenge solved!') : t('Deja resolu', 'Already solved')}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--text-primary)',
                    marginBottom: 4,
                  }}>
                    +{progress[challenge.id]?.score ?? currentPoints} points
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
                    {progress[challenge.id]?.attempts ?? attempts} {t('tentative', 'attempt')}{(progress[challenge.id]?.attempts ?? attempts) > 1 ? 's' : ''} &middot;
                    {' '}{revealedHints.length} {t('indice', 'hint')}{revealedHints.length > 1 ? 's' : ''} {t('utilise', 'used')}{revealedHints.length > 1 ? 's' : ''}
                  </div>

                  {/* Flag display */}
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 14, padding: '8px 12px',
                    background: '#060a16', color: '#00e5a0', marginBottom: 16,
                    border: '1px solid #1a2040', wordBreak: 'break-all',
                  }}>
                    {challenge.flag}
                  </div>

                  {nextId && (
                    <motion.button
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate(`/ctf/${nextId}`)}
                      style={{
                        padding: '12px 24px', background: 'var(--accent)',
                        color: 'var(--bg-primary)', border: 'none', fontWeight: 600,
                        cursor: 'pointer', width: '100%', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', gap: 8,
                        fontSize: 14,
                      }}
                    >
                      {t('Challenge suivant', 'Next challenge')} <ChevronRight size={16} />
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Flag input ── */}
            {!isSolved && !justSolved && (
              <div style={{
                background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                padding: '20px', marginBottom: 16,
              }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)',
                  textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12,
                }}>{t('// soumettre le flag', '// submit the flag')}</div>

                <motion.div
                  animate={shakeInput ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <input
                    type="text"
                    value={flagInput}
                    onChange={e => setFlagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
                    placeholder="NR{...}"
                    style={{
                      width: '100%', padding: '12px 14px',
                      fontFamily: 'var(--font-mono)', fontSize: 15,
                      background: '#060a16', color: '#00e5a0',
                      border: `1px solid ${wrongMsg ? 'var(--error)' : '#1a2040'}`,
                      outline: 'none', boxSizing: 'border-box',
                      transition: 'border-color 0.2s',
                    }}
                    spellCheck={false}
                    autoComplete="off"
                  />
                </motion.div>

                <AnimatePresence>
                  {wrongMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        marginTop: 8, fontSize: 13, color: 'var(--error)',
                      }}
                    >
                      <XCircle size={14} /> {t('Incorrect, essaie encore.', 'Incorrect, try again.')}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmit}
                  disabled={!flagInput.trim()}
                  style={{
                    marginTop: 12, padding: '12px 20px', width: '100%',
                    background: flagInput.trim() ? 'var(--accent)' : 'var(--bg-tertiary)',
                    color: flagInput.trim() ? 'var(--bg-primary)' : 'var(--text-muted)',
                    border: 'none', fontWeight: 600, fontSize: 14, cursor: flagInput.trim() ? 'pointer' : 'default',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    transition: 'all 0.15s',
                  }}
                >
                  <Send size={16} /> {t('VALIDER', 'SUBMIT')}
                </motion.button>
              </div>
            )}

            {/* ── Points display ── */}
            {!isSolved && !justSolved && (
              <div style={{
                background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                padding: '16px 20px', marginBottom: 16,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('Points disponibles', 'Available points')}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--accent)' }}>
                    {currentPoints}
                  </div>
                </div>
                {totalHintCost > 0 && (
                  <div style={{ fontSize: 12, color: 'var(--error)', textAlign: 'right' }}>
                    -{totalHintCost} pts ({t('indices', 'hints')})
                  </div>
                )}
              </div>
            )}

            {/* ── Hints ── */}
            <div style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              padding: '20px',
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, color: '#f59e0b',
                textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 14,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <Lightbulb size={14} /> {t('// indices', '// hints')}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {challenge.hints.map((hint) => {
                  const isRevealed = revealedHints.includes(hint.id)
                  const isConfirming = showConfirmHint === hint.id

                  return (
                    <div key={hint.id}>
                      {/* Hint button / revealed text */}
                      {!isRevealed && !isConfirming && (
                        <motion.button
                          whileHover={!isSolved && !justSolved ? { y: -1 } : {}}
                          whileTap={!isSolved && !justSolved ? { scale: 0.97 } : {}}
                          onClick={() => {
                            if (isSolved || justSolved) return
                            setShowConfirmHint(hint.id)
                          }}
                          style={{
                            width: '100%', padding: '10px 14px',
                            background: 'var(--bg-tertiary)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-secondary)', fontSize: 13,
                            cursor: (isSolved || justSolved) ? 'default' : 'pointer',
                            display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center', textAlign: 'left',
                            opacity: (isSolved || justSolved) ? 0.5 : 1,
                          }}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <EyeOff size={14} /> {t('Indice', 'Hint')} {hint.id}
                          </span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--error)' }}>
                            -{hint.cost} pts
                          </span>
                        </motion.button>
                      )}

                      {/* Confirmation */}
                      <AnimatePresence>
                        {isConfirming && !isRevealed && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{
                              background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)',
                              padding: '12px 14px', overflow: 'hidden',
                            }}
                          >
                            <p style={{ fontSize: 13, color: '#f59e0b', margin: '0 0 10px' }}>
                              {t('Reveler cet indice coutera', 'Revealing this hint will cost')} <strong>{hint.cost} points</strong>. {t('Continuer ?', 'Continue?')}
                            </p>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <motion.button
                                whileTap={{ scale: 0.97 }}
                                onClick={() => confirmRevealHint(hint.id)}
                                style={{
                                  padding: '6px 16px', background: '#f59e0b', color: '#000',
                                  border: 'none', fontWeight: 600, fontSize: 12, cursor: 'pointer',
                                }}
                              >
                                {t('Reveler', 'Reveal')}
                              </motion.button>
                              <motion.button
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setShowConfirmHint(null)}
                                style={{
                                  padding: '6px 16px', background: 'var(--bg-tertiary)',
                                  border: '1px solid var(--border)', color: 'var(--text-secondary)',
                                  fontSize: 12, cursor: 'pointer',
                                }}
                              >
                                {t('Annuler', 'Cancel')}
                              </motion.button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Revealed hint */}
                      {isRevealed && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          style={{
                            padding: '10px 14px', background: 'rgba(245,158,11,0.06)',
                            border: '1px solid rgba(245,158,11,0.2)',
                          }}
                        >
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4,
                            fontSize: 11, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '1px',
                          }}>
                            <Eye size={12} /> {t('Indice', 'Hint')} {hint.id} (-{hint.cost} pts)
                          </div>
                          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            {hint.text}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>

      </div>

      {/* ── Responsive styles ─────────────────────────────────── */}
      <style>{`
        @media (max-width: 768px) {
          .ctf-play-layout {
            flex-direction: column !important;
          }
          .ctf-play-left,
          .ctf-play-right {
            flex: 1 1 100% !important;
          }
        }
      `}</style>
    </div>
  )
}
