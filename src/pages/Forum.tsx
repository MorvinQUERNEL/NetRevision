import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Plus, Send, ChevronDown, ChevronUp, User } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useChapters, useTranslation } from '../hooks/useTranslation'

interface ForumReply {
  id: string
  content: string
  author: string
  createdAt: string
}

interface ForumPost {
  id: string
  chapterSlug: string
  title: string
  content: string
  author: string
  createdAt: string
  replies: ForumReply[]
}

const STORAGE_KEY = 'nr_forum_posts'

function getProgrammeColor(chapterSlug: string, allChapters: { id: number; slug: string }[]): string {
  const ch = allChapters.find((c) => c.slug === chapterSlug)
  if (!ch) return '#00e5a0'
  if (ch.id <= 8) return '#00e5a0'
  if (ch.id <= 16) return '#6366f1'
  return '#f59e0b'
}

function getChapterTitle(slug: string, allChapters: { slug: string; title: string }[]): string {
  const ch = allChapters.find((c) => c.slug === slug)
  return ch ? ch.title : slug
}

function getShortLabel(ch: { id: number; title: string }): string {
  const labels: Record<number, string> = {
    1: 'OSI',
    2: 'IPv4/IPv6',
    3: 'VLAN/STP',
    4: 'Broadcast',
    5: 'Routage statique',
    6: 'Subnetting',
    7: 'Ping/ICMP/ARP',
    8: 'DNS/DHCP',
    9: 'TCP/UDP',
    10: 'Routage dyn.',
    11: 'ACL',
    12: 'NAT/PAT',
    13: 'Wi-Fi',
    14: 'VPN',
    15: 'SNMP',
    16: 'Depannage',
    17: 'Python',
    18: 'Ansible',
    19: 'Cloud',
    20: 'Kubernetes',
    21: 'SDN',
    22: 'Haute dispo.',
    23: 'Securite avancee',
    24: 'Monitoring',
  }
  return labels[ch.id] || ch.title
}

function loadPosts(): ForumPost[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as ForumPost[]
  } catch {
    return []
  }
}

