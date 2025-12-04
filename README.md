# Physics-Based Tabletop RPG System

A French-language tabletop RPG system with a unified physics-based resistance mechanism, where "magic" (Flux/Arcanotechnique) creates real physical phenomena governed by physics laws.

## Repository Structure

```
├── rules/                # Game rules in Markdown (French)
├── codex/               # Game data in YAML format
│   ├── sorts/          # Spells organized by type
│   ├── equipements/    # Weapons, armor, items
│   ├── classes/        # Character classes
│   ├── competences/    # Skills
│   └── sorts_series/   # Spell series definitions
├── web-codex/          # React web viewer application
│   └── web-codex/     # Main application directory
├── sorts/              # Legacy spell format (being migrated)
└── CLAUDE.md           # AI assistant instructions

```

## Core Concept: The Resistance System

This RPG uses a **unified physics-based damage system**. There are NO "magic damage" or separate damage types. The Flux creates real physical phenomena that follow physics laws.

### Three Resistance Types

All damage is resisted by one of three resistances based on the **physical nature** of the effect:

-   **RMEC (Résistance Mécanique)** - Kinetic/mechanical damage: impacts, projectiles, pressure, shockwaves
-   **RRAD (Résistance Radiative)** - Energy/thermal damage: fire, cold, electricity, light, radiation
-   **RINT (Résistance Interne)** - Internal/metabolic damage: life drain, necrosis, corruption, internal effects

**Critical Rule:** What matters is the PHYSICAL NATURE of the effect, not its source.

-   Fireball spell → RRAD damage (thermal)
-   Magic ice javelin → RMEC damage (kinetic projectile)
-   Life drain → RINT damage (internal)

See `/rules/07_systeme_de_resistances.md` for complete reference.

## Getting Started

### Prerequisites

-   Node.js 18+ and pnpm
-   Git
-   Text editor (VSCode recommended)

**Install pnpm:**
```bash
npm install -g pnpm
```

### Development Setup

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd rpg
    ```

2. **Web Codex Development**

    ```bash
    cd web-codex/web-codex
    pnpm install
    pnpm dev
    ```

    The application will be available at `http://localhost:5173`

3. **Available Commands**
    ```bash
    pnpm dev              # Start development server
    pnpm build            # Build for production
    pnpm preview          # Preview production build
    pnpm lint             # Run ESLint
    pnpm lint:fix         # Auto-fix linting issues
    pnpm format           # Format with Prettier
    pnpm typecheck        # TypeScript type checking
    pnpm test             # Run tests
    ```

## Contributing to Game Content

### YAML Data Structure

All game data follows strict YAML schemas. Templates are provided in `/codex/`.

#### Spells (`/codex/sorts/`)

Spells are organized by type: `destruction/`, `alteration/`, `amelioration/`, `arme/`, etc.

**Template:** `/codex/SPELL_TEMPLATE.yaml`

**Required fields:**

-   `spell_series`: Unique identifier
-   `school`: Spell school (feu, glace, foudre, etc.)
-   `type`: Spell type (destruction, alteration, amélioration, etc.)
-   `levels`: Array of spell levels
    -   `level`: Level as string (e.g., "1", "2")
    -   `effects.resistance`: **MUST** specify RMEC, RRAD, or RINT based on physical nature
    -   Affinity requirements: `école_requirement`, `type_requirement`, `mixed_requirement`

**Example:**

```yaml
spell_series: 'Boule de feu'
school: feu
type: destruction
levels:
    - level: '1'
      conditions:
          cast_time: 'action principale'
          range: '30m'
          flux_cost: '2'
      effects:
          damage: '2d6+3 feu'
          resistance: 'RRAD' # Fire = radiative damage
          area: 'rayon de 3m'
```

#### Equipment (`/codex/equipements/`)

Equipment uses the new resistance format:

```yaml
stats:
    RMEC: '+2' # Mechanical resistance bonus
    RRAD: '+1' # Radiative resistance bonus
    RINT: '+0' # Internal resistance bonus
    speed_bonus: '+1'
```

Legacy `protection_bonus` field is being phased out.

#### Character Classes (`/codex/classes/`)

Character class definitions with base stats, equipment, and starting spells.

```yaml
name: 'Nom de la classe'
description: 'Description...'
base_stats:
    health: 20
    flux_reserve: 10
equipment:
    weapons: ['Arme de départ']
    armor: ['Armure de départ']
spells: ['Sort 1', 'Sort 2']
```

### Assigning Resistance Types

When creating new content, think about the **physical mechanism**:

-   **Does it hit with force?** → RMEC (projectiles, impacts, pressure)
-   **Does it burn/freeze/shock?** → RRAD (thermal, electrical, light)
-   **Does it drain life internally?** → RINT (necrosis, life drain, corruption)
-   **Mixed effects?** → Use "RMEC + RRAD" or appropriate combination

### YAML Formatting Conventions

-   Levels as strings: `level: "1"` not `level: 1`
-   Time format: `"X sec"` or `"instantané"`, never `"X secs"` or `"aucun"`
-   Consistent field names across all files
-   Use 2-space indentation

## Web Codex Architecture

The web viewer is a React + TypeScript application built with Vite.

### Tech Stack

