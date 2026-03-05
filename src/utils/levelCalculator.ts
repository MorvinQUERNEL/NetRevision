import { levels, type Level } from '../data/levels'

export function getUserLevel(totalPoints: number): {
  currentLevel: Level
  nextLevel: Level | null
  progress: number
  pointsToNext: number
} {
  const current = levels.find(l => totalPoints >= l.minPoints && totalPoints <= l.maxPoints) || levels[0]
  const next = levels.find(l => l.level === current.level + 1) || null
  const pointsInLevel = totalPoints - current.minPoints
  const levelRange = current.maxPoints === Infinity ? 1 : current.maxPoints - current.minPoints + 1
  const progress = current.maxPoints === Infinity ? 100 : Math.min(100, Math.round((pointsInLevel / levelRange) * 100))
  const pointsToNext = next ? next.minPoints - totalPoints : 0

  return { currentLevel: current, nextLevel: next, progress, pointsToNext }
}
