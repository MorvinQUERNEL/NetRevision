import { useState, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Router,
  Monitor,
  Server,
  Shield,
  Wifi,
  Box,
  Trash2,
  Check,
  X,
  ChevronRight,
  RotateCcw,
  Zap,
  Info,
} from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type DeviceType = 'router' | 'switch' | 'pc' | 'firewall' | 'server' | 'ap'

interface PlacedDevice {
  id: string
  type: DeviceType
  x: number
  y: number
  label: string
  ip: string
}

interface Connection {
  from: string
  to: string
}

interface ExerciseRequirement {
  devices: { type: DeviceType; min: number }[]
  connections: { from: DeviceType; to: DeviceType }[]
}

interface Exercise {
  id: string
  title: string
  titleEn: string
  description: string
  descriptionEn: string
  hint: string
  hintEn: string
  requirements: ExerciseRequirement
}

/* ------------------------------------------------------------------ */
/*  Device definitions                                                 */
/* ------------------------------------------------------------------ */

const DEVICE_DEFS: {
  type: DeviceType
  label: string
  labelEn: string
  color: string
  Icon: typeof Router
}[] = [
  { type: 'router', label: 'Routeur', labelEn: 'Router', color: '#3b82f6', Icon: Router },
  { type: 'switch', label: 'Switch', labelEn: 'Switch', color: '#22c55e', Icon: Box },
  { type: 'pc', label: 'PC', labelEn: 'PC', color: '#94a3b8', Icon: Monitor },
  { type: 'firewall', label: 'Firewall', labelEn: 'Firewall', color: '#ef4444', Icon: Shield },
  { type: 'server', label: 'Serveur', labelEn: 'Server', color: '#a855f7', Icon: Server },
  { type: 'ap', label: 'Point Acces', labelEn: 'Access Point', color: '#f97316', Icon: Wifi },
]

function getDeviceDef(type: DeviceType) {
  return DEVICE_DEFS.find((d) => d.type === type)!
}

function getDeviceLabel(type: DeviceType, lang: string) {
  const def = getDeviceDef(type)
  return lang === 'en' ? def.labelEn : def.label
}

/* ------------------------------------------------------------------ */
/*  Exercises                                                          */
/* ------------------------------------------------------------------ */

