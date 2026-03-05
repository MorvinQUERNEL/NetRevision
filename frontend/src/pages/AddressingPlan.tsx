import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Network, Plus, Trash2, Play, RotateCcw, Download, AlertTriangle, ChevronDown, Info } from 'lucide-react'
import jsPDF from 'jspdf'
import { useLangStore } from '../stores/langStore'

// ─── Types ───────────────────────────────────────────────────────────────────

interface SubnetRequirement {
  id: number
  name: string
  hosts: number
}

interface SubnetResult {
  name: string
  network: string
  mask: string
  cidr: number
  firstHost: string
  lastHost: string
  broadcast: string
  usableHosts: number
  requestedHosts: number
  networkNum: number
  size: number
  color: string
}

interface VLSMPlan {
  results: SubnetResult[]
  totalSpace: number
  usedAddresses: number
  wastedAddresses: number
  efficiency: number
  baseNetwork: string
  baseCidr: number
}

// ─── Color Palette ───────────────────────────────────────────────────────────

const SEGMENT_COLORS = [
  '#00e5a0', '#6366f1', '#f59e0b', '#e11d48', '#3b82f6',
  '#8b5cf6', '#10b981', '#ec4899', '#06b6d4', '#84cc16',
]

// ─── Helper Functions ────────────────────────────────────────────────────────

function ipToNumber(ip: string): number {
  const parts = ip.split('.').map(Number)
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0
}

function numberToIp(num: number): string {
  return [(num >>> 24) & 255, (num >>> 16) & 255, (num >>> 8) & 255, num & 255].join('.')
}

function isValidIp(ip: string): boolean {
  const parts = ip.split('.')
  if (parts.length !== 4) return false
  return parts.every(p => {
    const n = Number(p)
    return !isNaN(n) && n >= 0 && n <= 255 && p === String(n)
  })
}

function calculateSubnetDetails(networkNum: number, cidr: number) {
  const maskNum = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0
  const wildcardNum = (~maskNum) >>> 0
  const broadcastNum = (networkNum | wildcardNum) >>> 0
  const totalHosts = Math.pow(2, 32 - cidr)
  const usableHosts = cidr >= 31 ? (cidr === 32 ? 1 : 2) : totalHosts - 2

  return {
    network: numberToIp(networkNum),
    mask: numberToIp(maskNum),
    firstHost: cidr >= 31 ? numberToIp(networkNum) : numberToIp(networkNum + 1),
    lastHost: cidr >= 31 ? numberToIp(broadcastNum) : numberToIp(broadcastNum - 1),
    broadcast: numberToIp(broadcastNum),
    usableHosts,
    totalHosts,
  }
}

function hostsToMinCidr(hosts: number): number {
  const needed = hosts + 2
  for (let cidr = 30; cidr >= 0; cidr--) {
    if (Math.pow(2, 32 - cidr) >= needed) return cidr
  }
  return 0
}

