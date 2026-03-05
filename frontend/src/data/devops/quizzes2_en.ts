import type { QuizQuestion } from '../quizzes'
import { quizzes as quizzes_fr } from './quizzes2'

// TODO: Replace with proper English translations
export const quizzes: Record<number, QuizQuestion[]> = { ...quizzes_fr }
