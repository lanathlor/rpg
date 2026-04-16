/**
 * HTML auto-link processor for wiki-style linking.
 *
 * Processes HTML strings to replace tagged terms with links.
 * Skips content inside <a>, <code>, <pre>, <kbd>.
 */

/** Elements that should not have their text processed */
const SKIP_ELEMENTS = ['a', 'code', 'pre', 'kbd', 'samp', 'var'];

/**
 * Process HTML string to auto-link tagged terms.
 * @param html HTML string to process
 * @param tagMap Map from lowercase term to URL
 * @returns Processed HTML string
 */
export function autoLinkHtml(html: string, tagMap: Map<string, string>): string {
  if (!tagMap || tagMap.size === 0) return html;
  if (typeof html !== 'string') return String(html);

  // Build regex from tags
  const terms = Array.from(tagMap.keys());
  if (terms.length === 0) return html;

  // Sort by length descending to match longer terms first
  terms.sort((a, b) => b.length - a.length);

  // Create regex pattern for whole-word matching
  const escaped = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`\\b(${escaped.join('|')})\\b`, 'gi');

  // Find all text nodes and process them
  // Match: text between tags (not inside skip elements)
  let result = '';
  let i = 0;

  while (i < html.length) {
    // Check if we're at the start of a tag
    if (html[i] === '<') {
      // Find the end of the tag
      const tagEnd = html.indexOf('>', i);
      if (tagEnd === -1) {
        result += html.slice(i);
        break;
      }

      const tagContent = html.slice(i + 1, tagEnd);

      // Check if this is a closing tag
      if (tagContent.startsWith('/')) {
        const tagName = tagContent.slice(1).trim().split(/\s/)[0].toLowerCase();
        result += html.slice(i, tagEnd + 1);
        i = tagEnd + 1;
        continue;
      }

      // Check if this is a self-closing tag
      const isSelfClosing = tagContent.endsWith('/');
      const tagName = tagContent.replace(/\s.*$/, '').replace(/\/?$/, '').toLowerCase();

      // Add the tag as-is
      result += html.slice(i, tagEnd + 1);
      i = tagEnd + 1;

      // If this is a skip element (and not self-closing), skip until closing tag
      if (SKIP_ELEMENTS.includes(tagName) && !isSelfClosing) {
        const closeTag = `</${tagName}>`;
        const closeIndex = html.indexOf(closeTag, i);
        if (closeIndex !== -1) {
          result += html.slice(i, closeIndex + closeTag.length);
          i = closeIndex + closeTag.length;
        }
      }
      continue;
    }

    // We're in text content - find the next tag
    const nextTag = html.indexOf('<', i);
    const textEnd = nextTag === -1 ? html.length : nextTag;
    const text = html.slice(i, textEnd);

    // Apply auto-linking to this text
    const linkedText = text.replace(pattern, (match) => {
      const key = match.toLowerCase();
      const url = tagMap.get(key);
      if (!url) return match;
      return `<a href="${url}" class="auto-link">${match}</a>`;
    });

    result += linkedText;
    i = textEnd;
  }

  return result;
}
