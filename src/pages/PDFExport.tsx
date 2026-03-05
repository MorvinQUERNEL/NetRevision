import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FileDown, BookOpen, ChevronDown, Download, Check } from 'lucide-react'
import jsPDF from 'jspdf'
import type { Chapter } from '../data/chapters'
import { useLangStore } from '../stores/langStore'
import { useChaptersByProgram } from '../hooks/useTranslation'

function stripMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    .replace(/`{1,3}[^`]*`{1,3}/g, (m) => m.replace(/`/g, ''))
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^\s*[-*+]\s+/gm, '  - ')
    .replace(/^\s*\d+\.\s+/gm, (m) => '  ' + m.trim() + ' ')
    .replace(/>\s?/g, '')
    .replace(/---+/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function addPageNumber(doc: jsPDF, pageNum: number) {
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  doc.setFontSize(9)
  doc.setTextColor(150, 150, 150)
  doc.text(`Page ${pageNum}`, pageWidth / 2, pageHeight - 12, { align: 'center' })
}

function addTitlePage(doc: jsPDF, title: string, subtitle: string) {
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  // Green accent bar at the top
  doc.setFillColor(0, 229, 160)
  doc.rect(0, 0, pageWidth, 6, 'F')

  // Brand name
  doc.setFontSize(14)
  doc.setTextColor(0, 229, 160)
  doc.text('NetRevision', pageWidth / 2, 40, { align: 'center' })

  // Decorative line
  doc.setDrawColor(0, 229, 160)
  doc.setLineWidth(0.5)
  doc.line(pageWidth / 2 - 40, 48, pageWidth / 2 + 40, 48)

  // Main title
  doc.setFontSize(26)
  doc.setTextColor(40, 40, 40)
  const titleLines = doc.splitTextToSize(title, pageWidth - 60)
  doc.text(titleLines, pageWidth / 2, pageHeight / 2 - 20, { align: 'center' })

  // Subtitle
  doc.setFontSize(13)
  doc.setTextColor(120, 120, 120)
  const subtitleLines = doc.splitTextToSize(subtitle, pageWidth - 60)
  doc.text(subtitleLines, pageWidth / 2, pageHeight / 2 + 10, { align: 'center' })

  // Footer label
  doc.setFontSize(10)
  doc.setTextColor(160, 160, 160)
  doc.text('Fiche de revision', pageWidth / 2, pageHeight - 30, { align: 'center' })

  // Green accent bar at the bottom
  doc.setFillColor(0, 229, 160)
  doc.rect(0, pageHeight - 6, pageWidth, 6, 'F')
}

function generateChapterPDF(chapter: Chapter): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const contentWidth = pageWidth - margin * 2
  let y = 0
  let pageNum = 1

  // Title page
  addTitlePage(doc, chapter.title, chapter.subtitle)
  addPageNumber(doc, pageNum)

  // Content pages
  doc.addPage()
  pageNum++
  y = 25

  // Chapter meta header
  doc.setFillColor(0, 229, 160)
  doc.rect(0, 0, pageWidth, 3, 'F')

  doc.setFontSize(10)
  doc.setTextColor(0, 229, 160)
  doc.text(`Chapitre ${chapter.id}`, margin, y)
  y += 6

  doc.setFontSize(18)
  doc.setTextColor(40, 40, 40)
  const chapterTitleLines = doc.splitTextToSize(chapter.title, contentWidth)
  doc.text(chapterTitleLines, margin, y)
  y += chapterTitleLines.length * 8 + 2

  doc.setFontSize(10)
  doc.setTextColor(120, 120, 120)
  doc.text(`Duree : ${chapter.duration}   |   Niveau : ${chapter.level}`, margin, y)
  y += 10

  // Separator line
  doc.setDrawColor(0, 229, 160)
  doc.setLineWidth(0.3)
  doc.line(margin, y, pageWidth - margin, y)
  y += 10

  // Sections
  for (const section of chapter.sections) {
    const cleanContent = stripMarkdown(section.content)

    // Section title
    if (y > pageHeight - 40) {
      addPageNumber(doc, pageNum)
      doc.addPage()
      pageNum++
      y = 20
      doc.setFillColor(0, 229, 160)
      doc.rect(0, 0, pageWidth, 3, 'F')
    }

    doc.setFontSize(13)
    doc.setTextColor(0, 140, 100)
    const sectionTitleLines = doc.splitTextToSize(section.title, contentWidth)
    doc.text(sectionTitleLines, margin, y)
    y += sectionTitleLines.length * 6 + 4

    // Section content
    doc.setFontSize(10)
    doc.setTextColor(60, 60, 60)
    const lines = doc.splitTextToSize(cleanContent, contentWidth)

    for (const line of lines) {
      if (y > pageHeight - 20) {
        addPageNumber(doc, pageNum)
        doc.addPage()
        pageNum++
        y = 20
        doc.setFillColor(0, 229, 160)
        doc.rect(0, 0, pageWidth, 3, 'F')
        doc.setFontSize(10)
        doc.setTextColor(60, 60, 60)
      }
      doc.text(line, margin, y)
      y += 5
    }

    y += 8
  }

  addPageNumber(doc, pageNum)
  return doc
}

