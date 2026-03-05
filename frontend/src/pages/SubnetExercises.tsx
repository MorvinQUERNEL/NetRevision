import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Brain, CheckCircle, XCircle, ArrowRight, RotateCcw, Timer, Flame, Trophy, Zap } from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'
import { useAuthStore } from '../stores/authStore'
import { useTranslation } from '../hooks/useTranslation'

// --- Subnet math (reused from SubnetCalculator) ---

function ipToNum(ip: string): number {
  const parts = ip.split('.').map(Number)
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0
}

function numToIp(num: number): string {
  return [num >>> 24, (num >> 16) & 255, (num >> 8) & 255, num & 255].join('.')
}

// --- Types ---

type QuestionType =
  | 'network_address'
  | 'broadcast_address'
  | 'host_range'
  | 'subnet_mask'
  | 'host_count'
  | 'subnet_count'
  | 'cidr_from_mask'

type Difficulty = 'easy' | 'medium' | 'hard'

interface Question {
  type: QuestionType
  ip: string
  cidr: number
  prompt: string
  answer: string
  hint: string
}

// --- Question generator ---

const QUESTION_TYPES: QuestionType[] = [
  'network_address', 'broadcast_address', 'host_range',
  'subnet_mask', 'host_count', 'subnet_count', 'cidr_from_mask',
]

const TYPE_LABELS_FR: Record<QuestionType, string> = {
  network_address: 'Adresse reseau',
  broadcast_address: 'Adresse de broadcast',
  host_range: 'Plage d\'hotes',
  subnet_mask: 'Masque de sous-reseau',
  host_count: 'Nombre d\'hotes',
  subnet_count: 'Nombre de sous-reseaux',
  cidr_from_mask: 'CIDR depuis masque',
}

const TYPE_LABELS_EN: Record<QuestionType, string> = {
  network_address: 'Network address',
  broadcast_address: 'Broadcast address',
  host_range: 'Host range',
  subnet_mask: 'Subnet mask',
  host_count: 'Host count',
  subnet_count: 'Subnet count',
  cidr_from_mask: 'CIDR from mask',
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getCidrForDifficulty(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'easy': return [8, 16, 24][randomInt(0, 2)]
    case 'medium': return randomInt(20, 28)
    case 'hard': return randomInt(1, 30)
  }
}

function generateRandomIp(): string {
  let first = randomInt(1, 223)
  while (first === 127) first = randomInt(1, 223)
  return `${first}.${randomInt(0, 255)}.${randomInt(0, 255)}.${randomInt(0, 255)}`
}

