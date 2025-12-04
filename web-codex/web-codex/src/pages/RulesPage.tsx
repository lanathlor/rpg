import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BookOpen,
  Swords,
  Sparkles,
  Target,
  DicesIcon,
  Zap,
  ArrowRight,
  Shield,
  Users
} from 'lucide-react'

const rulesSections = [
  {
    id: '00_introduction',
    title: 'Introduction',
    description: 'Présentation générale du système de jeu et des concepts de base',
    icon: <BookOpen className="h-5 w-5" />,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    category: 'Fondamentaux'
  },
  {
    id: '01_bases_des_regles',
    title: 'Bases des règles',
    description: 'Mécaniques fondamentales et règles de base du jeu',
    icon: <Target className="h-5 w-5" />,
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    category: 'Fondamentaux'
  },
  {
    id: '02_combat',
    title: 'Combat',
    description: 'Système de combat, initiative, attaques et défense',
    icon: <Swords className="h-5 w-5" />,
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    category: 'Combat'
  },
  {
    id: '03_systeme_affinites_et_types',
    title: 'Système d\'affinités et types',
    description: 'Affinités arcanotechniques, types de sorts et système d\'accès',
    icon: <Sparkles className="h-5 w-5" />,
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    category: 'Arcanotechnie'
  },
  {
    id: '04_ecoles_d_arcanotechnique',
    title: 'Écoles d\'arcanotechnique',
    description: 'Présentation des différentes écoles d\'arcanotechnique et leurs spécificités',
    icon: <Sparkles className="h-5 w-5" />,
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    category: 'Arcanotechnie'
  },
  {
    id: '05_regles_jet_de_des',
    title: 'Règles de jet de dés',
    description: 'Système de résolution des actions et calcul des probabilités',
    icon: <DicesIcon className="h-5 w-5" />,
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    category: 'Fondamentaux'
  },
  {
    id: '06_systeme_de_mana',
    title: 'Système de mana',
    description: 'Gestion des ressources arcanotechniques et flux d\'énergie',
    icon: <Zap className="h-5 w-5" />,
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    category: 'Arcanotechnie'
  },
  {
    id: '07_systeme_de_resistances',
    title: 'Système de résistances',
    description: 'Résistances physiques RMEC, RRAD et RINT',
    icon: <Shield className="h-5 w-5" />,
    color: 'bg-stone-100 text-stone-800 dark:bg-stone-900 dark:text-stone-300',
    category: 'Combat'
  },
  {
    id: '10_creation_personnage',
    title: 'Création de personnage',
    description: 'Système de Point Buy pour créer des personnages équilibrés',
    icon: <Users className="h-5 w-5" />,
    color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
    category: 'Fondamentaux'
  },
  {
    id: '09_lexique',
    title: 'Lexique',
    description: 'Définitions et terminologie du système de jeu',
    icon: <BookOpen className="h-5 w-5" />,
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    category: 'Référence'
  },
  {
    id: '11_comment_contribuer',
    title: 'Comment contribuer',
    description: 'Guide pour participer au développement du jeu et créer du contenu',
    icon: <Users className="h-5 w-5" />,
    color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    category: 'Référence'
  }
]

const categories = [...new Set(rulesSections.map(section => section.category))].sort()

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Fondamentaux':
      return <Target className="h-4 w-4" />
    case 'Combat':
      return <Swords className="h-4 w-4" />
    case 'Arcanotechnie':
      return <Sparkles className="h-4 w-4" />
    case 'Référence':
      return <BookOpen className="h-4 w-4" />
    default:
      return <BookOpen className="h-4 w-4" />
  }
}

export function RulesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Règles du jeu</h1>
        <p className="text-lg text-muted-foreground">
          Guide complet des règles et mécaniques du système de jeu
        </p>
      </div>

      {categories.map((category) => (
        <div key={category} className="space-y-4">
          <div className="flex items-center gap-2">
            {getCategoryIcon(category)}
            <h2 className="text-xl font-semibold">{category}</h2>
            <Badge variant="outline">
              {rulesSections.filter(section => section.category === category).length} section{rulesSections.filter(section => section.category === category).length > 1 ? 's' : ''}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rulesSections
              .filter(section => section.category === category)
              .map((section) => (
                <Link
                  key={section.id}
                  to={`/regles/${section.id}`}
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