function generateAllChaptersPDF(allChapters: Chapter[]): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const contentWidth = pageWidth - margin * 2
  let pageNum = 1

  // Global title page
  addTitlePage(doc, 'Fiches de Revision Completes', `${allChapters.length} chapitres — Programmes 1, 2, 3 & 4`)
  addPageNumber(doc, pageNum)

  for (const chapter of allChapters) {
    // Chapter title page
    doc.addPage()
    pageNum++
    addTitlePage(doc, chapter.title, chapter.subtitle)
    addPageNumber(doc, pageNum)

    // Content
    doc.addPage()
    pageNum++
    let y = 25

    doc.setFillColor(0, 229, 160)
    doc.rect(0, 0, pageWidth, 3, 'F')

    doc.setFontSize(10)
    doc.setTextColor(0, 229, 160)
    doc.text(`Chapitre ${chapter.id}`, margin, y)
    y += 6

    doc.setFontSize(18)
    doc.setTextColor(40, 40, 40)
    const chapterTitleLines = doc.splitTextToSize(chapter.title, contentWidth)
    doc.text(chapterTitleLines, margin, y)
    y += chapterTitleLines.length * 8 + 2

    doc.setFontSize(10)
    doc.setTextColor(120, 120, 120)
    doc.text(`Duree : ${chapter.duration}   |   Niveau : ${chapter.level}`, margin, y)
    y += 10

    doc.setDrawColor(0, 229, 160)
    doc.setLineWidth(0.3)
    doc.line(margin, y, pageWidth - margin, y)
    y += 10

    for (const section of chapter.sections) {
      const cleanContent = stripMarkdown(section.content)

      if (y > pageHeight - 40) {
        addPageNumber(doc, pageNum)
        doc.addPage()
        pageNum++
        y = 20
        doc.setFillColor(0, 229, 160)
        doc.rect(0, 0, pageWidth, 3, 'F')
      }

      doc.setFontSize(13)
      doc.setTextColor(0, 140, 100)
      const sectionTitleLines = doc.splitTextToSize(section.title, contentWidth)
      doc.text(sectionTitleLines, margin, y)
      y += sectionTitleLines.length * 6 + 4

      doc.setFontSize(10)
      doc.setTextColor(60, 60, 60)
      const lines = doc.splitTextToSize(cleanContent, contentWidth)

      for (const line of lines) {
        if (y > pageHeight - 20) {
          addPageNumber(doc, pageNum)
          doc.addPage()
          pageNum++
          y = 20
          doc.setFillColor(0, 229, 160)
          doc.rect(0, 0, pageWidth, 3, 'F')
          doc.setFontSize(10)
          doc.setTextColor(60, 60, 60)
        }
        doc.text(line, margin, y)
        y += 5
      }

      y += 8
    }

    addPageNumber(doc, pageNum)
  }

  return doc
}

