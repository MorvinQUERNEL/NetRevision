import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Coins, X, Star, TrendingUp, TrendingDown, CircleDot } from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'

interface BetModalProps {
  isOpen: boolean
  onClose: () => void
  onBet: (amount: number) => void
  onSkip: () => void
  userPoints: number
  chapterTitle: string
}

interface BetResult {
  amount: number
  won: boolean
  date: string
}

const BET_HISTORY_KEY = 'nr_bet_history'

export function saveBetResult(result: BetResult) {
  try {
    const raw = localStorage.getItem(BET_HISTORY_KEY)
    const history: BetResult[] = raw ? JSON.parse(raw) : []
    history.push(result)
    localStorage.setItem(BET_HISTORY_KEY, JSON.stringify(history))
  } catch { /* localStorage indisponible */ }
}

export function getBetHistory(): { totalBets: number; wins: number; totalProfit: number } {
  try {
    const raw = localStorage.getItem(BET_HISTORY_KEY)
    if (!raw) return { totalBets: 0, wins: 0, totalProfit: 0 }
    const history: BetResult[] = JSON.parse(raw)
    let wins = 0
    let totalProfit = 0
    for (const entry of history) {
      if (entry.won) {
        wins++
        totalProfit += entry.amount
      } else {
        totalProfit -= entry.amount
      }
    }
    return { totalBets: history.length, wins, totalProfit }
  } catch {
    return { totalBets: 0, wins: 0, totalProfit: 0 }
  }
}

const BET_OPTIONS = [50, 100, 200] as const

const COIN_SIZES: Record<number, number> = { 50: 22, 100: 28, 200: 34 }

