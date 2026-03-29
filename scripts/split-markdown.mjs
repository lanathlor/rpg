#!/usr/bin/env node
/**
 * Splits large markdown files into subdirectories by ## headings.
 * Adds frontmatter (title, order) to all files.
 * Creates category-level index.md files.
 */

import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, readdirSync } from 'fs';
import { join, dirname, relative } from 'path';

const ROOT = join(import.meta.dirname, '..');
const RULES_DIR = join(ROOT, 'rules');
const HISTORY_DIR = join(ROOT, 'history');

// ─── Utility Functions ───────────────────────────────────────────────────────

function slugify(text) {
  return text
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '') // strip emoji
    .replace(/^[\d.]+\s*/, '') // strip leading numbers like "1. " or "2.5. "
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove accents
    .toLowerCase()
    .replace(/['']/g, '_')
    .replace(/[^a-z0-9]+/g, '_') // non-alphanum → _
    .replace(/^_+|_+$/g, '')     // trim underscores
    .replace(/_+/g, '_');        // collapse
}

function cleanTitle(heading) {
  return heading
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '') // strip emoji
    .replace(/^[\d.]+\s*/, '') // strip leading numbers
    .trim();
}

function makeFrontmatter({ title, order, description }) {
  let fm = `---\ntitle: "${title.replace(/"/g, '\\"')}"\norder: ${order}\n`;
  if (description) fm += `description: "${description.replace(/"/g, '\\"')}"\n`;
  fm += '---\n\n';
  return fm;
}

