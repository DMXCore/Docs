// Minimal frontmatter reader for Starlight pages.
//
// Only top-level `key: value` scalars are read (title, description, …). Nested
// YAML (hero:, sidebar:) is skipped - the help index does not need it.

export function splitFrontmatter(source) {
  const text = source.replace(/^﻿/, '').replace(/\r\n?/g, '\n');
  if (!text.startsWith('---\n')) return { data: {}, body: text };

  const end = text.indexOf('\n---', 3);
  if (end < 0) return { data: {}, body: text };

  const data = {};
  for (const line of text.slice(4, end).split('\n')) {
    const m = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
    if (!m || !m[2].trim()) continue;
    data[m[1]] = unquote(m[2].trim());
  }

  let bodyStart = end + 4;
  if (text[bodyStart] === '\n') bodyStart++;

  return { data, body: text.slice(bodyStart) };
}

function unquote(value) {
  const first = value[0];
  if (value.length >= 2 && (first === '"' || first === "'") && value.at(-1) === first) {
    const inner = value.slice(1, -1);
    return first === "'" ? inner.replace(/''/g, "'") : inner.replace(/\\"/g, '"');
  }
  return value;
}
