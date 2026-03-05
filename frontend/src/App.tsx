import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom'
// framer-motion animations are handled per-page for compatibility with nested routes
import { useAuthStore } from './stores/authStore'
import { useThemeStore } from './stores/themeStore'
import { useLangStore } from './stores/langStore'
import { useProgressStore } from './stores/progressStore'
import { useNoteStore } from './stores/noteStore'
import { useFormationStore } from './stores/formationStore'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import FormationLayout from './components/FormationLayout'
import FormationRedirect from './components/FormationRedirect'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import Course from './pages/Course'
// CoursesPublic removed — /cours redirects to /reseaux for backward compat
import QuizPage from './pages/QuizPage'
import Progress from './pages/Progress'
import FinalExamGeneric from './pages/FinalExamGeneric'
import Exams from './pages/Exams'
import SubnetCalculator from './pages/SubnetCalculator'
import Flashcards from './pages/Flashcards'
import Leaderboard from './pages/Leaderboard'
import Badges from './pages/Badges'
import Profile from './pages/Profile'
import Notes from './pages/Notes'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import SubnetExercises from './pages/SubnetExercises'
import CiscoSimulator from './pages/CiscoSimulator'
import MentionsLegales from './pages/MentionsLegales'
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite'
import CGU from './pages/CGU'
import Glossary from './pages/Glossary'
import PDFExport from './pages/PDFExport'
import ShareProgress from './pages/ShareProgress'
import AdaptivePath from './pages/AdaptivePath'
import RandomQuiz from './pages/RandomQuiz'
import Challenges from './pages/Challenges'
import DuelMode from './pages/DuelMode'
import NetworkDiagram from './pages/NetworkDiagram'
import Analytics from './pages/Analytics'
import AdminDashboard from './pages/AdminDashboard'
import Forum from './pages/Forum'
import Blog from './pages/Blog'
import BlogArticle from './pages/BlogArticle'
import AboutPage from './pages/AboutPage'
import AuthorPage from './pages/AuthorPage'
import NotFound from './pages/NotFound'
import ProtocolComparator from './pages/ProtocolComparator'
import AddressingPlan from './pages/AddressingPlan'
import PacketVisualizer from './pages/PacketVisualizer'
import SurvivalMode from './pages/SurvivalMode'
import MiniGames from './pages/MiniGames'
import RouteThePacket from './pages/RouteThePacket'
import MatchThePort from './pages/MatchThePort'
import BuildTheHeader from './pages/BuildTheHeader'
import CTFChallenge from './pages/CTFChallenge'
import CTFPlay from './pages/CTFPlay'
import CommunityQuiz from './pages/CommunityQuiz'
import CommunityQuizPlay from './pages/CommunityQuizPlay'
import SpacedRepetition from './pages/SpacedRepetition'
import ExportData from './pages/ExportData'
import TrainerDashboard from './pages/TrainerDashboard'
import UserLevels from './pages/UserLevels'
import MegaExam from './pages/MegaExam'
import LandingPage from './pages/LandingPage'
import FormationCatalog from './pages/FormationCatalog'

function CourseRedirect() {
  const { slug } = useParams<{ slug: string }>()
  return <Navigate to={`/reseaux/cours/${slug}`} replace />
}