const EXERCISES: Exercise[] = [
  {
    id: 'lan-simple',
    title: 'Reseau LAN simple',
    titleEn: 'Simple LAN Network',
    description: 'Construisez un LAN avec 2 PCs connectes a 1 switch.',
    descriptionEn: 'Build a LAN with 2 PCs connected to 1 switch.',
    hint: 'Placez un switch au centre, puis connectez-y 2 PCs.',
    hintEn: 'Place a switch in the center, then connect 2 PCs to it.',
    requirements: {
      devices: [
        { type: 'pc', min: 2 },
        { type: 'switch', min: 1 },
      ],
      connections: [
        { from: 'pc', to: 'switch' },
        { from: 'pc', to: 'switch' },
      ],
    },
  },
  {
    id: 'inter-vlan',
    title: 'Routage inter-VLAN',
    titleEn: 'Inter-VLAN Routing',
    description:
      'Router-on-a-stick : 1 routeur, 2 switches (VLAN 10 et VLAN 20), et 2 PCs.',
    descriptionEn:
      'Router-on-a-stick: 1 router, 2 switches (VLAN 10 and VLAN 20), and 2 PCs.',
    hint: 'Connectez le routeur aux 2 switches, puis 1 PC par switch.',
    hintEn: 'Connect the router to both switches, then 1 PC per switch.',
    requirements: {
      devices: [
        { type: 'router', min: 1 },
        { type: 'switch', min: 2 },
        { type: 'pc', min: 2 },
      ],
      connections: [
        { from: 'router', to: 'switch' },
        { from: 'router', to: 'switch' },
        { from: 'pc', to: 'switch' },
        { from: 'pc', to: 'switch' },
      ],
    },
  },
  {
    id: 'wan-triangle',
    title: 'Topologie WAN',
    titleEn: 'WAN Topology',
    description: '3 routeurs interconnectes en triangle pour la redondance.',
    descriptionEn: '3 routers interconnected in a triangle for redundancy.',
    hint: 'Chaque routeur doit etre connecte aux 2 autres.',
    hintEn: 'Each router must be connected to the other 2.',
    requirements: {
      devices: [{ type: 'router', min: 3 }],
      connections: [
        { from: 'router', to: 'router' },
        { from: 'router', to: 'router' },
        { from: 'router', to: 'router' },
      ],
    },
  },
  {
    id: 'dmz',
    title: 'Architecture DMZ',
    titleEn: 'DMZ Architecture',
    description:
      'Firewall separant un reseau LAN interne et une DMZ avec serveur web.',
    descriptionEn:
      'Firewall separating an internal LAN network and a DMZ with a web server.',
    hint: 'Le firewall se connecte a un switch LAN (avec PC) et un switch DMZ (avec serveur).',
    hintEn: 'The firewall connects to a LAN switch (with PC) and a DMZ switch (with server).',
    requirements: {
      devices: [
        { type: 'firewall', min: 1 },
        { type: 'switch', min: 2 },
        { type: 'pc', min: 1 },
        { type: 'server', min: 1 },
      ],
      connections: [
        { from: 'firewall', to: 'switch' },
        { from: 'firewall', to: 'switch' },
        { from: 'pc', to: 'switch' },
        { from: 'server', to: 'switch' },
      ],
    },
  },
  {
    id: 'wifi-entreprise',
    title: 'Reseau WiFi entreprise',
    titleEn: 'Enterprise WiFi Network',
    description:
      'Un switch central, 1 serveur WLC (controleur WiFi), et 3 points d\'acces.',
    descriptionEn:
      'A central switch, 1 WLC server (WiFi controller), and 3 access points.',
    hint: 'Le serveur (WLC) et les 3 APs sont tous connectes au switch.',
    hintEn: 'The server (WLC) and the 3 APs are all connected to the switch.',
    requirements: {
      devices: [
        { type: 'switch', min: 1 },
        { type: 'server', min: 1 },
        { type: 'ap', min: 3 },
      ],
      connections: [
        { from: 'server', to: 'switch' },
        { from: 'ap', to: 'switch' },
        { from: 'ap', to: 'switch' },
        { from: 'ap', to: 'switch' },
      ],
    },
  },
  {
    id: 'spine-leaf',
    title: 'Spine-Leaf datacenter',
    titleEn: 'Spine-Leaf Datacenter',
    description:
      '2 switches spine et 4 switches leaf. Chaque leaf connecte a chaque spine.',
    descriptionEn:
      '2 spine switches and 4 leaf switches. Each leaf connects to each spine.',
    hint: 'Placez 2 spines en haut, 4 leafs en bas. Chaque leaf se connecte aux 2 spines (8 liens).',
    hintEn: 'Place 2 spines at the top, 4 leafs at the bottom. Each leaf connects to both spines (8 links).',
    requirements: {
      devices: [{ type: 'switch', min: 6 }],
      connections: [
        { from: 'switch', to: 'switch' },
        { from: 'switch', to: 'switch' },
        { from: 'switch', to: 'switch' },
        { from: 'switch', to: 'switch' },
        { from: 'switch', to: 'switch' },
        { from: 'switch', to: 'switch' },
        { from: 'switch', to: 'switch' },
        { from: 'switch', to: 'switch' },
      ],
    },
  },
]

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

let _idCounter = 0
function nextId() {
  _idCounter += 1
  return `dev-${Date.now()}-${_idCounter}`
}

function defaultLabel(type: DeviceType, devices: PlacedDevice[], lang: string): string {
  const label = getDeviceLabel(type, lang)
  const count = devices.filter((d) => d.type === type).length
  return `${label}-${count + 1}`
}

/* ------------------------------------------------------------------ */
/*  Validation logic                                                   */
/* ------------------------------------------------------------------ */

interface ValidationResult {
  passed: boolean
  messages: string[]
}

