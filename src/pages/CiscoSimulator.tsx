import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Terminal, ArrowLeft, RotateCcw, BookOpen, Monitor } from 'lucide-react'
import TerminalEmulator from '../components/TerminalEmulator'
import LabObjectives from '../components/LabObjectives'
import { LabScenario } from '../data/cliLabs'
import { DeviceState, createDefaultState } from '../data/ciscoCommands'
import { useProgressStore } from '../stores/progressStore'
import { useAuthStore } from '../stores/authStore'
import { useLangStore } from '../stores/langStore'
import { useCliLabs, useChapters, useFormationFromUrl } from '../hooks/useTranslation'
import { getFormation as getFormationConfig, isValidFormation } from '../stores/formationStore'

const diffColors: Record<string, string> = {
  debutant: '#00e5a0',
  intermediaire: '#f59e0b',
  avance: '#ef4444',
  expert: '#e11d48',
}

export default function CiscoSimulator() {
  const lang = useLangStore((s) => s.lang)
  const t = (fr: string, en: string) => lang === 'en' ? en : fr
  const formation = useFormationFromUrl()
  const formationConfig = isValidFormation(formation) ? getFormationConfig(formation) : null
  const isDevOps = formationConfig?.cliSimulatorType === 'terminal'
  const cliLabs = useCliLabs()
  const allChapters = useChapters()

  const diffLabels: Record<string, string> = {
    debutant: t('Debutant', 'Beginner'),
    intermediaire: t('Intermediaire', 'Intermediate'),
    avance: t('Avance', 'Advanced'),
    expert: t('Expert', 'Expert'),
  }
  const [activeLab, setActiveLab] = useState<LabScenario | null>(null)
  const [deviceState, setDeviceState] = useState<DeviceState>(createDefaultState())
  const [completedObjectives, setCompletedObjectives] = useState<Set<string>>(new Set())
  const [labCompleted, setLabCompleted] = useState(false)
  const [filter, setFilter] = useState<string>('all')
  const [pointsAwarded, setPointsAwarded] = useState(false)
  const typedCommandsRef = useRef<Set<string>>(new Set())

  const submitQuizScore = useProgressStore((s) => s.submitQuizScore)
  const updatePoints = useAuthStore((s) => s.updatePoints)

  // DevOps: handle command typed in terminal
  const handleDevOpsCommand = useCallback((command: string) => {
    typedCommandsRef.current.add(command)
    if (!activeLab || labCompleted) return
    const newCompleted = new Set<string>()
    for (const obj of activeLab.objectives as any[]) {
      if (obj.command && typedCommandsRef.current.has(obj.command)) {
        newCompleted.add(obj.id)
      }
    }
    setCompletedObjectives(newCompleted)
    if (newCompleted.size === activeLab.objectives.length && !labCompleted) {
      setLabCompleted(true)
      if (!pointsAwarded) {
        setPointsAwarded(true)
        submitQuizScore(activeLab.chapterSlug, 100)
          .then(resp => { if (resp?.totalPoints) updatePoints(resp.totalPoints) })
          .catch(() => {})
      }
    }
  }, [activeLab, labCompleted, pointsAwarded, submitQuizScore, updatePoints])

  // Cisco: check objectives when device state changes
  useEffect(() => {
    if (isDevOps || !activeLab || labCompleted) return
    const newCompleted = new Set<string>()
    for (const obj of activeLab.objectives) {
      if (typeof obj.validate === 'function' && obj.validate(deviceState)) {
        newCompleted.add(obj.id)
      }
    }
    setCompletedObjectives(newCompleted)

    // Check if all objectives are met
    if (newCompleted.size === activeLab.objectives.length && !labCompleted) {
      setLabCompleted(true)
      // Award points
      if (!pointsAwarded) {
        setPointsAwarded(true)
        submitQuizScore(activeLab.chapterSlug, 100)
          .then(resp => {
            if (resp?.totalPoints) updatePoints(resp.totalPoints)
          })
          .catch(() => {})
      }
    }
  }, [deviceState, activeLab, labCompleted, pointsAwarded, submitQuizScore, updatePoints, isDevOps])

  const handleStartLab = useCallback((lab: LabScenario) => {
    const state = createDefaultState(isDevOps ? undefined : (lab as any).initialState)
    setActiveLab(lab)
    setDeviceState(state)
    setCompletedObjectives(new Set())
    setLabCompleted(false)
    setPointsAwarded(false)
    typedCommandsRef.current = new Set()
  }, [isDevOps])

  const handleResetLab = useCallback(() => {
    if (!activeLab) return
    const state = createDefaultState(isDevOps ? undefined : (activeLab as any).initialState)
    setDeviceState(state)
    setCompletedObjectives(new Set())
    setLabCompleted(false)
    setPointsAwarded(false)
    typedCommandsRef.current = new Set()
  }, [activeLab, isDevOps])

  const handleBackToList = useCallback(() => {
    setActiveLab(null)
    setLabCompleted(false)
    setPointsAwarded(false)
  }, [])

  // Get unique chapter slugs for filter
  const chapterSlugs = [...new Set(cliLabs.map(l => l.chapterSlug))]

  // --- Lab selector view ---
  if (!activeLab) {
    const filtered = filter === 'all' ? cliLabs : cliLabs.filter(l => l.chapterSlug === filter)

    return (
      <div style={{ paddingTop: 56 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px 80px' }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12 }}>
              {isDevOps ? t('// simulateur cli devops', '// devops cli simulator') : t('// simulateur cisco ios', '// cisco ios simulator')}
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 32, fontWeight: 700, marginBottom: 8, letterSpacing: '-1px' }}>
              {isDevOps ? t('Simulateur CLI DevOps', 'DevOps CLI Simulator') : t('Simulateur CLI Cisco', 'Cisco CLI Simulator')}
            </h1>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 32, fontWeight: 300, maxWidth: 520 }}>
              {isDevOps
                ? t('Pratique les commandes Linux, Docker et Kubernetes dans un terminal interactif.', 'Practice Linux, Docker and Kubernetes commands in an interactive terminal.')
                : t('Pratique les commandes IOS dans un terminal interactif. Choisis un lab et complete les objectifs.', 'Practice IOS commands in an interactive terminal. Choose a lab and complete the objectives.')}
            </p>

            {/* Mobile warning */}
            <div style={{ display: 'none', marginBottom: 20 }} className="mobile-warning">
              <div style={{
                padding: '12px 16px', background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                fontSize: 13, color: 'var(--accent-warm)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <Monitor size={16} /> {t('Pour une meilleure experience, utilise un ordinateur.', 'For a better experience, use a computer.')}
              </div>
            </div>

            {/* Filter */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
              <button
                onClick={() => setFilter('all')}
                style={{
                  padding: '6px 14px', fontSize: 12, fontFamily: 'var(--font-mono)',
                  background: filter === 'all' ? 'var(--accent)' : 'var(--bg-secondary)',
                  color: filter === 'all' ? 'var(--bg-primary)' : 'var(--text-secondary)',
                  border: `1px solid ${filter === 'all' ? 'var(--accent)' : 'var(--border)'}`,
                  cursor: 'pointer',
                }}
              >
                {t('Tous', 'All')} ({cliLabs.length})
              </button>
              {chapterSlugs.map(slug => {
                const ch = allChapters.find(c => c.slug === slug)
                const count = cliLabs.filter(l => l.chapterSlug === slug).length
                return (
                  <button
                    key={slug}
                    onClick={() => setFilter(slug)}
                    style={{
                      padding: '6px 14px', fontSize: 12, fontFamily: 'var(--font-mono)',
                      background: filter === slug ? 'var(--accent)' : 'var(--bg-secondary)',
                      color: filter === slug ? 'var(--bg-primary)' : 'var(--text-secondary)',
                      border: `1px solid ${filter === slug ? 'var(--accent)' : 'var(--border)'}`,
                      cursor: 'pointer',
                    }}
                  >
                    {ch?.title || slug} ({count})
                  </button>
                )
              })}
            </div>

            {/* Labs grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }}>
              {filtered.map(lab => {
                const ch = allChapters.find(c => c.slug === lab.chapterSlug)
                return (
                  <motion.div
                    key={lab.id}
                    whileHover={{ borderColor: 'var(--accent)' }}
                    onClick={() => handleStartLab(lab)}
                    style={{
                      background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                      padding: 20, cursor: 'pointer', transition: 'border-color 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <Terminal size={20} color="var(--accent)" />
                      <span style={{
                        padding: '2px 8px', fontSize: 10, fontFamily: 'var(--font-mono)',
                        textTransform: 'uppercase', letterSpacing: '1px',
                        color: diffColors[lab.difficulty],
                        background: `${diffColors[lab.difficulty]}15`,
                        border: `1px solid ${diffColors[lab.difficulty]}30`,
                      }}>
                        {diffLabels[lab.difficulty]}
                      </span>
                    </div>
                    <h3 style={{
                      fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 600,
                      marginBottom: 6, lineHeight: 1.3,
                    }}>
                      {lab.title}
                    </h3>
                    <p style={{
                      fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 12,
                    }}>
                      {lab.description}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                        {lab.objectives.length} {t('objectif', 'objective')}{lab.objectives.length > 1 ? 's' : ''}
                      </span>
                      <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>
                        +{lab.points} pts
                      </span>
                    </div>
                    {ch && (
                      <div style={{
                        marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', gap: 6,
                      }}>
                        <BookOpen size={12} color="var(--text-muted)" />
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{ch.title}</span>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .mobile-warning { display: block !important; }
          }
        `}</style>
      </div>
    )
  }

  // --- Active lab view ---
  return (
    <div style={{ paddingTop: 56, height: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 16px', borderBottom: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={handleBackToList} style={{
            display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px',
            background: 'transparent', border: '1px solid var(--border)',
            color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer',
          }}>
            <ArrowLeft size={14} /> {t('Retour', 'Back')}
          </button>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 600 }}>
            {activeLab.title}
          </span>
          <span style={{
            padding: '2px 8px', fontSize: 10, fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase', letterSpacing: '1px',
            color: diffColors[activeLab.difficulty],
            background: `${diffColors[activeLab.difficulty]}15`,
          }}>
            {diffLabels[activeLab.difficulty]}
          </span>
        </div>
        <button onClick={handleResetLab} style={{
          display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px',
          background: 'transparent', border: '1px solid var(--border)',
          color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer',
        }}>
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {/* Main layout: objectives + terminal */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '280px 1fr', overflow: 'hidden' }} className="sim-layout">
        {/* Left: objectives */}
        <div style={{ overflow: 'auto', borderRight: '1px solid var(--border)' }}>
          <LabObjectives
            lab={activeLab}
            deviceState={deviceState}
            completedObjectives={completedObjectives}
          />
        </div>

        {/* Right: terminal */}
        <div style={{ overflow: 'hidden' }}>
          <TerminalEmulator
            deviceState={deviceState}
            onStateChange={setDeviceState}
            mode={isDevOps ? 'devops' : 'cisco'}
            onCommand={isDevOps ? handleDevOpsCommand : undefined}
            welcomeMessage={isDevOps
              ? t(`Terminal DevOps — Lab: ${activeLab.title}\nTapez les commandes demandees pour completer les objectifs.`, `DevOps Terminal — Lab: ${activeLab.title}\nType the requested commands to complete the objectives.`)
              : t(`Cisco IOS Software — Lab: ${activeLab.title}\nTapez ? pour afficher l'aide.`, `Cisco IOS Software — Lab: ${activeLab.title}\nType ? to display help.`)}
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .sim-layout {
            grid-template-columns: 1fr !important;
            grid-template-rows: 200px 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
