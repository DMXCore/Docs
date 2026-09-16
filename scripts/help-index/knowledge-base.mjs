// Loads the public knowledge base (DMXCore/DmxCore100-KnowledgeBase) as a
// second, lower-ranked tier of the docs copilot corpus.
//
// The knowledge base explains how the device works under the covers (data
// shapes, timing, dispatch rules, limits and gaps). It is not the user docs:
// walkthrough steps never cite it, but "can it", "why" and integration
// planning questions are answered from it when the docs stop short.
//
// The repo is checked out next to the docs build (CI: knowledge-base/, dev:
// ../KnowledgeBase); when it is absent the index is built without the tier
// and a warning says so, so a docs build never depends on it.

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, join } from 'node:path';

export const KNOWLEDGE_BASE_TIER = 'kb';
export const KNOWLEDGE_BASE_REPO = 'https://github.com/DMXCore/DmxCore100-KnowledgeBase';

/** Files under the repo root that are indexed, and the folders scanned for *.md. */
const ROOT_FILES = ['issues.md'];
const FOLDERS = ['concepts'];

/** Candidate roots, first existing wins: explicit option, HELP_KB_ROOT, CI checkout, dev sibling. */
export function resolveKnowledgeBaseRoot(repoRoot, explicit) {
  const candidates = [explicit, process.env.HELP_KB_ROOT, join(repoRoot, 'knowledge-base'), join(repoRoot, '..', 'KnowledgeBase')];
  return candidates.find((dir) => dir && existsSync(join(dir, 'concepts'))) ?? null;
}

/** The H1 as the title and the body without it; a file with no H1 is titled after its name. */
export function splitTitle(source, fallback) {
  const lines = source.replace(/^﻿/, '').split('\n');
  const h1 = lines.findIndex((line) => /^#\s+\S/.test(line));
  if (h1 < 0) return { title: fallback, body: source };
  return { title: lines[h1].replace(/^#\s+/, '').trim(), body: lines.filter((_, i) => i !== h1).join('\n') };
}

/**
 * Knowledge-base pages as index sources: slug kb/<file>, an absolute GitHub url
 * (anchors follow GitHub's slugger, the same one the chunker uses), tier "kb".
 */
export function loadKnowledgeBase({ repoRoot, knowledgeBaseRoot, warnings }) {
  const root = resolveKnowledgeBaseRoot(repoRoot, knowledgeBaseRoot);
  if (!root) {
    warnings.push('Knowledge base not found (knowledge-base/ or ../KnowledgeBase); building without the kb tier');
    return [];
  }

  const files = [];
  for (const name of ROOT_FILES) {
    const file = join(root, name);
    if (existsSync(file)) files.push({ file, rel: name });
  }
  for (const folder of FOLDERS) {
    const dir = join(root, folder);
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir).filter((n) => n.endsWith('.md')).sort()) {
      files.push({ file: join(dir, name), rel: `${folder}/${name}` });
    }
  }

  return files.map(({ file, rel }) => {
    const stem = basename(rel, '.md');
    const { title, body } = splitTitle(readFileSync(file, 'utf8'), stem);
    return {
      slug: `kb/${stem}`,
      title: `${title} (Knowledge base)`,
      description: null,
      body,
      url: `${KNOWLEDGE_BASE_REPO}/blob/main/${rel}`,
      tier: KNOWLEDGE_BASE_TIER,
    };
  });
}
