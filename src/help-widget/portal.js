// Pure helpers for the "continued in the portal" state. A docs session that a user
// continued in the DMX Core portal is bound to that user; the docs widget can no
// longer read or write it, so it shows a link to the portal instead.

import { SESSION_IN_PORTAL } from './api.js';

/** True for the HelpApi 403 session_in_portal error (typed or plain). */
export function isSessionInPortal(err) {
  return Boolean(err) && err.status === 403 && err.code === SESSION_IN_PORTAL;
}

/** True when a restored session says it now lives in the portal. Older HelpApi versions send no origin. */
export function isPortalSession(session) {
  return session?.origin === 'portal';
}

/** `{continueUrl}?continue={sessionId}`, or null when either is missing or the URL is invalid. */
export function portalContinueHref(continueUrl, sessionId) {
  if (!continueUrl || !sessionId) return null;
  try {
    const url = new URL(continueUrl);
    url.searchParams.set('continue', sessionId);
    return url.toString();
  } catch {
    return null;
  }
}
