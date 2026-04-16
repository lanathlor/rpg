/**
 * Custom Astro content loaders for i18n data.
 *
 * localizedLoader (YAML):
 *   Scans directories for items containing _shared.yaml + fr.yaml + en.yaml.
 *   Deep-merges _shared + locale file. Produces locale-prefixed entries.
 *
 * localizedMarkdownLoader (Markdown):
 *   Scans {base}/fr/**\/*.md for FR content, checks {base}/en/ for overrides.
 *   Falls back to FR when EN file doesn't exist. Renders markdown to HTML.
 *   Produces locale-prefixed entries: "fr/combat/attacking", "en/combat/attacking".
 */

import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import type { Loader } from 'astro/loaders';
import { autoLinkHtml } from './htmlAutoLink';
import { buildTagRegistry } from './tagRegistry';

// Global tag registry for auto-linking
let tagRegistry: Map<string, string> | null = null;

function getTagRegistry(rootPath: string): Map<string, string> {
  if (!tagRegistry) {
    tagRegistry = buildTagRegistry(rootPath);
  }
  return tagRegistry;
}

const LOCALES = ['fr', 'en'] as const;

interface LocalizedLoaderOptions {
  /** Base directory containing the items (relative to project root or absolute) */
  base: string;
  /** Pattern of files to skip (directory names) */
  skipDirs?: string[];
}

function deepMerge(target: Record<string, any>, source: Record<string, any>): Record<string, any> {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key]) &&
      target[key] &&
      typeof target[key] === 'object' &&
      !Array.isArray(target[key])
    ) {
      result[key] = deepMerge(target[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

/**
 * Find all item directories (those containing fr.yaml) recursively.
 * Returns relative paths from base, e.g. "destruction/boule_de_feu"
 */
function findItemDirs(baseDir: string): string[] {
  const results: string[] = [];

  function walk(current: string, rel: string) {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      return;
    }

    // Check if this directory is an item (has fr.yaml)
    const hasFrYaml = entries.some(e => e.isFile() && e.name === 'fr.yaml');
    if (hasFrYaml) {
      results.push(rel);
      return; // Don't recurse into item dirs
    }

    // Otherwise recurse into subdirectories
    for (const entry of entries) {
      if (entry.isDirectory()) {
        walk(
          path.join(current, entry.name),
          rel ? `${rel}/${entry.name}` : entry.name
        );
      }
    }
  }

  walk(baseDir, '');
  return results;
}

function loadYamlFile(filePath: string): Record<string, any> | null {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(content);
    if (data && typeof data === 'object') return data as Record<string, any>;
  } catch {
    // File doesn't exist or is invalid
  }
  return null;
}

// ─── Markdown frontmatter parser ────────────────────────────────────────

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

function parseFrontmatter(raw: string): { data: Record<string, any>; body: string } {
  const match = raw.match(FRONTMATTER_RE);
  if (!match) return { data: {}, body: raw };
  const fmStr = match[1];
  const body = raw.slice(match[0].length);
  const data = (yaml.load(fmStr) as Record<string, any>) || {};
  return { data, body };
}

/** Find all .md files recursively under dir. Returns relative paths. */
function findMdFiles(dir: string): string[] {
  const results: string[] = [];
  function walk(current: string, rel: string) {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const entryRel = rel ? `${rel}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        walk(path.join(current, entry.name), entryRel);
      } else if (entry.name.endsWith('.md')) {
        results.push(entryRel);
      }
    }
  }
  walk(dir, '');
  return results;
}

/**
 * Convert a relative .md file path to a slug.
 * - Strips .md extension
 * - Converts "/index" at the end to just the directory path
 * e.g. "combat/attacking.md" → "combat/attacking"
 *      "combat/index.md" → "combat"
 *      "index.md" → "" (root index - typically not used)
 */
function mdPathToSlug(relPath: string): string {
  let slug = relPath.replace(/\.md$/, '');
  // Resolve index files to their parent directory
  if (slug === 'index') return '';
  if (slug.endsWith('/index')) return slug.slice(0, -'/index'.length);
  return slug;
}

// ─── Localized Markdown Loader ──────────────────────────────────────────

interface LocalizedMarkdownLoaderOptions {
  /** Base directory containing fr/ (and optionally en/) subdirs */
  base: string;
  /** Glob patterns to exclude */
  exclude?: string[];
}

export function localizedMarkdownLoader(options: LocalizedMarkdownLoaderOptions): Loader {
  return {
    name: 'localized-markdown-loader',
    async load(context) {
      const { store, parseData, generateDigest, renderMarkdown, config } = context;
      store.clear();

      const baseDir = path.resolve(config.root.pathname, options.base);
      const frDir = path.join(baseDir, 'fr');

      if (!fs.existsSync(frDir)) {
        context.logger.warn(`FR directory not found: ${frDir}`);
        return;
      }

      const enDir = path.join(baseDir, 'en');
      const frFiles = findMdFiles(frDir);

      for (const relPath of frFiles) {
        const slug = mdPathToSlug(relPath);
        if (slug === '') continue; // skip root index if any

        const frFilePath = path.join(frDir, relPath);
        const enFilePath = path.join(enDir, relPath);
        const hasEn = fs.existsSync(enFilePath);

        const frRaw = fs.readFileSync(frFilePath, 'utf8');
        const frParsed = parseFrontmatter(frRaw);

        const enParsed = hasEn
          ? parseFrontmatter(fs.readFileSync(enFilePath, 'utf8'))
          : null;

        for (const locale of LOCALES) {
          const parsed = locale === 'fr' ? frParsed : (enParsed || frParsed);
          const sourceFile = locale === 'en' && hasEn ? enFilePath : frFilePath;

          const id = `${locale}/${slug}`;
          const relFile = path.relative(config.root.pathname, sourceFile);

          const data = await parseData({
            id,
            data: parsed.data,
            filePath: relFile,
          });

          const rendered = await renderMarkdown(parsed.body, {
            fileURL: new URL(`file://${sourceFile}`),
          });

          // Apply auto-linking to rendered HTML
          // The rules/ and history/ are in the parent of astro-codex/
          const projectRoot = path.resolve(config.root.pathname, '..');
          const tagMap = getTagRegistry(projectRoot);
          const renderedCode = rendered.html ?? '';
          let processedHtml = renderedCode;
          if (tagMap && tagMap.size > 0 && renderedCode) {
            processedHtml = autoLinkHtml(renderedCode, tagMap);
          }

          const digest = generateDigest(parsed.body);

          store.set({
            id,
            data: {
              ...parsed.data,
              renderedHtml: processedHtml,
            },
            body: parsed.body,
            filePath: relFile,
            digest,
            rendered,
          });
        }
      }
    },
  };
}

