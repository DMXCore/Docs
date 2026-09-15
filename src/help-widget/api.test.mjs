import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createHelpApi, HelpApiError } from './api.js';

function streamResponse(text) {
  const bytes = new TextEncoder().encode(text);
  const body = new ReadableStream({
    start(controller) {
      controller.enqueue(bytes.slice(0, 20));
      controller.enqueue(bytes.slice(20));
      controller.close();
    },
  });
  return new Response(body, { status: 200, headers: { 'Content-Type': 'text/event-stream' } });
}

test('sendMessage posts the question and page, then yields parsed events', async () => {
  const calls = [];
  const api = createHelpApi('https://help.example/', async (url, init) => {
    calls.push({ url, init });
    return streamResponse('event: delta\ndata: {"text":"Go to "}\n\nevent: done\ndata: {"turnsLeft":39}\n\n');
  });

  const events = [];
  await api.sendMessage('abc_DEF-123', 'How?', '/dmx-core-100/', (name, payload) => events.push([name, payload]));

  assert.equal(calls[0].url, 'https://help.example/api/sessions/abc_DEF-123/messages');
  assert.equal(calls[0].init.method, 'POST');
  assert.deepEqual(JSON.parse(calls[0].init.body), { message: 'How?', pageUrl: '/dmx-core-100/' });
  assert.deepEqual(events, [
    ['delta', { text: 'Go to ' }],
    ['done', { turnsLeft: 39 }],
  ]);
});

test('API errors carry status, code and the server message', async () => {
  const api = createHelpApi('https://help.example', async () =>
    new Response(JSON.stringify({ error: 'session_not_found', message: 'This conversation has expired.' }), { status: 404 }));

  await assert.rejects(api.getSession('x'), (err) => {
    assert.ok(err instanceof HelpApiError);
    assert.equal(err.status, 404);
    assert.equal(err.code, 'session_not_found');
    assert.equal(err.message, 'This conversation has expired.');
    return true;
  });
});

test('network failures become a friendly error; aborts pass through', async () => {
  const offline = createHelpApi('https://help.example', async () => {
    throw new TypeError('Failed to fetch');
  });
  await assert.rejects(offline.createSession(), (err) => err instanceof HelpApiError && err.code === 'network');

  const aborted = createHelpApi('https://help.example', async () => {
    throw Object.assign(new Error('aborted'), { name: 'AbortError' });
  });
  await assert.rejects(aborted.createSession(), (err) => err.name === 'AbortError');
});
