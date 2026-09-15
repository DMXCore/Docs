import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createHelpApi, HelpApiError, SessionInPortalError } from './api.js';

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

test('warmUp pings /health without throwing, and createSession passes the abort signal', async () => {
  const calls = [];
  const api = createHelpApi('https://help.example', async (url, init) => {
    calls.push({ url, init });
    if (url.endsWith('/health')) throw new TypeError('Failed to fetch');
    return new Response(JSON.stringify({ sessionId: 'abc' }), { status: 201 });
  });

  api.warmUp();
  const controller = new AbortController();
  const session = await api.createSession(controller.signal);

  assert.equal(calls[0].url, 'https://help.example/health');
  assert.equal(calls[0].init.mode, 'no-cors');
  assert.equal(calls[1].url, 'https://help.example/api/sessions');
  assert.equal(calls[1].init.signal, controller.signal);
  assert.equal(session.sessionId, 'abc');
});

test('sendFeedback posts the rating and leaves out an empty comment', async () => {
  const calls = [];
  const api = createHelpApi('https://help.example', async (url, init) => {
    calls.push({ url, init });
    return new Response(null, { status: 204 });
  });

  await api.sendFeedback('abc', 2, 'up');
  await api.sendFeedback('abc', 2, 'down', 'Wrong menu');

  assert.equal(calls[0].url, 'https://help.example/api/sessions/abc/feedback');
  assert.equal(calls[0].init.method, 'POST');
  assert.deepEqual(JSON.parse(calls[0].init.body), { turn: 2, rating: 'up' });
  assert.deepEqual(JSON.parse(calls[1].init.body), { turn: 2, rating: 'down', comment: 'Wrong menu' });
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

test('setStep patches the walkthrough step and returns the updated view', async () => {
  const calls = [];
  const view = { id: 'w1', title: 'Add a fixture', steps: [{ id: 's1', label: 'Open' }], completedStepIds: ['s1'] };
  const api = createHelpApi('https://help.example/', async (url, init) => {
    calls.push({ url, init });
    return new Response(JSON.stringify(view), { status: 200 });
  });

  const result = await api.setStep('abc/1', 'w1', 's1', true);

  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://help.example/api/sessions/abc%2F1/walkthrough');
  assert.equal(calls[0].init.method, 'PATCH');
  assert.equal(calls[0].init.headers['Content-Type'], 'application/json');
  assert.deepEqual(JSON.parse(calls[0].init.body), { walkthroughId: 'w1', stepId: 's1', done: true });
  assert.deepEqual(result, view);
});

test('403 session_in_portal becomes a SessionInPortalError on restore, send and setStep', async () => {
  const body = { error: 'session_in_portal', message: 'This chat continued in the DMX Core portal.' };
  const api = createHelpApi('https://help.example', async () => new Response(JSON.stringify(body), { status: 403 }));

  const check = (err) => {
    assert.ok(err instanceof SessionInPortalError);
    assert.ok(err instanceof HelpApiError);
    assert.equal(err.status, 403);
    assert.equal(err.code, 'session_in_portal');
    assert.equal(err.message, 'This chat continued in the DMX Core portal.');
    return true;
  };
  await assert.rejects(api.getSession('abc'), check);
  await assert.rejects(api.sendMessage('abc', 'How?', '/', () => assert.fail('no events')), check);
  await assert.rejects(api.setStep('abc', 'w1', 's1', true), check);
});

test('403 session_in_portal without a message still gets the portal text; other 403s stay generic', async () => {
  const bare = createHelpApi('https://help.example', async () =>
    new Response(JSON.stringify({ error: 'session_in_portal' }), { status: 403 }));
  await assert.rejects(bare.getSession('abc'), (err) =>
    err instanceof SessionInPortalError && err.message === 'This chat continued in the DMX Core portal.');

  const other = createHelpApi('https://help.example', async () =>
    new Response(JSON.stringify({ error: 'forbidden', message: 'No.' }), { status: 403 }));
  await assert.rejects(other.getSession('abc'), (err) =>
    err instanceof HelpApiError && !(err instanceof SessionInPortalError) && err.code === 'forbidden');
});

test('401 token_invalid maps to a plain HelpApiError with the server message', async () => {
  const api = createHelpApi('https://help.example', async () =>
    new Response(JSON.stringify({ error: 'token_invalid', message: 'Sign in again.' }), { status: 401 }));

  await assert.rejects(api.sendMessage('abc', 'How?', '/', () => {}), (err) => {
    assert.ok(err instanceof HelpApiError);
    assert.ok(!(err instanceof SessionInPortalError));
    assert.equal(err.status, 401);
    assert.equal(err.code, 'token_invalid');
    assert.equal(err.message, 'Sign in again.');
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
