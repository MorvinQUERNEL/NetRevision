import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
} from 'recharts'
import { BarChart3, TrendingUp, Clock, Award, BookOpen } from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'
import { useChapters, useChaptersByProgram } from '../hooks/useTranslation'
import { useLangStore } from '../stores/langStore'

const PROGRAMME_COLORS: Record<string, string> = {
  P1: '#00e5a0',
  P2: '#6366f1',
  P3: '#f59e0b',
  P4: '#e11d48',
}

const DAYS_FR = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const DAYS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function getProgramme(chapterId: number): 'P1' | 'P2' | 'P3' | 'P4' {
  if (chapterId <= 8) return 'P1'
  if (chapterId <= 16) return 'P2'
  if (chapterId <= 24) return 'P3'
  return 'P4'
}

function getShortName(title: string): string {
  const map: Record<string, string> = {
    'Le Modele OSI': 'OSI',
    'IPv4 & IPv6': 'IPv4/6',
    'VLAN, Trunk, VTP & STP': 'VLAN',
    'Domaines de broadcast & collision': 'Broadcast',
    'Routage statique': 'R.Stat',
    'Classes & Subnetting': 'Subnet',
    'Ping, ICMP & ARP': 'ICMP',
    'DNS & DHCP': 'DNS',
    'TCP & UDP': 'TCP/UDP',
    'Routage dynamique (RIP, OSPF)': 'OSPF',
    'ACL - Access Control Lists': 'ACL',
    'NAT & PAT': 'NAT',
    'Securite Wi-Fi': 'WiFi',
    'VPN & Tunneling': 'VPN',
    'Supervision SNMP': 'SNMP',
    'Depannage reseau': 'Debug',
  }
  return map[title] || title.split(' ')[0].substring(0, 6)
}

function parseDuration(dur: string): number {
  const match = dur.match(/(\d+)/)
  return match ? parseInt(match[1], 10) : 40
}

// Custom tooltip for recharts
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        padding: '8px 12px',
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
      }}
    >
      <div style={{ color: 'var(--text-primary)', marginBottom: 4 }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.fill || p.color, fontSize: 11 }}>
          Score: {p.value}%
        </div>
      ))}
    </div>
  )
}

