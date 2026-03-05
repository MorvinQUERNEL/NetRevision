import { useEffect } from 'react'
import { Outlet, useParams, Navigate } from 'react-router-dom'
import { useFormationStore, isValidFormation, getFormation } from '../stores/formationStore'
import { useThemeStore } from '../stores/themeStore'

export default function FormationLayout() {
  const { formation } = useParams<{ formation: string }>()
  const setFormation = useFormationStore((s) => s.setFormation)
  const theme = useThemeStore((s) => s.theme)

  const isValid = formation && isValidFormation(formation)

  useEffect(() => {
    if (isValid && formation) {
      setFormation(formation)
      document.documentElement.setAttribute('data-formation', formation)

      // Apply dynamic CSS variables from formation config with smooth transition
      const config = getFormation(formation)
      const root = document.documentElement
      const isLight = theme === 'light'

      // Set transition for smooth color change between formations
      root.style.transition = 'color 0.3s ease'
      root.style.setProperty('--accent', isLight ? config.accentLight : config.accent)
      root.style.setProperty('--accent-hover', isLight ? config.accentHoverLight : config.accentHover)
      root.style.setProperty('--accent-glow', isLight ? config.accentGlowLight : config.accentGlow)
    }
  }, [formation, isValid, setFormation, theme])

  if (!isValid) {
    return <Navigate to="/formations" replace />
  }

  return <Outlet />
}
