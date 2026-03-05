import { useParams, Link, Navigate } from 'react-router-dom'
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, Calendar, User, Tag, BookOpen, ArrowRight, Info } from 'lucide-react'
import { blogArticles as allArticles } from '../data/allBlogArticles'

const now = new Date()
now.setHours(23, 59, 59, 999)
const blogArticles = allArticles.filter((a) => new Date(a.publishDate) <= now)
import { blogFaqs } from '../data/blogFaqs'
import SEO from '../components/SEO'
import { useTranslation } from '../hooks/useTranslation'

const categoryColors: Record<string, string> = {
  tutoriel: '#00e5a0',
  certification: '#6366f1',
  avance: '#f59e0b',
}

const categoryLabelsFr: Record<string, string> = {
  tutoriel: 'Tutoriel',
  certification: 'Certification CCNA',
  avance: 'Avance',
}

const categoryLabelsEn: Record<string, string> = {
  tutoriel: 'Tutorial',
  certification: 'CCNA Certification',
  avance: 'Advanced',
}

export default function BlogArticle() {
  const { t, lang } = useTranslation()
  const categoryLabels = lang === 'en' ? categoryLabelsEn : categoryLabelsFr
  const { slug } = useParams<{ slug: string }>()
  const article = blogArticles.find((a) => a.slug === slug)

  const related = useMemo(() => {
    if (!article) return []
    return blogArticles
      .filter((a) => a.slug !== article.slug && a.category === article.category)
      .slice(0, 3)
  }, [article])

  if (!article) return <Navigate to="/blog" />

  const faq = blogFaqs[article.slug] || []

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': article.title,
    'description': article.description,
    'author': {
      '@type': 'Person',
      'name': 'Morvin Quernel',
      'url': 'https://netrevision.fr/auteur',
      'jobTitle': 'Fondateur & Formateur Reseaux',
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'NetRevision',
      'url': 'https://netrevision.fr',
      'logo': { '@type': 'ImageObject', 'url': 'https://netrevision.fr/logo-512.png' },
    },
    'datePublished': article.publishDate,
    'dateModified': article.publishDate,
    'url': `https://netrevision.fr/blog/${article.slug}`,
    'mainEntityOfPage': `https://netrevision.fr/blog/${article.slug}`,
    'keywords': article.tags.join(', '),
    'inLanguage': 'fr',
    'isAccessibleForFree': true,
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Accueil', 'item': 'https://netrevision.fr' },
      { '@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': 'https://netrevision.fr/blog' },
      { '@type': 'ListItem', 'position': 3, 'name': article.title, 'item': `https://netrevision.fr/blog/${article.slug}` },
    ],
  }

  const schemas: Record<string, unknown>[] = [articleJsonLd, breadcrumbJsonLd]

  if (faq.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faq.map((f) => ({
        '@type': 'Question',
        'name': f.question,
        'acceptedAnswer': { '@type': 'Answer', 'text': f.answer },
      })),
    })
  }

  return (
    <div style={{ paddingTop: 56, minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <SEO
        title={article.title}
        description={article.description}
        url={`/blog/${article.slug}`}
        type="article"
        jsonLdArray={schemas}
      />

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '40px 24px' }}>
        {/* Breadcrumb */}
        <nav style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 12 }}>
          <Link to="/blog" style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <ArrowLeft size={14} /> Blog
          </Link>
          <span style={{ color: 'var(--text-muted)' }}>/</span>
          <span style={{ color: categoryColors[article.category] || 'var(--accent)' }}>
            {categoryLabels[article.category]}
          </span>
        </nav>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: 40 }}
        >
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: 1.5,
            color: categoryColors[article.category] || 'var(--accent)',
            marginBottom: 16,
          }}>
            {categoryLabels[article.category]}
          </div>

          <h1 style={{
            fontFamily: 'var(--font-heading)', fontSize: 'clamp(26px, 5vw, 38px)',
            fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 20,
          }}>
            {article.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', marginBottom: 16 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
              <User size={13} /> <Link to="/auteur" style={{ color: 'var(--text-muted)' }}>{article.author}</Link>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
              <Calendar size={13} /> {new Date(article.publishDate).toLocaleDateString(lang === 'en' ? 'en-US' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
              <Clock size={13} /> {article.readTime} {t('de lecture', 'read')}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {article.tags.map((tag) => (
              <span key={tag} style={{
                padding: '3px 10px', background: 'var(--bg-secondary)',
                fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
              }}>
                <Tag size={10} style={{ marginRight: 4 }} />{tag}
              </span>
            ))}
          </div>
        </motion.header>

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

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--border)', marginBottom: 40 }} />

        {/* Article content */}
        <article>
          {article.sections.map((section, i) => (
            <motion.section
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.3 }}
              style={{ marginBottom: 36 }}
            >
              <h2 style={{
                fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 600,
                color: 'var(--text-primary)', marginBottom: 16,
                paddingLeft: 14, borderLeft: `3px solid ${categoryColors[article.category] || 'var(--accent)'}`,
              }}>
                {section.title}
              </h2>
              <div style={{
                fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--text-secondary)',
                lineHeight: 1.8,
              }}>
                {section.content.split('\n\n').map((paragraph, j) => {
                  if (paragraph.startsWith('- ')) {
                    const items = paragraph.split('\n').filter((l) => l.startsWith('- '))
                    return (
                      <ul key={j} style={{ paddingLeft: 20, marginBottom: 16 }}>
                        {items.map((item, k) => (
                          <li key={k} style={{ marginBottom: 6 }}>{item.slice(2)}</li>
                        ))}
                      </ul>
                    )
                  }
                  if (paragraph.startsWith('```')) {
                    const code = paragraph.replace(/^```\w*\n?/, '').replace(/\n?```$/, '')
                    return (
                      <pre key={j} style={{
                        background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                        padding: 16, marginBottom: 16, overflow: 'auto',
                        fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--accent)',
                        lineHeight: 1.5,
                      }}>
                        {code}
                      </pre>
                    )
                  }
                  return <p key={j} style={{ marginBottom: 14 }}>{paragraph}</p>
                })}
              </div>
            </motion.section>
          ))}
        </article>

        {/* FAQ Section */}
        {faq.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ marginBottom: 36 }}
          >
            <h2 style={{
              fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 600,
              color: 'var(--text-primary)', marginBottom: 20,
              paddingLeft: 14, borderLeft: '3px solid var(--accent)',
            }}>
              {t('Questions frequentes', 'Frequently Asked Questions')}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {faq.map((f, i) => (
                <div key={i} style={{
                  background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '16px 20px',
                }}>
                  <h3 style={{
                    fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 600,
                    color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.4,
                  }}>
                    {f.question}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-secondary)',
                    lineHeight: 1.7, margin: 0,
                  }}>
                    {f.answer}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Related chapters */}
        {article.relatedChapters.length > 0 && (
          <div style={{
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            padding: 24, marginBottom: 32,
          }}>
            <h3 style={{
              fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 600,
              color: 'var(--text-primary)', marginBottom: 16,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <BookOpen size={18} style={{ color: 'var(--accent)' }} /> {t('Chapitres lies', 'Related Chapters')}
            </h3>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {article.relatedChapters.map((slug) => (
                <Link key={slug} to={`/cours/${slug}`} style={{
                  padding: '8px 16px', background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border)', fontFamily: 'var(--font-mono)',
                  fontSize: 12, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 6,
                  transition: 'border-color 0.15s',
                }}>
                  {slug} <ArrowRight size={12} />
                </Link>
              ))}
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted)', marginTop: 12 }}>
              {t('Connectez-vous pour acceder aux cours complets, quiz et exercices.', 'Log in to access full courses, quizzes and exercises.')}
            </p>
          </div>
        )}

        {/* Related articles */}
        {related.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <h3 style={{
              fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 600,
              color: 'var(--text-primary)', marginBottom: 20,
            }}>
              {t('Articles similaires', 'Related Articles')}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
              {related.map((a) => (
                <Link key={a.slug} to={`/blog/${a.slug}`} style={{ display: 'block' }}>
                  <motion.div
                    whileHover={{ borderColor: 'var(--accent)' }}
                    style={{
                      background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                      padding: 20, transition: 'border-color 0.2s',
                    }}
                  >
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
                      textTransform: 'uppercase', color: categoryColors[a.category],
                      marginBottom: 8,
                    }}>
                      {categoryLabels[a.category]}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 600,
                      color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 8,
                    }}>
                      {a.title}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                      {a.readTime}
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={{
          background: 'var(--bg-secondary)', border: '1px solid var(--border)',
          padding: '40px 28px', textAlign: 'center',
        }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>
            {t('Envie d\'aller plus loin ?', 'Want to go further?')}
          </h3>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20, maxWidth: 480, margin: '0 auto 20px' }}>
            {t('Creez votre compte gratuit pour acceder a 49 chapitres de cours, 690+ QCM, 6 examens finaux, un simulateur Cisco et des exercices pratiques.', 'Create your free account to access 49 course chapters, 690+ MCQs, 6 final exams, a Cisco simulator and practical exercises.')}
          </p>
          <Link to="/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 28px', background: 'var(--accent)', color: 'var(--bg-primary)',
            fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600,
          }}>
            {t('Commencer gratuitement', 'Start for free')} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}
