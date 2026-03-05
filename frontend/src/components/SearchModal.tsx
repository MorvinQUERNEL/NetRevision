import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, BookOpen, BookA, FileText, X } from 'lucide-react'
import { useChapters, useGlossary } from '../hooks/useTranslation'
import { useLangStore } from '../stores/langStore'
import { useFormationStore } from '../stores/formationStore'
import { blogArticles as allArticles } from '../data/allBlogArticles'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

interface SearchResult {
  type: 'cours' | 'glossaire' | 'blog'
  title: string
  subtitle: string
  path: string
  score: number
}

function highlightMatch(text: string, query: string): React.ReactElement {
  if (!query.trim()) return <>{text}</>
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')
  const parts = text.split(regex)
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            style={{
              background: 'var(--accent)',
              color: 'var(--bg-primary)',
              padding: '0 2px',
              borderRadius: 0,
            }}
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const lang = useLangStore((s) => s.lang)
  const t = (fr: string, en: string) => lang === 'en' ? en : fr
  const formation = useFormationStore((s) => s.currentFormation)
  const allChapters = useChapters()
  const glossaryTerms = useGlossary()
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const blogArticles = useMemo(
    () => allArticles.filter(a => new Date(a.publishDate) <= new Date()),
    []
  )

  // Debounce query by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [debouncedQuery])

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setDebouncedQuery('')
      setSelectedIndex(0)
      setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
    }
  }, [isOpen])

  // Global keyboard shortcut: Ctrl+K / Cmd+K to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (!isOpen) {
          // Parent controls isOpen, but we still prevent default
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Search logic with scoring
  const results = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase()
    if (!q) return []

    const coursResults: SearchResult[] = []
    const glossaireResults: SearchResult[] = []
    const blogResults: SearchResult[] = []

    // Search chapters
    for (const chapter of allChapters) {
      let score = 0
      if (chapter.title.toLowerCase().includes(q)) score += 10
      if (chapter.subtitle.toLowerCase().includes(q)) score += 5
      for (const section of chapter.sections) {
        if (section.content.toLowerCase().includes(q)) {
          score += 2
          break
        }
      }
      if (score > 0) {
        coursResults.push({
          type: 'cours',
          title: chapter.title,
          subtitle: chapter.subtitle,
          path: `/${formation}/cours/${chapter.slug}`,
          score,
        })
      }
    }

    // Search glossary terms
    for (const term of glossaryTerms) {
      let score = 0
      if (term.term.toLowerCase().includes(q)) score += 10
      if (term.definition.toLowerCase().includes(q)) score += 5
      if (term.category.toLowerCase().includes(q)) score += 2
      if (score > 0) {
        glossaireResults.push({
          type: 'glossaire',
          title: term.term,
          subtitle: term.definition.length > 120
            ? term.definition.substring(0, 120) + '...'
            : term.definition,
          path: `/${formation}/glossaire?q=${encodeURIComponent(term.term)}`,
          score,
        })
      }
    }

    // Search blog articles
    for (const article of blogArticles) {
      let score = 0
      if (article.title.toLowerCase().includes(q)) score += 10
      if (article.description.toLowerCase().includes(q)) score += 5
      for (const tag of article.tags) {
        if (tag.toLowerCase().includes(q)) {
          score += 2
          break
        }
      }
      if (score > 0) {
        blogResults.push({
          type: 'blog',
          title: article.title,
          subtitle: article.description.length > 120
            ? article.description.substring(0, 120) + '...'
            : article.description,
          path: `/blog/${article.slug}`,
          score,
        })
      }
    }

    // Sort each category by score descending and limit to 5
    coursResults.sort((a, b) => b.score - a.score)
    glossaireResults.sort((a, b) => b.score - a.score)
    blogResults.sort((a, b) => b.score - a.score)

    return [
      ...coursResults.slice(0, 5),
      ...glossaireResults.slice(0, 5),
      ...blogResults.slice(0, 5),
    ]
  }, [debouncedQuery, blogArticles])

  // Grouped results for display
  const groupedResults = useMemo(() => {
    const groups: { type: 'cours' | 'glossaire' | 'blog'; label: string; icon: typeof BookOpen; results: SearchResult[] }[] = []

    const cours = results.filter(r => r.type === 'cours')
    const glossaire = results.filter(r => r.type === 'glossaire')
    const blog = results.filter(r => r.type === 'blog')

    if (cours.length > 0) groups.push({ type: 'cours', label: t('Cours', 'Courses'), icon: BookOpen, results: cours })
    if (glossaire.length > 0) groups.push({ type: 'glossaire', label: t('Glossaire', 'Glossary'), icon: BookA, results: glossaire })
    if (blog.length > 0) groups.push({ type: 'blog', label: 'Blog', icon: FileText, results: blog })

    return groups
  }, [results])

  // Flat list of all results for keyboard navigation
  const flatResults = useMemo(() => results, [results])

  const handleNavigate = useCallback(
    (path: string) => {
      navigate(path)
      onClose()
    },
    [navigate, onClose]
  )

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev =>
          prev < flatResults.length - 1 ? prev + 1 : 0
        )
        return
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev =>
          prev > 0 ? prev - 1 : flatResults.length - 1
        )
        return
      }

      if (e.key === 'Enter') {
        e.preventDefault()
        if (flatResults[selectedIndex]) {
          handleNavigate(flatResults[selectedIndex].path)
        }
        return
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, flatResults, selectedIndex, handleNavigate, onClose])

  // Scroll selected item into view
  useEffect(() => {
    if (!resultsRef.current) return
    const selected = resultsRef.current.querySelector(
      `[data-index="${selectedIndex}"]`
    )
    if (selected) {
      selected.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex])

  const getIconForType = (type: 'cours' | 'glossaire' | 'blog') => {
    switch (type) {
      case 'cours':
        return <BookOpen size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
      case 'glossaire':
        return <BookA size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
      case 'blog':
        return <FileText size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
    }
  }

  let globalIndex = -1

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
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: 120,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 640,
              margin: '0 16px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: 'calc(100vh - 200px)',
            }}
          >
            {/* Search input */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                height: 56,
                borderBottom: '1px solid var(--border)',
                gap: 12,
                position: 'relative',
              }}
            >
              <Search
                size={18}
                style={{ color: 'var(--text-muted)', flexShrink: 0 }}
              />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('Rechercher cours, glossaire, articles...', 'Search courses, glossary, articles...')}
                style={{
                  flex: 1,
                  height: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: 15,
                  fontFamily: 'var(--font-body)',
                  caretColor: 'var(--accent)',
                }}
              />
              <button
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px 8px',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-muted)',
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  flexShrink: 0,
                  letterSpacing: '0.5px',
                }}
              >
                ESC
              </button>
            </div>

            {/* Results area */}
            <div
              ref={resultsRef}
              style={{
                overflowY: 'auto',
                flex: 1,
                padding: '8px 0',
              }}
            >
              {/* Empty state: no query */}
              {!debouncedQuery.trim() && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px 16px',
                    gap: 12,
                  }}
                >
                  <Search
                    size={32}
                    style={{ color: 'var(--text-muted)', opacity: 0.4 }}
                  />
                  <span
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: 14,
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {t('Tapez pour rechercher...', 'Type to search...')}
                  </span>
                </div>
              )}

              {/* No results found */}
              {debouncedQuery.trim() && results.length === 0 && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px 16px',
                    gap: 12,
                  }}
                >
                  <X
                    size={32}
                    style={{ color: 'var(--text-muted)', opacity: 0.4 }}
                  />
                  <span
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: 14,
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {t(`Aucun resultat pour "${debouncedQuery}"`, `No results for "${debouncedQuery}"`)}
                  </span>
                </div>
              )}

              {/* Grouped results */}
              {groupedResults.map((group) => {
                const GroupIcon = group.icon
                return (
                  <div key={group.type} style={{ marginBottom: 4 }}>
                    {/* Category header */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '8px 16px 4px',
                      }}
                    >
                      <GroupIcon
                        size={13}
                        style={{ color: 'var(--text-muted)' }}
                      />
                      <span
                        style={{
                          fontSize: 11,
                          fontFamily: 'var(--font-heading)',
                          fontWeight: 600,
                          color: 'var(--text-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                        }}
                      >
                        {group.label}
                      </span>
                      <div
                        style={{
                          flex: 1,
                          height: 1,
                          background: 'var(--border)',
                        }}
                      />
                    </div>

                    {/* Results list */}
                    {group.results.map((result) => {
                      globalIndex++
                      const currentIndex = globalIndex
                      const isSelected = selectedIndex === currentIndex

                      return (
                        <div
                          key={`${result.type}-${result.path}`}
                          data-index={currentIndex}
                          onClick={() => handleNavigate(result.path)}
                          onMouseEnter={() => setSelectedIndex(currentIndex)}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 12,
                            padding: '10px 16px',
                            cursor: 'pointer',
                            background: isSelected
                              ? 'var(--bg-tertiary)'
                              : 'transparent',
                            transition: 'background 0.1s',
                            borderLeft: isSelected
                              ? '2px solid var(--accent)'
                              : '2px solid transparent',
                          }}
                        >
                          <div
                            style={{
                              marginTop: 2,
                            }}
                          >
                            {getIconForType(result.type)}
                          </div>
                          <div
                            style={{
                              flex: 1,
                              minWidth: 0,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 2,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 14,
                                fontFamily: 'var(--font-heading)',
                                fontWeight: 600,
                                color: 'var(--text-primary)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {highlightMatch(result.title, debouncedQuery)}
                            </span>
                            <span
                              style={{
                                fontSize: 12,
                                fontFamily: 'var(--font-body)',
                                color: 'var(--text-secondary)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {highlightMatch(result.subtitle, debouncedQuery)}
                            </span>
                          </div>
                          {isSelected && (
                            <span
                              style={{
                                fontSize: 11,
                                fontFamily: 'var(--font-mono)',
                                color: 'var(--text-muted)',
                                flexShrink: 0,
                                alignSelf: 'center',
                              }}
                            >
                              {t('Entrer', 'Enter')}
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>

            {/* Footer hint */}
            {results.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 16,
                  padding: '10px 16px',
                  borderTop: '1px solid var(--border)',
                  background: 'var(--bg-primary)',
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 11,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-muted)',
                  }}
                >
                  <kbd
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '2px 6px',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border)',
                      fontSize: 10,
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    ↑↓
                  </kbd>
                  {t('naviguer', 'navigate')}
                </span>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 11,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-muted)',
                  }}
                >
                  <kbd
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '2px 6px',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border)',
                      fontSize: 10,
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {t('Entrer', 'Enter')}
                  </kbd>
                  {t('ouvrir', 'open')}
                </span>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 11,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-muted)',
                  }}
                >
                  <kbd
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '2px 6px',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border)',
                      fontSize: 10,
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Esc
                  </kbd>
                  {t('fermer', 'close')}
                </span>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
