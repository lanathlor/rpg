import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  Sword,
  Shield,
  Sparkles,
  Users,
  Zap,
  Package,
  Search,
  Home,
  BookOpen,
  Scroll,
} from 'lucide-react'

const navigationItems = [
  {
    name: 'Accueil',
    href: '/',
    icon: Home,
  },
  {
    name: 'Règles',
    href: '/regles',
    icon: BookOpen,
    description: 'Système de jeu et mécaniques',
  },
  {
    name: 'Sorts',
    href: '/sorts',
    icon: Sparkles,
    description: 'Quantotechnique et sortilèges',
  },
  {
    name: 'Armes',
    href: '/armes',
    icon: Sword,
    description: 'Armes de corps à corps et à distance',
  },
  {
    name: 'Équipements',
    href: '/equipements',
    icon: Shield,
    description: 'Armures, implants et équipements tactiques',
  },
  {
    name: 'Classes',
    href: '/classes',
    icon: Users,
    description: 'Classes de personnages',
  },
  {
    name: 'Compétences',
    href: '/competences',
    icon: Zap,
    description: 'Capacités spéciales',
  },
  {
    name: 'Consommables',
    href: '/consommables',
    icon: Package,
    description: 'Objets utilisables',
  },
  {
    name: 'Histoire',
    href: '/histoire',
    icon: Scroll,
    description: 'Chroniques du monde',
  },
  {
    name: 'Rechercher',
    href: '/search',
    icon: Search,
    description: 'Recherche globale',
  },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <div className="pb-12 w-64">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Codex RPG
          </h2>
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span>{item.name}</span>
                    {item.description && (
                      <span className="text-xs opacity-70">
                        {item.description}
                      </span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}