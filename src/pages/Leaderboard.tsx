import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Crown, Medal, Star } from 'lucide-react'
import { api } from '../services/api'
import { useAuthStore } from '../stores/authStore'
import { useTranslation } from '../hooks/useTranslation'

interface LeaderboardEntry {
  rank: number
  id: string
  firstName: string
  lastName: string
  pseudo: string | null
  avatarUrl: string | null
  totalPoints: number
}

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [myRank, setMyRank] = useState<{ rank: number; totalPoints: number; totalUsers: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const user = useAuthStore((s) => s.user)
  const { t, lang } = useTranslation()

  useEffect(() => {
    Promise.all([api.getLeaderboard(), api.getMyRank()])
      .then(([lb, rank]) => {
        setEntries(lb.leaderboard)
        setMyRank(rank)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown size={18} color="#fbbf24" />
    if (rank === 2) return <Medal size={18} color="#94a3b8" />
    if (rank === 3) return <Medal size={18} color="#d97706" />
    return <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--text-muted)' }}>#{rank}</span>
  }

  const getInitials = (entry: LeaderboardEntry) =>
    entry.pseudo ? entry.pseudo.charAt(0).toUpperCase() : `${entry.firstName.charAt(0)}${entry.lastName.charAt(0)}`.toUpperCase()

  const getDisplayName = (entry: LeaderboardEntry) =>
    entry.pseudo || `${entry.firstName} ${entry.lastName}`

  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12 }}>
            // {t('classement', 'ranking')}
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 32, fontWeight: 700, letterSpacing: '-1px', marginBottom: 8 }}>
            {t('Leaderboard', 'Leaderboard')}
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', fontWeight: 300 }}>{t('Top 50 des utilisateurs par points', 'Top 50 users by points')}</p>
        </motion.div>

        {/* My rank card */}
        {myRank && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--accent)',
              padding: 20, marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Trophy size={20} color="var(--accent)" />
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 600 }}>{t('Ta position', 'Your rank')}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>{t('sur', 'out of')} {myRank.totalUsers} {t('joueurs', 'players')}</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: 'var(--accent)' }}>#{myRank.rank}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>{myRank.totalPoints} pts</div>
            </div>
          </motion.div>
        )}

        {/* Leaderboard list */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>{t('Chargement...', 'Loading...')}</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {entries.map((entry, i) => {
              const isMe = entry.id === user?.id
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px',
                    background: isMe ? 'rgba(0, 229, 160, 0.05)' : 'var(--bg-secondary)',
                    border: `1px solid ${isMe ? 'var(--accent)' : 'var(--border)'}`,
                    boxShadow: entry.rank <= 3 ? `0 0 20px ${entry.rank === 1 ? 'rgba(251, 191, 36, 0.08)' : entry.rank === 2 ? 'rgba(148, 163, 184, 0.06)' : 'rgba(217, 119, 6, 0.06)'}` : 'none',
                    transition: 'border-color 0.2s, transform 0.2s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = isMe ? 'var(--accent)' : 'var(--border-active)'
                    ;(e.currentTarget as HTMLElement).style.transform = 'translateX(4px)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = isMe ? 'var(--accent)' : 'var(--border)'
                    ;(e.currentTarget as HTMLElement).style.transform = 'translateX(0)'
                  }}
                >
                  <div style={{ width: 32, textAlign: 'center' }}>{getRankIcon(entry.rank)}</div>

                  {entry.avatarUrl ? (
                    <img src={entry.avatarUrl} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-tertiary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)',
                    }}>
                      {getInitials(entry)}
                    </div>
                  )}

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>
                      {getDisplayName(entry)}
                      {isMe && <span style={{ fontSize: 11, color: 'var(--accent)', marginLeft: 8 }}>({t('toi', 'you')})</span>}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Star size={14} color="var(--accent-warm)" />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600, color: 'var(--accent-warm)' }}>
                      {entry.totalPoints}
                    </span>
                  </div>
                </motion.div>
              )
            })}
            {entries.length === 0 && (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: 14 }}>
                {t('Aucun utilisateur pour le moment', 'No users yet')}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
