import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  Terminal,
  Calculator,
  Layers,
  Trophy,
  Target,
  Code2,
  Database,
  Server,
  Globe,
  User,
} from 'lucide-react'
import SEO from '../components/SEO'
import { useTranslation } from '../hooks/useTranslation'

export default function AboutPage() {
  const { t } = useTranslation()

  const stats = [
    { value: '49', label: t('chapitres', 'chapters') },
    { value: '690+', label: t('QCM', 'MCQs') },
    { value: '6', label: t('examens finaux', 'final exams') },
    { value: '49', label: t('labs Cisco', 'Cisco labs') },
    { value: '28', label: 'badges' },
    { value: '149', label: t('termes glossaire', 'glossary terms') },
  ]

  const offerings = [
    { icon: <BookOpen size={20} />, title: t('Cours structures', 'Structured Courses'), desc: t('49 chapitres repartis en 6 programmes couvrant 100% du CCNA 200-301.', '49 chapters across 6 programs covering 100% of CCNA 200-301.') },
    { icon: <Brain size={20} />, title: t('Quiz interactifs', 'Interactive Quizzes'), desc: t('690+ questions QCM avec corrections detaillees, examens finaux et quiz aleatoires.', '690+ MCQ questions with detailed corrections, final exams and random quizzes.') },
    { icon: <Terminal size={20} />, title: t('Simulateur CLI Cisco', 'Cisco CLI Simulator'), desc: t('49 labs guides dans un terminal Cisco IOS interactif avec 5 modes de commande.', '49 guided labs in an interactive Cisco IOS terminal with 5 command modes.') },
    { icon: <Calculator size={20} />, title: t('Exercices subnetting', 'Subnetting Exercises'), desc: t('Problemes generes aleatoirement avec 3 niveaux de difficulte et timer integre.', 'Randomly generated problems with 3 difficulty levels and built-in timer.') },
    { icon: <Layers size={20} />, title: 'Flashcards', desc: t('Fiches de revision interactives pour consolider vos connaissances chapitre par chapitre.', 'Interactive flashcards to consolidate your knowledge chapter by chapter.') },
    { icon: <Trophy size={20} />, title: t('Systeme de gamification', 'Gamification System'), desc: t('Points, badges, classement, streaks et defis hebdomadaires pour rester motive.', 'Points, badges, leaderboard, streaks and weekly challenges to stay motivated.') },
  ]

  const techStack = [
    { icon: <Code2 size={18} />, name: 'React', desc: t('Interface utilisateur reactive', 'Reactive user interface') },
    { icon: <Globe size={18} />, name: 'TypeScript', desc: t('Typage statique et fiabilite', 'Static typing and reliability') },
    { icon: <Server size={18} />, name: 'Symfony', desc: t('API backend robuste', 'Robust backend API') },
    { icon: <Database size={18} />, name: 'MySQL', desc: t('Base de donnees relationnelle', 'Relational database') },
  ]
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'NetRevision',
    'url': 'https://netrevision.fr',
    'logo': 'https://netrevision.fr/logo-512.png',
    'description': 'Plateforme gratuite de revision interactive pour les reseaux informatiques et la certification CCNA',
    'founder': {
      '@type': 'Person',
      'name': 'Morvin Quernel',
      'url': 'https://netrevision.fr/auteur',
    },
    'foundingDate': '2025',
    'sameAs': [],
    'contactPoint': {
      '@type': 'ContactPoint',
      'email': 'contact@netrevision.fr',
      'contactType': 'customer service',
    },
  }

  return (
    <div style={{ paddingTop: 56, minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <SEO
        title={t('A propos', 'About')}
        description={t('Decouvrez NetRevision, la plateforme gratuite de revision interactive dediee aux reseaux informatiques et a la certification CCNA. 49 chapitres, 690+ QCM, simulateur Cisco et plus.', 'Discover NetRevision, the free interactive study platform dedicated to computer networks and CCNA certification. 49 chapters, 690+ MCQs, Cisco simulator and more.')}
        url="/a-propos"
        jsonLd={jsonLd}
      />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px 80px' }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          {/* Back link */}
          <Link to="/" style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
            <ArrowLeft size={14} /> {t('retour', 'back')}
          </Link>

          {/* Header */}
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12 }}>
            {t('// a propos', '// about')}
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px, 5vw, 38px)', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 16 }}>
            {t('A propos de', 'About')} <span style={{ color: 'var(--accent)' }}>NetRevision</span>
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 640, fontWeight: 300, marginBottom: 48 }}>
            {t('La plateforme gratuite pour maitriser les reseaux informatiques et preparer la certification CCNA.', 'The free platform to master computer networks and prepare for CCNA certification.')}
          </p>

          {/* Mission */}
          <section style={{ marginBottom: 48 }}>
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: 32, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--accent)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <Target size={20} style={{ color: 'var(--accent)' }} />
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 600 }}>{t('Notre mission', 'Our Mission')}</h2>
              </div>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8, fontWeight: 300 }}>
                {t('NetRevision est une plateforme gratuite de revision interactive dediee a la preparation des certifications et examens reseaux, notamment le CCNA. Creee par', 'NetRevision is a free interactive study platform dedicated to preparing for network certifications and exams, especially CCNA. Created by')} <strong style={{ color: 'var(--text-primary)' }}>Morvin Quernel</strong>{t(", passionne de reseaux et d'enseignement, la plateforme a pour objectif de rendre l'apprentissage des reseaux informatiques accessible, structure et engageant pour tous.", ', passionate about networking and teaching, the platform aims to make learning about computer networks accessible, structured and engaging for everyone.')}
              </p>
            </div>
          </section>

          {/* Key stats */}
          <section style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 16 }}>
              {t('// chiffres cles', '// key figures')}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }} className="about-stats-grid">
              {stats.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    padding: '20px 16px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: 'var(--accent)', marginBottom: 4 }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* What we offer */}
          <section style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12 }}>
              {t('// ce que nous proposons', '// what we offer')}
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 24 }}>
              {t('Tout pour reussir vos certifications', 'Everything to pass your certifications')}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }} className="about-offerings-grid">
              {offerings.map((o, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    padding: 24,
                  }}
                >
                  <div style={{ color: 'var(--accent)', marginBottom: 12 }}>{o.icon}</div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{o.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, fontWeight: 300 }}>{o.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Technology */}
          <section style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12 }}>
              {t('// technologies', '// technologies')}
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 24 }}>
              {t('Stack technique', 'Tech Stack')}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }} className="about-tech-grid">
              {techStack.map((tech, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    padding: '20px 16px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ color: 'var(--accent)', marginBottom: 10, display: 'flex', justifyContent: 'center' }}>{tech.icon}</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{tech.name}</div>
                  <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{tech.desc}</div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Author CTA */}
          <section>
            <Link to="/auteur" style={{ display: 'block' }}>
              <motion.div
                whileHover={{ borderColor: 'var(--accent)' }}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  padding: '24px 28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <User size={18} style={{ color: 'var(--accent)' }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 600, marginBottom: 2 }}>
                      Morvin Quernel
                    </div>
                    <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {t('Createur de NetRevision — En savoir plus', 'Creator of NetRevision — Learn more')}
                    </div>
                  </div>
                </div>
                <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
              </motion.div>
            </Link>
          </section>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .about-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .about-offerings-grid { grid-template-columns: 1fr !important; }
          .about-tech-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  )
}
