import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Layers,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Monitor,
  Server,
  ArrowRight,
  Zap,
  Info,
  ChevronDown,
} from 'lucide-react'
import {
  type PacketScenario,
  type OsiLayerStep,
} from '../data/packetScenarios'
import { useLangStore } from '../stores/langStore'
import { usePacketScenarios } from '../hooks/useTranslation'

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const OSI_LAYERS_FR = [
  { num: 7, name: 'Application', color: '#6366f1' },
  { num: 6, name: 'Presentation', color: '#8b5cf6' },
  { num: 5, name: 'Session', color: '#a855f7' },
  { num: 4, name: 'Transport', color: '#00e5a0' },
  { num: 3, name: 'Reseau', color: '#f59e0b' },
  { num: 2, name: 'Liaison', color: '#e11d48' },
  { num: 1, name: 'Physique', color: '#94a3b8' },
]

const OSI_LAYERS_EN = [
  { num: 7, name: 'Application', color: '#6366f1' },
  { num: 6, name: 'Presentation', color: '#8b5cf6' },
  { num: 5, name: 'Session', color: '#a855f7' },
  { num: 4, name: 'Transport', color: '#00e5a0' },
  { num: 3, name: 'Network', color: '#f59e0b' },
  { num: 2, name: 'Data Link', color: '#e11d48' },
  { num: 1, name: 'Physical', color: '#94a3b8' },
]

// Use FR for color lookups (colors are same in both languages)
const OSI_LAYERS = OSI_LAYERS_FR

type Phase = 'encapsulation' | 'transmission' | 'decapsulation'

/* ------------------------------------------------------------------ */
/*  Helper: build the set of active wrapper layers for the packet vis  */
/* ------------------------------------------------------------------ */

function getVisibleLayers(
  scenario: PacketScenario,
  phase: Phase,
  stepIndex: number
): { layer: number; layerName: string; pduName: string; color: string }[] {
  if (phase === 'transmission') {
    return scenario.encapsulationSteps.map((s) => ({
      layer: s.layer,
      layerName: s.layerName,
      pduName: s.pduName,
      color: OSI_LAYERS.find((l) => l.num === s.layer)?.color ?? '#666',
    }))
  }

  const steps =
    phase === 'encapsulation'
      ? scenario.encapsulationSteps
      : scenario.decapsulationSteps

  if (phase === 'encapsulation') {
    const included = steps.slice(0, stepIndex + 1)
    return included.map((s) => ({
      layer: s.layer,
      layerName: s.layerName,
      pduName: s.pduName,
      color: OSI_LAYERS.find((l) => l.num === s.layer)?.color ?? '#666',
    }))
  }

  /* decapsulation: we start with all layers, removing from outside in */
  const allLayers = scenario.encapsulationSteps.map((s) => ({
    layer: s.layer,
    layerName: s.layerName,
    pduName: s.pduName,
    color: OSI_LAYERS.find((l) => l.num === s.layer)?.color ?? '#666',
  }))
  const removed = steps.slice(0, stepIndex)
  const removedLayerNums = new Set(removed.map((s) => s.layer))
  return allLayers.filter((l) => !removedLayerNums.has(l.layer))
}

/* ------------------------------------------------------------------ */
/*  Scenario Selector Card                                             */
/* ------------------------------------------------------------------ */

function ScenarioCard({
  scenario,
  isSelected,
  onSelect,
}: {
  scenario: PacketScenario
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        width: '100%',
        textAlign: 'left',
        background: isSelected ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
        border: '1px solid',
        borderColor: isSelected ? 'var(--accent)' : 'var(--border)',
        padding: '16px 20px',
        cursor: 'pointer',
        transition: 'border-color 0.2s, background 0.2s',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {isSelected && (
        <motion.div
          layoutId="scenario-glow"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--accent)',
            opacity: 0.04,
            pointerEvents: 'none',
          }}
        />
      )}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 15,
            fontWeight: 600,
            color: isSelected ? 'var(--accent)' : 'var(--text-primary)',
          }}
        >
          {scenario.title}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--accent)',
            background: 'rgba(0,229,160,0.1)',
            border: '1px solid rgba(0,229,160,0.2)',
            padding: '2px 8px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          {scenario.protocol}
        </span>
      </div>
      <p
        style={{
          fontSize: 12,
          color: 'var(--text-muted)',
          lineHeight: 1.5,
          margin: 0,
        }}
      >
        {scenario.description}
      </p>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginTop: 10,
          fontSize: 11,
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        <Monitor size={12} />
        <span>{scenario.sourceDevice}</span>
        <ArrowRight size={10} style={{ color: 'var(--accent)' }} />
        <Server size={12} />
        <span>{scenario.destinationDevice}</span>
      </div>
    </motion.button>
  )
}

