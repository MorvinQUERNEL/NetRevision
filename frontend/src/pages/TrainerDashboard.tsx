import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, BookOpen, TrendingUp, AlertTriangle, Plus, Trash2, X, GraduationCap } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useTrainerStore, generateMockStudents, type Student } from '../stores/trainerStore'
import { useTranslation } from '../hooks/useTranslation'

const PROGRAMME_COLORS = {
  P1: '#00e5a0',
  P2: '#6366f1',
  P3: '#f59e0b',
  P4: '#e11d48',
}

const CHAPTER_NAMES = [
  'Ch.1 OSI',
  'Ch.2 IPv4/6',
  'Ch.3 VLAN',
  'Ch.4 Broadcast',
  'Ch.5 Routage',
  'Ch.6 Subnet',
  'Ch.7 ICMP',
  'Ch.8 DNS/DHCP',
]

function getProgrammeNames(t: (fr: string, en: string) => string) {
  return [
    { name: t('P1 Fondamentaux', 'P1 Fundamentals'), color: PROGRAMME_COLORS.P1 },
    { name: t('P2 Avance', 'P2 Advanced'), color: PROGRAMME_COLORS.P2 },
    { name: t('P3 Entreprise', 'P3 Enterprise'), color: PROGRAMME_COLORS.P3 },
    { name: t('P4 Expert', 'P4 Expert'), color: PROGRAMME_COLORS.P4 },
  ]
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number; name: string }>
  label?: string
}

function ChartTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null
  return (
    <div
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        padding: '10px 14px',
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
      }}
    >
      <div style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>{label}</div>
      <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
        {payload[0].value}%
      </div>
    </div>
  )
}

