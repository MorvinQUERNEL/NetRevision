import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, BarChart3, Trophy, BookOpen, Shield, Activity } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { api } from '../services/api'
import { useAuthStore } from '../stores/authStore'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '../hooks/useTranslation'

interface LeaderboardEntry {
  rank: number
  id: string
  firstName: string
  lastName: string
  avatarUrl: string | null
  totalPoints: number
}

interface PlatformStats {
  totalUsers: number
  totalQuizzesCompleted: number
}

export default function AdminDashboard() {
  const { t } = useTranslation()
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isLoading = useAuthStore((s) => s.isLoading)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login')
    }
  }, [isLoading, isAuthenticated, navigate])

  useEffect(() => {
    if (!isAuthenticated) return

    Promise.all([api.getStats(), api.getLeaderboard()])
      .then(([statsRes, lbRes]) => {
        setStats(statsRes.stats)
        setLeaderboard(lbRes.leaderboard)
      })
      .catch((err) => {
        setError(err.message || t('Erreur lors du chargement des donnees', 'Error loading data'))
      })
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  const topUser = leaderboard.length > 0 ? leaderboard[0] : null
  const averageScore =
    leaderboard.length > 0
      ? Math.round(leaderboard.reduce((sum, u) => sum + u.totalPoints, 0) / leaderboard.length)
      : 0

  const top10 = leaderboard.slice(0, 10)
  const chartData = top10.map((entry) => ({
    name: `${entry.firstName} ${entry.lastName.charAt(0)}.`,
    points: entry.totalPoints,
  }))

  const contentStats = [
    { label: t('Programmes', 'Programs'), value: 3 },
    { label: t('Chapitres', 'Chapters'), value: 24 },
    { label: t('Questions QCM', 'MCQ Questions'), value: 240 },
    { label: t('Questions examen', 'Exam Questions'), value: 150 },
    { label: t('Termes glossaire', 'Glossary Terms'), value: 149 },
  ]

  const tools = [
    t('Calculatrice', 'Calculator'),
    'Flashcards',
    t('Simulateur CLI', 'CLI Simulator'),
    t('Exercices Subnetting', 'Subnetting Exercises'),
    t('Glossaire', 'Glossary'),
  ]

  if (isLoading) {
    return (
      <div style={{ paddingTop: 56 }}>
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '48px 24px 80px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
          }}
        >
          {t('Chargement...', 'Loading...')}
        </div>
      </div>
    )
  }

  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 40 }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--accent)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: 12,
            }}
          >
            // administration
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: '-1px',
              marginBottom: 10,
            }}
          >
            Dashboard Admin
          </h1>
          <p
            style={{
              fontSize: 15,
              color: 'var(--text-secondary)',
              fontWeight: 300,
            }}
          >
            {t("Vue d'ensemble de la plateforme", 'Platform overview')}
          </p>
        </motion.div>

        {/* Loading state */}
        {loading && (
          <div
            style={{
              textAlign: 'center',
              padding: 60,
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
            }}
          >
            {t('Chargement des statistiques...', 'Loading statistics...')}
          </div>
        )}

        {/* Error state */}
        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid var(--error)',
              padding: 20,
              marginBottom: 24,
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              color: 'var(--error)',
            }}
          >
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Stats overview cards */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="admin-stats-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 2,
                marginBottom: 40,
              }}
            >
              {/* Utilisateurs inscrits */}
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  padding: 24,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    marginBottom: 16,
                  }}
                >
                  <Users size={18} color="var(--accent)" />
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    {t('Utilisateurs inscrits', 'Registered users')}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 36,
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                  }}
                >
                  {stats?.totalUsers ?? '--'}
                </div>
              </div>

              {/* Quiz completes */}
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  padding: 24,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    marginBottom: 16,
                  }}
                >
                  <BarChart3 size={18} color="var(--accent)" />
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    {t('Quiz completes', 'Quizzes completed')}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 36,
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                  }}
                >
                  {stats?.totalQuizzesCompleted ?? '--'}
                </div>
              </div>

              {/* Utilisateur le plus actif */}
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  padding: 24,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    marginBottom: 16,
                  }}
                >
                  <Trophy size={18} color="var(--accent)" />
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    {t('Utilisateur le plus actif', 'Most active user')}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 20,
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    lineHeight: 1.3,
                  }}
                >
                  {topUser
                    ? `${topUser.firstName} ${topUser.lastName}`
                    : '--'}
                </div>
                {topUser && (
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 12,
                      color: 'var(--accent)',
                      marginTop: 4,
                    }}
                  >
                    {topUser.totalPoints} pts
                  </div>
                )}
              </div>

              {/* Score moyen */}
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  padding: 24,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    marginBottom: 16,
                  }}
                >
                  <Activity size={18} color="var(--accent)" />
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    {t('Score moyen', 'Average score')}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 36,
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                  }}
                >
                  {averageScore}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    color: 'var(--text-muted)',
                    marginTop: 4,
                  }}
                >
                  {t('pts / utilisateur (top 50)', 'pts / user (top 50)')}
                </div>
              </div>
            </motion.div>

            {/* Top 10 users table */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ marginBottom: 40 }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 20,
                }}
              >
                <Shield size={18} color="var(--accent)" />
                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 20,
                    fontWeight: 700,
                    margin: 0,
                  }}
                >
                  {t('Top 10 utilisateurs', 'Top 10 users')}
                </h2>
              </div>

              <div
                style={{
                  border: '1px solid var(--border)',
                  overflow: 'hidden',
                }}
              >
                {/* Table header */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr 120px 100px',
                    padding: '12px 20px',
                    background: 'var(--bg-tertiary)',
                    borderBottom: '1px solid var(--border)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}
                >
                  <div>{t('Rang', 'Rank')}</div>
                  <div>{t('Nom', 'Name')}</div>
                  <div style={{ textAlign: 'right' }}>Points</div>
                  <div style={{ textAlign: 'right' }}>Badges</div>
                </div>

                {/* Table rows */}
                {top10.length === 0 && (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: 40,
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 13,
                    }}
                  >
                    {t('Aucun utilisateur', 'No users')}
                  </div>
                )}
                {top10.map((entry, index) => (
                  <div
                    key={entry.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '60px 1fr 120px 100px',
                      padding: '14px 20px',
                      background:
                        index % 2 === 0
                          ? 'var(--bg-secondary)'
                          : 'var(--bg-primary)',
                      borderBottom:
                        index < top10.length - 1
                          ? '1px solid var(--border)'
                          : 'none',
                      alignItems: 'center',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 14,
                        fontWeight: 700,
                        color:
                          entry.rank === 1
                            ? '#fbbf24'
                            : entry.rank === 2
                              ? '#94a3b8'
                              : entry.rank === 3
                                ? '#d97706'
                                : 'var(--text-muted)',
                      }}
                    >
                      #{entry.rank}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                      }}
                    >
                      {entry.avatarUrl ? (
                        <img
                          src={entry.avatarUrl}
                          alt=""
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            background: 'var(--bg-tertiary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: 'var(--font-mono)',
                            fontSize: 11,
                            fontWeight: 600,
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {entry.firstName.charAt(0)}
                          {entry.lastName.charAt(0)}
                        </div>
                      )}
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: 'var(--text-primary)',
                        }}
                      >
                        {entry.firstName} {entry.lastName}
                      </span>
                    </div>
                    <div
                      style={{
                        textAlign: 'right',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 14,
                        fontWeight: 600,
                        color: 'var(--accent)',
                      }}
                    >
                      {entry.totalPoints}
                    </div>
                    <div
                      style={{
                        textAlign: 'right',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 13,
                        color: 'var(--text-muted)',
                      }}
                    >
                      ---
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Platform activity section */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ marginBottom: 40 }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 20,
                }}
              >
                <Activity size={18} color="var(--accent)" />
                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 20,
                    fontWeight: 700,
                    margin: 0,
                  }}
                >
                  {t('Activite de la plateforme', 'Platform activity')}
                </h2>
              </div>

              {/* Quick stats row */}
              <div
                className="admin-activity-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 2,
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    padding: 20,
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: 8,
                    }}
                  >
                    {t('Moyenne points / utilisateur', 'Average points / user')}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 28,
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {averageScore}{' '}
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 400,
                        color: 'var(--text-muted)',
                      }}
                    >
                      pts
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    padding: 20,
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: 8,
                    }}
                  >
                    {t('Programme le plus populaire', 'Most popular program')}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 20,
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                    }}
                  >
                    Programme 1{' '}
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 400,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      — {t('Fondamentaux', 'Fundamentals')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bar chart */}
              {chartData.length > 0 && (
                <div
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    padding: 24,
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: 20,
                    }}
                  >
                    {t('Distribution des points — Top 10', 'Points distribution — Top 10')}
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--border)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="name"
                        tick={{
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: 11,
                          fill: 'var(--text-muted)',
                        }}
                        axisLine={{ stroke: 'var(--border)' }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: 11,
                          fill: 'var(--text-muted)',
                        }}
                        axisLine={{ stroke: 'var(--border)' }}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          background: 'var(--bg-tertiary)',
                          border: '1px solid var(--border)',
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: 12,
                          color: 'var(--text-primary)',
                        }}
                        labelStyle={{ color: 'var(--text-secondary)' }}
                        cursor={{ fill: 'rgba(0, 229, 160, 0.05)' }}
                      />
                      <Bar
                        dataKey="points"
                        fill="var(--accent)"
                        radius={[0, 0, 0, 0]}
                        maxBarSize={48}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </motion.div>

            {/* Content summary section */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 20,
                }}
              >
                <BookOpen size={18} color="var(--accent)" />
                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 20,
                    fontWeight: 700,
                    margin: 0,
                  }}
                >
                  {t('Contenu de la plateforme', 'Platform content')}
                </h2>
              </div>

              {/* Content stats grid */}
              <div
                className="admin-content-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: 2,
                  marginBottom: 20,
                }}
              >
                {contentStats.map((item) => (
                  <div
                    key={item.label}
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      padding: 20,
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 32,
                        fontWeight: 700,
                        color: 'var(--accent)',
                        marginBottom: 6,
                      }}
                    >
                      {item.value}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                      }}
                    >
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tools list */}
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  padding: 20,
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: 14,
                  }}
                >
                  {tools.length} {t('Outils disponibles', 'Available tools')}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {tools.map((tool) => (
                    <span
                      key={tool}
                      style={{
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border)',
                        padding: '6px 14px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 12,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .admin-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .admin-content-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .admin-stats-grid { grid-template-columns: 1fr !important; }
          .admin-activity-grid { grid-template-columns: 1fr !important; }
          .admin-content-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  )
}