/* ------------------------------------------------------------------ */
/*  OSI Stack (left sidebar)                                           */
/* ------------------------------------------------------------------ */

function OsiStack({
  activeLayer,
  phase,
  osiLayers,
  t,
}: {
  activeLayer: number | null
  phase: Phase
  osiLayers: typeof OSI_LAYERS_FR
  t: (fr: string, en: string) => string
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          marginBottom: 8,
          textAlign: 'center',
        }}
      >
        {t('Modele OSI', 'OSI Model')}
      </div>
      {osiLayers.map((layer) => {
        const isActive = activeLayer === layer.num
        return (
          <motion.div
            key={layer.num}
            animate={{
              scale: isActive ? 1.05 : 1,
              borderColor: isActive ? layer.color : 'var(--border)',
              boxShadow: isActive
                ? `0 0 20px ${layer.color}40, inset 0 0 10px ${layer.color}15`
                : '0 0 0 transparent',
            }}
            transition={{ duration: 0.3 }}
            style={{
              background: isActive
                ? `${layer.color}15`
                : 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              padding: '8px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {isActive && (
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(90deg, transparent, ${layer.color}20, transparent)`,
                  pointerEvents: 'none',
                }}
              />
            )}
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                fontWeight: 700,
                color: isActive ? layer.color : 'var(--text-muted)',
                minWidth: 14,
                textAlign: 'center',
              }}
            >
              {layer.num}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                whiteSpace: 'nowrap',
              }}
            >
              {layer.name}
            </span>
            {isActive && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{
                  width: 6,
                  height: 6,
                  background: layer.color,
                  marginLeft: 'auto',
                  flexShrink: 0,
                }}
              />
            )}
          </motion.div>
        )
      })}
      <div
        style={{
          marginTop: 8,
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color:
            phase === 'encapsulation'
              ? '#6366f1'
              : phase === 'decapsulation'
                ? '#f59e0b'
                : 'var(--accent)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}
      >
        {phase === 'encapsulation' && '7 -> 1'}
        {phase === 'transmission' && t('Transit...', 'Transit...')}
        {phase === 'decapsulation' && '1 -> 7'}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Packet Visual (center)                                             */
/* ------------------------------------------------------------------ */

function PacketVisual({
  layers,
  phase,
  transmissionProgress,
  currentStep,
  t,
}: {
  layers: { layer: number; layerName: string; pduName: string; color: string }[]
  phase: Phase
  transmissionProgress: number
  currentStep: OsiLayerStep | null
  t: (fr: string, en: string) => string
}) {
  /* Sort layers: outermost (lowest layer number, e.g. Physical=1) outside,
     innermost (highest, e.g. Application=7) inside. We'll render from outside in. */
  const sorted = [...layers].sort((a, b) => a.layer - b.layer)

  const packetContent = (
    <div style={{ position: 'relative' }}>
      {sorted.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            padding: '20px 32px',
            background: 'var(--bg-tertiary)',
            border: '2px dashed var(--border)',
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            color: 'var(--text-secondary)',
            textAlign: 'center',
            minWidth: 120,
          }}
        >
          DATA
        </motion.div>
      ) : (
        sorted.reduce<React.ReactNode>(
          (inner, layerInfo, idx) => {
            const isNewest =
              phase === 'encapsulation' &&
              currentStep?.layer === layerInfo.layer
            const isRemoving =
              phase === 'decapsulation' &&
              currentStep?.layer === layerInfo.layer
            return (
              <motion.div
                key={layerInfo.layer}
                initial={
                  isNewest
                    ? { opacity: 0, scale: 0.8, x: -30 }
                    : isRemoving
                      ? { opacity: 1, scale: 1, x: 0 }
                      : false
                }
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 30 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                layout
                style={{
                  border: `2px solid ${layerInfo.color}`,
                  background: `${layerInfo.color}08`,
                  padding: idx === 0 ? '14px 16px' : '10px 14px',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 2,
                    left: 6,
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    color: layerInfo.color,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    opacity: 0.9,
                  }}
                >
                  {layerInfo.pduName}
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: 2,
                    right: 6,
                    fontFamily: 'var(--font-mono)',
                    fontSize: 8,
                    color: layerInfo.color,
                    opacity: 0.6,
                  }}
                >
                  L{layerInfo.layer}
                </div>
                <div style={{ marginTop: idx === sorted.length - 1 ? 0 : 12 }}>
                  {inner}
                </div>
              </motion.div>
            )
          },
          <motion.div
            layout
            style={{
              padding: '12px 24px',
              background: 'var(--bg-tertiary)',
              border: '2px solid var(--border)',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: 'var(--text-primary)',
              textAlign: 'center',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            {t('DONNEES APPLICATIVES', 'APPLICATION DATA')}
          </motion.div>
        )
      )}
    </div>
  )

  if (phase === 'transmission') {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          width: '100%',
        }}
      >
        {/* Devices & transmission bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            gap: 16,
            padding: '0 20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Monitor size={28} style={{ color: 'var(--accent)' }} />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                color: 'var(--text-muted)',
              }}
            >
              Source
            </span>
          </div>
          <div
            style={{
              flex: 1,
              height: 4,
              background: 'var(--bg-tertiary)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <motion.div
              animate={{ width: `${transmissionProgress}%` }}
              transition={{ duration: 0.3 }}
              style={{
                height: '100%',
                background: 'var(--accent)',
                boxShadow: '0 0 12px var(--accent)',
              }}
            />
            <motion.div
              animate={{ left: `${transmissionProgress}%` }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'absolute',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <Zap
                size={16}
                style={{
                  color: 'var(--accent)',
                  filter: 'drop-shadow(0 0 6px var(--accent))',
                }}
              />
            </motion.div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Server size={28} style={{ color: '#f59e0b' }} />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                color: 'var(--text-muted)',
              }}
            >
              Destination
            </span>
          </div>
        </div>
        {/* Packet shrunk during transit */}
        <motion.div
          animate={{ scale: [1, 0.95, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ transform: 'scale(0.75)' }}
        >
          {packetContent}
        </motion.div>
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
        width: '100%',
      }}
    >
      {/* Source / Destination labels */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--text-secondary)',
        }}
      >
        {phase === 'encapsulation' ? (
          <>
            <Monitor size={16} style={{ color: 'var(--accent)' }} />
            <span>{t('Source : encapsulation en cours', 'Source: encapsulation in progress')}</span>
          </>
        ) : (
          <>
            <Server size={16} style={{ color: '#f59e0b' }} />
            <span>{t('Destination : decapsulation en cours', 'Destination: decapsulation in progress')}</span>
          </>
        )}
      </div>
      <AnimatePresence mode="wait">{packetContent}</AnimatePresence>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Details Panel (right sidebar)                                      */
/* ------------------------------------------------------------------ */

function DetailsPanel({ step, t }: { step: OsiLayerStep | null; t: (fr: string, en: string) => string }) {
  if (!step) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: 12,
          padding: 20,
        }}
      >
        <Info size={32} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
        <p
          style={{
            fontSize: 13,
            color: 'var(--text-muted)',
            textAlign: 'center',
            lineHeight: 1.6,
          }}
        >
          {t('Selectionnez un scenario et naviguez entre les etapes pour voir les details de chaque couche.', 'Select a scenario and navigate between steps to see the details of each layer.')}
        </p>
      </div>
    )
  }

  const layerColor =
    OSI_LAYERS.find((l) => l.num === step.layer)?.color ?? '#666'

  return (
    <motion.div
      key={`${step.layer}-${step.headerName}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 4 }}
    >
      {/* Layer badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 32,
            height: 32,
            background: `${layerColor}20`,
            border: `2px solid ${layerColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: 14,
            fontWeight: 700,
            color: layerColor,
          }}
        >
          {step.layer}
        </div>
        <div>
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 15,
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}
          >
            {step.layerName}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: layerColor,
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            PDU: {step.pduName}
          </div>
        </div>
      </div>

      {/* Header name */}
      <div
        style={{
          background: `${layerColor}10`,
          border: `1px solid ${layerColor}30`,
          padding: '8px 12px',
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: layerColor,
          fontWeight: 600,
        }}
      >
        {step.headerName}
      </div>

      {/* Header fields table */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            marginBottom: 6,
          }}
        >
          {t("Champs d'en-tete", 'Header fields')}
        </div>
        {step.headerFields.map((field, idx) => (
          <motion.div
            key={field.name}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              padding: '6px 8px',
              background: idx % 2 === 0 ? 'var(--bg-secondary)' : 'transparent',
              borderLeft: `2px solid ${field.color}`,
              gap: 8,
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: 'var(--text-secondary)',
                fontWeight: 500,
                flexShrink: 0,
              }}
            >
              {field.name}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--text-primary)',
                textAlign: 'right',
                wordBreak: 'break-all',
              }}
            >
              {field.value}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Explanation */}
      <div
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          padding: 12,
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--accent)',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            marginBottom: 8,
          }}
        >
          {t('Explication', 'Explanation')}
        </div>
        <p
          style={{
            fontSize: 12,
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          {step.explanation}
        </p>
      </div>
    </motion.div>
  )
}