function QuizRedirect() {
  const { slug } = useParams<{ slug: string }>()
  return <Navigate to={`/reseaux/quiz/${slug}`} replace />
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore()
  const lang = useLangStore((s) => s.lang)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="font-mono text-sm" style={{ color: 'var(--accent)' }}>{lang === 'en' ? 'Loading...' : 'Chargement...'}</div>
      </div>
    )
  }
  if (!isAuthenticated) return <Navigate to="/login" />
  return <>{children}</>
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  const { loadUser, isAuthenticated } = useAuthStore()
  const theme = useThemeStore((s) => s.theme)
  const lang = useLangStore((s) => s.lang)
  const loadProgress = useProgressStore((s) => s.load)
  const loadNotes = useNoteStore((s) => s.loadAll)
  const currentFormation = useFormationStore((s) => s.currentFormation)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])
  useEffect(() => {
    document.documentElement.setAttribute('lang', lang)
  }, [lang])
  useEffect(() => {
    document.documentElement.setAttribute('data-formation', currentFormation)
  }, [currentFormation])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  useEffect(() => {
    if (isAuthenticated) {
      loadProgress()
      loadNotes()
    }
  }, [isAuthenticated, loadProgress, loadNotes])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ScrollToTop />
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/mentions-legales" element={<MentionsLegales />} />
              <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
              <Route path="/cgu" element={<CGU />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogArticle />} />
              <Route path="/a-propos" element={<AboutPage />} />
              <Route path="/auteur" element={<AuthorPage />} />

              {/* Root: Landing (non-auth) or redirect to formation (auth) */}
              <Route path="/" element={isAuthenticated ? <FormationRedirect /> : <LandingPage />} />

              {/* Formation catalog (new SaaS design) */}
              <Route path="/formations" element={<ProtectedRoute><FormationCatalog /></ProtectedRoute>} />

              {/* Public formation routes — cours accessibles sans auth */}
              <Route path="/:formation" element={<FormationLayout />}>
                <Route index element={<Home />} />
                <Route path="cours" element={<Home />} />
                <Route path="cours/:slug" element={<Course />} />
              </Route>

              {/* Protected formation routes — tout le reste */}
              <Route path="/:formation" element={<ProtectedRoute><FormationLayout /></ProtectedRoute>}>
                <Route index element={<Home />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="cours" element={<Home />} />
                <Route path="quiz/:slug" element={<QuizPage />} />
                <Route path="progression" element={<Progress />} />
                <Route path="examens" element={<Exams />} />
                <Route path="examen/:examNum" element={<FinalExamGeneric />} />
                <Route path="examen-global" element={<MegaExam />} />
                <Route path="flashcards" element={<Flashcards />} />
                <Route path="glossaire" element={<Glossary />} />
                <Route path="simulateur-cli" element={<CiscoSimulator />} />
                <Route path="calculatrice" element={<SubnetCalculator />} />
                <Route path="exercices-subnetting" element={<SubnetExercises />} />
                <Route path="comparateur" element={<ProtocolComparator />} />
                <Route path="plan-adressage" element={<AddressingPlan />} />
                <Route path="visualiseur-paquet" element={<PacketVisualizer />} />
                <Route path="fiches-pdf" element={<PDFExport />} />
                <Route path="quiz-aleatoire" element={<RandomQuiz />} />
                <Route path="revision-espacee" element={<SpacedRepetition />} />
                <Route path="schemas-reseau" element={<NetworkDiagram />} />
                <Route path="export" element={<ExportData />} />
                {/* Formation-specific game/feature routes */}
                <Route path="mini-jeux" element={<MiniGames />} />
                <Route path="mini-jeux/route-packet" element={<RouteThePacket />} />
                <Route path="mini-jeux/match-port" element={<MatchThePort />} />
                <Route path="mini-jeux/build-header" element={<BuildTheHeader />} />
                <Route path="survie" element={<SurvivalMode />} />
                <Route path="duel" element={<DuelMode />} />
                <Route path="ctf" element={<CTFChallenge />} />
                <Route path="ctf/:challengeId" element={<CTFPlay />} />
                <Route path="defis" element={<Challenges />} />
                <Route path="parcours" element={<AdaptivePath />} />
                <Route path="quiz-communautaire" element={<CommunityQuiz />} />
                <Route path="quiz-communautaire/jouer" element={<CommunityQuizPlay />} />
                <Route path="formateur" element={<TrainerDashboard />} />
              </Route>

              {/* Global routes (no formation prefix needed) */}
              <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
              <Route path="/badges" element={<ProtectedRoute><Badges /></ProtectedRoute>} />
              <Route path="/profil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/forum" element={<ProtectedRoute><Forum /></ProtectedRoute>} />
              <Route path="/niveaux" element={<ProtectedRoute><UserLevels /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="/partage" element={<ProtectedRoute><ShareProgress /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

              {/* Backward-compatible redirects (old URLs → new formation-prefixed URLs) */}
              <Route path="/cours" element={<Navigate to="/reseaux" replace />} />
              <Route path="/cours/:slug" element={<CourseRedirect />} />
              <Route path="/examens" element={<Navigate to="/reseaux/examens" replace />} />
              <Route path="/examen" element={<Navigate to="/reseaux/examen/1" replace />} />
              <Route path="/examen-avance" element={<Navigate to="/reseaux/examen/2" replace />} />
              <Route path="/examen-entreprise" element={<Navigate to="/reseaux/examen/3" replace />} />
              <Route path="/examen-expert" element={<Navigate to="/reseaux/examen/4" replace />} />
              <Route path="/examen-wireless" element={<Navigate to="/reseaux/examen/5" replace />} />
              <Route path="/examen-automation" element={<Navigate to="/reseaux/examen/6" replace />} />
              <Route path="/examen-global" element={<Navigate to="/reseaux/examen-global" replace />} />
              <Route path="/progression" element={<Navigate to="/reseaux/progression" replace />} />
              <Route path="/flashcards" element={<Navigate to="/reseaux/flashcards" replace />} />
              <Route path="/glossaire" element={<Navigate to="/reseaux/glossaire" replace />} />
              <Route path="/simulateur-cli" element={<Navigate to="/reseaux/simulateur-cli" replace />} />
              <Route path="/calculatrice" element={<Navigate to="/reseaux/calculatrice" replace />} />
              <Route path="/exercices-subnetting" element={<Navigate to="/reseaux/exercices-subnetting" replace />} />
              <Route path="/comparateur" element={<Navigate to="/reseaux/comparateur" replace />} />
              <Route path="/plan-adressage" element={<Navigate to="/reseaux/plan-adressage" replace />} />
              <Route path="/visualiseur-paquet" element={<Navigate to="/reseaux/visualiseur-paquet" replace />} />
              <Route path="/fiches-pdf" element={<Navigate to="/reseaux/fiches-pdf" replace />} />
              <Route path="/quiz-aleatoire" element={<Navigate to="/reseaux/quiz-aleatoire" replace />} />
              <Route path="/revision-espacee" element={<Navigate to="/reseaux/revision-espacee" replace />} />
              <Route path="/schemas-reseau" element={<Navigate to="/reseaux/schemas-reseau" replace />} />
              <Route path="/mini-jeux" element={<Navigate to="/reseaux/mini-jeux" replace />} />
              <Route path="/mini-jeux/*" element={<Navigate to="/reseaux/mini-jeux" replace />} />
              <Route path="/survie" element={<Navigate to="/reseaux/survie" replace />} />
              <Route path="/duel" element={<Navigate to="/reseaux/duel" replace />} />
              <Route path="/ctf" element={<Navigate to="/reseaux/ctf" replace />} />
              <Route path="/defis" element={<Navigate to="/reseaux/defis" replace />} />
              <Route path="/parcours" element={<Navigate to="/reseaux/parcours" replace />} />
              <Route path="/quiz-communautaire" element={<Navigate to="/reseaux/quiz-communautaire" replace />} />
              <Route path="/formateur" element={<Navigate to="/reseaux/formateur" replace />} />
              <Route path="/quiz/:slug" element={<QuizRedirect />} />

              <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