function generateVLSMPlan(
  baseNetwork: string,
  baseCidr: number,
  requirements: SubnetRequirement[],
  t: (fr: string, en: string) => string
): { plan: VLSMPlan | null; error: string | null } {
  // Validate IP
  if (!isValidIp(baseNetwork)) {
    return { plan: null, error: t('Adresse IP invalide. Format attendu : X.X.X.X (ex: 192.168.1.0)', 'Invalid IP address. Expected format: X.X.X.X (e.g. 192.168.1.0)') }
  }

  // Validate requirements
  if (requirements.length === 0) {
    return { plan: null, error: t('Ajoutez au moins un sous-reseau.', 'Add at least one subnet.') }
  }

  const invalidHosts = requirements.find(r => r.hosts <= 0)
  if (invalidHosts) {
    return { plan: null, error: t(`Le sous-reseau "${invalidHosts.name}" a un nombre d\'hotes invalide (${invalidHosts.hosts}).`, `Subnet "${invalidHosts.name}" has an invalid host count (${invalidHosts.hosts}).`) }
  }

  const names = requirements.map(r => r.name.trim().toLowerCase())
  const duplicates = names.filter((n, i) => names.indexOf(n) !== i)
  if (duplicates.length > 0) {
    return { plan: null, error: t(`Nom de sous-reseau en double : "${duplicates[0]}". Chaque sous-reseau doit avoir un nom unique.`, `Duplicate subnet name: "${duplicates[0]}". Each subnet must have a unique name.`) }
  }

  const emptyNames = requirements.find(r => r.name.trim() === '')
  if (emptyNames) {
    return { plan: null, error: t('Tous les sous-reseaux doivent avoir un nom.', 'All subnets must have a name.') }
  }

  // Align base network to CIDR boundary
  const baseMask = baseCidr === 0 ? 0 : (~0 << (32 - baseCidr)) >>> 0
  const baseNum = (ipToNumber(baseNetwork) & baseMask) >>> 0
  const totalSpace = Math.pow(2, 32 - baseCidr)

  // Sort by hosts descending (VLSM algorithm)
  const sorted = [...requirements].sort((a, b) => b.hosts - a.hosts)

  // Calculate total needed addresses
  let totalNeeded = 0
  for (const req of sorted) {
    const cidr = hostsToMinCidr(req.hosts)
    totalNeeded += Math.pow(2, 32 - cidr)
  }

  if (totalNeeded > totalSpace) {
    return {
      plan: null,
      error: t(`Espace insuffisant. Requis : ${totalNeeded.toLocaleString()} adresses, disponibles : ${totalSpace.toLocaleString()} adresses (/${baseCidr}).`, `Insufficient space. Required: ${totalNeeded.toLocaleString()} addresses, available: ${totalSpace.toLocaleString()} addresses (/${baseCidr}).`),
    }
  }

  // Assign subnets sequentially
  const results: SubnetResult[] = []
  let currentAddress = baseNum
  let usedAddresses = 0

  for (let i = 0; i < sorted.length; i++) {
    const req = sorted[i]
    const cidr = hostsToMinCidr(req.hosts)
    const subnetSize = Math.pow(2, 32 - cidr)

    // Align current address to subnet boundary
    const remainder = currentAddress % subnetSize
    if (remainder !== 0) {
      currentAddress = currentAddress + (subnetSize - remainder)
    }

    // Check if we exceed address space
    if ((currentAddress + subnetSize) > (baseNum + totalSpace)) {
      return {
        plan: null,
        error: t(`Espace insuffisant pour le sous-reseau "${req.name}" apres alignement des adresses.`, `Insufficient space for subnet "${req.name}" after address alignment.`),
      }
    }

    const details = calculateSubnetDetails(currentAddress, cidr)
    const colorIndex = requirements.findIndex(r => r.id === req.id)

    results.push({
      name: req.name,
      network: details.network,
      mask: details.mask,
      cidr,
      firstHost: details.firstHost,
      lastHost: details.lastHost,
      broadcast: details.broadcast,
      usableHosts: details.usableHosts,
      requestedHosts: req.hosts,
      networkNum: currentAddress,
      size: subnetSize,
      color: SEGMENT_COLORS[colorIndex % SEGMENT_COLORS.length],
    })

    currentAddress += subnetSize
    usedAddresses += subnetSize
  }

  const wastedAddresses = totalSpace - usedAddresses
  const efficiency = Math.round((usedAddresses / totalSpace) * 100)

  return {
    plan: {
      results: results.sort((a, b) => a.networkNum - b.networkNum),
      totalSpace,
      usedAddresses,
      wastedAddresses,
      efficiency,
      baseNetwork: numberToIp(baseNum),
      baseCidr,
    },
    error: null,
  }
}

// ─── Presets ─────────────────────────────────────────────────────────────────

const PRESETS_FR = [
  {
    label: 'Petite entreprise',
    network: '192.168.1.0',
    cidr: 24,
    subnets: [
      { name: 'LAN Serveurs', hosts: 50 },
      { name: 'LAN Employes', hosts: 100 },
      { name: 'WiFi Invites', hosts: 30 },
    ],
  },
  {
    label: 'Campus',
    network: '10.0.0.0',
    cidr: 16,
    subnets: [
      { name: 'Administration', hosts: 200 },
      { name: 'Etudiants', hosts: 500 },
      { name: 'Serveurs', hosts: 50 },
      { name: 'WiFi Campus', hosts: 150 },
      { name: 'VoIP', hosts: 100 },
      { name: 'Gestion', hosts: 20 },
    ],
  },
  {
    label: 'Datacenter',
    network: '172.16.0.0',
    cidr: 16,
    subnets: [
      { name: 'Production', hosts: 1000 },
      { name: 'Staging', hosts: 200 },
      { name: 'Management', hosts: 50 },
      { name: 'DMZ', hosts: 100 },
    ],
  },
]

const PRESETS_EN = [
  {
    label: 'Small Business',
    network: '192.168.1.0',
    cidr: 24,
    subnets: [
      { name: 'Server LAN', hosts: 50 },
      { name: 'Employee LAN', hosts: 100 },
      { name: 'Guest WiFi', hosts: 30 },
    ],
  },
  {
    label: 'Campus',
    network: '10.0.0.0',
    cidr: 16,
    subnets: [
      { name: 'Administration', hosts: 200 },
      { name: 'Students', hosts: 500 },
      { name: 'Servers', hosts: 50 },
      { name: 'Campus WiFi', hosts: 150 },
      { name: 'VoIP', hosts: 100 },
      { name: 'Management', hosts: 20 },
    ],
  },
  {
    label: 'Datacenter',
    network: '172.16.0.0',
    cidr: 16,
    subnets: [
      { name: 'Production', hosts: 1000 },
      { name: 'Staging', hosts: 200 },
      { name: 'Management', hosts: 50 },
      { name: 'DMZ', hosts: 100 },
    ],
  },
]

