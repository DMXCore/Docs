import assert from 'node:assert/strict';
import { test } from 'node:test';
import { splitFrontmatter } from './frontmatter.mjs';

test('reads top-level scalars and strips quotes', () => {
  const { data, body } = splitFrontmatter(
    "---\r\ntitle: 'Q-SYS & Symetrix'\r\ndescription: \"Say \\\"hi\\\"\"\r\nhero:\r\n  tagline: skip\r\n---\r\n\r\nBody",
  );
  assert.deepEqual(data, { title: 'Q-SYS & Symetrix', description: 'Say "hi"' });
  assert.equal(body, '\nBody');
});

test('pages without frontmatter pass through', () => {
  assert.deepEqual(splitFrontmatter('# Hi'), { data: {}, body: '# Hi' });
});
