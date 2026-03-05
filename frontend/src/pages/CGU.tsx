import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import SEO from '../components/SEO'
import { useTranslation } from '../hooks/useTranslation'

export default function CGU() {
  const { t } = useTranslation()

  return (
    <div style={{ paddingTop: 56 }}>
      <SEO title={t("Conditions generales d'utilisation", 'Terms of Use')} description={t("Conditions generales d'utilisation de NetRevision, plateforme gratuite de revision pour les reseaux informatiques.", 'Terms of use for NetRevision, a free study platform for computer networks.')} url="/cgu" />
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/" style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
            <ArrowLeft size={14} /> {t('retour', 'back')}
          </Link>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12 }}>{t('// conditions generales', '// terms of use')}</div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 32, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 32 }}>{t("Conditions generales d'utilisation", 'Terms of Use')}</h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <Section title={t('Article 1 — Objet', 'Article 1 — Purpose')}>
              <p>{t("Les presentes conditions generales d'utilisation (CGU) regissent l'acces et l'utilisation de la plateforme NetRevision (https://netrevision.fr), editee par Morvin Quernel / QUERNEL INTELLIGENCE.", "These terms of use govern access to and use of the NetRevision platform (https://netrevision.fr), published by Morvin Quernel / QUERNEL INTELLIGENCE.")}</p>
              <p>{t('En vous inscrivant sur NetRevision, vous acceptez sans reserve les presentes CGU.', 'By registering on NetRevision, you unconditionally accept these terms of use.')}</p>
            </Section>

            <Section title={t('Article 2 — Acces au service', 'Article 2 — Access to the Service')}>
              <p>{t("NetRevision est une plateforme gratuite de revision pour les reseaux informatiques. L'acces aux cours, quiz, examens et outils necessite la creation d'un compte utilisateur.", "NetRevision is a free study platform for computer networks. Access to courses, quizzes, exams and tools requires creating a user account.")}</p>
              <p>{t("L'utilisateur s'engage a fournir des informations exactes lors de l'inscription et a maintenir la confidentialite de ses identifiants de connexion.", 'Users agree to provide accurate information during registration and to maintain the confidentiality of their login credentials.')}</p>
            </Section>

            <Section title={t('Article 3 — Contenu educatif', 'Article 3 — Educational Content')}>
              <p>{t("Les cours, quiz, examens et outils proposes sur NetRevision sont fournis a titre educatif. Ils sont destines a accompagner l'apprentissage des reseaux informatiques et ne constituent pas une certification officielle.", 'Courses, quizzes, exams and tools offered on NetRevision are provided for educational purposes. They are intended to support learning about computer networks and do not constitute an official certification.')}</p>
              <p>{t("QUERNEL INTELLIGENCE s'efforce de fournir des informations exactes mais ne garantit pas l'absence d'erreurs dans le contenu.", 'QUERNEL INTELLIGENCE strives to provide accurate information but does not guarantee the absence of errors in the content.')}</p>
            </Section>

            <Section title={t('Article 4 — Compte utilisateur', 'Article 4 — User Account')}>
              <p>{t("Chaque utilisateur est responsable de l'activite sur son compte. Il s'engage a :", 'Each user is responsible for the activity on their account. They agree to:')}</p>
              <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                <li>{t('Ne pas partager ses identifiants de connexion', 'Not share their login credentials')}</li>
                <li>{t('Ne pas creer plusieurs comptes', 'Not create multiple accounts')}</li>
                <li>{t('Ne pas utiliser le service a des fins illegales ou malveillantes', 'Not use the service for illegal or malicious purposes')}</li>
                <li>{t('Ne pas tenter de compromettre la securite de la plateforme', 'Not attempt to compromise the platform security')}</li>
              </ul>
              <p style={{ marginTop: 12 }}>{t('QUERNEL INTELLIGENCE se reserve le droit de suspendre ou supprimer un compte en cas de non-respect des presentes CGU.', 'QUERNEL INTELLIGENCE reserves the right to suspend or delete an account in case of non-compliance with these terms.')}</p>
            </Section>

            <Section title={t('Article 5 — Propriete intellectuelle', 'Article 5 — Intellectual Property')}>
              <p>{t("L'ensemble du contenu de NetRevision (cours, questions, code, design, marques) est protege par le droit de la propriete intellectuelle et appartient a Morvin Quernel / QUERNEL INTELLIGENCE.", 'All NetRevision content (courses, questions, code, design, trademarks) is protected by intellectual property law and belongs to Morvin Quernel / QUERNEL INTELLIGENCE.')}</p>
              <p>{t('Toute reproduction ou redistribution du contenu sans autorisation est interdite.', 'Any reproduction or redistribution of content without authorization is prohibited.')}</p>
            </Section>

            <Section title={t('Article 6 — Donnees personnelles', 'Article 6 — Personal Data')}>
              <p>{t('Le traitement des donnees personnelles est regi par notre', 'The processing of personal data is governed by our')} <Link to="/politique-confidentialite" style={{ color: 'var(--accent)' }}>{t('Politique de confidentialite', 'Privacy Policy')}</Link>.</p>
            </Section>

            <Section title={t('Article 7 — Limitation de responsabilite', 'Article 7 — Limitation of Liability')}>
              <p>{t('QUERNEL INTELLIGENCE ne saurait etre tenu responsable :', 'QUERNEL INTELLIGENCE shall not be held liable for:')}</p>
              <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                <li>{t('Des interruptions temporaires du service (maintenance, problemes techniques)', 'Temporary service interruptions (maintenance, technical issues)')}</li>
                <li>{t('De la perte de donnees en cas de force majeure', 'Data loss in case of force majeure')}</li>
                <li>{t("De l'utilisation faite par l'utilisateur des connaissances acquises sur la plateforme", 'The use made by the user of knowledge acquired on the platform')}</li>
              </ul>
            </Section>

            <Section title={t('Article 8 — Modification des CGU', 'Article 8 — Changes to Terms')}>
              <p>{t("QUERNEL INTELLIGENCE se reserve le droit de modifier les presentes CGU a tout moment. Les utilisateurs seront informes des modifications substantielles. La poursuite de l'utilisation du service apres modification vaut acceptation des nouvelles CGU.", 'QUERNEL INTELLIGENCE reserves the right to modify these terms at any time. Users will be informed of substantial changes. Continued use of the service after modification constitutes acceptance of the new terms.')}</p>
            </Section>

            <Section title={t('Article 9 — Droit applicable', 'Article 9 — Applicable Law')}>
              <p>{t("Les presentes CGU sont soumises au droit francais. Tout litige relatif a l'utilisation de NetRevision sera soumis aux tribunaux competents.", 'These terms are governed by French law. Any dispute relating to the use of NetRevision shall be submitted to the competent courts.')}</p>
            </Section>

            <Section title="Contact">
              <p>{t('Pour toute question relative aux presentes CGU :', 'For any questions regarding these terms:')}</p>
              <p><strong>Morvin Quernel — QUERNEL INTELLIGENCE</strong><br />
              Email : net-revision@quernel-intelligence.com<br />
              {t('Site', 'Website')} : <a href="https://quernel-intelligence.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>quernel-intelligence.com</a></p>
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
