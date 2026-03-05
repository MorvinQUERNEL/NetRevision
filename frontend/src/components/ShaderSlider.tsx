import { useRef, useEffect, useCallback, useState } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import type { FormationConfig } from '../stores/formationStore'

interface Props {
  formations: FormationConfig[]
  activeIndex: number
  onIndexChange: (index: number) => void
}

// Shader effects — each formation gets a unique visual identity
const shaderEffects = [
  // Glass distortion
  {
    fragment: `
      uniform float uTime;
      uniform float uProgress;
      uniform vec3 uColor;
      uniform vec2 uResolution;
      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution;
        float wave = sin(uv.x * 8.0 + uTime * 0.6) * cos(uv.y * 6.0 + uTime * 0.4) * 0.5 + 0.5;
        float glass = smoothstep(0.2, 0.8, wave);
        vec3 col = mix(uColor * 0.15, uColor * 0.4, glass);
        col += uColor * 0.08 * sin(uv.y * 20.0 + uTime) * 0.5;
        float vignette = 1.0 - length((uv - 0.5) * 1.4);
        col *= vignette;
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  },
  // Frost crystals
  {
    fragment: `
      uniform float uTime;
      uniform float uProgress;
      uniform vec3 uColor;
      uniform vec2 uResolution;
      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }
      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution;
        float n = noise(floor(uv * 40.0) + uTime * 0.1);
        float crystal = smoothstep(0.4, 0.6, n);
        vec3 col = mix(uColor * 0.1, uColor * 0.35, crystal);
        float lines = abs(sin(uv.x * 80.0 + uv.y * 80.0 + uTime * 0.3)) * 0.08;
        col += uColor * lines;
        float vignette = 1.0 - length((uv - 0.5) * 1.6);
        col *= smoothstep(0.0, 0.5, vignette);
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  },
  // Ripple waves
  {
    fragment: `
      uniform float uTime;
      uniform float uProgress;
      uniform vec3 uColor;
      uniform vec2 uResolution;
      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution;
        vec2 center = vec2(0.5);
        float dist = length(uv - center);
        float ripple = sin(dist * 30.0 - uTime * 2.0) * 0.5 + 0.5;
        ripple *= smoothstep(0.8, 0.0, dist);
        float ripple2 = sin(dist * 20.0 - uTime * 1.5 + 1.5) * 0.5 + 0.5;
        ripple2 *= smoothstep(0.6, 0.0, dist);
        vec3 col = uColor * 0.1 + uColor * ripple * 0.25 + uColor * ripple2 * 0.15;
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  },
  // Plasma field
  {
    fragment: `
      uniform float uTime;
      uniform float uProgress;
      uniform vec3 uColor;
      uniform vec2 uResolution;
      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution;
        float v1 = sin(uv.x * 10.0 + uTime * 0.7);
        float v2 = sin(uv.y * 10.0 + uTime * 0.5);
        float v3 = sin((uv.x + uv.y) * 10.0 + uTime * 0.3);
        float v4 = sin(length(uv - 0.5) * 14.0 - uTime * 0.8);
        float plasma = (v1 + v2 + v3 + v4) * 0.25 * 0.5 + 0.5;
        vec3 col = uColor * plasma * 0.35;
        col += uColor * 0.05;
        float vignette = 1.0 - length((uv - 0.5) * 1.4);
        col *= vignette;
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  },
  // Time shift
  {
    fragment: `
      uniform float uTime;
      uniform float uProgress;
      uniform vec3 uColor;
      uniform vec2 uResolution;
      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution;
        float grid = step(0.96, fract(uv.x * 30.0)) + step(0.96, fract(uv.y * 30.0));
        grid *= 0.15;
        float scan = smoothstep(0.0, 0.02, abs(fract(uv.y * 2.0 - uTime * 0.15) - 0.5));
        float flow = sin(uv.y * 40.0 + uTime) * sin(uv.x * 30.0 - uTime * 0.5) * 0.5 + 0.5;
        vec3 col = uColor * 0.08 + uColor * grid + uColor * (1.0 - scan) * 0.2;
        col += uColor * flow * 0.1;
        float vignette = 1.0 - length((uv - 0.5) * 1.5);
        col *= smoothstep(0.0, 0.5, vignette);
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  },
]

const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`

function hexToVec3(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return [r, g, b]
}

export default function ShaderSlider({ formations, activeIndex, onIndexChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.Camera | null>(null)
  const materialsRef = useRef<THREE.ShaderMaterial[]>([])
  const meshesRef = useRef<THREE.Mesh[]>([])
  const animRef = useRef<number>(0)
  const timeRef = useRef(0)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  // Auto-slide
  const autoSlideRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const progressRef = useRef(0)
  const [progress, setProgress] = useState(0)

  const startAutoSlide = useCallback(() => {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current)
    progressRef.current = 0
    setProgress(0)
    autoSlideRef.current = setInterval(() => {
      progressRef.current += 1 / 60 // ~60fps tick
      setProgress(progressRef.current)
      if (progressRef.current >= 6) {
        onIndexChange((activeIndex + 1) % formations.length)
      }
    }, 1000 / 60)
  }, [activeIndex, formations.length, onIndexChange])

  useEffect(() => {
    startAutoSlide()
    return () => {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current)
    }
  }, [startAutoSlide])

  // Responsive
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Three.js setup
  useEffect(() => {
    if (isMobile || !containerRef.current) return

    const container = containerRef.current
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    cameraRef.current = camera

    const geometry = new THREE.PlaneGeometry(2, 2)

    // Create one mesh per formation
    formations.forEach((f, i) => {
      const effect = shaderEffects[i % shaderEffects.length]
      const [r, g, b] = hexToVec3(f.accent)
      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader: effect.fragment,
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uColor: { value: new THREE.Vector3(r, g, b) },
          uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
        },
        transparent: true,
      })
      const mesh = new THREE.Mesh(geometry, material)
      mesh.visible = i === 0
      scene.add(mesh)
      materialsRef.current.push(material)
      meshesRef.current.push(mesh)
    })

    const resize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      renderer.setSize(w, h)
      materialsRef.current.forEach((m) => {
        m.uniforms.uResolution.value.set(w, h)
      })
    }
    window.addEventListener('resize', resize)

    const animate = () => {
      timeRef.current += 0.016
      materialsRef.current.forEach((m) => {
        m.uniforms.uTime.value = timeRef.current
      })
      renderer.render(scene, camera)
      animRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
      renderer.dispose()
      geometry.dispose()
      materialsRef.current.forEach((m) => m.dispose())
      materialsRef.current = []
      meshesRef.current = []
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [isMobile, formations])

  // Transition between formations
  useEffect(() => {
    if (isMobile) return
    const meshes = meshesRef.current
    if (meshes.length === 0) return

    // Hide all, show active with fade
    meshes.forEach((mesh, i) => {
      if (i === activeIndex) {
        mesh.visible = true
        gsap.fromTo(
          (mesh.material as THREE.ShaderMaterial).uniforms.uProgress,
          { value: 0 },
          { value: 1, duration: 0.5, ease: 'power2.out' }
        )
      } else {
        gsap.to((mesh.material as THREE.ShaderMaterial).uniforms.uProgress, {
          value: 0,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => { mesh.visible = false },
        })
      }
    })
  }, [activeIndex, isMobile])

  if (isMobile) return null

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {/* Progress bars */}
      <div style={{
        position: 'absolute',
        bottom: 32,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 8,
        zIndex: 10,
      }}>
        {formations.map((_, i) => (
          <button
            key={i}
            onClick={() => onIndexChange(i)}
            style={{
              width: 48,
              height: 3,
              background: i === activeIndex
                ? formations[activeIndex].accent
                : 'rgba(255,255,255,0.15)',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              padding: 0,
            }}
          >
            {i === activeIndex && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: `${Math.min((progress / 6) * 100, 100)}%`,
                background: 'rgba(255,255,255,0.4)',
                transition: 'width 0.05s linear',
              }} />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
