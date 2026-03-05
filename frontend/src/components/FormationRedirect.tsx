import { Navigate } from 'react-router-dom'
import { useFormationStore } from '../stores/formationStore'

export default function FormationRedirect() {
  const formation = useFormationStore((s) => s.currentFormation)
  return <Navigate to={`/${formation}`} replace />
}