// ─── Localized YAML Loader ──────────────────────────────────────────────

export function localizedLoader(options: LocalizedLoaderOptions): Loader {
  return {
    name: 'localized-yaml-loader',
    async load(context) {
      const { store, parseData, generateDigest, config } = context;
      store.clear();

      // Resolve base directory relative to astro project root
      const baseDir = path.resolve(config.root.pathname, options.base);

      if (!fs.existsSync(baseDir)) {
        context.logger.warn(`Base directory not found: ${baseDir}`);
        return;
      }

      const itemDirs = findItemDirs(baseDir);

      for (const itemRel of itemDirs) {
        const itemPath = path.join(baseDir, itemRel);

        // Load _shared.yaml (optional)
        const shared = loadYamlFile(path.join(itemPath, '_shared.yaml')) || {};

        // Load locale files
        const frData = loadYamlFile(path.join(itemPath, 'fr.yaml'));
        if (!frData) continue; // FR is required as the canonical source

        const enData = loadYamlFile(path.join(itemPath, 'en.yaml'));

        for (const locale of LOCALES) {
          const localeData = locale === 'fr' ? frData : (enData || frData); // Fallback to FR if EN missing
          const merged = deepMerge(shared, localeData);

          const id = `${locale}/${itemRel}`;
          const filePath = path.relative(
            config.root.pathname,
            path.join(itemPath, `${locale}.yaml`)
          );

          const data = await parseData({
            id,
            data: merged,
            filePath,
          });

          const digest = generateDigest(merged);

          store.set({
            id,
            data,
            filePath,
            digest,
          });
        }
      }
    },
  };
}
