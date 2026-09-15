// Print a docs copilot transcript. Opens the browser print dialog so the user can
// also save as PDF. Builds a standalone light-theme document so Ctrl+P on the docs
// page still prints the page, not the chat.

const STRIP_SELECTORS = [
  '.dmx-help-empty',
  '.dmx-help-suggestions',
  '.dmx-help-feedback',
  '.dmx-help-feedback-form',
  '.dmx-help-portal',
  '.dmx-help-status',
  '.dmx-help-checklist-next',
].join(',');

export const PRINT_STYLES = `
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    color: #111;
    background: #fff;
    font: 12pt/1.45 system-ui, sans-serif;
  }
  header {
    margin-bottom: 1.25rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #ccc;
  }
  h1 {
    margin: 0 0 0.25rem;
    font-size: 1.25rem;
  }
  .meta {
    margin: 0;
    color: #444;
    font-size: 0.9rem;
  }
  .dmx-help-messages {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .dmx-help-bubble {
    max-width: 100%;
    padding: 0.55rem 0.7rem;
    border: 1px solid #ddd;
    border-radius: 0.4rem;
    overflow-wrap: anywhere;
    break-inside: avoid;
  }
  .dmx-help-user {
    align-self: flex-end;
    width: 85%;
    background: #f3f3f3;
    white-space: pre-wrap;
  }
  .dmx-help-assistant { background: #fff; }
  .dmx-help-markdown p,
  .dmx-help-markdown ul,
  .dmx-help-markdown ol,
  .dmx-help-markdown pre { margin: 0.35rem 0; }
  .dmx-help-markdown ul,
  .dmx-help-markdown ol { padding-inline-start: 1.2rem; }
  .dmx-help-markdown code {
    padding: 0 0.25rem;
    border-radius: 0.2rem;
    background: #f3f3f3;
    font-family: ui-monospace, monospace;
    font-size: 0.9em;
  }
  .dmx-help-markdown pre {
    padding: 0.5rem;
    overflow-x: auto;
    border-radius: 0.3rem;
    background: #f3f3f3;
  }
  .dmx-help-markdown pre code { padding: 0; background: none; }
  a { color: #0645ad; }
  .dmx-help-sources {
    margin: 0.35rem 0 0;
    color: #444;
    font-size: 0.85rem;
  }
  .dmx-help-card {
    margin-top: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.4rem;
    break-inside: avoid;
  }
  .dmx-help-checklist-header {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.5rem 0.7rem 0.3rem;
    font-weight: 600;
  }
  .dmx-help-checklist-count { font-weight: 400; color: #444; }
  .dmx-help-steps {
    margin: 0;
    padding: 0 0.7rem 0.4rem;
    list-style: none;
  }
  .dmx-help-step {
    display: flex;
    gap: 0.55rem;
    padding: 0.45rem 0;
    border-top: 1px solid #ddd;
  }
  .dmx-help-step input[type='checkbox'] {
    appearance: none;
    -webkit-appearance: none;
    flex-shrink: 0;
    width: 0.85rem;
    height: 0.85rem;
    margin-top: 0.2rem;
    border: 1px solid #333;
    border-radius: 0.15rem;
    background: #fff;
    position: relative;
  }
  .dmx-help-step input[type='checkbox']:checked {
    background: #111;
  }
  .dmx-help-step input[type='checkbox']:checked::after {
    content: '';
    position: absolute;
    left: 0.18rem;
    top: 0.02rem;
    width: 0.28rem;
    height: 0.5rem;
    border: solid #fff;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
  .dmx-help-step-done label {
    color: #555;
    text-decoration: line-through;
  }
  .dmx-help-step-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-top: 0.25rem;
    font-size: 0.85rem;
  }
  .dmx-help-shot { margin: 0.4rem 0 0; }
  .dmx-help-shot img {
    display: block;
    max-width: 100%;
    border: 1px solid #ccc;
  }
  .dmx-help-shot figcaption {
    margin-top: 0.2rem;
    color: #444;
    font-size: 0.85rem;
  }
  .dmx-help-error { color: #b91c1c; }
  @media print {
    body { background: #fff; }
    a[href^='http']::after { content: ' (' attr(href) ')'; font-size: 0.8em; color: #444; }
  }
`.trim();

