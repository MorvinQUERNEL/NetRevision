import type { Level } from './levels'

export const levels: Level[] = [
  { level: 1, name: 'Network Novice', minPoints: 0, maxPoints: 49, icon: 'Zap', color: '#94a3b8', description: 'First steps in the networking world' },
  { level: 2, name: 'Apprentice Technician', minPoints: 50, maxPoints: 149, icon: 'Wrench', color: '#3b82f6', description: 'Mastery of fundamental basics' },
  { level: 3, name: 'Confirmed Technician', minPoints: 150, maxPoints: 299, icon: 'Cpu', color: '#00e5a0', description: 'Solid routing skills' },
  { level: 4, name: 'Junior Admin', minPoints: 300, maxPoints: 499, icon: 'Server', color: '#f59e0b', description: 'Autonomous management of simple networks' },
  { level: 5, name: 'Network Admin', minPoints: 500, maxPoints: 749, icon: 'Network', color: '#6366f1', description: 'Expertise in security and VPN' },
  { level: 6, name: 'Infrastructure Expert', minPoints: 750, maxPoints: 999, icon: 'Shield', color: '#8b5cf6', description: 'Design of complex architectures' },
  { level: 7, name: 'Cloud Architect', minPoints: 1000, maxPoints: 1499, icon: 'Cloud', color: '#ec4899', description: 'Mastery of cloud networking' },
  { level: 8, name: 'DevOps Engineer', minPoints: 1500, maxPoints: 1999, icon: 'GitBranch', color: '#f43f5e', description: 'Automation and orchestration' },
  { level: 9, name: 'SDN Architect', minPoints: 2000, maxPoints: 2999, icon: 'Workflow', color: '#10b981', description: 'Advanced programmability and SDN' },
  { level: 10, name: 'Security Specialist', minPoints: 3000, maxPoints: 3999, icon: 'Lock', color: '#ef4444', description: 'Offensive and defensive cybersecurity' },
  { level: 11, name: 'Senior Consultant', minPoints: 4000, maxPoints: 4999, icon: 'Briefcase', color: '#d946ef', description: 'Enterprise consulting and architecture' },
  { level: 12, name: 'Principal Architect', minPoints: 5000, maxPoints: 6999, icon: 'Building', color: '#0891b2', description: 'Technical leadership and innovation' },
  { level: 13, name: 'Datacenter Expert', minPoints: 7000, maxPoints: 9999, icon: 'Database', color: '#7c3aed', description: 'Worldwide-scale infrastructures' },
  { level: 14, name: 'Network CTO', minPoints: 10000, maxPoints: 14999, icon: 'Trophy', color: '#facc15', description: 'Strategic vision and innovation' },
  { level: 15, name: 'NetRevision Legend', minPoints: 15000, maxPoints: Infinity, icon: 'Crown', color: '#fbbf24', description: 'Absolute master of networking' },
]
