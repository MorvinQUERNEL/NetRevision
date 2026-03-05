import { useState } from 'react'
import { CheckCircle, Circle, ChevronDown, ChevronUp, Lightbulb, Network } from 'lucide-react'
import { LabScenario } from '../data/cliLabs'
import { DeviceState } from '../data/ciscoCommands'
import { useLangStore } from '../stores/langStore'

interface LabObjectivesProps {
  lab: LabScenario
  deviceState: DeviceState
  completedObjectives: Set<string>
}

export default function LabObjectives({ lab, deviceState, completedObjectives }: LabObjectivesProps) {
  const lang = useLangStore((s) => s.lang)
  const t = (fr: string, en: string) => lang === 'en' ? en : fr
  const [showTopology, setShowTopology] = useState(true)
  const [showHints, setShowHints] = useState(false)
  const [revealedHints, setRevealedHints] = useState(0)

  const total = lab.objectives.length
  const done = completedObjectives.size
  const allDone = done === total

  return (
    <div style={{
      background: 'var(--bg-secondary)', border: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', height: '100%', overflow: 'auto',
    }}>
      {/* Lab title */}
      <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--border)' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, color: allDone ? 'var(--accent)' : 'var(--accent-warm)',
          textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 6,
        }}>
          {allDone ? '// lab complete' : `// ${done}/${total} ${t('objectifs', 'objectives')}`}
        </div>
        <h3 style={{
          fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 700,
          lineHeight: 1.3, marginBottom: 4,
        }}>
          {lab.title}
        </h3>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
          {lab.description}
        </p>
      </div>

      {/* Progress bar */}
      <div style={{ padding: '0 16px' }}>
        <div style={{ height: 3, background: 'var(--bg-primary)', margin: '12px 0' }}>
          <div style={{
            height: '100%', background: allDone ? 'var(--accent)' : 'var(--accent-warm)',
            width: `${(done / total) * 100}%`, transition: 'width 0.5s ease',
          }} />
        </div>
      </div>

      {/* Objectives list */}
      <div style={{ padding: '0 16px 12px' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)',
          textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10,
        }}>
          {t('Objectifs', 'Objectives')}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {lab.objectives.map(obj => {
            const isDone = completedObjectives.has(obj.id)
            return (
              <div key={obj.id} style={{
                display: 'flex', alignItems: 'flex-start', gap: 8,
                padding: '8px 10px', background: isDone ? 'rgba(0, 229, 160, 0.06)' : 'var(--bg-primary)',
                border: `1px solid ${isDone ? 'rgba(0, 229, 160, 0.2)' : 'var(--border)'}`,
                transition: 'all 0.3s',
              }}>
                {isDone ? (
                  <CheckCircle size={16} color="var(--accent)" style={{ marginTop: 1, flexShrink: 0 }} />
                ) : (
                  <Circle size={16} color="var(--text-muted)" style={{ marginTop: 1, flexShrink: 0 }} />
                )}
                <span style={{
                  fontSize: 12, lineHeight: 1.5,
                  color: isDone ? 'var(--accent)' : 'var(--text-secondary)',
                  textDecoration: isDone ? 'line-through' : 'none',
                  opacity: isDone ? 0.8 : 1,
                }}>
                  {obj.description}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Topology */}
      {lab.topology && (
        <div style={{ padding: '0 16px 12px' }}>
          <button onClick={() => setShowTopology(!showTopology)} style={{
            display: 'flex', alignItems: 'center', gap: 6, width: '100%',
            padding: '8px 0', background: 'transparent', border: 'none',
            color: 'var(--text-muted)', fontSize: 12, fontFamily: 'var(--font-mono)',
            cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px',
          }}>
            <Network size={14} /> {t('Topologie', 'Topology')}
            {showTopology ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {showTopology && (
            <pre style={{
              background: 'var(--bg-primary)', border: '1px solid var(--border)',
              padding: 12, fontFamily: 'var(--font-mono)', fontSize: 11,
              color: 'var(--text-secondary)', lineHeight: 1.5,
              whiteSpace: 'pre-wrap', overflow: 'auto',
            }}>
              {lab.topology.trim()}
            </pre>
          )}
        </div>
      )}

      {/* Hints */}
      {lab.hints.length > 0 && (
        <div style={{ padding: '0 16px 16px' }}>
          <button onClick={() => setShowHints(!showHints)} style={{
            display: 'flex', alignItems: 'center', gap: 6, width: '100%',
            padding: '8px 0', background: 'transparent', border: 'none',
            color: 'var(--accent-warm)', fontSize: 12, fontFamily: 'var(--font-mono)',
            cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px',
          }}>
            <Lightbulb size={14} /> {t('Indices', 'Hints')} ({revealedHints}/{lab.hints.length})
            {showHints ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {showHints && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>
              {lab.hints.map((hint, i) => (
                <div key={i}>
                  {i < revealedHints ? (
                    <div style={{
                      padding: '8px 10px', background: 'rgba(245, 158, 11, 0.06)',
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                      fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)',
                    }}>
                      {hint}
                    </div>
                  ) : i === revealedHints ? (
                    <button onClick={() => setRevealedHints(prev => prev + 1)} style={{
                      padding: '6px 10px', background: 'var(--bg-primary)',
                      border: '1px solid var(--border)', color: 'var(--text-muted)',
                      fontSize: 11, cursor: 'pointer', width: '100%', textAlign: 'left',
                    }}>
                      {t(`Reveler l'indice ${i + 1}...`, `Reveal hint ${i + 1}...`)}
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Completion message */}
      {allDone && (
        <div style={{
          margin: '0 16px 16px', padding: 16,
          background: 'rgba(0, 229, 160, 0.08)', border: '1px solid rgba(0, 229, 160, 0.3)',
          textAlign: 'center',
        }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 700, color: 'var(--accent)', marginBottom: 4 }}>
            {t('Lab termine !', 'Lab complete!')}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            +{lab.points} {t('points gagnes', 'points earned')}
          </div>
        </div>
      )}
    </div>
  )
}
