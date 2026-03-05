import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Trophy, Award, Star, ArrowRight, Flame, Target, Terminal, Brain } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { getUserLevel } from '../utils/levelCalculator'
import { useProgressStore } from '../stores/progressStore'
import { api } from '../services/api'
import { useTranslation, useChapters, useFormationFromUrl } from '../hooks/useTranslation'
import FormationSwitcher from '../components/FormationSwitcher'
import { getFormation, isValidFormation } from '../stores/formationStore'

export default function Dashboard() {
  const user = useAuthStore((s) => s.user)
  const formation = useFormationFromUrl()
  const records = useProgressStore((s) => s.records)
  const [rank, setRank] = useState<{ rank: number; totalUsers: number } | null>(null)
  const [recentBadges, setRecentBadges] = useState<any[]>([])
  const { t } = useTranslation()
  const allChapters = useChapters()

  useEffect(() => {
    api.getMyRank().then(setRank).catch(() => {})
    api.getMyBadges().then((d) => setRecentBadges(d.badges.slice(0, 4))).catch(() => {})
  }, [])

  const completedCourses = records.filter((r) => r.courseCompleted).length
  const completedQuizzes = records.filter((r) => r.quizScore !== null).length
  const avgScore = completedQuizzes > 0
    ? Math.round(records.filter((r) => r.quizScore !== null).reduce((s, r) => s + (r.quizScore || 0), 0) / completedQuizzes)
    : 0
  const progressPercent = Math.round((completedCourses / allChapters.length) * 100)

  const stats = [
    { icon: <Star size={18} />, value: `${user?.totalPoints || 0}`, label: `points — ${t('Niv.', 'Lv.')}${getUserLevel(user?.totalPoints || 0).currentLevel.level}`, color: 'var(--accent-warm)' },
    { icon: <Trophy size={18} />, value: rank?.rank ? `#${rank.rank}` : '-', label: t('classement', 'ranking'), color: 'var(--accent)' },
    { icon: <BookOpen size={18} />, value: `${completedCourses}/${allChapters.length}`, label: t('cours', 'courses'), color: 'var(--accent-secondary)' },
    { icon: <Flame size={18} />, value: user?.loginStreak || 0, label: t('jours consécutifs', 'day streak'), color: '#ef4444' },
  ]

  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        {/* Welcome + Formation Switcher */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 8 }}>
              // {formation}
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 32, fontWeight: 700, letterSpacing: '-1px', marginBottom: 4 }}>
              {t('Salut,', 'Hi,')} <span style={{ color: 'var(--accent)' }}>{user?.firstName}</span>
            </h1>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', fontWeight: 300 }}>
              {progressPercent === 0 ? t('Prêt à commencer ton apprentissage ?', 'Ready to start learning?') : `${progressPercent}% ${t('du programme complété', 'of program completed')}`}
            </p>
          </div>
          <FormationSwitcher />
        </motion.div>

        {/* Stats grid with gradient backgrounds */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, marginBottom: 40 }} className="stats-grid-dash">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ borderColor: s.color, y: -2 }}
              style={{
                background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: 20,
                position: 'relative', overflow: 'hidden', transition: 'all 0.25s',
              }}
            >
              {/* Subtle gradient background */}
              <div style={{
                position: 'absolute', top: 0, right: 0, width: '60%', height: '100%',
                background: `linear-gradient(135deg, transparent 40%, ${s.color}06)`,
                pointerEvents: 'none',
              }} />
              <div style={{ color: s.color, marginBottom: 10, position: 'relative' }}>{s.icon}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: s.color, position: 'relative' }}>{s.value}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', position: 'relative' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Progress bar with animated fill */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: 24, marginBottom: 40 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 600 }}>{t('Progression globale', 'Global progress')}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--accent)' }}>{progressPercent}%</span>
          </div>
          <div style={{ height: 6, background: 'var(--bg-primary)', overflow: 'hidden', position: 'relative' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                height: '100%', background: 'var(--accent)',
                boxShadow: progressPercent > 0 ? '0 0 10px var(--accent-glow)' : 'none',
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{completedCourses} {t('cours', 'courses')}, {completedQuizzes} quiz{t('', 'zes')} ({t('moy.', 'avg.')} {avgScore}%)</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{allChapters.length} {t('chapitres au total', 'total chapters')}</span>
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 40 }} className="dash-grid-2col">
          {/* Recent badges */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: 24 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 600 }}>{t('Badges récents', 'Recent badges')}</span>
              <Link to="/badges" style={{ fontSize: 12, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 4 }}>
                {t('Voir tout', 'See all')} <ArrowRight size={12} />
              </Link>
            </div>
            {recentBadges.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t('Aucun badge débloqué pour l\'instant', 'No badges unlocked yet')}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {recentBadges.map((b: any, i: number) => (
                  <motion.div
                    key={b.slug}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.06 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}
                  >
                    <Award size={16} color="var(--accent-warm)" />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{b.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.description}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Quick actions */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: 24 }}
          >
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 600, display: 'block', marginBottom: 16 }}>{t('Actions rapides', 'Quick actions')}</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { to: `/${formation}`, label: t('Continuer les cours', 'Continue courses'), icon: <BookOpen size={16} />, color: 'var(--accent)' },
                { to: '/leaderboard', label: t('Voir le classement', 'View ranking'), icon: <Trophy size={16} />, color: 'var(--accent-warm)' },
                { to: '/notes', label: t('Mes notes', 'My notes'), icon: <Target size={16} />, color: 'var(--accent-secondary)' },
                { to: `/${formation}/simulateur-cli`, label: (isValidFormation(formation) && getFormation(formation).cliSimulatorType === 'terminal') ? t('Simulateur Terminal', 'Terminal Simulator') : t('Simulateur CLI Cisco', 'Cisco CLI Simulator'), icon: <Terminal size={16} />, color: '#00e5a0' },
                { to: `/${formation}/flashcards`, label: 'Flashcards', icon: <Brain size={16} />, color: '#f59e0b' },
              ].map((a) => (
                <Link key={a.to} to={a.to}>
                  <motion.div
                    whileHover={{ borderColor: a.color, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                      border: '1px solid var(--border)', transition: 'all 0.2s', cursor: 'pointer',
                    }}
                  >
                    <div style={{ color: a.color }}>{a.icon}</div>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{a.label}</span>
                    <ArrowRight size={14} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .stats-grid-dash { grid-template-columns: repeat(2, 1fr) !important; }
          .dash-grid-2col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
