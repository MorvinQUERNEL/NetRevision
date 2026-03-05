import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import { api } from '../services/api'
import { useTranslation } from '../hooks/useTranslation'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { t, lang } = useTranslation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.forgotPassword(email)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || t('Erreur lors de l\'envoi', 'Error while sending'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ paddingTop: 56, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: 420, padding: 24 }}
      >
        <div style={{ marginBottom: 32 }}>
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 13, fontFamily: 'var(--font-mono)', textDecoration: 'none' }}>
            <ArrowLeft size={14} /> {t('Retour', 'Back')}
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 48, height: 48, background: 'var(--accent)', borderRadius: 4,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
          }}>
            <Mail size={24} style={{ color: 'var(--bg-primary)' }} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{t('Mot de passe oublié', 'Forgot password')}</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{t('Entrez votre email pour recevoir un lien de réinitialisation', 'Enter your email to receive a reset link')}</p>
        </div>

        {success ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: 24,
              background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)',
              textAlign: 'center',
            }}>
              <CheckCircle size={32} style={{ color: 'var(--success)' }} />
              <p style={{ fontSize: 14, color: 'var(--text-primary)', margin: 0 }}>
                {t('Si cet email est associé à un compte, vous recevrez un lien de réinitialisation.', 'If this email is associated with an account, you will receive a reset link.')}
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
                {t('Vérifiez aussi vos spams.', 'Also check your spam folder.')}
              </p>
            </div>
            <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13 }}>
              <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 500 }}>{t('Retour à la connexion', 'Back to login')}</Link>
            </p>
          </motion.div>
        ) : (
          <>
            {error && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
                background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
                marginBottom: 20, fontSize: 13, color: 'var(--error)',
              }}>
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '1px' }}>Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    placeholder={t('ton@email.com', 'your@email.com')}
                    style={{
                      width: '100%', padding: '10px 12px 10px 36px', background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 14,
                      fontFamily: 'var(--font-body)', outline: 'none',
                    }}
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '12px 24px', background: 'var(--accent)',
                color: 'var(--bg-primary)', fontSize: 14, fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                opacity: loading ? 0.7 : 1, transition: 'all 0.15s', border: 'none', cursor: 'pointer',
              }}>
                <Mail size={16} /> {loading ? t('Envoi...', 'Sending...') : t('Envoyer le lien', 'Send reset link')}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  )
}
