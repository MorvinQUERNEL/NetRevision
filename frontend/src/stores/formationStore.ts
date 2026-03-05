import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// --- Types ---

/** @deprecated Use `string` with `isValidFormation()` instead */
export type FormationType = string

export interface ProgramConfig {
  id: string
  name: string
  nameEn: string
  color: string
  description: string
  descriptionEn: string
  chapterCount: number
}

export interface ToolConfig {
  path: string
  labelFr: string
  labelEn: string
  descriptionFr?: string
  descriptionEn?: string
  icon: string
  color?: string
}

export interface GameConfig {
  id: string
  titleFr: string
  titleEn: string
  descriptionFr: string
  descriptionEn: string
  icon: string
  path: string
  difficulty: string
  difficultyEn: string
  color: string
  storageKey: string
  disabled?: boolean
}

export interface FormationConfig {
  id: string
  name: string
  nameEn: string
  accent: string
  accentHover: string
  accentGlow: string
  accentLight: string
  accentHoverLight: string
  accentGlowLight: string
  icon: string
  description: string
  descriptionEn: string
  programs: ProgramConfig[]
  tools: ToolConfig[]
  games: GameConfig[]
  features: ToolConfig[]
  cliSimulatorType: 'cisco' | 'terminal'
  defaultFirstChapterSlug: string
  heroVisualItems?: { icon: string; label: string; sub: string; subEn: string; color: string }[]
  stats?: { value: string; labelFr: string; labelEn: string }[]
}

// --- Registry ---

const formationRegistry = new Map<string, FormationConfig>()

export function registerFormation(config: FormationConfig): void {
  formationRegistry.set(config.id, config)
}

export function getFormation(id: string): FormationConfig {
  const config = formationRegistry.get(id)
  if (!config) {
    throw new Error(`Formation "${id}" not registered. Available: ${[...formationRegistry.keys()].join(', ')}`)
  }
  return config
}

export function getAllFormations(): FormationConfig[] {
  return [...formationRegistry.values()]
}

export function isValidFormation(id: string): boolean {
  return formationRegistry.has(id)
}

export function getFormationIds(): string[] {
  return [...formationRegistry.keys()]
}

// --- Backward-compat proxy for FORMATIONS ---
// Components that use `FORMATIONS[formation]` will still work.
export const FORMATIONS: Record<string, FormationConfig> = new Proxy(
  {} as Record<string, FormationConfig>,
  {
    get(_target, prop: string) {
      return formationRegistry.get(prop)
    },
    has(_target, prop: string) {
      return formationRegistry.has(prop)
    },
    ownKeys() {
      return [...formationRegistry.keys()]
    },
    getOwnPropertyDescriptor(_target, prop: string) {
      if (formationRegistry.has(prop)) {
        return { configurable: true, enumerable: true, value: formationRegistry.get(prop) }
      }
      return undefined
    },
  }
)

// --- Zustand store ---

interface FormationState {
  currentFormation: string
  setFormation: (formation: string) => void
}

export const useFormationStore = create<FormationState>()(
  persist(
    (set) => ({
      currentFormation: 'reseaux',
      setFormation: (formation) => {
        if (isValidFormation(formation)) {
          set({ currentFormation: formation })
        }
      },
    }),
    { name: 'formation' }
  )
)