function generateQuestion(difficulty: Difficulty, t: (fr: string, en: string) => string): Question {
  const type = QUESTION_TYPES[randomInt(0, QUESTION_TYPES.length - 1)]
  const cidr = getCidrForDifficulty(difficulty)
  const ip = generateRandomIp()

  const maskNum = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0
  const ipNum = ipToNum(ip)
  const networkNum = (ipNum & maskNum) >>> 0
  const wildcardNum = (~maskNum) >>> 0
  const broadcastNum = (networkNum | wildcardNum) >>> 0
  const totalHosts = Math.pow(2, 32 - cidr)
  const usableHosts = cidr >= 31 ? (cidr === 32 ? 1 : 2) : totalHosts - 2
  const mask = numToIp(maskNum)
  const network = numToIp(networkNum)
  const broadcast = numToIp(broadcastNum)
  const firstHost = cidr >= 31 ? numToIp(networkNum) : numToIp(networkNum + 1)
  const lastHost = cidr >= 31 ? numToIp(broadcastNum) : numToIp(broadcastNum - 1)

  // Determine the class and how many subnets
  let defaultCidr = 8
  const firstOctet = parseInt(ip.split('.')[0])
  if (firstOctet >= 192) defaultCidr = 24
  else if (firstOctet >= 128) defaultCidr = 16
  const subnetBits = cidr - defaultCidr
  const subnetCount = subnetBits > 0 ? Math.pow(2, subnetBits) : 1

  switch (type) {
    case 'network_address':
      return {
        type, ip, cidr,
        prompt: t(`Quelle est l'adresse reseau de ${ip}/${cidr} ?`, `What is the network address of ${ip}/${cidr}?`),
        answer: network,
        hint: t(`Appliquez le masque /${cidr} a l'adresse IP avec un AND logique`, `Apply the /${cidr} mask to the IP address with a logical AND`),
      }
    case 'broadcast_address':
      return {
        type, ip, cidr,
        prompt: t(`Quelle est l'adresse de broadcast de ${ip}/${cidr} ?`, `What is the broadcast address of ${ip}/${cidr}?`),
        answer: broadcast,
        hint: t(`L'adresse de broadcast = adresse reseau OR wildcard mask`, `Broadcast address = network address OR wildcard mask`),
      }
    case 'host_range':
      return {
        type, ip, cidr,
        prompt: t(`Quelle est la plage d'hotes utilisables de ${ip}/${cidr} ? (format: premier - dernier)`, `What is the usable host range of ${ip}/${cidr}? (format: first - last)`),
        answer: `${firstHost} - ${lastHost}`,
        hint: t(`Premier hote = reseau + 1, Dernier hote = broadcast - 1`, `First host = network + 1, Last host = broadcast - 1`),
      }
    case 'subnet_mask':
      return {
        type, ip, cidr,
        prompt: t(`Quel est le masque en notation decimale pour /${cidr} ?`, `What is the subnet mask in dotted decimal for /${cidr}?`),
        answer: mask,
        hint: t(`/${cidr} signifie ${cidr} bits a 1 suivis de ${32 - cidr} bits a 0`, `/${cidr} means ${cidr} bits set to 1 followed by ${32 - cidr} bits set to 0`),
      }
    case 'host_count':
      return {
        type, ip, cidr,
        prompt: t(`Combien d'hotes utilisables dans le reseau ${ip}/${cidr} ?`, `How many usable hosts in the network ${ip}/${cidr}?`),
        answer: String(usableHosts),
        hint: t(`Nombre d'hotes = 2^(32 - CIDR) - 2`, `Number of hosts = 2^(32 - CIDR) - 2`),
      }
    case 'subnet_count':
      return {
        type, ip, cidr,
        prompt: t(`Combien de sous-reseaux /${cidr} peut-on creer dans un reseau de classe ${firstOctet >= 192 ? 'C' : firstOctet >= 128 ? 'B' : 'A'} (/${defaultCidr}) ?`, `How many /${cidr} subnets can be created in a class ${firstOctet >= 192 ? 'C' : firstOctet >= 128 ? 'B' : 'A'} network (/${defaultCidr})?`),
        answer: String(subnetCount),
        hint: t(`Nombre de sous-reseaux = 2^(bits empruntes). Bits empruntes = ${cidr} - ${defaultCidr} = ${subnetBits}`, `Number of subnets = 2^(borrowed bits). Borrowed bits = ${cidr} - ${defaultCidr} = ${subnetBits}`),
      }
    case 'cidr_from_mask': {
      return {
        type, ip, cidr,
        prompt: t(`Quel est le CIDR correspondant au masque ${mask} ? (format: /XX)`, `What is the CIDR notation for subnet mask ${mask}? (format: /XX)`),
        answer: `/${cidr}`,
        hint: t(`Comptez le nombre de bits a 1 dans le masque`, `Count the number of 1-bits in the mask`),
      }
    }
  }
}

function normalizeAnswer(answer: string): string {
  return answer
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/\b0+(\d)/g, '$1') // Remove leading zeros: 010 -> 10
}

function checkAnswer(userAnswer: string, correctAnswer: string, type: QuestionType): boolean {
  const ua = normalizeAnswer(userAnswer)
  const ca = normalizeAnswer(correctAnswer)

  if (type === 'host_range') {
    // Accept multiple formats: "x - y", "x-y", "x to y"
    const uaParts = ua.replace(/\s*[-–]\s*|(\s+to\s+)/g, '|').split('|').map(s => s.trim())
    const caParts = ca.replace(/\s*[-–]\s*/g, '|').split('|').map(s => s.trim())
    return uaParts.length === 2 && caParts.length === 2 &&
      normalizeAnswer(uaParts[0]) === normalizeAnswer(caParts[0]) &&
      normalizeAnswer(uaParts[1]) === normalizeAnswer(caParts[1])
  }

  return ua === ca
}

// --- Component ---

const TOTAL_QUESTIONS = 10

