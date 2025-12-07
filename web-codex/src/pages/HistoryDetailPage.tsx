import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, FileText, BookOpen } from 'lucide-react'

const historySections = [
  { id: 'jour_dans_empire', title: 'Un jour dans l\'Empire' },
  { id: 'guide_citoyen', title: 'Guide du Citoyen' },
  { id: 'introduction', title: 'Introduction' },
  { id: 'resume_historique', title: 'Résumé historique' },
  { id: 'contexte_militaire', title: 'Contexte militaire' },
  { id: 'contexte_politique', title: 'Contexte politique' },
  { id: 'contexte_economique', title: 'Contexte économique' },
  { id: 'arcanotechnie', title: 'Arcanotechnie et technologie' },
  { id: 'contexte_social', title: 'Contexte social et culturel' }
]

export function HistoryDetailPage() {
  const { section } = useParams<{ section: string }>()
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const currentSection = historySections.find(s => s.id === section)

  useEffect(() => {
    if (!section) {
      setError('Section non spécifiée')
      setLoading(false)
      return
    }

    const fetchContent = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/history/${section}.md`)

        if (!response.ok) {
          throw new Error(`Erreur lors du chargement: ${response.status}`)
        }

        const text = await response.text()
        setContent(text)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de chargement')
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [section])

  if (!currentSection) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/histoire">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Retour à l'histoire
            </Button>
          </Link>
        </div>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-muted-foreground">Section non trouvée</h1>
          <p className="text-muted-foreground mt-2">
            La section "{section}" n'existe pas.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/histoire">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Retour à l'histoire
            </Button>
          </Link>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement de la section...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/histoire">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Retour à l'histoire
            </Button>
          </Link>
        </div>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-600">Erreur de chargement</h1>
          <p className="text-muted-foreground mt-2">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/histoire">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Retour à l'histoire
            </Button>
          </Link>
        </div>

        <Badge variant="outline" className="flex items-center gap-2">
          <FileText className="h-3 w-3" />
          Histoire
        </Badge>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <BookOpen className="h-8 w-8" />
          {currentSection.title}
        </h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-2xl font-bold mb-4 mt-8 first:mt-0">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl font-semibold mb-3 mt-6">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-semibold mb-2 mt-4">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="mb-4 leading-relaxed">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="leading-relaxed">{children}</li>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-foreground">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="italic">{children}</em>
                ),
                code: ({ children }) => (
                  <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
                    {children}
                  </pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-muted-foreground/25 pl-4 italic my-4">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-6">
                    <table className="w-full border-collapse border border-border rounded-lg overflow-hidden">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-muted/70">
                    {children}
                  </thead>
                ),
                tbody: ({ children }) => (
                  <tbody className="divide-y divide-border">
                    {children}
                  </tbody>
                ),
                th: ({ children }) => (
                  <th className="border-r border-border last:border-r-0 px-4 py-3 text-left font-semibold text-sm">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border-r border-border last:border-r-0 px-4 py-3 text-sm">
                    {children}
                  </td>
                ),
                tr: ({ children }) => (
                  <tr className="hover:bg-muted/30 transition-colors">
                    {children}
                  </tr>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
