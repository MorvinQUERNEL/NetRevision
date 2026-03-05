import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeftRight,
  ChevronDown,
  Check,
  X,
  Shield,
  Zap,
  Globe,
  Server,
  Wifi,
  Lock,
  Layers,
  Network,
  Radio,
  Activity,
} from 'lucide-react'
import { type Protocol } from '../data/protocols'
import { useLangStore } from '../stores/langStore'
import { useProtocols } from '../hooks/useTranslation'

const categoryIcons: Record<string, React.ReactNode> = {
  Routage: <Network size={14} />,
  Transport: <Activity size={14} />,
  Application: <Globe size={14} />,
  Securite: <Shield size={14} />,
  Switching: <Server size={14} />,
  Services: <Radio size={14} />,
}

const layerColors: Record<number, string> = {
  7: '#f97316',
  6: '#eab308',
  5: '#84cc16',
  4: '#22c55e',
  3: '#06b6d4',
  2: '#6366f1',
  1: '#a855f7',
}

function ProtocolSelect({
  value,
  onChange,
  otherValue,
  filteredProtocols,
  allProtocols,
  allCategories,
  placeholder,
}: {
  value: string
  onChange: (id: string) => void
  otherValue: string
  filteredProtocols: Protocol[]
  allProtocols: Protocol[]
  allCategories: string[]
  placeholder: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = allProtocols.find(p => p.id === value)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const grouped = useMemo(() => {
    const map: Record<string, Protocol[]> = {}
    for (const cat of allCategories) {
      const items = filteredProtocols.filter(p => p.category === cat)
      if (items.length > 0) map[cat] = items
    }
    return map
  }, [filteredProtocols, allCategories])

  return (
    <div ref={ref} style={{ position: 'relative', flex: 1, minWidth: 0 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          background: 'var(--bg-secondary)',
          border: '1px solid',
          borderColor: open ? 'var(--accent)' : 'var(--border)',
          color: selected ? 'var(--text-primary)' : 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
          fontSize: 14,
          padding: '14px 16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          transition: 'border-color 0.15s ease',
          textAlign: 'left',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          {selected && (
            <span
              style={{
                width: 10,
                height: 10,
                background: selected.color,
                flexShrink: 0,
              }}
            />
          )}
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {selected ? selected.name : placeholder}
          </span>
        </span>
        <ChevronDown
          size={16}
          style={{
            flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 0.2s ease',
            color: 'var(--text-muted)',
          }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 0,
              right: 0,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--accent)',
              zIndex: 50,
              maxHeight: 360,
              overflowY: 'auto',
            }}
          >
            {Object.entries(grouped).map(([cat, items]) => (
              <div key={cat}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    color: 'var(--accent)',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    padding: '10px 14px 4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  {categoryIcons[cat]}
                  {cat}
                </div>
                {items.map(p => {
                  const isDisabled = p.id === otherValue
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        if (!isDisabled) {
                          onChange(p.id)
                          setOpen(false)
                        }
                      }}
                      style={{
                        width: '100%',
                        background: p.id === value ? 'var(--bg-tertiary)' : 'transparent',
                        border: 'none',
                        color: isDisabled ? 'var(--text-muted)' : 'var(--text-primary)',
                        fontFamily: 'var(--font-body)',
                        fontSize: 13,
                        padding: '8px 14px',
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        opacity: isDisabled ? 0.4 : 1,
                        textAlign: 'left',
                        transition: 'background 0.1s ease',
                      }}
                      onMouseEnter={e => {
                        if (!isDisabled) (e.currentTarget as HTMLElement).style.background = 'var(--bg-tertiary)'
                      }}
                      onMouseLeave={e => {
                        if (p.id !== value) (e.currentTarget as HTMLElement).style.background = 'transparent'
                      }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          background: p.color,
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontWeight: 600 }}>{p.name}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>
                        L{p.layer}
                      </span>
                    </button>
                  )
                })}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function SpeedBadge({ value }: { value: string }) {
  const color = value === 'Rapide' ? 'var(--success)' : value === 'Moyen' ? '#eab308' : 'var(--error)'
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color,
        background: `${color}14`,
        border: `1px solid ${color}33`,
        padding: '4px 10px',
      }}
    >
      <Zap size={12} />
      {value}
    </span>
  )
}

