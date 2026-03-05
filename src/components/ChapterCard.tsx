import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, Signal, CheckCircle2 } from 'lucide-react'
import * as Icons from 'lucide-react'
import type { Chapter } from '../data/chapters'
import { useFormationFromUrl } from '../hooks/useTranslation'

interface Props {
  chapter: Chapter
  index: number
  completed: boolean
}

export default function ChapterCard({ chapter, index, completed }: Props) {
  const IconComponent = (Icons as any)[chapter.icon] || Icons.BookOpen
  const formation = useFormationFromUrl()

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      style={{ height: '100%' }}
    >
      <Link to={`/${formation}/cours/${chapter.slug}`} style={{ display: 'block', height: '100%' }}>
        <div style={{
          background: 'var(--bg-secondary)',
          padding: 0,
          overflow: 'hidden',
          border: '1px solid var(--border)',
          transition: 'all 0.25s ease',
          cursor: 'pointer',
          height: '100%',
          position: 'relative',
        }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = chapter.color
            el.style.transform = 'translateY(-3px)'
            el.style.boxShadow = `0 8px 30px ${chapter.color}18, 0 0 0 1px ${chapter.color}20`
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = 'var(--border)'
            el.style.transform = 'translateY(0)'
            el.style.boxShadow = 'none'
          }}
        >
          {/* Left accent strip with animated height */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 3,
            background: chapter.color,
          }} />

          <div style={{ padding: '20px 20px 20px 24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Top row: number + icon + completion */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  fontWeight: 600,
                  color: chapter.color,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}>
                  {String(chapter.id).padStart(2, '0')}
                </span>
                <div style={{
                  width: 1,
                  height: 16,
                  background: 'var(--border)',
                }} />
                <IconComponent size={18} color={chapter.color} strokeWidth={1.5} />
              </div>
              {completed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                >
                  <CheckCircle2 size={16} color="var(--success)" strokeWidth={2} />
                </motion.div>
              )}
            </div>

            {/* Title */}
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 16,
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: 6,
              lineHeight: 1.3,
            }}>
              {chapter.title}
            </h3>

            {/* Subtitle */}
            <p style={{
              fontSize: 13,
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              marginBottom: 16,
              flex: 1,
            }}>
              {chapter.subtitle}
            </p>

            {/* Meta row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              paddingTop: 14,
              borderTop: '1px solid var(--border)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
              }}>
                <Clock size={12} /> {chapter.duration}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
              }}>
                <Signal size={12} /> {chapter.level}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
