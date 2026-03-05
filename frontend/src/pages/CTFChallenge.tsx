import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Flag, Shield, Search, AlertTriangle, Network, Terminal,
  CheckCircle, Lock, Star, Trophy, Target, Filter,
  ChevronRight, Zap, ArrowUpDown, Clock, Eye,
} from 'lucide-react'
import { type CTFChallenge } from '../data/ctfChallenges'
import { useCtfChallenges, useTranslation } from '../hooks/useTranslation'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Category = CTFChallenge['category'] | 'all'
type Difficulty = CTFChallenge['difficulty'] | 0  // 0 = all
type SortBy = 'difficulty' | 'points' | 'status'

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

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function loadProgress(): CTFProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

function getCategoryStats(
  cat: CTFChallenge['category'],
  progress: CTFProgress,
  ctfChallenges: CTFChallenge[],
): { total: number; solved: number; points: number; maxPoints: number } {
  const challenges = ctfChallenges.filter(c => c.category === cat)
  const solved = challenges.filter(c => progress[c.id]?.solved).length
  const points = challenges.reduce((s, c) => s + (progress[c.id]?.solved ? progress[c.id].score : 0), 0)
  const maxPoints = challenges.reduce((s, c) => s + c.points, 0)
  return { total: challenges.length, solved, points, maxPoints }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function CTFChallengePage() {
  const { t } = useTranslation()
  const ctfChallenges = useCtfChallenges()
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

  const sortOptions: { key: SortBy; label: string }[] = [
    { key: 'difficulty', label: t('Difficulte', 'Difficulty') },
    { key: 'points',     label: 'Points' },
    { key: 'status',     label: t('Statut', 'Status') },
  ]

  const [categoryFilter, setCategoryFilter] = useState<Category>('all')
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty>(0)
  const [sortBy, setSortBy] = useState<SortBy>('difficulty')
  const [progress, setProgress] = useState<CTFProgress>({})

  useEffect(() => {
    setProgress(loadProgress())
    const handler = () => setProgress(loadProgress())
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  /* ---- derived data ---- */

  const filtered = useMemo(() => {
    let list = ctfChallenges.filter(c => {
      if (categoryFilter !== 'all' && c.category !== categoryFilter) return false
      if (difficultyFilter !== 0 && c.difficulty !== difficultyFilter) return false
      return true
    })

    // Sort
    list = [...list].sort((a, b) => {
      if (sortBy === 'points') return b.points - a.points
      if (sortBy === 'status') {
        const aSolved = progress[a.id]?.solved ? 1 : 0
        const bSolved = progress[b.id]?.solved ? 1 : 0
        if (aSolved !== bSolved) return aSolved - bSolved // unsolved first
        return a.difficulty - b.difficulty
      }
      return a.difficulty - b.difficulty // default: difficulty ascending
    })

    return list
  }, [categoryFilter, difficultyFilter, sortBy, progress])

  const solvedCount = ctfChallenges.filter(c => progress[c.id]?.solved).length
  const totalPoints = Object.values(progress).reduce((s, p) => s + (p.solved ? p.score : 0), 0)
  const maxPoints = ctfChallenges.reduce((s, c) => s + c.points, 0)
  const successRate = ctfChallenges.length > 0
    ? Math.round((solvedCount / ctfChallenges.length) * 100)
    : 0
  const totalAttempts = Object.values(progress).reduce((s, p) => s + p.attempts, 0)

  /* ---- render ---- */

  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* ── Header ────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)',
            textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12,
          }}>{'// capture the flag'}</div>
          <h1 style={{
            fontFamily: 'var(--font-heading)', fontSize: 32, fontWeight: 700,
            letterSpacing: '-1px', marginBottom: 8,
          }}>CTF Challenges</h1>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', fontWeight: 300, marginBottom: 32, maxWidth: 620 }}>
            {t("Analysez des configurations, des logs et des captures reseau pour trouver les flags caches. Chaque defi simule un scenario realiste d'administration et de securite reseau.", 'Analyze configurations, logs and network captures to find hidden flags. Each challenge simulates a realistic network administration and security scenario.')}
          </p>
        </motion.div>

        {/* ── Stats bar ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2,
            marginBottom: 24,
          }}
        >
          {[
            { label: 'Challenges', value: ctfChallenges.length, icon: <Flag size={18} />, color: 'var(--accent)' },
            { label: t('Resolus', 'Solved'), value: `${solvedCount} / ${ctfChallenges.length}`, icon: <CheckCircle size={18} />, color: 'var(--success)' },
            { label: 'Points', value: `${totalPoints} / ${maxPoints}`, icon: <Star size={18} />, color: '#f59e0b' },
            { label: t('Taux de reussite', 'Success rate'), value: `${successRate}%`, icon: <Trophy size={18} />, color: '#6366f1' },
          ].map((stat, i) => (
            <div key={i} style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              padding: '18px 16px', display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{ color: stat.color, flexShrink: 0 }}>{stat.icon}</div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-heading)' }}>{stat.value}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── Category progress bars ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2,
            marginBottom: 32,
          }}
        >
          {(Object.keys(categoryMeta) as CTFChallenge['category'][]).map(cat => {
            const stats = getCategoryStats(cat, progress, ctfChallenges)
            const pct = stats.total > 0 ? (stats.solved / stats.total) * 100 : 0
            const meta = categoryMeta[cat]
            return (
              <div key={cat} style={{
                background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                padding: '14px 16px',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8,
                  fontSize: 12, color: meta.color, fontWeight: 600,
                }}>
                  {meta.icon} {meta.label}
                </div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                  marginBottom: 6,
                }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {stats.solved}/{stats.total} {t('resolus', 'solved')}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {stats.points}/{stats.maxPoints} pts
                  </span>
                </div>
                {/* Progress bar */}
                <div style={{
                  height: 4, background: 'var(--bg-tertiary)', overflow: 'hidden',
                }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    style={{ height: '100%', background: meta.color }}
                  />
                </div>
              </div>
            )
          })}
        </motion.div>

        {/* ── Filters ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: 32 }}
        >
          {/* Category filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <Filter size={14} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginRight: 4 }}>{t('Categorie', 'Category')}</span>
            {(['all', 'network-config', 'security', 'forensics', 'protocol-analysis'] as Category[]).map(cat => {
              const active = categoryFilter === cat
              const meta = cat === 'all' ? null : categoryMeta[cat]
              return (
                <motion.button
                  key={cat}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setCategoryFilter(cat)}
                  style={{
                    padding: '6px 14px', fontSize: 13, fontWeight: active ? 600 : 400,
                    background: active ? 'var(--accent)' : 'var(--bg-secondary)',
                    color: active ? 'var(--bg-primary)' : 'var(--text-secondary)',
                    border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {meta ? meta.icon : <Target size={14} />}
                  {cat === 'all' ? t('Tous', 'All') : meta!.label}
                </motion.button>
              )
            })}
          </div>

          {/* Difficulty filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <Zap size={14} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginRight: 4 }}>{t('Difficulte', 'Difficulty')}</span>
            {([0, 1, 2, 3, 4] as Difficulty[]).map(d => {
              const active = difficultyFilter === d
              const meta = d === 0 ? null : difficultyMeta[d]
              return (
                <motion.button
                  key={d}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setDifficultyFilter(d)}
                  style={{
                    padding: '6px 14px', fontSize: 13, fontWeight: active ? 600 : 400,
                    background: active
                      ? (meta ? meta.color : 'var(--accent)')
                      : 'var(--bg-secondary)',
                    color: active ? '#fff' : 'var(--text-secondary)',
                    border: `1px solid ${active ? (meta ? meta.color : 'var(--accent)') : 'var(--border)'}`,
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  {d === 0 ? t('Tous', 'All') : meta!.label}
                </motion.button>
              )
            })}
          </div>

          {/* Sort */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <ArrowUpDown size={14} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginRight: 4 }}>{t('Trier par', 'Sort by')}</span>
            {sortOptions.map(opt => {
              const active = sortBy === opt.key
              return (
                <motion.button
                  key={opt.key}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSortBy(opt.key)}
                  style={{
                    padding: '6px 14px', fontSize: 13, fontWeight: active ? 600 : 400,
                    background: active ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                    color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                    border: `1px solid ${active ? 'var(--text-muted)' : 'var(--border)'}`,
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  {opt.label}
                </motion.button>
              )
            })}

            {/* Result count */}
            <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)' }}>
              {filtered.length} challenge{filtered.length > 1 ? 's' : ''} &middot; {totalAttempts} {t('tentative', 'attempt')}{totalAttempts > 1 ? 's' : ''} {t('au total', 'total')}
            </span>
          </div>
        </motion.div>

        {/* ── Challenge grid ────────────────────────────────────── */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2,
        }}>
          <AnimatePresence mode="popLayout">
            {filtered.map((challenge, idx) => {
              const cp = progress[challenge.id]
              const solved = cp?.solved ?? false
              const catMeta = categoryMeta[challenge.category]
              const diffMeta = difficultyMeta[challenge.difficulty]

              return (
                <motion.div
                  key={challenge.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.03 }}
                  onClick={() => navigate(`/ctf/${challenge.id}`)}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    borderTop: solved ? '3px solid var(--success)' : '1px solid var(--border)',
                    padding: '20px 18px',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}
                  whileHover={{ y: -2, borderColor: 'var(--accent)' }}
                >
                  {/* Top row: difficulty + category */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px',
                      padding: '3px 8px', background: diffMeta.bg, color: diffMeta.color,
                    }}>
                      {'★'.repeat(challenge.difficulty)} {diffMeta.label}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: catMeta.color }}>
                      {catMeta.icon} {catMeta.label}
                    </span>
                  </div>

                  {/* Title */}
                  <div style={{
                    fontFamily: 'var(--font-heading)', fontSize: 17, fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    {solved
                      ? <CheckCircle size={18} style={{ color: 'var(--success)', flexShrink: 0 }} />
                      : <Lock size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    }
                    {challenge.title}
                  </div>

                  {/* Description */}
                  <p style={{
                    fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5,
                    flex: 1, margin: 0,
                  }}>
                    {challenge.description}
                  </p>

                  {/* Artifacts count + hints indicator */}
                  <div style={{
                    display: 'flex', gap: 12, fontSize: 11, color: 'var(--text-muted)',
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Eye size={12} /> {challenge.artifacts.length} {t('artefact', 'artifact')}{challenge.artifacts.length > 1 ? 's' : ''}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} /> {challenge.hints.length} {t('indices', 'hints')}
                    </span>
                    {cp && cp.attempts > 0 && !solved && (
                      <span style={{ color: 'var(--error)' }}>
                        {cp.attempts} {t('essai', 'attempt')}{cp.attempts > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {/* Footer: points + arrow */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700,
                      color: solved ? 'var(--success)' : 'var(--accent)',
                    }}>
                      {solved
                        ? `${cp?.score ?? challenge.points} pts`
                        : `${challenge.points} pts`
                      }
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
                      {solved ? t('Resolu', 'Solved') : t('Commencer', 'Start')}
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* ── Empty state ───────────────────────────────────────── */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center', padding: '60px 20px',
              color: 'var(--text-muted)', fontSize: 15,
            }}
          >
            <AlertTriangle size={32} style={{ marginBottom: 12, opacity: 0.5 }} />
            <div>{t('Aucun challenge ne correspond aux filtres selectionnes.', 'No challenges match the selected filters.')}</div>
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setCategoryFilter('all'); setDifficultyFilter(0) }}
              style={{
                marginTop: 16, padding: '8px 20px', background: 'var(--bg-secondary)',
                border: '1px solid var(--border)', color: 'var(--text-secondary)',
                fontSize: 13, cursor: 'pointer',
              }}
            >
              {t('Reinitialiser les filtres', 'Reset filters')}
            </motion.button>
          </motion.div>
        )}

      </div>
    </div>
  )
}