// Heatmap cell component
function HeatmapCell({
  date,
  count,
  size,
}: {
  date: Date
  count: number
  size: number
}) {
  const [hovered, setHovered] = useState(false)

  const getColor = (c: number) => {
    if (c === 0) return 'var(--bg-tertiary)'
    if (c === 1) return 'rgba(0, 229, 160, 0.25)'
    if (c === 2) return 'rgba(0, 229, 160, 0.5)'
    if (c <= 4) return 'rgba(0, 229, 160, 0.7)'
    return '#00e5a0'
  }

  const lang = useLangStore((s) => s.lang)
  const dateStr = date.toLocaleDateString(lang === 'en' ? 'en-US' : 'fr-FR', {
    day: 'numeric',
    month: 'short',
  })

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative' }}
    >
      <div
        style={{
          width: size,
          height: size,
          background: getColor(count),
          border: '1px solid var(--border)',
          transition: 'transform 0.15s ease',
          transform: hovered ? 'scale(1.2)' : 'scale(1)',
          cursor: 'default',
        }}
      />
      {hovered && (
        <div
          style={{
            position: 'absolute',
            bottom: size + 6,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            padding: '4px 8px',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          {dateStr} — {count} {lang === 'en' ? (count !== 1 ? 'activities' : 'activity') : (count !== 1 ? 'activites' : 'activite')}
        </div>
      )}
    </div>
  )
}

export default function Analytics() {
  const lang = useLangStore((s) => s.lang)
  const t = (fr: string, en: string) => lang === 'en' ? en : fr
  const allChapters = useChapters()
  const { chapters: p1Chapters, chapters2: p2Chapters, chapters3: p3Chapters, chapters4: p4Chapters } = useChaptersByProgram()
  const DAYS = lang === 'en' ? DAYS_EN : DAYS_FR
  const records = useProgressStore((s) => s.records)

  // --- Computed stats ---
  const stats = useMemo(() => {
    const completedCourses = records.filter((r) => r.courseCompleted).length
    const quizzesWithScore = records.filter((r) => r.quizScore !== null)
    const avgQuizScore =
      quizzesWithScore.length > 0
        ? Math.round(
            quizzesWithScore.reduce((s, r) => s + (r.quizScore || 0), 0) /
              quizzesWithScore.length
          )
        : 0

    const totalStudyMinutes = allChapters.reduce((total, ch) => {
      const record = records.find((r) => r.chapterSlug === ch.slug)
      if (record?.courseCompleted) {
        return total + parseDuration(ch.duration)
      }
      return total
    }, 0)

    const examsWithScore = records.filter((r) => r.examScore !== null)
    const examsPassed = examsWithScore.filter((r) => r.examPassed).length
    const examPassRate =
      examsWithScore.length > 0
        ? Math.round((examsPassed / examsWithScore.length) * 100)
        : 0

    return {
      completedCourses,
      avgQuizScore,
      totalStudyMinutes,
      examPassRate,
      examsWithScore: examsWithScore.length,
    }
  }, [records])

  // --- Quiz scores chart data ---
  const quizChartData = useMemo(() => {
    return allChapters.map((ch) => {
      const record = records.find((r) => r.chapterSlug === ch.slug)
      const prog = getProgramme(ch.id)
      return {
        name: getShortName(ch.title),
        score: record?.quizScore ?? 0,
        programme: prog,
        fill: PROGRAMME_COLORS[prog],
        hasScore: record?.quizScore !== null && record?.quizScore !== undefined,
      }
    })
  }, [records])

  // --- Activity heatmap data ---
  const heatmapData = useMemo(() => {
    const now = new Date()
    const weeks = 12
    const grid: { date: Date; count: number }[][] = []

    // Build a map of date -> activity count from updatedAt
    const activityMap = new Map<string, number>()
    records.forEach((r) => {
      if (r.updatedAt) {
        const d = new Date(r.updatedAt)
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
        activityMap.set(key, (activityMap.get(key) || 0) + 1)
      }
      if (r.quizCompletedAt) {
        const d = new Date(r.quizCompletedAt)
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
        activityMap.set(key, (activityMap.get(key) || 0) + 1)
      }
      if (r.examCompletedAt) {
        const d = new Date(r.examCompletedAt)
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
        activityMap.set(key, (activityMap.get(key) || 0) + 1)
      }
    })

    // Find the most recent Monday as the start of the current week
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const dayOfWeek = today.getDay()
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    const currentMonday = new Date(today)
    currentMonday.setDate(today.getDate() + mondayOffset)

    // Go back 11 more weeks to get 12 total
    const startMonday = new Date(currentMonday)
    startMonday.setDate(currentMonday.getDate() - (weeks - 1) * 7)

    for (let w = 0; w < weeks; w++) {
      const week: { date: Date; count: number }[] = []
      for (let d = 0; d < 7; d++) {
        const date = new Date(startMonday)
        date.setDate(startMonday.getDate() + w * 7 + d)
        const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
        const count = date <= today ? (activityMap.get(key) || 0) : -1
        week.push({ date, count })
      }
      grid.push(week)
    }

    return grid
  }, [records])

  // --- Programme completion data for PieChart ---
  const programmeData = useMemo(() => {
    const programmes = [
      { name: t('Programme 1', 'Program 1'), chapters: p1Chapters, color: PROGRAMME_COLORS.P1 },
      { name: t('Programme 2', 'Program 2'), chapters: p2Chapters, color: PROGRAMME_COLORS.P2 },
      { name: t('Programme 3', 'Program 3'), chapters: p3Chapters, color: PROGRAMME_COLORS.P3 },
      { name: t('Programme 4', 'Program 4'), chapters: p4Chapters, color: PROGRAMME_COLORS.P4 },
    ]

    return programmes.map((p) => {
      const completed = p.chapters.filter((ch) =>
        records.find((r) => r.chapterSlug === ch.slug && r.courseCompleted)
      ).length
      const pct = Math.round((completed / p.chapters.length) * 100)
      return {
        name: p.name,
        value: pct,
        completed,
        total: p.chapters.length,
        color: p.color,
      }
    })
  }, [records])

  // --- Format study time ---
  const studyTimeLabel = useMemo(() => {
    const h = Math.floor(stats.totalStudyMinutes / 60)
    const m = stats.totalStudyMinutes % 60
    if (h === 0) return `${m} min`
    return m > 0 ? `${h}h ${m}min` : `${h}h`
  }, [stats.totalStudyMinutes])

  const cellSize = 16

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
            // analytics
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
            {t('Mes Statistiques Detaillees', 'My Detailed Statistics')}
          </h1>
          <p
            style={{
              fontSize: 15,
              color: 'var(--text-secondary)',
              fontWeight: 300,
            }}
          >
            {t("Vue d'ensemble de ta progression, tes scores et ton activite sur la plateforme.", "Overview of your progress, scores and activity on the platform.")}
          </p>
        </motion.div>

        {/* Stats cards row */}
        <div
          className="analytics-stats-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 2,
            marginBottom: 40,
          }}
        >
          {[
            {
              icon: <BookOpen size={20} />,
              label: t('Chapitres completes', 'Chapters completed'),
              value: `${stats.completedCourses}/${allChapters.length}`,
              color: PROGRAMME_COLORS.P1,
            },
            {
              icon: <TrendingUp size={20} />,
              label: t('Score moyen quiz', 'Average quiz score'),
              value: `${stats.avgQuizScore}%`,
              color: PROGRAMME_COLORS.P2,
            },
            {
              icon: <Clock size={20} />,
              label: t("Temps estime d'etude", 'Estimated study time'),
              value: studyTimeLabel,
              color: PROGRAMME_COLORS.P3,
            },
            {
              icon: <Award size={20} />,
              label: t('Taux de reussite examens', 'Exam pass rate'),
              value: stats.examsWithScore > 0 ? `${stats.examPassRate}%` : '--',
              color: '#ef4444',
            },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                padding: 20,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `${card.color}15`,
                    border: `1px solid ${card.color}30`,
                    color: card.color,
                  }}
                >
                  {card.icon}
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {card.label}
                </span>
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 28,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}
              >
                {card.value}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quiz scores chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            padding: 24,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 20,
            }}
          >
            <BarChart3 size={18} color="var(--accent)" />
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 18,
                fontWeight: 600,
                margin: 0,
              }}
            >
              {t('Scores des quiz par chapitre', 'Quiz scores by chapter')}
            </h2>
          </div>

          {/* Legend */}
          <div
            style={{
              display: 'flex',
              gap: 20,
              marginBottom: 16,
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
            }}
          >
            {[
              { label: t('Programme 1', 'Program 1'), color: PROGRAMME_COLORS.P1 },
              { label: t('Programme 2', 'Program 2'), color: PROGRAMME_COLORS.P2 },
              { label: t('Programme 3', 'Program 3'), color: PROGRAMME_COLORS.P3 },
              { label: t('Programme 4', 'Program 4'), color: PROGRAMME_COLORS.P4 },
            ].map((l) => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    background: l.color,
                  }}
                />
                <span style={{ color: 'var(--text-secondary)' }}>{l.label}</span>
              </div>
            ))}
          </div>

          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={quizChartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}
                  axisLine={{ stroke: 'var(--border)' }}
                  tickLine={false}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}
                  axisLine={{ stroke: 'var(--border)' }}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <ReferenceLine
                  y={70}
                  stroke="#ef4444"
                  strokeDasharray="6 4"
                  label={{
                    value: t('Seuil 70%', 'Threshold 70%'),
                    position: 'right',
                    fill: '#ef4444',
                    fontSize: 10,
                    fontFamily: 'var(--font-mono)',
                  }}
                />
                <Bar dataKey="score" maxBarSize={24}>
                  {quizChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.hasScore ? entry.fill : 'var(--bg-tertiary)'}
                      opacity={entry.hasScore ? 1 : 0.3}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Two-column row: Heatmap + Pie chart */}
        <div
          className="analytics-two-col"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 2,
            marginBottom: 40,
          }}
        >
          {/* Activity heatmap */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              padding: 24,
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 20,
                margin: '0 0 20px 0',
              }}
            >
              {t('Activite des 12 dernieres semaines', 'Activity over the last 12 weeks')}
            </h2>

            {/* Day labels + grid */}
            <div style={{ display: 'flex', gap: 4 }}>
              {/* Day labels column */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                  marginRight: 4,
                }}
              >
                {DAYS.map((day) => (
                  <div
                    key={day}
                    style={{
                      height: cellSize,
                      display: 'flex',
                      alignItems: 'center',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 9,
                      color: 'var(--text-muted)',
                      width: 24,
                    }}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Week columns */}
              {heatmapData.map((week, wIndex) => (
                <div
                  key={wIndex}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                  }}
                >
                  {week.map((cell, dIndex) => (
                    <div key={dIndex}>
                      {cell.count >= 0 ? (
                        <HeatmapCell
                          date={cell.date}
                          count={cell.count}
                          size={cellSize}
                        />
                      ) : (
                        <div
                          style={{
                            width: cellSize,
                            height: cellSize,
                            background: 'transparent',
                            border: '1px solid transparent',
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Heatmap legend */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                marginTop: 12,
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--text-muted)',
              }}
            >
              <span>{t('Moins', 'Less')}</span>
              {[0, 1, 2, 3, 5].map((level) => (
                <div
                  key={level}
                  style={{
                    width: 12,
                    height: 12,
                    background:
                      level === 0
                        ? 'var(--bg-tertiary)'
                        : level === 1
                        ? 'rgba(0, 229, 160, 0.25)'
                        : level === 2
                        ? 'rgba(0, 229, 160, 0.5)'
                        : level === 3
                        ? 'rgba(0, 229, 160, 0.7)'
                        : '#00e5a0',
                    border: '1px solid var(--border)',
                  }}
                />
              ))}
              <span>{t('Plus', 'More')}</span>
            </div>
          </motion.div>

          {/* Progress by programme - PieChart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              padding: 24,
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 18,
                fontWeight: 600,
                margin: '0 0 20px 0',
              }}
            >
              {t('Progression par programme', 'Progress by program')}
            </h2>

            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={programmeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {programmeData.map((entry, index) => (
                      <Cell key={`pie-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null
                      const d = payload[0].payload
                      return (
                        <div
                          style={{
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border)',
                            padding: '8px 12px',
                            fontFamily: 'var(--font-mono)',
                            fontSize: 12,
                          }}
                        >
                          <div style={{ color: 'var(--text-primary)', marginBottom: 2 }}>
                            {d.name}
                          </div>
                          <div style={{ color: d.color, fontSize: 11 }}>
                            {d.completed}/{d.total} {lang === 'en' ? 'chapters' : 'chapitres'} ({d.value}%)
                          </div>
                        </div>
                      )
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Programme labels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
              {programmeData.map((p) => (
                <div
                  key={p.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        background: p.color,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 12,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {p.name}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 12,
                      fontWeight: 600,
                      color: p.color,
                    }}
                  >
                    {p.completed}/{p.total} ({p.value}%)
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Detailed chapter table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              padding: '20px 24px 12px',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 18,
                fontWeight: 600,
                margin: 0,
              }}
            >
              {t('Detail par chapitre', 'Detail by chapter')}
            </h2>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
              }}
            >
              <thead>
                <tr>
                  {['#', t('Chapitre', 'Chapter'), t('Prog.', 'Prog.'), t('Cours', 'Course'), 'Quiz', t('Examen', 'Exam'), 'Score'].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: (h === 'Chapitre' || h === 'Chapter') ? 'left' : 'center',
                          padding: '10px 12px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: 11,
                          fontWeight: 500,
                          color: 'var(--text-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          borderBottom: '1px solid var(--border)',
                        }}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {allChapters.map((ch, i) => {
                  const record = records.find((r) => r.chapterSlug === ch.slug)
                  const courseOk = record?.courseCompleted ?? false
                  const quizScore = record?.quizScore ?? null
                  const examScore = record?.examScore ?? null
                  const examPassed = record?.examPassed ?? false
                  const prog = getProgramme(ch.id)
                  const progColor = PROGRAMME_COLORS[prog]

                  return (
                    <motion.tr
                      key={ch.id}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.02 }}
                      style={{
                        borderBottom: '1px solid var(--border)',
                      }}
                    >
                      <td
                        style={{
                          textAlign: 'center',
                          padding: '10px 12px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: 12,
                          color: 'var(--text-muted)',
                        }}
                      >
                        {String(ch.id).padStart(2, '0')}
                      </td>
                      <td
                        style={{
                          padding: '10px 12px',
                          fontWeight: 500,
                          color: 'var(--text-primary)',
                          maxWidth: 260,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {ch.title}
                      </td>
                      <td style={{ textAlign: 'center', padding: '10px 12px' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 11,
                            fontWeight: 600,
                            color: progColor,
                            background: `${progColor}15`,
                            border: `1px solid ${progColor}30`,
                            padding: '2px 8px',
                          }}
                        >
                          {prog}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', padding: '10px 12px' }}>
                        {courseOk ? (
                          <span style={{ color: '#22c55e', fontSize: 16 }}>&#10003;</span>
                        ) : (
                          <span style={{ color: '#ef4444', fontSize: 16 }}>&#10007;</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'center', padding: '10px 12px' }}>
                        {quizScore !== null ? (
                          <span style={{ color: '#22c55e', fontSize: 16 }}>&#10003;</span>
                        ) : (
                          <span style={{ color: '#ef4444', fontSize: 16 }}>&#10007;</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'center', padding: '10px 12px' }}>
                        {examScore !== null ? (
                          <span
                            style={{
                              color: examPassed ? '#22c55e' : '#ef4444',
                              fontSize: 16,
                            }}
                          >
                            {examPassed ? '\u2713' : '\u2717'}
                          </span>
                        ) : (
                          <span style={{ color: '#ef4444', fontSize: 16 }}>&#10007;</span>
                        )}
                      </td>
                      <td
                        style={{
                          textAlign: 'center',
                          padding: '10px 12px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: 13,
                          fontWeight: 600,
                          color:
                            quizScore === null
                              ? 'var(--text-muted)'
                              : quizScore >= 70
                              ? '#22c55e'
                              : quizScore >= 50
                              ? '#f59e0b'
                              : '#ef4444',
                        }}
                      >
                        {quizScore !== null ? `${quizScore}%` : '--'}
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .analytics-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .analytics-two-col { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 520px) {
          .analytics-stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