export default function TrainerDashboard() {
  const { t, lang } = useTranslation()
  const { cohorts, loadCohorts, createCohort, deleteCohort } = useTrainerStore()
  const [selectedCohortId, setSelectedCohortId] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [newCohortName, setNewCohortName] = useState('')
  const [newCohortEmails, setNewCohortEmails] = useState('')

  useEffect(() => {
    loadCohorts()
  }, [loadCohorts])

  const selectedCohort = useMemo(
    () => cohorts.find((c) => c.id === selectedCohortId) ?? null,
    [cohorts, selectedCohortId]
  )

  const students: Student[] = useMemo(() => {
    if (!selectedCohort) return []
    const count = selectedCohort.studentEmails.length > 0 ? selectedCohort.studentEmails.length : 12
    return generateMockStudents(count)
  }, [selectedCohort])

  const totalStudents = students.length

  const completionRate = useMemo(() => {
    if (students.length === 0) return 0
    const avg = students.reduce((sum, s) => sum + s.coursesCompleted, 0) / students.length
    return Math.round((avg / 32) * 100)
  }, [students])

  const avgQuizScore = useMemo(() => {
    if (students.length === 0) return 0
    return Math.round(students.reduce((sum, s) => sum + s.avgQuizScore, 0) / students.length)
  }, [students])

  const needsHelpCount = useMemo(() => {
    return students.filter((s) => s.needsHelp).length
  }, [students])

  const chapterCompletionData = useMemo(() => {
    return CHAPTER_NAMES.map((name) => ({
      name,
      value: Math.round(40 + Math.random() * 55),
    }))
  }, [selectedCohortId])

  const PROGRAMME_NAMES = getProgrammeNames(t)

  const programmeScoreData = useMemo(() => {
    return PROGRAMME_NAMES.map((p) => ({
      name: p.name,
      value: Math.round(50 + Math.random() * 40),
      color: p.color,
    }))
  }, [selectedCohortId])

  const heatmapData = useMemo(() => {
    const days = lang === 'en' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
    return days.map((day) => ({
      day,
      hours: Array.from({ length: 24 }, () => Math.random()),
    }))
  }, [selectedCohortId])

  const studentsInDifficulty = useMemo(() => {
    return students.filter((s) => s.needsHelp)
  }, [students])

  const handleCreateCohort = () => {
    if (!newCohortName.trim()) return
    const emails = newCohortEmails
      .split('\n')
      .map((e) => e.trim())
      .filter((e) => e.length > 0)
    createCohort(newCohortName.trim(), emails)
    setNewCohortName('')
    setNewCohortEmails('')
    setShowModal(false)
  }

  const handleDeleteCohort = (id: string) => {
    if (selectedCohortId === id) setSelectedCohortId(null)
    deleteCohort(id)
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString(lang === 'en' ? 'en-US' : 'fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const formatRelative = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime()
    const hours = Math.floor(diff / 3600000)
    if (lang === 'en') {
      if (hours < 1) return 'Less than 1h ago'
      if (hours < 24) return `${hours}h ago`
      const days = Math.floor(hours / 24)
      return `${days}d ago`
    }
    if (hours < 1) return 'Il y a moins d\'1h'
    if (hours < 24) return `Il y a ${hours}h`
    const days = Math.floor(hours / 24)
    return `Il y a ${days}j`
  }

  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 32 }}
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
            {t('// formateur', '// trainer')}
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
            {t('Dashboard Formateur', 'Trainer Dashboard')}
          </h1>
          <p
            style={{
              fontSize: 15,
              color: 'var(--text-secondary)',
              fontWeight: 300,
            }}
          >
            {t('Gerez vos cohortes et suivez la progression de vos etudiants', 'Manage your cohorts and track your students\' progress')}
          </p>
        </motion.div>

        {/* Demo banner */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          style={{
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            padding: '14px 20px',
            marginBottom: 32,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <AlertTriangle size={18} color="#f59e0b" style={{ flexShrink: 0 }} />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: '#f59e0b',
            }}
          >
            {t('Mode demonstration — donnees simulees pour illustrer les fonctionnalites', 'Demo mode — simulated data to illustrate features')}
          </span>
        </motion.div>

        {/* Cohort management */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: 40 }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <GraduationCap size={18} color="var(--accent)" />
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 20,
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                {t('Cohortes', 'Cohorts')}
              </h2>
            </div>
            <button
              onClick={() => setShowModal(true)}
              style={{
                background: 'var(--accent)',
                color: '#080b1a',
                border: 'none',
                padding: '8px 16px',
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              <Plus size={14} />
              {t('Nouvelle cohorte', 'New cohort')}
            </button>
          </div>

          {cohorts.length === 0 ? (
            <div
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                padding: '60px 24px',
                textAlign: 'center',
              }}
            >
              <GraduationCap
                size={40}
                color="var(--text-muted)"
                style={{ marginBottom: 16 }}
              />
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 15,
                  color: 'var(--text-secondary)',
                  marginBottom: 20,
                }}
              >
                {t('Creez une cohorte pour commencer', 'Create a cohort to get started')}
              </p>
              <button
                onClick={() => setShowModal(true)}
                style={{
                  background: 'var(--accent)',
                  color: '#080b1a',
                  border: 'none',
                  padding: '10px 20px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                <Plus size={14} />
                {t('Creer une cohorte', 'Create a cohort')}
              </button>
            </div>
          ) : (
            <div
              className="trainer-cohort-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 2,
              }}
            >
              {cohorts.map((cohort) => {
                const isSelected = selectedCohortId === cohort.id
                return (
                  <div
                    key={cohort.id}
                    onClick={() => setSelectedCohortId(isSelected ? null : cohort.id)}
                    style={{
                      background: 'var(--bg-secondary)',
                      border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                      padding: 20,
                      cursor: 'pointer',
                      transition: 'border-color 0.15s ease',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: 12,
                      }}
                    >
                      <div
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: 16,
                          fontWeight: 600,
                          color: isSelected ? 'var(--accent)' : 'var(--text-primary)',
                        }}
                      >
                        {cohort.name}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteCohort(cohort.id)
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 4,
                          color: 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        color: 'var(--text-muted)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                      }}
                    >
                      <span>
                        {cohort.studentEmails.length > 0
                          ? `${cohort.studentEmails.length} ${t('etudiants', 'students')}`
                          : `12 ${t('etudiants (demo)', 'students (demo)')}`}
                      </span>
                      <span>{t('Cree le', 'Created on')} {formatDate(cohort.createdAt)}</span>
                    </div>
                    {isSelected && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: 3,
                          height: '100%',
                          background: 'var(--accent)',
                        }}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>

        {/* Analytics (shown when cohort selected) */}
        {selectedCohort && (
          <>
            {/* Stat cards */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="trainer-stats-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 2,
                marginBottom: 40,
              }}
            >
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
                    {t('Etudiants', 'Students')}
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
                  {totalStudents}
                </div>
              </div>

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
                  <BookOpen size={18} color="var(--accent)" />
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    {t('Taux completion', 'Completion rate')}
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
                  {completionRate}
                  <span
                    style={{
                      fontSize: 18,
                      fontWeight: 400,
                      color: 'var(--text-muted)',
                    }}
                  >
                    %
                  </span>
                </div>
              </div>

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
                  <TrendingUp size={18} color="var(--accent)" />
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    {t('Moyenne quiz', 'Quiz average')}
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
                  {avgQuizScore}
                  <span
                    style={{
                      fontSize: 18,
                      fontWeight: 400,
                      color: 'var(--text-muted)',
                    }}
                  >
                    %
                  </span>
                </div>
              </div>

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
                  <AlertTriangle size={18} color="#e11d48" />
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    {t('Besoin aide', 'Needs help')}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 36,
                    fontWeight: 700,
                    color: '#e11d48',
                  }}
                >
                  {needsHelpCount}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--text-muted)',
                    marginTop: 4,
                  }}
                >
                  score &lt;70%
                </div>
              </div>
            </motion.div>

            {/* Charts */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="trainer-charts-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 2,
                marginBottom: 40,
              }}
            >
              {/* Chapter completion chart */}
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
                  {t('Completion par chapitre', 'Completion by chapter')}
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={chapterCompletionData}
                    margin={{ top: 5, right: 10, bottom: 5, left: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: 10,
                        fill: 'var(--text-muted)',
                      }}
                      axisLine={{ stroke: 'var(--border)' }}
                      tickLine={false}
                      interval={0}
                      angle={-35}
                      textAnchor="end"
                      height={50}
                    />
                    <YAxis
                      tick={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: 11,
                        fill: 'var(--text-muted)',
                      }}
                      axisLine={{ stroke: 'var(--border)' }}
                      tickLine={false}
                      domain={[0, 100]}
                      unit="%"
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="value" fill={PROGRAMME_COLORS.P1} maxBarSize={36} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Programme score chart */}
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
                  {t('Score moyen par programme', 'Average score by program')}
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={programmeScoreData}
                    margin={{ top: 5, right: 10, bottom: 5, left: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: 10,
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
                      domain={[0, 100]}
                      unit="%"
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="value" maxBarSize={48}>
                      {programmeScoreData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Activity heatmap */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                padding: 24,
                marginBottom: 40,
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
                {t('Heatmap d\'activite — 7 derniers jours', 'Activity heatmap — last 7 days')}
              </div>
              <div style={{ overflowX: 'auto' }}>
                <div style={{ minWidth: 600 }}>
                  {/* Hour labels */}
                  <div
                    style={{
                      display: 'flex',
                      marginLeft: 40,
                      marginBottom: 4,
                    }}
                  >
                    {Array.from({ length: 24 }, (_, h) => (
                      <div
                        key={h}
                        style={{
                          flex: 1,
                          textAlign: 'center',
                          fontFamily: 'var(--font-mono)',
                          fontSize: 9,
                          color: 'var(--text-muted)',
                        }}
                      >
                        {h % 3 === 0 ? `${h}h` : ''}
                      </div>
                    ))}
                  </div>
                  {/* Rows */}
                  {heatmapData.map((row) => (
                    <div
                      key={row.day}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: 2,
                      }}
                    >
                      <div
                        style={{
                          width: 40,
                          fontFamily: 'var(--font-mono)',
                          fontSize: 11,
                          color: 'var(--text-muted)',
                          textAlign: 'right',
                          paddingRight: 8,
                          flexShrink: 0,
                        }}
                      >
                        {row.day}
                      </div>
                      <div style={{ display: 'flex', flex: 1, gap: 1 }}>
                        {row.hours.map((value, h) => (
                          <div
                            key={h}
                            style={{
                              flex: 1,
                              height: 18,
                              background: 'var(--accent)',
                              opacity: 0.05 + value * 0.85,
                              transition: 'opacity 0.15s ease',
                            }}
                            title={`${row.day} ${h}h — ${t('activite', 'activity')}: ${Math.round(value * 100)}%`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                  {/* Legend */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: 6,
                      marginTop: 12,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        color: 'var(--text-muted)',
                      }}
                    >
                      {t('Moins', 'Less')}
                    </span>
                    {[0.1, 0.3, 0.5, 0.7, 0.9].map((v) => (
                      <div
                        key={v}
                        style={{
                          width: 14,
                          height: 14,
                          background: 'var(--accent)',
                          opacity: v,
                        }}
                      />
                    ))}
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        color: 'var(--text-muted)',
                      }}
                    >
                      {t('Plus', 'More')}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Students in difficulty */}
            {studentsInDifficulty.length > 0 && (
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
                  <AlertTriangle size={18} color="#e11d48" />
                  <h2
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 20,
                      fontWeight: 700,
                      margin: 0,
                    }}
                  >
                    {t('Etudiants en difficulte', 'Students in difficulty')}
                  </h2>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 12,
                      color: 'var(--text-muted)',
                    }}
                  >
                    ({studentsInDifficulty.length})
                  </span>
                </div>

                <div
                  style={{
                    border: '1px solid var(--border)',
                    overflow: 'hidden',
                  }}
                >
                  {/* Table header */}
                  <div
                    className="trainer-diff-header"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1.2fr 100px 120px 120px',
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
                    <div>{t('Nom', 'Name')}</div>
                    <div>Email</div>
                    <div style={{ textAlign: 'right' }}>{t('Moy. quiz', 'Quiz avg.')}</div>
                    <div style={{ textAlign: 'right' }}>{t('Cours', 'Courses')}</div>
                    <div style={{ textAlign: 'right' }}>{t('Derniere activite', 'Last activity')}</div>
                  </div>

                  {/* Table rows */}
                  {studentsInDifficulty.map((student, index) => (
                    <div
                      key={student.id}
                      className="trainer-diff-row"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1.2fr 100px 120px 120px',
                        padding: '14px 20px',
                        background:
                          index % 2 === 0
                            ? 'var(--bg-secondary)'
                            : 'var(--bg-primary)',
                        borderBottom:
                          index < studentsInDifficulty.length - 1
                            ? '1px solid var(--border)'
                            : 'none',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: 'var(--text-primary)',
                        }}
                      >
                        {student.name}
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 12,
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {student.email}
                      </div>
                      <div
                        style={{
                          textAlign: 'right',
                          fontFamily: 'var(--font-mono)',
                          fontSize: 14,
                          fontWeight: 600,
                          color: '#e11d48',
                        }}
                      >
                        {student.avgQuizScore}%
                      </div>
                      <div
                        style={{
                          textAlign: 'right',
                          fontFamily: 'var(--font-mono)',
                          fontSize: 13,
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {student.coursesCompleted}/32
                      </div>
                      <div
                        style={{
                          textAlign: 'right',
                          fontFamily: 'var(--font-mono)',
                          fontSize: 12,
                          color: 'var(--text-muted)',
                        }}
                      >
                        {formatRelative(student.lastActive)}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}

        {/* Create cohort modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: 24,
              }}
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  width: '100%',
                  maxWidth: 500,
                  padding: 0,
                }}
              >
                {/* Modal header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '20px 24px',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 18,
                      fontWeight: 700,
                      margin: 0,
                    }}
                  >
                    {t('Nouvelle cohorte', 'New cohort')}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-muted)',
                      padding: 4,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Modal body */}
                <div style={{ padding: 24 }}>
                  <div style={{ marginBottom: 20 }}>
                    <label
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        marginBottom: 8,
                      }}
                    >
                      {t('Nom de la cohorte', 'Cohort name')}
                    </label>
                    <input
                      type="text"
                      value={newCohortName}
                      onChange={(e) => setNewCohortName(e.target.value)}
                      placeholder={t('Ex: BTS SIO 2025-2026', 'E.g.: CCNA Cohort 2025-2026')}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-body)',
                        fontSize: 14,
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <label
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        marginBottom: 8,
                      }}
                    >
                      {t('Emails des etudiants (un par ligne)', 'Student emails (one per line)')}
                    </label>
                    <textarea
                      value={newCohortEmails}
                      onChange={(e) => setNewCohortEmails(e.target.value)}
                      placeholder={t('etudiant1@example.com\netudiant2@example.com\netudiant3@example.com', 'student1@example.com\nstudent2@example.com\nstudent3@example.com')}
                      rows={6}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 12,
                        outline: 'none',
                        resize: 'vertical',
                        lineHeight: 1.6,
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {/* Modal actions */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: 10,
                    }}
                  >
                    <button
                      onClick={() => setShowModal(false)}
                      style={{
                        background: 'none',
                        border: '1px solid var(--border)',
                        color: 'var(--text-secondary)',
                        padding: '10px 20px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 12,
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {t('Annuler', 'Cancel')}
                    </button>
                    <button
                      onClick={handleCreateCohort}
                      disabled={!newCohortName.trim()}
                      style={{
                        background: newCohortName.trim() ? 'var(--accent)' : 'var(--bg-tertiary)',
                        color: newCohortName.trim() ? '#080b1a' : 'var(--text-muted)',
                        border: 'none',
                        padding: '10px 20px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: newCohortName.trim() ? 'pointer' : 'not-allowed',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {t('Creer', 'Create')}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .trainer-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .trainer-charts-grid { grid-template-columns: 1fr !important; }
          .trainer-cohort-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .trainer-stats-grid { grid-template-columns: 1fr !important; }
          .trainer-cohort-grid { grid-template-columns: 1fr !important; }
          .trainer-diff-header,
          .trainer-diff-row {
            grid-template-columns: 1fr 1fr 80px !important;
          }
          .trainer-diff-header > div:nth-child(4),
          .trainer-diff-header > div:nth-child(5),
          .trainer-diff-row > div:nth-child(4),
          .trainer-diff-row > div:nth-child(5) {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
