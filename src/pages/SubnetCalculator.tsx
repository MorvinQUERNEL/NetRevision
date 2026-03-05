import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, ArrowRight, RotateCcw } from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'

function ipToNum(ip: string): number {
  const parts = ip.split('.').map(Number)
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0
}

function numToIp(num: number): string {
  return [num >>> 24, (num >> 16) & 255, (num >> 8) & 255, num & 255].join('.')
}

function numToBin(num: number): string {
  return num.toString(2).padStart(8, '0')
}

interface SubnetResult {
  network: string
  broadcast: string
  firstHost: string
  lastHost: string
  mask: string
  wildcard: string
  totalHosts: number
  usableHosts: number
  cidr: number
  binary: string[]
  maskBinary: string
}

function calculate(ip: string, cidr: number): SubnetResult | null {
  const parts = ip.split('.')
  if (parts.length !== 4) return null
  const nums = parts.map(Number)
  if (nums.some(n => isNaN(n) || n < 0 || n > 255)) return null
  if (cidr < 0 || cidr > 32) return null

  const ipNum = ipToNum(ip)
  const maskNum = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0
  const wildcardNum = (~maskNum) >>> 0
  const networkNum = (ipNum & maskNum) >>> 0
  const broadcastNum = (networkNum | wildcardNum) >>> 0
  const totalHosts = Math.pow(2, 32 - cidr)
  const usableHosts = cidr >= 31 ? (cidr === 32 ? 1 : 2) : totalHosts - 2

  return {
    network: numToIp(networkNum),
    broadcast: numToIp(broadcastNum),
    firstHost: cidr >= 31 ? numToIp(networkNum) : numToIp(networkNum + 1),
    lastHost: cidr >= 31 ? numToIp(broadcastNum) : numToIp(broadcastNum - 1),
    mask: numToIp(maskNum),
    wildcard: numToIp(wildcardNum),
    totalHosts,
    usableHosts,
    cidr,
    binary: nums.map(n => numToBin(n)),
    maskBinary: [maskNum >>> 24, (maskNum >> 16) & 255, (maskNum >> 8) & 255, maskNum & 255]
      .map(n => numToBin(n)).join('.'),
  }
}

