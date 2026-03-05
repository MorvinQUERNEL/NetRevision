import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { UserPlus, Mail, Lock, User, AlertCircle, AtSign } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import SEO from '../components/SEO'
import { useTranslation } from '../hooks/useTranslation'
import NeonOrbs from '../components/NeonOrbs'

export default function Register() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [pseudo, setPseudo] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [acceptCgu, setAcceptCgu] = useState(false)
  const [acceptNewsletter, setAcceptNewsletter] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const { register, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const { t } = useTranslation()

  if (isAuthenticated) return <Navigate to="/formations" />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError(t('Le mot de passe doit contenir au moins 6 caractères', 'Password must be at least 6 characters'))
      return
    }
    if (!acceptCgu) {
      setError(t('Vous devez accepter les CGU et la politique de confidentialité', 'You must accept the Terms of Service and Privacy Policy'))
      return
    }
    setLoading(true)
    try {
      await register(email, password, firstName, lastName, pseudo || undefined, acceptNewsletter)
      navigate('/formations')
    } catch (err: any) {
      setError(err.message || t('Erreur lors de l\'inscription', 'Error during registration'))
    } finally {
      setLoading(false)
    }
  }

  const getInputStyle = (field: string) => ({
    width: '100%', padding: '10px 12px 10px 36px',
    background: 'rgba(15, 19, 40, 0.6)',
    border: `1px solid ${focusedField === field ? 'var(--accent)' : 'var(--border)'}`,
    color: 'var(--text-primary)', fontSize: 14,
    fontFamily: 'var(--font-body)', outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxShadow: focusedField === field ? '0 0 0 3px var(--accent-glow)' : 'none',
  })

  const labelStyle = {
    display: 'block' as const, fontSize: 12, fontFamily: 'var(--font-mono)',
    color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: '1px',
  }

  const getIconStyle = (field: string) => ({
    position: 'absolute' as const, left: 12, top: '50%', transform: 'translateY(-50%)',
    color: focusedField === field ? 'var(--accent)' : 'var(--text-muted)',
    transition: 'color 0.2s',
  })

  return (
    <div style={{ paddingTop: 56, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <SEO
        title={t('Inscription gratuite', 'Free registration')}
        description={t('Creez votre compte gratuit sur NetRevision. 49 chapitres de cours reseaux, 690+ QCM, 6 examens finaux, simulateur Cisco IOS et exercices de subnetting.', 'Create your free account on NetRevision. 49 networking course chapters, 690+ quizzes, 6 final exams, Cisco IOS simulator and subnetting exercises.')}
        url="/register"
      />

      <NeonOrbs color="#00e5a0" intensity={0.4} />

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          width: '100%', maxWidth: 420, padding: 32,
          position: 'relative', zIndex: 2,
          background: 'rgba(15, 19, 40, 0.5)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            src="/logo.png" alt="NetRevision"
            style={{ width: 64, height: 64, objectFit: 'contain', marginBottom: 16 }}
          />
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700, marginBottom: 8 }}>{t('Inscription', 'Sign up')}</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{t('Crée ton compte gratuit', 'Create your free account')}</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
              background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
              marginBottom: 20, fontSize: 13, color: 'var(--error)',
            }}
          >
            <AlertCircle size={16} /> {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>{t('Prénom', 'First name')}</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={getIconStyle('firstName')} />
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required placeholder={t('Jean', 'John')}
                  style={getInputStyle('firstName')}
                  onFocus={() => setFocusedField('firstName')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>{t('Nom', 'Last name')}</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={getIconStyle('lastName')} />
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required placeholder={t('Dupont', 'Smith')}
                  style={getInputStyle('lastName')}
                  onFocus={() => setFocusedField('lastName')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>{t('Pseudo', 'Username')} <span style={{ opacity: 0.5, textTransform: 'none' }}>({t('optionnel', 'optional')})</span></label>
            <div style={{ position: 'relative' }}>
              <AtSign size={16} style={getIconStyle('pseudo')} />
              <input type="text" value={pseudo} onChange={(e) => setPseudo(e.target.value)} placeholder={t('Ton pseudo', 'Your username')}
                style={getInputStyle('pseudo')}
                onFocus={() => setFocusedField('pseudo')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={getIconStyle('email')} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder={t('ton@email.com', 'your@email.com')}
                style={getInputStyle('email')}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>{t('Mot de passe', 'Password')}</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={getIconStyle('password')} />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder={t('6 caractères minimum', '6 characters minimum')}
                style={getInputStyle('password')}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={acceptCgu} onChange={(e) => setAcceptCgu(e.target.checked)}
                style={{ marginTop: 3, accentColor: 'var(--accent)' }} />
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {t("J'accepte les ", 'I accept the ')}<Link to="/cgu" target="_blank" style={{ color: 'var(--accent)' }}>{t("conditions generales d'utilisation", 'terms of service')}</Link>{t(' et la ', ' and the ')}<Link to="/politique-confidentialite" target="_blank" style={{ color: 'var(--accent)' }}>{t('politique de confidentialite', 'privacy policy')}</Link>
              </span>
            </label>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={acceptNewsletter} onChange={(e) => setAcceptNewsletter(e.target.checked)}
                style={{ marginTop: 3, accentColor: 'var(--accent)' }} />
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {t('Je souhaite recevoir les actualites et conseils de NetRevision par email', 'I want to receive NetRevision news and tips by email')}
              </span>
            </label>
          </div>

          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} style={{
            width: '100%', padding: '12px 24px', background: 'var(--accent)',
            color: 'var(--bg-primary)', fontSize: 14, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            opacity: loading ? 0.7 : 1,
            boxShadow: '0 0 25px rgba(0, 229, 160, 0.2)',
          }}>
            <UserPlus size={16} /> {loading ? t('Inscription...', 'Signing up...') : t('Créer mon compte', 'Create my account')}
          </motion.button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-secondary)' }}>
          {t('Déjà un compte ?', 'Already have an account?')}{' '}
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 500 }}>{t('Se connecter', 'Log in')}</Link>
        </p>
      </motion.div>
    </div>
  )
}
