interface ProgressRecord {
  chapterSlug: string
  courseCompleted: boolean
  quizScore: number | null
  quizCompletedAt: string | null
  examScore: number | null
  examPassed: boolean
  examCompletedAt: string | null
  flashcardsReviewed: number
}

interface ChapterLike {
  id: number
  slug: string
  title: string
}

interface UserLike {
  firstName: string
  lastName: string
  email: string
  totalPoints: number
  loginStreak: number
}

function getProgramme(id: number): string {
  if (id <= 8) return 'P1 - Fondamentaux'
  if (id <= 16) return 'P2 - Avance'
  if (id <= 24) return 'P3 - Entreprise'
  return 'P4 - Expert'
}

function downloadCSV(content: string, filename: string): void {
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function escapeCSV(value: string): string {
  return `"${value.replace(/"/g, '""')}"`
}

export function exportProgressToCSV(records: ProgressRecord[], chapters: ChapterLike[]): void {
  const headers = ['Chapitre', 'Programme', 'Cours complete', 'Score Quiz', 'Score Examen', 'Flashcards']
  const rows = chapters.map(ch => {
    const r = records.find(rec => rec.chapterSlug === ch.slug)
    return [
      escapeCSV(ch.title),
      escapeCSV(getProgramme(ch.id)),
      r?.courseCompleted ? 'Oui' : 'Non',
      r?.quizScore !== null && r?.quizScore !== undefined ? `${r.quizScore}%` : '-',
      r?.examScore !== null && r?.examScore !== undefined ? `${r.examScore}%` : '-',
      String(r?.flashcardsReviewed || 0),
    ].join(',')
  })

  const csv = [headers.join(','), ...rows].join('\n')
  const date = new Date().toISOString().split('T')[0]
  downloadCSV(csv, `netrevision_progression_${date}.csv`)
}

export function exportAnalyticsToCSV(records: ProgressRecord[], chapters: ChapterLike[], user: UserLike): void {
  const completedQuizzes = records.filter(r => r.quizScore !== null)
  const avgQuiz = completedQuizzes.length > 0
    ? Math.round(completedQuizzes.reduce((s, r) => s + (r.quizScore || 0), 0) / completedQuizzes.length)
    : 0

  const lines: string[] = [
    'Statistiques NetRevision',
    `Date d\'export,${new Date().toLocaleDateString('fr-FR')}`,
    '',
    `Utilisateur,${escapeCSV(user.firstName + ' ' + user.lastName)}`,
    `Email,${escapeCSV(user.email)}`,
    `Points totaux,${user.totalPoints}`,
    `Streak,${user.loginStreak} jours`,
    '',
    `Cours completes,${records.filter(r => r.courseCompleted).length}`,
    `Quiz completes,${completedQuizzes.length}`,
    `Moyenne quiz,${avgQuiz}%`,
    `Examens reussis,${records.filter(r => r.examPassed).length}`,
    '',
    'Detail par chapitre :',
    '',
    'ID,Chapitre,Programme,Cours,Quiz,Examen',
  ]

  chapters.forEach(ch => {
    const r = records.find(rec => rec.chapterSlug === ch.slug)
    lines.push([
      ch.id,
      escapeCSV(ch.title),
      escapeCSV(getProgramme(ch.id)),
      r?.courseCompleted ? 'Oui' : 'Non',
      r?.quizScore !== null && r?.quizScore !== undefined ? `${r.quizScore}%` : '-',
      r?.examScore !== null && r?.examScore !== undefined ? `${r.examScore}%` : '-',
    ].join(','))
  })

  const csv = lines.join('\n')
  const date = new Date().toISOString().split('T')[0]
  downloadCSV(csv, `netrevision_analytics_${date}.csv`)
}
