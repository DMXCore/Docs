// Core's navigation document in the copilot index.
//
// Core generates docs/generated/navigation.yaml (format dmxcore-navigation) from the Vue SPA and
// the touchscreen menus: every Web UI and touchscreen screen with its path, route, fields,
// columns, actions and availability. The Core build pushes the latest copy to
// src/data/navigation.yaml. The copilot looks screens up with it and accepts UI names from it
// that the prose docs do not mention.

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';

export const NAVIGATION_FORMAT = 'dmxcore-navigation';
export const NAVIGATION_VERSION = 1;
export const NAVIGATION_PATH = 'src/data/navigation.yaml';

/** Null (with a warning) when the file is missing: the index still builds without it. */
export function loadNavigation(repoRoot, warnings) {
  const path = join(repoRoot, ...NAVIGATION_PATH.split('/'));
  if (!existsSync(path)) {
    warnings.push(`${NAVIGATION_PATH} is missing; the copilot index has no navigation document`);
    return null;
  }

  return normalizeNavigation(parse(readFileSync(path, 'utf8')), warnings);
}

/**
 * Keeps what answers "where is X": drops source file paths and C# property names, and
 * empty lists, to keep the index small.
 */
export function normalizeNavigation(doc, warnings = []) {
  if (doc?.format !== NAVIGATION_FORMAT) throw new Error(`${NAVIGATION_PATH}: unexpected format '${doc?.format}'`);
  if (doc.version !== NAVIGATION_VERSION) throw new Error(`${NAVIGATION_PATH}: unsupported version ${doc.version}`);

  const ids = new Set();
  const screens = [];
  for (const screen of doc.screens ?? []) {
    if (!screen?.id || !screen?.path) throw new Error(`${NAVIGATION_PATH}: a screen has no id or path`);
    if (ids.has(screen.id)) {
      warnings.push(`navigation: duplicate screen id ${screen.id}`);
      continue;
    }
    ids.add(screen.id);

    screens.push(
      compact({
        id: screen.id,
        path: screen.path,
        route: screen.route,
        summary: screen.summary,
        description: screen.description,
        permission: screen.permission,
        availableWhen: names(screen.availableWhen),
        sections: (screen.sections ?? [])
          .map((section) => compact({ title: section.title, fields: (section.fields ?? []).map(field) }))
          .filter((section) => section.title || section.fields),
        columns: names(screen.columns),
        actions: names(screen.actions),
        items: (screen.items ?? []).map((item) =>
          compact({
            name: item.name,
            description: item.description,
            opens: item.opens,
            visibleWhen: item.visibleWhen,
            confirm: item.confirm,
          }),
        ),
      }),
    );
  }

  return { format: NAVIGATION_FORMAT, version: NAVIGATION_VERSION, screens };
}

function field(f) {
  return compact({
    label: f.label,
    key: f.key,
    type: f.type,
    options: names(f.options),
    help: f.help,
    visibleWhen: f.visibleWhen,
    readOnly: f.readOnly || undefined,
    required: f.required || undefined,
  });
}

/** Lists of strings; an object entry contributes its name or label. */
function names(list) {
  return (list ?? [])
    .map((entry) => (typeof entry === 'string' ? entry : (entry?.name ?? entry?.label)))
    .filter((entry) => typeof entry === 'string' && entry.length > 0);
}

function compact(object) {
  return Object.fromEntries(
    Object.entries(object).filter(
      ([, value]) => value !== undefined && value !== null && !(Array.isArray(value) && value.length === 0),
    ),
  );
}