/** True when the open chat has at least one message and is still on the docs site. */
export function canPrintTranscript(messagesEl, inPortal = false) {
  if (inPortal || !messagesEl) return false;
  return Boolean(messagesEl.querySelector('.dmx-help-user, .dmx-help-assistant'));
}

/** Clone the live transcript and drop chrome that does not belong on paper. */
export function preparePrintClone(messagesEl) {
  const clone = messagesEl.cloneNode(true);
  clone.querySelectorAll(STRIP_SELECTORS).forEach((node) => node.remove());
  clone.querySelectorAll('.dmx-help-step-actions button').forEach((node) => node.remove());
  clone.querySelectorAll('.dmx-help-step-actions').forEach((node) => {
    if (!node.querySelector('a')) node.remove();
  });
  clone.querySelectorAll('.dmx-help-shot-open').forEach((btn) => {
    const img = btn.querySelector('img');
    if (img) btn.replaceWith(img);
  });
  clone.querySelectorAll('.dmx-help-shot figcaption').forEach((node) => {
    node.textContent = node.textContent.replace(/\s*· click to enlarge/i, '');
  });
  clone.querySelectorAll('[hidden]').forEach((node) => {
    node.hidden = false;
    node.removeAttribute('hidden');
  });
  clone.querySelectorAll('.dmx-help-checklist-count').forEach((node) => {
    node.textContent = node.textContent.replace(/\s*[▸▾]\s*$/u, '').trim();
  });
  const doc = messagesEl.ownerDocument;
  clone.querySelectorAll('.dmx-help-checklist-header').forEach((btn) => {
    const heading = doc.createElement('div');
    heading.className = btn.className;
    heading.innerHTML = btn.innerHTML;
    btn.replaceWith(heading);
  });
  clone.querySelectorAll('input').forEach((input) => {
    input.disabled = true;
  });
  return clone;
}

export function buildPrintDocument({ title, subtitle, printedLabel, bodyHtml }) {
  const safeTitle = escapeHtml(title);
  const safeSubtitle = escapeHtml(subtitle);
  const safePrinted = escapeHtml(printedLabel);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${safeTitle}</title>
  <style>${PRINT_STYLES}</style>
</head>
<body>
  <header>
    <h1>${safeTitle}</h1>
    <p class="meta">${safeSubtitle} ${safePrinted}.</p>
  </header>
  <div class="dmx-help-messages">${bodyHtml}</div>
</body>
</html>`;
}

/** Open the browser print dialog for a transcript already on the page. */
export async function printTranscript(messagesEl, {
  title = 'DMX Core 100 help',
  subtitle = 'Answers from these docs.',
  printedAt = new Date(),
  window: win = globalThis,
} = {}) {
  const clone = preparePrintClone(messagesEl);
  const html = buildPrintDocument({
    title,
    subtitle,
    printedLabel: `Printed ${printedAt.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}`,
    bodyHtml: clone.innerHTML,
  });
  await printHtmlDocument(html, win);
}

export function printHtmlDocument(html, win = globalThis) {
  const doc = win.document;
  const iframe = doc.createElement('iframe');
  iframe.className = 'dmx-help-print-frame';
  iframe.title = 'Print chat';
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
  iframe.srcdoc = html;

  return new Promise((resolve) => {
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      iframe.remove();
      resolve();
    };

    iframe.addEventListener('load', async () => {
      const frameDoc = iframe.contentDocument;
      const frameWin = iframe.contentWindow;
      if (!frameDoc || !frameWin) {
        finish();
        return;
      }
      frameWin.addEventListener('afterprint', finish);
      await imagesReady(frameDoc);
      frameWin.focus();
      frameWin.print();
    });

    doc.body.append(iframe);
    win.setTimeout(finish, 120000);
  });
}

function imagesReady(doc) {
  const images = [...doc.images];
  if (!images.length) return Promise.resolve();
  return Promise.race([
    Promise.all(images.map((img) => (img.decode ? img.decode().catch(() => {}) : loadImage(img)))),
    new Promise((resolve) => setTimeout(resolve, 3000)),
  ]);
}

function loadImage(img) {
  if (img.complete) return Promise.resolve();
  return new Promise((resolve) => {
    img.addEventListener('load', resolve, { once: true });
    img.addEventListener('error', resolve, { once: true });
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
