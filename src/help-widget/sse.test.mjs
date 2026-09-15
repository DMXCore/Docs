import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createSseParser } from './sse.js';

test('parses events split across arbitrary chunks', () => {
  const events = [];
  const parser = createSseParser((e) => events.push(e));
  const stream = 'event: status\ndata: {"text":"Searching the docs"}\n\n: keep-alive\n\nevent: delta\ndata: {"text":"Hi"}\n\ndata: plain\n\n';

  for (let i = 0; i < stream.length; i += 7) parser.push(stream.slice(i, i + 7));

  assert.deepEqual(events, [
    { event: 'status', data: '{"text":"Searching the docs"}' },
    { event: 'delta', data: '{"text":"Hi"}' },
    { event: 'message', data: 'plain' },
  ]);
});

test('handles CRLF line endings and multi-line data', () => {
  const events = [];
  const parser = createSseParser((e) => events.push(e));
  parser.push('event: done\r\ndata: a\r\ndata: b\r\n\r\n');
  assert.deepEqual(events, [{ event: 'done', data: 'a\nb' }]);
});
