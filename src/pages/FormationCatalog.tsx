import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowLeft, BookOpen, ChevronRight } from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'
import { useFormationStore, getAllFormations, type FormationConfig } from '../stores/formationStore'
import { getIcon } from '../utils/iconMap'
import { useProgressStore } from '../stores/progressStore'
import ShaderSlider from '../components/ShaderSlider'
import gsap from 'gsap'

export default function FormationCatalog() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const setFormation = useFormationStore((s) => s.setFormation)
  const records = useProgressStore((s) => s.records)
  const formations = getAllFormations()
  const [activeIndex, setActiveIndex] = useState(0)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  const active = formations[activeIndex]

  const handleSelect = (formation: FormationConfig) => {
    setFormation(formation.id)
    navigate(`/${formation.id}`)
  }

  const handleIndexChange = useCallback((i: number) => {
    setActiveIndex(i)
  }, [])

  // GSAP text animation on slide change
  useEffect(() => {
    if (titleRef.current) {
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      )
    }
    if (descRef.current) {
      gsap.fromTo(descRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.1, ease: 'power2.out' }
      )
    }
  }, [activeIndex])

  const goNext = () => setActiveIndex((activeIndex + 1) % formations.length)
  const goPrev = () => setActiveIndex((activeIndex - 1 + formations.length) % formations.length)

  if (!active) return null

  const Icon = getIcon(active.icon)
  const totalChapters = active.programs.reduce((s, p) => s + p.chapterCount, 0)

  return (
    <div style={{ paddingTop: 56 }}>
      {/* === HERO FULLSCREEN === */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: 'var(--bg-primary)',
      }}>
        {/* Shader canvas background */}
        <ShaderSlider
          formations={formations}
          activeIndex={activeIndex}
          onIndexChange={handleIndexChange}
        />

        {/* Gradient overlays */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
          background: 'linear-gradient(to top, var(--bg-primary), transparent)',
          pointerEvents: 'none', zIndex: 1,
        }} />
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0, width: '40%',
          background: 'linear-gradient(to right, var(--bg-primary) 0%, transparent 100%)',
          pointerEvents: 'none', zIndex: 1, opacity: 0.8,
        }} />

        {/* Content */}
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '80px 24px', width: '100%',
          position: 'relative', zIndex: 2,
          display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.3fr 0.7fr',
          gap: 60, alignItems: 'center',
        }}>
          {/* Left: text */}
          <div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, color: active.accent,
              textTransform: 'uppercase', letterSpacing: '3px', marginBottom: 16,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{
                width: 6, height: 6, background: active.accent,
                display: 'inline-block',
              }} />
              {t('// catalogue des formations', '// training catalog')}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
              >
                <div style={{ color: active.accent, marginBottom: 20 }}>
                  <Icon size={48} />
                </div>

                <h1
                  ref={titleRef}
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(36px, 5.5vw, 64px)',
                    fontWeight: 700, lineHeight: 1.05,
                    letterSpacing: '-2px', marginBottom: 20,
                  }}
                >
                  {t(active.name, active.nameEn)}
                </h1>

                <p
                  ref={descRef}
                  style={{
                    fontSize: 17, color: 'var(--text-secondary)', lineHeight: 1.7,
                    maxWidth: 520, marginBottom: 32, fontWeight: 300,
                  }}
                >
                  {t(active.description, active.descriptionEn)}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 32, marginBottom: 36 }}>
              <div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700,
                  color: active.accent,
                }}>
                  {totalChapters}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11,
                  color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px',
                }}>
                  {t('chapitres', 'chapters')}
                </div>
              </div>
              <div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700,
                  color: active.accent,
                }}>
                  {active.programs.length}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11,
                  color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px',
                }}>
                  {t('programmes', 'programs')}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSelect(active)}
                style={{
                  padding: '14px 32px', background: active.accent,
                  color: '#080b1a', fontSize: 15, fontWeight: 700,
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 10,
                  fontFamily: 'var(--font-body)',
                  boxShadow: `0 0 30px ${active.accent}40`,
                }}
              >
                {t('Commencer', 'Start')} <ArrowRight size={18} />
              </motion.button>

              {/* Nav arrows */}
              {formations.length > 1 && (
                <div style={{ display: 'flex', gap: 4 }}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={goPrev}
                    style={{
                      width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
                      color: 'var(--text-secondary)', cursor: 'pointer',
                    }}
                  >
                    <ArrowLeft size={18} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={goNext}
                    style={{
                      width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
                      color: 'var(--text-secondary)', cursor: 'pointer',
                    }}
                  >
                    <ArrowRight size={18} />
                  </motion.button>
                </div>
              )}
            </div>
          </div>

          {/* Right: programs list */}
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div style={{
                background: 'rgba(15, 19, 40, 0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.06)',
                padding: 0,
                overflow: 'hidden',
              }}>
                <div style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  fontFamily: 'var(--font-mono)', fontSize: 11,
                  color: active.accent, textTransform: 'uppercase',
                  letterSpacing: '2px',
                }}>
                  {t('Programmes', 'Programs')}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {active.programs.map((prog, i) => (
                      <motion.div
                        key={prog.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        style={{
                          padding: '14px 20px',
                          borderBottom: i < active.programs.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                          display: 'flex', alignItems: 'center', gap: 12,
                          cursor: 'pointer',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.background = 'transparent'
                        }}
                      >
                        <div style={{
                          width: 3, height: 32, background: prog.color,
                        }} />
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 600,
                            marginBottom: 2,
                          }}>
                            {t(prog.name, prog.nameEn)}
                          </div>
                          <div style={{
                            fontFamily: 'var(--font-mono)', fontSize: 11,
                            color: 'var(--text-muted)',
                          }}>
                            {prog.chapterCount} {t('chapitres', 'chapters')}
                          </div>
                        </div>
                        <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* === MOBILE CARDS FALLBACK === */}
      {isMobile && (
        <section style={{ padding: '40px 24px 80px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {formations.map((formation, i) => {
              const FIcon = getIcon(formation.icon)
              const total = formation.programs.reduce((s, p) => s + p.chapterCount, 0)
              return (
                <motion.button
                  key={formation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(formation)}
                  style={{
                    width: '100%', textAlign: 'left', cursor: 'pointer',
                    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                    padding: 0, position: 'relative', overflow: 'hidden',
                  }}
                >
                  <div style={{ height: 3, background: formation.accent }} />
                  <div style={{ padding: '28px 24px' }}>
                    <div style={{ color: formation.accent, marginBottom: 16 }}>
                      <FIcon size={32} />
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700,
                      letterSpacing: '-0.5px', marginBottom: 8,
                    }}>
                      {t(formation.name, formation.nameEn)}
                    </div>
                    <p style={{
                      fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6,
                      marginBottom: 20, fontWeight: 300,
                    }}>
                      {t(formation.description, formation.descriptionEn)}
                    </p>
                    <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
                      {formation.programs.map(p => (
                        <div key={p.id} style={{ flex: 1, height: 4, background: p.color }} />
                      ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <BookOpen size={14} style={{ color: formation.accent }} />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>
                          {total} {t('chapitres', 'chapters')}
                        </span>
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>
                        {formation.programs.length} {t('programmes', 'programs')}
                      </span>
                    </div>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      padding: '10px 20px', background: formation.accent,
                      color: '#080b1a', fontSize: 14, fontWeight: 600,
                    }}>
                      {t('Commencer', 'Start')} <ArrowRight size={16} />
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </section>
      )}

      {/* === ALL FORMATIONS GRID (below hero on desktop) === */}
      {!isMobile && formations.length > 2 && (
        <section style={{
          maxWidth: 1200, margin: '0 auto', padding: '80px 24px 120px',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)',
            textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 24,
          }}>
            {t('// toutes les formations', '// all programs')}
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 2,
          }}>
            {formations.map((formation, i) => {
              const FIcon = getIcon(formation.icon)
              const total = formation.programs.reduce((s, p) => s + p.chapterCount, 0)
              return (
                <motion.div
                  key={formation.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <button
                    onClick={() => handleSelect(formation)}
                    style={{
                      width: '100%', textAlign: 'left', cursor: 'pointer',
                      background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                      padding: 0, position: 'relative', overflow: 'hidden',
                      transition: 'border-color 0.2s, box-shadow 0.3s',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = formation.accent;
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 30px ${formation.accent}15`
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                      (e.currentTarget as HTMLElement).style.boxShadow = 'none'
                    }}
                  >
                    <div style={{ height: 3, background: formation.accent }} />
                    <div style={{ padding: '28px 24px' }}>
                      <div style={{ color: formation.accent, marginBottom: 14 }}>
                        <FIcon size={28} />
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700,
                        letterSpacing: '-0.5px', marginBottom: 8,
                      }}>
                        {t(formation.name, formation.nameEn)}
                      </div>
                      <div style={{ display: 'flex', gap: 16, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
                        <span>{total} {t('chapitres', 'chapters')}</span>
                        <span>{formation.programs.length} {t('programmes', 'programs')}</span>
                      </div>
                    </div>
                  </button>
                </motion.div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
