// DMX Core 100 docs copilot widget.
//
// Chat overlay on docs.dmxcore.com. Answers stream as markdown; step-by-step
// answers arrive as a structured walkthrough and render as a checklist. Checking
// a step PATCHes the session so the next turn knows where the user is. The
// session id lives in localStorage so the thread survives page navigation.

import { createHelpApi, HelpApiError } from './api.js';
import { renderInline, renderMarkdown, resolveLink } from './markdown.js';

const SESSION_KEY = 'dmxcore-help-session';
const OPEN_KEY = 'dmxcore-help-open';
const CHECKLIST_COLLAPSED_KEY = 'dmxcore-help-checklist-collapsed';
const DOCS_ORIGINS = ['https://docs.dmxcore.com'];

const SUGGESTIONS = [
  'How do I add a Robe Spot 170 AT at start address 100 on universe 1?',
  'How do I record Art-Net universes 5–7 from Lightkey?',
];

function safeStorage(kind) {
  try {
    const store = window[kind];
    store.setItem('__dmx_help', '1');
    store.removeItem('__dmx_help');
    return store;
  } catch {
    return null;
  }
}

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === undefined || value === null || value === false) continue;
    if (key === 'class') node.className = value;
    else if (key === 'text') node.textContent = value;
    else if (key === 'html') node.innerHTML = value; // sanitized markdown only
    else if (key.startsWith('on')) node.addEventListener(key.slice(2), value);
    else node.setAttribute(key, value === true ? '' : value);
  }
  for (const child of [].concat(children)) {
    if (child !== null && child !== undefined && child !== false) node.append(child);
  }
  return node;
}

class HelpWidget {
  constructor(root) {
    this.root = root;
    this.api = createHelpApi(root.dataset.api);
    this.continueUrl = root.dataset.continue || '';
    this.local = safeStorage('localStorage');
    this.tab = safeStorage('sessionStorage');
    this.sessionId = this.local?.getItem(SESSION_KEY) || null;
    this.walkthrough = null;
    this.stream = null;
    this.loaded = false;
    this.linkOptions = { docsOrigins: [...DOCS_ORIGINS, window.location.origin] };

    this.build();
    if (this.tab?.getItem(OPEN_KEY) === '1') this.open({ focus: false });
  }

  build() {
    this.launcher = el('button', {
      type: 'button',
      class: 'dmx-help-launcher',
      'aria-expanded': 'false',
      'aria-controls': 'dmx-help-panel',
      onclick: () => (this.panel.hidden ? this.open() : this.close()),
    }, [el('span', { class: 'dmx-help-launcher-icon', 'aria-hidden': 'true', text: '?' }), el('span', { text: 'Ask the docs' })]);

    this.messages = el('div', { class: 'dmx-help-messages', 'aria-live': 'polite' });
    this.checklist = el('div', { class: 'dmx-help-checklist', hidden: true });
    this.notice = el('p', { class: 'dmx-help-notice', role: 'status', hidden: true });

    this.input = el('textarea', {
      class: 'dmx-help-input',
      rows: '2',
      maxlength: '2000',
      placeholder: 'How do I…?',
      'aria-label': 'Your question',
      onkeydown: (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
          e.preventDefault();
          this.submit();
        }
      },
    });
    this.sendButton = el('button', { type: 'submit', class: 'dmx-help-send', text: 'Send' });
    const composer = el('form', {
      class: 'dmx-help-composer',
      onsubmit: (e) => {
        e.preventDefault();
        if (this.stream) this.stream.abort();
        else this.submit();
      },
    }, [this.input, this.sendButton]);

    this.continueLink = el('a', { class: 'dmx-help-continue', target: '_blank', rel: 'noopener', hidden: true }, [
      el('strong', { text: 'Continue with my device →' }),
      el('span', { text: 'Sign in to the portal to keep this chat and checklist.' }),
    ]);

