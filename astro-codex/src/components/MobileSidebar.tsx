import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface MobileSidebarProps {
  base: string;
  pathname: string;
}

const navigationItems = [
  { name: 'Accueil', href: '/', description: '' },
  { name: 'Règles', href: '/regles/', description: 'Système de jeu et mécaniques' },
  { name: 'Histoire', href: '/histoire/', description: 'Chroniques du monde' },
  { name: 'Scénarios', href: '/scenarios/', description: 'Aventures one-shot et campagnes' },
  { name: 'Sorts', href: '/sorts/', description: 'Arcanotechnie et sortilèges' },
  { name: 'Armes', href: '/armes/', description: 'Armes de corps à corps et à distance' },
  { name: 'Équipements', href: '/equipements/', description: 'Armures, implants et équipements' },
  { name: 'Compétences', href: '/competences/', description: 'Capacités spéciales' },
  { name: 'Consommables', href: '/consommables/', description: 'Objets utilisables' },
  { name: 'Classes', href: '/classes/', description: 'Classes de personnages' },
  { name: 'Entités', href: '/entites/', description: 'PNJ et créatures' },
  { name: 'Personnages', href: '/personnages/', description: 'Créer et gérer vos personnages' },
  { name: 'Rechercher', href: '/search/', description: 'Recherche globale' },
];

function isActive(href: string, base: string, pathname: string): boolean {
  const fullHref = base + href.replace(/^\//, '');
  if (href === '/') {
    return pathname === base || pathname === base.replace(/\/$/, '');
  }
  return pathname.startsWith(fullHref);
}

export function MobileSidebar({ base, pathname }: MobileSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="md:hidden inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="pb-12">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Codex RPG
              </h2>
              <div className="space-y-1">
                {navigationItems.map((item) => (
                  <a
                    key={item.name}
                    href={`${base}${item.href.replace(/^\//, '')}`}
                    onClick={() => setOpen(false)}
                    className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors ${
                      isActive(item.href, base, pathname)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span>{item.name}</span>
                      {item.description && (
                        <span className="text-xs opacity-70">{item.description}</span>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
