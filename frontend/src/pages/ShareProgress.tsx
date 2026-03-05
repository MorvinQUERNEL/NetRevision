import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Copy, Share2, Trophy, BookOpen, Target, Flame, Check } from 'lucide-react'
import html2canvas from 'html2canvas'
import { useAuthStore } from '../stores/authStore'
import { useProgressStore } from '../stores/progressStore'
import { useChapters, useTranslation } from '../hooks/useTranslation'
const SITE_URL = 'https://netrevision.fr'

export default function ShareProgress() {
  const { t, lang } = useTranslation()
  const allChapters = useChapters()
  const TOTAL_CHAPTERS = allChapters.length
  const cardRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  const user = useAuthStore((s) => s.user)
  const records = useProgressStore((s) => s.records)

  // Compute stats
  const completedCourses = records.filter((r) => r.courseCompleted).length
  const completedQuizzes = records.filter((r) => r.quizScore !== null)
  const avgScore =
    completedQuizzes.length > 0
      ? Math.round(
          completedQuizzes.reduce((sum, r) => sum + (r.quizScore || 0), 0) /
            completedQuizzes.length
        )
      : 0
  const progressPercent = Math.round((completedCourses / TOTAL_CHAPTERS) * 100)

  const stats = [
    {
      icon: BookOpen,
      label: t('Chapitres completees', 'Chapters completed'),
      value: `${completedCourses}/${TOTAL_CHAPTERS}`,
    },
    {
      icon: Target,
      label: t('Score moyen quiz', 'Average quiz score'),
      value: `${avgScore}%`,
    },
    {
      icon: Trophy,
      label: t('Points totaux', 'Total points'),
      value: `${user?.totalPoints || 0}`,
    },
    {
      icon: Flame,
      label: 'Streak',
      value: `${user?.loginStreak || 0} ${t('jours', 'days')}`,
    },
  ]

  const handleDownload = async () => {
    if (!cardRef.current || isDownloading) return
    setIsDownloading(true)
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#080b1a',
        scale: 2,
        useCORS: true,
        logging: false,
      })
      const link = document.createElement('a')
      link.download = `netrevision-progression-${user?.firstName || 'user'}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('Erreur lors de la capture:', err)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(SITE_URL)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2500)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = SITE_URL
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2500)
    }
  }

  return (
    <div style={{ paddingTop: 56 }}>
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '48px 24px 80px',
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: 40 }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--accent)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: 12,
            }}
          >
            {t('// partage', '// share')}
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: '-1px',
              marginBottom: 8,
            }}
          >
            {t('Partager ma Progression', 'Share my Progress')}
          </h1>
          <p
            style={{
              fontSize: 15,
              color: 'var(--text-secondary)',
              fontWeight: 300,
              maxWidth: 560,
              lineHeight: 1.6,
            }}
          >
            {t('Generez une image de votre progression et partagez-la avec vos amis ou sur les reseaux sociaux.', 'Generate an image of your progress and share it with your friends or on social media.')}
          </p>
        </motion.div>

        {/* Achievement Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{ marginBottom: 40 }}
        >
          <div
            ref={cardRef}
            style={{
              maxWidth: 1200,
              width: '100%',
              aspectRatio: '1200 / 630',
              background: '#080b1a',
              padding: 48,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid #1e293b',
            }}
          >
            {/* Subtle grid background */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage:
                  'linear-gradient(rgba(0,229,160,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,160,0.03) 1px, transparent 1px)',
                backgroundSize: '60px 60px',
                pointerEvents: 'none',
              }}
            />

            {/* Top section: Logo + User */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 28,
                    fontWeight: 700,
                    color: '#e2e8f0',
                    letterSpacing: '-1px',
                  }}
                >
                  net
                  <span style={{ color: '#00e5a0' }}>revision</span>
                </div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    color: '#475569',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    marginTop: 4,
                  }}
                >
                  {t('Plateforme de revision reseaux', 'Network study platform')}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 22,
                    fontWeight: 600,
                    color: '#e2e8f0',
                  }}
                >
                  {user?.firstName || t('Utilisateur', 'User')}
                </div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                    color: '#00e5a0',
                    marginTop: 2,
                  }}
                >
                  {t('Progression personnelle', 'Personal progress')}
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 20,
                position: 'relative',
                zIndex: 1,
              }}
            >
              {stats.map((stat, i) => {
                const Icon = stat.icon
                return (
                  <div
                    key={i}
                    style={{
                      background: '#0f1328',
                      border: '1px solid #1e293b',
                      padding: '20px 16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <Icon size={16} color="#00e5a0" />
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 10,
                          color: '#94a3b8',
                          textTransform: 'uppercase',
                          letterSpacing: '1.5px',
                        }}
                      >
                        {stat.label}
                      </span>
                    </div>
                    <div
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: 32,
                        fontWeight: 700,
                        color: '#e2e8f0',
                        letterSpacing: '-1px',
                      }}
                    >
                      {stat.value}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Progress bar section */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Work Sans', sans-serif",
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#94a3b8',
                  }}
                >
                  {t('Progression globale', 'Overall progress')}
                </span>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 16,
                    fontWeight: 600,
                    color: '#00e5a0',
                  }}
                >
                  {progressPercent}%
                </span>
              </div>
              <div
                style={{
                  height: 8,
                  background: '#161b35',
                  overflow: 'hidden',
                  width: '100%',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${progressPercent}%`,
                    background:
                      'linear-gradient(90deg, #00e5a0, #00ffb3)',
                    transition: 'width 0.8s ease',
                  }}
                />
              </div>
            </div>

            {/* Footer / URL */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                  color: '#475569',
                }}
              >
                netrevision.fr
              </span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Share2 size={12} color="#475569" />
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    color: '#475569',
                  }}
                >
                  {t('Rejoingnez-nous', 'Join us')}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          style={{
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          {/* Download button */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '14px 28px',
              background: '#00e5a0',
              color: '#080b1a',
              border: 'none',
              fontFamily: "'Work Sans', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              cursor: isDownloading ? 'wait' : 'pointer',
              opacity: isDownloading ? 0.7 : 1,
              transition: 'opacity 0.2s, background 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!isDownloading)
                (e.currentTarget as HTMLButtonElement).style.background =
                  '#00ffb3'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                '#00e5a0'
            }}
          >
            <Download size={18} />
            {isDownloading ? t('Generation en cours...', 'Generating...') : t("Telecharger l'image", 'Download image')}
          </button>

          {/* Copy link button */}
          <button
            onClick={handleCopyLink}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '14px 28px',
              background: 'transparent',
              color: linkCopied ? '#00e5a0' : 'var(--text-primary)',
              border: `1px solid ${linkCopied ? '#00e5a0' : 'var(--border)'}`,
              fontFamily: "'Work Sans', sans-serif",
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!linkCopied) {
                ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                  '#00e5a0'
                ;(e.currentTarget as HTMLButtonElement).style.color = '#00e5a0'
              }
            }}
            onMouseLeave={(e) => {
              if (!linkCopied) {
                ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                  'var(--border)'
                ;(e.currentTarget as HTMLButtonElement).style.color =
                  'var(--text-primary)'
              }
            }}
          >
            {linkCopied ? <Check size={18} /> : <Copy size={18} />}
            {linkCopied ? t('Lien copie !', 'Link copied!') : t('Copier le lien', 'Copy link')}
          </button>
        </motion.div>
      </div>
    </div>
  )
}