function ReliabilityBadge({ value }: { value: string }) {
  const color = value === 'Fiable' ? 'var(--success)' : value === 'Non fiable' ? 'var(--error)' : '#eab308'
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color,
        background: `${color}14`,
        border: `1px solid ${color}33`,
        padding: '4px 10px',
      }}
    >
      <Activity size={12} />
      {value}
    </span>
  )
}

function SecurityBadge({ value }: { value: string }) {
  const color = value === 'Chiffre' ? 'var(--success)' : value === 'Non chiffre' ? 'var(--error)' : '#eab308'
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color,
        background: `${color}14`,
        border: `1px solid ${color}33`,
        padding: '4px 10px',
      }}
    >
      <Lock size={12} />
      {value}
    </span>
  )
}

function LayerBadge({ layer, name }: { layer: number; name: string }) {
  const color = layerColors[layer] || 'var(--accent)'
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 28,
          height: 28,
          background: `${color}22`,
          border: `1px solid ${color}55`,
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          fontWeight: 700,
          color,
        }}
      >
        {layer}
      </span>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-primary)' }}>
        {name}
      </span>
    </span>
  )
}

function ComparisonRow({
  label,
  left,
  right,
  index,
}: {
  label: string
  left: React.ReactNode
  right: React.ReactNode
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className="comparison-row"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 160px 1fr',
        border: '1px solid var(--border)',
        borderTop: index === 0 ? '1px solid var(--border)' : 'none',
      }}
    >
      <div
        style={{
          padding: '14px 16px',
          background: 'var(--bg-secondary)',
          fontSize: 14,
          color: 'var(--text-primary)',
        }}
      >
        {left}
      </div>
      <div
        style={{
          padding: '14px 12px',
          background: 'var(--bg-tertiary)',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--accent)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          borderLeft: '1px solid var(--border)',
          borderRight: '1px solid var(--border)',
        }}
      >
        {label}
      </div>
      <div
        style={{
          padding: '14px 16px',
          background: 'var(--bg-secondary)',
          fontSize: 14,
          color: 'var(--text-primary)',
        }}
      >
        {right}
      </div>
    </motion.div>
  )
}

function ListItems({ items, type }: { items: string[]; type: 'strength' | 'weakness' | 'neutral' }) {
  const icon =
    type === 'strength' ? (
      <Check size={13} style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} />
    ) : type === 'weakness' ? (
      <X size={13} style={{ color: 'var(--error)', flexShrink: 0, marginTop: 2 }} />
    ) : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
          {icon}
          <span style={{ color: 'var(--text-secondary)' }}>{item}</span>
        </div>
      ))}
    </div>
  )
}

