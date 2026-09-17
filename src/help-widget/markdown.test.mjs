import assert from 'node:assert/strict';
import { test } from 'node:test';
import { renderInline, renderMarkdown, resolveLink } from './markdown.js';

const options = { docsOrigins: ['https://docs.dmxcore.com'] };

test('escapes HTML from the model', () => {
  assert.equal(renderMarkdown('<script>alert(1)</script>'), '<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>');
  assert.equal(renderInline('<img src=x onerror=alert(1)>'), '&lt;img src=x onerror=alert(1)&gt;');
});

test('only safe link targets become anchors', () => {
  // Unsafe targets render as the label; the unmatched ")" stays as text.
  assert.equal(renderInline('[x](javascript:alert(1))'), 'x)');
  assert.equal(renderInline('[x](data:text/html,hi)'), 'x');
  assert.equal(renderInline('[x](/a"onmouseover="alert(1))'), 'x)');
  assert.equal(
    renderInline('[Recording](/dmx-core-100/playback/recording/)'),
    '<a href="/dmx-core-100/playback/recording/">Recording</a>',
  );
  assert.equal(
    renderInline('[Lightkey](https://lightkeyapp.com/?a=1&b=2)'),
    '<a href="https://lightkeyapp.com/?a=1&amp;b=2" target="_blank" rel="noopener noreferrer">Lightkey</a>',
  );
});

test('absolute docs links stay on the current site and tab', () => {
  assert.deepEqual(resolveLink('https://docs.dmxcore.com/dmx-core-100/lighting/stream-routing/#setting-it-up', options), {
    href: '/dmx-core-100/lighting/stream-routing/#setting-it-up',
    external: false,
  });
  assert.equal(resolveLink('https://evil.example/x', options).external, true);
});

test('bold, italic and code, with code left unformatted', () => {
  assert.equal(
    renderInline('Go to **Lighting Setup › Inputs**, set *Recording protocol*, keep `**raw**`'),
    'Go to <strong>Lighting Setup › Inputs</strong>, set <em>Recording protocol</em>, keep <code>**raw**</code>',
  );
});

test('paragraphs, lists, headings and an unterminated fence mid-stream', () => {
  const html = renderMarkdown('Intro line\nsecond line\n\n- one\n- **two**\n\n1. first\n2. second\n\n### Gotchas\n```\nconst a = "<b>"');
  assert.equal(
    html,
    '<p>Intro line<br>second line</p>' +
      '<ul><li>one</li><li><strong>two</strong></li></ul>' +
      '<ol><li>first</li><li>second</li></ol>' +
      '<p class="dmx-help-heading"><strong>Gotchas</strong></p>' +
      '<pre><code>const a = &quot;&lt;b&gt;&quot;</code></pre>',
  );
});

test('bare docs paths and urls the model forgot to link still become anchors', () => {
  assert.equal(
    renderInline('Check the hardware. (/dmx-core-100/main/features/#hardware)'),
    'Check the hardware. (<a href="/dmx-core-100/main/features/#hardware">/dmx-core-100/main/features/#hardware</a>)',
  );
  assert.equal(
    renderInline('See /dmx-core-100/playback/recording/.'),
    'See <a href="/dmx-core-100/playback/recording/">/dmx-core-100/playback/recording/</a>.',
  );
  assert.equal(
    renderInline('Read https://docs.dmxcore.com/dmx-core-100/lighting/stream-routing/#setting-it-up, then https://github.com/x/y?a=1&b=2.', options),
    'Read <a href="/dmx-core-100/lighting/stream-routing/#setting-it-up">https://docs.dmxcore.com/dmx-core-100/lighting/stream-routing/#setting-it-up</a>, then ' +
      '<a href="https://github.com/x/y?a=1&amp;b=2" target="_blank" rel="noopener noreferrer">https://github.com/x/y?a=1&amp;b=2</a>.',
  );
  assert.equal(
    renderInline('Open `/dmx-core-100/main/features/`'),
    'Open <a href="/dmx-core-100/main/features/"><code>/dmx-core-100/main/features/</code></a>',
  );
  // Not links: menu paths, on/off, paths without a trailing slash, and markdown links are not doubled.
  assert.equal(renderInline('Set it on/off in **Lighting Setup / Inputs** or /api/v1'), 'Set it on/off in <strong>Lighting Setup / Inputs</strong> or /api/v1');
  assert.equal(
    renderInline('[Recording](/dmx-core-100/playback/recording/)'),
    '<a href="/dmx-core-100/playback/recording/">Recording</a>',
  );
  assert.equal(renderInline('"https://x.example/a"'), '&quot;<a href="https://x.example/a" target="_blank" rel="noopener noreferrer">https://x.example/a</a>&quot;');
});
