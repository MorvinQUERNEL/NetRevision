import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import SEO from '../components/SEO'
import { useTranslation } from '../hooks/useTranslation'

export default function MentionsLegales() {
  const { t } = useTranslation()

  return (
    <div style={{ paddingTop: 56 }}>
      <SEO title={t('Mentions legales', 'Legal Notice')} description={t('Mentions legales du site NetRevision, plateforme de revision interactive pour les reseaux informatiques.', 'Legal notice of the NetRevision website, an interactive study platform for computer networks.')} url="/mentions-legales" />
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/" style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
            <ArrowLeft size={14} /> {t('retour', 'back')}
          </Link>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12 }}>{t('// mentions legales', '// legal notice')}</div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 32, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 32 }}>{t('Mentions legales', 'Legal Notice')}</h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <Section title={t('Editeur du site', 'Website Publisher')}>
              <p>{t('Le site', 'The website')} <strong>NetRevision</strong> (https://netrevision.fr) {t('est edite par :', 'is published by:')}</p>
              <p><strong>Morvin Quernel</strong><br />
              {t('Entreprise', 'Company')} : QUERNEL INTELLIGENCE<br />
              {t('Site web', 'Website')} : <a href="https://quernel-intelligence.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>quernel-intelligence.com</a><br />
              Email : net-revision@quernel-intelligence.com</p>
            </Section>

            <Section title={t('Hebergement', 'Hosting')}>
              <p>{t('Le site est heberge par :', 'The website is hosted by:')}</p>
              <p><strong>Hostinger International Ltd</strong><br />
              61 Lordou Vironos st., 6023 Larnaca, {t('Chypre', 'Cyprus')}<br />
              {t('Site web', 'Website')} : https://www.hostinger.fr</p>
            </Section>

            <Section title={t('Propriete intellectuelle', 'Intellectual Property')}>
              <p>{t("L'ensemble du contenu de ce site (textes, cours, questions, code source, design, logos) est la propriete exclusive de Morvin Quernel / QUERNEL INTELLIGENCE, sauf mention contraire.", 'All content on this site (texts, courses, questions, source code, design, logos) is the exclusive property of Morvin Quernel / QUERNEL INTELLIGENCE, unless otherwise stated.')}</p>
              <p>{t("Toute reproduction, representation, modification, publication ou adaptation de tout ou partie du contenu du site, quel que soit le moyen ou le procede utilise, est interdite sans autorisation ecrite prealable.", 'Any reproduction, representation, modification, publication or adaptation of all or part of the site content, by any means or process, is prohibited without prior written authorization.')}</p>
            </Section>

            <Section title={t('Responsabilite', 'Liability')}>
              <p>{t("Les informations fournies sur NetRevision sont a titre educatif. QUERNEL INTELLIGENCE s'efforce de fournir des informations exactes et a jour, mais ne garantit pas l'exactitude, la completude ou l'actualite des contenus.", 'Information provided on NetRevision is for educational purposes. QUERNEL INTELLIGENCE strives to provide accurate and up-to-date information, but does not guarantee the accuracy, completeness or currency of the content.')}</p>
              <p>{t("QUERNEL INTELLIGENCE ne saurait etre tenu responsable des dommages directs ou indirects resultant de l'utilisation du site.", 'QUERNEL INTELLIGENCE shall not be held liable for any direct or indirect damages resulting from the use of the site.')}</p>
            </Section>

            <Section title={t('Liens externes', 'External Links')}>
              <p>{t("Le site peut contenir des liens vers des sites tiers (videos YouTube, documentation). QUERNEL INTELLIGENCE n'exerce aucun controle sur ces sites et decline toute responsabilite quant a leur contenu.", 'The site may contain links to third-party sites (YouTube videos, documentation). QUERNEL INTELLIGENCE has no control over these sites and disclaims all responsibility for their content.')}</p>
            </Section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: 24 }}>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 600, marginBottom: 12 }}>{title}</h2>
      <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{children}</div>
    </div>
  )
}