export default function ProtocolComparator() {
  const lang = useLangStore((s) => s.lang)
  const t = (fr: string, en: string) => lang === 'en' ? en : fr
  const { protocols, protocolCategories } = useProtocols()

  const [leftId, setLeftId] = useState('')
  const [rightId, setRightId] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>(t('Tous', 'All'))

  const allLabel = t('Tous', 'All')
  const filteredProtocols = useMemo(() => {
    if (activeCategory === allLabel) return protocols
    return protocols.filter(p => p.category === activeCategory)
  }, [activeCategory, allLabel, protocols])

  const leftProtocol = protocols.find(p => p.id === leftId)
  const rightProtocol = protocols.find(p => p.id === rightId)
  const bothSelected = leftProtocol && rightProtocol

  const handleSwap = () => {
    setLeftId(rightId)
    setRightId(leftId)
  }

  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: 36 }}
        >
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
            {t('// comparateur', '// comparator')}
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
            {t('Comparateur de Protocoles', 'Protocol Comparator')}
          </h1>
          <p
            style={{
              fontSize: 15,
              color: 'var(--text-secondary)',
              fontWeight: 300,
              maxWidth: 600,
            }}
          >
            {t('Selectionnez deux protocoles reseau pour comparer leurs caracteristiques, performances et cas d\'usage en detail.', 'Select two network protocols to compare their characteristics, performance and use cases in detail.')}
          </p>
        </motion.div>

        {/* Category filter chips */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}
        >
          {[t('Tous', 'All'), ...protocolCategories].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: activeCategory === cat ? 'var(--accent)' : 'var(--bg-secondary)',
                border: '1px solid',
                borderColor: activeCategory === cat ? 'var(--accent)' : 'var(--border)',
                color: activeCategory === cat ? 'var(--bg-primary)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                padding: '6px 14px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              {cat !== t('Tous', 'All') && categoryIcons[cat]}
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Protocol selectors */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="protocol-selectors"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            marginBottom: 36,
          }}
        >
          <ProtocolSelect
            value={leftId}
            onChange={setLeftId}
            otherValue={rightId}
            filteredProtocols={filteredProtocols}
            allProtocols={protocols}
            allCategories={[...protocolCategories]}
            placeholder={t('Selectionner un protocole...', 'Select a protocol...')}
          />

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleSwap}
            disabled={!leftId && !rightId}
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border)',
              color: leftId || rightId ? 'var(--accent)' : 'var(--text-muted)',
              padding: 12,
              cursor: leftId || rightId ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: 2,
              transition: 'color 0.15s ease',
            }}
          >
            <ArrowLeftRight size={18} />
          </motion.button>

          <ProtocolSelect
            value={rightId}
            onChange={setRightId}
            otherValue={leftId}
            filteredProtocols={filteredProtocols}
            allProtocols={protocols}
            allCategories={[...protocolCategories]}
            placeholder={t('Selectionner un protocole...', 'Select a protocol...')}
          />
        </motion.div>

        {/* Comparison content */}
        <AnimatePresence mode="wait">
          {bothSelected ? (
            <motion.div
              key={`${leftId}-${rightId}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
            >
              {/* Protocol headers */}
              <div
                className="comparison-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 160px 1fr',
                  marginBottom: 2,
                }}
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    padding: '20px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      background: `${leftProtocol.color}18`,
                      border: `2px solid ${leftProtocol.color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 14,
                      fontWeight: 700,
                      color: leftProtocol.color,
                      flexShrink: 0,
                    }}
                  >
                    {leftProtocol.name.slice(0, 3)}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 20,
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                      }}
                    >
                      {leftProtocol.name}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        color: 'var(--text-muted)',
                        marginTop: 2,
                      }}
                    >
                      {leftProtocol.category}
                    </div>
                  </div>
                </motion.div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--bg-tertiary)',
                    borderTop: '1px solid var(--border)',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 12,
                      color: 'var(--accent)',
                      fontWeight: 700,
                    }}
                  >
                    VS
                  </span>
                </div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    padding: '20px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      background: `${rightProtocol.color}18`,
                      border: `2px solid ${rightProtocol.color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 14,
                      fontWeight: 700,
                      color: rightProtocol.color,
                      flexShrink: 0,
                    }}
                  >
                    {rightProtocol.name.slice(0, 3)}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 20,
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                      }}
                    >
                      {rightProtocol.name}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        color: 'var(--text-muted)',
                        marginTop: 2,
                      }}
                    >
                      {rightProtocol.category}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Comparison rows */}
              <div style={{ marginTop: 2 }}>
                <ComparisonRow
                  index={0}
                  label={t('Nom complet', 'Full name')}
                  left={
                    <span style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>
                      {leftProtocol.fullName}
                    </span>
                  }
                  right={
                    <span style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>
                      {rightProtocol.fullName}
                    </span>
                  }
                />
                <ComparisonRow
                  index={1}
                  label={t('Couche OSI', 'OSI Layer')}
                  left={<LayerBadge layer={leftProtocol.layer} name={leftProtocol.layerName} />}
                  right={<LayerBadge layer={rightProtocol.layer} name={rightProtocol.layerName} />}
                />
                <ComparisonRow
                  index={2}
                  label="Port(s)"
                  left={
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-primary)' }}>
                      {leftProtocol.port}
                    </span>
                  }
                  right={
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-primary)' }}>
                      {rightProtocol.port}
                    </span>
                  }
                />
                <ComparisonRow
                  index={3}
                  label="Transport"
                  left={
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-primary)' }}>
                      {leftProtocol.transportProtocol}
                    </span>
                  }
                  right={
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-primary)' }}>
                      {rightProtocol.transportProtocol}
                    </span>
                  }
                />
                <ComparisonRow
                  index={4}
                  label={t('Vitesse', 'Speed')}
                  left={<SpeedBadge value={leftProtocol.speed} />}
                  right={<SpeedBadge value={rightProtocol.speed} />}
                />
                <ComparisonRow
                  index={5}
                  label={t('Fiabilite', 'Reliability')}
                  left={<ReliabilityBadge value={leftProtocol.reliability} />}
                  right={<ReliabilityBadge value={rightProtocol.reliability} />}
                />
                <ComparisonRow
                  index={6}
                  label={t('Securite', 'Security')}
                  left={<SecurityBadge value={leftProtocol.security} />}
                  right={<SecurityBadge value={rightProtocol.security} />}
                />
                <ComparisonRow
                  index={7}
                  label={t("Cas d'usage", 'Use cases')}
                  left={<ListItems items={leftProtocol.useCases} type="neutral" />}
                  right={<ListItems items={rightProtocol.useCases} type="neutral" />}
                />
                <ComparisonRow
                  index={8}
                  label={t('Forces', 'Strengths')}
                  left={<ListItems items={leftProtocol.strengths} type="strength" />}
                  right={<ListItems items={rightProtocol.strengths} type="strength" />}
                />
                <ComparisonRow
                  index={9}
                  label={t('Faiblesses', 'Weaknesses')}
                  left={<ListItems items={leftProtocol.weaknesses} type="weakness" />}
                  right={<ListItems items={rightProtocol.weaknesses} type="weakness" />}
                />
                <ComparisonRow
                  index={10}
                  label="Description"
                  left={
                    <span style={{ fontSize: 13, lineHeight: 1.65, color: 'var(--text-secondary)' }}>
                      {leftProtocol.description}
                    </span>
                  }
                  right={
                    <span style={{ fontSize: 13, lineHeight: 1.65, color: 'var(--text-secondary)' }}>
                      {rightProtocol.description}
                    </span>
                  }
                />
              </div>

              {/* Protocol count */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                style={{
                  marginTop: 24,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: 'var(--text-muted)',
                  textAlign: 'center',
                }}
              >
                {protocols.length} {t('protocoles disponibles dans la base de donnees', 'protocols available in the database')}
              </motion.div>
            </motion.div>
          ) : (
            /* Empty state */
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                padding: '64px 24px',
                textAlign: 'center',
              }}
            >
              <motion.div
                animate={{
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 24,
                  marginBottom: 28,
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    border: '2px dashed var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Layers size={24} style={{ color: 'var(--text-muted)' }} />
                </div>
                <ArrowLeftRight size={20} style={{ color: 'var(--text-muted)' }} />
                <div
                  style={{
                    width: 56,
                    height: 56,
                    border: '2px dashed var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Wifi size={24} style={{ color: 'var(--text-muted)' }} />
                </div>
              </motion.div>

              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 20,
                  fontWeight: 700,
                  marginBottom: 10,
                  color: 'var(--text-primary)',
                }}
              >
                {t('Selectionnez deux protocoles', 'Select two protocols')}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: 'var(--text-muted)',
                  maxWidth: 420,
                  margin: '0 auto',
                  lineHeight: 1.6,
                }}
              >
                {t('Utilisez les selecteurs ci-dessus pour choisir deux protocoles reseau et visualiser une comparaison detaillee de leurs proprietes.', 'Use the selectors above to choose two network protocols and view a detailed comparison of their properties.')}
              </p>

              {/* Quick suggestions */}
              <div
                style={{
                  marginTop: 32,
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    width: '100%',
                    marginBottom: 4,
                  }}
                >
                  {t('Comparaisons populaires', 'Popular comparisons')}
                </div>
                {[
                  { left: 'tcp', right: 'udp', label: 'TCP vs UDP' },
                  { left: 'http', right: 'https', label: 'HTTP vs HTTPS' },
                  { left: 'ospf', right: 'eigrp', label: 'OSPF vs EIGRP' },
                  { left: 'ftp', right: 'sftp', label: 'FTP vs SFTP' },
                  { left: 'stp', right: 'rstp', label: 'STP vs RSTP' },
                  { left: 'wpa2', right: 'wpa3', label: 'WPA2 vs WPA3' },
                ].map(suggestion => (
                  <motion.button
                    key={suggestion.label}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setLeftId(suggestion.left)
                      setRightId(suggestion.right)
                    }}
                    style={{
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-secondary)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 12,
                      padding: '8px 16px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'
                      ;(e.currentTarget as HTMLElement).style.color = 'var(--accent)'
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
                      ;(e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'
                    }}
                  >
                    {suggestion.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Responsive styles via a style tag for media queries */}
      <style>{`
        @media (max-width: 768px) {
          .comparison-row {
            grid-template-columns: 1fr !important;
          }
          .comparison-row > div:nth-child(2) {
            border-left: none !important;
            border-right: none !important;
            border-top: 1px solid var(--border) !important;
            border-bottom: 1px solid var(--border) !important;
          }
          .protocol-selectors {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .protocol-selectors > button {
            align-self: center !important;
          }
        }
      `}</style>
    </div>
  )
}
