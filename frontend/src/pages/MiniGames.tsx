import { motion } from 'framer-motion'
import { ArrowLeft, Star, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLangStore } from '../stores/langStore'
import { useFormationFromUrl } from '../hooks/useTranslation'
import { getFormation, isValidFormation } from '../stores/formationStore'
import { getIcon } from '../utils/iconMap'

function getBestScore(key: string): number | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (typeof data === 'object' && data !== null && 'bestStars' in data) return data.bestStars
    return null
  } catch {
    return null
  }
}

export default function MiniGames() {
  const lang = useLangStore((s) => s.lang)
  const t = (fr: string, en: string) => lang === 'en' ? en : fr
  const formation = useFormationFromUrl()
  const config = isValidFormation(formation) ? getFormation(formation) : null
  const games = config?.games ?? []

  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px' }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Link to={`/${formation}/dashboard`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 13, textDecoration: 'none', marginBottom: 24 }}>
            <ArrowLeft size={14} /> {t('Retour au dashboard', 'Back to dashboard')}
          </Link>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12 }}>
            {t('// MINI-JEUX', '// MINI-GAMES')}
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 32, fontWeight: 700, marginBottom: 8, letterSpacing: '-1px' }}>
            {t(`Mini-Jeux ${config?.name ?? ''}`, `${config?.nameEn ?? ''} Mini-Games`)}
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 40, fontWeight: 300, maxWidth: 600 }}>
            {t('Teste tes connaissances en t\'amusant avec ces mini-jeux interactifs.', 'Test your knowledge while having fun with these interactive mini-games.')}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 2 }}>
            {games.map((game, i) => {
              const best = game.storageKey ? getBestScore(game.storageKey) : null
              const isDisabled = game.disabled
              const Wrapper = isDisabled ? 'div' : Link
              const wrapperProps = isDisabled ? {} : { to: `/${formation}/${game.path}` }
              const GameIcon = getIcon(game.icon)
              return (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={{ perspective: 800 }}
                >
                  <Wrapper {...wrapperProps as any} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <motion.div
                      whileHover={isDisabled ? {} : { rotateX: -2, rotateY: 3, scale: 1.02, boxShadow: `0 12px 40px ${game.color}20, 0 0 0 1px ${game.color}30` }}
                      whileTap={isDisabled ? {} : { scale: 0.98 }}
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border)',
                        padding: 32, display: 'flex', flexDirection: 'column', gap: 20,
                        transition: 'border-color 0.3s, box-shadow 0.3s',
                        cursor: isDisabled ? 'default' : 'pointer',
                        height: '100%', opacity: isDisabled ? 0.5 : 1,
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      <div style={{ width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${game.color}15`, border: `1px solid ${game.color}30`, color: game.color }}>
                        <GameIcon size={32} />
                      </div>

                      <div>
                        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.5px' }}>
                          {t(game.titleFr, game.titleEn)}
                        </h2>
                        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, fontWeight: 300 }}>
                          {t(game.descriptionFr, game.descriptionEn)}
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Trophy size={14} style={{ color: game.color }} />
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
                            {t(game.difficulty, game.difficultyEn)}
                          </span>
                        </div>
                        {best !== null && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Star size={13} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>
                              {best}
                            </span>
                          </div>
                        )}
                      </div>

                      <motion.div
                        whileHover={isDisabled ? {} : { x: 4, boxShadow: `0 4px 16px ${game.color}40` }}
                        whileTap={isDisabled ? {} : { scale: 0.97 }}
                        style={{
                          padding: '10px 20px',
                          background: isDisabled ? 'var(--border)' : game.color,
                          color: isDisabled ? 'var(--text-muted)' : '#080b1a',
                          fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)',
                          letterSpacing: '1px', textTransform: 'uppercase', textAlign: 'center', border: 'none',
                          transition: 'box-shadow 0.2s',
                        }}
                      >
                        {isDisabled ? t('BIENTOT', 'SOON') : t('JOUER', 'PLAY')}
                      </motion.div>
                    </motion.div>
                  </Wrapper>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
