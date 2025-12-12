import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { ErrorBoundary } from '@/components/ErrorBoundary'

// Lazy load all page components for code splitting
const HomePage = lazy(() => import('@/pages/HomePage').then(m => ({ default: m.HomePage })))
const SpellsPage = lazy(() => import('@/pages/SpellsPage').then(m => ({ default: m.SpellsPage })))
const WeaponsPage = lazy(() => import('@/pages/WeaponsPage').then(m => ({ default: m.WeaponsPage })))
const EquipmentsPage = lazy(() => import('@/pages/EquipmentsPage').then(m => ({ default: m.EquipmentsPage })))
const SkillsPage = lazy(() => import('@/pages/SkillsPage').then(m => ({ default: m.SkillsPage })))
const ConsumablesPage = lazy(() => import('@/pages/ConsumablesPage').then(m => ({ default: m.ConsumablesPage })))
const ClassesPage = lazy(() => import('@/pages/ClassesPage').then(m => ({ default: m.ClassesPage })))
const ClassDetailPage = lazy(() => import('@/pages/ClassDetailPage').then(m => ({ default: m.ClassDetailPage })))
const CharactersPage = lazy(() => import('@/pages/CharactersPage').then(m => ({ default: m.CharactersPage })))
const CharacterCreatorPage = lazy(() => import('@/pages/CharacterCreatorPage').then(m => ({ default: m.CharacterCreatorPage })))
const RulesPage = lazy(() => import('@/pages/RulesPage').then(m => ({ default: m.RulesPage })))
const RuleDetailPage = lazy(() => import('@/pages/RuleDetailPage').then(m => ({ default: m.RuleDetailPage })))
const HistoryPage = lazy(() => import('@/pages/HistoryPage').then(m => ({ default: m.HistoryPage })))
const HistoryDetailPage = lazy(() => import('@/pages/HistoryDetailPage').then(m => ({ default: m.HistoryDetailPage })))
const ScenariosPage = lazy(() => import('@/pages/ScenariosPage').then(m => ({ default: m.ScenariosPage })))
const SearchPage = lazy(() => import('@/pages/SearchPage').then(m => ({ default: m.SearchPage })))

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-[50vh]">
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <p className="text-muted-foreground">Chargement...</p>
    </div>
  </div>
)

// Wrapper to add Suspense to lazy-loaded components
const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType>) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: withSuspense(HomePage),
      },
      {
        path: 'sorts',
        element: withSuspense(SpellsPage),
      },
      {
        path: 'armes',
        element: withSuspense(WeaponsPage),
      },
      {
        path: 'equipements',
        element: withSuspense(EquipmentsPage),
      },
      {
        path: 'classes',
        element: withSuspense(ClassesPage),
      },
      {
        path: 'classes/:className',
        element: withSuspense(ClassDetailPage),
      },
      {
        path: 'personnages',
        element: withSuspense(CharactersPage),
      },
      {
        path: 'personnages/nouveau',
        element: (
          <ErrorBoundary>
            {withSuspense(CharacterCreatorPage)}
          </ErrorBoundary>
        ),
      },
      {
        path: 'personnages/:characterId',
        element: (
          <ErrorBoundary>
            {withSuspense(CharacterCreatorPage)}
          </ErrorBoundary>
        ),
      },
      {
        path: 'competences',
        element: withSuspense(SkillsPage),
      },
      {
        path: 'consommables',
        element: withSuspense(ConsumablesPage),
      },
      {
        path: 'regles',
        element: withSuspense(RulesPage),
      },
      {
        path: 'regles/:section',
        element: withSuspense(RuleDetailPage),
      },
      {
        path: 'histoire',
        element: withSuspense(HistoryPage),
      },
      {
        path: 'histoire/:section',
        element: withSuspense(HistoryDetailPage),
      },
      {
        path: 'scenarios',
        element: withSuspense(ScenariosPage),
      },
      {
        path: 'search',
        element: withSuspense(SearchPage),
      },
    ],
  },
], {
  basename: import.meta.env.BASE_URL,
})