/* ================================================================== */
/*  MAIN PAGE COMPONENT                                                */
/* ================================================================== */

export default function PacketVisualizer() {
  const lang = useLangStore((s) => s.lang)
  const t = (fr: string, en: string) => lang === 'en' ? en : fr
  const packetScenarios = usePacketScenarios()
  const OSI_LAYERS_CURRENT = lang === 'en' ? OSI_LAYERS_EN : OSI_LAYERS_FR
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null)
  const [phase, setPhase] = useState<Phase>('encapsulation')
  const [stepIndex, setStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playSpeed, setPlaySpeed] = useState(2000)
  const [transmissionProgress, setTransmissionProgress] = useState(0)
  const [selectorOpen, setSelectorOpen] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const transmissionRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const scenario = packetScenarios.find((s) => s.id === selectedScenarioId) ?? null
  const encSteps = scenario?.encapsulationSteps ?? []
  const decSteps = scenario?.decapsulationSteps ?? []
  const totalSteps = encSteps.length + 1 + decSteps.length // +1 for transmission

  /* Current step data */
  let currentStep: OsiLayerStep | null = null
  let globalStep = 0
  if (scenario) {
    if (phase === 'encapsulation') {
      currentStep = encSteps[stepIndex] ?? null
      globalStep = stepIndex + 1
    } else if (phase === 'transmission') {
      currentStep = null
      globalStep = encSteps.length + 1
    } else {
      currentStep = decSteps[stepIndex] ?? null
      globalStep = encSteps.length + 1 + stepIndex + 1
    }
  }

  /* Visible layers for packet viz */
  const visibleLayers = scenario
    ? getVisibleLayers(scenario, phase, stepIndex)
    : []

  /* Active layer number for OSI stack highlight */
  const activeLayerNum = currentStep?.layer ?? null

  /* ---- Navigation ---- */

  const goNext = useCallback(() => {
    if (!scenario) return

    if (phase === 'encapsulation') {
      if (stepIndex < encSteps.length - 1) {
        setStepIndex((s) => s + 1)
      } else {
        setPhase('transmission')
        setStepIndex(0)
        setTransmissionProgress(0)
      }
    } else if (phase === 'transmission') {
      setPhase('decapsulation')
      setStepIndex(0)
      setTransmissionProgress(100)
    } else {
      if (stepIndex < decSteps.length - 1) {
        setStepIndex((s) => s + 1)
      } else {
        setIsPlaying(false)
      }
    }
  }, [phase, stepIndex, encSteps.length, decSteps.length, scenario])

  const goPrev = useCallback(() => {
    if (!scenario) return

    if (phase === 'decapsulation') {
      if (stepIndex > 0) {
        setStepIndex((s) => s - 1)
      } else {
        setPhase('transmission')
        setTransmissionProgress(100)
      }
    } else if (phase === 'transmission') {
      setPhase('encapsulation')
      setStepIndex(encSteps.length - 1)
      setTransmissionProgress(0)
    } else {
      if (stepIndex > 0) {
        setStepIndex((s) => s - 1)
      }
    }
  }, [phase, stepIndex, encSteps.length, scenario])

  const reset = useCallback(() => {
    setPhase('encapsulation')
    setStepIndex(0)
    setIsPlaying(false)
    setTransmissionProgress(0)
  }, [])

  /* ---- Auto-play ---- */

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (transmissionRef.current) {
      clearInterval(transmissionRef.current)
      transmissionRef.current = null
    }

    if (!isPlaying || !scenario) return

    if (phase === 'transmission') {
      let progress = transmissionProgress
      transmissionRef.current = setInterval(() => {
        progress += 5
        if (progress >= 100) {
          setTransmissionProgress(100)
          if (transmissionRef.current) clearInterval(transmissionRef.current)
          setTimeout(() => goNext(), 400)
        } else {
          setTransmissionProgress(progress)
        }
      }, playSpeed / 20)
    } else {
      intervalRef.current = setInterval(() => {
        goNext()
      }, playSpeed)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (transmissionRef.current) clearInterval(transmissionRef.current)
    }
  }, [isPlaying, phase, playSpeed, scenario, goNext, transmissionProgress])

  /* When transmission phase starts via auto-play, animate the bar */
  useEffect(() => {
    if (phase === 'transmission' && !isPlaying) {
      const timer = setInterval(() => {
        setTransmissionProgress((p) => {
          if (p >= 100) {
            clearInterval(timer)
            return 100
          }
          return p + 2
        })
      }, 50)
      return () => clearInterval(timer)
    }
  }, [phase, isPlaying])

  /* ---- Select scenario ---- */

  const selectScenario = useCallback(
    (id: string) => {
      setSelectedScenarioId(id)
      setSelectorOpen(false)
      reset()
    },
    [reset]
  )

  /* Is at the end? */
  const isAtEnd =
    phase === 'decapsulation' && stepIndex === decSteps.length - 1
  const isAtStart = phase === 'encapsulation' && stepIndex === 0

  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* ---- Header ---- */}
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
            {t('// visualiseur', '// visualizer')}
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
            {t('Visualiseur de Paquets', 'Packet Visualizer')}
          </h1>
          <p
            style={{
              fontSize: 15,
              color: 'var(--text-secondary)',
              fontWeight: 300,
              maxWidth: 700,
            }}
          >
            {t("Explorez le processus d'encapsulation et de decapsulation du modele OSI etape par etape. Choisissez un scenario reseau et observez comment un paquet est construit puis demonte couche par couche.", 'Explore the OSI model encapsulation and decapsulation process step by step. Choose a network scenario and observe how a packet is built and then dismantled layer by layer.')}
          </p>
        </div>

        {/* ---- Scenario Selector ---- */}
        <div style={{ marginBottom: 32 }}>
          <button
            onClick={() => setSelectorOpen(!selectorOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              padding: '10px 16px',
              cursor: 'pointer',
              width: '100%',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-heading)',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <Layers size={16} style={{ color: 'var(--accent)' }} />
            {scenario
              ? `${t('Scenario', 'Scenario')} : ${scenario.title}`
              : t('Choisir un scenario', 'Choose a scenario')}
            <ChevronDown
              size={16}
              style={{
                marginLeft: 'auto',
                color: 'var(--text-muted)',
                transform: selectorOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
            />
          </button>
          <AnimatePresence>
            {selectorOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: 'hidden' }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: 8,
                    paddingTop: 8,
                  }}
                >
                  {packetScenarios.map((s) => (
                    <ScenarioCard
                      key={s.id}
                      scenario={s}
                      isSelected={s.id === selectedScenarioId}
                      onSelect={() => selectScenario(s.id)}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ---- Main Visualization ---- */}
        {scenario && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Controls Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                padding: '12px 20px',
                marginBottom: 16,
              }}
            >
              {/* Phase indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    color:
                      phase === 'encapsulation'
                        ? '#6366f1'
                        : phase === 'transmission'
                          ? 'var(--accent)'
                          : '#f59e0b',
                    background:
                      phase === 'encapsulation'
                        ? '#6366f115'
                        : phase === 'transmission'
                          ? 'rgba(0,229,160,0.1)'
                          : '#f59e0b15',
                    border: `1px solid ${
                      phase === 'encapsulation'
                        ? '#6366f130'
                        : phase === 'transmission'
                          ? 'rgba(0,229,160,0.2)'
                          : '#f59e0b30'
                    }`,
                    padding: '4px 12px',
                  }}
                >
                  {phase === 'encapsulation' && t('Encapsulation', 'Encapsulation')}
                  {phase === 'transmission' && t('Transmission', 'Transmission')}
                  {phase === 'decapsulation' && t('Decapsulation', 'Decapsulation')}
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    color: 'var(--text-muted)',
                  }}
                >
                  {t('Etape', 'Step')} {globalStep}/{totalSteps}
                </span>
              </div>

              {/* Navigation buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={goPrev}
                  disabled={isAtStart}
                  style={{
                    background: isAtStart
                      ? 'var(--bg-tertiary)'
                      : 'var(--bg-tertiary)',
                    border: '1px solid var(--border)',
                    padding: '6px 10px',
                    cursor: isAtStart ? 'not-allowed' : 'pointer',
                    opacity: isAtStart ? 0.4 : 1,
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <ChevronLeft size={16} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPlaying(!isPlaying)}
                  style={{
                    background: isPlaying
                      ? 'rgba(0,229,160,0.15)'
                      : 'var(--bg-tertiary)',
                    border: `1px solid ${
                      isPlaying ? 'var(--accent)' : 'var(--border)'
                    }`,
                    padding: '6px 14px',
                    cursor: 'pointer',
                    color: isPlaying ? 'var(--accent)' : 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                  }}
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                  {isPlaying ? 'Pause' : t('Lecture', 'Play')}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={goNext}
                  disabled={isAtEnd}
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border)',
                    padding: '6px 10px',
                    cursor: isAtEnd ? 'not-allowed' : 'pointer',
                    opacity: isAtEnd ? 0.4 : 1,
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <ChevronRight size={16} />
                </motion.button>

                <div
                  style={{
                    width: 1,
                    height: 20,
                    background: 'var(--border)',
                    margin: '0 4px',
                  }}
                />

                {/* Speed control */}
                <select
                  value={playSpeed}
                  onChange={(e) => setPlaySpeed(Number(e.target.value))}
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border)',
                    padding: '5px 8px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  <option value={3000}>{t('Lent', 'Slow')}</option>
                  <option value={2000}>Normal</option>
                  <option value={1000}>{t('Rapide', 'Fast')}</option>
                  <option value={500}>{t('Tres rapide', 'Very fast')}</option>
                </select>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={reset}
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border)',
                    padding: '6px 10px',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <RotateCcw size={14} />
                </motion.button>
              </div>
            </div>

            {/* Three-column layout */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '180px 1fr 300px',
                gap: 16,
                minHeight: 500,
              }}
            >
              {/* LEFT: OSI Stack */}
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  padding: 12,
                }}
              >
                <OsiStack activeLayer={activeLayerNum} phase={phase} osiLayers={OSI_LAYERS_CURRENT} t={t} />
              </div>

              {/* CENTER: Packet Visualization */}
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Background grid */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage:
                      'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    opacity: 0.3,
                    pointerEvents: 'none',
                  }}
                />

                {/* Phase label */}
                <motion.div
                  key={phase}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    marginBottom: 20,
                    zIndex: 1,
                  }}
                >
                  {phase === 'encapsulation' &&
                    `${t('Couche', 'Layer')} ${currentStep?.layer ?? '-'} : ${currentStep?.layerName ?? '-'} — ${t('ajout en-tete', 'adding header')}`}
                  {phase === 'transmission' &&
                    t('Transmission sur le medium physique...', 'Transmission over the physical medium...')}
                  {phase === 'decapsulation' &&
                    `${t('Couche', 'Layer')} ${currentStep?.layer ?? '-'} : ${currentStep?.layerName ?? '-'} — ${t('retrait en-tete', 'removing header')}`}
                </motion.div>

                <div style={{ zIndex: 1, maxWidth: '100%', overflow: 'auto' }}>
                  <PacketVisual
                    layers={visibleLayers}
                    phase={phase}
                    transmissionProgress={transmissionProgress}
                    currentStep={currentStep}
                    t={t}
                  />
                </div>

                {/* Step progress dots */}
                <div
                  style={{
                    display: 'flex',
                    gap: 6,
                    marginTop: 24,
                    zIndex: 1,
                  }}
                >
                  {Array.from({ length: totalSteps }, (_, i) => {
                    const isCurrent = i + 1 === globalStep
                    const isCompleted = i + 1 < globalStep
                    const isTransmission = i === encSteps.length
                    return (
                      <motion.div
                        key={i}
                        animate={{
                          scale: isCurrent ? 1.3 : 1,
                          background: isCurrent
                            ? 'var(--accent)'
                            : isCompleted
                              ? 'var(--accent)'
                              : 'var(--bg-tertiary)',
                          opacity: isCompleted ? 0.5 : 1,
                        }}
                        style={{
                          width: isTransmission ? 16 : 8,
                          height: 8,
                          border: '1px solid var(--border)',
                        }}
                      />
                    )
                  })}
                </div>
              </div>

              {/* RIGHT: Details Panel */}
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  padding: 16,
                  overflowY: 'auto',
                  maxHeight: 600,
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    marginBottom: 12,
                    paddingBottom: 8,
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  {t('Details de la couche', 'Layer details')}
                </div>
                {phase === 'transmission' ? (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 16,
                      padding: '40px 16px',
                    }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    >
                      <Zap size={32} style={{ color: 'var(--accent)' }} />
                    </motion.div>
                    <div
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 15,
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        textAlign: 'center',
                      }}
                    >
                      {t('Transmission en cours', 'Transmission in progress')}
                    </div>
                    <p
                      style={{
                        fontSize: 12,
                        color: 'var(--text-secondary)',
                        textAlign: 'center',
                        lineHeight: 1.7,
                      }}
                    >
                      {t('Le paquet encapsule traverse le medium physique depuis', 'The encapsulated packet traverses the physical medium from')}{' '}
                      <strong style={{ color: 'var(--accent)' }}>
                        {scenario.sourceDevice}
                      </strong>{' '}
                      {t('vers', 'to')}{' '}
                      <strong style={{ color: '#f59e0b' }}>
                        {scenario.destinationDevice}
                      </strong>
                      . {t('Les signaux electriques ou optiques transportent les bits sur le cable ou la fibre.', 'Electrical or optical signals carry the bits over the cable or fiber.')}
                    </p>
                    <div
                      style={{
                        width: '100%',
                        background: 'var(--bg-tertiary)',
                        height: 6,
                        marginTop: 8,
                      }}
                    >
                      <motion.div
                        animate={{ width: `${transmissionProgress}%` }}
                        style={{
                          height: '100%',
                          background: 'var(--accent)',
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        color: 'var(--text-muted)',
                      }}
                    >
                      {transmissionProgress}%
                    </span>
                  </div>
                ) : (
                  <DetailsPanel step={currentStep} t={t} />
                )}
              </div>
            </div>

            {/* Source / Destination info bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                padding: '12px 20px',
                marginTop: 16,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <Monitor size={18} style={{ color: 'var(--accent)' }} />
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 9,
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    Source
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {scenario.sourceDevice}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  flex: 1,
                  justifyContent: 'center',
                  maxWidth: 300,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    background: 'var(--border)',
                    position: 'relative',
                  }}
                >
                  <motion.div
                    animate={{
                      width:
                        phase === 'encapsulation'
                          ? '0%'
                          : phase === 'transmission'
                            ? `${transmissionProgress}%`
                            : '100%',
                    }}
                    style={{
                      height: '100%',
                      background: 'var(--accent)',
                    }}
                  />
                </div>
                <motion.div
                  animate={{
                    x:
                      phase === 'encapsulation'
                        ? 0
                        : phase === 'transmission'
                          ? transmissionProgress * 0.5
                          : 50,
                  }}
                >
                  <ArrowRight
                    size={16}
                    style={{
                      color:
                        phase === 'transmission'
                          ? 'var(--accent)'
                          : 'var(--text-muted)',
                    }}
                  />
                </motion.div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 9,
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    Destination
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {scenario.destinationDevice}
                  </div>
                </div>
                <Server size={18} style={{ color: '#f59e0b' }} />
              </div>
            </div>

            {/* Legend */}
            <div
              style={{
                marginTop: 24,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                padding: '16px 20px',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  marginBottom: 12,
                }}
              >
                {t('Legende des couches OSI', 'OSI layer legend')}
              </div>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 12,
                }}
              >
                {OSI_LAYERS_CURRENT.map((layer) => (
                  <div
                    key={layer.num}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        background: layer.color,
                        border: `1px solid ${layer.color}`,
                        opacity: 0.8,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {layer.num}. {layer.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Keyboard shortcuts hint */}
            <div
              style={{
                marginTop: 16,
                display: 'flex',
                gap: 16,
                justifyContent: 'center',
              }}
            >
              {[
                { key: '\u2190', label: t('Precedent', 'Previous') },
                { key: '\u2192', label: t('Suivant', 'Next') },
                { key: t('Espace', 'Space'), label: t('Lecture/Pause', 'Play/Pause') },
                { key: 'R', label: t('Reinitialiser', 'Reset') },
              ].map((shortcut) => (
                <div
                  key={shortcut.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 11,
                    color: 'var(--text-muted)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border)',
                      padding: '2px 6px',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {shortcut.key}
                  </span>
                  {shortcut.label}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {!scenario && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              padding: '80px 40px',
              textAlign: 'center',
            }}
          >
            <Layers
              size={48}
              style={{ color: 'var(--text-muted)', opacity: 0.3, margin: '0 auto 20px' }}
            />
            <p
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 18,
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: 8,
              }}
            >
              {t('Aucun scenario selectionne', 'No scenario selected')}
            </p>
            <p
              style={{
                fontSize: 13,
                color: 'var(--text-muted)',
              }}
            >
              {t("Choisissez un scenario ci-dessus pour commencer la visualisation du processus d'encapsulation/decapsulation.", 'Choose a scenario above to start visualizing the encapsulation/decapsulation process.')}
            </p>
          </motion.div>
        )}
      </div>

      {/* Keyboard listener */}
      <KeyboardHandler
        onNext={goNext}
        onPrev={goPrev}
        onTogglePlay={() => setIsPlaying((p) => !p)}
        onReset={reset}
        disabled={!scenario}
        isAtEnd={isAtEnd}
        isAtStart={isAtStart}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Keyboard Handler (invisible)                                       */
/* ------------------------------------------------------------------ */

function KeyboardHandler({
  onNext,
  onPrev,
  onTogglePlay,
  onReset,
  disabled,
  isAtEnd,
  isAtStart,
}: {
  onNext: () => void
  onPrev: () => void
  onTogglePlay: () => void
  onReset: () => void
  disabled: boolean
  isAtEnd: boolean
  isAtStart: boolean
}) {
  useEffect(() => {
    if (disabled) return

    function handleKey(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLSelectElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return

      switch (e.key) {
        case 'ArrowRight':
          if (!isAtEnd) {
            e.preventDefault()
            onNext()
          }
          break
        case 'ArrowLeft':
          if (!isAtStart) {
            e.preventDefault()
            onPrev()
          }
          break
        case ' ':
          e.preventDefault()
          onTogglePlay()
          break
        case 'r':
        case 'R':
          onReset()
          break
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [disabled, onNext, onPrev, onTogglePlay, onReset, isAtEnd, isAtStart])

  return null
}
