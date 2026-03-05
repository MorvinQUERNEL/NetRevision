import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, CheckCircle, AlertCircle, KeyRound } from 'lucide-react'
import { api } from '../services/api'
import { useTranslation } from '../hooks/useTranslation'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const { t, lang } = useTranslation()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!token) {
    return (
      <div style={{ paddingTop: 56, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: 24 }}>
          <AlertCircle size={48} style={{ color: 'var(--error)', marginBottom: 16 }} />
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, marginBottom: 8 }}>{t('Lien invalide', 'Invalid link')}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{t('Ce lien de réinitialisation est invalide ou a expiré.', 'This reset link is invalid or has expired.')}</p>
          <Link to="/forgot-password" style={{ color: 'var(--accent)', fontSize: 14, fontWeight: 500 }}>{t('Demander un nouveau lien', 'Request a new link')}</Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError(t('Les mots de passe ne correspondent pas', 'Passwords do not match'))
      return
    }
    if (password.length < 6) {
      setError(t('Le mot de passe doit contenir au moins 6 caractères', 'Password must be at least 6 characters'))
      return
    }

    setLoading(true)
    try {
      await api.resetPassword(token, password)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || t('Erreur lors de la réinitialisation', 'Error during reset'))
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
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 48, height: 48, background: 'var(--accent)', borderRadius: 4,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
          }}>
            <KeyRound size={24} style={{ color: 'var(--bg-primary)' }} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{t('Nouveau mot de passe', 'New password')}</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{t('Choisissez un nouveau mot de passe', 'Choose a new password')}</p>
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
                {t('Mot de passe réinitialisé avec succès !', 'Password reset successfully!')}
              </p>
            </div>
            <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13 }}>
              <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 500 }}>{t('Se connecter', 'Log in')}</Link>
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
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '1px' }}>{t('Nouveau mot de passe', 'New password')}</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                    placeholder="••••••••"
                    style={{
                      width: '100%', padding: '10px 12px 10px 36px', background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 14,
                      fontFamily: 'var(--font-body)', outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '1px' }}>{t('Confirmer', 'Confirm')}</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                    placeholder="••••••••"
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
                <KeyRound size={16} /> {loading ? t('Réinitialisation...', 'Resetting...') : t('Réinitialiser', 'Reset')}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  )
}
