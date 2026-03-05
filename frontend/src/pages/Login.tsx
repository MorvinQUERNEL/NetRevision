import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogIn, Mail, Lock, AlertCircle, UserPlus } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import SEO from '../components/SEO'
import { useTranslation } from '../hooks/useTranslation'
import NeonOrbs from '../components/NeonOrbs'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const { login, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const { t } = useTranslation()

  if (isAuthenticated) return <Navigate to="/formations" />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/formations')
    } catch (err: any) {
      setError(err.message || t('Erreur de connexion', 'Login error'))
    } finally {
      setLoading(false)
    }
  }

  const getInputStyle = (field: string) => ({
    width: '100%', padding: '12px 14px 12px 40px',
    background: 'rgba(15, 19, 40, 0.6)',
    border: `1px solid ${focusedField === field ? 'var(--accent)' : 'var(--border)'}`,
    color: 'var(--text-primary)', fontSize: 14,
    fontFamily: 'var(--font-body)', outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxShadow: focusedField === field ? '0 0 0 3px var(--accent-glow)' : 'none',
  })

  return (
    <div style={{ paddingTop: 56, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <SEO
        title={t('Connexion', 'Login')}
        description={t('Connectez-vous a NetRevision pour acceder a 49 chapitres de cours reseaux, 690+ QCM, simulateur Cisco et exercices CCNA.', 'Log in to NetRevision to access 49 networking course chapters, 690+ quizzes, Cisco simulator and CCNA exercises.')}
        url="/login"
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
        {/* Logo + Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link to="/" style={{ display: 'inline-block', marginBottom: 20 }}>
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              src="/logo.png" alt="NetRevision"
              style={{ width: 56, height: 56, objectFit: 'contain' }}
            />
          </Link>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.5px' }}>
            {t('Connexion', 'Login')}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            {t('Accede a tes cours et ta progression', 'Access your courses and progress')}
          </p>
        </div>

        {/* Error */}
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

        {/* Login form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: focusedField === 'email' ? 'var(--accent)' : 'var(--text-muted)',
                transition: 'color 0.2s',
              }} />
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                placeholder={t('ton@email.com', 'your@email.com')}
                style={getInputStyle('email')}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {t('Mot de passe', 'Password')}
              </label>
              <Link to="/forgot-password" style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textDecoration: 'none' }}>
                {t('Oublie ?', 'Forgot?')}
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: focusedField === 'password' ? 'var(--accent)' : 'var(--text-muted)',
                transition: 'color 0.2s',
              }} />
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                placeholder="••••••••"
                style={getInputStyle('password')}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
          </div>

          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} style={{
            width: '100%', padding: '13px 24px', background: 'var(--accent)',
            color: 'var(--bg-primary)', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            opacity: loading ? 0.7 : 1, transition: 'all 0.15s',
            boxShadow: '0 0 25px rgba(0, 229, 160, 0.2)',
          }}>
            <LogIn size={16} /> {loading ? t('Connexion...', 'Logging in...') : t('Se connecter', 'Log in')}
          </motion.button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '28px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {t('ou', 'or')}
          </span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        {/* Register CTA */}
        <Link to="/register">
          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} style={{
            width: '100%', padding: '12px 24px', background: 'transparent',
            border: '1px solid var(--border)', color: 'var(--text-primary)',
            fontSize: 14, fontWeight: 500, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'all 0.15s',
          }}>
            <UserPlus size={16} /> {t('Creer un compte gratuit', 'Create a free account')}
          </motion.button>
        </Link>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          {t('100% gratuit — aucune carte bancaire', '100% free — no credit card')}
        </p>
      </motion.div>
    </div>
  )
}
