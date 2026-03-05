import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GraduationCap, AlertTriangle, ArrowRight, BookOpen, CheckCircle2, Shield, Clock } from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'
import { useTranslation, useChaptersByProgram, useFormationFromUrl } from '../hooks/useTranslation'
import { FORMATIONS } from '../stores/formationStore'

export default function Exams() {
  const { t } = useTranslation()
  const formation = useFormationFromUrl()
  const meta = FORMATIONS[formation]
  const records = useProgressStore((s) => s.records)
  const { chapters, chapters2, chapters3, chapters4, chapters5, chapters6 } = useChaptersByProgram()

  const getCompletion = (chapterList: typeof chapters) => {
    let done = 0
    for (const ch of chapterList) {
      const r = records.find((rec) => rec.chapterSlug === ch.slug)
      if (r && r.courseCompleted && r.quizScore !== null && r.quizScore >= 70) done++
    }
    return { done, total: chapterList.length, pct: Math.round((done / chapterList.length) * 100) }
  }

  const programChapters = [chapters, chapters2, chapters3, chapters4, chapters5, chapters6]
  const completions = programChapters.map(getCompletion)

  const exams = meta.programs.map((prog, i) => ({
    title: t(`Examen - Programme ${i + 1}`, `Exam - Program ${i + 1}`),
    subtitle: t(prog.name, prog.nameEn),
    description: t(prog.description, prog.descriptionEn),
    questions: 50,
    to: `/${formation}/examen/${i + 1}`,
    color: prog.color,
    completion: completions[i],
  }))

  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px 80px' }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)',
            textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12,
          }}>{t('// examens finaux', '// final exams')}</div>
          <h1 style={{
            fontFamily: 'var(--font-heading)', fontSize: 32, fontWeight: 700,
            letterSpacing: '-0.5px', marginBottom: 8,
          }}>{t('Examens', 'Exams')}</h1>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 32, lineHeight: 1.6 }}>
            {t('Teste tes connaissances avec les examens finaux de chaque programme.', 'Test your knowledge with the final exams for each program.')}
          </p>

          {/* Warning message */}
          <div style={{
            display: 'flex', gap: 14, padding: '16px 20px', marginBottom: 40,
            background: 'rgba(245, 158, 11, 0.06)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
          }}>
            <AlertTriangle size={20} style={{ color: 'var(--warning)', flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{
                fontSize: 14, fontWeight: 600, color: 'var(--warning)', marginBottom: 4,
              }}>{t('Recommandation', 'Recommendation')}</p>
              <p style={{
                fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0,
              }}>
                {t(
                  "Il est preferable de terminer 100% d'un programme (cours + quiz valides) avant de passer son examen final. Cela te donnera les meilleures chances de reussite.",
                  "It is recommended to complete 100% of a program (courses + quizzes passed) before taking the final exam. This will give you the best chances of success."
                )}
              </p>
            </div>
          </div>

          {/* Exam cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {exams.map((exam, i) => (
              <motion.div
                key={exam.to}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ borderColor: exam.color, boxShadow: `0 8px 30px ${exam.color}15` }}
                style={{
                  background: 'var(--bg-secondary)',
                  border: `1px solid var(--border)`,
                  padding: 28,
                  transition: 'border-color 0.2s, box-shadow 0.3s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 260 }}>
                      <div style={{
                        fontFamily: 'var(--font-mono)', fontSize: 11, color: exam.color,
                        textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 10,
                      }}>{exam.subtitle}</div>
                      <h2 style={{
                        fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700,
                        marginBottom: 10, letterSpacing: '-0.3px',
                      }}>{exam.title}</h2>
                      <p style={{
                        fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 20,
                      }}>{exam.description}</p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', marginBottom: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <GraduationCap size={14} style={{ color: exam.color }} />
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>
                            {exam.questions} questions
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <BookOpen size={14} style={{ color: exam.color }} />
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>
                            {exam.completion.total} {t('chapitres', 'chapters')}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <CheckCircle2 size={14} style={{ color: exam.completion.pct === 100 ? 'var(--success)' : 'var(--text-muted)' }} />
                          <span style={{
                            fontFamily: 'var(--font-mono)', fontSize: 12,
                            color: exam.completion.pct === 100 ? 'var(--success)' : 'var(--text-secondary)',
                          }}>
                            {exam.completion.done}/{exam.completion.total} {t('completes', 'completed')}
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div style={{ marginBottom: 24 }}>
                        <div style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6,
                        }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            {t('Progression programme', 'Program progress')}
                          </span>
                          <span style={{
                            fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600,
                            color: exam.completion.pct === 100 ? 'var(--success)' : exam.color,
                          }}>{exam.completion.pct}%</span>
                        </div>
                        <div style={{ height: 4, background: 'var(--border)', overflow: 'hidden' }}>
                          <div style={{
                            width: `${exam.completion.pct}%`, height: '100%',
                            background: exam.completion.pct === 100 ? 'var(--success)' : exam.color,
                            transition: 'width 0.6s ease',
                          }} />
                        </div>
                      </div>

                      <Link to={exam.to}>
                        <button style={{
                          padding: '12px 28px',
                          background: exam.color,
                          color: 'white',
                          fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-body)',
                          border: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                          transition: 'opacity 0.15s',
                        }}>
                          {t("Commencer l'examen", 'Start the exam')} <ArrowRight size={16} />
                        </button>
                      </Link>
                    </div>
                  </div>
              </motion.div>
            ))}

            {/* Examen Global */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div style={{
                background: 'var(--bg-secondary)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                padding: 28,
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                  background: 'linear-gradient(90deg, #6366f1, #ec4899, #f59e0b, #00e5a0)',
                }} />
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 260 }}>
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6366f1',
                      textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 10,
                    }}>{t('Tous programmes', 'All programs')}</div>
                    <h2 style={{
                      fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700,
                      marginBottom: 10, letterSpacing: '-0.3px',
                    }}>{t('Examen Global', 'Comprehensive Exam')}</h2>
                    <p style={{
                      fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 20,
                    }}>
                      {t(
                        'Examen complet couvrant les 6 programmes avec 8 types d\'exercices : QCM, multi-reponses, vrai/faux, reponse courte, association, ordonnancement, analyse de config et scenarios pratiques.',
                        'Comprehensive exam covering all 6 programs with 8 exercise types: MCQ, multiple-answer, true/false, short answer, matching, ordering, config analysis and practical scenarios.'
                      )}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', marginBottom: 20 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Shield size={14} style={{ color: '#6366f1' }} />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>
                          ~100 exercises
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Clock size={14} style={{ color: '#6366f1' }} />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>
                          ~2h
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <BookOpen size={14} style={{ color: '#6366f1' }} />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>
                          8 {t('types', 'types')}
                        </span>
                      </div>
                    </div>

                    <Link to={`/${formation}/examen-global`}>
                      <button style={{
                        padding: '12px 28px',
                        background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                        color: 'white',
                        fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-body)',
                        border: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                      }}>
                        {t("Commencer l'examen global", 'Start the comprehensive exam')} <ArrowRight size={16} />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
