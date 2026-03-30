/**
 * Custom Astro content loader for i18n codex data.
 *
 * Scans directories for items containing _shared.yaml + fr.yaml + en.yaml.
 * Produces TWO entries per item: one with locale 'fr', one with locale 'en'.
 * Entry IDs are prefixed with locale: "fr/destruction/boule_de_feu", "en/destruction/boule_de_feu".
 * The data is deep-merged: _shared.yaml + locale file, with locale winning on conflicts.
 */

import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import type { Loader } from 'astro/loaders';

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