export default function PDFExport() {
  const lang = useLangStore((s) => s.lang)
  const t = (fr: string, en: string) => lang === 'en' ? en : fr
  const { chapters, chapters2, chapters3, chapters4 } = useChaptersByProgram()

  const [selectedChapterId, setSelectedChapterId] = useState<number | 'all'>('all')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGeneratingAll, setIsGeneratingAll] = useState(false)
  const [downloadedSingle, setDownloadedSingle] = useState(false)
  const [downloadedAll, setDownloadedAll] = useState(false)

  const allChapters = useMemo(
    () => [...chapters, ...chapters2, ...chapters3, ...chapters4],
    [chapters, chapters2, chapters3, chapters4]
  )

  const selectedChapter = useMemo(() => {
    if (selectedChapterId === 'all') return null
    return allChapters.find((c) => c.id === selectedChapterId) || null
  }, [selectedChapterId, allChapters])

  const previewChapters = useMemo(() => {
    if (selectedChapterId === 'all') return allChapters
    return selectedChapter ? [selectedChapter] : []
  }, [selectedChapterId, selectedChapter, allChapters])

  const handleDownloadSingle = async () => {
    if (!selectedChapter) return
    setIsGenerating(true)
    setDownloadedSingle(false)
    try {
      await new Promise((r) => setTimeout(r, 100))
      const doc = generateChapterPDF(selectedChapter)
      doc.save(`NetRevision_${selectedChapter.slug}.pdf`)
      setDownloadedSingle(true)
      setTimeout(() => setDownloadedSingle(false), 3000)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadAll = async () => {
    setIsGeneratingAll(true)
    setDownloadedAll(false)
    try {
      await new Promise((r) => setTimeout(r, 100))
      const doc = generateAllChaptersPDF(allChapters)
      doc.save('NetRevision_Tous_Les_Chapitres.pdf')
      setDownloadedAll(true)
      setTimeout(() => setDownloadedAll(false), 3000)
    } finally {
      setIsGeneratingAll(false)
    }
  }

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
            {t('// fiches pdf', '// pdf sheets')}
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
            {t('Fiches de Revision PDF', 'PDF Revision Sheets')}
          </h1>
          <p
            style={{
              fontSize: 15,
              color: 'var(--text-secondary)',
              fontWeight: 300,
            }}
          >
            {t('Generez et telechargez des fiches de revision au format PDF pour reviser hors-ligne. Selectionnez un chapitre ou telechargez le recueil complet.', 'Generate and download revision sheets in PDF format for offline study. Select a chapter or download the complete collection.')}
          </p>
        </div>

        {/* Controls row */}
        <div
          className="pdf-controls"
          style={{
            display: 'flex',
            gap: 12,
            marginBottom: 32,
            flexWrap: 'wrap',
            alignItems: 'stretch',
          }}
        >
          {/* Chapter selector */}
          <div style={{ position: 'relative', flex: '1 1 320px', minWidth: 0 }}>
            <BookOpen
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
            <ChevronDown
              size={16}
              style={{
                position: 'absolute',
                right: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                pointerEvents: 'none',
              }}
            />
            <select
              value={selectedChapterId}
              onChange={(e) => {
                const val = e.target.value
                setSelectedChapterId(val === 'all' ? 'all' : Number(val))
                setDownloadedSingle(false)
              }}
              style={{
                width: '100%',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                padding: '12px 40px 12px 44px',
                outline: 'none',
                boxSizing: 'border-box',
                cursor: 'pointer',
                appearance: 'none',
                WebkitAppearance: 'none',
                borderRadius: 0,
              }}
            >
              <option value="all">{t('Tous les chapitres', 'All chapters')} ({allChapters.length})</option>
              {allChapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.id}. {ch.title}
                </option>
              ))}
            </select>
          </div>

          {/* Download single chapter button */}
          {selectedChapter && (
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              onClick={handleDownloadSingle}
              disabled={isGenerating}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: isGenerating
                  ? 'var(--bg-tertiary, var(--bg-secondary))'
                  : downloadedSingle
                    ? '#059669'
                    : 'var(--accent)',
                border: 'none',
                color: isGenerating ? 'var(--text-secondary)' : '#080b1a',
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                fontWeight: 600,
                padding: '12px 24px',
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                borderRadius: 0,
              }}
            >
              {isGenerating ? (
                <>{t('Generation...', 'Generating...')}</>
              ) : downloadedSingle ? (
                <>
                  <Check size={16} /> {t('Telecharge', 'Downloaded')}
                </>
              ) : (
                <>
                  <FileDown size={16} /> {t('Telecharger ce chapitre', 'Download this chapter')}
                </>
              )}
            </motion.button>
          )}

          {/* Download all button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: 0.05 }}
            onClick={handleDownloadAll}
            disabled={isGeneratingAll}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: isGeneratingAll
                ? 'var(--bg-tertiary, var(--bg-secondary))'
                : downloadedAll
                  ? '#059669'
                  : 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              color: isGeneratingAll
                ? 'var(--text-muted)'
                : downloadedAll
                  ? '#ffffff'
                  : 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              fontWeight: 600,
              padding: '12px 24px',
              cursor: isGeneratingAll ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
              borderRadius: 0,
            }}
          >
            {isGeneratingAll ? (
              <>{t('Generation...', 'Generating...')}</>
            ) : downloadedAll ? (
              <>
                <Check size={16} /> {t('Telecharge', 'Downloaded')}
              </>
            ) : (
              <>
                <Download size={16} /> {t('Tout telecharger', 'Download all')}
              </>
            )}
          </motion.button>
        </div>

        {/* Stats bar */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            color: 'var(--text-muted)',
            marginBottom: 20,
          }}
        >
          {previewChapters.length} {t('chapitre', 'chapter')}{previewChapters.length !== 1 ? 's' : ''} {t('selectionne', 'selected')}{previewChapters.length !== 1 ? 's' : ''}
          {' — '}
          {previewChapters.reduce((acc, ch) => acc + ch.sections.length, 0)} {t('sections au total', 'total sections')}
        </div>

        {/* Preview area */}
        <div
          className="pdf-preview-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
            gap: 2,
          }}
        >
          {previewChapters.map((chapter, index) => (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: (index % 12) * 0.03 }}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                padding: 0,
                overflow: 'hidden',
              }}
            >
              {/* Chapter card header */}
              <div
                style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    background: chapter.color + '18',
                    border: `1px solid ${chapter.color}44`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 13,
                    fontWeight: 700,
                    color: chapter.color,
                    flexShrink: 0,
                  }}
                >
                  {chapter.id}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 15,
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {chapter.title}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--text-muted)',
                      marginTop: 2,
                    }}
                  >
                    {chapter.duration} &middot; {chapter.level} &middot;{' '}
                    {chapter.sections.length} sections
                  </div>
                </div>
              </div>

              {/* Section previews */}
              <div style={{ padding: '12px 20px 16px' }}>
                {chapter.sections.map((section, si) => (
                  <div
                    key={si}
                    style={{
                      marginBottom: si < chapter.sections.length - 1 ? 10 : 0,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 12,
                        fontWeight: 600,
                        color: 'var(--accent)',
                        marginBottom: 3,
                      }}
                    >
                      {section.title}
                    </div>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 12,
                        color: 'var(--text-secondary)',
                        lineHeight: 1.5,
                        margin: 0,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {stripMarkdown(section.content).slice(0, 200)}
                      {section.content.length > 200 ? '...' : ''}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty state */}
        {previewChapters.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: 14,
            }}
          >
            {t('Aucun chapitre selectionne.', 'No chapter selected.')}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .pdf-preview-grid { grid-template-columns: 1fr !important; }
          .pdf-controls { flex-direction: column !important; }
        }
      `}</style>
    </div>
  )
}
