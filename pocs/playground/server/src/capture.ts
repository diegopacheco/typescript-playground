export type Captured = { readonly text: string; readonly truncated: boolean };

export async function capture(stream: ReadableStream<Uint8Array>, maxBytes: number): Promise<Captured> {
  const decoder = new TextDecoder();
  let text = "";
  let kept = 0;
  let truncated = false;
  for await (const chunk of stream) {
    const room = maxBytes - kept;
    if (room <= 0) {
      truncated = true;
      continue;
    }
    const part = chunk.length > room ? chunk.subarray(0, room) : chunk;
    truncated ||= part.length < chunk.length;
    kept += part.length;
    text += decoder.decode(part, { stream: true });
  }
  text += decoder.decode();
  return { text: truncated ? text + "\n[output truncated]\n" : text, truncated };
}