export default function BetModal({ isOpen, onClose, onBet, onSkip, userPoints, chapterTitle }: BetModalProps) {
  const { t } = useTranslation()
  const [selected, setSelected] = useState<number | null>(null)

  const history = useMemo(() => getBetHistory(), [isOpen])

  const lastBet = useMemo(() => {
    try {
      const raw = localStorage.getItem(BET_HISTORY_KEY)
      if (!raw) return null
      const all: BetResult[] = JSON.parse(raw)
      if (all.length === 0) return null
      return all[all.length - 1]
    } catch { return null }
  }, [isOpen])

  // Reset selection when modal opens
  useEffect(() => {
    if (isOpen) setSelected(null)
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 500,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '18px 20px',
              borderBottom: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Coins size={20} style={{ color: 'var(--accent)' }} />
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 18,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}>
                  {t('Parier des points', 'Bet your points')}
                </span>
              </div>
              <button
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '20px 20px 24px' }}>
              {/* Subtitle */}
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                color: 'var(--text-secondary)',
                margin: '0 0 16px',
                lineHeight: 1.5,
              }}>
                {t('Parie tes points sur le quiz :', 'Bet your points on the quiz:')} <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{chapterTitle}</span>
              </p>

              {/* Current points */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 14px',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border)',
                marginBottom: 20,
              }}>
                <Star size={16} style={{ color: 'var(--accent)' }} />
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}>
                  {t('Tes points :', 'Your points:')} {userPoints}
                </span>
              </div>

              {/* Bet cards */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                {BET_OPTIONS.map((amount, i) => {
                  const canAfford = userPoints >= amount
                  const isSelected = selected === amount

                  return (
                    <motion.button
                      key={amount}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.25 }}
                      whileHover={canAfford ? { scale: 1.03 } : undefined}
                      whileTap={canAfford ? { scale: 0.98 } : undefined}
                      onClick={() => canAfford && setSelected(amount)}
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 6,
                        padding: '16px 8px',
                        background: isSelected ? 'var(--accent-glow)' : 'var(--bg-primary)',
                        border: isSelected ? '2px solid var(--accent)' : '1px solid var(--border)',
                        cursor: canAfford ? 'pointer' : 'not-allowed',
                        opacity: canAfford ? 1 : 0.3,
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="bet-glow"
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'var(--accent)',
                            opacity: 0.05,
                          }}
                          initial={false}
                          animate={{ opacity: [0.03, 0.08, 0.03] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        />
                      )}
                      <Coins size={COIN_SIZES[amount]} style={{ color: 'var(--accent)', position: 'relative' }} />
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 22,
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        position: 'relative',
                      }}>
                        {amount}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        fontWeight: 600,
                        color: 'var(--accent)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        position: 'relative',
                      }}>
                        {t('x2 si tu gagnes', 'x2 if you win')}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 10,
                        color: 'var(--text-muted)',
                        position: 'relative',
                      }}>
                        {t('Gagner \u2265 70% pour remporter', 'Score \u2265 70% to win')}
                      </span>
                    </motion.button>
                  )
                })}
              </div>

              {/* Risk indicator */}
              {selected !== null && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.2 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    padding: '12px 14px',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border)',
                    marginBottom: 20,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <TrendingUp size={14} style={{ color: 'var(--success)' }} />
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 13,
                      color: 'var(--success)',
                      fontWeight: 600,
                    }}>
                      {t(`Victoire (\u226570%) : +${selected} pts`, `Win (\u226570%): +${selected} pts`)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <TrendingDown size={14} style={{ color: 'var(--error)' }} />
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 13,
                      color: 'var(--error)',
                      fontWeight: 600,
                    }}>
                      {t(`Defaite (<70%) : -${selected} pts`, `Loss (<70%): -${selected} pts`)}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Bet history stats */}
              {history.totalBets > 0 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 20,
                  padding: '8px 14px',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border)',
                }}>
                  <CircleDot size={13} style={{ color: 'var(--text-muted)' }} />
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--text-muted)',
                  }}>
                    {history.totalBets} {t(`pari${history.totalBets > 1 ? 's' : ''}`, `bet${history.totalBets > 1 ? 's' : ''}`)} &middot; {history.wins} {t(`victoire${history.wins > 1 ? 's' : ''}`, `win${history.wins > 1 ? 's' : ''}`)} &middot; {t('Bilan :', 'Balance:')} {' '}
                    <span style={{ color: history.totalProfit >= 0 ? 'var(--success)' : 'var(--error)', fontWeight: 600 }}>
                      {history.totalProfit >= 0 ? '+' : ''}{history.totalProfit} pts
                    </span>
                  </span>
                </div>
              )}

              {lastBet && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginBottom: 20,
                }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--text-muted)',
                  }}>
                    {t('Dernier pari :', 'Last bet:')} {' '}
                    <span style={{ color: lastBet.won ? 'var(--success)' : 'var(--error)', fontWeight: 600 }}>
                      {lastBet.won ? '+' : '-'}{lastBet.amount} pts
                    </span>
                  </span>
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <motion.button
                  whileHover={selected !== null ? { scale: 1.01 } : undefined}
                  whileTap={selected !== null ? { scale: 0.98 } : undefined}
                  onClick={() => selected !== null && onBet(selected)}
                  disabled={selected === null}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    background: selected !== null ? 'var(--accent)' : 'var(--bg-tertiary)',
                    border: selected !== null ? '1px solid var(--accent)' : '1px solid var(--border)',
                    color: selected !== null ? 'var(--bg-primary)' : 'var(--text-muted)',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    cursor: selected !== null ? 'pointer' : 'not-allowed',
                    opacity: selected !== null ? 1 : 0.5,
                  }}
                >
                  {selected !== null ? t(`PARIER ${selected} PTS`, `BET ${selected} PTS`) : t('SELECTIONNER UN MONTANT', 'SELECT AN AMOUNT')}
                </motion.button>

                <button
                  onClick={onSkip}
                  style={{
                    width: '100%',
                    padding: '10px 20px',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-body)',
                    fontSize: 13,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    textUnderlineOffset: 3,
                  }}
                >
                  {t('Passer sans parier', 'Skip without betting')}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