// ─── PDF Export ──────────────────────────────────────────────────────────────

function exportPDF(plan: VLSMPlan) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()

  // Title bar
  doc.setFillColor(0, 229, 160)
  doc.rect(0, 0, pageWidth, 5, 'F')

  // Title
  doc.setFontSize(11)
  doc.setTextColor(0, 229, 160)
  doc.text('NetRevision', 14, 16)

  doc.setFontSize(18)
  doc.setTextColor(40, 40, 40)
  doc.text('Plan d\'adressage VLSM', 14, 26)

  doc.setFontSize(10)
  doc.setTextColor(120, 120, 120)
  doc.text(`Reseau de base : ${plan.baseNetwork}/${plan.baseCidr}`, 14, 34)
  doc.text(`Efficacite : ${plan.efficiency}%  |  Espace utilise : ${plan.usedAddresses.toLocaleString()} / ${plan.totalSpace.toLocaleString()} adresses`, 14, 40)
  doc.text(`Genere le ${new Date().toLocaleDateString('fr-FR')}`, 14, 46)

  // Table header
  const headers = ['Nom', 'Reseau', 'Masque', 'CIDR', '1er hote', 'Dernier hote', 'Broadcast', 'Utilisables', 'Demandes']
  const colWidths = [35, 30, 30, 16, 30, 30, 30, 24, 22]
  let startX = 14
  let y = 56

  doc.setFillColor(8, 11, 26)
  doc.rect(startX, y - 5, colWidths.reduce((a, b) => a + b, 0), 8, 'F')
  doc.setFontSize(8)
  doc.setTextColor(0, 229, 160)

  let x = startX
  headers.forEach((h, i) => {
    doc.text(h, x + 2, y)
    x += colWidths[i]
  })

  y += 6
  doc.setTextColor(40, 40, 40)
  doc.setFontSize(8)

  plan.results.forEach((r, idx) => {
    if (y > 185) {
      doc.addPage()
      y = 20
    }

    const bgColor = idx % 2 === 0 ? 245 : 255
    doc.setFillColor(bgColor, bgColor, bgColor)
    doc.rect(startX, y - 4, colWidths.reduce((a, b) => a + b, 0), 7, 'F')

    // Colored left indicator
    const hex = r.color
    const cr = parseInt(hex.slice(1, 3), 16)
    const cg = parseInt(hex.slice(3, 5), 16)
    const cb = parseInt(hex.slice(5, 7), 16)
    doc.setFillColor(cr, cg, cb)
    doc.rect(startX, y - 4, 2, 7, 'F')

    doc.setTextColor(40, 40, 40)
    const row = [r.name, r.network, r.mask, `/${r.cidr}`, r.firstHost, r.lastHost, r.broadcast, String(r.usableHosts), String(r.requestedHosts)]
    x = startX
    row.forEach((cell, i) => {
      doc.text(cell, x + 3, y)
      x += colWidths[i]
    })
    y += 7
  })

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight()
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.text('Genere par NetRevision — netrevision.fr', pageWidth / 2, pageHeight - 8, { align: 'center' })

  doc.save(`plan-adressage-vlsm-${plan.baseNetwork.replace(/\./g, '-')}.pdf`)
}

// ─── Component ───────────────────────────────────────────────────────────────

let nextId = 1

