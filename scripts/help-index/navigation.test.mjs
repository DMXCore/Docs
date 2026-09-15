import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { parse } from 'yaml';
import { loadNavigation, normalizeNavigation } from './navigation.mjs';

const repoRoot = fileURLToPath(new URL('../..', import.meta.url));

test('normalizes a screen and drops source paths, property names and empty lists', () => {
  const doc = parse(`
format: dmxcore-navigation
version: 1
screens:
  - id: uno/settings/inputs/{input mapping}
    path: Uno > Settings > Inputs > {input mapping}
    source: src/UnoHost/Services/MenuManager.cs
    sections:
      - fields:
          - label: Protocol
            property: InputMapping.PortType
            type: option
            options:
              - sACN/E1.31
              - ArtNet
    columns: []
    actions:
      - Delete Mapping (confirm)
`);

  const { screens } = normalizeNavigation(doc);

  assert.deepEqual(screens, [
    {
      id: 'uno/settings/inputs/{input mapping}',
      path: 'Uno > Settings > Inputs > {input mapping}',
      sections: [{ fields: [{ label: 'Protocol', type: 'option', options: ['sACN/E1.31', 'ArtNet'] }] }],
      actions: ['Delete Mapping (confirm)'],
    },
  ]);
});

test('rejects another format and skips duplicate ids with a warning', () => {
  assert.throws(() => normalizeNavigation({ format: 'other', version: 1 }), /unexpected format/);

  const warnings = [];
  const { screens } = normalizeNavigation(
    { format: 'dmxcore-navigation', version: 1, screens: [{ id: 'a', path: 'Web > A' }, { id: 'a', path: 'Web > B' }] },
    warnings,
  );
  assert.equal(screens.length, 1);
  assert.match(warnings[0], /duplicate screen id a/);
});

test('the committed navigation document has the screens the gold paths use', () => {
  const warnings = [];
  const navigation = loadNavigation(repoRoot, warnings);
  assert.ok(navigation, warnings.join('\n'));

  const byPath = new Map(navigation.screens.map((s) => [s.path, s]));
  assert.ok(byPath.has('Web > System > Lighting Setup > Inputs'));
  assert.ok(byPath.has('Web > System > Utilities > Record'));
  assert.ok(byPath.has('Uno > Utilities > Device Operations > Releases'));
  assert.ok(byPath.get('Uno > Settings > Inputs').items.some((i) => i.name === 'Recording protocol'));
});
