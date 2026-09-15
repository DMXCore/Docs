// Client for the docs copilot API (HelpApi). No credentials: the session id is
// the only token, and it doubles as the portal continue token.

import { readEventStream } from './sse.js';

export class HelpApiError extends Error {
  constructor(status, code, message) {
    super(message);
    this.name = 'HelpApiError';
    this.status = status;
    this.code = code;
  }
}

export function createHelpApi(baseUrl, fetchImpl = (...args) => fetch(...args)) {
  const root = String(baseUrl).replace(/\/+$/, '');

  async function request(method, path, body, init = {}) {
    let response;
    try {
      response = await fetchImpl(`${root}${path}`, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
        ...init,
      });
    } catch (err) {
      if (err?.name === 'AbortError') throw err;
      throw new HelpApiError(0, 'network', 'Could not reach the assistant. Check your connection and try again.');
    }

    if (!response.ok) {
      let payload = null;
      try {
        payload = await response.json();
      } catch {
        // non-JSON error body
      }
      throw new HelpApiError(
        response.status,
        payload?.error ?? `http_${response.status}`,
        payload?.message ?? 'The assistant is not available right now. Please try again later.',
      );
    }
    return response;
  }

  const sessionPath = (id) => `/api/sessions/${encodeURIComponent(id)}`;

  return {
    async createSession() {
      return (await request('POST', '/api/sessions')).json();
    },

    async getSession(id) {
      return (await request('GET', sessionPath(id))).json();
    },

    async setStep(id, walkthroughId, stepId, done) {
      return (await request('PATCH', `${sessionPath(id)}/walkthrough`, { walkthroughId, stepId, done })).json();
    },

    /** Streams one turn; onEvent(name, payload) for status, delta, walkthrough, sources, done, error. */
    async sendMessage(id, message, pageUrl, onEvent, signal) {
      const response = await request('POST', `${sessionPath(id)}/messages`, { message, pageUrl }, { signal });
      await readEventStream(response, onEvent);
    },
  };
}
