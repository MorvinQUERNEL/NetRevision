import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Award, Lock, LogIn, BookOpen, ClipboardCheck, Star, Flag, GraduationCap, Trophy, Zap, PenTool, Crown, Flame, Map, MapPin, Target, Sparkles, ShieldCheck, Medal, Layers, Brain, Coins, Gem, Diamond, CalendarCheck, Shield, FileText, CheckCircle } from 'lucide-react'
import { api } from '../services/api'
import { useTranslation } from '../hooks/useTranslation'

const iconMap: Record<string, React.ReactNode> = {
  LogIn: <LogIn size={24} />,
  BookOpen: <BookOpen size={24} />,
  ClipboardCheck: <ClipboardCheck size={24} />,
  Star: <Star size={24} />,
  Flag: <Flag size={24} />,
  GraduationCap: <GraduationCap size={24} />,
  Trophy: <Trophy size={24} />,
  Award: <Award size={24} />,
  Zap: <Zap size={24} />,
  PenTool: <PenTool size={24} />,
  Crown: <Crown size={24} />,
  Flame: <Flame size={24} />,
  Map: <Map size={24} />,
  MapPin: <MapPin size={24} />,
  Target: <Target size={24} />,
  Sparkles: <Sparkles size={24} />,
  ShieldCheck: <ShieldCheck size={24} />,
  Medal: <Medal size={24} />,
  Layers: <Layers size={24} />,
  Brain: <Brain size={24} />,
  Coins: <Coins size={24} />,
  Gem: <Gem size={24} />,
  Diamond: <Diamond size={24} />,
  CalendarCheck: <CalendarCheck size={24} />,
  Shield: <Shield size={24} />,
  FileText: <FileText size={24} />,
  CheckCircle: <CheckCircle size={24} />,
}

interface BadgeData {
  id: number; slug: string; name: string; description: string
  icon: string; category: string; unlocked: boolean; unlockedAt: string | null
}

export default function Badges() {
  const [badges, setBadges] = useState<BadgeData[]>([])
  const [loading, setLoading] = useState(true)
  const { t, lang } = useTranslation()

  const categoryLabels: Record<string, string> = {
    milestone: t('Jalons', 'Milestones'),
    learning: t('Apprentissage', 'Learning'),
    achievement: t('Accomplissements', 'Achievements'),
    challenge: t('Défis', 'Challenges'),
    engagement: t('Engagement', 'Engagement'),
    social: t('Social', 'Social'),
  }

  useEffect(() => {
    api.getBadges().then((d) => setBadges(d.badges)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const unlockedCount = badges.filter((b) => b.unlocked).length
  const categories = [...new Set(badges.map((b) => b.category))]

  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px' }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-warm)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12 }}>
            // {t('badges & succès', 'badges & achievements')}
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 32, fontWeight: 700, letterSpacing: '-1px', marginBottom: 8 }}>
            {t('Collection de badges', 'Badge collection')}
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', fontWeight: 300 }}>
            {unlockedCount} / {badges.length} {t('badges débloqués', 'badges unlocked')}
          </p>
          {/* Progress bar */}
          <div style={{ height: 4, background: 'var(--bg-tertiary)', borderRadius: 2, marginTop: 12, maxWidth: 300, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${badges.length ? (unlockedCount / badges.length) * 100 : 0}%`, background: 'var(--accent-warm)', borderRadius: 2, transition: 'width 0.5s' }} />
          </div>
        </motion.div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>{t('Chargement...', 'Loading...')}</div>
        ) : (
          categories.map((cat) => (
            <div key={cat} style={{ marginBottom: 40 }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 600, marginBottom: 16, color: 'var(--text-secondary)' }}>
                {categoryLabels[cat] || cat}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 2 }}>
                {badges.filter((b) => b.category === cat).map((badge, i) => (
                  <motion.div
                    key={badge.slug}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    whileHover={badge.unlocked ? { scale: 1.02, boxShadow: '0 4px 20px rgba(245, 158, 11, 0.12)' } : {}}
                    style={{
                      background: badge.unlocked ? 'var(--bg-secondary)' : 'var(--bg-primary)',
                      border: `1px solid ${badge.unlocked ? 'var(--accent-warm)' : 'var(--border)'}`,
                      padding: 20, position: 'relative', overflow: 'hidden',
                      opacity: badge.unlocked ? 1 : 0.5,
                      filter: badge.unlocked ? 'none' : 'grayscale(0.8)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {badge.unlocked && (
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--accent-warm)' }} />
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                      <div style={{ color: badge.unlocked ? 'var(--accent-warm)' : 'var(--text-muted)' }}>
                        {badge.unlocked ? (iconMap[badge.icon] || <Award size={24} />) : <Lock size={24} />}
                      </div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{badge.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>{badge.description}</div>
                    {badge.unlocked && badge.unlockedAt && (
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', marginTop: 8 }}>
                        {new Date(badge.unlockedAt).toLocaleDateString(lang === 'en' ? 'en-US' : 'fr-FR')}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
