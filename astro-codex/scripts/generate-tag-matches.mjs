#!/usr/bin/env node
/**
 * Generate a YAML report of all tag matches across the site.
 *
 * Output: matches.yaml with:
 * - Each tag, its target page, and all pages where it matches
 * - Summary statistics (unused tags, high-frequency tags)
 *
 * Usage: node scripts/generate-tag-matches.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const ROOT_DIR = path.resolve(import.meta.dirname, '../..');
const OUTPUT_FILE = path.join(import.meta.dirname, '..', 'dist', 'matches.yaml');

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

/** Parse frontmatter and content from markdown */
function parseMarkdown(raw) {
  const match = raw.match(FRONTMATTER_RE);
  if (!match) return { frontmatter: {}, content: raw };
  const fmStr = match[1];
  const content = match[2] || '';
  const frontmatter = yaml.load(fmStr) || {};
  return { frontmatter, content };
}

/** Convert relative .md file path to slug */
function mdPathToSlug(relPath) {
  let slug = relPath.replace(/\.md$/, '');
  if (slug === 'index') return '';
  if (slug.endsWith('/index')) return slug.slice(0, -'/index'.length);
  return slug;
}

/** Find all .md files recursively under dir */
function findMdFiles(dir) {
  const results = [];
  function walk(current, rel) {
    let entries;
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

/** Build tag registry and page content index */
function buildData() {
  const tags = new Map(); // tag (lowercase) -> { term, targetUrl, targetFile }
  const pages = []; // { url, file, content, title }

  const collections = ['rules', 'history'];

  for (const collection of collections) {
    for (const locale of ['fr', 'en']) {
      const baseDir = path.join(ROOT_DIR, collection, locale);

      if (!fs.existsSync(baseDir)) continue;

      const files = findMdFiles(baseDir);

      for (const relPath of files) {
        const filePath = path.join(baseDir, relPath);
        const raw = fs.readFileSync(filePath, 'utf8');
        const { frontmatter, content } = parseMarkdown(raw);

        const slug = mdPathToSlug(relPath);
        const url = `/${locale}/${collection}${slug ? '/' + slug : ''}/`;
        const file = `${collection}/${locale}/${relPath}`;
        const title = frontmatter.title || slug || 'index';

        // Collect tags
        const pageTags = frontmatter.tags || [];
        for (const term of pageTags) {
          if (typeof term !== 'string') continue;
          const key = term.toLowerCase();
          if (!tags.has(key)) {
            tags.set(key, { term, targetUrl: url, targetFile: file });
          }
        }

        // Collect page content for matching
        pages.push({ url, file, content, title });
      }
    }
  }

  return { tags, pages };
}

/** Find all matches for each tag */
function findMatches(tags, pages) {
  const results = [];

  for (const [key, tagInfo] of tags) {
    // Create regex for whole-word matching (case insensitive)
    const escaped = tagInfo.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`\\b${escaped}\\b`, 'gi');

    const matches = [];

    for (const page of pages) {
      // Skip the target page itself
      if (page.url === tagInfo.targetUrl) continue;

      // Count matches in content
      const found = page.content.match(pattern);
      if (found && found.length > 0) {
        matches.push({
          page: page.url,
          file: page.file,
          title: page.title,
          count: found.length
        });
      }
    }

    // Sort by count descending
    matches.sort((a, b) => b.count - a.count);

    results.push({
      tag: tagInfo.term,
      target_url: tagInfo.targetUrl,
      target_file: tagInfo.targetFile,
      match_count: matches.reduce((sum, m) => sum + m.count, 0),
      pages_matched: matches.length,
      matches: matches.length > 0 ? matches : null
    });
  }

  // Sort by tag name
  results.sort((a, b) => a.tag.localeCompare(b.tag));

  return results;
}

/** Generate summary statistics */
function generateSummary(results) {
  const unused = results.filter(r => r.pages_matched === 0);
  const highFreq = results.filter(r => r.pages_matched > 10);
  const mediumFreq = results.filter(r => r.pages_matched >= 5 && r.pages_matched <= 10);

  return {
    total_tags: results.length,
    unused_tags: unused.length,
    unused_list: unused.map(r => ({ tag: r.tag, target: r.target_url })),
    high_frequency_tags: highFreq.length,
    high_frequency_list: highFreq.map(r => ({
      tag: r.tag,
      pages_matched: r.pages_matched,
      total_matches: r.match_count
    })),
    medium_frequency_tags: mediumFreq.length,
    medium_frequency_list: mediumFreq.map(r => ({
      tag: r.tag,
      pages_matched: r.pages_matched
    }))
  };
}

// Main
console.log('Building tag registry and page index...');
const { tags, pages } = buildData();
console.log(`Found ${tags.size} tags across ${pages.length} pages`);

console.log('Finding matches...');
const results = findMatches(tags, pages);

console.log('Generating summary...');
const summary = generateSummary(results);

const output = {
  generated_at: new Date().toISOString(),
  summary,
  tags: results
};

const yamlStr = yaml.dump(output, {
  lineWidth: 120,
  noRefs: true,
  sortKeys: false
});

fs.writeFileSync(OUTPUT_FILE, yamlStr);
console.log(`\nWritten to ${OUTPUT_FILE}`);
console.log(`\nSummary:`);
console.log(`  Total tags: ${summary.total_tags}`);
console.log(`  Unused tags: ${summary.unused_tags}`);
console.log(`  High frequency (>10 pages): ${summary.high_frequency_tags}`);
console.log(`  Medium frequency (5-10 pages): ${summary.medium_frequency_tags}`);
