import { useRef, useEffect } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
}

export default function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<Particle[]>([])
  const animRef = useRef<number>(0)
  const mouse = useRef({ x: -1000, y: -1000 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    const w = () => canvas.offsetWidth
    const h = () => canvas.offsetHeight
    const count = 80

    // Seed particles
    particles.current = Array.from({ length: count }, () => ({
      x: Math.random() * w(),
      y: Math.random() * h(),
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2,
    }))

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    canvas.addEventListener('mousemove', handleMouse)

    const draw = () => {
      ctx.clearRect(0, 0, w(), h())
      const pts = particles.current
      const maxDist = 120
      const mouseRadius = 150

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i]

        // Mouse interaction - subtle repulsion
        const mdx = p.x - mouse.current.x
        const mdy = p.y - mouse.current.y
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy)
        if (mDist < mouseRadius && mDist > 0) {
          const force = (mouseRadius - mDist) / mouseRadius * 0.02
          p.vx += (mdx / mDist) * force
          p.vy += (mdy / mDist) * force
        }

        // Velocity damping
        p.vx *= 0.99
        p.vy *= 0.99

        p.x += p.vx
        p.y += p.vy

        // Wrap edges
        if (p.x < -10) p.x = w() + 10
        if (p.x > w() + 10) p.x = -10
        if (p.y < -10) p.y = h() + 10
        if (p.y > h() + 10) p.y = -10

        // Draw connections
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j]
          const dx = p.x - q.x
          const dy = p.y - q.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.25
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `rgba(0, 229, 160, ${alpha})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }

        // Draw node
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 229, 160, ${p.opacity})`
        ctx.fill()

        // Glow effect on larger nodes
        if (p.radius > 2) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius + 4, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(0, 229, 160, ${p.opacity * 0.15})`
          ctx.fill()
        }
      }

      animRef.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', handleMouse)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'auto',
        opacity: 0.6,
      }}
    />
  )
}
