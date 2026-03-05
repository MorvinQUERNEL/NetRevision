import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'

interface Props {
  color?: string
  intensity?: number
  style?: React.CSSProperties
}

const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform vec2 uResolution;
  uniform float uIntensity;

  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;

    // Flowing plasma
    float v1 = sin(uv.x * 6.0 + uTime * 0.4) * cos(uv.y * 4.0 + uTime * 0.3);
    float v2 = sin((uv.x + uv.y) * 5.0 - uTime * 0.2);
    float v3 = sin(length(uv - 0.5) * 8.0 - uTime * 0.5) * 0.5;
    float plasma = (v1 + v2 + v3) / 3.0 * 0.5 + 0.5;

    // Particle dots
    vec2 grid = fract(uv * 30.0);
    float dots = smoothstep(0.08, 0.04, length(grid - 0.5));
    float n = noise(floor(uv * 30.0) + floor(uTime * 0.5));
    dots *= step(0.85, n);

    // Compose
    vec3 col = uColor * plasma * 0.2 * uIntensity;
    col += uColor * dots * 0.3 * uIntensity;
    col += uColor * 0.03 * uIntensity;

    // Vignette
    float vignette = 1.0 - length((uv - 0.5) * 1.6);
    col *= smoothstep(0.0, 0.5, vignette);

    gl_FragColor = vec4(col, 1.0);
  }
`

function hexToVec3(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16) / 255
  const g = parseInt(clean.slice(2, 4), 16) / 255
  const b = parseInt(clean.slice(4, 6), 16) / 255
  return [r, g, b]
}

export default function ShaderBackground({ color = '#00e5a0', intensity = 1, style }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (isMobile || !containerRef.current) return

    const container = containerRef.current
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    const [r, g, b] = hexToVec3(color)
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Vector3(r, g, b) },
        uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
        uIntensity: { value: intensity },
      },
    })

    const geometry = new THREE.PlaneGeometry(2, 2)
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    let time = 0
    let animId = 0

    const resize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      renderer.setSize(w, h)
      material.uniforms.uResolution.value.set(w, h)
    }
    window.addEventListener('resize', resize)

    const animate = () => {
      time += 0.016
      material.uniforms.uTime.value = time
      renderer.render(scene, camera)
      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      renderer.dispose()
      material.dispose()
      geometry.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [isMobile, color, intensity])

  // Fallback: subtle CSS gradient animation on mobile
  if (isMobile) {
    return (
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: `radial-gradient(ellipse at 30% 50%, ${color}10 0%, transparent 70%)`,
        pointerEvents: 'none',
        ...style,
      }} />
    )
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: 'none',
        ...style,
      }}
    />
  )
}