function parseMarkdown(content) {
  const lines = content.split('\n');
  let h1Title = '';
  let introLines = [];
  const sections = [];
  let currentSection = null;
  let pastH1 = false;

  for (const line of lines) {
    if (!pastH1 && line.startsWith('# ') && !line.startsWith('## ')) {
      h1Title = line.replace(/^# /, '').trim();
      pastH1 = true;
      continue;
    }
    if (line.startsWith('## ')) {
      if (currentSection) sections.push(currentSection);
      currentSection = {
        heading: line.replace(/^## /, '').trim(),
        lines: [],
      };
      continue;
    }
    if (!currentSection) {
      introLines.push(line);
    } else {
      currentSection.lines.push(line);
    }
  }
  if (currentSection) sections.push(currentSection);

  // Trim trailing empty lines from intro and sections
  while (introLines.length && introLines[introLines.length - 1].trim() === '') introLines.pop();
  while (introLines.length && introLines[0].trim() === '') introLines.shift();
  for (const s of sections) {
    while (s.lines.length && s.lines[s.lines.length - 1].trim() === '') s.lines.pop();
    while (s.lines.length && s.lines[0].trim() === '') s.lines.shift();
  }

  return { h1Title, intro: introLines.join('\n'), sections };
}

function adjustImagePaths(content, depthIncrease) {
  if (depthIncrease <= 0) return content;
  const prefix = '../'.repeat(depthIncrease);
  // Adjust markdown images: ![alt](images/...) and ![alt](./images/...)
  return content.replace(/(\!\[.*?\]\()(\.\/)?(images\/)/g, `$1${prefix}$3`);
}

function writeFile(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, 'utf-8');
  console.log(`  ✓ ${relative(ROOT, path)}`);
}

// ─── File Processing ─────────────────────────────────────────────────────────

function processWholeFile(srcPath, destPath, order, opts = {}) {
  const content = readFileSync(srcPath, 'utf-8');
  const { h1Title, intro, sections } = parseMarkdown(content);

  // Reconstruct content without h1 (title goes to frontmatter)
  let body = '';
  if (intro) body += intro + '\n\n';
  for (const s of sections) {
    body += `## ${s.heading}\n\n${s.lines.join('\n')}\n\n`;
  }

  const title = opts.title || cleanTitle(h1Title) || 'Untitled';
  const depthIncrease = opts.depthIncrease || 0;
  body = adjustImagePaths(body, depthIncrease);

  const fm = makeFrontmatter({ title, order });
  writeFile(destPath, fm + body.trimEnd() + '\n');
}

function processSplitFile(srcPath, destDir, indexOrder, opts = {}) {
  const content = readFileSync(srcPath, 'utf-8');
  const { h1Title, intro, sections } = parseMarkdown(content);

  const indexTitle = opts.indexTitle || cleanTitle(h1Title) || 'Index';
  const depthIncrease = opts.depthIncrease || 0;

  // Create index.md with intro content
  let indexBody = adjustImagePaths(intro, depthIncrease);
  const indexFm = makeFrontmatter({
    title: indexTitle,
    order: indexOrder,
    description: opts.description,
  });
  writeFile(join(destDir, 'index.md'), indexFm + (indexBody ? indexBody + '\n' : ''));

  // Create one file per h2 section
  for (let i = 0; i < sections.length; i++) {
    const s = sections[i];
    const slug = slugify(s.heading);
    const title = cleanTitle(s.heading);
    let body = adjustImagePaths(s.lines.join('\n'), depthIncrease);
    const fm = makeFrontmatter({ title, order: i + 1 });
    writeFile(join(destDir, `${slug}.md`), fm + body.trimEnd() + '\n');
  }
}

// ─── Category Index Files ────────────────────────────────────────────────────

function writeCategoryIndex(dir, title, order, description) {
  const fm = makeFrontmatter({ title, order, description });
  writeFile(join(dir, 'index.md'), fm);
}

// ─── Clean Old Files ─────────────────────────────────────────────────────────

function cleanOldFiles(dir, filesToDelete) {
  for (const f of filesToDelete) {
    const p = join(dir, f);
    if (existsSync(p)) {
      rmSync(p);
      console.log(`  ✗ deleted ${relative(ROOT, p)}`);
    }
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

console.log('\n=== Splitting Rules ===\n');

// Category indexes for rules
writeCategoryIndex(join(RULES_DIR, 'fondamentaux'), 'Fondamentaux', 1,
  'Concepts de base et mécaniques fondamentales');
writeCategoryIndex(join(RULES_DIR, 'combat'), 'Combat', 2,
  'Système de combat, initiative et défense');
writeCategoryIndex(join(RULES_DIR, 'arcanotechnie'), 'Arcanotechnie', 3,
  'Écoles, affinités et système de Flux');
writeCategoryIndex(join(RULES_DIR, 'reference'), 'Référence', 4,
  'Lexique, résistances et création de personnage');

// Whole files (rules)
processWholeFile(
  join(RULES_DIR, '00_introduction.md'),
  join(RULES_DIR, 'fondamentaux/introduction.md'), 1,
  { title: 'Introduction' });

processWholeFile(
  join(RULES_DIR, '01_bases_des_regles.md'),
  join(RULES_DIR, 'fondamentaux/bases_des_regles.md'), 2,
  { title: 'Bases des règles' });

processWholeFile(
  join(RULES_DIR, '05_regles_jet_de_des.md'),
  join(RULES_DIR, 'combat/jet_de_des.md'), 12,
  { title: 'Jet de dés' });

processWholeFile(
  join(RULES_DIR, '03_systeme_affinites_et_types.md'),
  join(RULES_DIR, 'arcanotechnie/affinites_et_types.md'), 1,
  { title: 'Affinités et types' });

processWholeFile(
  join(RULES_DIR, '06_systeme_de_mana.md'),
  join(RULES_DIR, 'arcanotechnie/systeme_de_flux.md'), 3,
  { title: 'Système de Flux' });

processWholeFile(
  join(RULES_DIR, '07_systeme_de_resistances.md'),
  join(RULES_DIR, 'reference/resistances.md'), 1,
  { title: 'Résistances' });

processWholeFile(
  join(RULES_DIR, '08_histoire.md'),
  join(RULES_DIR, 'reference/histoire.md'), 2,
  { title: 'Histoire' });

processWholeFile(
  join(RULES_DIR, '09_lexique.md'),
  join(RULES_DIR, 'reference/lexique.md'), 3,
  { title: 'Lexique' });

processWholeFile(
  join(RULES_DIR, '11_comment_contribuer.md'),
  join(RULES_DIR, 'reference/comment_contribuer.md'), 5,
  { title: 'Comment contribuer' });

// Split files (rules)
processSplitFile(
  join(RULES_DIR, '02_combat.md'),
  join(RULES_DIR, 'combat'), 0, // order 0 = index itself, children start at 1
  { indexTitle: 'Combat', description: 'Système de combat, initiative et défense' });

processSplitFile(
  join(RULES_DIR, '04_ecoles_d_arcanotechnique.md'),
  join(RULES_DIR, 'arcanotechnie/ecoles'), 2,
  { indexTitle: "Écoles d'arcanotechnie", description: 'Les 19 écoles de conversion du Flux' });

processSplitFile(
  join(RULES_DIR, '10_creation_personnage.md'),
  join(RULES_DIR, 'reference/creation_personnage'), 4,
  { indexTitle: 'Création de personnage', description: 'Système de Point Buy et construction de personnage' });

// Clean old flat files
const oldRulesFiles = [
  '00_introduction.md', '01_bases_des_regles.md', '02_combat.md',
  '03_systeme_affinites_et_types.md', '04_ecoles_d_arcanotechnique.md',
  '05_regles_jet_de_des.md', '06_systeme_de_mana.md', '07_systeme_de_resistances.md',
  '08_histoire.md', '09_lexique.md', '10_creation_personnage.md', '11_comment_contribuer.md',
];
console.log('\nCleaning old rules files:');
cleanOldFiles(RULES_DIR, oldRulesFiles);

// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Splitting History ===\n');

// Category indexes for history
writeCategoryIndex(join(HISTORY_DIR, 'introduction_narrative'), 'Introduction narrative', 1,
  "Présentation de l'univers et de la vie dans l'Empire");
writeCategoryIndex(join(HISTORY_DIR, 'chronologie'), 'Chronologie', 2,
  "Résumé historique de l'Empire");
writeCategoryIndex(join(HISTORY_DIR, 'contexte'), 'Contexte', 3,
  "Contexte politique, militaire, économique et social");
writeCategoryIndex(join(HISTORY_DIR, 'arcanotechnie'), 'Arcanotechnie', 4,
  "Science du Flux, écoles et systèmes automatisés");

// Whole files (history)
processWholeFile(
  join(HISTORY_DIR, 'introduction.md'),
  join(HISTORY_DIR, 'introduction_narrative/introduction.md'), 1,
  { title: 'Introduction', depthIncrease: 1 });

processWholeFile(
  join(HISTORY_DIR, 'jour_dans_empire.md'),
  join(HISTORY_DIR, 'introduction_narrative/jour_dans_empire.md'), 2,
  { title: "Un jour dans l'Empire", depthIncrease: 1 });

processWholeFile(
  join(HISTORY_DIR, 'guide_citoyen.md'),
  join(HISTORY_DIR, 'introduction_narrative/guide_citoyen.md'), 3,
  { title: 'Guide du citoyen', depthIncrease: 1 });

processWholeFile(
  join(HISTORY_DIR, 'resume_historique.md'),
  join(HISTORY_DIR, 'chronologie/resume_historique.md'), 1,
  { title: 'Résumé historique', depthIncrease: 1 });

processWholeFile(
  join(HISTORY_DIR, 'contexte_economique.md'),
  join(HISTORY_DIR, 'contexte/economique.md'), 1,
  { title: 'Contexte économique', depthIncrease: 1 });

// Split files (history)
processSplitFile(
  join(HISTORY_DIR, 'contexte_politique.md'),
  join(HISTORY_DIR, 'contexte/politique'), 2,
  { indexTitle: 'Contexte politique', depthIncrease: 2,
    description: "Structure gouvernementale et politique de l'Empire" });

processSplitFile(
  join(HISTORY_DIR, 'contexte_militaire.md'),
  join(HISTORY_DIR, 'contexte/militaire'), 3,
  { indexTitle: 'Contexte militaire', depthIncrease: 2,
    description: "Forces armées, unités d'élite et doctrine militaire" });

processSplitFile(
  join(HISTORY_DIR, 'contexte_social.md'),
  join(HISTORY_DIR, 'contexte/social'), 4,
  { indexTitle: 'Contexte social', depthIncrease: 2,
    description: "Culture, éducation et normes sociales" });

processSplitFile(
  join(HISTORY_DIR, 'arcanotechnie.md'),
  join(HISTORY_DIR, 'arcanotechnie/fondamentaux'), 1,
  { indexTitle: 'Fondamentaux', depthIncrease: 2,
    description: "Nature et applications de l'arcanotechnie" });

processSplitFile(
  join(HISTORY_DIR, 'ecoles_arcanotechniques.md'),
  join(HISTORY_DIR, 'arcanotechnie/ecoles'), 2,
  { indexTitle: 'Écoles arcanotechniques', depthIncrease: 2,
    description: "Classification des modes de conversion du Flux" });

processSplitFile(
  join(HISTORY_DIR, 'histoire_arcanotechnie.md'),
  join(HISTORY_DIR, 'arcanotechnie/histoire'), 3,
  { indexTitle: "Histoire de l'arcanotechnie", depthIncrease: 2,
    description: "Découverte du Flux et développement scientifique" });

processSplitFile(
  join(HISTORY_DIR, 'systemes_automatises.md'),
  join(HISTORY_DIR, 'arcanotechnie/systemes'), 4,
  { indexTitle: 'Systèmes automatisés', depthIncrease: 2,
    description: "Cristaux, modulateurs et applications industrielles" });

// Clean old flat files (keep 12_structure_militaire.md and images/)
const oldHistoryFiles = [
  'introduction.md', 'jour_dans_empire.md', 'guide_citoyen.md',
  'resume_historique.md', 'contexte_economique.md', 'contexte_politique.md',
  'contexte_militaire.md', 'contexte_social.md', 'arcanotechnie.md',
  'ecoles_arcanotechniques.md', 'histoire_arcanotechnie.md', 'systemes_automatises.md',
];
console.log('\nCleaning old history files:');
cleanOldFiles(HISTORY_DIR, oldHistoryFiles);

console.log('\n=== Done! ===\n');
