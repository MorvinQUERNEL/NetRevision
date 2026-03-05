import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, SkipBack, SkipForward, X, Minimize2, Maximize2, Volume2 } from 'lucide-react'
import { useLangStore } from '../stores/langStore'

interface AudioPlayerProps {
  text: string
  chapterTitle: string
  onSentenceChange?: (index: number) => void
}

const SPEED_OPTIONS = [1, 1.5, 2] as const
const LS_KEY = 'nr_audio_speed'

function stripContent(raw: string): string {
  let cleaned = raw.replace(/```[\s\S]*?```/g, '')
  cleaned = cleaned.replace(/<[^>]+>/g, ' ')
  cleaned = cleaned.replace(/[#*_~`>\-|]/g, ' ')
  cleaned = cleaned.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
  cleaned = cleaned.replace(/\s+/g, ' ')
  return cleaned.trim()
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map(s => s.trim())
    .filter(s => s.length >= 5)
}

function getSavedSpeed(): number {
  try {
    const v = localStorage.getItem(LS_KEY)
    if (v) {
      const n = parseFloat(v)
      if (SPEED_OPTIONS.includes(n as typeof SPEED_OPTIONS[number])) return n
    }
  } catch { /* noop */ }
  return 1
}

export default function AudioPlayer({ text, chapterTitle, onSentenceChange }: AudioPlayerProps) {
  const lang = useLangStore((s) => s.lang)
  const t = (fr: string, en: string) => lang === 'en' ? en : fr
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [speed, setSpeed] = useState(getSavedSpeed)
  const [minimized, setMinimized] = useState(false)
  const [visible, setVisible] = useState(true)

  const synthRef = useRef<SpeechSynthesis | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)
  const indexRef = useRef(currentIndex)

  const sentences = useMemo(() => splitSentences(stripContent(text)), [text])
  const total = sentences.length

  // Keep ref in sync
  useEffect(() => {
    indexRef.current = currentIndex
  }, [currentIndex])

  // Check browser support
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

  // Grab speech synthesis + voice for current language
  useEffect(() => {
    if (!supported) return
    synthRef.current = window.speechSynthesis

    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices()
      const primary = lang === 'en' ? 'en-US' : 'fr-FR'
      const fallback = lang === 'en' ? 'en' : 'fr'
      voiceRef.current =
        voices.find(v => v.lang === primary) ||
        voices.find(v => v.lang.startsWith(fallback)) ||
        null
    }

    pickVoice()
    window.speechSynthesis.addEventListener('voiceschanged', pickVoice)
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', pickVoice)
    }
  }, [supported, lang])

  // Cancel on unmount or text change
  useEffect(() => {
    return () => {
      synthRef.current?.cancel()
    }
  }, [text])

  // Reset when text changes
  useEffect(() => {
    synthRef.current?.cancel()
    setCurrentIndex(0)
    setIsPlaying(false)
  }, [text])

  const speak = useCallback((index: number) => {
    const synth = synthRef.current
    if (!synth || index >= total) {
      setIsPlaying(false)
      return
    }

    synth.cancel()

    const utt = new SpeechSynthesisUtterance(sentences[index])
    utt.lang = lang === 'en' ? 'en-US' : 'fr-FR'
    utt.rate = speed
    if (voiceRef.current) utt.voice = voiceRef.current

    utt.onend = () => {
      const next = indexRef.current + 1
      if (next < total) {
        setCurrentIndex(next)
        onSentenceChange?.(next)
        speak(next)
      } else {
        setIsPlaying(false)
      }
    }

    utteranceRef.current = utt
    synth.speak(utt)
  }, [sentences, total, speed, onSentenceChange])

  const handlePlayPause = useCallback(() => {
    const synth = synthRef.current
    if (!synth) return

    if (isPlaying) {
      synth.cancel()
      setIsPlaying(false)
    } else {
      setIsPlaying(true)
      speak(currentIndex)
    }
  }, [isPlaying, currentIndex, speak])

  const handleSkipBack = useCallback(() => {
    const prev = Math.max(0, currentIndex - 1)
    synthRef.current?.cancel()
    setCurrentIndex(prev)
    onSentenceChange?.(prev)
    if (isPlaying) speak(prev)
  }, [currentIndex, isPlaying, speak, onSentenceChange])

  const handleSkipForward = useCallback(() => {
    const next = Math.min(total - 1, currentIndex + 1)
    synthRef.current?.cancel()
    setCurrentIndex(next)
    onSentenceChange?.(next)
    if (isPlaying) speak(next)
  }, [currentIndex, total, isPlaying, speak, onSentenceChange])

  const handleSpeedChange = useCallback(() => {
    const idx = SPEED_OPTIONS.indexOf(speed as typeof SPEED_OPTIONS[number])
    const next = SPEED_OPTIONS[(idx + 1) % SPEED_OPTIONS.length]
    setSpeed(next)
    try { localStorage.setItem(LS_KEY, String(next)) } catch { /* noop */ }

    if (isPlaying) {
      synthRef.current?.cancel()
      // Will restart with new speed on next tick
      setTimeout(() => speak(indexRef.current), 30)
    }
  }, [speed, isPlaying, speak])

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const idx = Math.round(ratio * (total - 1))
    synthRef.current?.cancel()
    setCurrentIndex(idx)
    onSentenceChange?.(idx)
    if (isPlaying) speak(idx)
  }, [total, isPlaying, speak, onSentenceChange])

  const handleClose = useCallback(() => {
    synthRef.current?.cancel()
    setIsPlaying(false)
    setVisible(false)
  }, [])

  if (!supported || !visible || total === 0) return null

  const progress = total > 1 ? currentIndex / (total - 1) : 0

  const btnBase: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    padding: 6,
    flexShrink: 0,
  }

  // Minimized pill
  if (minimized) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={() => setMinimized(false)}
          style={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '0 14px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            zIndex: 999,
            cursor: 'pointer',
          }}
        >
          <button onClick={(e) => { e.stopPropagation(); handlePlayPause() }} style={btnBase}>
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <Volume2 size={12} style={{ color: 'var(--accent)', flexShrink: 0 }} />
          <span style={{
            fontSize: 12,
            fontFamily: 'var(--font-heading)',
            color: 'var(--text-secondary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: 160,
          }}>
            {chapterTitle}
          </span>
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 64, opacity: 0 }}
        transition={{ duration: 0.25 }}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 64,
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '0 16px',
        }}
      >
        {/* Close */}
        <button onClick={handleClose} style={btnBase} title={t('Fermer', 'Close')}>
          <X size={16} />
        </button>

        {/* Minimize */}
        <button onClick={() => setMinimized(true)} style={btnBase} title={t('Minimiser', 'Minimize')}>
          <Minimize2 size={14} />
        </button>

        {/* Chapter title */}
        <span style={{
          fontSize: 13,
          fontFamily: 'var(--font-heading)',
          fontWeight: 600,
          color: 'var(--text-primary)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: 180,
          flexShrink: 0,
        }}>
          {chapterTitle}
        </span>

        {/* Separator */}
        <div style={{ width: 1, height: 24, background: 'var(--border)', flexShrink: 0 }} />

        {/* Skip back */}
        <button onClick={handleSkipBack} style={btnBase} title={t('Phrase precedente', 'Previous sentence')}>
          <SkipBack size={16} />
        </button>

        {/* Play / Pause */}
        <button
          onClick={handlePlayPause}
          style={{
            ...btnBase,
            width: 36,
            height: 36,
            background: 'var(--accent)',
            color: 'var(--bg-primary)',
          }}
          title={isPlaying ? 'Pause' : t('Lecture', 'Play')}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} style={{ marginLeft: 2 }} />}
        </button>

        {/* Skip forward */}
        <button onClick={handleSkipForward} style={btnBase} title={t('Phrase suivante', 'Next sentence')}>
          <SkipForward size={16} />
        </button>

        {/* Separator */}
        <div style={{ width: 1, height: 24, background: 'var(--border)', flexShrink: 0 }} />

        {/* Progress bar */}
        <div
          onClick={handleProgressClick}
          style={{
            flex: 1,
            height: 6,
            background: 'var(--bg-tertiary)',
            cursor: 'pointer',
            position: 'relative',
            minWidth: 80,
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${progress * 100}%`,
            background: 'var(--accent)',
            transition: 'width 0.2s ease',
          }} />
        </div>

        {/* Speed toggle */}
        <button
          onClick={handleSpeedChange}
          style={{
            ...btnBase,
            padding: '4px 10px',
            border: '1px solid var(--border)',
            background: 'var(--bg-tertiary)',
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            color: 'var(--accent)',
            letterSpacing: '0.5px',
          }}
          title={t('Vitesse de lecture', 'Playback speed')}
        >
          {speed}x
        </button>

        {/* Sentence counter */}
        <span style={{
          fontSize: 11,
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}>
          {currentIndex + 1} / {total} {t('phrases', 'sentences')}
        </span>
      </motion.div>
    </AnimatePresence>
  )
}
