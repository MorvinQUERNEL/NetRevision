import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { StickyNote, Save, Check } from 'lucide-react'
import { useNoteStore } from '../stores/noteStore'
import { useAuthStore } from '../stores/authStore'
import { useTranslation, useChapters } from '../hooks/useTranslation'

export default function Notes() {
  const { notes, loadAll, save } = useNoteStore()
  const updatePoints = useAuthStore((s) => s.updatePoints)
  const { t, lang } = useTranslation()
  const allChapters = useChapters()
  const [activeSlug, setActiveSlug] = useState(allChapters[0]?.slug || '')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    loadAll()
  }, [loadAll])

  useEffect(() => {
    const note = notes.find((n) => n.chapterSlug === activeSlug)
    setContent(note?.content || '')
    setSaved(false)
  }, [activeSlug, notes])

  const handleSave = async () => {
    setSaving(true)
    try {
      const totalPoints = await save(activeSlug, content)
      updatePoints(totalPoints)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {}
    setSaving(false)
  }

  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-secondary)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12 }}>
            // {t('notes personnelles', 'personal notes')}
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 32, fontWeight: 700, letterSpacing: '-1px', marginBottom: 8 }}>
            {t('Mes notes', 'My notes')}
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', fontWeight: 300 }}>
            {t('Prends des notes pour chaque chapitre. +5 pts par nouvelle note', 'Take notes for each chapter. +5 pts per new note')}
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24 }} className="notes-layout">
          {/* Chapter list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 600, overflowY: 'auto' }}>
            {allChapters.map((ch) => {
              const hasNote = notes.some((n) => n.chapterSlug === ch.slug)
              const isActive = activeSlug === ch.slug
              return (
                <button
                  key={ch.slug}
                  onClick={() => setActiveSlug(ch.slug)}
                  style={{
                    padding: '10px 14px', textAlign: 'left',
                    background: isActive ? 'var(--bg-elevated)' : 'var(--bg-secondary)',
                    border: `1px solid ${isActive ? 'var(--accent-secondary)' : 'var(--border)'}`,
                    color: 'var(--text-primary)', transition: 'all 0.15s',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}
                >
                  {hasNote && <StickyNote size={12} color="var(--accent-secondary)" />}
                  <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 400 }}>{ch.title}</span>
                </button>
              )
            })}
          </div>

          {/* Editor */}
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 16px', borderBottom: '1px solid var(--border)',
            }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 600 }}>
                {allChapters.find((c) => c.slug === activeSlug)?.title || ''}
              </span>
              <button onClick={handleSave} disabled={saving} style={{
                padding: '6px 14px', background: saved ? 'var(--success)' : 'var(--accent-secondary)',
                color: 'white', fontSize: 12, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s',
              }}>
                {saved ? <><Check size={14} /> {t('Sauvegardé', 'Saved')}</> : <><Save size={14} /> {saving ? t('Enregistrement...', 'Saving...') : t('Sauvegarder', 'Save')}</>}
              </button>
            </div>
            <textarea
              value={content}
              onChange={(e) => { setContent(e.target.value); setSaved(false) }}
              placeholder={t('Écris tes notes pour ce chapitre...', 'Write your notes for this chapter...')}
              style={{
                flex: 1, minHeight: 400, padding: 20, background: 'transparent',
                border: 'none', color: 'var(--text-primary)', fontSize: 14,
                fontFamily: 'var(--font-body)', lineHeight: 1.8, resize: 'vertical', outline: 'none',
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .notes-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
