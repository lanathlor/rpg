import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Clock,
  BookOpen,
  Shield,
  Users,
  TrendingUp,
  Sparkles,
  ArrowRight,
} from 'lucide-react'

const historySections = [
  {
    id: 'introduction',
    title: 'Introduction',
    description: 'Vue d\'ensemble de l\'histoire et chronologie des périodes clés',
    icon: <Clock className="h-5 w-5" />,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    category: 'Chronologie'
  },
  {
    id: 'resume_historique',
    title: 'Résumé historique',
    description: 'Fondation de l\'Empire, expansion et guerre avec les Acéras',
    icon: <BookOpen className="h-5 w-5" />,
    color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
    category: 'Chronologie'
  },
  {
    id: 'contexte_militaire',
    title: 'Contexte militaire',
    description: 'Structure de l\'armée impériale et catégories d\'unités',
    icon: <Shield className="h-5 w-5" />,
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    category: 'Contexte'
  },
  {
    id: 'contexte_politique',
    title: 'Contexte politique',
    description: 'Le Conseil des Gardiens et la structure gouvernementale de l\'Empire',
    icon: <Users className="h-5 w-5" />,
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    category: 'Contexte'
  },
  {
    id: 'contexte_economique',
    title: 'Contexte économique',
    description: 'Économie, technologie de voyage et production industrielle',
    icon: <TrendingUp className="h-5 w-5" />,
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    category: 'Contexte'
  },
  {
    id: 'arcanotechnie',
    title: 'Arcanotechnie et technologie',
    description: 'Nature fondamentale de l\'arcanotechnie et révolution technologique',
    icon: <Sparkles className="h-5 w-5" />,
    color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    category: 'Technologie'
  }
]

const categories = [...new Set(historySections.map(section => section.category))].sort()

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Chronologie':
      return <Clock className="h-4 w-4" />
    case 'Contexte':
      return <BookOpen className="h-4 w-4" />
    case 'Technologie':
      return <Sparkles className="h-4 w-4" />
    default:
      return <BookOpen className="h-4 w-4" />
  }
}

export function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Histoire du monde</h1>
        <p className="text-lg text-muted-foreground">
          Chroniques, contexte et légendes de l'univers de jeu
        </p>
      </div>

      {categories.map((category) => (
        <div key={category} className="space-y-4">
          <div className="flex items-center gap-2">
            {getCategoryIcon(category)}
            <h2 className="text-xl font-semibold">{category}</h2>
            <Badge variant="outline">
              {historySections.filter(section => section.category === category).length} section{historySections.filter(section => section.category === category).length > 1 ? 's' : ''}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {historySections
              .filter(section => section.category === category)
              .map((section) => (
                <Link
                  key={section.id}
                  to={`/histoire/${section.id}`}
                  className="block"
                >
                  <Card className="hover:shadow-lg transition-all cursor-pointer group h-full">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${section.color.replace('text-', 'bg-').replace('bg-', 'bg-opacity-20 text-')}`}>
                            {section.icon}
                          </div>
                          <div>
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                              {section.title}
                            </CardTitle>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <CardDescription className="line-clamp-3">
                        {section.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}