export default function AddressingPlan() {
  const lang = useLangStore((s) => s.lang)
  const t = (fr: string, en: string) => lang === 'en' ? en : fr
  const PRESETS = lang === 'en' ? PRESETS_EN : PRESETS_FR
  const [baseNetwork, setBaseNetwork] = useState('192.168.1.0')
  const [baseCidr, setBaseCidr] = useState(24)
  const [requirements, setRequirements] = useState<SubnetRequirement[]>([
    { id: nextId++, name: 'LAN Serveurs', hosts: 50 },
    { id: nextId++, name: 'LAN Employes', hosts: 100 },
  ])
  const [plan, setPlan] = useState<VLSMPlan | null>(null)
  const [error, setError] = useState('')
  const [showHelp, setShowHelp] = useState(false)

  const cidrOptions = useMemo(() => {
    const opts: number[] = []
    for (let i = 8; i <= 30; i++) opts.push(i)
    return opts
  }, [])

  const addSubnet = () => {
    setRequirements(prev => [...prev, { id: nextId++, name: '', hosts: 10 }])
  }

  const removeSubnet = (id: number) => {
    setRequirements(prev => prev.filter(r => r.id !== id))
  }

  const updateSubnet = (id: number, field: 'name' | 'hosts', value: string | number) => {
    setRequirements(prev =>
      prev.map(r => r.id === id ? { ...r, [field]: value } : r)
    )
  }

  const applyPreset = (presetIndex: number) => {
    const preset = PRESETS[presetIndex]
    setBaseNetwork(preset.network)
    setBaseCidr(preset.cidr)
    setRequirements(preset.subnets.map(s => ({ id: nextId++, name: s.name, hosts: s.hosts })))
    setPlan(null)
    setError('')
  }

  const handleGenerate = () => {
    setError('')
    const { plan: result, error: err } = generateVLSMPlan(baseNetwork, baseCidr, requirements, t)
    if (err) {
      setError(err)
      setPlan(null)
    } else {
      setPlan(result)
    }
  }

  const handleReset = () => {
    setBaseNetwork('192.168.1.0')
    setBaseCidr(24)
    setRequirements([
      { id: nextId++, name: 'LAN Serveurs', hosts: 50 },
      { id: nextId++, name: 'LAN Employes', hosts: 100 },
    ])
    setPlan(null)
    setError('')
  }

  const efficiencyColor = (eff: number) => {
    if (eff >= 80) return 'var(--success)'
    if (eff >= 50) return '#f59e0b'
    return 'var(--error)'
  }

  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px' }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>

          {/* ── Header ─────────────────────────────────────────────── */}
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)',
            textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12,
          }}>{t("// plan d'adressage", '// addressing plan')}</div>
          <h1 style={{
            fontFamily: 'var(--font-heading)', fontSize: 32, fontWeight: 700,
            marginBottom: 8, letterSpacing: '-1px',
          }}>{t('Generateur VLSM', 'VLSM Generator')}</h1>
          <p style={{
            fontSize: 15, color: 'var(--text-secondary)', marginBottom: 32,
            fontWeight: 300, maxWidth: 700, lineHeight: 1.6,
          }}>
            {t("Creez un plan d'adressage IP optimise avec le Variable Length Subnet Masking. Definissez vos besoins, le generateur alloue les sous-reseaux en minimisant le gaspillage d'adresses.", 'Create an optimized IP addressing plan with Variable Length Subnet Masking. Define your needs, the generator allocates subnets while minimizing address waste.')}
          </p>

          {/* ── Info Banner ────────────────────────────────────────── */}
          <motion.div
            style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              padding: '14px 20px', marginBottom: 24, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 12,
            }}
            onClick={() => setShowHelp(!showHelp)}
            whileTap={{ scale: 0.995 }}
          >
            <Info size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
            <span style={{
              fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'var(--font-body)',
              flex: 1,
            }}>
              {t("Qu'est-ce que le VLSM ? Cliquez pour en savoir plus.", 'What is VLSM? Click to learn more.')}
            </span>
            <ChevronDown size={14} style={{
              color: 'var(--text-muted)',
              transform: showHelp ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }} />
          </motion.div>

          <AnimatePresence>
            {showHelp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden', marginBottom: 24 }}
              >
                <div style={{
                  background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                  borderTop: 'none', padding: 20,
                }}>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 12 }}>
                    <strong style={{ color: 'var(--accent)' }}>VLSM (Variable Length Subnet Masking)</strong> {t("permet d'attribuer des masques de sous-reseaux de tailles differentes au sein d'un meme reseau principal. Contrairement au subnetting classique (FLSM) ou chaque sous-reseau a la meme taille, VLSM optimise l'utilisation de l'espace d'adressage en adaptant chaque sous-reseau au nombre exact d'hotes requis.", 'allows assigning subnet masks of different sizes within the same main network. Unlike classic subnetting (FLSM) where each subnet has the same size, VLSM optimizes address space usage by adapting each subnet to the exact number of required hosts.')}
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 0 }}>
                    <strong style={{ color: 'var(--text-primary)' }}>{t('Algorithme :', 'Algorithm:')}</strong> {t("Les sous-reseaux sont tries du plus grand au plus petit, puis alloues sequentiellement. Pour chaque besoin, on calcule le plus petit prefixe CIDR capable d'accueillir le nombre d'hotes + 2 (adresses reseau et broadcast).", 'Subnets are sorted from largest to smallest, then allocated sequentially. For each requirement, we calculate the smallest CIDR prefix that can accommodate the number of hosts + 2 (network and broadcast addresses).')}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Presets ─────────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)',
              textTransform: 'uppercase', letterSpacing: '1px', alignSelf: 'center', marginRight: 4,
            }}>{t('Presets :', 'Presets:')}</span>
            {PRESETS.map((p, i) => (
              <motion.button
                key={p.label}
                onClick={() => applyPreset(i)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: '6px 14px', background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)', color: 'var(--text-secondary)',
                  fontSize: 12, fontFamily: 'var(--font-mono)', cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >{p.label}</motion.button>
            ))}
          </div>

          {/* ── Input Section ──────────────────────────────────────── */}
          <div style={{
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            padding: 24, marginBottom: 2,
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)',
              textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16,
            }}>{t('Reseau de base', 'Base network')}</div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <label style={{
                  display: 'block', fontSize: 11, fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)', textTransform: 'uppercase',
                  letterSpacing: '1px', marginBottom: 6,
                }}>{t('Adresse reseau', 'Network address')}</label>
                <input
                  value={baseNetwork}
                  onChange={e => { setBaseNetwork(e.target.value); setPlan(null) }}
                  placeholder="192.168.1.0"
                  style={{
                    width: '100%', padding: '10px 14px', background: 'var(--bg-primary)',
                    border: '1px solid var(--border)', color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)', fontSize: 16, outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div style={{ width: 120 }}>
                <label style={{
                  display: 'block', fontSize: 11, fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)', textTransform: 'uppercase',
                  letterSpacing: '1px', marginBottom: 6,
                }}>{t('Prefixe CIDR', 'CIDR prefix')}</label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={baseCidr}
                    onChange={e => { setBaseCidr(Number(e.target.value)); setPlan(null) }}
                    style={{
                      width: '100%', padding: '10px 14px', background: 'var(--bg-primary)',
                      border: '1px solid var(--border)', color: 'var(--text-primary)',
                      fontFamily: 'var(--font-mono)', fontSize: 16, outline: 'none',
                      appearance: 'none', cursor: 'pointer',
                    }}
                  >
                    {cidrOptions.map(c => (
                      <option key={c} value={c}>/{c}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    color: 'var(--text-muted)', pointerEvents: 'none',
                  }} />
                </div>
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)',
                padding: '10px 0', whiteSpace: 'nowrap',
              }}>
                = {Math.pow(2, 32 - baseCidr).toLocaleString()} {t('adresses', 'addresses')}
              </div>
            </div>
          </div>

          {/* ── Subnet Requirements ────────────────────────────────── */}
          <div style={{
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            borderTop: 'none', padding: 24, marginBottom: 24,
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)',
              textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span>{t('Sous-reseaux requis', 'Required subnets')} ({requirements.length})</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              <AnimatePresence>
                {requirements.map((req, idx) => (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      display: 'flex', gap: 10, alignItems: 'center',
                      padding: '10px 12px', background: 'var(--bg-primary)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div style={{
                      width: 4, height: 32, flexShrink: 0,
                      background: SEGMENT_COLORS[idx % SEGMENT_COLORS.length],
                    }} />
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)',
                      width: 20, textAlign: 'center', flexShrink: 0,
                    }}>
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <input
                      value={req.name}
                      onChange={e => updateSubnet(req.id, 'name', e.target.value)}
                      placeholder={t('Nom du sous-reseau', 'Subnet name')}
                      style={{
                        flex: 1, minWidth: 150, padding: '8px 12px',
                        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                        color: 'var(--text-primary)', fontFamily: 'var(--font-body)',
                        fontSize: 14, outline: 'none',
                      }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <label style={{
                        fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)',
                        whiteSpace: 'nowrap',
                      }}>{t('Hotes :', 'Hosts:')}</label>
                      <input
                        type="number"
                        value={req.hosts}
                        onChange={e => updateSubnet(req.id, 'hosts', Math.max(1, Number(e.target.value)))}
                        min={1}
                        style={{
                          width: 80, padding: '8px 10px',
                          background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                          color: 'var(--text-primary)', fontFamily: 'var(--font-mono)',
                          fontSize: 14, outline: 'none', textAlign: 'right',
                        }}
                      />
                    </div>
                    <motion.button
                      onClick={() => removeSubnet(req.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      disabled={requirements.length <= 1}
                      style={{
                        padding: 6, background: 'transparent', border: 'none',
                        color: requirements.length <= 1 ? 'var(--text-muted)' : 'var(--error)',
                        cursor: requirements.length <= 1 ? 'not-allowed' : 'pointer',
                        opacity: requirements.length <= 1 ? 0.3 : 1,
                        display: 'flex', alignItems: 'center',
                      }}
                    >
                      <Trash2 size={14} />
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <motion.button
              onClick={addSubnet}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              style={{
                width: '100%', padding: '10px 16px', background: 'var(--bg-primary)',
                border: '1px dashed var(--border)', color: 'var(--text-secondary)',
                fontSize: 13, fontFamily: 'var(--font-body)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              <Plus size={14} /> {t('Ajouter un sous-reseau', 'Add a subnet')}
            </motion.button>
          </div>

          {/* ── Action Buttons ─────────────────────────────────────── */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 32 }}>
            <motion.button
              onClick={handleGenerate}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: '12px 28px', background: 'var(--accent)', color: 'var(--bg-primary)',
                fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center',
                gap: 8, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)',
                boxShadow: '0 0 20px var(--accent-glow)',
              }}
            >
              <Play size={16} /> {t('Generer le plan', 'Generate plan')}
            </motion.button>
            <motion.button
              onClick={handleReset}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: '12px 18px', background: 'var(--bg-tertiary)',
                border: '1px solid var(--border)', color: 'var(--text-secondary)',
                display: 'flex', alignItems: 'center', gap: 8, fontSize: 13,
                cursor: 'pointer', fontFamily: 'var(--font-body)',
              }}
            >
              <RotateCcw size={14} /> {t('Reinitialiser', 'Reset')}
            </motion.button>
          </div>

          {/* ── Error Display ──────────────────────────────────────── */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                style={{
                  background: 'rgba(239, 68, 68, 0.08)', border: '1px solid var(--error)',
                  padding: '14px 20px', marginBottom: 24,
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                }}
              >
                <AlertTriangle size={16} style={{ color: 'var(--error)', flexShrink: 0, marginTop: 1 }} />
                <span style={{
                  fontSize: 13, color: 'var(--error)', fontFamily: 'var(--font-body)',
                  lineHeight: 1.5,
                }}>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Results ────────────────────────────────────────────── */}
          <AnimatePresence>
            {plan && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* ── Summary Bar ─────────────────────────────────── */}
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2,
                  marginBottom: 2,
                }}>
                  {[
                    {
                      label: t('Espace total', 'Total space'),
                      value: plan.totalSpace.toLocaleString(),
                      sub: `/${plan.baseCidr}`,
                      color: 'var(--accent)',
                    },
                    {
                      label: t('Adresses utilisees', 'Used addresses'),
                      value: plan.usedAddresses.toLocaleString(),
                      sub: `${plan.results.length} ${t('sous-reseaux', 'subnets')}`,
                      color: 'var(--text-primary)',
                    },
                    {
                      label: t('Adresses libres', 'Free addresses'),
                      value: plan.wastedAddresses.toLocaleString(),
                      sub: t('non allouees', 'unallocated'),
                      color: 'var(--text-muted)',
                    },
                    {
                      label: t('Efficacite', 'Efficiency'),
                      value: `${plan.efficiency}%`,
                      sub: plan.efficiency >= 80 ? t('Excellent', 'Excellent') : plan.efficiency >= 50 ? t('Correct', 'Fair') : t('Faible', 'Low'),
                      color: efficiencyColor(plan.efficiency),
                    },
                  ].map(item => (
                    <div key={item.label} style={{
                      background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                      padding: '16px 18px',
                    }}>
                      <div style={{
                        fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)',
                        textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6,
                      }}>{item.label}</div>
                      <div style={{
                        fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700,
                        color: item.color, marginBottom: 2,
                      }}>{item.value}</div>
                      <div style={{
                        fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)',
                      }}>{item.sub}</div>
                    </div>
                  ))}
                </div>

                {/* ── Visual Address Space Bar ────────────────────── */}
                <div style={{
                  background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                  padding: 20, marginBottom: 2,
                }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)',
                    textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 14,
                  }}>{t("Carte de l'espace d'adressage", 'Address space map')}</div>

                  {/* Bar */}
                  <div style={{
                    width: '100%', height: 40, background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border)', display: 'flex', overflow: 'hidden',
                    position: 'relative',
                  }}>
                    {plan.results.map((r, i) => {
                      const widthPercent = (r.size / plan.totalSpace) * 100
                      return (
                        <motion.div
                          key={i}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: i * 0.08, duration: 0.3 }}
                          style={{
                            width: `${widthPercent}%`, height: '100%',
                            background: r.color, position: 'relative',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            overflow: 'hidden', transformOrigin: 'left',
                            borderRight: '1px solid var(--bg-secondary)',
                          }}
                          title={`${r.name} — ${r.network}/${r.cidr} (${r.size} ${t('adresses', 'addresses')})`}
                        >
                          {widthPercent > 6 && (
                            <span style={{
                              fontSize: 9, fontFamily: 'var(--font-mono)', color: '#000',
                              fontWeight: 700, textOverflow: 'ellipsis', overflow: 'hidden',
                              whiteSpace: 'nowrap', padding: '0 4px', opacity: 0.8,
                            }}>
                              {r.name}
                            </span>
                          )}
                        </motion.div>
                      )
                    })}
                    {plan.wastedAddresses > 0 && (
                      <div style={{
                        flex: 1, height: '100%',
                        background: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.03) 4px, rgba(255,255,255,0.03) 8px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {(plan.wastedAddresses / plan.totalSpace) * 100 > 8 && (
                          <span style={{
                            fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)',
                          }}>{t('libre', 'free')}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Legend */}
                  <div style={{
                    display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 12,
                  }}>
                    {plan.results.map((r, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                      }}>
                        <div style={{
                          width: 10, height: 10, background: r.color, flexShrink: 0,
                        }} />
                        <span style={{
                          fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)',
                        }}>
                          {r.name} ({((r.size / plan.totalSpace) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    ))}
                    {plan.wastedAddresses > 0 && (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                      }}>
                        <div style={{
                          width: 10, height: 10, background: 'var(--bg-tertiary)',
                          border: '1px solid var(--border)', flexShrink: 0,
                        }} />
                        <span style={{
                          fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)',
                        }}>
                          {t('Libre', 'Free')} ({((plan.wastedAddresses / plan.totalSpace) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Results Table ────────────────────────────────── */}
                <div style={{
                  background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                  marginBottom: 2, overflow: 'auto',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)',
                    textTransform: 'uppercase', letterSpacing: '1px', padding: '16px 20px 0',
                  }}>{t("Tableau d'adressage", 'Addressing table')}</div>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{
                      width: '100%', borderCollapse: 'collapse', marginTop: 12,
                      minWidth: 900,
                    }}>
                      <thead>
                        <tr>
                          {[t('Nom', 'Name'), t('Adresse reseau', 'Network address'), t('Masque', 'Mask'), 'CIDR', t('Premier hote', 'First host'), t('Dernier hote', 'Last host'), 'Broadcast', t('Hotes util.', 'Usable hosts'), t('Demandes', 'Requested')].map(h => (
                            <th key={h} style={{
                              padding: '10px 12px', textAlign: 'left', fontSize: 10,
                              fontFamily: 'var(--font-mono)', color: 'var(--text-muted)',
                              textTransform: 'uppercase', letterSpacing: '1px',
                              borderBottom: '1px solid var(--border)', fontWeight: 600,
                              whiteSpace: 'nowrap',
                            }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {plan.results.map((r, i) => (
                          <motion.tr
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                          >
                            <td style={{
                              padding: '10px 12px', fontSize: 13, fontWeight: 600,
                              color: 'var(--text-primary)', fontFamily: 'var(--font-body)',
                              borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap',
                              borderLeft: `3px solid ${r.color}`,
                            }}>{r.name}</td>
                            <td style={{
                              padding: '10px 12px', fontSize: 13,
                              fontFamily: 'var(--font-mono)', color: 'var(--accent)',
                              borderBottom: '1px solid var(--border)',
                            }}>{r.network}</td>
                            <td style={{
                              padding: '10px 12px', fontSize: 13,
                              fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)',
                              borderBottom: '1px solid var(--border)',
                            }}>{r.mask}</td>
                            <td style={{
                              padding: '10px 12px', fontSize: 13, fontWeight: 700,
                              fontFamily: 'var(--font-mono)', color: 'var(--accent)',
                              borderBottom: '1px solid var(--border)',
                            }}>/{r.cidr}</td>
                            <td style={{
                              padding: '10px 12px', fontSize: 13,
                              fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)',
                              borderBottom: '1px solid var(--border)',
                            }}>{r.firstHost}</td>
                            <td style={{
                              padding: '10px 12px', fontSize: 13,
                              fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)',
                              borderBottom: '1px solid var(--border)',
                            }}>{r.lastHost}</td>
                            <td style={{
                              padding: '10px 12px', fontSize: 13,
                              fontFamily: 'var(--font-mono)', color: 'var(--text-muted)',
                              borderBottom: '1px solid var(--border)',
                            }}>{r.broadcast}</td>
                            <td style={{
                              padding: '10px 12px', fontSize: 13, fontWeight: 600,
                              fontFamily: 'var(--font-mono)', color: 'var(--success)',
                              borderBottom: '1px solid var(--border)', textAlign: 'center',
                            }}>{r.usableHosts}</td>
                            <td style={{
                              padding: '10px 12px', fontSize: 13,
                              fontFamily: 'var(--font-mono)', color: 'var(--text-muted)',
                              borderBottom: '1px solid var(--border)', textAlign: 'center',
                            }}>{r.requestedHosts}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ── Export Button ────────────────────────────────── */}
                <div style={{
                  background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                  borderTop: 'none', padding: '16px 20px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div style={{
                    fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)',
                  }}>
                    {plan.results.length} {t('sous-reseaux configures sur', 'subnets configured on')} {plan.baseNetwork}/{plan.baseCidr}
                  </div>
                  <motion.button
                    onClick={() => exportPDF(plan)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      padding: '10px 20px', background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border)', color: 'var(--text-primary)',
                      fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center',
                      gap: 8, cursor: 'pointer', fontFamily: 'var(--font-body)',
                    }}
                  >
                    <Download size={14} /> {t('Exporter en PDF', 'Export to PDF')}
                  </motion.button>
                </div>

                {/* ── Detail per subnet ───────────────────────────── */}
                <div style={{ marginTop: 24 }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)',
                    textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12,
                  }}>{t('Detail par sous-reseau', 'Detail per subnet')}</div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 2 }}>
                    {plan.results.map((r, i) => {
                      const wastePercent = Math.round(((r.usableHosts - r.requestedHosts) / r.usableHosts) * 100)
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06 }}
                          style={{
                            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                            borderTop: `3px solid ${r.color}`, padding: 18,
                          }}
                        >
                          <div style={{
                            display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center', marginBottom: 12,
                          }}>
                            <span style={{
                              fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700,
                              color: 'var(--text-primary)',
                            }}>{r.name}</span>
                            <span style={{
                              fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
                              color: r.color,
                            }}>/{r.cidr}</span>
                          </div>

                          <div style={{
                            fontFamily: 'var(--font-mono)', fontSize: 18, color: 'var(--accent)',
                            fontWeight: 600, marginBottom: 12,
                          }}>
                            {r.network}/{r.cidr}
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            {[
                              { label: t('Premier hote', 'First host'), value: r.firstHost },
                              { label: t('Dernier hote', 'Last host'), value: r.lastHost },
                              { label: 'Broadcast', value: r.broadcast },
                              { label: t('Masque', 'Mask'), value: r.mask },
                            ].map(item => (
                              <div key={item.label}>
                                <div style={{
                                  fontSize: 10, fontFamily: 'var(--font-mono)',
                                  color: 'var(--text-muted)', textTransform: 'uppercase',
                                  letterSpacing: '0.5px', marginBottom: 2,
                                }}>{item.label}</div>
                                <div style={{
                                  fontSize: 12, fontFamily: 'var(--font-mono)',
                                  color: 'var(--text-secondary)',
                                }}>{item.value}</div>
                              </div>
                            ))}
                          </div>

                          {/* Usage bar */}
                          <div style={{ marginTop: 12 }}>
                            <div style={{
                              display: 'flex', justifyContent: 'space-between',
                              fontSize: 10, fontFamily: 'var(--font-mono)',
                              color: 'var(--text-muted)', marginBottom: 4,
                            }}>
                              <span>{r.requestedHosts} / {r.usableHosts} {t('hotes', 'hosts')}</span>
                              <span>{wastePercent}% {t('disponible', 'available')}</span>
                            </div>
                            <div style={{
                              width: '100%', height: 4, background: 'var(--bg-primary)',
                            }}>
                              <div style={{
                                width: `${Math.round((r.requestedHosts / r.usableHosts) * 100)}%`,
                                height: '100%', background: r.color,
                                transition: 'width 0.3s',
                              }} />
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Empty State ────────────────────────────────────────── */}
          {!plan && !error && (
            <div style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              padding: 40, textAlign: 'center',
            }}>
              <Network size={40} style={{ color: 'var(--text-muted)', marginBottom: 16, opacity: 0.4 }} />
              <p style={{
                fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-body)',
                marginBottom: 8,
              }}>
                {t('Configurez votre reseau de base et vos sous-reseaux, puis cliquez sur', 'Configure your base network and subnets, then click')}
              </p>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--accent)',
                background: 'var(--bg-primary)', padding: '4px 12px',
                border: '1px solid var(--border)',
              }}>{t('Generer le plan', 'Generate plan')}</span>
              <p style={{
                fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-body)',
                marginTop: 16, maxWidth: 500, margin: '16px auto 0', lineHeight: 1.6,
              }}>
                {t("L'algorithme VLSM triera automatiquement vos sous-reseaux du plus grand au plus petit et les allouera de maniere optimale dans l'espace d'adressage disponible.", 'The VLSM algorithm will automatically sort your subnets from largest to smallest and allocate them optimally in the available address space.')}
              </p>
            </div>
          )}

        </motion.div>

        {/* ── Responsive style ─────────────────────────────────────── */}
        <style>{`
          @media (max-width: 768px) {
            table { font-size: 11px !important; }
          }
        `}</style>
      </div>
    </div>
  )
}
