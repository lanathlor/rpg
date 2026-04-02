# Pyrrhic Stars - Sci-Fi Tabletop RPG

A bilingual (FR/EN) sci-fi tabletop RPG set in a galactic empire during the final decade of a centuries-long interstellar war. The Flux, an advanced arcanotechnology, manipulates physical laws through science, not magic.

**[Play online](https://lanathlor.github.io/rpg/)** | Rules, codex, lore, and character creator

## Repository Structure

```
├── astro-codex/         # Astro 6 static site (production)
├── rules/               # Game rules in Markdown (FR + EN)
├── history/             # Lore and worldbuilding (FR + EN)
├── codex/               # Game data in YAML (i18n structure)
│   ├── spells/         # Arcanotechnic techniques by type
│   ├── weapons/        # Weapons
│   ├── equipment/      # Armor and gear
│   ├── classes/        # Character classes
│   ├── skills/         # Skills
│   ├── consumables/    # Consumable items
│   ├── entities/       # Bestiary
│   └── scenarios/      # Game scenarios
├── web-codex/          # Legacy React viewer (deprecated)
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

-   Flux fireball → RRAD damage (thermal)
-   Arcanotechnic ice javelin → RMEC damage (kinetic projectile)
-   Life drain → RINT damage (internal)

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

2. **Astro Codex (production site)**

    ```bash
    cd astro-codex
    npm install
    npm run dev
    ```

    The application will be available at `http://localhost:4321`

3. **Available Commands**
    ```bash
    npm run dev              # Start development server
    npm run build            # Build for production
    npm run preview          # Preview production build
    npm run lint             # Run ESLint
    npm run lint:fix         # Auto-fix linting issues
    npm run format           # Format with Prettier
    npm run typecheck        # TypeScript type checking
    npm test                 # Run tests
    ```

## Contributing to Game Content

### Images and Assets

**⚠️ AI-Generated Images Disclaimer:**

Currently, the images in this project are **generated using AI tools** (such as DALL-E, Midjourney, or similar). The project maintainer is not a visual artist and cannot create these illustrations independently.

This is a **temporary solution**. We are actively seeking:

-   **Volunteer artists** to replace AI-generated images with original artwork
-   **Commissioned artwork** as resources become available
-   **Community contributions** from skilled artists who share our vision

If you are an artist interested in contributing original artwork to this project, please reach out! We would love to collaborate and replace AI-generated content with authentic human-created art.

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

This project uses a **dual-license** approach:

-   **Game Content** (rules, spells, equipment, etc.): [Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/)
-   **Software Code** (web application, tools, etc.): [MIT License](https://opensource.org/licenses/MIT)

This means:

-   ✅ You can use, modify, and distribute the game content freely (even commercially) as long as you provide attribution and share your modifications under the same license
-   ✅ You can use, modify, and distribute the software code freely (even commercially) with minimal restrictions
-   ✅ You can create your own games based on this system
-   ✅ You can run commercial campaigns using these rules
-   ✅ You can publish adventures and supplements

See [LICENSE.md](LICENSE.md) for full details and attribution guidelines.

### Contributing

By contributing to this project, you agree that your contributions will be licensed under the same terms (CC BY-SA 4.0 for game content, MIT for code).

**Note on AI-Generated Images:**
Current images are AI-generated as a temporary measure. We welcome contributions from artists to replace these with original artwork. If you're interested in contributing illustrations, please reach out to discuss collaboration opportunities.

## Contact
