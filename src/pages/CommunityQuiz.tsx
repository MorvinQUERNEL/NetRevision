import { useState, useMemo, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Users,
  Plus,
  List,
  User,
  ThumbsUp,
  ThumbsDown,
  Trash2,
  CheckCircle,
  AlertCircle,
  Play,
  Eye,
  ChevronDown,
  Send,
  Clock,
  Star,
  Filter,
  SortDesc,
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useLangStore } from '../stores/langStore'
import { useChapters } from '../hooks/useTranslation'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface CommunityQuestion {
  id: string
  question: string
  options: string[]
  correct: number
  explanation: string
  category: string
  difficulty: 'facile' | 'moyen' | 'difficile'
  authorName: string
  authorId: string
  upvotes: number
  downvotes: number
  userVote: number
  createdAt: string
  status: 'pending' | 'approved'
}

type Tab = 'parcourir' | 'creer' | 'mes-questions'
type SortMode = 'recent' | 'popular' | 'rating'

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = 'nr_community_questions'
const USER_ID_KEY = 'nr_community_user_id'
const ITEMS_PER_PAGE = 8

const DIFFICULTY_COLORS: Record<string, string> = {
  facile: '#00e5a0',
  moyen: '#f59e0b',
  difficile: '#ef4444',
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getUserId(): string {
  let id = localStorage.getItem(USER_ID_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(USER_ID_KEY, id)
  }
  return id
}

function loadQuestions(): CommunityQuestion[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as CommunityQuestion[]
  } catch {
    return []
  }
}

function saveQuestions(questions: CommunityQuestion[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(questions))
}

