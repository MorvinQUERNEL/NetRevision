import { useNavigate } from 'react-router-dom'
import { Network, Container } from 'lucide-react'
import { useFormationStore, FORMATIONS, type FormationType } from '../stores/formationStore'
import { useLangStore } from '../stores/langStore'

interface Props {
  compact?: boolean
}

const formations: { id: FormationType; icon: typeof Network; accentDark: string; accentLight: string }[] = [
  { id: 'reseaux', icon: Network, accentDark: '#00e5a0', accentLight: '#059669' },
  { id: 'devops', icon: Container, accentDark: '#3b82f6', accentLight: '#2563eb' },
]

export default function FormationSwitcher({ compact }: Props) {
  const current = useFormationStore((s) => s.currentFormation)
  const setFormation = useFormationStore((s) => s.setFormation)
  const lang = useLangStore((s) => s.lang)
  const navigate = useNavigate()

  const handleSwitch = (f: FormationType) => {
    if (f === current) return
    setFormation(f)
    document.documentElement.setAttribute('data-formation', f)
    navigate(`/${f}/dashboard`)
  }

  return (
    <div style={{
      display: 'flex',
      gap: 0,
      border: '1px solid var(--border)',
      background: 'var(--bg-primary)',
    }}>
      {formations.map((f) => {
        const active = current === f.id
        const meta = FORMATIONS[f.id]
        const label = lang === 'en' ? meta.nameEn : meta.name
        const Icon = f.icon
        return (
          <button
            key={f.id}
            onClick={() => handleSwitch(f.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: compact ? 0 : 8,
              padding: compact ? '6px 10px' : '8px 16px',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.5px',
              border: 'none',
              borderRadius: 0,
              cursor: active ? 'default' : 'pointer',
              background: active ? f.accentDark : 'transparent',
              color: active ? '#080b1a' : 'var(--text-secondary)',
              transition: 'all 0.15s',
              textTransform: 'uppercase',
            }}
          >
            <Icon size={14} />
            {!compact && label}
          </button>
        )
      })}
    </div>
  )
}
