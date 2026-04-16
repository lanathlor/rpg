/**
 * Build-time tag registry for wiki-style auto-linking.
 *
 * Scans rules/ and history/ markdown files, extracts tags from frontmatter,
 * builds a term → url map, and detects collisions.
 *
 * The rootDir should point to the project root where rules/ and history/ are located.
 * Typically this is the parent of astro-codex/.
 */

import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

interface TagEntry {
  term: string;
  pagePath: string;
  url: string;
}

/** Parse frontmatter from markdown content */
function parseFrontmatter(raw: string): Record<string, any> {
  const match = raw.match(FRONTMATTER_RE);
  if (!match) return {};
  const fmStr = match[1];
  return (yaml.load(fmStr) as Record<string, any>) || {};
}

/** Convert relative .md file path to slug */
function mdPathToSlug(relPath: string): string {
  let slug = relPath.replace(/\.md$/, '');
  if (slug === 'index') return '';
  if (slug.endsWith('/index')) return slug.slice(0, -'/index'.length);
  return slug;
}

/** Find all .md files recursively under dir */
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
 * Build tag registry by scanning rules and history directories.
 * Returns a Map from term (lowercase) to URL.
 * Throws if there are tag collisions.
 */
export function buildTagRegistry(rootDir: string): Map<string, string> {
  const tagMap = new Map<string, TagEntry>();
  const collections = ['rules', 'history'];

  for (const collection of collections) {
    for (const locale of ['fr', 'en'] as const) {
      const baseDir = path.join(rootDir, collection, locale);

      if (!fs.existsSync(baseDir)) continue;

      const files = findMdFiles(baseDir);

      for (const relPath of files) {
        const filePath = path.join(baseDir, relPath);
        const raw = fs.readFileSync(filePath, 'utf8');
        const frontmatter = parseFrontmatter(raw);
        const tags: string[] = frontmatter.tags || [];

        if (tags.length === 0) continue;

        const slug = mdPathToSlug(relPath);
        // URL: /{locale}/{collection}/{slug}/
        const url = `/${locale}/${collection}${slug ? '/' + slug : ''}/`;

        for (const term of tags) {
          const key = term.toLowerCase();
          const existing = tagMap.get(key);

          if (existing) {
            throw new Error(
              `Tag collision: "${term}" is defined in multiple pages:\n` +
              `  - ${existing.url} (from ${existing.pagePath})\n` +
              `  - ${url} (from ${path.relative(rootDir, filePath)})\n` +
              `Please use unique tags or rename one of them.`
            );
          }

          tagMap.set(key, { term, pagePath: path.relative(rootDir, filePath), url });
        }
      }
    }
  }

  // Convert to Map<string, string> for the rehype plugin
  const result = new Map<string, string>();
  for (const [key, entry] of tagMap) {
    result.set(key, entry.url);
  }

  return result;
}