function savePosts(posts: ForumPost[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
}

export default function Forum() {
  const { t, lang } = useTranslation()
  const allChapters = useChapters()
  const user = useAuthStore((s) => s.user)

  function formatDate(iso: string): string {
    const d = new Date(iso)
    return d.toLocaleDateString(lang === 'en' ? 'en-US' : 'fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  const [posts, setPosts] = useState<ForumPost[]>(loadPosts)
  const [activeFilter, setActiveFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set())

  // New post form state
  const [newChapter, setNewChapter] = useState(allChapters[0]?.slug || '')
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')

  // Reply input state per post
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({})

  const filteredPosts = useMemo(() => {
    const sorted = [...posts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    if (activeFilter === 'all') return sorted
    return sorted.filter((p) => p.chapterSlug === activeFilter)
  }, [posts, activeFilter])

  function handlePublish() {
    const trimTitle = newTitle.trim()
    const trimContent = newContent.trim()
    if (!trimTitle || !trimContent || !newChapter) return

    const post: ForumPost = {
      id: crypto.randomUUID(),
      chapterSlug: newChapter,
      title: trimTitle,
      content: trimContent,
      author: user?.firstName || t('Anonyme', 'Anonymous'),
      createdAt: new Date().toISOString(),
      replies: [],
    }

    const updated = [post, ...posts]
    setPosts(updated)
    savePosts(updated)
    setNewTitle('')
    setNewContent('')
    setShowForm(false)
  }

  function handleReply(postId: string) {
    const text = (replyInputs[postId] || '').trim()
    if (!text) return

    const reply: ForumReply = {
      id: crypto.randomUUID(),
      content: text,
      author: user?.firstName || t('Anonyme', 'Anonymous'),
      createdAt: new Date().toISOString(),
    }

    const updated = posts.map((p) => {
      if (p.id === postId) {
        return { ...p, replies: [...p.replies, reply] }
      }
      return p
    })
    setPosts(updated)
    savePosts(updated)
    setReplyInputs((prev) => ({ ...prev, [postId]: '' }))
  }

  function toggleReplies(postId: string) {
    setExpandedReplies((prev) => {
      const next = new Set(prev)
      if (next.has(postId)) next.delete(postId)
      else next.add(postId)
      return next
    })
  }

  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
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
            // forum
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: '-1px',
              marginBottom: 10,
            }}
          >
            {t('Forum & Discussions', 'Forum & Discussions')}
          </h1>
          <p
            style={{
              fontSize: 15,
              color: 'var(--text-secondary)',
              fontWeight: 300,
            }}
          >
            {t('Posez vos questions et partagez vos connaissances', 'Ask your questions and share your knowledge')}
          </p>
        </div>

        {/* Chapter filter */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            marginBottom: 28,
            overflowX: 'auto',
            paddingBottom: 8,
          }}
        >
          <button
            onClick={() => setActiveFilter('all')}
            style={{
              background: activeFilter === 'all' ? 'var(--accent)' : 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              color: activeFilter === 'all' ? 'var(--bg-primary)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              padding: '6px 14px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {t('Tous', 'All')}
          </button>
          {allChapters.map((ch) => (
            <button
              key={ch.slug}
              onClick={() => setActiveFilter(ch.slug)}
              style={{
                background:
                  activeFilter === ch.slug ? 'var(--accent)' : 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                color:
                  activeFilter === ch.slug ? 'var(--bg-primary)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                padding: '6px 14px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {getShortLabel(ch)}
            </button>
          ))}
        </div>

        {/* New post toggle button */}
        <motion.button
          onClick={() => setShowForm(!showForm)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--accent)',
            color: 'var(--bg-primary)',
            border: 'none',
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            fontWeight: 600,
            padding: '10px 20px',
            cursor: 'pointer',
            marginBottom: 24,
          }}
        >
          <Plus size={16} />
          {t('Nouvelle discussion', 'New discussion')}
          {showForm ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </motion.button>

        {/* New post form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: 'hidden', marginBottom: 32 }}
            >
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  padding: 24,
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    color: 'var(--accent)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: 16,
                  }}
                >
                  {t('Nouveau message', 'New message')}
                </div>

                {/* Chapter select */}
                <div style={{ marginBottom: 14 }}>
                  <label
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 12,
                      color: 'var(--text-secondary)',
                      marginBottom: 6,
                    }}
                  >
                    {t('Chapitre', 'Chapter')}
                  </label>
                  <select
                    value={newChapter}
                    onChange={(e) => setNewChapter(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 13,
                      padding: '10px 12px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  >
                    {allChapters.map((ch) => (
                      <option key={ch.slug} value={ch.slug}>
                        {ch.id}. {ch.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Title input */}
                <div style={{ marginBottom: 14 }}>
                  <label
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 12,
                      color: 'var(--text-secondary)',
                      marginBottom: 6,
                    }}
                  >
                    {t('Titre', 'Title')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('Sujet de votre question...', 'Subject of your question...')}
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 13,
                      padding: '10px 12px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Content textarea */}
                <div style={{ marginBottom: 18 }}>
                  <label
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 12,
                      color: 'var(--text-secondary)',
                      marginBottom: 6,
                    }}
                  >
                    {t('Contenu', 'Content')}
                  </label>
                  <textarea
                    placeholder={t('Decrivez votre question ou partagez vos connaissances...', 'Describe your question or share your knowledge...')}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    rows={5}
                    style={{
                      width: '100%',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-body)',
                      fontSize: 14,
                      padding: '10px 12px',
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                      lineHeight: 1.6,
                    }}
                  />
                </div>

                {/* Publish button */}
                <button
                  onClick={handlePublish}
                  disabled={!newTitle.trim() || !newContent.trim()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background:
                      newTitle.trim() && newContent.trim()
                        ? 'var(--accent)'
                        : 'var(--bg-tertiary)',
                    color:
                      newTitle.trim() && newContent.trim()
                        ? 'var(--bg-primary)'
                        : 'var(--text-muted)',
                    border: 'none',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 13,
                    fontWeight: 600,
                    padding: '10px 24px',
                    cursor:
                      newTitle.trim() && newContent.trim() ? 'pointer' : 'not-allowed',
                  }}
                >
                  <Send size={14} />
                  {t('Publier', 'Publish')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results counter */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            color: 'var(--text-muted)',
            marginBottom: 20,
          }}
        >
          {filteredPosts.length} {t('discussion', 'discussion')}{filteredPosts.length !== 1 ? 's' : ''}
        </div>

        {/* Posts list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filteredPosts.map((post, index) => {
            const color = getProgrammeColor(post.chapterSlug, allChapters)
            const isExpanded = expandedReplies.has(post.id)

            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index % 10 * 0.03 }}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                }}
              >
                {/* Post card */}
                <div style={{ padding: 20 }}>
                  {/* Chapter badge */}
                  <div
                    style={{
                      display: 'inline-block',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: color,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: 10,
                      padding: '3px 8px',
                      border: `1px solid ${color}33`,
                      background: `${color}0d`,
                    }}
                  >
                    {getChapterTitle(post.chapterSlug, allChapters)}
                  </div>

                  {/* Post title */}
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 17,
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      marginBottom: 8,
                    }}
                  >
                    {post.title}
                  </div>

                  {/* Post content */}
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 14,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.7,
                      margin: '0 0 14px 0',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {post.content}
                  </p>

                  {/* Author + date + reply count */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        fontFamily: 'var(--font-mono)',
                        fontSize: 12,
                        color: 'var(--text-muted)',
                      }}
                    >
                      <User size={13} />
                      <span>{post.author}</span>
                      <span style={{ opacity: 0.4 }}>|</span>
                      <span>{formatDate(post.createdAt)}</span>
                    </div>

                    <button
                      onClick={() => toggleReplies(post.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        background: 'none',
                        border: '1px solid var(--border)',
                        color: 'var(--text-secondary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 12,
                        padding: '5px 12px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <MessageSquare size={13} />
                      {post.replies.length} {lang === 'en' ? (post.replies.length !== 1 ? 'replies' : 'reply') : `reponse${post.replies.length !== 1 ? 's' : ''}`}
                      {isExpanded ? (
                        <ChevronUp size={12} />
                      ) : (
                        <ChevronDown size={12} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Replies section */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div
                        style={{
                          borderTop: '1px solid var(--border)',
                          padding: '16px 20px',
                          background: 'var(--bg-tertiary)',
                        }}
                      >
                        {/* Replies list */}
                        {post.replies.length > 0 && (
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 12,
                              marginBottom: 16,
                            }}
                          >
                            {post.replies.map((reply) => (
                              <div
                                key={reply.id}
                                style={{
                                  background: 'var(--bg-secondary)',
                                  border: '1px solid var(--border)',
                                  padding: 14,
                                }}
                              >
                                <p
                                  style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: 13,
                                    color: 'var(--text-secondary)',
                                    lineHeight: 1.6,
                                    margin: '0 0 8px 0',
                                    whiteSpace: 'pre-wrap',
                                  }}
                                >
                                  {reply.content}
                                </p>
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: 11,
                                    color: 'var(--text-muted)',
                                  }}
                                >
                                  <User size={11} />
                                  <span>{reply.author}</span>
                                  <span style={{ opacity: 0.4 }}>|</span>
                                  <span>{formatDate(reply.createdAt)}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Reply input */}
                        <div style={{ display: 'flex', gap: 8 }}>
                          <input
                            type="text"
                            placeholder={t('Ecrire une reponse...', 'Write a reply...')}
                            value={replyInputs[post.id] || ''}
                            onChange={(e) =>
                              setReplyInputs((prev) => ({
                                ...prev,
                                [post.id]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleReply(post.id)
                            }}
                            style={{
                              flex: 1,
                              background: 'var(--bg-primary)',
                              border: '1px solid var(--border)',
                              color: 'var(--text-primary)',
                              fontFamily: 'var(--font-mono)',
                              fontSize: 13,
                              padding: '9px 12px',
                              outline: 'none',
                              boxSizing: 'border-box',
                            }}
                          />
                          <button
                            onClick={() => handleReply(post.id)}
                            disabled={!(replyInputs[post.id] || '').trim()}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              background:
                                (replyInputs[post.id] || '').trim()
                                  ? 'var(--accent)'
                                  : 'var(--bg-secondary)',
                              color:
                                (replyInputs[post.id] || '').trim()
                                  ? 'var(--bg-primary)'
                                  : 'var(--text-muted)',
                              border: '1px solid var(--border)',
                              fontFamily: 'var(--font-mono)',
                              fontSize: 12,
                              fontWeight: 600,
                              padding: '9px 16px',
                              cursor:
                                (replyInputs[post.id] || '').trim()
                                  ? 'pointer'
                                  : 'not-allowed',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            <Send size={12} />
                            {t('Repondre', 'Reply')}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        {/* Empty state */}
        {filteredPosts.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: 14,
            }}
          >
            <MessageSquare
              size={40}
              style={{ marginBottom: 16, opacity: 0.3 }}
            />
            <div>
              {t('Aucune discussion pour le moment.', 'No discussions yet.')}
              <br />
              {t('Soyez le premier a poser une question!', 'Be the first to ask a question!')}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
