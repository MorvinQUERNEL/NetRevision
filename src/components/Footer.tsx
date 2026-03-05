import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useLangStore } from '../stores/langStore'
import { useFormationStore } from '../stores/formationStore'

export default function Footer() {
  const lang = useLangStore((s) => s.lang)
  const t = (fr: string, en: string) => lang === 'en' ? en : fr
  const formation = useFormationStore((s) => s.currentFormation)
  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '40px 24px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: 40, marginBottom: 32 }} className="footer-grid">
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <img src="/logo.png" alt="NR" style={{ width: 24, height: 24, objectFit: 'contain' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600 }}>
                net<span style={{ color: 'var(--accent)' }}>revision</span>
              </span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 12, maxWidth: 320 }}>
              {t('Plateforme de revision interactive pour les reseaux informatiques. Creee par Morvin Quernel.', 'Interactive revision platform for computer networking. Created by Morvin Quernel.')}
            </p>
            <a href="https://quernel-intelligence.com/" target="_blank" rel="noopener noreferrer" style={{
              fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              quernel-intelligence.com <ArrowRight size={12} />
            </a>
          </div>

          {/* Navigation */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 16 }}>Navigation</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { to: `/${formation}`, label: t('Cours', 'Courses') },
                { to: `/${formation}/examens`, label: t('Examens', 'Exams') },
                { to: `/${formation}/dashboard`, label: 'Dashboard' },
                { to: '/leaderboard', label: t('Classement', 'Ranking') },
                { to: '/blog', label: 'Blog' },
                { to: '/a-propos', label: t('A propos', 'About') },
                { to: '/auteur', label: t('Auteur', 'Author') },
              ].map(l => (
                <Link key={l.to} to={l.to} style={{ fontSize: 13, color: 'var(--text-muted)', transition: 'color 0.2s, transform 0.2s', display: 'inline-block' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.transform = 'translateX(4px)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.transform = 'translateX(0)' }}
                >{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 16 }}>{t('Legal', 'Legal')}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { to: '/mentions-legales', label: t('Mentions legales', 'Legal Notice') },
                { to: '/politique-confidentialite', label: t('Politique de confidentialite', 'Privacy Policy') },
                { to: '/cgu', label: t('Conditions generales', 'Terms of Service') },
              ].map(l => (
                <Link key={l.to} to={l.to} style={{ fontSize: 13, color: 'var(--text-muted)', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-secondary)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)' }}
                >{l.label}</Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            &copy; {new Date().getFullYear()} QUERNEL INTELLIGENCE — {t('Tous droits reserves', 'All rights reserved')}
          </span>
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>netrevision v3.0</span>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
      `}</style>
    </footer>
  )
}