    this.panel = el('section', {
      id: 'dmx-help-panel',
      class: 'dmx-help-panel',
      role: 'dialog',
      'aria-label': 'DMX Core 100 help',
      hidden: true,
      onkeydown: (e) => {
        if (e.key === 'Escape') this.close();
      },
    }, [
      el('header', { class: 'dmx-help-header' }, [
        el('div', {}, [
          el('h2', { class: 'dmx-help-title', text: 'DMX Core 100 help' }),
          el('p', { class: 'dmx-help-subtitle', text: 'Answers from these docs. It can’t see or change your device.' }),
        ]),
        el('div', { class: 'dmx-help-header-actions' }, [
          el('button', { type: 'button', class: 'dmx-help-icon-button', text: 'New chat', onclick: () => this.newChat() }),
          el('button', { type: 'button', class: 'dmx-help-icon-button', 'aria-label': 'Close help', text: '✕', onclick: () => this.close() }),
        ]),
      ]),
      this.messages,
      this.checklist,
      this.notice,
      composer,
      this.continueLink,
    ]);

    this.root.append(this.launcher, this.panel);
    this.updateContinueLink();
  }

  async open({ focus = true } = {}) {
    this.panel.hidden = false;
    this.root.classList.add('dmx-help-open');
    this.launcher.setAttribute('aria-expanded', 'true');
    this.tab?.setItem(OPEN_KEY, '1');
    if (!this.loaded) await this.restore();
    if (focus) this.input.focus();
  }

  close() {
    this.panel.hidden = true;
    this.root.classList.remove('dmx-help-open');
    this.launcher.setAttribute('aria-expanded', 'false');
    this.tab?.setItem(OPEN_KEY, '0');
    this.launcher.focus();
  }

  async restore() {
    this.loaded = true;
    if (!this.sessionId) {
      this.renderEmptyState();
      return;
    }

    try {
      const session = await this.api.getSession(this.sessionId);
      this.messages.replaceChildren();
      for (const message of session.messages) {
        if (message.role === 'user') this.addUserBubble(message.content);
        else this.addAssistantBubble(message.content, message.walkthroughId);
      }
      this.setWalkthrough(session.walkthrough);
      if (!session.messages.length) this.renderEmptyState();
      this.setTurnsLeft(session.turnsLeft);
      this.scrollToEnd(true);
    } catch (err) {
      if (err instanceof HelpApiError && err.status === 404) {
        this.forgetSession();
        this.renderEmptyState();
      } else {
        this.showNotice(err.message);
        this.loaded = false;
      }
    }
  }

  newChat() {
    this.stream?.abort();
    this.forgetSession();
    this.setWalkthrough(null);
    this.setTurnsLeft(null);
    this.hideNotice();
    this.renderEmptyState();
    this.input.focus();
  }

  forgetSession() {
    this.sessionId = null;
    this.local?.removeItem(SESSION_KEY);
    this.updateContinueLink();
  }

  renderEmptyState() {
    this.messages.replaceChildren(
      el('div', { class: 'dmx-help-empty' }, [
        el('p', { text: 'Ask how to set something up on the DMX Core 100. You’ll get the steps as a checklist with links and screenshots from the docs.' }),
        el('p', { class: 'dmx-help-hint', text: 'Don’t include passwords, PINs or license keys.' }),
        el('div', { class: 'dmx-help-suggestions' }, SUGGESTIONS.map((text) =>
          el('button', { type: 'button', class: 'dmx-help-suggestion', text, onclick: () => this.submit(text) }))),
      ]),
    );
  }

  addUserBubble(text) {
    this.messages.querySelector('.dmx-help-empty')?.remove();
    const bubble = el('div', { class: 'dmx-help-bubble dmx-help-user', text });
    this.messages.append(bubble);
    return bubble;
  }

  addAssistantBubble(markdown = '', walkthroughId = null) {
    const body = el('div', { class: 'dmx-help-markdown', html: renderMarkdown(markdown, this.linkOptions) });
    const bubble = el('div', { class: 'dmx-help-bubble dmx-help-assistant' }, [body]);
    if (walkthroughId) bubble.append(this.checklistChip());
    this.messages.append(bubble);
    return { bubble, body };
  }

  checklistChip() {
    return el('button', {
      type: 'button',
      class: 'dmx-help-chip',
      text: 'Checklist below ↓',
      onclick: () => {
        this.setChecklistCollapsed(false);
        this.checklist.scrollIntoView({ block: 'nearest' });
      },
    });
  }

  async submit(preset) {
    const text = (preset ?? this.input.value).trim();
    if (!text || this.stream) return;
    this.hideNotice();

    if (!this.sessionId) {
      try {
        const session = await this.api.createSession();
        this.sessionId = session.sessionId;
        this.local?.setItem(SESSION_KEY, this.sessionId);
        this.updateContinueLink();
      } catch (err) {
        this.showNotice(err.message);
        return;
      }
    }

    this.input.value = '';
    this.addUserBubble(text);
    const { bubble, body } = this.addAssistantBubble();
    const status = el('p', { class: 'dmx-help-status', text: 'Thinking…' });
    bubble.prepend(status);
    this.scrollToEnd(true);

    let markdown = '';
    let frame = 0;
    const render = () => {
      frame = 0;
      body.innerHTML = renderMarkdown(markdown, this.linkOptions);
      this.scrollToEnd();
    };

    this.stream = new AbortController();
    this.setStreaming(true);
    try {
      await this.api.sendMessage(this.sessionId, text, window.location.pathname, (event, payload) => {
        switch (event) {
          case 'status':
            status.textContent = `${payload.text}…`;
            break;
          case 'delta':
            status.remove();
            markdown += payload.text;
            if (!frame) frame = requestAnimationFrame(render);
            break;
          case 'walkthrough':
            status.remove();
            this.setWalkthrough(payload);
            bubble.append(this.checklistChip());
            break;
          case 'sources':
            bubble.append(this.sourceLinks(payload.pages));
            break;
          case 'error':
            status.remove();
            bubble.append(el('p', { class: 'dmx-help-error', text: payload.message }));
            break;
          case 'done':
            this.setTurnsLeft(payload.turnsLeft);
            break;
        }
      }, this.stream.signal);
    } catch (err) {
      status.remove();
      if (err?.name === 'AbortError') {
        bubble.append(el('p', { class: 'dmx-help-hint', text: 'Stopped.' }));
      } else if (err instanceof HelpApiError && err.code === 'session_not_found') {
        this.forgetSession();
        bubble.append(el('p', { class: 'dmx-help-error', text: 'This conversation expired. Ask again to start a new one.' }));
      } else {
        bubble.append(el('p', { class: 'dmx-help-error', text: err.message }));
      }
    } finally {
      if (frame) cancelAnimationFrame(frame);
      render();
      status.remove();
      if (!markdown && bubble.childElementCount === 1) bubble.remove();
      this.stream = null;
      this.setStreaming(false);
      this.input.focus();
    }
  }

  sourceLinks(pages = []) {
    if (!pages.length) return null;
    return el('p', { class: 'dmx-help-sources' }, [
      el('span', { text: 'From the docs: ' }),
      ...pages.flatMap((page, i) => {
        const link = resolveLink(page.url, this.linkOptions);
        const node = link ? el('a', { href: link.href, text: page.title }) : el('span', { text: page.title });
        return i === 0 ? [node] : [', ', node];
      }),
    ]);
  }

  setWalkthrough(view) {
    this.walkthrough = view ?? null;
    this.renderChecklist();
  }

  setChecklistCollapsed(collapsed) {
    this.tab?.setItem(CHECKLIST_COLLAPSED_KEY, collapsed ? '1' : '0');
    this.renderChecklist();
  }

  renderChecklist() {
    const view = this.walkthrough;
    this.checklist.hidden = !view;
    if (!view) {
      this.checklist.replaceChildren();
      return;
    }

    const done = new Set(view.completedStepIds);
    const collapsed = this.tab?.getItem(CHECKLIST_COLLAPSED_KEY) === '1';
    const nextIndex = view.steps.findIndex((s) => !done.has(s.id));

    const header = el('button', {
      type: 'button',
      class: 'dmx-help-checklist-header',
      'aria-expanded': String(!collapsed),
      onclick: () => this.setChecklistCollapsed(!collapsed),
    }, [
      el('span', { class: 'dmx-help-checklist-title', text: view.title }),
      el('span', { class: 'dmx-help-checklist-count', text: `${done.size}/${view.steps.length} ${collapsed ? '▸' : '▾'}` }),
    ]);

    const list = el('ol', { class: 'dmx-help-steps', hidden: collapsed });
    view.steps.forEach((step, index) => {
      const checked = done.has(step.id);
      const inputId = `dmx-help-step-${view.id}-${step.id}`;
      const docs = step.docsUrl ? resolveLink(step.docsUrl, this.linkOptions) : null;
      const shot = step.screenshot ? resolveLink(step.screenshot.url, this.linkOptions) : null;
      const figure = shot
        ? el('figure', { class: 'dmx-help-shot', hidden: true }, [
            el('img', { src: shot.href, alt: step.screenshot.alt, loading: 'lazy' }),
            el('figcaption', { text: step.screenshot.alt }),
          ])
        : null;

      list.append(el('li', { class: `dmx-help-step${checked ? ' dmx-help-step-done' : ''}` }, [
        el('input', {
          type: 'checkbox',
          id: inputId,
          checked,
          onchange: (e) => this.toggleStep(step.id, e.target.checked),
        }),
        el('div', { class: 'dmx-help-step-body' }, [
          el('label', { for: inputId, html: renderInline(step.label, this.linkOptions) }),
          el('div', { class: 'dmx-help-step-actions' }, [
            docs ? el('a', { href: docs.href, text: 'Docs' }) : null,
            figure ? el('button', {
              type: 'button',
              text: 'Screenshot',
              onclick: (e) => {
                figure.hidden = !figure.hidden;
                e.target.setAttribute('aria-expanded', String(!figure.hidden));
              },
            }) : null,
            index === nextIndex && !this.stream ? el('button', {
              type: 'button',
              text: 'I’m stuck',
              onclick: () => this.submit(`I'm stuck on step ${index + 1}: ${step.label.replace(/\*\*|`/g, '')}`),
            }) : null,
          ]),
          figure,
        ]),
      ]));
    });

    this.checklist.replaceChildren(header, list);
  }

  async toggleStep(stepId, done) {
    const view = this.walkthrough;
    if (!view || !this.sessionId) return;

    const previous = [...view.completedStepIds];
    view.completedStepIds = done
      ? view.steps.map((s) => s.id).filter((id) => id === stepId || previous.includes(id))
      : previous.filter((id) => id !== stepId);
    this.renderChecklist();

    try {
      this.setWalkthrough(await this.api.setStep(this.sessionId, view.id, stepId, done));
    } catch (err) {
      if (err instanceof HelpApiError && err.status === 409) {
        this.loaded = false;
        await this.restore();
        return;
      }
      view.completedStepIds = previous;
      this.renderChecklist();
      this.showNotice(err.message);
    }
  }

  setStreaming(streaming) {
    this.sendButton.textContent = streaming ? 'Stop' : 'Send';
    this.sendButton.classList.toggle('dmx-help-stop', streaming);
    this.renderChecklist();
  }

  setTurnsLeft(turnsLeft) {
    const exhausted = turnsLeft === 0;
    this.input.disabled = exhausted;
    this.input.placeholder = exhausted ? 'This chat is at its limit — start a new chat.' : 'How do I…?';
  }

  updateContinueLink() {
    const show = Boolean(this.continueUrl && this.sessionId);
    this.continueLink.hidden = !show;
    if (show) {
      const url = new URL(this.continueUrl);
      url.searchParams.set('continue', this.sessionId);
      this.continueLink.href = url.toString();
    }
  }

  showNotice(text) {
    this.notice.textContent = text;
    this.notice.hidden = false;
  }

  hideNotice() {
    this.notice.hidden = true;
  }

  scrollToEnd(force = false) {
    const box = this.messages;
    if (force || box.scrollHeight - box.scrollTop - box.clientHeight < 120) box.scrollTop = box.scrollHeight;
  }
}

function mount() {
  for (const root of document.querySelectorAll('[data-dmx-help]')) {
    if (root.dataset.mounted) continue;
    root.dataset.mounted = '1';
    // Rendered inside Starlight's footer; lift it out of the content column's
    // stacking context so the fixed panel sits above the table of contents.
    document.body.append(root);
    new HelpWidget(root);
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
else mount();
