import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useCodexData } from '@/lib/dataProvider'
import { Link } from 'react-router-dom'
import { Sparkles, Sword, Shield, Users, Zap, Package } from 'lucide-react'

const categoryStats = [
  { name: 'Sorts', icon: Sparkles, href: '/sorts', key: 'spells' },
  { name: 'Armes', icon: Sword, href: '/armes', key: 'weapons' },
  { name: 'Armures', icon: Shield, href: '/armures', key: 'armor' },
  { name: 'Classes', icon: Users, href: '/classes', key: 'classes' },
  { name: 'Compétences', icon: Zap, href: '/competences', key: 'skills' },
  { name: 'Consommables', icon: Package, href: '/consommables', key: 'consumables' },
]

export function HomePage() {
  const { data, loading, error } = useCodexData()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement du codex...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-destructive">Erreur: {error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Bienvenue dans le Codex RPG
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Explorez l'univers complet du jeu avec tous ses éléments détaillés.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryStats.map((category) => {
          const count = data?.[category.key as keyof typeof data]?.length || 0
          return (
            <Link key={category.name} to={category.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {category.name}
                  </CardTitle>
                  <category.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{count}</div>
                  <p className="text-xs text-muted-foreground">
                    {count === 1 ? 'élément' : 'éléments'}
                  </p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>À propos du Codex</CardTitle>
            <CardDescription>
              Guide complet pour naviguer dans l'univers du jeu
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Ce codex contient toutes les informations nécessaires pour jouer :
            </p>
            <ul className="text-sm space-y-2">
              <li>• <strong>Sorts :</strong> Magie et sortilèges avec leurs écoles et types</li>
              <li>• <strong>Armes :</strong> Équipements offensifs et leurs statistiques</li>
              <li>• <strong>Armures :</strong> Protection et équipements défensifs</li>
              <li>• <strong>Classes :</strong> Archétypes de personnages jouables</li>
              <li>• <strong>Compétences :</strong> Capacités spéciales et talents</li>
              <li>• <strong>Consommables :</strong> Objets utilisables en combat</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Navigation rapide</CardTitle>
            <CardDescription>
              Conseils pour utiliser efficacement le codex
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <p>• Utilisez la <strong>barre de recherche</strong> pour trouver rapidement un élément</p>
              <p>• Naviguez par <strong>catégorie</strong> via la sidebar</p>
              <p>• Cliquez sur les éléments pour voir les <strong>détails complets</strong></p>
              <p>• Utilisez le <strong>mode sombre/clair</strong> selon vos préférences</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}