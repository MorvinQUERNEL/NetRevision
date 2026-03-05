import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Shield, Calendar, AlertCircle, Check, AtSign, ChevronRight, Bell } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { api } from '../services/api'
import { useTranslation } from '../hooks/useTranslation'
import { getUserLevel } from '../utils/levelCalculator'
import { useLevels } from '../hooks/useTranslation'

export default function Profile() {
  const { user, ...authActions } = useAuthStore()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [pseudoInput, setPseudoInput] = useState(user?.pseudo || '')
  const [pseudoMsg, setPseudoMsg] = useState('')
  const [pseudoErr, setPseudoErr] = useState('')
  const [pseudoLoading, setPseudoLoading] = useState(false)
  const [newsletterOptIn, setNewsletterOptIn] = useState(user?.newsletterOptIn ?? false)
  const [newsletterMsg, setNewsletterMsg] = useState('')
  const [newsletterLoading, setNewsletterLoading] = useState(false)
  const { t, lang } = useTranslation()
  const allLevels = useLevels()
  const levelInfo = user?.totalPoints !== undefined ? getUserLevel(user.totalPoints) : null

  const handlePseudoSave = async () => {
    setPseudoErr('')
    setPseudoMsg('')
    const trimmed = pseudoInput.trim()
    if (trimmed.length < 3 || trimmed.length > 30) {
      setPseudoErr(t('Le pseudo doit contenir entre 3 et 30 caractères', 'Username must be between 3 and 30 characters'))
      return
    }
    setPseudoLoading(true)
    try {
      const { user: updated } = await api.updatePseudo(trimmed)
      useAuthStore.setState((s) => ({ user: s.user ? { ...s.user, pseudo: updated.pseudo } : null }))
      setPseudoMsg(t('Pseudo mis à jour', 'Username updated'))
    } catch (err: any) {
      setPseudoErr(err.message)
    } finally {
      setPseudoLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    if (newPassword.length < 6) {
      setError(t('Le nouveau mot de passe doit contenir au moins 6 caractères', 'New password must be at least 6 characters'))
      return
    }
    setLoading(true)
    try {
      await api.updatePassword({ currentPassword, newPassword })
      setMessage(t('Mot de passe modifié avec succès', 'Password changed successfully'))
      setCurrentPassword('')
      setNewPassword('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '10px 12px 10px 36px', background: 'var(--bg-secondary)',
    border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 14,
    fontFamily: 'var(--font-body)', outline: 'none',
  }

  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12 }}>
            // {t('profil', 'profile')}
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 32, fontWeight: 700, letterSpacing: '-1px' }}>{t('Mon profil', 'My profile')}</h1>
        </motion.div>

        {/* User info */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          whileHover={{ borderColor: 'var(--accent)' }}
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: 24, marginBottom: 24, transition: 'border-color 0.2s' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="" style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 0 20px rgba(0, 229, 160, 0.15)' }} />
            ) : (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{
                  width: 56, height: 56, borderRadius: '50%', background: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: 'var(--bg-primary)',
                  boxShadow: '0 0 20px rgba(0, 229, 160, 0.2)',
                }}
              >
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </motion.div>
            )}
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 600 }}>{user?.firstName} {user?.lastName}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)' }}>{user?.email}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ padding: '12px 0', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Shield size={14} color="var(--text-muted)" />
                <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('Méthode', 'Method')}</span>
              </div>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{user?.authProvider === 'google' ? 'Google' : 'Email'}</span>
            </div>
            <div style={{ padding: '12px 0', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Calendar size={14} color="var(--text-muted)" />
                <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('Membre depuis', 'Member since')}</span>
              </div>
              <span style={{ fontSize: 14, fontWeight: 500 }}>
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString(lang === 'en' ? 'en-US' : 'fr-FR', { year: 'numeric', month: 'long' }) : '-'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Pseudo */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: 24, marginBottom: 24 }}
        >
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 17, fontWeight: 600, marginBottom: 16 }}>Pseudo</h2>
          {pseudoErr && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', marginBottom: 16, fontSize: 13, color: 'var(--error)' }}>
              <AlertCircle size={16} /> {pseudoErr}
            </div>
          )}
          {pseudoMsg && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: 16, fontSize: 13, color: 'var(--success)' }}>
              <Check size={16} /> {pseudoMsg}
            </div>
          )}
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '1px' }}>
                {t('Ton pseudo', 'Your username')}
              </label>
              <div style={{ position: 'relative' }}>
                <AtSign size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="text" value={pseudoInput} onChange={(e) => setPseudoInput(e.target.value)}
                  placeholder={t('Entre ton pseudo', 'Enter your username')}
                  style={{ width: '100%', padding: '10px 12px 10px 36px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 14, fontFamily: 'var(--font-body)', outline: 'none' }}
                />
              </div>
            </div>
            <button onClick={handlePseudoSave} disabled={pseudoLoading} style={{
              padding: '10px 20px', background: 'var(--accent)', color: 'var(--bg-primary)',
              fontSize: 13, fontWeight: 600, opacity: pseudoLoading ? 0.7 : 1, whiteSpace: 'nowrap',
            }}>
              {pseudoLoading ? '...' : t('Sauvegarder', 'Save')}
            </button>
          </div>
        </motion.div>

        {/* Newsletter */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17 }}
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: 24, marginBottom: 24 }}
        >
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 17, fontWeight: 600, marginBottom: 16 }}>Newsletter</h2>
          {newsletterMsg && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: 16, fontSize: 13, color: 'var(--success)' }}>
              <Check size={16} /> {newsletterMsg}
            </div>
          )}
          <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: newsletterLoading ? 'wait' : 'pointer' }}>
            <input type="checkbox" checked={newsletterOptIn} onChange={async (e) => {
              const val = e.target.checked
              setNewsletterOptIn(val)
              setNewsletterMsg('')
              setNewsletterLoading(true)
              try {
                const { user: updated } = await api.updateNewsletter(val)
                useAuthStore.setState((s) => ({ user: s.user ? { ...s.user, newsletterOptIn: updated.newsletterOptIn } : null }))
                setNewsletterMsg(val
                  ? t('Vous recevrez nos actualites par email', 'You will receive our news by email')
                  : t('Vous ne recevrez plus nos actualites', 'You will no longer receive our news'))
              } catch {
                setNewsletterOptIn(!val)
              } finally {
                setNewsletterLoading(false)
              }
            }} style={{ accentColor: 'var(--accent)', width: 18, height: 18 }} disabled={newsletterLoading} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>
                <Bell size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
                {t('Recevoir les actualites et conseils par email', 'Receive news and tips by email')}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                {t('Nouveautes, astuces et conseils pour progresser', 'Updates, tips and advice to help you progress')}
              </div>
            </div>
          </label>
        </motion.div>

        {/* XP Level preview */}
        {levelInfo && (
          <Link to="/niveaux" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              style={{
                background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: 20, marginBottom: 24,
                cursor: 'pointer', transition: 'border-color 0.2s',
              }}
              whileHover={{ borderColor: levelInfo.currentLevel.color }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 28 }}>{allLevels[levelInfo.currentLevel.level - 1]?.icon === levelInfo.currentLevel.icon ? '' : ''}</span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 600, color: levelInfo.currentLevel.color }}>
                      {t('Niveau', 'Level')} {levelInfo.currentLevel.level} — {levelInfo.currentLevel.name}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                      {user?.totalPoints} pts {levelInfo.nextLevel ? `— ${levelInfo.pointsToNext} pts ${t('pour le prochain niveau', 'to next level')}` : `— ${t('Niveau max atteint', 'Max level reached')}`}
                    </div>
                  </div>
                </div>
                <ChevronRight size={18} color="var(--text-muted)" />
              </div>
              <div style={{ height: 6, background: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${levelInfo.progress}%`, background: levelInfo.currentLevel.color, transition: 'width 0.5s' }} />
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', marginTop: 8, textAlign: 'right' }}>
                {t('Voir tous les niveaux', 'View all levels')} →
              </div>
            </motion.div>
          </Link>
        )}

        {/* Password change */}
        {user?.authProvider === 'email' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: 24 }}
          >
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 17, fontWeight: 600, marginBottom: 16 }}>{t('Changer le mot de passe', 'Change password')}</h2>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', marginBottom: 16, fontSize: 13, color: 'var(--error)' }}>
                <AlertCircle size={16} /> {error}
              </div>
            )}
            {message && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: 16, fontSize: 13, color: 'var(--success)' }}>
                <Check size={16} /> {message}
              </div>
            )}

            <form onSubmit={handlePasswordChange}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '1px' }}>{t('Mot de passe actuel', 'Current password')}</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required style={inputStyle} />
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '1px' }}>{t('Nouveau mot de passe', 'New password')}</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required style={inputStyle} />
                </div>
              </div>
              <button type="submit" disabled={loading} style={{
                padding: '10px 20px', background: 'var(--accent)', color: 'var(--bg-primary)',
                fontSize: 13, fontWeight: 600, opacity: loading ? 0.7 : 1,
              }}>
                {loading ? t('Modification...', 'Updating...') : t('Modifier le mot de passe', 'Change password')}
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  )
}
