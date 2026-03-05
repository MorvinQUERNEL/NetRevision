import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  TrendingUp,
  Rocket,
  BookOpen,
  Target,
  ArrowRight,
  CheckCircle,
} from 'lucide-react'
import { useProgressStore, ProgressRecord } from '../stores/progressStore'
import { useChapters, useTranslation } from '../hooks/useTranslation'
import { useFormationStore } from '../stores/formationStore'
import type { Chapter } from '../data/chapters'

export default function AdaptivePath() {
  const { t } = useTranslation()
  const formation = useFormationStore((s) => s.currentFormation)
  const allChapters: Chapter[] = useChapters()
  const { records } = useProgressStore()

  const getRecord = (slug: string): ProgressRecord | undefined =>
    records.find((r) => r.chapterSlug === slug)

  const { urgent, reinforce, nextSteps, completedCount, allDone } = useMemo(() => {
    const urgentList: Chapter[] = []
    const reinforceList: Chapter[] = []
    const nextStepsList: Chapter[] = []
    let done = 0

    for (const ch of allChapters) {
      const rec = getRecord(ch.slug)

      if (!rec) {
        // No progress at all - next step
        nextStepsList.push(ch)
        continue
      }

      const quizScore = rec.quizScore
      const examScore = rec.examScore
      const examPassed = rec.examPassed
      const courseCompleted = rec.courseCompleted

      // Check if "done well" (score > 70 on quiz)
      if (quizScore !== null && quizScore > 70) {
        done++
        continue
      }

      // Urgent: quiz score < 50 OR exam attempted but not passed
      if (
        (quizScore !== null && quizScore < 50) ||
        (examScore !== null && examPassed === false)
      ) {
        urgentList.push(ch)
        continue
      }

      // Reinforce: quiz score 50-70, OR course completed but no quiz taken
      if (
        (quizScore !== null && quizScore >= 50 && quizScore <= 70) ||
        (courseCompleted && quizScore === null)
      ) {
        reinforceList.push(ch)
        continue
      }

      // Fallback: if there's some record but doesn't fit above, treat as reinforce
      reinforceList.push(ch)
    }

    const allCompleted =
      urgentList.length === 0 &&
      reinforceList.length === 0 &&
      nextStepsList.length === 0 &&
      done === allChapters.length

    return {
      urgent: urgentList,
      reinforce: reinforceList,
      nextSteps: nextStepsList,
      completedCount: done,
      allDone: allCompleted,
    }
  }, [records])

  const totalChapters = allChapters.length
  const progressPercent = Math.round((completedCount / totalChapters) * 100)

  const getScoreColor = (score: number | null): string => {
    if (score === null) return 'var(--text-muted)'
    if (score < 50) return '#ef4444'
    if (score <= 70) return '#f59e0b'
    return 'var(--accent)'
  }

  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
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
            {t('// parcours adaptatif', '// adaptive path')}
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
            {t('Mon Parcours Personnalise', 'My Personalized Path')}
          </h1>
          <p
            style={{
              fontSize: 15,
              color: 'var(--text-secondary)',
              fontWeight: 300,
              maxWidth: 700,
              lineHeight: 1.6,
            }}
          >
            {t('Cette page analyse votre progression pour vous recommander quoi reviser en priorite. Les chapitres sont classes selon vos scores aux quiz et examens.', 'This page analyzes your progress to recommend what to review first. Chapters are ranked based on your quiz and exam scores.')}
          </p>
        </div>

        {/* Global progress bar */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            padding: 24,
            marginBottom: 48,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 16,
                fontWeight: 600,
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Target size={18} style={{ color: 'var(--accent)' }} />
              {t('Progression globale', 'Overall progress')}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 14,
                color: 'var(--accent)',
              }}
            >
              {completedCount}/{totalChapters} {t('chapitres', 'chapters')} — {progressPercent}%
            </div>
          </div>
          <div
            style={{
              height: 8,
              background: 'var(--border)',
              overflow: 'hidden',
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{
                height: '100%',
                background: 'var(--accent)',
              }}
            />
          </div>
        </div>

        {/* Congratulations state */}
        {allDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            style={{
              background: 'var(--bg-secondary)',
              border: '2px solid var(--accent)',
              padding: '60px 40px',
              textAlign: 'center',
            }}
          >
            <CheckCircle
              size={56}
              style={{ color: 'var(--accent)', marginBottom: 20 }}
            />
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 26,
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: 12,
              }}
            >
              {t('Felicitations !', 'Congratulations!')}
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 15,
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                maxWidth: 500,
                margin: '0 auto 24px',
              }}
            >
              {t("Vous avez complete tous les chapitres avec un score superieur a 70%. Votre maitrise des reseaux est solide. Continuez a vous entrainer avec les examens finaux et le simulateur CLI !", 'You have completed all chapters with a score above 70%. Your networking skills are solid. Keep practicing with final exams and the CLI simulator!')}
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                to={`/${formation}/examens`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 13,
                  color: 'var(--bg-primary)',
                  background: 'var(--accent)',
                  padding: '10px 20px',
                  textDecoration: 'none',
                  border: 'none',
                }}
              >
                {t('Passer les examens', 'Take exams')} <ArrowRight size={14} />
              </Link>
              <Link
                to={`/${formation}/simulateur-cli`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 13,
                  color: 'var(--accent)',
                  background: 'transparent',
                  padding: '10px 20px',
                  textDecoration: 'none',
                  border: '1px solid var(--accent)',
                }}
              >
                {t('Simulateur CLI', 'CLI Simulator')} <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        )}

        {/* Section: A reviser en urgence */}
        {urgent.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 20,
              }}
            >
              <AlertTriangle size={20} style={{ color: '#ef4444' }} />
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#ef4444',
                  margin: 0,
                }}
              >
                {t('A reviser en urgence', 'Urgent review')}
              </h2>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: '#ef4444',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  padding: '2px 10px',
                }}
              >
                {urgent.length}
              </span>
            </div>
            <div className="adaptive-grid">
              {urgent.map((ch, index) => {
                const rec = getRecord(ch.slug)
                return (
                  <motion.div
                    key={ch.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderLeft: '3px solid #ef4444',
                      padding: 20,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        color: '#ef4444',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                      }}
                    >
                      {t('Chapitre', 'Chapter')} {ch.id}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 15,
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                      }}
                    >
                      {ch.title}
                    </div>

                    {/* Score indicators */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {rec?.quizScore !== null && rec?.quizScore !== undefined && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            fontFamily: 'var(--font-mono)',
                            fontSize: 12,
                          }}
                        >
                          <span style={{ color: 'var(--text-muted)' }}>Quiz:</span>
                          <span
                            style={{
                              color: getScoreColor(rec.quizScore),
                              fontWeight: 600,
                            }}
                          >
                            {rec.quizScore}%
                          </span>
                          <div
                            style={{
                              flex: 1,
                              height: 3,
                              background: 'var(--border)',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                width: `${rec.quizScore}%`,
                                height: '100%',
                                background: getScoreColor(rec.quizScore),
                              }}
                            />
                          </div>
                        </div>
                      )}
                      {rec?.examScore !== null && rec?.examScore !== undefined && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            fontFamily: 'var(--font-mono)',
                            fontSize: 12,
                          }}
                        >
                          <span style={{ color: 'var(--text-muted)' }}>Exam:</span>
                          <span
                            style={{
                              color: rec.examPassed ? 'var(--accent)' : '#ef4444',
                              fontWeight: 600,
                            }}
                          >
                            {rec.examScore}%{' '}
                            {rec.examPassed ? '' : t('(echoue)', '(failed)')}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action links */}
                    <div
                      style={{
                        display: 'flex',
                        gap: 12,
                        marginTop: 'auto',
                        paddingTop: 8,
                        borderTop: '1px solid var(--border)',
                      }}
                    >
                      <Link
                        to={`/${formation}/cours/${ch.slug}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          fontFamily: 'var(--font-mono)',
                          fontSize: 12,
                          color: 'var(--accent)',
                          textDecoration: 'none',
                        }}
                      >
                        <BookOpen size={13} /> {t('Revoir le cours', 'Review course')}
                      </Link>
                      <Link
                        to={`/${formation}/quiz/${ch.slug}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          fontFamily: 'var(--font-mono)',
                          fontSize: 12,
                          color: '#ef4444',
                          textDecoration: 'none',
                        }}
                      >
                        <Target size={13} /> {t('Refaire le quiz', 'Retake quiz')}
                      </Link>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {/* Section: A renforcer */}
        {reinforce.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 20,
              }}
            >
              <TrendingUp size={20} style={{ color: '#f59e0b' }} />
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#f59e0b',
                  margin: 0,
                }}
              >
                {t('A renforcer', 'Needs reinforcement')}
              </h2>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: '#f59e0b',
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '2px 10px',
                }}
              >
                {reinforce.length}
              </span>
            </div>
            <div className="adaptive-grid">
              {reinforce.map((ch, index) => {
                const rec = getRecord(ch.slug)
                const hasQuiz = rec?.quizScore !== null && rec?.quizScore !== undefined
                return (
                  <motion.div
                    key={ch.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      borderLeft: '3px solid #f59e0b',
                      padding: 20,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        color: '#f59e0b',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                      }}
                    >
                      {t('Chapitre', 'Chapter')} {ch.id}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 15,
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                      }}
                    >
                      {ch.title}
                    </div>

                    {/* Status / Score */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {hasQuiz ? (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            fontFamily: 'var(--font-mono)',
                            fontSize: 12,
                          }}
                        >
                          <span style={{ color: 'var(--text-muted)' }}>Quiz:</span>
                          <span
                            style={{
                              color: getScoreColor(rec!.quizScore),
                              fontWeight: 600,
                            }}
                          >
                            {rec!.quizScore}%
                          </span>
                          <div
                            style={{
                              flex: 1,
                              height: 3,
                              background: 'var(--border)',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                width: `${rec!.quizScore}%`,
                                height: '100%',
                                background: getScoreColor(rec!.quizScore),
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 12,
                            color: '#f59e0b',
                          }}
                        >
                          {t('Cours termine — quiz non effectue', 'Course completed — quiz not taken')}
                        </div>
                      )}
                    </div>

                    {/* Action links */}
                    <div
                      style={{
                        display: 'flex',
                        gap: 12,
                        marginTop: 'auto',
                        paddingTop: 8,
                        borderTop: '1px solid var(--border)',
                      }}
                    >
                      <Link
                        to={`/${formation}/cours/${ch.slug}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          fontFamily: 'var(--font-mono)',
                          fontSize: 12,
                          color: 'var(--accent)',
                          textDecoration: 'none',
                        }}
                      >
                        <BookOpen size={13} /> {t('Revoir le cours', 'Review course')}
                      </Link>
                      <Link
                        to={`/${formation}/quiz/${ch.slug}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          fontFamily: 'var(--font-mono)',
                          fontSize: 12,
                          color: '#f59e0b',
                          textDecoration: 'none',
                        }}
                      >
                        <Target size={13} /> {hasQuiz ? t('Ameliorer le score', 'Improve score') : t('Passer le quiz', 'Take the quiz')}
                      </Link>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {/* Section: Prochaines etapes */}
        {nextSteps.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 20,
              }}
            >
              <Rocket size={20} style={{ color: 'var(--accent)' }} />
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 20,
                  fontWeight: 700,
                  color: 'var(--accent)',
                  margin: 0,
                }}
              >
                {t('Prochaines etapes', 'Next steps')}
              </h2>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: 'var(--accent)',
                  background: 'rgba(0, 229, 160, 0.1)',
                  border: '1px solid rgba(0, 229, 160, 0.3)',
                  padding: '2px 10px',
                }}
              >
                {nextSteps.length}
              </span>
            </div>
            <div className="adaptive-grid">
              {nextSteps.map((ch, index) => (
                <motion.div
                  key={ch.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    borderLeft: '3px solid var(--accent)',
                    padding: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: 'var(--accent)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    Chapitre {ch.id}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 15,
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {ch.title}
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 13,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    {ch.subtitle}
                  </p>

                  {/* Metadata */}
                  <div
                    style={{
                      display: 'flex',
                      gap: 12,
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--text-muted)',
                    }}
                  >
                    <span>{ch.duration}</span>
                    <span>{ch.level}</span>
                  </div>

                  {/* Action link */}
                  <div
                    style={{
                      marginTop: 'auto',
                      paddingTop: 8,
                      borderTop: '1px solid var(--border)',
                    }}
                  >
                    <Link
                      to={`/${formation}/cours/${ch.slug}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        fontFamily: 'var(--font-mono)',
                        fontSize: 12,
                        color: 'var(--accent)',
                        textDecoration: 'none',
                      }}
                    >
                      {t('Commencer', 'Start')} <ArrowRight size={13} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state when no sections to show but not all done */}
        {!allDone && urgent.length === 0 && reinforce.length === 0 && nextSteps.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: 14,
            }}
          >
            {t('Chargement de votre progression...', 'Loading your progress...')}
          </div>
        )}
      </div>

      <style>{`
        .adaptive-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
        }
        @media (max-width: 1024px) {
          .adaptive-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .adaptive-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
