import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Network, Container, BookOpen, ArrowRight } from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'
import { FORMATIONS, useFormationStore, type FormationType } from '../stores/formationStore'

export default function FormationSelector() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const setFormation = useFormationStore((s) => s.setFormation)

  const handleSelect = (formation: FormationType) => {
    setFormation(formation)
    navigate(`/${formation}`)
  }

  const cards: { formation: FormationType; icon: React.ReactNode }[] = [
    { formation: 'reseaux', icon: <Network size={40} /> },
    { formation: 'devops', icon: <Container size={40} /> },
  ]

  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 24px 120px' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: 60 }}
        >
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)',
            textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12,
          }}>
            {t('// choisir une formation', '// choose a program')}
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading)', fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 700, letterSpacing: '-1.5px', marginBottom: 12,
          }}>
            {t('Quelle formation ?', 'Which program?')}
          </h1>
          <p style={{
            fontSize: 16, color: 'var(--text-secondary)', fontWeight: 300,
            maxWidth: 480, margin: '0 auto',
          }}>
            {t(
              'Choisis ta formation pour acceder aux cours, quiz, examens et outils associes.',
              'Choose your program to access courses, quizzes, exams and associated tools.'
            )}
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }} className="formation-grid">
          {cards.map(({ formation, icon }, i) => {
            const meta = FORMATIONS[formation]
            const totalChapters = meta.programs.reduce((s, p) => s + p.chapterCount, 0)
            return (
              <motion.div
                key={formation}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
              >
                <button
                  onClick={() => handleSelect(formation)}
                  style={{
                    width: '100%', textAlign: 'left', cursor: 'pointer',
                    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                    padding: 0, position: 'relative', overflow: 'hidden',
                    transition: 'border-color 0.2s, transform 0.2s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = meta.accent;
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                  }}
                >
                  {/* Top accent bar */}
                  <div style={{ height: 3, background: meta.accent }} />

                  <div style={{ padding: '36px 32px 32px' }}>
                    <div style={{ color: meta.accent, marginBottom: 20 }}>{icon}</div>

                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: 11, color: meta.accent,
                      textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 10,
                    }}>
                      {t(meta.name, meta.nameEn)}
                    </div>

                    <h2 style={{
                      fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 700,
                      letterSpacing: '-0.5px', marginBottom: 12, color: 'var(--text-primary)',
                    }}>
                      {t(meta.name, meta.nameEn)}
                    </h2>

                    <p style={{
                      fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6,
                      marginBottom: 24, fontWeight: 300,
                    }}>
                      {t(meta.description, meta.descriptionEn)}
                    </p>

                    {/* Stats */}
                    <div style={{ display: 'flex', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <BookOpen size={14} style={{ color: meta.accent }} />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>
                          {totalChapters} {t('chapitres', 'chapters')}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>
                          {meta.programs.length} {t('programmes', 'programs')}
                        </span>
                      </div>
                    </div>

                    {/* Program colors preview */}
                    <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
                      {meta.programs.map(p => (
                        <div key={p.id} style={{
                          flex: 1, height: 4, background: p.color,
                        }} />
                      ))}
                    </div>

                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      padding: '10px 20px', background: meta.accent,
                      color: '#080b1a', fontSize: 14, fontWeight: 600,
                    }}>
                      {t('Commencer', 'Start')} <ArrowRight size={16} />
                    </div>
                  </div>
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .formation-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
