// DMX Core 100 docs copilot widget.
//
// Chat overlay on docs.dmxcore.com. Answers stream as markdown; step-by-step
// answers arrive as a structured walkthrough and render as a checklist card inside
// the answer. A slim progress bar above the input keeps the current step in view
// when the card scrolls away. Checking a step PATCHes the session so the next turn
// knows where the user is. The session id lives in localStorage so the thread
// survives page navigation.

import { createHelpApi, HelpApiError } from './api.js';
import { renderInline, renderMarkdown, resolveLink } from './markdown.js';

const SESSION_KEY = 'dmxcore-help-session';
const OPEN_KEY = 'dmxcore-help-open';
const COLLAPSED_KEY = 'dmxcore-help-collapsed-checklists';
const EXPANDED_KEY = 'dmxcore-help-expanded';
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

/** Step labels carry **bold** UI names; plain text for messages and the progress bar. */
const plain = (label) => label.replace(/\*\*|`/g, '');

class HelpWidget {
  constructor(root) {
    this.root = root;
    this.api = createHelpApi(root.dataset.api);
    this.continueUrl = root.dataset.continue || '';
    this.local = safeStorage('localStorage');
    this.tab = safeStorage('sessionStorage');
    this.sessionId = this.local?.getItem(SESSION_KEY) || null;
    this.collapsedChecklists = this.loadCollapsedChecklists();
    this.walkthrough = null;
    this.stream = null;
    this.loaded = false;
    this.linkOptions = { docsOrigins: [...DOCS_ORIGINS, window.location.origin] };

    this.build();
    this.setExpanded(this.local?.getItem(EXPANDED_KEY) === '1');
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
    // Follow new content only while the reader is at the bottom. Decided on scroll, not
    // after content grows, so a tall checklist card does not unstick the view.
    this.stickToBottom = true;
    this.messages.addEventListener('scroll', () => {
      const box = this.messages;
      this.stickToBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 120;
      this.scheduleProgressUpdate();
    }, { passive: true });

    // One card for the current walkthrough; placeChecklist() moves it into the answer that showed it.
    this.checklistCard = el('div', { class: 'dmx-help-card', role: 'group', 'aria-label': 'Checklist' });
    this.progressBar = el('button', {
      type: 'button',
      class: 'dmx-help-progress',
      hidden: true,
      onclick: () => {
        if (this.walkthrough && this.collapsedChecklists.has(this.walkthrough.id)) {
          this.setChecklistCollapsed(this.walkthrough.id, false);
        }
        this.checklistCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      },
    });
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
          this.expandButton = el('button', {
            type: 'button',
            class: 'dmx-help-icon-button dmx-help-expand',
            onclick: () => this.setExpanded(!this.expanded),
          }),
          el('button', { type: 'button', class: 'dmx-help-icon-button', text: 'New chat', onclick: () => this.newChat() }),
          el('button', { type: 'button', class: 'dmx-help-icon-button', 'aria-label': 'Close help', text: '✕', onclick: () => this.close() }),
        ]),
      ]),
      this.messages,
      this.progressBar,
      this.notice,
      composer,
      this.continueLink,
    ]);

    this.root.append(this.launcher, this.panel, this.buildLightbox());
    this.updateContinueLink();
  }

  /** Full-window screenshot viewer; the checklist thumbnails are too small to read. */
  buildLightbox() {
    this.lightboxImage = el('img', { alt: '' });
    this.lightboxCaption = el('p', { class: 'dmx-help-lightbox-caption' });
    this.lightboxLink = el('a', { target: '_blank', rel: 'noopener', text: 'Open full size ↗' });
    this.lightbox = el('dialog', {
      class: 'dmx-help-lightbox',
      'aria-label': 'Screenshot',
      onclick: (e) => {
        if (e.target === this.lightbox || e.target === this.lightboxImage) this.lightbox.close();
      },
    }, [
      el('button', {
        type: 'button',
        class: 'dmx-help-lightbox-close',
        'aria-label': 'Close screenshot',
        text: '✕',
        onclick: () => this.lightbox.close(),
      }),
      this.lightboxImage,
      el('div', { class: 'dmx-help-lightbox-footer' }, [this.lightboxCaption, this.lightboxLink]),
    ]);
    return this.lightbox;
  }

  showScreenshot(src, alt) {
    this.lightboxImage.src = src;
    this.lightboxImage.alt = alt;
    this.lightboxCaption.textContent = alt;
    this.lightboxLink.href = src;
    this.lightbox.showModal();
  }

  async open({ focus = true } = {}) {
    this.panel.hidden = false;
    this.root.classList.add('dmx-help-open');
    this.launcher.setAttribute('aria-expanded', 'true');
    this.tab?.setItem(OPEN_KEY, '1');
    if (!this.warmedUp) {
      // The API scales to zero; start it while the user reads the suggestions.
      this.warmedUp = true;
      this.api.warmUp();
    }
    if (!this.loaded) await this.restore();
    this.updateProgressBar();
    if (focus) this.input.focus();
  }

  close() {
    this.panel.hidden = true;
    this.root.classList.remove('dmx-help-open');
    this.launcher.setAttribute('aria-expanded', 'false');
    this.tab?.setItem(OPEN_KEY, '0');
    this.launcher.focus();
  }

  /** Wider, taller panel for long answers and screenshots; remembered across pages and visits. */
  setExpanded(expanded) {
    this.expanded = expanded;
    this.panel.classList.toggle('dmx-help-expanded', expanded);
    this.expandButton.textContent = expanded ? 'Shrink' : 'Expand';
    this.expandButton.title = expanded ? 'Make the help panel smaller' : 'Make the help panel larger';
    if (expanded) this.local?.setItem(EXPANDED_KEY, '1');
    else this.local?.removeItem(EXPANDED_KEY);
    this.scheduleProgressUpdate();
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
        else this.addAssistantBubble(message.content, message.walkthroughId, message.turn, message.rating);
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
        el('p', {
          class: 'dmx-help-hint',
          text: 'Chats are saved for up to a year to improve these docs. Don’t include personal details, passwords, PINs or license keys.',
        }),
        el('div', { class: 'dmx-help-suggestions' }, SUGGESTIONS.map((text) =>
          el('button', { type: 'button', class: 'dmx-help-suggestion', text, onclick: () => this.submit(text) }))),
      ]),
    );
    this.updateProgressBar();
  }

  addUserBubble(text) {
    this.messages.querySelector('.dmx-help-empty')?.remove();
    const bubble = el('div', { class: 'dmx-help-bubble dmx-help-user', text });
    this.messages.append(bubble);
    return bubble;
  }

  addAssistantBubble(markdown = '', walkthroughId = null, turn = null, rating = null) {
    const body = el('div', { class: 'dmx-help-markdown', html: renderMarkdown(markdown, this.linkOptions) });
    const bubble = el('div', { class: 'dmx-help-bubble dmx-help-assistant' }, [body]);
    if (walkthroughId) bubble.dataset.walkthroughId = walkthroughId;
    if (turn) bubble.append(this.feedbackRow(turn, rating));
    this.messages.append(bubble);
    return { bubble, body };
  }

  /** 👍 sends at once; 👎 sends at once and offers an optional comment, sent as a second rating. */
  feedbackRow(turn, initialRating) {
    const sessionId = this.sessionId;
    const up = el('button', { type: 'button', title: 'Helpful', 'aria-label': 'Helpful', text: '👍' });
    const down = el('button', { type: 'button', title: 'Not helpful', 'aria-label': 'Not helpful', text: '👎' });
    const status = el('span', { class: 'dmx-help-hint', role: 'status' });
    const comment = el('textarea', {
      rows: '2',
      maxlength: '1000',
      placeholder: 'What was wrong or missing? (optional)',
      'aria-label': 'What was wrong or missing?',
    });
    const form = el('form', { class: 'dmx-help-feedback-form', hidden: true }, [
      comment,
      el('button', { type: 'submit', text: 'Send' }),
    ]);

    const mark = (rating) => {
      up.setAttribute('aria-pressed', String(rating === 'up'));
      down.setAttribute('aria-pressed', String(rating === 'down'));
    };
    const send = async (rating, text) => {
      mark(rating);
      try {
        await this.api.sendFeedback(sessionId, turn, rating, text);
        status.textContent = 'Thanks for the feedback.';
      } catch (err) {
        status.textContent = err.message;
      }
    };

    up.addEventListener('click', () => {
      form.hidden = true;
      send('up');
    });
    down.addEventListener('click', () => {
      form.hidden = false;
      comment.focus();
      send('down');
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.hidden = true;
      send('down', comment.value.trim());
    });

    mark(initialRating);
    return el('div', {}, [
      el('div', { class: 'dmx-help-feedback' }, [el('span', { class: 'dmx-help-hint', text: 'Helpful?' }), up, down, status]),
      form,
    ]);
  }

  async submit(preset) {
    const text = (preset ?? this.input.value).trim();
    if (!text || this.busy) return;

    // Lock and show the question before any await: starting the API can take several
    // seconds, and repeated clicks must not start more conversations.
    this.busy = true;
    this.stream = new AbortController();
    const { signal } = this.stream;
    this.hideNotice();
    this.input.value = '';
    this.addUserBubble(text);
    const { bubble, body } = this.addAssistantBubble();
    const status = el('p', { class: 'dmx-help-status', text: this.sessionId ? 'Thinking…' : 'Connecting…' });
    bubble.prepend(status);
    this.setStreaming(true);
    this.scrollToEnd(true);

    let markdown = '';
    let frame = 0;
    let sent = false;
    const render = () => {
      frame = 0;
      body.innerHTML = renderMarkdown(markdown, this.linkOptions);
      this.scrollToEnd();
    };

    try {
      if (!this.sessionId) {
        const session = await this.api.createSession(signal);
        this.sessionId = session.sessionId;
        this.local?.setItem(SESSION_KEY, this.sessionId);
        this.updateContinueLink();
        status.textContent = 'Thinking…';
      }
      sent = true;
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
            bubble.dataset.walkthroughId = payload.id;
            // A new or refined checklist always opens, even if an earlier version was collapsed.
            this.collapsedChecklists.delete(payload.id);
            this.saveCollapsedChecklists();
            this.setWalkthrough(payload);
            this.scrollToEnd();
            break;
          case 'sources':
            bubble.append(this.sourceLinks(payload.pages));
            this.scrollToEnd();
            break;
          case 'error':
            status.remove();
            bubble.append(el('p', { class: 'dmx-help-error', text: payload.message }));
            break;
          case 'done':
            this.setTurnsLeft(payload.turnsLeft);
            if (payload.turn) bubble.append(this.feedbackRow(payload.turn, null));
            break;
        }
      }, signal);
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
      // Never reached the API: give the question back so it can be sent again.
      if (!sent && !this.input.value) this.input.value = text;
    } finally {
      if (frame) cancelAnimationFrame(frame);
      render();
      status.remove();
      const hasContent = markdown || bubble.querySelector('.dmx-help-card, .dmx-help-error, .dmx-help-hint, .dmx-help-sources');
      if (!hasContent) bubble.remove();
      this.stream = null;
      this.busy = false;
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

  renderChecklist() {
    const view = this.walkthrough;
    if (!view) {
      this.checklistCard.replaceChildren();
      this.placeChecklist();
      return;
    }

    // Re-rendering replaces the checkboxes; keep keyboard focus on the one just toggled.
    const focusedId = this.checklistCard.contains(document.activeElement) ? document.activeElement.id : null;
    const done = new Set(view.completedStepIds);
    const nextIndex = view.steps.findIndex((s) => !done.has(s.id));
    const collapsed = this.collapsedChecklists.has(view.id);
    const listId = `dmx-help-steps-${view.id}`;

    const header = el('button', {
      type: 'button',
      id: `dmx-help-checklist-toggle-${view.id}`,
      class: 'dmx-help-checklist-header',
      'aria-expanded': String(!collapsed),
      'aria-controls': listId,
      title: collapsed ? 'Show steps' : 'Hide steps',
      onclick: () => this.setChecklistCollapsed(view.id, !collapsed),
    }, [
      el('span', { class: 'dmx-help-checklist-title', text: view.title }),
      el('span', { class: 'dmx-help-checklist-count', text: `${done.size}/${view.steps.length} ${collapsed ? '▸' : '▾'}` }),
    ]);

    const nextStep = nextIndex >= 0 ? view.steps[nextIndex] : null;
    const summary = collapsed
      ? el('p', { class: 'dmx-help-checklist-next', text: nextStep ? `Next: ${plain(nextStep.label)}` : 'All steps done ✓' })
      : null;

    const list = el('ol', { class: 'dmx-help-steps', id: listId, hidden: collapsed });
    view.steps.forEach((step, index) => {
      const checked = done.has(step.id);
      const inputId = `dmx-help-step-${view.id}-${step.id}`;
      const docs = step.docsUrl ? resolveLink(step.docsUrl, this.linkOptions) : null;
      const shot = step.screenshot ? resolveLink(step.screenshot.url, this.linkOptions) : null;
      const figure = shot
        ? el('figure', { class: 'dmx-help-shot', hidden: true }, [
            el('button', {
              type: 'button',
              class: 'dmx-help-shot-open',
              title: 'Click to enlarge',
              'aria-label': `Enlarge screenshot: ${step.screenshot.alt}`,
              onclick: () => this.showScreenshot(shot.href, step.screenshot.alt),
            }, [el('img', { src: shot.href, alt: step.screenshot.alt, loading: 'lazy' })]),
            el('figcaption', { text: `${step.screenshot.alt} · click to enlarge` }),
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
              onclick: () => this.submit(`I'm stuck on step ${index + 1}: ${plain(step.label)}`),
            }) : null,
          ]),
          figure,
        ]),
      ]));
    });

    this.checklistCard.replaceChildren(...[header, summary, list].filter(Boolean));
    if (focusedId) document.getElementById(focusedId)?.focus();
    this.placeChecklist();
  }

  /** Walkthrough ids collapsed in this tab; kept in sessionStorage so they survive page navigation. */
  loadCollapsedChecklists() {
    try {
      return new Set(JSON.parse(this.tab?.getItem(COLLAPSED_KEY) ?? '[]'));
    } catch {
      return new Set();
    }
  }

  saveCollapsedChecklists() {
    try {
      this.tab?.setItem(COLLAPSED_KEY, JSON.stringify([...this.collapsedChecklists]));
    } catch {
      // Storage blocked or full: collapsing still works for this page.
    }
  }

  setChecklistCollapsed(id, collapsed) {
    if (collapsed) this.collapsedChecklists.add(id);
    else this.collapsedChecklists.delete(id);
    this.saveCollapsedChecklists();
    this.renderChecklist();
  }

  /**
   * The card lives in the latest answer that showed this walkthrough. Earlier answers
   * that showed a checklist keep a one-line note pointing down to it.
   */
  placeChecklist() {
    const view = this.walkthrough;
    const bubbles = [...this.messages.querySelectorAll('.dmx-help-assistant[data-walkthrough-id]')];
    const owner = view ? bubbles.filter((b) => b.dataset.walkthroughId === view.id).at(-1) : null;

    for (const bubble of bubbles) {
      const body = bubble.querySelector(':scope > .dmx-help-markdown');
      const note = bubble.querySelector(':scope > .dmx-help-checklist-note');
      if (bubble === owner) {
        note?.remove();
        if (body.nextElementSibling !== this.checklistCard) body.after(this.checklistCard);
        continue;
      }

      const text = view && bubble.dataset.walkthroughId === view.id ? 'Checklist updated below ↓' : 'Earlier checklist, replaced below ↓';
      if (note) note.textContent = text;
      else body.after(el('p', { class: 'dmx-help-checklist-note', text }));
    }

    if (!view) this.checklistCard.remove();
    else if (!owner) this.messages.append(this.checklistCard);
    this.updateProgressBar();
  }

  scheduleProgressUpdate() {
    if (this.progressFrame) return;
    this.progressFrame = requestAnimationFrame(() => {
      this.progressFrame = 0;
      this.updateProgressBar();
    });
  }

  /** Shown only while the checklist card is scrolled out of view; clicking it scrolls back. */
  updateProgressBar() {
    const view = this.walkthrough;
    let show = Boolean(view && this.checklistCard.isConnected && !this.panel.hidden);
    if (show) {
      const box = this.messages.getBoundingClientRect();
      const card = this.checklistCard.getBoundingClientRect();
      show = card.bottom <= box.top || card.top >= box.bottom;
    }

    this.progressBar.hidden = !show;
    if (!show) return;

    const done = new Set(view.completedStepIds);
    const next = view.steps.find((s) => !done.has(s.id));
    const text = `▸ ${view.title} · ${done.size}/${view.steps.length} · ${next ? `Next: ${plain(next.label)}` : 'All steps done ✓'}`;
    if (this.progressBar.textContent !== text) {
      this.progressBar.textContent = text;
      this.progressBar.title = text;
    }
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
    if (force || this.stickToBottom) this.messages.scrollTop = this.messages.scrollHeight;
    this.scheduleProgressUpdate();
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
