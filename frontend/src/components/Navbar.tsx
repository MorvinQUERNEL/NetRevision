import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, BookOpen, BarChart3, Trophy, Award, User, StickyNote, LayoutDashboard, LogOut, GraduationCap, Wrench, ChevronDown, Sun, Moon, Search, PieChart, MessageSquare, FileText, Share2, Compass, Gamepad2 } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useThemeStore } from '../stores/themeStore'
import { useLangStore } from '../stores/langStore'
import { useFormationStore, getFormation, isValidFormation } from '../stores/formationStore'
import { getIcon } from '../utils/iconMap'
import { getUserLevel } from '../utils/levelCalculator'

export default function Navbar() {
  const { lang, toggle: toggleLang } = useLangStore()
  const t = (fr: string, en: string) => lang === 'en' ? en : fr
  const formation = useFormationStore((s) => s.currentFormation)

  // Build dynamic tool/game/feature links from formation config
  const config = isValidFormation(formation) ? getFormation(formation) : null

  const toolLinks = (config?.tools ?? []).map(tool => ({
    to: `/${formation}/${tool.path}`,
    label: t(tool.labelFr, tool.labelEn),
    icon: getIcon(tool.icon),
  }))

  const gameLinks = config ? [
    { to: `/${formation}/mini-jeux`, label: t('Mini-Jeux', 'Mini-Games'), icon: Gamepad2 },
    { to: `/${formation}/survie`, label: t('Mode Survie', 'Survival Mode'), icon: getIcon('Flame') },
    { to: `/${formation}/duel`, label: t('Mode Duel', 'Duel Mode'), icon: getIcon('Swords') },
    { to: `/${formation}/ctf`, label: 'CTF Challenges', icon: getIcon('Flag') },
  ] : []

  const featureLinks = [
    ...(config?.features ?? []).map(feat => ({
      to: `/${formation}/${feat.path}`,
      label: t(feat.labelFr, feat.labelEn),
      icon: getIcon(feat.icon),
    })),
    { to: '/notes', label: 'Notes', icon: StickyNote },
    { to: '/forum', label: 'Forum', icon: MessageSquare },
    { to: '/analytics', label: 'Analytics', icon: PieChart },
    { to: '/partage', label: t('Partager', 'Share'), icon: Share2 },
    { to: '/blog', label: 'Blog', icon: FileText },
  ]

  const [open, setOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)
  const [gamesOpen, setGamesOpen] = useState(false)
  const [featuresOpen, setFeaturesOpen] = useState(false)
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false)
  const [mobileGamesOpen, setMobileGamesOpen] = useState(false)
  const [mobileFeaturesOpen, setMobileFeaturesOpen] = useState(false)
  const toolsRef = useRef<HTMLDivElement>(null)
  const gamesRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuthStore()
  const { theme, toggle: toggleTheme } = useThemeStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) setToolsOpen(false)
      if (gamesRef.current && !gamesRef.current.contains(e.target as Node)) setGamesOpen(false)
      if (featuresRef.current && !featuresRef.current.contains(e.target as Node)) setFeaturesOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    setToolsOpen(false)
    setGamesOpen(false)
    setFeaturesOpen(false)
    setOpen(false)
  }, [location.pathname])

  const publicLinks = [
    { to: `/${formation}/cours`, label: t('Cours', 'Courses'), icon: BookOpen },
    { to: '/blog', label: 'Blog', icon: FileText },
    { to: '/login', label: t('Connexion', 'Login'), icon: User },
  ]

  const authLinks = [
    { to: `/${formation}/dashboard`, label: 'Dashboard', icon: LayoutDashboard },
    { to: `/${formation}/cours`, label: t('Cours', 'Courses'), icon: BookOpen },
    { to: `/${formation}/progression`, label: t('Progression', 'Progress'), icon: BarChart3 },
    { to: `/${formation}/examens`, label: t('Examens', 'Exams'), icon: GraduationCap },
    { to: '/leaderboard', label: t('Classement', 'Ranking'), icon: Trophy },
    { to: '/badges', label: 'Badges', icon: Award },
  ]

  const links = isAuthenticated ? authLinks : publicLinks
  const isToolActive = toolLinks.some(tl => location.pathname === tl.to)
  const isGameActive = gameLinks.some(tl => location.pathname === tl.to || location.pathname.startsWith(tl.to + '/'))
  const isFeatureActive = featureLinks.some(tl => location.pathname === tl.to)

  const renderIconLink = (IconComp: any, size: number = 14) => <IconComp size={size} />

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: 56,
      background: 'var(--nav-bg)', backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)', zIndex: 1000,
      display: 'flex', alignItems: 'center', padding: '0 24px',
    }}>
      <div style={{
        maxWidth: 1200, width: '100%', margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link to={isAuthenticated ? `/${formation}` : '/'} style={{ display: 'flex', alignItems: 'center', gap: 10, transition: 'filter 0.3s' }}
          onMouseEnter={(e) => { e.currentTarget.style.filter = 'drop-shadow(0 0 8px var(--accent-glow))' }}
          onMouseLeave={(e) => { e.currentTarget.style.filter = 'none' }}
        >
          <img src="/logo.png" alt="NR" style={{ width: 32, height: 32, objectFit: 'contain' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>
            net<span style={{ color: 'var(--accent)' }}>revision</span>
          </span>
        </Link>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 2,
          background: 'var(--bg-secondary)', padding: 3, borderRadius: 4,
          border: '1px solid var(--border)',
        }} className="desktop-nav">
          {links.map(l => {
            const active = location.pathname === l.to
            return (
              <Link key={l.to} to={l.to} style={{
                padding: '6px 12px', borderRadius: 3, fontSize: 12,
                fontWeight: 500, fontFamily: 'var(--font-body)',
                color: active ? 'var(--bg-primary)' : 'var(--text-secondary)',
                background: active ? 'var(--accent)' : 'transparent',
                transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
              }}>
                {renderIconLink(l.icon)} {l.label}
              </Link>
            )
          })}
          {isAuthenticated && (
            <>
              {/* Outils dropdown */}
              <div ref={toolsRef} style={{ position: 'relative' }}>
                <button onClick={() => setToolsOpen(!toolsOpen)} style={{
                  padding: '6px 12px', borderRadius: 3, fontSize: 12,
                  fontWeight: 500, fontFamily: 'var(--font-body)',
                  color: isToolActive ? 'var(--bg-primary)' : 'var(--text-secondary)',
                  background: isToolActive ? 'var(--accent)' : 'transparent',
                  transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
                  cursor: 'pointer', border: 'none',
                }}>
                  <Wrench size={14} /> {t('Outils', 'Tools')} <ChevronDown size={12} style={{ transition: 'transform 0.2s', transform: toolsOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                </button>
                <AnimatePresence>
                  {toolsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25, mass: 0.5 }}
                      style={{
                        position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                        padding: 6, minWidth: 220, zIndex: 1001,
                        display: 'flex', flexDirection: 'column', gap: 2,
                      }}
                    >
                      {toolLinks.map(tl => {
                        const active = location.pathname === tl.to
                        return (
                          <Link key={tl.to} to={tl.to} style={{
                            padding: '8px 12px', fontSize: 13, fontWeight: 500,
                            fontFamily: 'var(--font-body)',
                            color: active ? 'var(--accent)' : 'var(--text-secondary)',
                            display: 'flex', alignItems: 'center', gap: 8, transition: 'color 0.15s',
                          }}>
                            {renderIconLink(tl.icon)} {tl.label}
                          </Link>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {/* Jeux dropdown */}
              <div ref={gamesRef} style={{ position: 'relative' }}>
                <button onClick={() => setGamesOpen(!gamesOpen)} style={{
                  padding: '6px 12px', borderRadius: 3, fontSize: 12,
                  fontWeight: 500, fontFamily: 'var(--font-body)',
                  color: isGameActive ? 'var(--bg-primary)' : 'var(--text-secondary)',
                  background: isGameActive ? 'var(--accent)' : 'transparent',
                  transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
                  cursor: 'pointer', border: 'none',
                }}>
                  <Gamepad2 size={14} /> {t('Jeux', 'Games')} <ChevronDown size={12} style={{ transition: 'transform 0.2s', transform: gamesOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                </button>
                <AnimatePresence>
                  {gamesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25, mass: 0.5 }}
                      style={{
                        position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                        padding: 6, minWidth: 220, zIndex: 1001,
                        display: 'flex', flexDirection: 'column', gap: 2,
                      }}
                    >
                      {gameLinks.map(tl => {
                        const active = location.pathname === tl.to
                        return (
                          <Link key={tl.to} to={tl.to} style={{
                            padding: '8px 12px', fontSize: 13, fontWeight: 500,
                            fontFamily: 'var(--font-body)',
                            color: active ? 'var(--accent)' : 'var(--text-secondary)',
                            display: 'flex', alignItems: 'center', gap: 8, transition: 'color 0.15s',
                          }}>
                            {renderIconLink(tl.icon)} {tl.label}
                          </Link>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {/* Plus dropdown */}
              <div ref={featuresRef} style={{ position: 'relative' }}>
                <button onClick={() => setFeaturesOpen(!featuresOpen)} style={{
                  padding: '6px 12px', borderRadius: 3, fontSize: 12,
                  fontWeight: 500, fontFamily: 'var(--font-body)',
                  color: isFeatureActive ? 'var(--bg-primary)' : 'var(--text-secondary)',
                  background: isFeatureActive ? 'var(--accent)' : 'transparent',
                  transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
                  cursor: 'pointer', border: 'none',
                }}>
                  <Compass size={14} /> {t('Plus', 'More')} <ChevronDown size={12} style={{ transition: 'transform 0.2s', transform: featuresOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                </button>
                <AnimatePresence>
                  {featuresOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25, mass: 0.5 }}
                      style={{
                        position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                        padding: 6, minWidth: 220, zIndex: 1001,
                        display: 'flex', flexDirection: 'column', gap: 2,
                      }}
                    >
                      {featureLinks.map(tl => {
                        const active = location.pathname === tl.to
                        return (
                          <Link key={tl.to} to={tl.to} style={{
                            padding: '8px 12px', fontSize: 13, fontWeight: 500,
                            fontFamily: 'var(--font-body)',
                            color: active ? 'var(--accent)' : 'var(--text-secondary)',
                            display: 'flex', alignItems: 'center', gap: 8, transition: 'color 0.15s',
                          }}>
                            {renderIconLink(tl.icon)} {tl.label}
                          </Link>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button onClick={toggleLang} title={lang === 'fr' ? 'Switch to English' : 'Passer en français'} style={{
                padding: '6px 8px', borderRadius: 3,
                color: 'var(--accent)', background: 'transparent',
                display: 'flex', alignItems: 'center',
                fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700,
                border: 'none', cursor: 'pointer', letterSpacing: '0.5px',
              }}>
                {lang === 'fr' ? 'EN' : 'FR'}
              </button>
              <button onClick={() => document.dispatchEvent(new CustomEvent('open-search'))} title={t('Rechercher (Ctrl+K)', 'Search (Ctrl+K)')} style={{
                padding: '6px 8px', borderRadius: 3,
                color: 'var(--text-muted)', background: 'transparent',
                display: 'flex', alignItems: 'center', gap: 4, border: 'none', cursor: 'pointer',
              }}>
                <Search size={14} />
              </button>
              <Link to="/profil" style={{
                padding: '6px 12px', borderRadius: 3, fontSize: 12,
                fontWeight: 500, fontFamily: 'var(--font-body)',
                color: location.pathname === '/profil' ? 'var(--bg-primary)' : 'var(--text-secondary)',
                background: location.pathname === '/profil' ? 'var(--accent)' : 'transparent',
                transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <User size={14} /> {user?.firstName}
                {user?.totalPoints !== undefined && (
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
                    padding: '1px 6px', marginLeft: 2,
                    background: `${getUserLevel(user.totalPoints).currentLevel.color}20`,
                    color: getUserLevel(user.totalPoints).currentLevel.color,
                    border: `1px solid ${getUserLevel(user.totalPoints).currentLevel.color}40`,
                  }}>
                    {t('Niv.', 'Lvl.')}{getUserLevel(user.totalPoints).currentLevel.level}
                  </span>
                )}
              </Link>
              <button onClick={toggleTheme} title={theme === 'dark' ? t('Mode clair', 'Light mode') : t('Mode sombre', 'Dark mode')} style={{
                padding: '6px 8px', borderRadius: 3,
                color: 'var(--text-muted)', background: 'transparent',
                display: 'flex', alignItems: 'center',
              }}>
                {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              </button>
              <button onClick={handleLogout} style={{
                padding: '6px 10px', borderRadius: 3, fontSize: 12,
                color: 'var(--text-muted)', background: 'transparent',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <LogOut size={14} />
              </button>
            </>
          )}
          {!isAuthenticated && (
            <>
              <button onClick={toggleLang} title={lang === 'fr' ? 'Switch to English' : 'Passer en français'} style={{
                padding: '6px 8px', borderRadius: 3,
                color: 'var(--accent)', background: 'transparent',
                display: 'flex', alignItems: 'center',
                fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700,
                border: 'none', cursor: 'pointer', letterSpacing: '0.5px',
              }}>
                {lang === 'fr' ? 'EN' : 'FR'}
              </button>
              <button onClick={toggleTheme} title={theme === 'dark' ? t('Mode clair', 'Light mode') : t('Mode sombre', 'Dark mode')} style={{
                padding: '6px 8px', borderRadius: 3,
                color: 'var(--text-muted)', background: 'transparent',
                display: 'flex', alignItems: 'center',
              }}>
                {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              </button>
            </>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="mobile-toggle" style={{
          display: 'none', background: 'var(--bg-secondary)',
          border: '1px solid var(--border)', borderRadius: 4, padding: 6, color: 'var(--text-primary)',
        }}>
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            style={{
              position: 'absolute', top: 56, left: 0, right: 0,
              background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)',
              padding: 12, display: 'flex', flexDirection: 'column', gap: 2,
              maxHeight: 'calc(100dvh - 56px)', overflowY: 'auto',
            }}
          >
            {links.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} style={{
                padding: '10px 14px', borderRadius: 4, fontSize: 14, fontWeight: 500,
                color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8,
              }}>
                {renderIconLink(l.icon)} {l.label}
              </Link>
            ))}
            {isAuthenticated && (
              <>
                <button onClick={() => setMobileToolsOpen(!mobileToolsOpen)} style={{
                  padding: '10px 14px', borderRadius: 4, fontSize: 14, fontWeight: 500,
                  color: 'var(--text-primary)', background: 'transparent', border: 'none',
                  display: 'flex', alignItems: 'center', gap: 8, width: '100%', textAlign: 'left', cursor: 'pointer',
                }}>
                  <Wrench size={14} /> {t('Outils', 'Tools')} <ChevronDown size={12} style={{ marginLeft: 'auto', transition: 'transform 0.2s', transform: mobileToolsOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                </button>
                {mobileToolsOpen && (
                  <div style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {toolLinks.map(tl => (
                      <Link key={tl.to} to={tl.to} onClick={() => setOpen(false)} style={{
                        padding: '8px 14px', borderRadius: 4, fontSize: 13, fontWeight: 500,
                        color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8,
                      }}>
                        {renderIconLink(tl.icon)} {tl.label}
                      </Link>
                    ))}
                  </div>
                )}
                <button onClick={() => setMobileGamesOpen(!mobileGamesOpen)} style={{
                  padding: '10px 14px', borderRadius: 4, fontSize: 14, fontWeight: 500,
                  color: 'var(--text-primary)', background: 'transparent', border: 'none',
                  display: 'flex', alignItems: 'center', gap: 8, width: '100%', textAlign: 'left', cursor: 'pointer',
                }}>
                  <Gamepad2 size={14} /> {t('Jeux', 'Games')} <ChevronDown size={12} style={{ marginLeft: 'auto', transition: 'transform 0.2s', transform: mobileGamesOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                </button>
                {mobileGamesOpen && (
                  <div style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {gameLinks.map(tl => (
                      <Link key={tl.to} to={tl.to} onClick={() => setOpen(false)} style={{
                        padding: '8px 14px', borderRadius: 4, fontSize: 13, fontWeight: 500,
                        color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8,
                      }}>
                        {renderIconLink(tl.icon)} {tl.label}
                      </Link>
                    ))}
                  </div>
                )}
                <button onClick={() => setMobileFeaturesOpen(!mobileFeaturesOpen)} style={{
                  padding: '10px 14px', borderRadius: 4, fontSize: 14, fontWeight: 500,
                  color: 'var(--text-primary)', background: 'transparent', border: 'none',
                  display: 'flex', alignItems: 'center', gap: 8, width: '100%', textAlign: 'left', cursor: 'pointer',
                }}>
                  <Compass size={14} /> {t('Plus', 'More')} <ChevronDown size={12} style={{ marginLeft: 'auto', transition: 'transform 0.2s', transform: mobileFeaturesOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                </button>
                {mobileFeaturesOpen && (
                  <div style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {featureLinks.map(tl => (
                      <Link key={tl.to} to={tl.to} onClick={() => setOpen(false)} style={{
                        padding: '8px 14px', borderRadius: 4, fontSize: 13, fontWeight: 500,
                        color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8,
                      }}>
                        {renderIconLink(tl.icon)} {tl.label}
                      </Link>
                    ))}
                  </div>
                )}
                <Link to="/profil" onClick={() => setOpen(false)} style={{
                  padding: '10px 14px', borderRadius: 4, fontSize: 14, fontWeight: 500,
                  color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <User size={14} /> {t('Profil', 'Profile')}
                </Link>
                <button onClick={() => { handleLogout(); setOpen(false) }} style={{
                  padding: '10px 14px', borderRadius: 4, fontSize: 14, fontWeight: 500,
                  color: 'var(--error)', background: 'transparent', display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left',
                }}>
                  <LogOut size={14} /> {t('Deconnexion', 'Logout')}
                </button>
              </>
            )}
            <button onClick={toggleLang} style={{
              padding: '10px 14px', borderRadius: 4, fontSize: 14, fontWeight: 500,
              color: 'var(--accent)', background: 'transparent', display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left', width: '100%',
              borderTop: '1px solid var(--border)', marginTop: 4, paddingTop: 12,
              fontFamily: 'var(--font-mono)',
            }}>
              {lang === 'fr' ? 'EN — English' : 'FR — Francais'}
            </button>
            <button onClick={toggleTheme} style={{
              padding: '10px 14px', borderRadius: 4, fontSize: 14, fontWeight: 500,
              color: 'var(--text-primary)', background: 'transparent', display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left', width: '100%',
            }}>
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              {theme === 'dark' ? t('Mode clair', 'Light mode') : t('Mode sombre', 'Dark mode')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}
