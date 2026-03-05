import { motion } from 'framer-motion'
import { Zap, Wrench, Cpu, Server, Network, Shield, Cloud, GitBranch, Workflow, Lock, Briefcase, Building, Database, Trophy, Crown, Star, ArrowRight, Check } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useLevels, useTranslation } from '../hooks/useTranslation'
import { getUserLevel } from '../utils/levelCalculator'

const iconMap: Record<string, React.ReactNode> = {
  Zap: <Zap size={32} />,
  Wrench: <Wrench size={32} />,
  Cpu: <Cpu size={32} />,
  Server: <Server size={32} />,
  Network: <Network size={32} />,
  Shield: <Shield size={32} />,
  Cloud: <Cloud size={32} />,
  GitBranch: <GitBranch size={32} />,
  Workflow: <Workflow size={32} />,
  Lock: <Lock size={32} />,
  Briefcase: <Briefcase size={32} />,
  Building: <Building size={32} />,
  Database: <Database size={32} />,
  Trophy: <Trophy size={32} />,
  Crown: <Crown size={32} />,
}

const iconMapLarge: Record<string, React.ReactNode> = {
  Zap: <Zap size={64} />,
  Wrench: <Wrench size={64} />,
  Cpu: <Cpu size={64} />,
  Server: <Server size={64} />,
  Network: <Network size={64} />,
  Shield: <Shield size={64} />,
  Cloud: <Cloud size={64} />,
  GitBranch: <GitBranch size={64} />,
  Workflow: <Workflow size={64} />,
  Lock: <Lock size={64} />,
  Briefcase: <Briefcase size={64} />,
  Building: <Building size={64} />,
  Database: <Database size={64} />,
  Trophy: <Trophy size={64} />,
  Crown: <Crown size={64} />,
}

export default function UserLevels() {
  const { t } = useTranslation()
  const levels = useLevels()
  const { user } = useAuthStore()
  const totalPoints = user?.totalPoints ?? 0
  const { currentLevel, nextLevel, progress, pointsToNext } = getUserLevel(totalPoints)
  const isMaxLevel = currentLevel.level === 15

  return (
    <div style={{ paddingTop: 56 }}>
      <style>{`
        .levels-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
        }
        @media (max-width: 900px) {
          .levels-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 580px) {
          .levels-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: 40 }}
        >
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--accent)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: 12,
          }}>
            {t('// niveaux', '// levels')}
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: '-1px',
            color: 'var(--text-primary)',
            marginBottom: 8,
          }}>
            {t('Systeme de Niveaux', 'Level System')}
          </h1>
          <p style={{
            fontSize: 15,
            color: 'var(--text-secondary)',
            fontWeight: 300,
            lineHeight: 1.6,
          }}>
            {t('Progressez a travers 15 niveaux d\'expertise en reseaux informatiques. Chaque niveau represente une etape vers la maitrise complete.', 'Progress through 15 levels of networking expertise. Each level represents a step toward complete mastery.')}
          </p>
        </motion.div>

        {/* Current Level Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            padding: 32,
            marginBottom: 48,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top accent bar */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: currentLevel.color,
          }} />

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 28,
            flexWrap: 'wrap',
          }}>
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{
                color: currentLevel.color,
                flexShrink: 0,
              }}
            >
              {iconMapLarge[currentLevel.icon] || <Star size={64} />}
            </motion.div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                marginBottom: 6,
              }}>
                {t('Niveau actuel', 'Current Level')}
              </div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 26,
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: 4,
              }}>
                {t('Niv.', 'Lv.')}{currentLevel.level} — {currentLevel.name}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 14,
                color: currentLevel.color,
                marginBottom: 16,
              }}>
                {totalPoints} pts
              </div>

              {/* Progress bar */}
              <div style={{
                height: 8,
                background: 'var(--bg-tertiary)',
                overflow: 'hidden',
                marginBottom: 8,
                position: 'relative',
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                  style={{
                    height: '100%',
                    background: currentLevel.color,
                  }}
                />
              </div>

              {/* Progress text */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div style={{
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                  fontWeight: 300,
                }}>
                  {isMaxLevel ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: currentLevel.color }}>
                      <Crown size={14} />
                      {t('Niveau maximum atteint !', 'Maximum level reached!')}
                    </span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
                      {pointsToNext} {t('points pour le niveau suivant', 'points to next level')}
                    </span>
                  )}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: 'var(--text-muted)',
                }}>
                  {progress}%
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ marginBottom: 20 }}
        >
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 20,
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: 4,
          }}>
            {t('Tous les niveaux', 'All Levels')}
          </h2>
          <p style={{
            fontSize: 13,
            color: 'var(--text-muted)',
            fontWeight: 300,
          }}>
            {currentLevel.level} / 15 {t('niveaux atteints', 'levels reached')}
          </p>
        </motion.div>

        {/* Levels Grid */}
        <div className="levels-grid">
          {levels.map((level, i) => {
            const isUnlocked = totalPoints >= level.minPoints
            const isCurrent = level.level === currentLevel.level
            const isPassed = totalPoints > level.maxPoints

            return (
              <motion.div
                key={level.level}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                style={{
                  background: isCurrent ? 'var(--bg-secondary)' : 'var(--bg-secondary)',
                  border: isCurrent ? '1px solid var(--accent)' : '1px solid var(--border)',
                  padding: 20,
                  position: 'relative',
                  overflow: 'hidden',
                  opacity: isUnlocked ? 1 : 0.4,
                  transition: 'opacity 0.3s',
                }}
              >
                {/* Top accent bar for current level */}
                {isCurrent && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: 'var(--accent)',
                  }} />
                )}

                {/* Level number badge */}
                <div style={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: isCurrent ? 'var(--accent)' : 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}>
                  {t('Niv.', 'Lv.')}{level.level}
                </div>

                {/* Checkmark for unlocked levels */}
                {isPassed && (
                  <div style={{
                    position: 'absolute',
                    top: 10,
                    right: 12,
                    color: level.color,
                  }}>
                    <Check size={16} />
                  </div>
                )}

                {/* Current label */}
                {isCurrent && (
                  <div style={{
                    position: 'absolute',
                    top: 10,
                    right: 12,
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    color: 'var(--accent)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    border: '1px solid var(--accent)',
                    padding: '2px 6px',
                  }}>
                    {t('Actuel', 'Current')}
                  </div>
                )}

                {/* Icon */}
                <div style={{
                  marginTop: 24,
                  marginBottom: 12,
                  color: isUnlocked ? level.color : 'var(--text-muted)',
                }}>
                  {isUnlocked
                    ? (iconMap[level.icon] || <Star size={32} />)
                    : <Lock size={32} />
                  }
                </div>

                {/* Name */}
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 15,
                  fontWeight: 600,
                  color: isUnlocked ? 'var(--text-primary)' : 'var(--text-muted)',
                  marginBottom: 6,
                }}>
                  {level.name}
                </div>

                {/* Points range */}
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: isUnlocked ? level.color : 'var(--text-muted)',
                  marginBottom: 8,
                }}>
                  {level.level === 15
                    ? '15000+ pts'
                    : `${level.minPoints} - ${level.maxPoints} pts`
                  }
                </div>

                {/* Description */}
                <div style={{
                  fontSize: 12,
                  color: 'var(--text-muted)',
                  lineHeight: 1.5,
                  fontWeight: 300,
                }}>
                  {level.description}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