function validateTopology(
  devices: PlacedDevice[],
  connections: Connection[],
  exercise: Exercise,
  lang: string
): ValidationResult {
  const messages: string[] = []
  let passed = true

  // Check device counts
  for (const req of exercise.requirements.devices) {
    const count = devices.filter((d) => d.type === req.type).length
    const label = getDeviceLabel(req.type, lang)
    if (count < req.min) {
      passed = false
      messages.push(
        lang === 'en'
          ? `Need at least ${req.min} ${label}(s) — you have ${count}.`
          : `Il faut au moins ${req.min} ${label}(s) — vous en avez ${count}.`
      )
    } else {
      messages.push(`${label} : ${count}/${req.min} OK`)
    }
  }

  // Check connection counts by type-pair
  const requiredPairs: Record<string, number> = {}
  for (const req of exercise.requirements.connections) {
    const key =
      req.from <= req.to ? `${req.from}-${req.to}` : `${req.to}-${req.from}`
    requiredPairs[key] = (requiredPairs[key] || 0) + 1
  }

  const actualPairs: Record<string, number> = {}
  for (const conn of connections) {
    const dFrom = devices.find((d) => d.id === conn.from)
    const dTo = devices.find((d) => d.id === conn.to)
    if (dFrom && dTo) {
      const key =
        dFrom.type <= dTo.type
          ? `${dFrom.type}-${dTo.type}`
          : `${dTo.type}-${dFrom.type}`
      actualPairs[key] = (actualPairs[key] || 0) + 1
    }
  }

  for (const [key, needed] of Object.entries(requiredPairs)) {
    const actual = actualPairs[key] || 0
    const [a, b] = key.split('-')
    const nameA = getDeviceLabel(a as DeviceType, lang)
    const nameB = getDeviceLabel(b as DeviceType, lang)
    if (actual < needed) {
      passed = false
      messages.push(
        lang === 'en'
          ? `Connections ${nameA}<->${nameB}: ${actual}/${needed} (insufficient).`
          : `Connexions ${nameA}<->${nameB} : ${actual}/${needed} (insuffisant).`
      )
    } else {
      messages.push(
        lang === 'en'
          ? `Connections ${nameA}<->${nameB}: ${actual}/${needed} OK`
          : `Connexions ${nameA}<->${nameB} : ${actual}/${needed} OK`
      )
    }
  }

  return { passed, messages }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function NetworkDiagram() {
  const { t, lang } = useTranslation()

  /* State ------------------------------------------------------------- */
  const [selectedExercise, setSelectedExercise] = useState<string>(
    EXERCISES[0].id
  )
  const [devices, setDevices] = useState<PlacedDevice[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null)
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null)
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null)
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(
    new Set()
  )
  const [editingDeviceId, setEditingDeviceId] = useState<string | null>(null)
  const [editLabel, setEditLabel] = useState('')
  const [editIp, setEditIp] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [dragOverCanvas, setDragOverCanvas] = useState(false)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  const canvasRef = useRef<HTMLDivElement>(null)

  const exercise = useMemo(
    () => EXERCISES.find((e) => e.id === selectedExercise)!,
    [selectedExercise]
  )

  const selectedDevice = useMemo(
    () => devices.find((d) => d.id === selectedDeviceId) || null,
    [devices, selectedDeviceId]
  )

  /* Exercise switch --------------------------------------------------- */
  const switchExercise = useCallback(
    (id: string) => {
      setSelectedExercise(id)
      setDevices([])
      setConnections([])
      setSelectedDeviceId(null)
      setConnectingFrom(null)
      setValidationResult(null)
      setEditingDeviceId(null)
      setShowHint(false)
    },
    []
  )

  /* Reset ------------------------------------------------------------- */
  const resetCanvas = useCallback(() => {
    setDevices([])
    setConnections([])
    setSelectedDeviceId(null)
    setConnectingFrom(null)
    setValidationResult(null)
    setEditingDeviceId(null)
  }, [])

  /* Drag palette -> canvas -------------------------------------------- */
  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>, type: DeviceType) => {
      e.dataTransfer.setData('deviceType', type)
      e.dataTransfer.effectAllowed = 'copy'
    },
    []
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setDragOverCanvas(false)
      const type = e.dataTransfer.getData('deviceType') as DeviceType
      if (!type) return

      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      const x = e.clientX - rect.left - 30
      const y = e.clientY - rect.top - 30

      const newDevice: PlacedDevice = {
        id: nextId(),
        type,
        x: Math.max(0, Math.min(x, rect.width - 60)),
        y: Math.max(0, Math.min(y, rect.height - 60)),
        label: defaultLabel(type, devices, lang),
        ip: '',
      }

      setDevices((prev) => [...prev, newDevice])
      setSelectedDeviceId(newDevice.id)
      setValidationResult(null)
    },
    [devices, lang]
  )

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    setDragOverCanvas(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOverCanvas(false)
  }, [])

  /* Device click — select or connect ---------------------------------- */
  const handleDeviceClick = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation()

      if (connectingFrom) {
        if (connectingFrom !== id) {
          // Prevent duplicate connections
          const exists = connections.some(
            (c) =>
              (c.from === connectingFrom && c.to === id) ||
              (c.from === id && c.to === connectingFrom)
          )
          if (!exists) {
            setConnections((prev) => [
              ...prev,
              { from: connectingFrom, to: id },
            ])
            setValidationResult(null)
          }
        }
        setConnectingFrom(null)
      } else {
        setSelectedDeviceId(id)
        setEditingDeviceId(null)
      }
    },
    [connectingFrom, connections]
  )

  /* Device double-click — edit ---------------------------------------- */
  const handleDeviceDoubleClick = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation()
      const dev = devices.find((d) => d.id === id)
      if (dev) {
        setEditingDeviceId(id)
        setEditLabel(dev.label)
        setEditIp(dev.ip)
        setSelectedDeviceId(id)
      }
    },
    [devices]
  )

  /* Save edit --------------------------------------------------------- */
  const saveEdit = useCallback(() => {
    if (!editingDeviceId) return
    setDevices((prev) =>
      prev.map((d) =>
        d.id === editingDeviceId
          ? { ...d, label: editLabel || d.label, ip: editIp }
          : d
      )
    )
    setEditingDeviceId(null)
  }, [editingDeviceId, editLabel, editIp])

  /* Delete device ----------------------------------------------------- */
  const deleteDevice = useCallback(
    (id: string) => {
      setDevices((prev) => prev.filter((d) => d.id !== id))
      setConnections((prev) =>
        prev.filter((c) => c.from !== id && c.to !== id)
      )
      if (selectedDeviceId === id) setSelectedDeviceId(null)
      if (editingDeviceId === id) setEditingDeviceId(null)
      setValidationResult(null)
    },
    [selectedDeviceId, editingDeviceId]
  )

  /* Delete connection ------------------------------------------------- */
  const deleteConnection = useCallback(
    (from: string, to: string) => {
      setConnections((prev) =>
        prev.filter((c) => !(c.from === from && c.to === to))
      )
      setValidationResult(null)
    },
    []
  )

  /* Pointer-based drag for devices on canvas -------------------------- */
  const handleDevicePointerDown = useCallback(
    (id: string, e: React.PointerEvent<HTMLDivElement>) => {
      if (connectingFrom) return // don't drag in connection mode
      e.preventDefault()
      e.stopPropagation()

      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      const dev = devices.find((d) => d.id === id)
      if (!dev) return

      dragOffset.current = {
        x: e.clientX - rect.left - dev.x,
        y: e.clientY - rect.top - dev.y,
      }
      setDraggingId(id)
      setSelectedDeviceId(id)
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    },
    [connectingFrom, devices]
  )

  const handleDevicePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingId) return

      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      const x = e.clientX - rect.left - dragOffset.current.x
      const y = e.clientY - rect.top - dragOffset.current.y

      setDevices((prev) =>
        prev.map((d) =>
          d.id === draggingId
            ? {
                ...d,
                x: Math.max(0, Math.min(x, rect.width - 60)),
                y: Math.max(0, Math.min(y, rect.height - 60)),
              }
            : d
        )
      )
    },
    [draggingId]
  )

  const handleDevicePointerUp = useCallback(() => {
    setDraggingId(null)
  }, [])

  /* Validate ---------------------------------------------------------- */
  const handleValidate = useCallback(() => {
    const result = validateTopology(devices, connections, exercise, lang)
    setValidationResult(result)
    if (result.passed) {
      setCompletedExercises((prev) => new Set([...prev, exercise.id]))
    }
  }, [devices, connections, exercise, lang])

  /* Canvas click — deselect ------------------------------------------- */
  const handleCanvasClick = useCallback(() => {
    if (connectingFrom) {
      setConnectingFrom(null)
    } else {
      setSelectedDeviceId(null)
      setEditingDeviceId(null)
    }
  }, [connectingFrom])

  /* ------------------------------------------------------------------ */
  /*  Render helpers                                                     */
  /* ------------------------------------------------------------------ */

  const renderDeviceIcon = (
    type: DeviceType,
    size: number,
    color?: string
  ) => {
    const def = getDeviceDef(type)
    const c = color || def.color
    const IconComp = def.Icon
    return <IconComp size={size} color={c} />
  }

  /* ------------------------------------------------------------------ */
  /*  Render                                                             */
  /* ------------------------------------------------------------------ */

  return (
    <div style={{ paddingTop: 56 }}>
      <div
        className="nd-container"
        style={{ maxWidth: 1400, margin: '0 auto', padding: '48px 24px 80px' }}
      >
        {/* Header ---------------------------------------------------- */}
        <div style={{ marginBottom: 32 }}>
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
            {t('// schemas reseau', '// network diagrams')}
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
            {t('Schemas Reseau Interactifs', 'Interactive Network Diagrams')}
          </h1>
          <p
            style={{
              fontSize: 15,
              color: 'var(--text-secondary)',
              fontWeight: 300,
              maxWidth: 700,
            }}
          >
            {t('Glissez-deposez des equipements reseau sur le canevas, connectez-les entre eux, puis validez votre topologie.', 'Drag and drop network devices onto the canvas, connect them together, then validate your topology.')}
          </p>
        </div>

        {/* Exercise selector ----------------------------------------- */}
        <div
          className="nd-exercises"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 8,
            marginBottom: 24,
          }}
        >
          {EXERCISES.map((ex) => {
            const isActive = selectedExercise === ex.id
            const isDone = completedExercises.has(ex.id)
            return (
              <motion.button
                key={ex.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => switchExercise(ex.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: isActive
                    ? 'var(--accent)'
                    : 'var(--bg-secondary)',
                  border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                  color: isActive
                    ? 'var(--bg-primary)'
                    : 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  padding: '10px 14px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  position: 'relative',
                }}
              >
                {isDone && (
                  <Check
                    size={14}
                    style={{
                      color: isActive ? 'var(--bg-primary)' : 'var(--accent)',
                      flexShrink: 0,
                    }}
                  />
                )}
                <span style={{ flex: 1 }}>{lang === 'en' ? ex.titleEn : ex.title}</span>
                <ChevronRight
                  size={14}
                  style={{ opacity: 0.5, flexShrink: 0 }}
                />
              </motion.button>
            )
          })}
        </div>

        {/* Exercise description + actions ----------------------------- */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 12,
            marginBottom: 16,
            padding: '14px 18px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
          }}
        >
          <div style={{ flex: 1, minWidth: 200 }}>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 15,
                fontWeight: 700,
                marginBottom: 4,
              }}
            >
              {lang === 'en' ? exercise.titleEn : exercise.title}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                color: 'var(--text-secondary)',
              }}
            >
              {lang === 'en' ? exercise.descriptionEn : exercise.description}
            </div>
          </div>

          <button
            onClick={() => setShowHint(!showHint)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              padding: '6px 12px',
              cursor: 'pointer',
            }}
          >
            <Info size={14} />
            {t('Indice', 'Hint')}
          </button>

          <button
            onClick={resetCanvas}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              padding: '6px 12px',
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={14} />
            Reset
          </button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleValidate}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'var(--accent)',
              border: '1px solid var(--accent)',
              color: 'var(--bg-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              fontWeight: 600,
              padding: '8px 18px',
              cursor: 'pointer',
            }}
          >
            <Zap size={14} />
            {t('Verifier', 'Validate')}
          </motion.button>
        </div>

        {/* Hint */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                overflow: 'hidden',
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  padding: '12px 18px',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 13,
                  color: 'var(--accent)',
                }}
              >
                {t('Indice', 'Hint')} : {lang === 'en' ? exercise.hintEn : exercise.hint}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Validation result */}
        <AnimatePresence>
          {validationResult && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                marginBottom: 16,
                padding: '16px 18px',
                background: validationResult.passed
                  ? 'rgba(34,197,94,0.08)'
                  : 'rgba(239,68,68,0.08)',
                border: `1px solid ${validationResult.passed ? '#22c55e' : '#ef4444'}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 10,
                  fontFamily: 'var(--font-heading)',
                  fontSize: 15,
                  fontWeight: 700,
                  color: validationResult.passed ? '#22c55e' : '#ef4444',
                }}
              >
                {validationResult.passed ? (
                  <Check size={18} />
                ) : (
                  <X size={18} />
                )}
                {validationResult.passed
                  ? t('Topologie correcte !', 'Topology correct!')
                  : t('Topologie incomplete', 'Topology incomplete')}
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                {validationResult.messages.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 12,
                      color: msg.includes('OK')
                        ? '#22c55e'
                        : msg.includes('insuffisant') ||
                            msg.includes('faut') ||
                            msg.includes('insufficient') ||
                            msg.includes('Need at least')
                          ? '#ef4444'
                          : 'var(--text-secondary)',
                    }}
                  >
                    {msg}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Workspace -------------------------------------------------- */}
        <div
          className="nd-workspace"
          style={{
            display: 'flex',
            gap: 0,
            border: '1px solid var(--border)',
            minHeight: 520,
          }}
        >
          {/* Device palette ------------------------------------------- */}
          <div
            className="nd-palette"
            style={{
              width: 110,
              flexShrink: 0,
              background: 'var(--bg-secondary)',
              borderRight: '1px solid var(--border)',
              padding: '16px 10px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: 4,
                textAlign: 'center',
              }}
            >
              {t('Equipements', 'Devices')}
            </div>

            {DEVICE_DEFS.map((def) => (
              <div
                key={def.type}
                draggable
                onDragStart={(e) => handleDragStart(e, def.type)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  padding: '10px 6px',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border)',
                  cursor: 'grab',
                  userSelect: 'none',
                  transition: 'border-color 0.15s ease',
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.borderColor =
                    def.color)
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.borderColor =
                    'var(--border)')
                }
              >
                {renderDeviceIcon(def.type, 22)}
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    color: 'var(--text-secondary)',
                    textAlign: 'center',
                  }}
                >
                  {lang === 'en' ? def.labelEn : def.label}
                </span>
              </div>
            ))}

            {/* Mode indicator */}
            {connectingFrom && (
              <div
                style={{
                  marginTop: 'auto',
                  padding: '8px 6px',
                  background: 'rgba(59,130,246,0.12)',
                  border: '1px solid #3b82f6',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  color: '#3b82f6',
                  textAlign: 'center',
                  lineHeight: 1.4,
                }}
              >
                {t('Mode connexion : cliquez sur un 2e equipement', 'Connection mode: click on a 2nd device')}
              </div>
            )}
          </div>

          {/* Canvas --------------------------------------------------- */}
          <div
            ref={canvasRef}
            className="nd-canvas"
            onClick={handleCanvasClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            style={{
              flex: 1,
              position: 'relative',
              overflow: 'hidden',
              background: 'var(--bg-secondary)',
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
              transition: 'box-shadow 0.2s ease',
              boxShadow: dragOverCanvas
                ? 'inset 0 0 0 2px var(--accent)'
                : 'none',
              minHeight: 480,
            }}
          >
            {/* SVG connections */}
            <svg
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            >
              {connections.map((conn, idx) => {
                const dFrom = devices.find((d) => d.id === conn.from)
                const dTo = devices.find((d) => d.id === conn.to)
                if (!dFrom || !dTo) return null

                const x1 = dFrom.x + 30
                const y1 = dFrom.y + 30
                const x2 = dTo.x + 30
                const y2 = dTo.y + 30

                return (
                  <g key={idx}>
                    {/* Wider invisible line for click target */}
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="transparent"
                      strokeWidth={12}
                      style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteConnection(conn.from, conn.to)
                      }}
                    />
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="var(--text-muted)"
                      strokeWidth={2}
                      strokeDasharray="6 3"
                      opacity={0.7}
                      style={{ pointerEvents: 'none' }}
                    />
                  </g>
                )
              })}
            </svg>

            {/* Placed devices */}
            {devices.map((dev) => {
              const def = getDeviceDef(dev.type)
              const isSelected = selectedDeviceId === dev.id
              const isConnecting = connectingFrom === dev.id

              const isDragging = draggingId === dev.id

              return (
                <motion.div
                  key={dev.id}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onPointerDown={(e) => handleDevicePointerDown(dev.id, e)}
                  onPointerMove={handleDevicePointerMove}
                  onPointerUp={handleDevicePointerUp}
                  onClick={(e) => { if (!isDragging) handleDeviceClick(dev.id, e) }}
                  onDoubleClick={(e) => handleDeviceDoubleClick(dev.id, e)}
                  style={{
                    position: 'absolute',
                    left: dev.x,
                    top: dev.y,
                    width: 60,
                    height: 60,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    background: isConnecting
                      ? 'rgba(59,130,246,0.15)'
                      : isSelected
                        ? 'rgba(255,255,255,0.06)'
                        : 'rgba(255,255,255,0.02)',
                    border: `2px solid ${isConnecting ? '#3b82f6' : isSelected ? def.color : 'var(--border)'}`,
                    cursor: connectingFrom ? 'crosshair' : isDragging ? 'grabbing' : 'grab',
                    zIndex: isDragging ? 20 : isSelected ? 10 : 2,
                    userSelect: 'none',
                    touchAction: 'none',
                    transition: isDragging ? 'none' : 'border-color 0.15s ease, background 0.15s ease',
                  }}
                >
                  {renderDeviceIcon(dev.type, 20)}
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 8,
                      color: 'var(--text-secondary)',
                      maxWidth: 56,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      textAlign: 'center',
                    }}
                  >
                    {dev.label}
                  </span>
                  {dev.ip && (
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 7,
                        color: 'var(--accent)',
                        maxWidth: 56,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {dev.ip}
                    </span>
                  )}
                </motion.div>
              )
            })}

            {/* Empty state */}
            {devices.length === 0 && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  pointerEvents: 'none',
                }}
              >
                <Box size={40} style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 13,
                    color: 'var(--text-muted)',
                    textAlign: 'center',
                    lineHeight: 1.6,
                  }}
                >
                  Glissez des equipements depuis la palette de gauche
                  <br />
                  vers cette zone pour commencer.
                </div>
              </div>
            )}
          </div>

          {/* Properties panel ----------------------------------------- */}
          <div
            className="nd-properties"
            style={{
              width: 220,
              flexShrink: 0,
              background: 'var(--bg-secondary)',
              borderLeft: '1px solid var(--border)',
              padding: '16px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: 4,
              }}
            >
              Proprietes
            </div>

            {selectedDevice ? (
              <>
                {/* Device icon + type */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {renderDeviceIcon(selectedDevice.type, 22)}
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 14,
                        fontWeight: 700,
                      }}
                    >
                      {selectedDevice.label}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                      }}
                    >
                      {getDeviceDef(selectedDevice.type).label}
                    </div>
                  </div>
                </div>

                {/* Edit form */}
                {editingDeviceId === selectedDevice.id ? (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}
                  >
                    <label
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                      }}
                    >
                      Nom
                    </label>
                    <input
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                      style={{
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 12,
                        padding: '8px 10px',
                        outline: 'none',
                        width: '100%',
                        boxSizing: 'border-box',
                      }}
                    />

                    <label
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                      }}
                    >
                      Adresse IP
                    </label>
                    <input
                      value={editIp}
                      onChange={(e) => setEditIp(e.target.value)}
                      placeholder="192.168.1.1"
                      style={{
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 12,
                        padding: '8px 10px',
                        outline: 'none',
                        width: '100%',
                        boxSizing: 'border-box',
                      }}
                    />

                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={saveEdit}
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 4,
                          background: 'var(--accent)',
                          border: '1px solid var(--accent)',
                          color: 'var(--bg-primary)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: 11,
                          padding: '6px 10px',
                          cursor: 'pointer',
                        }}
                      >
                        <Check size={12} /> OK
                      </button>
                      <button
                        onClick={() => setEditingDeviceId(null)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 4,
                          background: 'transparent',
                          border: '1px solid var(--border)',
                          color: 'var(--text-secondary)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: 11,
                          padding: '6px 10px',
                          cursor: 'pointer',
                        }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      IP :{' '}
                      <span style={{ color: 'var(--accent)' }}>
                        {selectedDevice.ip || '—'}
                      </span>
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      Position : ({Math.round(selectedDevice.x)},{' '}
                      {Math.round(selectedDevice.y)})
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      Connexions :{' '}
                      {
                        connections.filter(
                          (c) =>
                            c.from === selectedDevice.id ||
                            c.to === selectedDevice.id
                        ).length
                      }
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    marginTop: 4,
                  }}
                >
                  {editingDeviceId !== selectedDevice.id && (
                    <button
                      onClick={() => {
                        setEditingDeviceId(selectedDevice.id)
                        setEditLabel(selectedDevice.label)
                        setEditIp(selectedDevice.ip)
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-secondary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        padding: '7px 10px',
                        cursor: 'pointer',
                        width: '100%',
                      }}
                    >
                      Modifier
                    </button>
                  )}

                  <button
                    onClick={() =>
                      setConnectingFrom(
                        connectingFrom === selectedDevice.id
                          ? null
                          : selectedDevice.id
                      )
                    }
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      background:
                        connectingFrom === selectedDevice.id
                          ? 'rgba(59,130,246,0.15)'
                          : 'var(--bg-tertiary)',
                      border: `1px solid ${connectingFrom === selectedDevice.id ? '#3b82f6' : 'var(--border)'}`,
                      color:
                        connectingFrom === selectedDevice.id
                          ? '#3b82f6'
                          : 'var(--text-secondary)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      padding: '7px 10px',
                      cursor: 'pointer',
                      width: '100%',
                    }}
                  >
                    {connectingFrom === selectedDevice.id
                      ? 'Annuler connexion'
                      : 'Connecter a...'}
                  </button>

                  <button
                    onClick={() => deleteDevice(selectedDevice.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      background: 'rgba(239,68,68,0.08)',
                      border: '1px solid rgba(239,68,68,0.3)',
                      color: '#ef4444',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      padding: '7px 10px',
                      cursor: 'pointer',
                      width: '100%',
                    }}
                  >
                    <Trash2 size={12} /> Supprimer
                  </button>
                </div>

                {/* Connections list */}
                {connections.filter(
                  (c) =>
                    c.from === selectedDevice.id || c.to === selectedDevice.id
                ).length > 0 && (
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        marginBottom: 6,
                      }}
                    >
                      Liens
                    </div>
                    {connections
                      .filter(
                        (c) =>
                          c.from === selectedDevice.id ||
                          c.to === selectedDevice.id
                      )
                      .map((conn, i) => {
                        const otherId =
                          conn.from === selectedDevice.id
                            ? conn.to
                            : conn.from
                        const other = devices.find((d) => d.id === otherId)
                        if (!other) return null
                        return (
                          <div
                            key={i}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '5px 8px',
                              background: 'var(--bg-tertiary)',
                              border: '1px solid var(--border)',
                              marginBottom: 4,
                            }}
                          >
                            <span
                              style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: 10,
                                color: 'var(--text-secondary)',
                              }}
                            >
                              {other.label}
                            </span>
                            <button
                              onClick={() =>
                                deleteConnection(conn.from, conn.to)
                              }
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#ef4444',
                                cursor: 'pointer',
                                padding: 2,
                                display: 'flex',
                              }}
                            >
                              <X size={10} />
                            </button>
                          </div>
                        )
                      })}
                  </div>
                )}
              </>
            ) : (
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  color: 'var(--text-muted)',
                  textAlign: 'center',
                }}
              >
                <Monitor size={28} style={{ opacity: 0.3 }} />
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    lineHeight: 1.5,
                  }}
                >
                  Selectionnez un equipement pour voir ses proprietes.
                  <br />
                  <br />
                  Double-cliquez pour editer.
                </span>
              </div>
            )}

            {/* Score summary */}
            <div
              style={{
                marginTop: 'auto',
                padding: '12px 10px',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: 8,
                }}
              >
                Progression
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 22,
                  fontWeight: 700,
                  color: 'var(--accent)',
                }}
              >
                {completedExercises.size}/{EXERCISES.length}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: 'var(--text-secondary)',
                  marginTop: 4,
                }}
              >
                exercices completes
              </div>

              {/* Mini progress bar */}
              <div
                style={{
                  marginTop: 10,
                  height: 4,
                  background: 'var(--border)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  animate={{
                    width: `${(completedExercises.size / EXERCISES.length) * 100}%`,
                  }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    background: 'var(--accent)',
                  }}
                />
              </div>

              {/* Per-exercise checkmarks */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 4,
                  marginTop: 10,
                }}
              >
                {EXERCISES.map((ex) => (
                  <div
                    key={ex.id}
                    title={ex.title}
                    style={{
                      width: 18,
                      height: 18,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: completedExercises.has(ex.id)
                        ? 'var(--accent)'
                        : 'var(--bg-secondary)',
                      border: `1px solid ${completedExercises.has(ex.id) ? 'var(--accent)' : 'var(--border)'}`,
                    }}
                  >
                    {completedExercises.has(ex.id) && (
                      <Check
                        size={10}
                        style={{ color: 'var(--bg-primary)' }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Instructions footer --------------------------------------- */}
        <div
          style={{
            marginTop: 16,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 24,
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--text-muted)',
          }}
        >
          <span>{t('Glisser depuis la palette : placer', 'Drag from palette: place')}</span>
          <span>{t('Glisser sur le canevas : deplacer', 'Drag on canvas: move')}</span>
          <span>{t('Clic : selectionner', 'Click: select')}</span>
          <span>{t('Double-clic : editer nom/IP', 'Double-click: edit name/IP')}</span>
          <span>{t('"Connecter a..." : creer un lien', '"Connect to...": create a link')}</span>
          <span>{t('Clic sur un lien : supprimer', 'Click on a link: delete')}</span>
        </div>
      </div>

      {/* Responsive styles ------------------------------------------- */}
      <style>{`
        @media (max-width: 900px) {
          .nd-workspace {
            flex-direction: column !important;
            min-height: auto !important;
          }
          .nd-palette {
            width: 100% !important;
            flex-direction: row !important;
            flex-wrap: wrap !important;
            border-right: none !important;
            border-bottom: 1px solid var(--border) !important;
            padding: 10px !important;
            justify-content: center;
          }
          .nd-palette > div:first-child {
            width: 100%;
          }
          .nd-canvas {
            min-height: 400px !important;
          }
          .nd-properties {
            width: 100% !important;
            border-left: none !important;
            border-top: 1px solid var(--border) !important;
            flex-direction: row !important;
            flex-wrap: wrap !important;
          }
        }
        @media (max-width: 600px) {
          .nd-exercises {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