export default function SubnetCalculator() {
  const { t } = useTranslation()

  const [ip, setIp] = useState('192.168.1.0')
  const [cidr, setCidr] = useState(24)
  const [result, setResult] = useState<SubnetResult | null>(null)
  const [error, setError] = useState('')

  const handleCalculate = () => {
    setError('')
    const r = calculate(ip, cidr)
    if (!r) {
      setError(t('Adresse IP ou CIDR invalide', 'Invalid IP address or CIDR'))
      setResult(null)
      return
    }
    setResult(r)
  }

  const handleReset = () => {
    setIp('192.168.1.0')
    setCidr(24)
    setResult(null)
    setError('')
  }

  const presets = [
    { label: t('Classe C', 'Class C'), ip: '192.168.1.0', cidr: 24 },
    { label: t('Classe B', 'Class B'), ip: '172.16.0.0', cidr: 16 },
    { label: t('Classe A', 'Class A'), ip: '10.0.0.0', cidr: 8 },
    { label: '/28 (16 IPs)', ip: '192.168.10.0', cidr: 28 },
    { label: t('/30 (lien P2P)', '/30 (P2P link)'), ip: '10.0.0.0', cidr: 30 },
    { label: t('/22 (4 reseaux)', '/22 (4 networks)'), ip: '172.16.0.0', cidr: 22 },
  ]

  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px 80px' }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)',
            textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12,
          }}>{t('// calculatrice', '// calculator')}</div>
          <h1 style={{
            fontFamily: 'var(--font-heading)', fontSize: 32, fontWeight: 700,
            marginBottom: 8, letterSpacing: '-1px',
          }}>{t('Calculatrice de sous-reseaux', 'Subnet Calculator')}</h1>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 32, fontWeight: 300 }}>
            {t('Calcule l\'adresse reseau, broadcast, plage d\'hotes et masque a partir d\'une IP et d\'un CIDR.', 'Calculate the network address, broadcast, host range and mask from an IP and CIDR.')}
          </p>

          {/* Presets */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
            {presets.map(p => (
              <button key={p.label} onClick={() => { setIp(p.ip); setCidr(p.cidr); setResult(null) }}
                style={{
                  padding: '4px 12px', background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                  color: 'var(--text-secondary)', fontSize: 12, fontFamily: 'var(--font-mono)',
                  transition: 'all 0.15s',
                }}>{p.label}</button>
            ))}
          </div>

          {/* Input */}
          <div style={{
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            padding: 24, marginBottom: 24,
          }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <label style={{
                  display: 'block', fontSize: 11, fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6,
                }}>{t('Adresse IP', 'IP Address')}</label>
                <input value={ip} onChange={e => setIp(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCalculate()}
                  style={{
                    width: '100%', padding: '10px 14px', background: 'var(--bg-primary)',
                    border: '1px solid var(--border)', color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)', fontSize: 16, outline: 'none',
                  }} placeholder="192.168.1.0" />
              </div>
              <div style={{ width: 100 }}>
                <label style={{
                  display: 'block', fontSize: 11, fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6,
                }}>/ CIDR</label>
                <input type="number" value={cidr} onChange={e => setCidr(Number(e.target.value))}
                  onKeyDown={e => e.key === 'Enter' && handleCalculate()}
                  min={0} max={32}
                  style={{
                    width: '100%', padding: '10px 14px', background: 'var(--bg-primary)',
                    border: '1px solid var(--border)', color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)', fontSize: 16, outline: 'none',
                  }} />
              </div>
              <button onClick={handleCalculate} style={{
                padding: '10px 20px', background: 'var(--accent)', color: 'var(--bg-primary)',
                fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6, border: 'none',
              }}>
                <Calculator size={16} /> {t('Calculer', 'Calculate')}
              </button>
              <button onClick={handleReset} style={{
                padding: '10px 14px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13,
              }}>
                <RotateCcw size={14} />
              </button>
            </div>
            {error && (
              <div style={{
                marginTop: 12, color: 'var(--error)', fontSize: 13, fontFamily: 'var(--font-mono)',
              }}>{error}</div>
            )}
          </div>

          {/* Results */}
          {result && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              {/* Binary representation */}
              <div style={{
                background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                padding: 20, marginBottom: 2,
              }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)',
                  textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12,
                }}>{t('Representation binaire', 'Binary representation')}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, marginBottom: 8 }}>
                  <span style={{ color: 'var(--text-muted)', width: 70, display: 'inline-block' }}>IP:</span>
                  <span style={{ color: 'var(--accent)' }}>{result.binary.join('.')}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14 }}>
                  <span style={{ color: 'var(--text-muted)', width: 70, display: 'inline-block' }}>Mask:</span>
                  <span style={{ color: 'var(--accent-secondary)' }}>{result.maskBinary}</span>
                </div>
              </div>

              {/* Main results grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, marginBottom: 2 }}>
                {[
                  { label: t('Adresse reseau', 'Network address'), value: result.network, color: 'var(--accent)' },
                  { label: t('Adresse broadcast', 'Broadcast address'), value: result.broadcast, color: 'var(--warning)' },
                  { label: t('Premier hote', 'First host'), value: result.firstHost, color: 'var(--success)' },
                  { label: t('Dernier hote', 'Last host'), value: result.lastHost, color: 'var(--success)' },
                  { label: t('Masque', 'Mask'), value: result.mask, color: 'var(--accent-secondary)' },
                  { label: t('Wildcard', 'Wildcard'), value: result.wildcard, color: 'var(--accent-warm)' },
                ].map(item => (
                  <div key={item.label} style={{
                    background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '14px 18px',
                  }}>
                    <div style={{
                      fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)',
                      textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4,
                    }}>{item.label}</div>
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 600, color: item.color,
                    }}>{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Host count */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                <div style={{
                  background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '14px 18px',
                }}>
                  <div style={{
                    fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)',
                    textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4,
                  }}>CIDR</div>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 700, color: 'var(--accent)',
                  }}>/{result.cidr}</div>
                </div>
                <div style={{
                  background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '14px 18px',
                }}>
                  <div style={{
                    fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)',
                    textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4,
                  }}>{t('Total adresses', 'Total addresses')}</div>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 700, color: 'var(--accent-secondary)',
                  }}>{result.totalHosts.toLocaleString()}</div>
                </div>
                <div style={{
                  background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '14px 18px',
                }}>
                  <div style={{
                    fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)',
                    textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4,
                  }}>{t('Hotes utilisables', 'Usable hosts')}</div>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 700, color: 'var(--success)',
                  }}>{result.usableHosts.toLocaleString()}</div>
                </div>
              </div>

              {/* CIDR slider */}
              <div style={{
                background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                padding: 20, marginTop: 2,
              }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)',
                  textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12,
                }}>{t('Masques courants', 'Common masks')}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {[8, 16, 20, 22, 24, 25, 26, 27, 28, 29, 30, 32].map(c => (
                    <button key={c} onClick={() => { setCidr(c); setResult(calculate(ip, c)) }}
                      style={{
                        padding: '6px 12px',
                        background: c === cidr ? 'var(--accent)' : 'var(--bg-primary)',
                        color: c === cidr ? 'var(--bg-primary)' : 'var(--text-secondary)',
                        border: `1px solid ${c === cidr ? 'var(--accent)' : 'var(--border)'}`,
                        fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600,
                      }}>/{c}</button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Quick reference */}
          {!result && (
            <div style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: 24,
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)',
                textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16,
              }}>{t('// reference rapide', '// quick reference')}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }} className="ref-grid">
                {[
                  { cidr: '/8', mask: '255.0.0.0', hosts: '16 777 214' },
                  { cidr: '/16', mask: '255.255.0.0', hosts: '65 534' },
                  { cidr: '/24', mask: '255.255.255.0', hosts: '254' },
                  { cidr: '/25', mask: '255.255.255.128', hosts: '126' },
                  { cidr: '/26', mask: '255.255.255.192', hosts: '62' },
                  { cidr: '/27', mask: '255.255.255.224', hosts: '30' },
                  { cidr: '/28', mask: '255.255.255.240', hosts: '14' },
                  { cidr: '/29', mask: '255.255.255.248', hosts: '6' },
                  { cidr: '/30', mask: '255.255.255.252', hosts: '2' },
                ].map(r => (
                  <div key={r.cidr} style={{
                    background: 'var(--bg-primary)', border: '1px solid var(--border)',
                    padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: 'var(--accent)' }}>{r.cidr}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>{r.mask}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--success)' }}>{r.hosts} <ArrowRight size={10} style={{ verticalAlign: 'middle' }} /></span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
