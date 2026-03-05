import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'
import { useAuthStore } from '../stores/authStore'
import Quiz from '../components/Quiz'
import BetModal, { saveBetResult } from '../components/BetModal'
import { useTranslation, useChapters, useQuizzes, useFormationFromUrl } from '../hooks/useTranslation'

export default function QuizPage() {
  const { t } = useTranslation()
  const formation = useFormationFromUrl()
  const allChapters = useChapters()
  const allQuizzes = useQuizzes()
  const { slug } = useParams()
  const chapter = allChapters.find(c => c.slug === slug)
  const submitQuizScore = useProgressStore((s) => s.submitQuizScore)
  const updatePoints = useAuthStore((s) => s.updatePoints)
  const user = useAuthStore((s) => s.user)
  const getBySlug = useProgressStore((s) => s.getBySlug)
  const progress = slug ? getBySlug(slug) : undefined
  const quizAlreadyPassed = progress?.quizScore != null && progress.quizScore >= 70
  const [showBetModal, setShowBetModal] = useState(true)
  const [betAmount, setBetAmount] = useState(0)
  const [betSettled, setBetSettled] = useState(false)

  if (!chapter) return (
    <div style={{ paddingTop: 120, textAlign: 'center' }}>
      <p>{t('Quiz introuvable', 'Quiz not found')}</p>
      <Link to="/">{t('Retour', 'Back')}</Link>
    </div>
  )

  const questions = allQuizzes[chapter.id] || []
  const chapterIndex = allChapters.findIndex(c => c.slug === slug)
  const nextChapter = chapterIndex < allChapters.length - 1 ? allChapters[chapterIndex + 1] : null

  const handleBet = (amount: number) => {
    setBetAmount(amount)
    setShowBetModal(false)
  }

  const handleSkipBet = () => {
    setBetAmount(0)
    setShowBetModal(false)
  }

  const handleComplete = async (score: number) => {
    try {
      const { totalPoints } = await submitQuizScore(chapter.slug, score)
      // Settle bet if one was placed
      if (betAmount > 0 && !betSettled) {
        const won = score >= 70
        const pointsChange = won ? betAmount : -betAmount
        // Update points with bet result (add winnings or deduct loss)
        updatePoints(totalPoints + pointsChange)
        saveBetResult({ amount: betAmount, won, date: new Date().toISOString() })
        setBetSettled(true)
      } else {
        updatePoints(totalPoints)
      }
    } catch {}
  }

  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{
        background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '20px 24px',
      }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <Link to={`/${formation}/cours/${chapter.slug}`} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12,
            fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 14,
          }}>
            <ArrowLeft size={12} /> {t('retour au cours', 'back to course')}
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: `${chapter.color}15`, border: `1px solid ${chapter.color}30`,
            }}>
              <BookOpen size={20} color={chapter.color} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 600, color: chapter.color, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Quiz {String(chapter.id).padStart(2, '0')}
              </div>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700 }}>{chapter.title}</h1>
            </div>
          </div>
        </div>
      </div>

      <BetModal
        isOpen={showBetModal && questions.length > 0 && !quizAlreadyPassed}
        onClose={() => setShowBetModal(false)}
        onBet={handleBet}
        onSkip={handleSkipBet}
        userPoints={user?.totalPoints ?? 0}
        chapterTitle={chapter.title}
      />

      {betAmount > 0 && !showBetModal && (
        <div style={{
          maxWidth: 700, margin: '0 auto', padding: '8px 24px 0',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600,
            padding: '4px 12px', background: 'var(--accent-glow)',
            border: '1px solid var(--accent)', color: 'var(--accent)',
          }}>
            {t(`Pari actif : ${betAmount} pts (x2 si \u2265 70%)`, `Active bet: ${betAmount} pts (x2 if \u2265 70%)`)}
          </span>
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px 80px' }}
      >
        {questions.length > 0 ? (
          <Quiz questions={questions} chapterId={chapter.id} onComplete={handleComplete} chapterSlug={chapter.slug} nextChapterSlug={nextChapter?.slug ?? null} />
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
            {t('Aucune question disponible pour ce chapitre.', 'No questions available for this chapter.')}
          </p>
        )}
      </motion.div>
    </div>
  )
}
