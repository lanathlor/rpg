export interface TreeNode {
  segment: string;
  path: string;
  title: string;
  order: number;
  description?: string;
  hasContent: boolean;
  isIndex: boolean;
  children: TreeNode[];
}

interface EntryInput {
  id: string;
  data: { title?: string; order?: number; description?: string };
}

/**
 * Builds a tree from a flat list of content collection entries.
 * Astro 6 glob loader provides ids already without .md extension
 * and with index entries resolved to just the directory path.
 * e.g. "contexte" (from contexte/index.md), "contexte/economique" (leaf)
 */
export function buildTree(entries: EntryInput[]): TreeNode[] {
  const root: TreeNode[] = [];
  const nodeMap = new Map<string, TreeNode>();

  function getOrCreateNode(pathParts: string[], depth: number): TreeNode {
    const path = pathParts.slice(0, depth + 1).join('/');
    let node = nodeMap.get(path);
    if (!node) {
      node = {
        segment: pathParts[depth],
        path,
        title: pathParts[depth].replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        order: 0,
        hasContent: false,
        isIndex: false,
        children: [],
      };
      nodeMap.set(path, node);

      if (depth === 0) {
        root.push(node);
      } else {
        const parent = getOrCreateNode(pathParts, depth - 1);
        if (!parent.children.find(c => c.path === path)) {
          parent.children.push(node);
        }
      }
    }
    return node;
  }

  // First pass: create all nodes for entries that have children (directories)
  // so we know which paths are directories vs leaves
  const allIds = new Set(entries.map(e => e.id));
  const dirPaths = new Set<string>();
  for (const id of allIds) {
    // If any other id starts with this id + "/", then this id is a directory index
    for (const otherId of allIds) {
      if (otherId !== id && otherId.startsWith(id + '/')) {
        dirPaths.add(id);
        break;
      }
    }
  }

  for (const entry of entries) {
    const parts = entry.id.split('/');

    if (dirPaths.has(entry.id)) {
      // This is a directory index (e.g. "contexte" from contexte/index.md)
      const dirNode = getOrCreateNode(parts, parts.length - 1);
      dirNode.title = entry.data.title || dirNode.title;
      dirNode.order = entry.data.order ?? dirNode.order;
      dirNode.description = entry.data.description;
      dirNode.hasContent = true;
      dirNode.isIndex = true;
    } else {
      // Leaf file
      // Ensure parent dirs exist
      for (let i = 0; i < parts.length - 1; i++) {
        getOrCreateNode(parts, i);
      }
      // Create/update leaf node
      const leafPath = parts.join('/');
      let leaf = nodeMap.get(leafPath);
      if (!leaf) {
        leaf = {
          segment: parts[parts.length - 1],
          path: leafPath,
          title: entry.data.title || parts[parts.length - 1],
          order: entry.data.order ?? 0,
          hasContent: true,
          isIndex: false,
          children: [],
        };
        nodeMap.set(leafPath, leaf);
        if (parts.length === 1) {
          root.push(leaf);
        } else {
          const parent = getOrCreateNode(parts, parts.length - 2);
          if (!parent.children.find(c => c.path === leafPath)) {
            parent.children.push(leaf);
          }
        }
      } else {
        leaf.title = entry.data.title || leaf.title;
        leaf.order = entry.data.order ?? leaf.order;
        leaf.description = entry.data.description;
        leaf.hasContent = true;
      }
    }
  }

  function sortTree(nodes: TreeNode[]) {
    nodes.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'fr'));
    for (const n of nodes) {
      if (n.children.length) sortTree(n.children);
    }
  }
  sortTree(root);

  return root;
}

/**
 * Flattens the tree into an ordered list of content pages for prev/next.
 */
export function flattenTree(nodes: TreeNode[]): TreeNode[] {
  const result: TreeNode[] = [];
  function walk(nodes: TreeNode[]) {
    for (const node of nodes) {
      if (node.hasContent) result.push(node);
      if (node.children.length) walk(node.children);
    }
  }
  walk(nodes);
  return result;
}

/**
 * Finds the ancestor paths that should be expanded in the sidebar.
 */
export function findAncestors(nodes: TreeNode[], targetPath: string): string[] {
  const ancestors: string[] = [];
  function search(nodes: TreeNode[], trail: string[]): boolean {
    for (const node of nodes) {
      if (node.path === targetPath) {
        ancestors.push(...trail);
        return true;
      }
      if (node.children.length && search(node.children, [...trail, node.path])) {
        return true;
      }
    }
    return false;
  }
  search(nodes, []);
  return ancestors;
}
