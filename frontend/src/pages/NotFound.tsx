import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertTriangle, ArrowRight, Home, BookOpen } from 'lucide-react'
import SEO from '../components/SEO'
import { useTranslation } from '../hooks/useTranslation'

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <div style={{ paddingTop: 56, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <SEO title={t('Page introuvable', 'Page not found')} description={t("Cette page n'existe pas sur NetRevision.", 'This page does not exist on NetRevision.')} url="/404" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', padding: '40px 24px', maxWidth: 520 }}
      >
        <div style={{ color: 'var(--accent)', marginBottom: 24 }}>
          <AlertTriangle size={48} />
        </div>

        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 64, fontWeight: 700,
          color: 'var(--accent)', lineHeight: 1, marginBottom: 12,
        }}>
          404
        </div>

        <h1 style={{
          fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 700,
          color: 'var(--text-primary)', marginBottom: 12,
        }}>
          {t('Page introuvable', 'Page not found')}
        </h1>

        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-secondary)',
          lineHeight: 1.7, marginBottom: 32, maxWidth: 400, margin: '0 auto 32px',
        }}>
          {t("Cette page n'existe pas ou a ete deplacee. Decouvrez nos cours et ressources pour apprendre les reseaux informatiques.", "This page doesn't exist or has been moved. Discover our courses and resources to learn about computer networks.")}
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 24px', background: 'var(--accent)', color: 'var(--bg-primary)',
            fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600,
          }}>
            <Home size={16} /> {t('Accueil', 'Home')}
          </Link>
          <Link to="/blog" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 24px', background: 'var(--bg-secondary)', color: 'var(--accent)',
            border: '1px solid var(--border)',
            fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600,
          }}>
            <BookOpen size={16} /> Blog <ArrowRight size={14} />
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