-   **React 19** - UI framework
-   **TypeScript** - Type safety
-   **Vite** - Build tool and dev server
-   **React Router** - Client-side routing
-   **Tailwind CSS** - Styling
-   **shadcn/ui** - Component library
-   **js-yaml** - YAML parsing
-   **Vitest** - Testing framework

### Project Structure

```
web-codex/web-codex/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui base components
│   │   ├── character/      # Character creator components
│   │   ├── SpellDetail.tsx # Spell detail view
│   │   └── ...
│   ├── pages/              # Route pages
│   │   ├── SpellsPage.tsx
│   │   ├── CharactersPage.tsx
│   │   └── ...
│   ├── lib/                # Utilities and data loading
│   │   ├── dataProvider.ts # Central data loading
│   │   ├── yamlLoader.ts   # YAML parsing utilities
│   │   └── ...
│   ├── types/              # TypeScript type definitions
│   │   ├── spells.ts
│   │   ├── armor.ts
│   │   └── ...
│   └── hooks/              # Custom React hooks
├── public/                 # Static assets
└── codex/                  # Symlink to /codex/ directory
```

### Key Type Definitions

**Spell Effects (`src/types/spells.ts`):**

```typescript
effects: {
  damage?: string
  resistance?: string  // RMEC | RRAD | RINT
  defense?: string
  protection?: string
  // ... other effect types
}
```

**Armor Stats (`src/types/armor.ts`):**

```typescript
stats: {
  RMEC?: string      // New resistance system
  RRAD?: string
  RINT?: string
  protection_bonus?: string  // Legacy field
}
```

### Data Loading

The application loads YAML files at build time via Vite's static asset handling:

1. **Data Provider** (`src/lib/dataProvider.ts`) - Central hooks for loading data

    - `useSpells()` - Load all spells
    - `useWeapons()` - Load weapons
    - `useArmors()` - Load armor
    - `useClasses()` - Load character classes
    - etc.

2. **YAML Loader** (`src/lib/yamlLoader.ts`) - YAML parsing and validation utilities

3. **Type Safety** - All data is typed with TypeScript interfaces matching YAML schemas

### Character Creator

The character creator allows users to:

-   Create characters from scratch or from class templates
-   Manage stats, equipment, spells, and skills
-   Track point buy budget and legality
-   Export characters to YAML or PDF
-   Import characters from YAML

**Key Features:**

-   Auto-save every 500ms
-   Real-time legality checking
-   Prerequisite validation
-   Budget tracking
-   YAML import/export

### UI Components

The application uses **shadcn/ui** components with Tailwind CSS:

-   **Resistance Badges:** Color-coded by type (RMEC: stone, RRAD: orange, RINT: purple)
-   **Tooltips:** Hover tooltips on equipment/spells showing effect summaries
-   **Number Inputs:** Custom styled increment/decrement buttons
-   **Dialogs:** For confirmations, imports, and detail views

## Development Guidelines

### Code Style

-   Use TypeScript for all new code
-   Follow React best practices (hooks, functional components)
-   Use optional chaining for YAML field access (`spell?.effects?.damage`)
-   Write descriptive variable names (English for code, French for game terms)
-   Add comments for complex logic

### Adding New Features

1. **Check existing patterns** - Look at similar features first
2. **Update types** - Add TypeScript interfaces for new data structures
3. **Update YAML schemas** - Document new fields in templates
4. **Test thoroughly** - Verify with real game data
5. **Update documentation** - Keep README and CLAUDE.md current

### Testing

```bash
pnpm test              # Run all tests
pnpm test:watch        # Watch mode
pnpm test:ui           # Visual test UI
```

Write tests for:

-   Data parsing and validation
-   Complex calculations (point buy, legality checks)
-   Critical user flows

### Git Workflow

1. Create feature branch from `main`
2. Make changes with clear commit messages
3. Test locally before committing
4. Push and create pull request
5. Address review feedback

**Commit Message Format:**

```
feat: add resistance tooltips to spell cards
fix: correct YAML parsing for consumable effects
docs: update contribution guidelines
```

## Language Conventions

-   **Game content:** All French (rules, spells, UI labels, descriptions)
-   **Code:** English variable names, French only for game-specific terms
-   **Comments:** English or French (either is acceptable)
-   **Documentation:** English for technical docs, French for game docs

## Common Issues

### YAML Parsing Errors

-   Ensure proper indentation (2 spaces)
-   Quote strings with special characters
-   Use consistent field names
-   Check resistance field is present in spell effects

### Build Errors

```bash
# Clear cache and rebuild
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

### Type Errors

```bash
# Run type checking
pnpm typecheck
```

Fix type errors by:

-   Adding missing properties to interfaces
-   Using optional chaining (`?.`)
-   Adding type guards for runtime checks

## Resources

-   **Game Rules:** `/rules/` directory
-   **YAML Templates:** `/codex/SPELL_TEMPLATE.yaml`
-   **AI Instructions:** `/CLAUDE.md`
-   **Resistance System:** `/rules/07_systeme_de_resistances.md`
-   **Glossary:** `/rules/09_lexique.md`

## Project Status

**Active Development:**

-   ✅ Core resistance system implemented
-   ✅ Web codex viewer functional
-   ✅ Character creator with point buy
-   ✅ YAML import/export
-   🔄 Migrating legacy spells to YAML
-   🔄 Equipment prerequisite system
-   📋 Planned: Campaign management tools

## License

[Add license information]

## Contact

[Add contact information or Discord/forum links]
