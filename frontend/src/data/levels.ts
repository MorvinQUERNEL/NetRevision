export interface Level {
  level: number
  name: string
  minPoints: number
  maxPoints: number
  icon: string
  color: string
  description: string
}

export const levels: Level[] = [
  { level: 1, name: 'Novice Reseau', minPoints: 0, maxPoints: 49, icon: 'Zap', color: '#94a3b8', description: 'Premiers pas dans le monde des reseaux' },
  { level: 2, name: 'Apprenti Technicien', minPoints: 50, maxPoints: 149, icon: 'Wrench', color: '#3b82f6', description: 'Maitrise des bases fondamentales' },
  { level: 3, name: 'Technicien Confirme', minPoints: 150, maxPoints: 299, icon: 'Cpu', color: '#00e5a0', description: 'Competences solides en routage' },
  { level: 4, name: 'Admin Junior', minPoints: 300, maxPoints: 499, icon: 'Server', color: '#f59e0b', description: 'Gestion autonome de reseaux simples' },
  { level: 5, name: 'Admin Reseau', minPoints: 500, maxPoints: 749, icon: 'Network', color: '#6366f1', description: 'Expertise en securite et VPN' },
  { level: 6, name: 'Expert Infra', minPoints: 750, maxPoints: 999, icon: 'Shield', color: '#8b5cf6', description: 'Conception d\'architectures complexes' },
  { level: 7, name: 'Architecte Cloud', minPoints: 1000, maxPoints: 1499, icon: 'Cloud', color: '#ec4899', description: 'Maitrise du cloud networking' },
  { level: 8, name: 'Ingenieur DevOps', minPoints: 1500, maxPoints: 1999, icon: 'GitBranch', color: '#f43f5e', description: 'Automatisation et orchestration' },
  { level: 9, name: 'Architecte SDN', minPoints: 2000, maxPoints: 2999, icon: 'Workflow', color: '#10b981', description: 'Programmabilite et SDN avance' },
  { level: 10, name: 'Specialiste Securite', minPoints: 3000, maxPoints: 3999, icon: 'Lock', color: '#ef4444', description: 'Cybersecurite offensive et defensive' },
  { level: 11, name: 'Consultant Senior', minPoints: 4000, maxPoints: 4999, icon: 'Briefcase', color: '#d946ef', description: 'Conseil et architecture d\'entreprise' },
  { level: 12, name: 'Architecte Principal', minPoints: 5000, maxPoints: 6999, icon: 'Building', color: '#0891b2', description: 'Leadership technique et innovation' },
  { level: 13, name: 'Expert Datacenter', minPoints: 7000, maxPoints: 9999, icon: 'Database', color: '#7c3aed', description: 'Infrastructures a l\'echelle mondiale' },
  { level: 14, name: 'CTO Reseau', minPoints: 10000, maxPoints: 14999, icon: 'Trophy', color: '#facc15', description: 'Vision strategique et innovation' },
  { level: 15, name: 'Legende NetRevision', minPoints: 15000, maxPoints: Infinity, icon: 'Crown', color: '#fbbf24', description: 'Maitre absolu des reseaux' },
]