export default function SubnetExercises() {
  const { t, lang } = useTranslation()
  const TYPE_LABELS = lang === 'en' ? TYPE_LABELS_EN : TYPE_LABELS_FR

  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [timerEnabled, setTimerEnabled] = useState(false)
  const [started, setStarted] = useState(false)
  const [question, setQuestion] = useState<Question | null>(null)
  const [questionNum, setQuestionNum] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [finished, setFinished] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const submitQuizScore = useProgressStore((s) => s.submitQuizScore)
  const updatePoints = useAuthStore((s) => s.updatePoints)

  const nextQuestion = useCallback(() => {
    if (questionNum >= TOTAL_QUESTIONS) {
      setFinished(true)
      return
    }
    const q = generateQuestion(difficulty, t)
    setQuestion(q)
    setQuestionNum(prev => prev + 1)
    setUserAnswer('')
    setShowResult(false)
    setShowHint(false)
    setTimeLeft(30)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [difficulty, questionNum])

  const handleSubmitAnswer = useCallback(() => {
    if (!question || showResult || !userAnswer.trim()) return
    const correct = checkAnswer(userAnswer, question.answer, question.type)
    setIsCorrect(correct)
    setShowResult(true)
    if (correct) {
      setScore(prev => prev + 1)
      setStreak(prev => {
        const newStreak = prev + 1
        setBestStreak(best => Math.max(best, newStreak))
        return newStreak
      })
    } else {
      setStreak(0)
    }
  }, [question, showResult, userAnswer])

  // Timer countdown
  useEffect(() => {
    if (!started || !timerEnabled || showResult || finished) return
    if (timeLeft <= 0) {
      handleSubmitAnswer()
      return
    }
    const t = setTimeout(() => setTimeLeft(prev => prev - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, started, timerEnabled, showResult, finished, handleSubmitAnswer])

  const handleStart = () => {
    setStarted(true)
    setQuestionNum(0)
    setScore(0)
    setStreak(0)
    setBestStreak(0)
    setFinished(false)
    setSubmitted(false)
    const q = generateQuestion(difficulty, t)
    setQuestion(q)
    setQuestionNum(1)
    setUserAnswer('')
    setShowResult(false)
    setShowHint(false)
    setTimeLeft(30)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const handleFinishSubmit = async () => {
    if (submitted) return
    setSubmitted(true)
    try {
      const pct = Math.round((score / TOTAL_QUESTIONS) * 100)
      const resp = await submitQuizScore('classes-subnetting', pct)
      if (resp?.totalPoints) updatePoints(resp.totalPoints)
    } catch { /* silent */ }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (showResult) {
        nextQuestion()
      } else {
        handleSubmitAnswer()
      }
    }
  }

  const difficultyColors: Record<Difficulty, string> = {
    easy: '#00e5a0',
    medium: '#f59e0b',
    hard: '#ef4444',
  }

  const difficultyLabels: Record<Difficulty, string> = {
    easy: t('Facile', 'Easy'),
    medium: t('Moyen', 'Medium'),
    hard: t('Difficile', 'Hard'),
  }

  // --- Setup screen ---
  if (!started) {
    return (
      <div style={{ paddingTop: 56 }}>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px 80px' }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12 }}>
              {t('// exercices', '// exercises')}
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 32, fontWeight: 700, marginBottom: 8, letterSpacing: '-1px' }}>
              {t('Exercices de Subnetting', 'Subnetting Exercises')}
            </h1>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 36, fontWeight: 300, maxWidth: 500 }}>
              {t(`${TOTAL_QUESTIONS} questions generees aleatoirement. Calcule les adresses reseau, broadcast, masques et plages d'hotes.`, `${TOTAL_QUESTIONS} randomly generated questions. Calculate network addresses, broadcast, masks and host ranges.`)}
            </p>

            {/* Difficulty selector */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: 24, marginBottom: 2 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>
                {t('Difficulte', 'Difficulty')}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
                  <button key={d} onClick={() => setDifficulty(d)} style={{
                    flex: 1, padding: '14px 16px', background: difficulty === d ? `${difficultyColors[d]}15` : 'var(--bg-primary)',
                    border: `1px solid ${difficulty === d ? difficultyColors[d] : 'var(--border)'}`,
                    color: difficulty === d ? difficultyColors[d] : 'var(--text-secondary)',
                    fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                    textTransform: 'capitalize',
                  }}>
                    {difficultyLabels[d]}
                    <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: 4, fontWeight: 400 }}>
                      {d === 'easy' ? '/8, /16, /24' : d === 'medium' ? t('/20 a /28', '/20 to /28') : t('/1 a /30', '/1 to /30')}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Timer toggle */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '16px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Timer size={16} color="var(--text-muted)" />
                <span style={{ fontSize: 14, fontWeight: 500 }}>{t('Timer (30s par question)', 'Timer (30s per question)')}</span>
              </div>
              <button onClick={() => setTimerEnabled(!timerEnabled)} style={{
                width: 48, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer',
                background: timerEnabled ? 'var(--accent)' : 'var(--bg-tertiary)',
                position: 'relative', transition: 'background 0.2s',
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: 10, background: '#fff',
                  position: 'absolute', top: 3,
                  left: timerEnabled ? 25 : 3, transition: 'left 0.2s',
                }} />
              </button>
            </div>

            {/* Question types preview */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: 24, marginBottom: 24 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>
                {t('Types de questions', 'Question types')}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {Object.values(TYPE_LABELS).map(label => (
                  <span key={label} style={{
                    padding: '4px 10px', background: 'var(--bg-primary)', border: '1px solid var(--border)',
                    fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)',
                  }}>{label}</span>
                ))}
              </div>
            </div>

            <button onClick={handleStart} style={{
              width: '100%', padding: '14px 24px', background: 'var(--accent)', color: 'var(--bg-primary)',
              fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>
              <Brain size={18} /> {t('Commencer les exercices', 'Start exercises')}
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  // --- Finished screen ---
  if (finished) {
    const pct = Math.round((score / TOTAL_QUESTIONS) * 100)
    return (
      <div style={{ paddingTop: 56 }}>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px 80px' }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <Trophy size={48} color={pct >= 70 ? 'var(--accent)' : 'var(--accent-warm)'} style={{ marginBottom: 16 }} />
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 32, fontWeight: 700, marginBottom: 8, letterSpacing: '-1px' }}>
                {pct >= 90 ? t('Excellent !', 'Excellent!') : pct >= 70 ? t('Bien joue !', 'Well done!') : pct >= 50 ? t('Pas mal !', 'Not bad!') : t('Continue a t\'entrainer !', 'Keep practicing!')}
              </h1>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', fontWeight: 300 }}>
                {t('Exercices de subnetting — Difficulte', 'Subnetting exercises — Difficulty')} {difficultyLabels[difficulty]}
              </p>
            </div>

            {/* Score cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, marginBottom: 24 }}>
              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: 20, textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 700, color: 'var(--accent)' }}>{score}/{TOTAL_QUESTIONS}</div>
                <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>score</div>
              </div>
              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: 20, textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 700, color: pct >= 70 ? 'var(--accent)' : 'var(--accent-warm)' }}>{pct}%</div>
                <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('reussite', 'success')}</div>
              </div>
              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: 20, textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 700, color: 'var(--accent-warm)' }}>{bestStreak}</div>
                <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>best streak</div>
              </div>
            </div>

            {/* Submit for points */}
            {!submitted ? (
              <button onClick={handleFinishSubmit} style={{
                width: '100%', padding: '14px 24px', background: 'var(--accent)', color: 'var(--bg-primary)',
                fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer', marginBottom: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              }}>
                <Zap size={18} /> {t(`Enregistrer mon score (${pct}%)`, `Save my score (${pct}%)`)}
              </button>
            ) : (
              <div style={{
                width: '100%', padding: '14px 24px', background: 'rgba(0, 229, 160, 0.1)',
                border: '1px solid var(--accent)', textAlign: 'center', marginBottom: 12,
                fontSize: 14, fontWeight: 600, color: 'var(--accent)',
              }}>
                {t('Score enregistre !', 'Score saved!')}
              </div>
            )}

            <button onClick={handleStart} style={{
              width: '100%', padding: '12px 24px', background: 'transparent', border: '1px solid var(--border)',
              color: 'var(--text-primary)', fontSize: 14, fontWeight: 500, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <RotateCcw size={16} /> {t('Recommencer', 'Restart')}
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  // --- Question screen ---
  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px 80px' }}>
        {/* Header stats */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)' }}>
              Question {questionNum}/{TOTAL_QUESTIONS}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--accent)' }}>
              {score} correct{score > 1 ? 's' : ''}
            </span>
            {streak > 1 && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--accent-warm)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Flame size={14} /> x{streak}
              </span>
            )}
          </div>
          {timerEnabled && !showResult && (
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700,
              color: timeLeft <= 10 ? 'var(--error)' : timeLeft <= 20 ? 'var(--accent-warm)' : 'var(--text-secondary)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <Timer size={16} /> {timeLeft}s
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div style={{ height: 3, background: 'var(--bg-tertiary)', marginBottom: 24 }}>
          <div style={{
            height: '100%', background: 'var(--accent)',
            width: `${(questionNum / TOTAL_QUESTIONS) * 100}%`,
            transition: 'width 0.3s ease',
          }} />
        </div>

        {question && (
          <motion.div key={questionNum} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            {/* Question type badge */}
            <div style={{ marginBottom: 16 }}>
              <span style={{
                padding: '4px 10px', background: `${difficultyColors[difficulty]}15`,
                border: `1px solid ${difficultyColors[difficulty]}40`,
                fontSize: 11, fontFamily: 'var(--font-mono)', color: difficultyColors[difficulty],
                textTransform: 'uppercase', letterSpacing: '1px',
              }}>
                {TYPE_LABELS[question.type]}
              </span>
            </div>

            {/* Question */}
            <div style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              padding: 28, marginBottom: 2,
            }}>
              <p style={{
                fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 600,
                lineHeight: 1.5, color: 'var(--text-primary)',
              }}>
                {question.prompt}
              </p>
            </div>

            {/* Answer input */}
            <div style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              padding: 24, marginBottom: 2,
            }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <input
                  ref={inputRef}
                  value={userAnswer}
                  onChange={e => setUserAnswer(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={showResult}
                  placeholder={t('Ta reponse...', 'Your answer...')}
                  style={{
                    flex: 1, padding: '12px 16px', background: 'var(--bg-primary)',
                    border: `1px solid ${showResult ? (isCorrect ? 'var(--accent)' : 'var(--error)') : 'var(--border)'}`,
                    color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 16,
                    outline: 'none', transition: 'border-color 0.2s',
                  }}
                />
                {!showResult ? (
                  <button onClick={handleSubmitAnswer} disabled={!userAnswer.trim()} style={{
                    padding: '12px 20px', background: userAnswer.trim() ? 'var(--accent)' : 'var(--bg-tertiary)',
                    color: userAnswer.trim() ? 'var(--bg-primary)' : 'var(--text-muted)',
                    fontWeight: 600, fontSize: 14, border: 'none', cursor: userAnswer.trim() ? 'pointer' : 'default',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    {t('Valider', 'Submit')}
                  </button>
                ) : (
                  <button onClick={nextQuestion} style={{
                    padding: '12px 20px', background: 'var(--accent)', color: 'var(--bg-primary)',
                    fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    {t('Suivant', 'Next')} <ArrowRight size={16} />
                  </button>
                )}
              </div>

              {/* Hint button */}
              {!showResult && !showHint && (
                <button onClick={() => setShowHint(true)} style={{
                  marginTop: 12, padding: '6px 12px', background: 'transparent', border: '1px solid var(--border)',
                  color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer',
                }}>
                  {t('Indice', 'Hint')}
                </button>
              )}
              {showHint && !showResult && (
                <div style={{
                  marginTop: 12, padding: '10px 14px', background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  fontSize: 13, color: 'var(--accent-warm)', fontFamily: 'var(--font-mono)',
                }}>
                  {question.hint}
                </div>
              )}
            </div>

            {/* Result feedback */}
            {showResult && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                style={{
                  background: isCorrect ? 'rgba(0, 229, 160, 0.06)' : 'rgba(239, 68, 68, 0.06)',
                  border: `1px solid ${isCorrect ? 'rgba(0, 229, 160, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                  padding: 20,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  {isCorrect ? (
                    <><CheckCircle size={20} color="var(--accent)" /><span style={{ fontWeight: 700, color: 'var(--accent)', fontSize: 15 }}>{t('Correct !', 'Correct!')}</span></>
                  ) : (
                    <><XCircle size={20} color="var(--error)" /><span style={{ fontWeight: 700, color: 'var(--error)', fontSize: 15 }}>{t('Incorrect', 'Incorrect')}</span></>
                  )}
                </div>
                {!isCorrect && (
                  <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                    {t('La bonne reponse etait :', 'The correct answer was:')} <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontWeight: 600 }}>{question.answer}</span>
                  </div>
                )}
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, fontFamily: 'var(--font-mono)' }}>
                  {t('Appuie sur Entree pour continuer', 'Press Enter to continue')}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
