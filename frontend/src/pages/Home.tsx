import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, Brain, Award, Calculator, ClipboardCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation, useChapters, useChaptersByProgram, useFormationFromUrl } from '../hooks/useTranslation'
import ChapterCard from '../components/ChapterCard'
import NeonOrbs from '../components/NeonOrbs'
import { useProgressStore } from '../stores/progressStore'
import { FORMATIONS, getFormation, isValidFormation } from '../stores/formationStore'
import { getIcon } from '../utils/iconMap'

export default function Home() {
  const records = useProgressStore((s) => s.records)
  const { t } = useTranslation()
  const formation = useFormationFromUrl()
  const meta = FORMATIONS[formation]
  const config = isValidFormation(formation) ? getFormation(formation) : null
  const allChapters = useChapters()
  const { chapters, chapters2, chapters3, chapters4, chapters5, chapters6 } = useChaptersByProgram()
  const programChapters = [chapters, chapters2, chapters3, chapters4, chapters5, chapters6]

  const totalChapters = allChapters.length
  const features = [
    { icon: <BookOpen size={20} />, title: t(`${totalChapters} Chapitres complets`, `${totalChapters} Complete chapters`), desc: t(meta.description, meta.descriptionEn) },
    { icon: <Brain size={20} />, title: t('Questions QCM', 'MCQ Questions'), desc: t('Quiz, examens finaux et flashcards', 'Quizzes, final exams and flashcards') },
    { icon: <Calculator size={20} />, title: t('Outils interactifs', 'Interactive tools'), desc: t('Simulateur CLI et fiches de revision', 'CLI simulator and revision sheets') },
    { icon: <Award size={20} />, title: t('Badges & Classement', 'Badges & Ranking'), desc: t('Gamification complete et leaderboard', 'Full gamification and leaderboard') },
  ]

  const hasStarted = records.length > 0

  const getResumeSlug = () => {
    if (!hasStarted) return config?.defaultFirstChapterSlug || 'modele-osi'
    const sorted = [...records].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    const lastSlug = sorted[0]?.chapterSlug
    const lastChapter = allChapters.find(c => c.slug === lastSlug)
    if (lastChapter && records.some(r => r.chapterSlug === lastSlug && r.courseCompleted)) {
      const nextUncompleted = allChapters.find(c => !records.some(r => r.chapterSlug === c.slug && r.courseCompleted))
      if (nextUncompleted) return nextUncompleted.slug
    }
    return lastSlug || config?.defaultFirstChapterSlug || 'modele-osi'
  }

  const isChapterCompleted = (id: number) => {
    const ch = allChapters.find(c => c.id === id)
    if (!ch) return false
    return records.some(r => r.chapterSlug === ch.slug && r.courseCompleted)
  }

  return (
    <div style={{ paddingTop: 56 }}>
      {/* Hero */}
      <section style={{ position: 'relative', minHeight: '85vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <NeonOrbs color={meta.accent} intensity={0.5} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%', background: 'linear-gradient(to top, var(--bg-primary), transparent)', pointerEvents: 'none', zIndex: 1 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '30%', background: 'linear-gradient(to right, var(--bg-primary) 0%, transparent 100%)', pointerEvents: 'none', opacity: 0.5, zIndex: 1 }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px', width: '100%', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 80, alignItems: 'center', position: 'relative', zIndex: 2 }} className="hero-grid">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 12px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', marginBottom: 28, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)' }}>
              <span style={{ opacity: 0.5 }}>$</span> fundamentals --network
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(40px, 5.5vw, 64px)', fontWeight: 700, lineHeight: 1.05, marginBottom: 24, letterSpacing: '-2px' }}>
              {t('Apprends', 'Learn')}<br />
              <span style={{ color: meta.accent }}>{t(meta.name, meta.nameEn)}</span><br />
              <span style={{ color: 'var(--text-muted)', fontSize: '0.65em', fontWeight: 400, letterSpacing: '-1px' }}>{t('de zero a operationnel', 'from zero to operational')}</span>
            </h1>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 36, maxWidth: 440, fontWeight: 300 }}>
              {t(meta.description, meta.descriptionEn)} {t('Quiz, examens, simulateur CLI et progression sauvegardee.', 'Quizzes, exams, CLI simulator and saved progress.')}
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to={`/${formation}/cours/${getResumeSlug()}`}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: '12px 24px', background: 'var(--accent)', color: 'var(--bg-primary)',
                    fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8,
                    border: 'none', letterSpacing: '0.3px',
                    boxShadow: `0 0 25px var(--accent-glow)`,
                  }}
                >
                  {hasStarted ? t('Continuer les cours', 'Continue courses') : t('Commencer le cours', 'Start course')} <ArrowRight size={16} />
                </motion.button>
              </Link>
              <Link to={`/${formation}/dashboard`}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{ padding: '12px 24px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 500 }}
                >
                  {t('Mon dashboard', 'My dashboard')}
                </motion.button>
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="hero-visual">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              {(config?.heroVisualItems ?? [
                { icon: 'Monitor', label: 'OSI Model', sub: '7 couches', subEn: '7 layers', color: '#00e5a0' },
                { icon: 'Globe', label: 'IPv4 / IPv6', sub: 'Adressage', subEn: 'Addressing', color: '#3b82f6' },
                { icon: 'Shield', label: 'VLAN & STP', sub: 'Segmentation', subEn: 'Segmentation', color: '#f59e0b' },
                { icon: 'Terminal', label: 'DNS & DHCP', sub: 'Services', subEn: 'Services', color: '#a855f7' },
              ]).map((item, i) => {
                const HeroIcon = getIcon(item.icon)
                return { ...item, iconComp: <HeroIcon size={18} />, sub: t(item.sub, item.subEn) }
              }).map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  whileHover={{ borderColor: item.color, y: -2 }}
                  style={{
                    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                    padding: '20px 16px', position: 'relative', overflow: 'hidden',
                    transition: 'all 0.25s',
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: item.color }} />
                  <div style={{ color: item.color, marginBottom: 10 }}>{item.iconComp}</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{item.label}</div>
                  <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{item.sub}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }} className="stats-grid">
          {(config?.stats ?? [
            { value: '49', labelFr: 'chapitres', labelEn: 'chapters' },
            { value: '690+', labelFr: 'questions', labelEn: 'questions' },
            { value: '25h+', labelFr: 'de contenu', labelEn: 'of content' },
            { value: '100%', labelFr: 'gratuit', labelEn: 'free' },
          ]).map(s => ({ value: s.value, label: t(s.labelFr, s.labelEn) })).map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              style={{ padding: '24px 20px', textAlign: 'left', borderRight: i < 3 ? '1px solid var(--border)' : 'none' }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: 'var(--accent)', marginBottom: 2 }}>{s.value}</div>
              <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12 }}>{t('// fonctionnalités', '// features')}</div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 32, fontWeight: 700, letterSpacing: '-1px', marginBottom: 8 }}>{t('Tout ce qu\'il te faut', 'Everything you need')}</h2>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 420, fontWeight: 300 }}>{t('Une plateforme complète pour maîtriser les fondamentaux des réseaux informatiques.', 'A complete platform to master computer networking fundamentals.')}</p>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }} className="features-grid">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ borderColor: 'var(--accent)', y: -2 }}
              style={{
                background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: 24,
                transition: 'all 0.25s',
              }}
            >
              <div style={{ color: 'var(--accent)', marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, fontWeight: 300 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Dynamic Programs */}
      {meta.programs.map((prog, pIdx) => (
        <div key={prog.id}>
          <section id={`programme${pIdx + 1}`} style={{ maxWidth: 1200, margin: '0 auto', padding: pIdx === 0 ? '0 24px 80px' : '40px 24px 40px' }}>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 0, height: 24, borderLeft: `3px solid ${prog.color}`, transition: 'height 0.3s' }} />
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: prog.color, textTransform: 'uppercase', letterSpacing: '2px' }}>
                  {t(`// programme ${pIdx + 1} — ${prog.name.toLowerCase()}`, `// program ${pIdx + 1} — ${prog.nameEn.toLowerCase()}`)}
                </div>
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 32, fontWeight: 700, letterSpacing: '-1px', marginBottom: 8 }}>
                {t(`Programme ${pIdx + 1} — ${prog.name}`, `Program ${pIdx + 1} — ${prog.nameEn}`)}
              </h2>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 520, fontWeight: 300 }}>
                {t(prog.description, prog.descriptionEn)}
              </p>
            </motion.div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }}>
              {(programChapters[pIdx] || []).map((ch, i) => (
                <ChapterCard key={ch.id} chapter={ch} index={i} completed={isChapterCompleted(ch.id)} />
              ))}
            </div>
          </section>

          {/* Exam CTA */}
          <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 24px' }}>
            <Link to={`/${formation}/examen/${pIdx + 1}`}>
              <motion.div
                whileHover={{ borderColor: prog.color, x: 4 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '16px 24px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <ClipboardCheck size={18} color={prog.color} />
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 600 }}>{t(`Examen - Programme ${pIdx + 1}`, `Exam - Program ${pIdx + 1}`)}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>50 questions</span>
                </div>
                <ArrowRight size={16} color="var(--text-muted)" />
              </motion.div>
            </Link>
          </section>
        </div>
      ))}

      {/* Tools */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 80px' }}>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12 }}>{t('// outils', '// tools')}</div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 32, fontWeight: 700, letterSpacing: '-1px', marginBottom: 8 }}>{t('Outils de révision', 'Revision tools')}</h2>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }}>
          {(config?.tools ?? []).map((tool) => {
            const ToolIcon = getIcon(tool.icon)
            const toolColor = tool.color || 'var(--accent)'
            return (
              <Link key={tool.path} to={`/${formation}/${tool.path}`} style={{ display: 'block', height: '100%' }}>
                <motion.div
                  whileHover={{ borderColor: toolColor, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                    padding: 24, height: '100%', transition: 'all 0.25s',
                  }}
                >
                  <ToolIcon size={24} color={toolColor} style={{ marginBottom: 12 }} />
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: 17, fontWeight: 600, marginBottom: 6 }}>{t(tool.labelFr, tool.labelEn)}</div>
                  {tool.descriptionFr && <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 300 }}>{t(tool.descriptionFr, tool.descriptionEn || tool.descriptionFr)}</div>}
                </motion.div>
              </Link>
            )
          })}
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .hero-visual { display: none !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .features-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .features-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  )
}
