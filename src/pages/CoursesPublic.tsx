import { motion } from 'framer-motion'
import { BookOpen, ArrowRight, LogIn } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation, useChaptersByProgram } from '../hooks/useTranslation'
import ChapterCard from '../components/ChapterCard'
import SEO from '../components/SEO'
import NeonOrbs from '../components/NeonOrbs'

export default function CoursesPublic() {
  const { t } = useTranslation()
  const { chapters, chapters2, chapters3, chapters4, chapters5, chapters6 } = useChaptersByProgram()

  const programs = [
    {
      chapters: chapters,
      color: '#00e5a0',
      label: t('// programme 1 — fondamentaux reseau', '// program 1 — network fundamentals'),
      title: t('Programme 1 — Fondamentaux Reseau', 'Program 1 — Network Fundamentals'),
      desc: t('11 chapitres : OSI, composants reseau, topologies, cablage, switching, IPv4/subnetting, TCP/UDP, IPv6 et virtualisation.', '11 chapters: OSI, network components, topologies, cabling, switching, IPv4/subnetting, TCP/UDP, IPv6 and virtualization.'),
    },
    {
      chapters: chapters2,
      color: '#6366f1',
      label: t('// programme 2 — acces reseau & connectivite', '// program 2 — network access & connectivity'),
      title: t('Programme 2 — Acces Reseau & Connectivite IP', 'Program 2 — Network Access & IP Connectivity'),
      desc: t('10 chapitres : VLANs, STP, inter-VLAN, CDP/LLDP, EtherChannel, table de routage, routage statique, IPv6, OSPF et routage dynamique.', '10 chapters: VLANs, STP, inter-VLAN, CDP/LLDP, EtherChannel, routing table, static routing, IPv6, OSPF and dynamic routing.'),
    },
    {
      chapters: chapters3,
      color: '#f59e0b',
      label: t('// programme 3 — services ip', '// program 3 — ip services'),
      title: t('Programme 3 — Services IP & Entreprise', 'Program 3 — IP Services & Enterprise'),
      desc: t('11 chapitres : NAT/PAT, DHCP, DNS, NTP, SNMP, Syslog, QoS, SSH, TFTP/FTP, FHRP et ACL.', '11 chapters: NAT/PAT, DHCP, DNS, NTP, SNMP, Syslog, QoS, SSH, TFTP/FTP, FHRP and ACL.'),
    },
    {
      chapters: chapters4,
      color: '#e11d48',
      label: t('// programme 4 — securite', '// program 4 — security'),
      title: t('Programme 4 — Securite', 'Program 4 — Security'),
      desc: t('4 chapitres securite : concepts cles, securite Layer 2, VPN IPsec et AAA/controle d\'acces.', '4 security chapters: key concepts, Layer 2 security, IPsec VPN and AAA/access control.'),
    },
    {
      chapters: chapters5,
      color: '#8b5cf6',
      label: t('// programme 5 — wireless', '// program 5 — wireless'),
      title: t('Programme 5 — Wireless', 'Program 5 — Wireless'),
      desc: t('6 chapitres wireless : principes Wi-Fi, architectures, infrastructure WLAN, securite wireless, configuration WLC et gestion des equipements.', '6 wireless chapters: Wi-Fi principles, architectures, WLAN infrastructure, wireless security, WLC configuration and device management.'),
    },
    {
      chapters: chapters6,
      color: '#06b6d4',
      label: t('// programme 6 — automation', '// program 6 — automation'),
      title: t('Programme 6 — Automation & Programmabilite', 'Program 6 — Automation & Programmability'),
      desc: t('7 chapitres automation : impact, controller-based, SDN, AI/ML, APIs REST, outils de config et JSON.', '7 automation chapters: impact, controller-based, SDN, AI/ML, REST APIs, config tools and JSON.'),
    },
  ]

  return (
    <div style={{ paddingTop: 56 }}>
      <SEO
        title={t('Cours Reseaux', 'Networking Courses')}
        description={t(
          '49 cours gratuits CCNA 200-301 : reseaux, switching, routage, services IP, securite, wireless et automation.',
          '49 free CCNA 200-301 courses: networking, switching, routing, IP services, security, wireless and automation.'
        )}
        url="/cours"
      />

      {/* Header */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <NeonOrbs color="#00e5a0" intensity={0.4} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 40px', position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)',
              textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12,
            }}>
              {t('// 49 chapitres — 6 programmes', '// 49 chapters — 6 programs')}
            </div>
            <h1 style={{
              fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 700, letterSpacing: '-1px', marginBottom: 12,
            }}>
              {t('Cours Reseaux', 'Networking Courses')}
            </h1>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 520, fontWeight: 300, lineHeight: 1.7 }}>
              {t(
                'Tous les cours sont en acces libre. Creez un compte pour sauvegarder votre progression et acceder aux quiz.',
                'All courses are freely accessible. Create an account to save your progress and access quizzes.'
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA banner */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 24px 0' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
          padding: '14px 20px', background: 'var(--bg-tertiary)',
          border: '1px solid var(--accent)', borderLeftWidth: 3, flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-secondary)' }}>
            <LogIn size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
            <span>{t('Connectez-vous pour sauvegarder votre progression, acceder aux quiz et obtenir des badges', 'Sign in to save your progress, access quizzes and earn badges')}</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link to="/register" style={{
              padding: '7px 16px', background: 'var(--accent)', color: 'var(--bg-primary)',
              fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {t('Creer un compte', 'Create account')} <ArrowRight size={12} />
            </Link>
            <Link to="/login" style={{
              padding: '7px 16px', background: 'transparent', border: '1px solid var(--border)',
              color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500,
              fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap',
            }}>
              {t('Se connecter', 'Sign in')}
            </Link>
          </div>
        </div>
      </section>

      {/* Programs */}
      {programs.map((prog, pi) => (
        <section key={pi} style={{ maxWidth: 1200, margin: '0 auto', padding: pi === 0 ? '40px 24px 40px' : '24px 24px 40px' }}>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ marginBottom: 32 }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, color: prog.color,
              textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12,
            }}>
              {prog.label}
            </div>
            <h2 style={{
              fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700,
              letterSpacing: '-1px', marginBottom: 8,
            }}>
              {prog.title}
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 520, fontWeight: 300 }}>
              {prog.desc}
            </p>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }}>
            {prog.chapters.map((ch, i) => (
              <ChapterCard key={ch.id} chapter={ch} index={i} completed={false} />
            ))}
          </div>
        </section>
      ))}

      {/* Bottom CTA */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px' }}>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          style={{
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            padding: '32px 28px', textAlign: 'center',
          }}
        >
          <BookOpen size={24} color="var(--accent)" style={{ marginBottom: 12 }} />
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
            {t('Pret a commencer ?', 'Ready to start?')}
          </h3>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20, maxWidth: 400, margin: '0 auto 20px' }}>
            {t(
              'Creez un compte gratuit pour suivre votre progression, passer les quiz et obtenir votre certification.',
              'Create a free account to track your progress, take quizzes and get your certification.'
            )}
          </p>
          <Link to="/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 24px', background: 'var(--accent)', color: 'var(--bg-primary)',
            fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-body)',
          }}>
            {t('Commencer gratuitement', 'Start for free')} <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
