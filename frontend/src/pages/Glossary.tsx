import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { type GlossaryTerm } from '../data/glossaryTerms'
import { useGlossary, useTranslation, useFormationFromUrl } from '../hooks/useTranslation'

export default function Glossary() {
  const { t } = useTranslation()
  const formation = useFormationFromUrl()
  const glossaryTerms = useGlossary()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(t('Tous', 'All'))

  const allLabel = t('Tous', 'All')
  const categories = useMemo(
    () => [allLabel, ...new Set(glossaryTerms.map((gt: GlossaryTerm) => gt.category))],
    [glossaryTerms, allLabel]
  )

  const filteredTerms = useMemo(() => {
    const query = search.trim().toLowerCase()
    return glossaryTerms
      .filter((gt: GlossaryTerm) => {
        const matchesCategory = activeCategory === allLabel || gt.category === activeCategory
        const matchesSearch =
          !query ||
          gt.term.toLowerCase().includes(query) ||
          gt.definition.toLowerCase().includes(query)
        return matchesCategory && matchesSearch
      })
      .sort((a: GlossaryTerm, b: GlossaryTerm) => a.term.localeCompare(b.term, 'fr'))
  }, [search, activeCategory, glossaryTerms, allLabel])

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
            {t('// glossaire', '// glossary')}
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
            {t('Glossaire Reseau', 'Network Glossary')}
          </h1>
          <p
            style={{
              fontSize: 15,
              color: 'var(--text-secondary)',
              fontWeight: 300,
            }}
          >
            {t('Tous les termes essentiels du networking, classes par categorie. Recherchez un mot-cle ou filtrez par theme.', 'All essential networking terms, sorted by category. Search for a keyword or filter by topic.')}
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            placeholder={t('Rechercher un terme ou une definition...', 'Search for a term or definition...')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: 14,
              padding: '12px 16px 12px 44px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Category filters */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 24,
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background:
                  activeCategory === cat ? 'var(--accent)' : 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                color:
                  activeCategory === cat ? 'var(--bg-primary)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                padding: '6px 14px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results counter */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            color: 'var(--text-muted)',
            marginBottom: 20,
          }}
        >
          {filteredTerms.length} {t('terme', 'term')}{filteredTerms.length !== 1 ? 's' : ''}
        </div>

        {/* Card grid */}
        <div
          className="glossary-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
            gap: 2,
          }}
        >
          {filteredTerms.map((term: GlossaryTerm, index: number) => (
            <motion.div
              key={term.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index % 10 * 0.03 }}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                padding: 20,
              }}
            >
              {/* Category badge */}
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: 'var(--accent)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: 8,
                }}
              >
                {term.category}
              </div>

              {/* Term name */}
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 16,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: 8,
                }}
              >
                {term.term}
              </div>

              {/* Definition */}
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {term.definition}
              </p>

              {/* Related chapter link */}
              {term.relatedChapter && (
                <Link
                  to={`/${formation}/cours/${term.relatedChapter}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    marginTop: 12,
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    color: 'var(--accent)',
                    textDecoration: 'none',
                  }}
                >
                  {t('Voir le cours', 'View course')} <ArrowRight size={13} />
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        {/* Empty state */}
        {filteredTerms.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: 14,
            }}
          >
            {t('Aucun terme ne correspond a votre recherche.', 'No terms match your search.')}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .glossary-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
