import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { t } from '@/lib/i18n';

interface MobileSidebarProps {
  base: string;
  pathname: string;
}

function isActive(href: string, base: string, pathname: string): boolean {
  const fullHref = base + href.replace(/^\//, '');
  if (href === '/') {
    return pathname === base || pathname === base.replace(/\/$/, '');
  }
  return pathname.startsWith(fullHref);
}

export function MobileSidebar({ base, pathname }: MobileSidebarProps) {
  const [open, setOpen] = useState(false);

  const navigationItems = [
    { name: t('nav.home'), href: '/', description: '' },
    { name: t('nav.rules'), href: '/rules/', description: t('nav.rulesDesc') },
    { name: t('nav.history'), href: '/history/', description: t('nav.historyDesc') },
    { name: t('nav.scenarios'), href: '/scenarios/', description: t('nav.scenariosDesc') },
    { name: t('nav.spells'), href: '/spells/', description: t('nav.spellsDesc') },
    { name: t('nav.weapons'), href: '/weapons/', description: t('nav.weaponsDesc') },
    { name: t('nav.equipment'), href: '/equipment/', description: t('nav.equipmentDesc') },
    { name: t('nav.skills'), href: '/skills/', description: t('nav.skillsDesc') },
    { name: t('nav.consumables'), href: '/consumables/', description: t('nav.consumablesDesc') },
    { name: t('nav.classes'), href: '/classes/', description: t('nav.classesDesc') },
    { name: t('nav.entities'), href: '/entities/', description: t('nav.entitiesDesc') },
    { name: t('nav.characters'), href: '/characters/', description: t('nav.charactersDesc') },
    { name: t('nav.search'), href: '/search/', description: t('nav.searchDesc') },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="md:hidden inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9">
          <Menu className="h-5 w-5" />
          <span className="sr-only">{t('nav.menu')}</span>
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="pb-12">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                {t('nav.title')}
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
