import assert from 'node:assert/strict';
import { test } from 'node:test';
import { PRINT_STYLES, buildPrintDocument, canPrintTranscript } from './print.js';

test('canPrintTranscript requires a live docs transcript', () => {
  const empty = { querySelector: () => null };
  const withMessages = { querySelector: (sel) => (sel.includes('dmx-help-user') ? {} : null) };

  assert.equal(canPrintTranscript(empty, false), false);
  assert.equal(canPrintTranscript(withMessages, true), false);
  assert.equal(canPrintTranscript(null, false), false);
  assert.equal(canPrintTranscript(withMessages, false), true);
});

test('buildPrintDocument wraps the transcript in a titled print page', () => {
  const html = buildPrintDocument({
    title: 'DMX Core 100 help',
    subtitle: 'Answers from these docs.',
    printedLabel: 'Printed 15 Sep 2026, 12:00',
    bodyHtml: '<div class="dmx-help-user">How do I add a fixture?</div>',
  });

  assert.match(html, /<title>DMX Core 100 help<\/title>/);
  assert.match(html, /<h1>DMX Core 100 help<\/h1>/);
  assert.match(html, /Answers from these docs\. Printed 15 Sep 2026, 12:00\./);
  assert.match(html, /How do I add a fixture\?/);
  assert.match(html, /@media print/);
  assert.equal(html.includes(PRINT_STYLES), true);
});

test('buildPrintDocument escapes title text so markup cannot leak', () => {
  const html = buildPrintDocument({
    title: 'Help <script>',
    subtitle: 'Docs & more',
    printedLabel: 'Printed "now"',
    bodyHtml: '<p>ok</p>',
  });

  assert.match(html, /Help &lt;script&gt;/);
  assert.match(html, /Docs &amp; more/);
  assert.match(html, /Printed &quot;now&quot;/);
  assert.equal(html.includes('<script>'), false);
});
