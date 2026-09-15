// Server-sent events over fetch. EventSource cannot POST, so the chat turn is a
// POST whose response body is read as an event stream.

export function createSseParser(onEvent) {
  let buffer = '';

  return {
    push(chunk) {
      buffer = (buffer + chunk).replace(/\r\n?/g, '\n');
      let end;
      while ((end = buffer.indexOf('\n\n')) >= 0) {
        const block = buffer.slice(0, end);
        buffer = buffer.slice(end + 2);

        let event = 'message';
        const data = [];
        for (const line of block.split('\n')) {
          if (!line || line.startsWith(':')) continue;
          const colon = line.indexOf(':');
          const field = colon < 0 ? line : line.slice(0, colon);
          let value = colon < 0 ? '' : line.slice(colon + 1);
          if (value.startsWith(' ')) value = value.slice(1);
          if (field === 'event') event = value;
          else if (field === 'data') data.push(value);
        }
        if (data.length) onEvent({ event, data: data.join('\n') });
      }
    },
  };
}

/** Reads a fetch Response as SSE, calling onEvent(name, parsedJson) per event. */
export async function readEventStream(response, onEvent) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const parser = createSseParser(({ event, data }) => {
    let payload;
    try {
      payload = JSON.parse(data);
    } catch {
      payload = { text: data };
    }
    onEvent(event, payload);
  });

  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    parser.push(decoder.decode(value, { stream: true }));
  }
  parser.push(`${decoder.decode()}\n\n`);
}
