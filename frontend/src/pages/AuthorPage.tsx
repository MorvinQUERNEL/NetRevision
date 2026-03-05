import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Network, Shield, Terminal, Cloud, BookOpen, Mail, ArrowRight, Globe, GraduationCap } from 'lucide-react'
import SEO from '../components/SEO'
import { useTranslation } from '../hooks/useTranslation'

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  'name': 'Morvin Quernel',
  'url': 'https://netrevision.fr/auteur',
  'jobTitle': 'Fondateur & Formateur Reseaux',
  'worksFor': {
    '@type': 'Organization',
    'name': 'NetRevision',
    'url': 'https://netrevision.fr',
  },
  'description': 'Fondateur de NetRevision, plateforme de revision interactive pour les certifications reseaux CCNA',
  'knowsAbout': ['Reseaux informatiques', 'CCNA', 'Cisco', 'TCP/IP', 'OSPF', 'BGP', 'Python', 'Automatisation reseau'],
  'sameAs': [],
}

export default function AuthorPage() {
  const { t } = useTranslation()

  const expertises = [
    { icon: Network, label: t('Reseaux', 'Networking'), detail: t('TCP/IP, OSPF, BGP, VLAN', 'TCP/IP, OSPF, BGP, VLAN') },
    { icon: Shield, label: t('Securite', 'Security'), detail: t('VPN, ACL, pare-feu', 'VPN, ACL, firewall') },
    { icon: Terminal, label: t('Automatisation', 'Automation'), detail: 'Python, Ansible' },
    { icon: Cloud, label: 'Cloud', detail: 'AWS, Azure networking' },
  ]

  const platformStats = [
    { value: '49', label: t('chapitres', 'chapters') },
    { value: '690+', label: t('QCM', 'MCQs') },
    { value: '6', label: t('examens finaux', 'final exams') },
    { value: '1', label: t('simulateur CLI Cisco', 'Cisco CLI simulator') },
  ]

  return (
    <div style={{ paddingTop: 56, minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <SEO
        title={t('Morvin Quernel - Auteur & Fondateur', 'Morvin Quernel - Author & Founder')}
        description={t("Morvin Quernel, fondateur de NetRevision. Passionne de reseaux informatiques et de pedagogie, il a cree cette plateforme pour rendre l'apprentissage des reseaux accessible a tous.", 'Morvin Quernel, founder of NetRevision. Passionate about computer networks and teaching, he created this platform to make learning about networks accessible to everyone.')}
        url="/auteur"
        jsonLd={personJsonLd}
      />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px 80px' }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          {/* Retour */}
          <Link
            to="/"
            style={{
              fontSize: 13,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 24,
            }}
          >
            <ArrowLeft size={14} /> {t('retour', 'back')}
          </Link>

          {/* Header */}
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--accent)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: 12,
          }}>
            {t('// auteur', '// author')}
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(28px, 5vw, 42px)',
            fontWeight: 700,
            letterSpacing: '-0.5px',
            color: 'var(--text-primary)',
            marginBottom: 8,
          }}>
            Morvin <span style={{ color: 'var(--accent)' }}>Quernel</span>
          </h1>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            color: 'var(--text-secondary)',
            marginBottom: 40,
          }}>
            {t('Fondateur & Formateur Reseaux — NetRevision', 'Founder & Network Trainer — NetRevision')}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                padding: 28,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <User size={18} style={{ color: 'var(--accent)' }} />
                <h2 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 18,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}>
                  {t('A propos', 'About')}
                </h2>
              </div>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 15,
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
              }}>
                {t("Passionne de reseaux informatiques et de pedagogie, Morvin Quernel est le fondateur de NetRevision. Fort d'une experience en administration systeme et reseau, il a cree cette plateforme pour rendre l'apprentissage des reseaux accessible a tous. Son objectif : aider les etudiants et professionnels a preparer efficacement leurs certifications Cisco.", 'Passionate about computer networks and education, Morvin Quernel is the founder of NetRevision. With experience in system and network administration, he created this platform to make learning about networks accessible to everyone. His goal: helping students and professionals effectively prepare for their Cisco certifications.')}
              </p>
            </motion.div>

            {/* Expertise */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                padding: 28,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <GraduationCap size={18} style={{ color: 'var(--accent)' }} />
                <h2 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 18,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}>
                  {t("Domaines d'expertise", 'Areas of Expertise')}
                </h2>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 16,
              }}>
                {expertises.map((exp, i) => (
                  <motion.div
                    key={exp.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + i * 0.05 }}
                    style={{
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border)',
                      padding: 16,
                    }}
                  >
                    <exp.icon size={20} style={{ color: 'var(--accent)', marginBottom: 8 }} />
                    <div style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 14,
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      marginBottom: 4,
                    }}>
                      {exp.label}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--text-muted)',
                    }}>
                      {exp.detail}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* NetRevision */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                padding: 28,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <Globe size={18} style={{ color: 'var(--accent)' }} />
                <h2 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 18,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}>
                  {t('A propos de NetRevision', 'About NetRevision')}
                </h2>
              </div>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 15,
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                marginBottom: 24,
              }}>
                {t('En tant que createur de la plateforme', 'As creator of the')} <strong style={{ color: 'var(--accent)' }}>NetRevision</strong>{t(' , Morvin Quernel a concu un outil complet de revision interactive pour les certifications reseaux. La plateforme propose un parcours structure couvrant tous les sujets essentiels du CCNA, des fondamentaux aux technologies avancees.', ' platform, Morvin Quernel designed a comprehensive interactive study tool for network certifications. The platform offers a structured path covering all essential CCNA topics, from fundamentals to advanced technologies.')}
              </p>

              {/* Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: 12,
                marginBottom: 24,
              }}>
                {platformStats.map((stat) => (
                  <div
                    key={stat.label}
                    style={{
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border)',
                      padding: '16px 12px',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 24,
                      fontWeight: 700,
                      color: 'var(--accent)',
                      marginBottom: 4,
                    }}>
                      {stat.value}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                    }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
              }}>
                {t("La plateforme inclut egalement un simulateur CLI Cisco interactif, des exercices de subnetting, un glossaire de 149 termes, des flashcards, un mode duel contre l'IA et un systeme de gamification complet avec badges et classement.", 'The platform also includes an interactive Cisco CLI simulator, subnetting exercises, a glossary of 149 terms, flashcards, a duel mode against AI, and a complete gamification system with badges and leaderboard.')}
              </p>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                padding: 28,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <Mail size={18} style={{ color: 'var(--accent)' }} />
                <h2 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 18,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}>
                  Contact
                </h2>
              </div>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                marginBottom: 12,
              }}>
                {t("Pour toute question, suggestion ou demande de partenariat, n'hesitez pas a me contacter :", 'For any questions, suggestions or partnership requests, feel free to contact me:')}
              </p>
              <a
                href="mailto:net-revision@quernel-intelligence.com"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 14,
                  color: 'var(--accent)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Mail size={14} />
                net-revision@quernel-intelligence.com
              </a>
            </motion.div>

            {/* Navigation links */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 16,
              }}
            >
              <Link
                to="/blog"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  padding: '20px 24px',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <BookOpen size={18} style={{ color: 'var(--accent)' }} />
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 15,
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      marginBottom: 2,
                    }}>
                      {t('Articles & Tutoriels', 'Articles & Tutorials')}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--text-muted)',
                    }}>
                      {t('Decouvrir les articles du blog', 'Discover blog articles')}
                    </div>
                  </div>
                </div>
                <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
              </Link>

              <Link
                to="/a-propos"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  padding: '20px 24px',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Globe size={18} style={{ color: 'var(--accent)' }} />
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 15,
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      marginBottom: 2,
                    }}>
                      {t('A propos de NetRevision', 'About NetRevision')}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--text-muted)',
                    }}>
                      {t('En savoir plus sur la plateforme', 'Learn more about the platform')}
                    </div>
                  </div>
                </div>
                <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
              </Link>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </div>
  )
}
