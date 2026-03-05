import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Play, ChevronRight, Volume2, LogIn } from 'lucide-react'
import { useTranslation, useChapters, useFormationFromUrl } from '../hooks/useTranslation'
import { useProgressStore } from '../stores/progressStore'
import { useAuthStore } from '../stores/authStore'
import AudioPlayer from '../components/AudioPlayer'
import SEO from '../components/SEO'

export default function Course() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { t, lang } = useTranslation()
  const formation = useFormationFromUrl()
  const allChapters = useChapters()
  const chapter = allChapters.find(c => c.slug === slug)
  const [activeSection, setActiveSection] = useState(0)
  const [showAudio, setShowAudio] = useState(false)
  const [showAuthBanner, setShowAuthBanner] = useState(false)
  const { markCourseComplete: markComplete, records } = useProgressStore()
  const { updatePoints, isAuthenticated } = useAuthStore()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activeSection])

  if (!chapter) return (
    <div style={{ paddingTop: 120, textAlign: 'center' }}>
      <p style={{ fontFamily: 'var(--font-mono)' }}>{t('Chapitre introuvable', 'Chapter not found')}</p>
      <Link to="/">{t('Retour', 'Back')}</Link>
    </div>
  )

  const section = chapter.sections[activeSection]
  const chapterIndex = allChapters.findIndex(c => c.id === chapter.id)
  const nextChapter = allChapters[chapterIndex + 1]
  const prevChapter = allChapters[chapterIndex - 1]
  const handleFinishChapter = async () => {
    if (!isAuthenticated) {
      setShowAuthBanner(true)
      return
    }
    try {
      const { totalPoints } = await markComplete(chapter.slug)
      updatePoints(totalPoints)
    } catch {}
    navigate(`/${formation}/quiz/${chapter.slug}`)
  }

  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('### ')) return (
        <h3 key={i} style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 20,
          fontWeight: 600,
          marginTop: 32,
          marginBottom: 12,
          color: 'var(--text-primary)',
        }}>{renderInline(line.slice(4))}</h3>
      )

      if (line.startsWith('|') && line.endsWith('|')) return null
      if (line.startsWith('```')) return null

      if (line.startsWith('> ')) return (
        <div key={i} style={{
          borderLeft: '3px solid var(--accent)',
          padding: '12px 16px',
          margin: '12px 0',
          background: 'var(--accent-glow)',
          fontSize: 14,
          lineHeight: 1.6,
          color: 'var(--text-secondary)',
        }}>
          {renderInline(line.slice(2))}
        </div>
      )

      if (line.match(/^(\d+)\. /)) return (
        <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 6, fontSize: 15, lineHeight: 1.7 }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--accent)',
            fontWeight: 600,
            minWidth: 20,
            fontSize: 13,
          }}>{line.match(/^(\d+)/)![0]}.</span>
          <span>{renderInline(line.replace(/^\d+\. /, ''))}</span>
        </div>
      )

      if (line.startsWith('- ')) return (
        <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 4, fontSize: 15, lineHeight: 1.7 }}>
          <span style={{ color: 'var(--accent)', marginTop: 2, fontSize: 8 }}>&#9632;</span>
          <span>{renderInline(line.slice(2))}</span>
        </div>
      )

      if (!line.trim()) return <div key={i} style={{ height: 12 }} />

      return <p key={i} style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 8, color: 'var(--text-primary)' }}>{renderInline(line)}</p>
    })
  }

  const renderInline = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{part.slice(2, -2)}</strong>
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i}>{part.slice(1, -1)}</code>
      }
      return <span key={i}>{part}</span>
    })
  }

  const renderFullContent = (content: string) => {
    const blocks: React.ReactElement[] = []
    const lines = content.split('\n')
    let i = 0

    while (i < lines.length) {
      if (lines[i].startsWith('```')) {
        const lang = lines[i].slice(3)
        const codeLines: string[] = []
        i++
        while (i < lines.length && !lines[i].startsWith('```')) {
          codeLines.push(lines[i])
          i++
        }
        blocks.push(
          <pre key={`code-${i}`} style={{ position: 'relative' }}>
            {lang && <span style={{
              position: 'absolute',
              top: 8,
              right: 12,
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}>{lang}</span>}
            <code>{codeLines.join('\n')}</code>
          </pre>
        )
        i++
        continue
      }

      if (lines[i].startsWith('|')) {
        const tableLines: string[] = []
        while (i < lines.length && lines[i].startsWith('|')) {
          if (!lines[i].match(/^\|[\s-|]+\|$/)) {
            tableLines.push(lines[i])
          }
          i++
        }
        if (tableLines.length > 0) {
          const headers = tableLines[0].split('|').filter(c => c.trim()).map(c => c.trim())
          const rows = tableLines.slice(1).map(row => row.split('|').filter(c => c.trim()).map(c => c.trim()))
          blocks.push(
            <div key={`table-${i}`} style={{ overflowX: 'auto', margin: '16px 0' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: 13,
                fontFamily: 'var(--font-mono)',
              }}>
                <thead>
                  <tr>
                    {headers.map((h, hi) => (
                      <th key={hi} style={{
                        padding: '10px 14px',
                        textAlign: 'left',
                        fontWeight: 600,
                        color: 'var(--accent)',
                        borderBottom: '2px solid var(--border)',
                        background: 'var(--bg-secondary)',
                        fontSize: 12,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}>{renderInline(h)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, ri) => (
                    <tr key={ri}>
                      {row.map((cell, ci) => (
                        <td key={ci} style={{
                          padding: '8px 14px',
                          borderBottom: '1px solid var(--border)',
                          color: 'var(--text-secondary)',
                          fontFamily: ci === 0 ? 'var(--font-mono)' : 'var(--font-body)',
                          fontSize: 13,
                        }}>{renderInline(cell)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
        continue
      }

      const regularLines: string[] = []
      while (i < lines.length && !lines[i].startsWith('```') && !lines[i].startsWith('|')) {
        regularLines.push(lines[i])
        i++
      }
      blocks.push(
        <div key={`text-${i}`}>
          {renderContent(regularLines.join('\n'))}
        </div>
      )
    }

    return blocks
  }

  return (
    <div style={{ paddingTop: 56 }}>
      <SEO
        title={chapter.title}
        description={chapter.subtitle}
        url={`/cours/${chapter.slug}`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Course',
          name: chapter.title,
          description: chapter.subtitle,
          provider: { '@type': 'Organization', name: 'NetRevision', url: 'https://netrevision.fr' },
        }}
      />
      {/* Top bar */}
      <div style={{
        background: 'var(--nav-bg)',
        borderBottom: '1px solid var(--border)',
        padding: '10px 24px',
        position: 'sticky',
        top: 56,
        zIndex: 100,
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to={`/${formation}`} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
          }}>
            <ArrowLeft size={12} /> {t('retour', 'back')}
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => setShowAudio(!showAudio)}
              title={t('Mode Audio', 'Audio Mode')}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '4px 8px', background: showAudio ? `${chapter.color}20` : 'transparent',
                border: showAudio ? `1px solid ${chapter.color}40` : '1px solid transparent',
                color: showAudio ? chapter.color : 'var(--text-muted)',
                fontSize: 11, fontFamily: 'var(--font-mono)', cursor: 'pointer',
              }}
            >
              <Volume2 size={12} /> audio
            </button>
            <span style={{
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
            }}>
              {String(activeSection + 1).padStart(2, '0')}/{String(chapter.sections.length).padStart(2, '0')}
            </span>
            <div style={{ width: 80, height: 2, background: 'var(--border)', overflow: 'hidden' }}>
              <div style={{
                width: `${((activeSection + 1) / chapter.sections.length) * 100}%`,
                height: '100%',
                background: chapter.color,
                transition: 'width 0.3s',
              }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '240px 1fr',
        gap: 0,
        minHeight: 'calc(100vh - 112px)',
      }} className="course-layout">
        {/* Sidebar */}
        <aside style={{
          borderRight: '1px solid var(--border)',
          padding: '24px 12px',
          position: 'sticky',
          top: 100,
          height: 'fit-content',
          maxHeight: 'calc(100vh - 120px)',
          overflowY: 'auto',
        }} className="course-sidebar">
          <div style={{
            fontSize: 10,
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            color: chapter.color,
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            marginBottom: 6,
          }}>
            {t('Chapitre', 'Chapter')} {String(chapter.id).padStart(2, '0')}
          </div>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 15,
            fontWeight: 600,
            marginBottom: 20,
          }}>{chapter.title}</h2>

          {chapter.sections.map((s, idx) => {
            const isRead = idx <= activeSection
            return (
              <button
                key={idx}
                onClick={() => setActiveSection(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '8px 10px',
                  background: idx === activeSection ? `${chapter.color}12` : 'transparent',
                  borderLeft: idx === activeSection ? `2px solid ${chapter.color}` : '2px solid transparent',
                  border: 'none',
                  borderLeftWidth: 2,
                  borderLeftStyle: 'solid',
                  borderLeftColor: idx === activeSection ? chapter.color : 'transparent',
                  color: idx === activeSection ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontSize: 13,
                  fontWeight: idx === activeSection ? 500 : 400,
                  fontFamily: 'var(--font-body)',
                  textAlign: 'left',
                  marginBottom: 1,
                  transition: 'all 0.12s',
                }}
              >
                {isRead ? (
                  <CheckCircle2 size={13} color={chapter.color} style={{ flexShrink: 0 }} />
                ) : (
                  <div style={{
                    width: 13,
                    height: 13,
                    border: '1.5px solid var(--border)',
                    flexShrink: 0,
                  }} />
                )}
                <span style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>{s.title}</span>
              </button>
            )
          })}

          {chapter.videoId && (
            <a
              href={`https://www.youtube.com/watch?v=${chapter.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 10px',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                fontSize: 12,
                fontFamily: 'var(--font-mono)',
                fontWeight: 500,
                marginTop: 16,
              }}
            >
              <Play size={12} color="#ef4444" /> video
            </a>
          )}
        </aside>

        {/* Content */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          style={{ padding: '32px 48px 60px' }}
          className="course-content"
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '3px 10px',
            background: `${chapter.color}10`,
            border: `1px solid ${chapter.color}25`,
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            fontWeight: 500,
            color: chapter.color,
            marginBottom: 16,
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            <BookOpen size={12} /> section {String(activeSection + 1).padStart(2, '0')}
          </div>

          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 24,
            lineHeight: 1.3,
            letterSpacing: '-0.5px',
          }}>
            {section.title}
          </h2>

          {!isAuthenticated && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              padding: '10px 16px',
              marginBottom: 24,
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--accent)',
              borderLeftWidth: 3,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                <LogIn size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <span>{t('Connectez-vous pour sauvegarder votre progression et acceder aux quiz', 'Sign in to save your progress and access quizzes')}</span>
              </div>
              <Link to="/login" style={{
                padding: '6px 14px',
                background: 'var(--accent)',
                color: 'var(--bg-primary)',
                fontSize: 12,
                fontWeight: 600,
                fontFamily: 'var(--font-mono)',
                whiteSpace: 'nowrap',
              }}>
                {t('Se connecter', 'Sign in')}
              </Link>
            </div>
          )}

          {activeSection === 0 && chapter.videoId && (
            <div style={{
              position: 'relative',
              paddingBottom: '56.25%',
              marginBottom: 32,
              overflow: 'hidden',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
            }}>
              <iframe
                src={`https://www.youtube.com/embed/${chapter.videoId}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={chapter.title}
              />
            </div>
          )}

          <div>{renderFullContent(section.content)}</div>

          {/* Navigation */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 48,
            paddingTop: 24,
            borderTop: '1px solid var(--border)',
            gap: 12,
            flexWrap: 'wrap',
          }}>
            <button
              onClick={() => activeSection > 0 && setActiveSection(activeSection - 1)}
              disabled={activeSection === 0}
              style={{
                padding: '10px 18px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                color: activeSection > 0 ? 'var(--text-primary)' : 'var(--text-muted)',
                fontSize: 13,
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                cursor: activeSection > 0 ? 'pointer' : 'not-allowed',
              }}
            >
              <ArrowLeft size={14} /> {t('Precedent', 'Previous')}
            </button>

            {activeSection < chapter.sections.length - 1 ? (
              <button
                onClick={() => setActiveSection(activeSection + 1)}
                style={{
                  padding: '10px 18px',
                  background: chapter.color,
                  color: 'var(--bg-primary)',
                  fontSize: 13,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  border: 'none',
                }}
              >
                {t('Suivant', 'Next')} <ArrowRight size={14} />
              </button>
            ) : (
              <button
                onClick={handleFinishChapter}
                style={{
                  padding: '10px 22px',
                  background: 'var(--accent)',
                  color: 'var(--bg-primary)',
                  fontSize: 13,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  border: 'none',
                }}
              >
                {t('Passer au Quiz', 'Go to Quiz')} <ChevronRight size={14} />
              </button>
            )}
          </div>

          {showAuthBanner && !isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: 20,
                padding: '16px 20px',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--accent)',
                borderLeftWidth: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--text-primary)' }}>
                <LogIn size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <span>{t(
                  'Connecte-toi pour passer le quiz, sauvegarder ta progression et obtenir des badges',
                  'Sign in to take the quiz, save your progress and earn badges'
                )}</span>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link to="/login" style={{
                  padding: '8px 18px',
                  background: 'var(--accent)',
                  color: 'var(--bg-primary)',
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono)',
                }}>
                  {t('Se connecter', 'Sign in')}
                </Link>
                <Link to="/register" style={{
                  padding: '8px 18px',
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  fontSize: 13,
                  fontWeight: 500,
                  fontFamily: 'var(--font-mono)',
                }}>
                  {t('Creer un compte', 'Create account')}
                </Link>
              </div>
            </motion.div>
          )}

          {/* Next/Prev chapter */}
          <div style={{
            display: 'flex',
            gap: 2,
            marginTop: 32,
            flexWrap: 'wrap',
          }}>
            {prevChapter && (
              <Link to={`/${formation}/cours/${prevChapter.slug}`} style={{
                flex: 1,
                padding: 16,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                minWidth: 200,
              }}>
                <div style={{
                  fontSize: 10,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                  marginBottom: 4,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}>{t('precedent', 'previous')}</div>
                <div style={{ fontSize: 14, fontFamily: 'var(--font-heading)', fontWeight: 600 }}>{prevChapter.title}</div>
              </Link>
            )}
            {nextChapter && (
              <Link to={`/${formation}/cours/${nextChapter.slug}`} style={{
                flex: 1,
                padding: 16,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                textAlign: 'right',
                minWidth: 200,
              }}>
                <div style={{
                  fontSize: 10,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                  marginBottom: 4,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}>{t('suivant', 'next')}</div>
                <div style={{ fontSize: 14, fontFamily: 'var(--font-heading)', fontWeight: 600 }}>{nextChapter.title}</div>
              </Link>
            )}
          </div>
        </motion.div>
      </div>

      {showAudio && (
        <AudioPlayer
          text={section.content}
          chapterTitle={chapter.title}
        />
      )}

      <style>{`
        @media (max-width: 768px) {
          .course-layout { grid-template-columns: 1fr !important; }
          .course-sidebar { display: none !important; }
          .course-content { padding: 24px 16px 40px !important; }
        }
      `}</style>
    </div>
  )
}
