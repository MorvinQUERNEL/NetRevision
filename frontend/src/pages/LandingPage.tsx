import { useEffect, useRef, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import {
  ArrowRight, BookOpen, Brain, Award, Terminal, Shield, Network, Gamepad2,
  BarChart3, GraduationCap, Layers, Calculator, Swords, Flag, Flame,
  Trophy, Star, Zap, Monitor, Globe, Users, Cpu
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useTranslation } from '../hooks/useTranslation'
import SEO from '../components/SEO'
import NeonOrbs from '../components/NeonOrbs'

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1800
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target])

  return <span ref={ref}>{count}{suffix}</span>
}

function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  )
}

const darkVars = {
  '--bg-primary': '#080b1a',
  '--bg-secondary': '#0f1328',
  '--bg-tertiary': '#161b35',
  '--accent': '#00e5a0',
  '--accent-hover': '#00ffb3',
  '--text-primary': '#e2e8f0',
  '--text-secondary': '#94a3b8',
  '--text-muted': '#475569',
  '--border': '#1e293b',
  '--font-heading': "'Space Grotesk', system-ui, sans-serif",
  '--font-body': "'Work Sans', system-ui, sans-serif",
  '--font-mono': "'JetBrains Mono', 'Fira Code', monospace",
} as React.CSSProperties

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore()
  const { t } = useTranslation()
  const [typedLine, setTypedLine] = useState(0)

  if (isAuthenticated) return <Navigate to="/formations" />

  // Terminal typing effect
  const terminalLines = [
    { prompt: 'Router>', cmd: ' enable', color: '#00e5a0' },
    { prompt: 'Router#', cmd: ' configure terminal', color: '#00e5a0' },
    { prompt: 'Router(config)#', cmd: ' interface GigabitEthernet0/1', color: '#f59e0b' },
    { prompt: 'Router(config-if)#', cmd: ' ip address 192.168.1.1 255.255.255.0', color: '#6366f1' },
    { prompt: 'Router(config-if)#', cmd: ' no shutdown', color: '#6366f1' },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setTypedLine(prev => (prev < terminalLines.length ? prev + 1 : prev))
    }, 600)
    return () => clearInterval(timer)
  }, [])

  const features = [
    { icon: <BookOpen size={24} />, title: t('87 Chapitres', '87 Chapters'), desc: t('2 formations completes : Reseaux/CCNA (49 chapitres) et Admin Systeme & DevOps (38 chapitres).', '2 complete courses: Networking/CCNA (49 chapters) and System Admin & DevOps (38 chapters).'), color: '#00e5a0' },
    { icon: <Brain size={24} />, title: t('1000+ QCM', '1000+ Quizzes'), desc: t('Quiz par chapitre, 12 examens finaux et examens globaux. Paris de points inclus.', 'Chapter quizzes, 12 final exams and global exams. Point betting included.'), color: '#6366f1' },
    { icon: <Terminal size={24} />, title: t('Simulateurs CLI', 'CLI Simulators'), desc: t('Terminal Cisco IOS et terminal Linux/Docker/Kubectl. Labs guides pour pratiquer les commandes.', 'Cisco IOS terminal and Linux/Docker/Kubectl terminal. Guided labs to practice commands.'), color: '#f59e0b' },
    { icon: <Calculator size={24} />, title: t('Outils interactifs', 'Interactive Tools'), desc: t('Calculatrice subnetting, comparateur protocoles, plan adressage VLSM, flashcards et glossaires.', 'Subnet calculator, protocol comparator, VLSM addressing plan, flashcards and glossaries.'), color: '#e11d48' },
    { icon: <Shield size={24} />, title: t('CTF Challenges', 'CTF Challenges'), desc: t('15+ defis Capture The Flag. Analyse de configs, ACL, paquets et logs. Flags au format NR{...}.', '15+ Capture The Flag challenges. Config analysis, ACLs, packets and logs. NR{...} flag format.'), color: '#8b5cf6' },
    { icon: <Gamepad2 size={24} />, title: t('Mini-Jeux & Duels', 'Mini-Games & Duels'), desc: t('3 mini-jeux reseau, mode survie, mode duel contre IA et defis hebdomadaires.', '3 network mini-games, survival mode, AI duel mode and weekly challenges.'), color: '#ec4899' },
  ]

  const tools = [
    { icon: <Layers size={14} />, label: 'Flashcards' },
    { icon: <Network size={14} />, label: t('Schemas Reseau', 'Network Diagrams') },
    { icon: <BarChart3 size={14} />, label: 'Analytics' },
    { icon: <Globe size={14} />, label: t('Glossaire 149 termes', '149-term Glossary') },
    { icon: <Swords size={14} />, label: t('Mode Duel', 'Duel Mode') },
    { icon: <Flame size={14} />, label: t('Mode Survie', 'Survival Mode') },
    { icon: <Flag size={14} />, label: 'CTF Challenges' },
    { icon: <Star size={14} />, label: t('15 Niveaux XP', '15 XP Levels') },
  ]

  const formations = [
    {
      name: t('Reseaux & CCNA', 'Networking & CCNA'),
      accent: '#00e5a0',
      chapters: 49,
      programs: [
        { num: 1, title: t('Fondamentaux Reseau', 'Network Fundamentals'), color: '#00e5a0' },
        { num: 2, title: t('Acces Reseau & Connectivite', 'Network Access & Connectivity'), color: '#6366f1' },
        { num: 3, title: t('Services IP', 'IP Services'), color: '#f59e0b' },
        { num: 4, title: t('Securite', 'Security'), color: '#e11d48' },
        { num: 5, title: 'Wireless', color: '#8b5cf6' },
        { num: 6, title: t('Automation & Programmabilite', 'Automation & Programmability'), color: '#06b6d4' },
      ],
    },
    {
      name: t('Admin Systeme & DevOps', 'System Admin & DevOps'),
      accent: '#3b82f6',
      chapters: 38,
      programs: [
        { num: 1, title: t('Fondations Linux', 'Linux Foundations'), color: '#f97316' },
        { num: 2, title: t('Reseaux, Git & Scripting', 'Networking, Git & Scripting'), color: '#8b5cf6' },
        { num: 3, title: t('Conteneurs & Docker', 'Containers & Docker'), color: '#10b981' },
        { num: 4, title: 'Kubernetes', color: '#ef4444' },
        { num: 5, title: t('Cloud & Infrastructure as Code', 'Cloud & Infrastructure as Code'), color: '#3b82f6' },
        { num: 6, title: t('CI/CD, Monitoring & SRE', 'CI/CD, Monitoring & SRE'), color: '#f59e0b' },
      ],
    },
  ]

  return (
    <div style={{ paddingTop: 56, background: '#080b1a', color: '#e2e8f0', ...darkVars }}>
      <SEO
        title={t('Apprends les reseaux, le CCNA et le DevOps gratuitement', 'Learn networking, CCNA and DevOps for free')}
        description={t('Plateforme gratuite : 2 formations (Reseaux/CCNA + DevOps), 87 chapitres, 1000+ QCM, simulateurs CLI, exercices pratiques — ideal pour etudiants, professionnels et curieux.', 'Free platform: 2 courses (Networking/CCNA + DevOps), 87 chapters, 1000+ quizzes, CLI simulators, hands-on exercises — ideal for students, professionals and curious minds.')}
        url="/"
      />

      {/* ======= HERO ======= */}
      <section style={{ position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <NeonOrbs color="#00e5a0" intensity={0.7} />
        {/* Gradient overlays */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to top, #080b1a, transparent)', pointerEvents: 'none', zIndex: 1 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '35%', background: 'linear-gradient(to right, #080b1a 0%, transparent 100%)', pointerEvents: 'none', opacity: 0.7, zIndex: 1 }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px', width: '100%', position: 'relative', zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}>
            {/* Terminal badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', background: 'rgba(0, 229, 160, 0.08)',
              border: '1px solid rgba(0, 229, 160, 0.2)', marginBottom: 32,
              fontFamily: 'var(--font-mono)', fontSize: 13, color: '#00e5a0',
            }}>
              <span style={{ width: 6, height: 6, background: '#00e5a0', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              <span style={{ opacity: 0.5 }}>$</span> {t('reseaux, CCNA & DevOps — 100% gratuit', 'networking, CCNA & DevOps — 100% free')}
            </div>

            <h1 style={{
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontSize: 'clamp(36px, 6vw, 72px)',
              fontWeight: 700, lineHeight: 1.05, marginBottom: 24, letterSpacing: '-2px', maxWidth: 800,
            }}>
              {t('Maitrise les reseaux', 'Master networking')}<br />
              {t('et le ', 'and ')}<span style={{ color: '#00e5a0' }}>DevOps</span>
            </h1>

            <p style={{
              fontSize: 18, color: '#94a3b8', lineHeight: 1.7,
              maxWidth: 580, marginBottom: 40, fontWeight: 300,
            }}>
              {t(
                'Que tu sois etudiant, professionnel en reconversion ou simplement curieux, explore 2 formations completes, 87 chapitres, 1000+ QCM, des simulateurs CLI et bien plus — 100% gratuit.',
                'Whether you\'re a student, career changer or simply curious, explore 2 complete courses, 87 chapters, 1000+ quizzes, CLI simulators and much more — 100% free.'
              )}
            </p>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 48 }}>
              <Link to="/register">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{
                  padding: '14px 32px', background: '#00e5a0', color: '#080b1a',
                  fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 10,
                  fontFamily: "'Work Sans', system-ui, sans-serif",
                  boxShadow: '0 0 40px rgba(0, 229, 160, 0.3)',
                }}>
                  {t('Commencer gratuitement', 'Start for free')} <ArrowRight size={18} />
                </motion.button>
              </Link>
              <Link to="/login">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{
                  padding: '14px 32px', background: 'transparent',
                  border: '1px solid #1e293b', color: '#e2e8f0',
                  fontSize: 15, fontWeight: 500, cursor: 'pointer',
                  fontFamily: "'Work Sans', system-ui, sans-serif",
                }}>
                  {t('Se connecter', 'Log in')}
                </motion.button>
              </Link>
            </div>

            {/* Tool tags */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {tools.map((tl) => (
                <motion.div
                  key={tl.label}
                  whileHover={{ borderColor: 'rgba(0, 229, 160, 0.3)', y: -1 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '4px 12px', background: 'rgba(255,255,255,0.03)',
                    border: '1px solid #1e293b', fontSize: 12,
                    fontFamily: "'JetBrains Mono', monospace", color: '#475569',
                    transition: 'all 0.2s',
                  }}
                >
                  {tl.icon} {tl.label}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <style>{`
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        `}</style>
      </section>

      {/* ======= STATS BAR ======= */}
      <section style={{
        borderTop: '1px solid #1e293b', borderBottom: '1px solid #1e293b',
        background: '#0f1328',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '32px 24px',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24,
        }} className="stats-grid">
          {[
            { value: 87, suffix: '', label: t('Chapitres de cours', 'Course chapters') },
            { value: 1000, suffix: '+', label: t('Questions QCM', 'Quiz questions') },
            { value: 2, suffix: '', label: t('Formations completes', 'Complete courses') },
            { value: 12, suffix: '', label: t('Examens finaux', 'Final exams') },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 36, fontWeight: 700, color: '#00e5a0', letterSpacing: '-1px' }}>
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ======= FEATURES ======= */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '96px 24px' }}>
        <FadeInSection>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#00e5a0', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: 16 }}>
              // {t('fonctionnalites', 'features')}
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-1px', marginBottom: 16 }}>
              {t('Tout ce qu\'il faut pour', 'Everything you need to')}<br />
              <span style={{ color: '#00e5a0' }}>{t('maitriser les reseaux', 'master networking')}</span>
            </h2>
            <p style={{ fontSize: 16, color: '#94a3b8', maxWidth: 600, margin: '0 auto', fontWeight: 300 }}>
              {t('Une plateforme complete avec des outils pratiques, de la gamification et un suivi personnalise.', 'A complete platform with practical tools, gamification and personalized tracking.')}
            </p>
          </div>
        </FadeInSection>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 2 }} className="features-grid">
          {features.map((f, i) => (
            <FadeInSection key={f.title} delay={i * 0.06}>
              <div style={{
                padding: 28, background: '#0f1328', border: '1px solid #1e293b',
                position: 'relative', overflow: 'hidden', height: '100%',
                transition: 'border-color 0.3s, transform 0.3s, box-shadow 0.3s',
              }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = f.color
                  el.style.transform = 'translateY(-2px)'
                  el.style.boxShadow = `0 8px 30px ${f.color}12`
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = '#1e293b'
                  el.style.transform = 'translateY(0)'
                  el.style.boxShadow = 'none'
                }}
              >
                {/* Glow top line */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: f.color, opacity: 0.6 }} />
                <div style={{ color: f.color, marginBottom: 16 }}>{f.icon}</div>
                <div style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, fontWeight: 300 }}>{f.desc}</div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* ======= FORMATIONS ======= */}
      <section style={{ background: '#0f1328', borderTop: '1px solid #1e293b', borderBottom: '1px solid #1e293b' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '96px 24px' }}>
          <FadeInSection>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#00e5a0', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: 16 }}>
                // {t('formations', 'courses')}
              </div>
              <h2 style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-1px', marginBottom: 16 }}>
                {t('2 formations', '2 courses')}, <span style={{ color: '#00e5a0' }}>87 {t('chapitres', 'chapters')}</span>
              </h2>
              <p style={{ fontSize: 16, color: '#94a3b8', maxWidth: 550, margin: '0 auto', fontWeight: 300 }}>
                {t('De debutant a expert, des parcours structures pour maitriser les reseaux et le DevOps.', 'From beginner to expert, structured paths to master networking and DevOps.')}
              </p>
            </div>
          </FadeInSection>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
            {formations.map((f, fi) => (
              <FadeInSection key={f.name} delay={fi * 0.12}>
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 24, fontWeight: 700, color: f.accent, marginBottom: 6 }}>{f.name}</h3>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#475569' }}>{f.chapters} {t('chapitres', 'chapters')} — 6 {t('programmes', 'programs')}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 2 }}>
                  {f.programs.map((p) => (
                    <motion.div
                      key={p.num}
                      whileHover={{ borderColor: p.color }}
                      style={{
                        padding: '16px 20px', background: '#080b1a', border: '1px solid #1e293b',
                        position: 'relative', overflow: 'hidden', transition: 'border-color 0.2s',
                      }}
                    >
                      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 3, background: p.color }} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: p.color }}>{String(p.num).padStart(2, '0')}</span>
                        <span style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 14, fontWeight: 600 }}>{p.title}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ======= TERMINAL DEMO ======= */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '96px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="demo-grid">
          <FadeInSection>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#00e5a0', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: 16 }}>
              // {t('simulateur', 'simulator')}
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 16 }}>
              {t('Terminal Cisco IOS', 'Cisco IOS Terminal')}<br />
              <span style={{ color: '#00e5a0' }}>{t('interactif', 'interactive')}</span>
            </h2>
            <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.8, marginBottom: 24, fontWeight: 300 }}>
              {t(
                'Pratique les commandes Cisco dans un terminal realiste. 5 modes IOS (User, Privileged, Config, Interface, Line), auto-completion et labs guides pour maitriser la CLI.',
                'Practice Cisco commands in a realistic terminal. 5 IOS modes (User, Privileged, Config, Interface, Line), auto-completion and guided labs to master the CLI.'
              )}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                t('Machine a etats complete (5 modes)', 'Complete state machine (5 modes)'),
                t('Auto-completion des commandes', 'Command auto-completion'),
                t('Labs guides pas a pas', 'Step-by-step guided labs'),
              ].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#94a3b8' }}>
                  <Zap size={14} color="#00e5a0" />
                  {item}
                </div>
              ))}
            </div>
          </FadeInSection>

          <FadeInSection delay={0.15}>
            <div style={{
              background: '#060814', border: '1px solid #1e293b', padding: 0, overflow: 'hidden',
              fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
              boxShadow: '0 8px 40px rgba(0, 229, 160, 0.06)',
            }}>
              {/* Terminal header */}
              <div style={{
                padding: '10px 16px', borderBottom: '1px solid #1e293b',
                display: 'flex', alignItems: 'center', gap: 8, background: '#0a0e20',
              }}>
                <div style={{ width: 10, height: 10, background: '#ef4444', borderRadius: '50%' }} />
                <div style={{ width: 10, height: 10, background: '#f59e0b', borderRadius: '50%' }} />
                <div style={{ width: 10, height: 10, background: '#22c55e', borderRadius: '50%' }} />
                <span style={{ marginLeft: 8, fontSize: 11, color: '#475569' }}>cisco-ios-simulator</span>
              </div>
              {/* Terminal body with typing effect */}
              <div style={{ padding: 20, lineHeight: 2, color: '#94a3b8' }}>
                {terminalLines.slice(0, typedLine).map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span style={{ color: line.color }}>{line.prompt}</span>{line.cmd}
                  </motion.div>
                ))}
                {typedLine >= terminalLines.length && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ color: '#22c55e' }}
                  >
                    %LINK-3-UPDOWN: Interface GigabitEthernet0/1, changed state to up
                  </motion.div>
                )}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#6366f1' }}>Router(config-if)#</span>
                  <span style={{ display: 'inline-block', width: 8, height: 16, background: '#00e5a0', marginLeft: 4, animation: 'blink 1s infinite' }} />
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>

        <style>{`
          @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        `}</style>
      </section>

      {/* ======= GAMIFICATION ======= */}
      <section style={{ background: '#0f1328', borderTop: '1px solid #1e293b', borderBottom: '1px solid #1e293b' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '96px 24px' }}>
          <FadeInSection>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#00e5a0', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: 16 }}>
                // {t('gamification', 'gamification')}
              </div>
              <h2 style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-1px', marginBottom: 16 }}>
                {t('Apprendre en', 'Learn while')}{' '}
                <span style={{ color: '#00e5a0' }}>{t('s\'amusant', 'having fun')}</span>
              </h2>
            </div>
          </FadeInSection>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 2 }}>
            {[
              { icon: <Trophy size={28} />, title: t('Leaderboard', 'Leaderboard'), desc: t('Top 50 des meilleurs joueurs. Compare-toi aux autres.', 'Top 50 best players. Compare yourself to others.'), color: '#fbbf24' },
              { icon: <Award size={28} />, title: t('28 Badges', '28 Badges'), desc: t('Debloque des badges en completant des defis et chapitres.', 'Unlock badges by completing challenges and chapters.'), color: '#8b5cf6' },
              { icon: <Star size={28} />, title: t('15 Niveaux XP', '15 XP Levels'), desc: t('De Novice Reseau a Legende NetRevision. Progresse a chaque action.', 'From Network Novice to NetRevision Legend. Progress with every action.'), color: '#00e5a0' },
              { icon: <Flame size={28} />, title: t('Streak & Defis', 'Streak & Challenges'), desc: t('Maintiens ta serie de connexion et releve des defis hebdomadaires.', 'Maintain your login streak and take on weekly challenges.'), color: '#ef4444' },
            ].map((g, i) => (
              <FadeInSection key={g.title} delay={i * 0.06}>
                <motion.div
                  whileHover={{ borderColor: g.color, y: -2 }}
                  style={{
                    padding: 28, background: '#080b1a', border: '1px solid #1e293b',
                    textAlign: 'center', height: '100%', transition: 'all 0.3s',
                  }}
                >
                  <div style={{ color: g.color, marginBottom: 16, display: 'flex', justifyContent: 'center' }}>{g.icon}</div>
                  <div style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{g.title}</div>
                  <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, fontWeight: 300 }}>{g.desc}</div>
                </motion.div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ======= BILINGUE + EXTRAS ======= */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '96px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }} className="extras-grid">
          {[
            { icon: <Globe size={24} />, title: t('Bilingue FR/EN', 'Bilingual FR/EN'), desc: t('Tout le contenu traduit. Bascule en un clic dans la navbar.', 'All content translated. Switch with one click in the navbar.') },
            { icon: <Monitor size={24} />, title: t('Responsive', 'Responsive'), desc: t('Optimise desktop, tablette et mobile. PWA installable.', 'Optimized for desktop, tablet and mobile. Installable PWA.') },
            { icon: <Users size={24} />, title: t('100% Gratuit', '100% Free'), desc: t('Aucune carte bancaire. Aucun abonnement. Acces complet a tout le contenu.', 'No credit card. No subscription. Full access to all content.') },
          ].map((e, i) => (
            <FadeInSection key={e.title} delay={i * 0.08}>
              <motion.div
                whileHover={{ borderColor: '#00e5a0', y: -2 }}
                style={{
                  padding: 28, background: '#0f1328', border: '1px solid #1e293b', textAlign: 'center', height: '100%',
                  transition: 'all 0.3s',
                }}
              >
                <div style={{ color: '#00e5a0', marginBottom: 16, display: 'flex', justifyContent: 'center' }}>{e.icon}</div>
                <div style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{e.title}</div>
                <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, fontWeight: 300 }}>{e.desc}</div>
              </motion.div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* ======= CTA FINAL ======= */}
      <section style={{
        borderTop: '1px solid #1e293b',
        position: 'relative', overflow: 'hidden',
      }}>
        <NeonOrbs color="#00e5a0" intensity={0.5} />
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '96px 24px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <FadeInSection>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 56, marginBottom: 24,
              background: 'linear-gradient(135deg, #00e5a0 0%, #6366f1 50%, #e11d48 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700,
            }}>
              NR
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, letterSpacing: '-1px', marginBottom: 16 }}>
              {t('Pret a te lancer ?', 'Ready to get started?')}
            </h2>
            <p style={{ fontSize: 16, color: '#94a3b8', marginBottom: 40, fontWeight: 300, lineHeight: 1.7 }}>
              {t(
                'Etudiants, candidats CCNA ou passionnes de reseaux — rejoins NetRevision. Inscription en 30 secondes, 100% gratuit.',
                'Students, CCNA candidates or networking enthusiasts — join NetRevision. Sign up in 30 seconds, 100% free.'
              )}
            </p>
            <Link to="/register">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} style={{
                padding: '16px 40px', background: '#00e5a0', color: '#080b1a',
                fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer',
                fontFamily: "'Work Sans', system-ui, sans-serif",
                boxShadow: '0 0 50px rgba(0, 229, 160, 0.3)',
                display: 'inline-flex', alignItems: 'center', gap: 10,
              }}>
                {t('Creer mon compte gratuit', 'Create my free account')} <ArrowRight size={18} />
              </motion.button>
            </Link>
            <p style={{ marginTop: 20, fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: '#475569' }}>
              {t('Aucune carte bancaire requise', 'No credit card required')}
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .demo-grid { grid-template-columns: 1fr !important; }
          .extras-grid { grid-template-columns: 1fr !important; }
          .features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
