import { Helmet } from 'react-helmet-async'
import { useLangStore } from '../stores/langStore'

interface SEOProps {
  title?: string
  description?: string
  url?: string
  type?: string
  image?: string
  jsonLd?: Record<string, unknown>
  jsonLdArray?: Record<string, unknown>[]
}

const BASE_URL = 'https://netrevision.fr'
const DEFAULT_IMAGE = `${BASE_URL}/logo-512.png`

const DEFAULTS = {
  fr: {
    title: 'NetRevision - Cours Reseaux Interactifs',
    desc: 'Plateforme de revision interactive pour les reseaux informatiques. 49 chapitres, 690+ QCM, 6 examens finaux, simulateur Cisco, exercices CCNA.',
    locale: 'fr_FR',
  },
  en: {
    title: 'NetRevision - Interactive Networking Courses',
    desc: 'Interactive study platform for computer networking. 49 chapters, 690+ quizzes, 6 final exams, Cisco simulator, CCNA exercises.',
    locale: 'en_US',
  },
}

export default function SEO({ title, description, url, type = 'website', image, jsonLd, jsonLdArray }: SEOProps) {
  const lang = useLangStore((s) => s.lang)
  const d = DEFAULTS[lang]
  const fullTitle = title ? `${title} | NetRevision` : d.title
  const desc = description || d.desc
  const fullUrl = url ? `${BASE_URL}${url}` : BASE_URL
  const img = image || DEFAULT_IMAGE

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={fullUrl} />

      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={img} />
      <meta property="og:site_name" content="NetRevision" />
      <meta property="og:locale" content={d.locale} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
      {jsonLdArray && jsonLdArray.map((ld, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(ld)}
        </script>
      ))}
    </Helmet>
  )
}
