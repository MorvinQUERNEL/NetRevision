import { useEffect, useState } from 'react'

interface Props {
  color?: string
  intensity?: number
  style?: React.CSSProperties
}

interface OrbConfig {
  top?: string
  bottom?: string
  left?: string
  right?: string
  transform?: string
  width: string
  height: string
  maxWidth: string
  maxHeight: string
  delay: number
  spinClass: string
}

const orbs: OrbConfig[] = [
  {
    top: '-40%', left: '-20%',
    width: '80vw', height: '80vw', maxWidth: '800px', maxHeight: '800px',
    delay: 0, spinClass: 'neon-spin-8',
  },
  {
    bottom: '-50%', left: '50%', transform: 'translateX(-50%)',
    width: '100vw', height: '100vw', maxWidth: '1000px', maxHeight: '1000px',
    delay: 300, spinClass: 'neon-spin-10-reverse',
  },
  {
    top: '-30%', right: '-25%',
    width: '70vw', height: '70vw', maxWidth: '700px', maxHeight: '700px',
    delay: 500, spinClass: 'neon-spin-6',
  },
  {
    bottom: '-35%', right: '-15%',
    width: '75vw', height: '75vw', maxWidth: '750px', maxHeight: '750px',
    delay: 700, spinClass: 'neon-spin-7-reverse',
  },
]

export default function NeonOrbs({ color, intensity = 1, style }: Props) {
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )

  useEffect(() => {
    setMounted(true)
    const check = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Mobile: simple radial gradient fallback
  if (isMobile) {
    return (
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: color
          ? `radial-gradient(ellipse at 30% 50%, ${color}15 0%, transparent 70%)`
          : `radial-gradient(ellipse at 30% 50%, var(--accent-glow) 0%, transparent 70%)`,
        pointerEvents: 'none',
        ...style,
      }} />
    )
  }

  const opacityScale = Math.min(Math.max(intensity, 0), 1)

  return (
    <div
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        opacity: opacityScale,
        ...style,
      }}
    >
      {orbs.map((orb, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: orb.top,
            bottom: orb.bottom,
            left: orb.left,
            right: orb.right,
            transform: orb.transform,
            width: orb.width,
            height: orb.height,
            maxWidth: orb.maxWidth,
            maxHeight: orb.maxHeight,
            opacity: mounted ? 1 : 0,
            transition: `opacity 1s ease-out ${orb.delay}ms, transform 1s ease-out ${orb.delay}ms`,
          }}
        >
          <div
            className="neon-orb"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'relative',
              ...(color ? {
                background: `radial-gradient(circle at 50% 50%, var(--bg-primary) 0%, var(--bg-primary) 90%, transparent 100%)`,
                boxShadow: `0 0 60px 2px ${color}40, 0 0 100px 5px ${color}20, inset 0 0 60px 2px ${color}10`,
                border: `1px solid ${color}30`,
              } : {}),
            }}
          >
            <div
              className={`neon-beam-container ${orb.spinClass}`}
            >
              <div
                className="neon-beam"
                style={color ? {
                  background: `linear-gradient(90deg, transparent 0%, ${color}50 30%, ${color}cc 70%, ${color} 100%)`,
                  boxShadow: `0 0 20px 4px ${color}80, 0 0 40px 8px ${color}40`,
                } : {}}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
