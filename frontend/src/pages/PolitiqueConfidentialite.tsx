import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import SEO from '../components/SEO'
import { useTranslation } from '../hooks/useTranslation'

export default function PolitiqueConfidentialite() {
  const { t } = useTranslation()

  return (
    <div style={{ paddingTop: 56 }}>
      <SEO title={t('Politique de confidentialite', 'Privacy Policy')} description={t('Politique de confidentialite de NetRevision. Decouvrez comment vos donnees sont collectees, utilisees et protegees.', 'NetRevision privacy policy. Learn how your data is collected, used and protected.')} url="/politique-confidentialite" />
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/" style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
            <ArrowLeft size={14} /> {t('retour', 'back')}
          </Link>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12 }}>{t('// politique de confidentialite', '// privacy policy')}</div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 32, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 32 }}>{t('Politique de confidentialite', 'Privacy Policy')}</h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <Section title={t('Responsable du traitement', 'Data Controller')}>
              <p><strong>Morvin Quernel — QUERNEL INTELLIGENCE</strong><br />
              Email : net-revision@quernel-intelligence.com<br />
              {t('Site', 'Website')} : <a href="https://quernel-intelligence.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>quernel-intelligence.com</a></p>
            </Section>

            <Section title={t('Donnees collectees', 'Data Collected')}>
              <p>{t('Lors de votre inscription et utilisation de NetRevision, nous collectons :', 'When you register and use NetRevision, we collect:')}</p>
              <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                <li>{t('Nom et prenom', 'First and last name')}</li>
                <li>{t('Adresse email', 'Email address')}</li>
                <li>{t('Mot de passe (stocke de maniere chiffree)', 'Password (stored encrypted)')}</li>
                <li>{t('Donnees de progression (cours completes, scores quiz/examens)', 'Progress data (completed courses, quiz/exam scores)')}</li>
                <li>{t('Notes personnelles', 'Personal notes')}</li>
                <li>{t('Donnees de connexion (date, streak)', 'Login data (date, streak)')}</li>
              </ul>
            </Section>

            <Section title={t('Finalite du traitement', 'Purpose of Processing')}>
              <p>{t('Vos donnees sont utilisees pour :', 'Your data is used to:')}</p>
              <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                <li>{t('Creer et gerer votre compte utilisateur', 'Create and manage your user account')}</li>
                <li>{t("Sauvegarder votre progression d'apprentissage", 'Save your learning progress')}</li>
                <li>{t('Afficher le classement et les badges', 'Display rankings and badges')}</li>
                <li>{t("Envoyer des emails de suivi (resume hebdomadaire, rappel d'inactivite)", 'Send follow-up emails (weekly summary, inactivity reminder)')}</li>
                <li>{t('Ameliorer la plateforme', 'Improve the platform')}</li>
              </ul>
            </Section>

            <Section title={t('Base legale', 'Legal Basis')}>
              <p>{t("Le traitement est fonde sur votre consentement (inscription volontaire) et l'execution du service que vous avez demande.", 'Processing is based on your consent (voluntary registration) and the execution of the service you requested.')}</p>
            </Section>

            <Section title={t('Duree de conservation', 'Data Retention')}>
              <p>{t('Vos donnees sont conservees tant que votre compte est actif. Vous pouvez demander la suppression de votre compte et de toutes vos donnees a tout moment en nous contactant par email.', 'Your data is retained as long as your account is active. You can request deletion of your account and all your data at any time by contacting us by email.')}</p>
            </Section>

            <Section title={t('Partage des donnees', 'Data Sharing')}>
              <p>{t('Vos donnees personnelles ne sont ni vendues, ni louees, ni partagees avec des tiers a des fins commerciales. Seules les donnees strictement necessaires sont partagees avec :', 'Your personal data is not sold, rented or shared with third parties for commercial purposes. Only strictly necessary data is shared with:')}</p>
              <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                <li>{t('Notre hebergeur (Hostinger) pour le fonctionnement du service', 'Our host (Hostinger) for service operation')}</li>
                <li>{t("Google (si connexion via Google OAuth, uniquement les donnees d'authentification)", 'Google (if login via Google OAuth, authentication data only)')}</li>
              </ul>
            </Section>

            <Section title={t('Securite', 'Security')}>
              <p>{t('Nous mettons en oeuvre des mesures techniques pour proteger vos donnees :', 'We implement technical measures to protect your data:')}</p>
              <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                <li>{t('Chiffrement SSL/TLS (HTTPS)', 'SSL/TLS encryption (HTTPS)')}</li>
                <li>{t('Mots de passe hashes (Argon2)', 'Hashed passwords (Argon2)')}</li>
                <li>{t('Authentification par token JWT', 'JWT token authentication')}</li>
                <li>{t('Acces restreint a la base de donnees', 'Restricted database access')}</li>
              </ul>
            </Section>

            <Section title={t('Vos droits', 'Your Rights')}>
              <p>{t('Conformement au RGPD, vous disposez des droits suivants :', 'In accordance with the GDPR, you have the following rights:')}</p>
              <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                <li><strong>{t("Droit d'acces", 'Right of access')}</strong> : {t('obtenir une copie de vos donnees', 'obtain a copy of your data')}</li>
                <li><strong>{t('Droit de rectification', 'Right of rectification')}</strong> : {t('corriger vos informations', 'correct your information')}</li>
                <li><strong>{t("Droit a l'effacement", 'Right to erasure')}</strong> : {t('supprimer votre compte et vos donnees', 'delete your account and data')}</li>
                <li><strong>{t('Droit a la portabilite', 'Right to portability')}</strong> : {t('recevoir vos donnees dans un format structure', 'receive your data in a structured format')}</li>
                <li><strong>{t("Droit d'opposition", 'Right to object')}</strong> : {t('vous opposer au traitement de vos donnees', 'object to the processing of your data')}</li>
              </ul>
              <p style={{ marginTop: 12 }}>{t('Pour exercer ces droits, contactez-nous a :', 'To exercise these rights, contact us at:')} <strong>net-revision@quernel-intelligence.com</strong></p>
            </Section>

            <Section title="Cookies">
              <p>{t("NetRevision utilise uniquement un stockage local (localStorage) pour le token d'authentification JWT. Aucun cookie de tracking ou publicitaire n'est utilise.", 'NetRevision only uses local storage (localStorage) for the JWT authentication token. No tracking or advertising cookies are used.')}</p>
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
