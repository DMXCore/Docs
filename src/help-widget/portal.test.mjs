import assert from 'node:assert/strict';
import { test } from 'node:test';
import { HelpApiError, SessionInPortalError } from './api.js';
import { isPortalSession, isSessionInPortal, portalContinueHref } from './portal.js';

test('isSessionInPortal matches only 403 session_in_portal', () => {
  assert.equal(isSessionInPortal(new SessionInPortalError()), true);
  assert.equal(isSessionInPortal(new HelpApiError(403, 'session_in_portal', 'x')), true);
  assert.equal(isSessionInPortal(new HelpApiError(403, 'forbidden', 'x')), false);
  assert.equal(isSessionInPortal(new HelpApiError(401, 'token_invalid', 'x')), false);
  assert.equal(isSessionInPortal(new HelpApiError(404, 'session_not_found', 'x')), false);
  assert.equal(isSessionInPortal(Object.assign(new Error('aborted'), { name: 'AbortError' })), false);
  assert.equal(isSessionInPortal(null), false);
});

test('isPortalSession reads origin; sessions from an older HelpApi have none', () => {
  assert.equal(isPortalSession({ sessionId: 'a', origin: 'portal', device: { name: 'Stage left' } }), true);
  assert.equal(isPortalSession({ sessionId: 'a', origin: 'docs', device: null }), false);
  assert.equal(isPortalSession({ sessionId: 'a', messages: [] }), false);
  assert.equal(isPortalSession(null), false);
});

test('portalContinueHref adds the session id, and is null without a URL or id', () => {
  assert.equal(
    portalContinueHref('https://portal.dmxcore.com/help', 'abc_DEF-123'),
    'https://portal.dmxcore.com/help?continue=abc_DEF-123',
  );
  assert.equal(
    portalContinueHref('https://portal.example/help?x=1&continue=old', 'new'),
    'https://portal.example/help?x=1&continue=new',
  );
  assert.equal(portalContinueHref('', 'abc'), null);
  assert.equal(portalContinueHref('https://portal.dmxcore.com/help', null), null);
  assert.equal(portalContinueHref('not a url', 'abc'), null);
});