function formatDate(iso: string, lang: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString(lang === 'en' ? 'en-US' : 'fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/* ------------------------------------------------------------------ */
/*  Seed data                                                          */
/* ------------------------------------------------------------------ */

const SEED_QUESTIONS: CommunityQuestion[] = [
  {
    id: 'seed-1', question: 'Quel est le masque de sous-reseau par defaut pour une adresse de classe B ?',
    options: ['255.0.0.0', '255.255.0.0', '255.255.255.0', '255.255.255.255'], correct: 1,
    explanation: 'Une adresse de classe B utilise les 2 premiers octets pour le reseau, soit un masque /16 = 255.255.0.0.',
    category: 'adressage-ipv4-subnetting', difficulty: 'facile', authorName: 'Thomas', authorId: 'seed-user-1',
    upvotes: 12, downvotes: 1, userVote: 0, createdAt: '2026-02-15T10:00:00Z', status: 'approved',
  },
  {
    id: 'seed-2', question: 'Quelle commande Cisco permet de voir les routes OSPF dans la table de routage ?',
    options: ['show ip route', 'show ip ospf neighbor', 'show ip route ospf', 'show ip protocols'], correct: 2,
    explanation: 'La commande "show ip route ospf" filtre la table de routage pour afficher uniquement les routes apprises via OSPF.',
    category: 'ospfv2-single-area', difficulty: 'moyen', authorName: 'Sarah', authorId: 'seed-user-2',
    upvotes: 18, downvotes: 2, userVote: 0, createdAt: '2026-02-14T14:30:00Z', status: 'approved',
  },
  {
    id: 'seed-3', question: 'Quel protocole de couche 2 est utilise pour prevenir les boucles dans un reseau commute ?',
    options: ['OSPF', 'STP', 'ARP', 'ICMP'], correct: 1,
    explanation: 'STP (Spanning Tree Protocol) empeche les boucles en desactivant certains liens redondants dans les reseaux commutes.',
    category: 'vlans-trunking', difficulty: 'facile', authorName: 'Mehdi', authorId: 'seed-user-3',
    upvotes: 15, downvotes: 0, userVote: 0, createdAt: '2026-02-13T09:15:00Z', status: 'approved',
  },
  {
    id: 'seed-4', question: 'Dans une ACL etendue, quel parametre permet de filtrer par port de destination ?',
    options: ['source', 'eq', 'host', 'any'], correct: 1,
    explanation: 'Le mot-cle "eq" (equal) suivi du numero de port permet de filtrer le trafic vers un port specifique dans une ACL etendue.',
    category: 'acl-access-control', difficulty: 'moyen', authorName: 'Julie', authorId: 'seed-user-4',
    upvotes: 9, downvotes: 1, userVote: 0, createdAt: '2026-02-12T16:45:00Z', status: 'approved',
  },
  {
    id: 'seed-5', question: 'Quelle est la difference principale entre TCP et UDP ?',
    options: ['TCP est plus rapide', 'UDP garantit la livraison', 'TCP etablit une connexion, UDP non', 'UDP utilise des adresses IP'], correct: 2,
    explanation: 'TCP est oriente connexion (3-way handshake) et garantit la livraison. UDP est sans connexion et ne garantit pas la livraison.',
    category: 'tcp-vs-udp', difficulty: 'facile', authorName: 'Lucas', authorId: 'seed-user-5',
    upvotes: 22, downvotes: 3, userVote: 0, createdAt: '2026-02-11T11:00:00Z', status: 'approved',
  },
  {
    id: 'seed-6', question: 'Quel type de NAT associe une adresse IP privee a une adresse IP publique de facon permanente ?',
    options: ['NAT dynamique', 'PAT', 'NAT statique', 'NAT overload'], correct: 2,
    explanation: 'Le NAT statique cree une association permanente (one-to-one) entre une adresse privee et une adresse publique.',
    category: 'nat', difficulty: 'moyen', authorName: 'Emma', authorId: 'seed-user-6',
    upvotes: 11, downvotes: 0, userVote: 0, createdAt: '2026-02-10T08:30:00Z', status: 'approved',
  },
  {
    id: 'seed-7', question: 'En IPv6, quel type d\'adresse remplace le broadcast ?',
    options: ['Unicast', 'Anycast', 'Multicast', 'Loopback'], correct: 2,
    explanation: 'IPv6 n\'a pas de broadcast. Le multicast (par exemple ff02::1 pour tous les noeuds) remplace les fonctions du broadcast IPv4.',
    category: 'introduction-ipv6', difficulty: 'moyen', authorName: 'Antoine', authorId: 'seed-user-7',
    upvotes: 14, downvotes: 2, userVote: 0, createdAt: '2026-02-09T13:20:00Z', status: 'approved',
  },
  {
    id: 'seed-8', question: 'Quel protocole VPN est considere comme le plus securise actuellement ?',
    options: ['PPTP', 'L2TP', 'IPsec/IKEv2', 'GRE'], correct: 2,
    explanation: 'IPsec avec IKEv2 offre le meilleur equilibre entre securite (chiffrement AES) et performance. PPTP est obsolete.',
    category: 'vpn-ipsec', difficulty: 'difficile', authorName: 'Marie', authorId: 'seed-user-8',
    upvotes: 7, downvotes: 1, userVote: 0, createdAt: '2026-02-08T15:00:00Z', status: 'approved',
  },
  {
    id: 'seed-9', question: 'Quelle est la portee maximale theorique du Wi-Fi 6 (802.11ax) en interieur ?',
    options: ['30 metres', '50 metres', '70 metres', '100 metres'], correct: 1,
    explanation: 'Le Wi-Fi 6 a une portee interieure theorique d\'environ 50 metres, variable selon les obstacles et interferences.',
    category: 'securite-wireless', difficulty: 'difficile', authorName: 'Nicolas', authorId: 'seed-user-9',
    upvotes: 5, downvotes: 2, userVote: 0, createdAt: '2026-02-07T10:45:00Z', status: 'approved',
  },
  {
    id: 'seed-10', question: 'Quel outil de monitoring utilise le protocole SNMP pour superviser les equipements reseau ?',
    options: ['Wireshark', 'Nagios', 'Nmap', 'Metasploit'], correct: 1,
    explanation: 'Nagios est un outil de supervision qui utilise SNMP (entre autres) pour interroger les equipements et surveiller leur etat.',
    category: 'snmp', difficulty: 'moyen', authorName: 'Camille', authorId: 'seed-user-10',
    upvotes: 8, downvotes: 0, userVote: 0, createdAt: '2026-02-06T17:30:00Z', status: 'approved',
  },
]

function initQuestions(): CommunityQuestion[] {
  const existing = loadQuestions()
  if (existing.length > 0) return existing
  saveQuestions(SEED_QUESTIONS)
  return SEED_QUESTIONS
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--bg-primary)',
  border: '1px solid var(--border)',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-body)',
  fontSize: 14,
  padding: '10px 12px',
  outline: 'none',
  boxSizing: 'border-box',
  lineHeight: 1.6,
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-mono)',
  fontSize: 12,
  color: 'var(--text-secondary)',
  marginBottom: 6,
  textTransform: 'uppercase',
  letterSpacing: '1px',
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function CommunityQuiz() {
  const lang = useLangStore((s) => s.lang)
  const t = (fr: string, en: string) => lang === 'en' ? en : fr
  const allChapters = useChapters()

  const CATEGORIES = useMemo(() => [
    { value: 'all', label: t('Toutes les categories', 'All categories') },
    ...allChapters.map((ch) => ({ value: ch.slug, label: ch.title })),
    { value: 'general', label: t('General', 'General') },
  ], [allChapters, lang])

  const CATEGORY_OPTIONS = useMemo(() => CATEGORIES.filter((c) => c.value !== 'all'), [CATEGORIES])

  const getCategoryLabel = useCallback((slug: string): string => {
    if (slug === 'general') return t('General', 'General')
    const ch = allChapters.find((c) => c.slug === slug)
    return ch ? ch.title : slug
  }, [allChapters, lang])

  const user = useAuthStore((s) => s.user)
  const userId = useMemo(() => user?.id || getUserId(), [user])
  const authorName = user?.firstName || t('Anonyme', 'Anonymous')

  const [questions, setQuestions] = useState<CommunityQuestion[]>(initQuestions)
  const [activeTab, setActiveTab] = useState<Tab>('parcourir')
  const [toast, setToast] = useState<string | null>(null)

  // Browse state
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortMode, setSortMode] = useState<SortMode>('recent')
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)

  // Create state
  const [newQuestion, setNewQuestion] = useState('')
  const [newOptions, setNewOptions] = useState(['', '', '', ''])
  const [newCorrect, setNewCorrect] = useState<number | null>(null)
  const [newExplanation, setNewExplanation] = useState('')
  const [newCategory, setNewCategory] = useState('general')
  const [newDifficulty, setNewDifficulty] = useState<'facile' | 'moyen' | 'difficile'>('moyen')
  const [formErrors, setFormErrors] = useState<string[]>([])
  const [showPreview, setShowPreview] = useState(false)

  // Auto-approve questions with 5+ net upvotes
  useEffect(() => {
    let changed = false
    const updated = questions.map((q) => {
      if (q.status === 'pending' && q.upvotes - q.downvotes >= 5) {
        changed = true
        return { ...q, status: 'approved' as const }
      }
      return q
    })
    if (changed) {
      setQuestions(updated)
      saveQuestions(updated)
    }
  }, [questions])

  // Toast auto-dismiss
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  /* ---------- Browse logic ---------- */

  const filteredQuestions = useMemo(() => {
    let list = [...questions]
    if (categoryFilter !== 'all') {
      list = list.filter((q) => q.category === categoryFilter)
    }
    switch (sortMode) {
      case 'recent':
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'popular':
        list.sort((a, b) => (b.upvotes + b.downvotes) - (a.upvotes + a.downvotes))
        break
      case 'rating':
        list.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
        break
    }
    return list
  }, [questions, categoryFilter, sortMode])

  const visibleQuestions = filteredQuestions.slice(0, visibleCount)

  const handleVote = useCallback((questionId: string, vote: 1 | -1) => {
    setQuestions((prev) => {
      const updated = prev.map((q) => {
        if (q.id !== questionId) return q
        const prevVote = q.userVote
        let newUpvotes = q.upvotes
        let newDownvotes = q.downvotes
        let newUserVote = vote

        // Remove previous vote
        if (prevVote === 1) newUpvotes--
        if (prevVote === -1) newDownvotes--

        // Toggle off if same vote
        if (prevVote === vote) {
          newUserVote = 0 as any
        } else {
          if (vote === 1) newUpvotes++
          if (vote === -1) newDownvotes++
        }

        return { ...q, upvotes: newUpvotes, downvotes: newDownvotes, userVote: newUserVote }
      })
      saveQuestions(updated)
      return updated
    })
  }, [])

  /* ---------- Create logic ---------- */

  const validateForm = useCallback((): string[] => {
    const errors: string[] = []
    if (!newQuestion.trim()) errors.push(t('La question est requise', 'Question is required'))
    else if (newQuestion.trim().length < 20) errors.push(t('La question doit contenir au moins 20 caracteres', 'Question must be at least 20 characters'))
    for (let i = 0; i < 4; i++) {
      if (!newOptions[i].trim()) errors.push(t(`L'option ${String.fromCharCode(65 + i)} est requise`, `Option ${String.fromCharCode(65 + i)} is required`))
    }
    if (newCorrect === null) errors.push(t('Selectionnez la bonne reponse', 'Select the correct answer'))
    return errors
  }, [newQuestion, newOptions, newCorrect, lang])

  const handleSubmit = useCallback(() => {
    const errors = validateForm()
    setFormErrors(errors)
    if (errors.length > 0) return

    const newQ: CommunityQuestion = {
      id: crypto.randomUUID(),
      question: newQuestion.trim(),
      options: newOptions.map((o) => o.trim()),
      correct: newCorrect!,
      explanation: newExplanation.trim(),
      category: newCategory,
      difficulty: newDifficulty,
      authorName,
      authorId: userId,
      upvotes: 0,
      downvotes: 0,
      userVote: 0,
      createdAt: new Date().toISOString(),
      status: 'pending',
    }

    const updated = [newQ, ...questions]
    setQuestions(updated)
    saveQuestions(updated)

    // Reset form
    setNewQuestion('')
    setNewOptions(['', '', '', ''])
    setNewCorrect(null)
    setNewExplanation('')
    setNewCategory('general')
    setNewDifficulty('moyen')
    setFormErrors([])
    setShowPreview(false)
    setToast(t('Question soumise avec succes !', 'Question submitted successfully!'))
  }, [newQuestion, newOptions, newCorrect, newExplanation, newCategory, newDifficulty, authorName, userId, questions, validateForm])

  const updateOption = useCallback((index: number, value: string) => {
    setNewOptions((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }, [])

  /* ---------- My questions ---------- */

  const myQuestions = useMemo(() => {
    return questions.filter((q) => q.authorId === userId)
  }, [questions, userId])

  const myStats = useMemo(() => {
    const total = myQuestions.length
    const totalVotes = myQuestions.reduce((sum, q) => sum + q.upvotes - q.downvotes, 0)
    const approved = myQuestions.filter((q) => q.status === 'approved').length
    return { total, totalVotes, approved }
  }, [myQuestions])

  const handleDelete = useCallback((id: string) => {
    const updated = questions.filter((q) => q.id !== id)
    setQuestions(updated)
    saveQuestions(updated)
    setToast(t('Question supprimee', 'Question deleted'))
  }, [questions])

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'parcourir', label: t('Parcourir', 'Browse'), icon: <List size={16} /> },
    { key: 'creer', label: t('Creer', 'Create'), icon: <Plus size={16} /> },
    { key: 'mes-questions', label: t('Mes questions', 'My questions'), icon: <User size={16} /> },
  ]

  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px' }}>
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
            {t('// quiz communautaire', '// community quiz')}
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
            {t('Quiz Communautaire', 'Community Quiz')}
          </h1>
          <p
            style={{
              fontSize: 15,
              color: 'var(--text-secondary)',
              fontWeight: 300,
            }}
          >
            {t('Creez, partagez et jouez des questions creees par la communaute', 'Create, share and play community-created questions')}
          </p>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            gap: 2,
            marginBottom: 32,
            borderBottom: '1px solid var(--border)',
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setVisibleCount(ITEMS_PER_PAGE) }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 20px',
                background: activeTab === tab.key ? 'var(--bg-secondary)' : 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.key ? '2px solid var(--accent)' : '2px solid transparent',
                color: activeTab === tab.key ? 'var(--accent)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ====================================================== */}
          {/*  TAB 1: PARCOURIR                                       */}
          {/* ====================================================== */}
          {activeTab === 'parcourir' && (
            <motion.div
              key="parcourir"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
            >
              {/* Play button */}
              <Link
                to="/quiz-communautaire/jouer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  width: '100%',
                  maxWidth: 800,
                  padding: '16px 32px',
                  background: 'var(--accent)',
                  color: 'var(--bg-primary)',
                  border: 'none',
                  fontFamily: 'var(--font-heading)',
                  fontSize: 18,
                  fontWeight: 700,
                  textDecoration: 'none',
                  marginBottom: 28,
                  transition: 'opacity 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                <Play size={20} />
                {t('Jouer un quiz communautaire', 'Play a community quiz')}
              </Link>

              {/* Filters */}
              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  marginBottom: 24,
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  maxWidth: 800,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 200 }}>
                  <Filter size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  <div style={{ position: 'relative', flex: 1 }}>
                    <select
                      value={categoryFilter}
                      onChange={(e) => { setCategoryFilter(e.target.value); setVisibleCount(ITEMS_PER_PAGE) }}
                      style={{
                        width: '100%',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 12,
                        padding: '8px 12px',
                        outline: 'none',
                        cursor: 'pointer',
                        appearance: 'none',
                        paddingRight: 30,
                      }}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <SortDesc size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  <div style={{ display: 'flex', gap: 2 }}>
                    {([
                      { key: 'recent' as SortMode, label: t('Plus recentes', 'Most recent') },
                      { key: 'popular' as SortMode, label: t('Plus populaires', 'Most popular') },
                      { key: 'rating' as SortMode, label: t('Meilleure note', 'Best rated') },
                    ]).map((s) => (
                      <button
                        key={s.key}
                        onClick={() => setSortMode(s.key)}
                        style={{
                          padding: '6px 12px',
                          background: sortMode === s.key ? 'var(--accent)' : 'var(--bg-secondary)',
                          border: '1px solid var(--border)',
                          color: sortMode === s.key ? 'var(--bg-primary)' : 'var(--text-secondary)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: 11,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Counter */}
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 13,
                  color: 'var(--text-muted)',
                  marginBottom: 16,
                  maxWidth: 800,
                }}
              >
                {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''}
              </div>

              {/* Question cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 800 }}>
                {visibleQuestions.map((q, idx) => {
                  const netVotes = q.upvotes - q.downvotes
                  return (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.25, delay: (idx % ITEMS_PER_PAGE) * 0.03 }}
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border)',
                        padding: 20,
                      }}
                    >
                      {/* Top row: badges */}
                      <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 10,
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            padding: '3px 8px',
                            border: '1px solid var(--border)',
                            background: 'var(--bg-tertiary)',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {getCategoryLabel(q.category)}
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 10,
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            padding: '3px 8px',
                            border: `1px solid ${DIFFICULTY_COLORS[q.difficulty]}33`,
                            background: `${DIFFICULTY_COLORS[q.difficulty]}0d`,
                            color: DIFFICULTY_COLORS[q.difficulty],
                          }}
                        >
                          {t(q.difficulty, q.difficulty === 'facile' ? 'easy' : q.difficulty === 'moyen' ? 'medium' : 'hard')}
                        </span>
                        {q.status === 'pending' && (
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: 10,
                              textTransform: 'uppercase',
                              letterSpacing: '1px',
                              padding: '3px 8px',
                              border: '1px solid #f59e0b33',
                              background: '#f59e0b0d',
                              color: '#f59e0b',
                            }}
                          >
                            {t('En attente', 'Pending')}
                          </span>
                        )}
                      </div>

                      {/* Question preview */}
                      <div
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: 15,
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          lineHeight: 1.5,
                          marginBottom: 12,
                        }}
                      >
                        {q.question.length > 100 ? q.question.slice(0, 100) + '...' : q.question}
                      </div>

                      {/* Bottom row: author, date, votes */}
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
                            fontSize: 11,
                            color: 'var(--text-muted)',
                          }}
                        >
                          <User size={12} />
                          <span>{q.authorName}</span>
                          <span style={{ opacity: 0.4 }}>|</span>
                          <Clock size={11} />
                          <span>{formatDate(q.createdAt, lang)}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleVote(q.id, 1)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                              padding: '4px 10px',
                              background: q.userVote === 1 ? 'rgba(0, 229, 160, 0.15)' : 'transparent',
                              border: q.userVote === 1 ? '1px solid var(--accent)' : '1px solid var(--border)',
                              color: q.userVote === 1 ? 'var(--accent)' : 'var(--text-secondary)',
                              fontFamily: 'var(--font-mono)',
                              fontSize: 12,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <ThumbsUp size={13} />
                            <span style={{ color: '#00e5a0' }}>{q.upvotes}</span>
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleVote(q.id, -1)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                              padding: '4px 10px',
                              background: q.userVote === -1 ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
                              border: q.userVote === -1 ? '1px solid var(--error)' : '1px solid var(--border)',
                              color: q.userVote === -1 ? 'var(--error)' : 'var(--text-secondary)',
                              fontFamily: 'var(--font-mono)',
                              fontSize: 12,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <ThumbsDown size={13} />
                            <span style={{ color: 'var(--error)' }}>{q.downvotes}</span>
                          </motion.button>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: 11,
                              color: netVotes >= 0 ? 'var(--accent)' : 'var(--error)',
                              marginLeft: 4,
                            }}
                          >
                            ({netVotes >= 0 ? '+' : ''}{netVotes})
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Empty state */}
              {filteredQuestions.length === 0 && (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 14,
                    maxWidth: 800,
                  }}
                >
                  <Users size={40} style={{ marginBottom: 16, opacity: 0.3 }} />
                  <div>{t('Aucune question dans cette categorie.', 'No questions in this category.')}</div>
                </div>
              )}

              {/* Load more */}
              {visibleCount < filteredQuestions.length && (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setVisibleCount((c) => c + ITEMS_PER_PAGE)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    width: '100%',
                    maxWidth: 800,
                    padding: '14px 24px',
                    marginTop: 16,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <ChevronDown size={16} />
                  {t(`Charger plus (${filteredQuestions.length - visibleCount} restantes)`, `Load more (${filteredQuestions.length - visibleCount} remaining)`)}
                </motion.button>
              )}
            </motion.div>
          )}

          {/* ====================================================== */}
          {/*  TAB 2: CREER                                            */}
          {/* ====================================================== */}
          {activeTab === 'creer' && (
            <motion.div
              key="creer"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              style={{ maxWidth: 800 }}
            >
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  padding: 24,
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    color: 'var(--accent)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: 20,
                  }}
                >
                  {t('Creer une question', 'Create a question')}
                </div>

                {/* Errors */}
                {formErrors.length > 0 && (
                  <div
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      padding: 14,
                      marginBottom: 20,
                    }}
                  >
                    {formErrors.map((err, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          fontFamily: 'var(--font-mono)',
                          fontSize: 12,
                          color: 'var(--error)',
                          marginBottom: i < formErrors.length - 1 ? 6 : 0,
                        }}
                      >
                        <AlertCircle size={13} />
                        {err}
                      </div>
                    ))}
                  </div>
                )}

                {/* Question */}
                <div style={{ marginBottom: 18 }}>
                  <label style={labelStyle}>Question *</label>
                  <textarea
                    placeholder={t('Ecrivez votre question...', 'Write your question...')}
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: newQuestion.trim().length >= 20 ? 'var(--text-muted)' : 'var(--error)',
                      marginTop: 4,
                    }}
                  >
                    {newQuestion.trim().length}/20 {t('caracteres min.', 'characters min.')}
                  </div>
                </div>

                {/* Options A, B, C, D */}
                <div style={{ marginBottom: 18 }}>
                  <label style={labelStyle}>{t('Reponses * (selectionnez la bonne reponse)', 'Answers * (select the correct answer)')}</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <button
                          onClick={() => setNewCorrect(i)}
                          style={{
                            width: 32,
                            height: 32,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: newCorrect === i ? 'var(--accent)' : 'var(--bg-primary)',
                            border: newCorrect === i ? '2px solid var(--accent)' : '2px solid var(--border)',
                            color: newCorrect === i ? 'var(--bg-primary)' : 'var(--text-secondary)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: 13,
                            fontWeight: 700,
                            cursor: 'pointer',
                            flexShrink: 0,
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {String.fromCharCode(65 + i)}
                        </button>
                        <input
                          type="text"
                          placeholder={`Option ${String.fromCharCode(65 + i)}`}
                          value={newOptions[i]}
                          onChange={(e) => updateOption(i, e.target.value)}
                          style={{ ...inputStyle, flex: 1 }}
                        />
                        {newCorrect === i && (
                          <CheckCircle size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Explanation */}
                <div style={{ marginBottom: 18 }}>
                  <label style={labelStyle}>{t('Explication (optionnel)', 'Explanation (optional)')}</label>
                  <textarea
                    placeholder={t("Expliquez pourquoi c'est la bonne reponse...", 'Explain why this is the correct answer...')}
                    value={newExplanation}
                    onChange={(e) => setNewExplanation(e.target.value)}
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>

                {/* Category */}
                <div style={{ marginBottom: 18 }}>
                  <label style={labelStyle}>{t('Categorie', 'Category')}</label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      style={{
                        ...inputStyle,
                        fontFamily: 'var(--font-mono)',
                        fontSize: 13,
                        cursor: 'pointer',
                        appearance: 'none',
                        paddingRight: 30,
                      }}
                    >
                      {CATEGORY_OPTIONS.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                  </div>
                </div>

                {/* Difficulty */}
                <div style={{ marginBottom: 24 }}>
                  <label style={labelStyle}>{t('Difficulte', 'Difficulty')}</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {(['facile', 'moyen', 'difficile'] as const).map((d) => (
                      <button
                        key={d}
                        onClick={() => setNewDifficulty(d)}
                        style={{
                          padding: '8px 20px',
                          background: newDifficulty === d ? `${DIFFICULTY_COLORS[d]}15` : 'var(--bg-primary)',
                          border: newDifficulty === d
                            ? `1px solid ${DIFFICULTY_COLORS[d]}`
                            : '1px solid var(--border)',
                          color: newDifficulty === d ? DIFFICULTY_COLORS[d] : 'var(--text-secondary)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer',
                          textTransform: 'capitalize',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {t(d, d === 'facile' ? 'easy' : d === 'moyen' ? 'medium' : 'hard')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview toggle */}
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'none',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    padding: '8px 16px',
                    cursor: 'pointer',
                    marginBottom: 20,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Eye size={14} />
                  {showPreview ? t('Masquer', 'Hide') : t('Apercu', 'Preview')}
                </button>

                {/* Preview */}
                <AnimatePresence>
                  {showPreview && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: 'hidden', marginBottom: 20 }}
                    >
                      <div
                        style={{
                          background: 'var(--bg-tertiary)',
                          border: '1px solid var(--border)',
                          padding: 20,
                        }}
                      >
                        <div
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 11,
                            color: 'var(--accent)',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            marginBottom: 12,
                          }}
                        >
                          {t('Apercu de la question', 'Question preview')}
                        </div>
                        <h3
                          style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: 17,
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                            lineHeight: 1.4,
                            marginBottom: 16,
                          }}
                        >
                          {newQuestion || t('Votre question...', 'Your question...')}
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {newOptions.map((opt, i) => (
                            <div
                              key={i}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                padding: '10px 14px',
                                background: newCorrect === i ? 'rgba(0, 229, 160, 0.1)' : 'var(--bg-secondary)',
                                border: newCorrect === i ? '1px solid var(--accent)' : '1px solid var(--border)',
                                color: newCorrect === i ? 'var(--accent)' : 'var(--text-primary)',
                              }}
                            >
                              <span
                                style={{
                                  fontFamily: 'var(--font-mono)',
                                  fontSize: 12,
                                  fontWeight: 700,
                                  width: 24,
                                  height: 24,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  border: `1px solid ${newCorrect === i ? 'var(--accent)' : 'var(--border)'}`,
                                  flexShrink: 0,
                                }}
                              >
                                {String.fromCharCode(65 + i)}
                              </span>
                              <span style={{ fontFamily: 'var(--font-body)', fontSize: 14 }}>
                                {opt || `Option ${String.fromCharCode(65 + i)}`}
                              </span>
                              {newCorrect === i && <CheckCircle size={16} style={{ marginLeft: 'auto', flexShrink: 0 }} />}
                            </div>
                          ))}
                        </div>
                        {newExplanation.trim() && (
                          <div
                            style={{
                              marginTop: 14,
                              padding: 14,
                              background: 'var(--bg-secondary)',
                              border: '1px solid var(--border)',
                            }}
                          >
                            <div
                              style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: 10,
                                color: 'var(--accent)',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                marginBottom: 6,
                              }}
                            >
                              {t('Explication', 'Explanation')}
                            </div>
                            <p
                              style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: 13,
                                color: 'var(--text-secondary)',
                                lineHeight: 1.6,
                                margin: 0,
                              }}
                            >
                              {newExplanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    width: '100%',
                    padding: '14px 32px',
                    background: 'var(--accent)',
                    color: 'var(--bg-primary)',
                    border: 'none',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'opacity 0.15s ease',
                  }}
                >
                  <Send size={18} />
                  {t('SOUMETTRE', 'SUBMIT')}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ====================================================== */}
          {/*  TAB 3: MES QUESTIONS                                    */}
          {/* ====================================================== */}
          {activeTab === 'mes-questions' && (
            <motion.div
              key="mes-questions"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              style={{ maxWidth: 800 }}
            >
              {/* Stats */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 2,
                  marginBottom: 28,
                }}
              >
                <div
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    padding: 20,
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: 'var(--text-secondary)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: 8,
                    }}
                  >
                    {t('Soumises', 'Submitted')}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 28,
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {myStats.total}
                  </div>
                </div>
                <div
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    padding: 20,
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: 'var(--text-secondary)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: 8,
                    }}
                  >
                    {t('Votes recus', 'Votes received')}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 28,
                      fontWeight: 700,
                      color: myStats.totalVotes >= 0 ? 'var(--accent)' : 'var(--error)',
                    }}
                  >
                    {myStats.totalVotes >= 0 ? '+' : ''}{myStats.totalVotes}
                  </div>
                </div>
                <div
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    padding: 20,
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: 'var(--text-secondary)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: 8,
                    }}
                  >
                    {t('Approuvees', 'Approved')}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 28,
                      fontWeight: 700,
                      color: 'var(--accent)',
                    }}
                  >
                    {myStats.approved}
                  </div>
                </div>
              </div>

              {/* My questions list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {myQuestions.map((q, idx) => (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.03 }}
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      padding: 18,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        {/* Badges */}
                        <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: 10,
                              padding: '2px 8px',
                              border: q.status === 'approved'
                                ? '1px solid rgba(0, 229, 160, 0.3)'
                                : '1px solid #f59e0b33',
                              background: q.status === 'approved'
                                ? 'rgba(0, 229, 160, 0.1)'
                                : '#f59e0b0d',
                              color: q.status === 'approved' ? 'var(--accent)' : '#f59e0b',
                              textTransform: 'uppercase',
                              letterSpacing: '1px',
                            }}
                          >
                            {q.status === 'approved' ? t('Approuvee', 'Approved') : t('En attente', 'Pending')}
                          </span>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: 10,
                              padding: '2px 8px',
                              border: `1px solid ${DIFFICULTY_COLORS[q.difficulty]}33`,
                              color: DIFFICULTY_COLORS[q.difficulty],
                              textTransform: 'uppercase',
                              letterSpacing: '1px',
                            }}
                          >
                            {t(q.difficulty, q.difficulty === 'facile' ? 'easy' : q.difficulty === 'moyen' ? 'medium' : 'hard')}
                          </span>
                        </div>

                        {/* Question text */}
                        <div
                          style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: 14,
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            lineHeight: 1.5,
                            marginBottom: 8,
                          }}
                        >
                          {q.question}
                        </div>

                        {/* Votes */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            fontFamily: 'var(--font-mono)',
                            fontSize: 11,
                            color: 'var(--text-muted)',
                          }}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <ThumbsUp size={12} style={{ color: '#00e5a0' }} />
                            {q.upvotes}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <ThumbsDown size={12} style={{ color: 'var(--error)' }} />
                            {q.downvotes}
                          </span>
                          <span style={{ opacity: 0.4 }}>|</span>
                          <span>{formatDate(q.createdAt, lang)}</span>
                        </div>
                      </div>

                      {/* Delete button */}
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(q.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 34,
                          height: 34,
                          background: 'transparent',
                          border: '1px solid var(--border)',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          flexShrink: 0,
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--error)'
                          e.currentTarget.style.color = 'var(--error)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--border)'
                          e.currentTarget.style.color = 'var(--text-muted)'
                        }}
                      >
                        <Trash2 size={15} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Empty state */}
              {myQuestions.length === 0 && (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 14,
                  }}
                >
                  <Star size={40} style={{ marginBottom: 16, opacity: 0.3 }} />
                  <div>
                    {t("Vous n'avez pas encore soumis de questions.", 'You have not submitted any questions yet.')}
                    <br />
                    <button
                      onClick={() => setActiveTab('creer')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 13,
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        marginTop: 8,
                      }}
                    >
                      {t('Creer votre premiere question', 'Create your first question')}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 40, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 40, x: '-50%' }}
              transition={{ duration: 0.25 }}
              style={{
                position: 'fixed',
                bottom: 24,
                left: '50%',
                background: 'var(--accent)',
                color: 'var(--bg-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                fontWeight: 600,
                padding: '12px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                zIndex: 1000,
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}
            >
              <CheckCircle size={16} />
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
