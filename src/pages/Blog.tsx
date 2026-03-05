import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Clock, Calendar, Tag, ArrowRight, BookOpen, Info } from 'lucide-react'
import { blogArticles as allArticles } from '../data/allBlogArticles'

const now = new Date()
now.setHours(23, 59, 59, 999)
const blogArticles = allArticles.filter((a) => new Date(a.publishDate) <= now)
import SEO from '../components/SEO'
import { useTranslation } from '../hooks/useTranslation'

const categoryColors: Record<string, string> = {
  tutoriel: '#00e5a0',
  certification: '#6366f1',
  avance: '#f59e0b',
}

export default function Blog() {
  const { t, lang } = useTranslation()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('tous')

  const categories = [
    { value: 'tous', label: t('Tous', 'All') },
    { value: 'tutoriel', label: t('Tutoriels', 'Tutorials') },
    { value: 'certification', label: 'Certification' },
    { value: 'avance', label: t('Avance', 'Advanced') },
  ]

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return blogArticles
      .filter((a) => {
        if (category !== 'tous' && a.category !== category) return false
        if (q && !a.title.toLowerCase().includes(q) && !a.description.toLowerCase().includes(q) && !a.tags.some((t) => t.toLowerCase().includes(q))) return false
        return true
      })
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
  }, [search, category])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    'name': 'Blog NetRevision',
    'description': 'Articles, tutoriels et guides sur les reseaux informatiques et la certification CCNA.',
    'url': 'https://netrevision.fr/blog',
    'publisher': {
      '@type': 'Organization',
      'name': 'QUERNEL INTELLIGENCE',
    },
  }

  return (
    <div style={{ paddingTop: 56, minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <SEO
        title={t('Blog - Articles Reseaux & CCNA', 'Blog - Networking & CCNA Articles')}
        description={t('Articles, tutoriels et guides sur les reseaux informatiques, la certification CCNA, le subnetting, OSPF, les VLAN et plus encore.', 'Articles, tutorials and guides on computer networks, CCNA certification, subnetting, OSPF, VLANs and more.')}
        url="/blog"
        jsonLd={jsonLd}
      />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: 40, textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)', marginBottom: 8, letterSpacing: 2, textTransform: 'uppercase' }}>
            // blog
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
            Blog <span style={{ color: 'var(--accent)' }}>NetRevision</span>
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto' }}>
            {t('Tutoriels, guides de certification CCNA et articles avances sur les reseaux informatiques.', 'Tutorials, CCNA certification guides and advanced articles on computer networks.')}
          </p>
        </div>

        {/* English language banner */}
        {lang === 'en' && (
          <div style={{
            background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)',
            padding: '12px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <Info size={16} style={{ color: '#6366f1', flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-secondary)' }}>
              Articles are available in French only.
            </span>
          </div>
        )}

        {/* Search + Filters */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            padding: '12px 16px', marginBottom: 16,
          }}>
            <Search size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <input
              type="text"
              placeholder={t('Rechercher un article...', 'Search for an article...')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--text-primary)',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                style={{
                  padding: '6px 16px', border: '1px solid var(--border)',
                  background: category === c.value ? 'var(--accent)' : 'var(--bg-secondary)',
                  color: category === c.value ? 'var(--bg-primary)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 500,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>
          {filtered.length} article{filtered.length !== 1 ? 's' : ''}
        </div>

        {/* Articles grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 20,
          marginBottom: 60,
        }}>
          {filtered.map((article, i) => (
            <Link key={article.slug} to={`/blog/${article.slug}`} style={{ display: 'block' }}>
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                whileHover={{ borderColor: 'var(--accent)' }}
                style={{
                  background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                  padding: 24, height: '100%', display: 'flex', flexDirection: 'column',
                  transition: 'border-color 0.2s',
                }}
              >
                {/* Category badge */}
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
                  textTransform: 'uppercase', letterSpacing: 1.5,
                  color: categoryColors[article.category] || 'var(--accent)',
                  marginBottom: 12,
                }}>
                  {article.category === 'tutoriel' ? t('Tutoriel', 'Tutorial') : article.category === 'certification' ? 'Certification CCNA' : t('Avance', 'Advanced')}
                </div>

                {/* Title */}
                <h2 style={{
                  fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 600,
                  color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 10,
                }}>
                  {article.title}
                </h2>

                {/* Description */}
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-secondary)',
                  lineHeight: 1.6, marginBottom: 16, flex: 1,
                }}>
                  {article.description}
                </p>

                {/* Meta */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                    <Calendar size={12} /> {new Date(article.publishDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                    <Clock size={12} /> {article.readTime}
                  </span>
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {article.tags.slice(0, 3).map((tag) => (
                    <span key={tag} style={{
                      padding: '2px 8px', background: 'var(--bg-tertiary)',
                      fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)',
                      border: '1px solid var(--border)',
                    }}>
                      <Tag size={9} style={{ marginRight: 3 }} />{tag}
                    </span>
                  ))}
                </div>
              </motion.article>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <BookOpen size={48} style={{ color: 'var(--text-muted)', marginBottom: 16 }} />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--text-secondary)' }}>
              {t('Aucun article ne correspond a votre recherche.', 'No articles match your search.')}
            </p>
          </div>
        )}

        {/* CTA */}
        <div style={{
          background: 'var(--bg-secondary)', border: '1px solid var(--border)',
          padding: '48px 32px', textAlign: 'center',
        }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
            {t('Pret a reviser les', 'Ready to study')} <span style={{ color: 'var(--accent)' }}>{t('reseaux', 'networking')}</span> ?
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, maxWidth: 500, margin: '0 auto 24px' }}>
            {t('49 chapitres, 690+ QCM, 6 examens finaux, simulateur Cisco, exercices de subnetting et bien plus.', '49 chapters, 690+ MCQs, 6 final exams, Cisco simulator, subnetting exercises and much more.')}
          </p>
          <Link to="/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 28px', background: 'var(--accent)', color: 'var(--bg-primary)',
            fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600,
            transition: 'background 0.15s',
          }}>
            {t('Creer un compte gratuit', 'Create a free account')} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}
