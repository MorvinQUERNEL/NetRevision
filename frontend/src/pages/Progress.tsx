import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { BookOpen, CheckCircle2, XCircle, ArrowRight, Star, ClipboardCheck, Download } from 'lucide-react'
import { exportProgressToCSV } from '../utils/csvExport'
import { useProgressStore } from '../stores/progressStore'
import { useAuthStore } from '../stores/authStore'
import { useTranslation, useChapters, useFormationFromUrl } from '../hooks/useTranslation'

export default function Progress() {
  const records = useProgressStore((s) => s.records)
  const user = useAuthStore((s) => s.user)
  const { t, lang } = useTranslation()
  const formation = useFormationFromUrl()
  const allChapters = useChapters()

  const completedCourses = records.filter((r) => r.courseCompleted).length
  const completedQuizzes = records.filter((r) => r.quizScore !== null).length
  const avgScore = completedQuizzes > 0
    ? Math.round(records.filter((r) => r.quizScore !== null).reduce((s, r) => s + (r.quizScore || 0), 0) / completedQuizzes)
    : 0
  const progressPercent = Math.round((completedCourses / allChapters.length) * 100)

  const getRecord = (slug: string) => records.find((r) => r.chapterSlug === slug)

  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px' }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12 }}>
            // {t('progression', 'progress')}
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 32, fontWeight: 700, letterSpacing: '-1px', marginBottom: 8 }}>
            {t('Ma progression', 'My progress')}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', fontWeight: 300, margin: 0 }}>
              {completedCourses}/{allChapters.length} {t('chapitres', 'chapters')} - {completedQuizzes} quiz ({t('moy.', 'avg.')} {avgScore}%) - {user?.totalPoints || 0} pts
            </p>
            <button onClick={() => exportProgressToCSV(records, allChapters)} style={{
              padding: '6px 14px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
              color: 'var(--accent)', fontSize: 12, fontWeight: 500, fontFamily: 'var(--font-mono)',
              display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
            }}>
              <Download size={13} /> {t('Exporter CSV', 'Export CSV')}
            </button>
          </div>
        </motion.div>

        {/* Global progress */}
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: 20, marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{t('Progression globale', 'Overall progress')}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--accent)' }}>{progressPercent}%</span>
          </div>
          <div style={{ height: 6, background: 'var(--bg-primary)', overflow: 'hidden' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ height: '100%', background: 'var(--accent)', boxShadow: progressPercent > 0 ? '0 0 10px var(--accent-glow)' : 'none' }}
            />
          </div>
        </div>

        {/* Chapter list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {allChapters.map((ch, i) => {
            const record = getRecord(ch.slug)
            const courseOk = record?.courseCompleted
            const quizScore = record?.quizScore

            return (
              <motion.div
                key={ch.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ borderColor: ch.color, x: 4 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px',
                  background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                  transition: 'border-color 0.2s, transform 0.2s',
                }}
              >
                <div style={{
                  width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `${ch.color}15`, border: `1px solid ${ch.color}30`, flexShrink: 0,
                }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: ch.color }}>
                    {String(ch.id).padStart(2, '0')}
                  </span>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{ch.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{ch.subtitle}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                  {/* Course status */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {courseOk ? <CheckCircle2 size={14} color="var(--success)" /> : <BookOpen size={14} color="var(--text-muted)" />}
                    <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: courseOk ? 'var(--success)' : 'var(--text-muted)' }}>
                      {t('Cours', 'Course')}
                    </span>
                  </div>

                  {/* Quiz status */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {quizScore !== null && quizScore !== undefined ? (
                      <>
                        <ClipboardCheck size={14} color={quizScore >= 70 ? 'var(--success)' : 'var(--accent-warm)'} />
                        <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: quizScore >= 70 ? 'var(--success)' : 'var(--accent-warm)' }}>
                          {quizScore}%
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle size={14} color="var(--text-muted)" />
                        <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Quiz</span>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <Link to={courseOk ? `/${formation}/quiz/${ch.slug}` : `/${formation}/cours/${ch.slug}`}>
                    <button style={{
                      padding: '5px 10px', fontSize: 11, fontWeight: 500,
                      background: courseOk ? 'transparent' : 'var(--accent)',
                      color: courseOk ? 'var(--accent)' : 'var(--bg-primary)',
                      border: courseOk ? '1px solid var(--border)' : 'none',
                      display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                      {courseOk ? 'Quiz' : t('Commencer', 'Start')} <ArrowRight size={12} />
                    </button>
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
