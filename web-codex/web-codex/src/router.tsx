import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/pages/HomePage'
import { SpellsPage } from '@/pages/SpellsPage'
import { WeaponsPage } from '@/pages/WeaponsPage'
import { EquipmentsPage } from '@/pages/EquipmentsPage'
import { SkillsPage } from '@/pages/SkillsPage'
import { ConsumablesPage } from '@/pages/ConsumablesPage'
import { ClassesPage } from '@/pages/ClassesPage'
import { ClassDetailPage } from '@/pages/ClassDetailPage'
import { RulesPage } from '@/pages/RulesPage'
import { RuleDetailPage } from '@/pages/RuleDetailPage'
import { HistoryPage } from '@/pages/HistoryPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'sorts',
        element: <SpellsPage />,
      },
      {
        path: 'armes',
        element: <WeaponsPage />,
      },
      {
        path: 'equipements',
        element: <EquipmentsPage />,
      },
      {
        path: 'classes',
        element: <ClassesPage />,
      },
      {
        path: 'classes/:className',
        element: <ClassDetailPage />,
      },
      {
        path: 'competences',
        element: <SkillsPage />,
      },
      {
        path: 'consommables',
        element: <ConsumablesPage />,
      },
      {
        path: 'regles',
        element: <RulesPage />,
      },
      {
        path: 'regles/:section',
        element: <RuleDetailPage />,
      },
      {
        path: 'histoire',
        element: <HistoryPage />,
      },
      {
        path: 'search',
        element: <div>Search page (à implémenter)</div>,
      },
    ],
  },
])