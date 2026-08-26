const base = process.env.MOCK_URL ?? 'http://localhost:3001/api';

let failures = 0;
let checks = 0;

const call = async (method: string, path: string, body?: unknown) => {
  const response = await fetch(base + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const text = await response.text();
  let parsed: unknown = text;
  try {
    parsed = JSON.parse(text);
  } catch {}
  return { status: response.status, body: parsed as any, headers: response.headers };
};

const check = (name: string, condition: boolean, detail: unknown = '') => {
  checks += 1;
  if (condition) {
    console.log(`  ok   ${name}`);
  } else {
    failures += 1;
    console.log(`  FAIL ${name} ${typeof detail === 'string' ? detail : JSON.stringify(detail)}`);
  }
};

const waitForMock = async () => {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      const response = await fetch(`${base}/books`);
      if (response.ok) return;
    } catch {}
    await Bun.sleep(200);
  }
  throw new Error(`Mock did not answer on ${base}`);
};

await waitForMock();

console.log('books');
const seeded = await call('GET', '/books');
check('lists seeded books', Array.isArray(seeded.body) && seeded.body.length === 8, seeded.body?.length);
check('reports X-Total-Count', seeded.headers.get('x-total-count') === '8');
const created = await call('POST', '/books', { title: 'Mockoon in Action', author: 'Nobody', year: 2026, genre: 'Testing', rating: 5 });
check('creates a book', created.status === 201 && typeof created.body.id === 'string', created.body);
const afterCreate = await call('GET', '/books');
check('create is persisted', afterCreate.body.length === 9, afterCreate.body.length);
const fetched = await call('GET', `/books/${created.body.id}`);
check('reads the new book back', fetched.body.title === 'Mockoon in Action', fetched.body);
const searched = await call('GET', '/books?search=mockoon');
check('full text search narrows the list', searched.body.length === 1, searched.body);
const sorted = await call('GET', '/books?sort=year&order=asc');
check('sorts by year', sorted.body[0].year === 1999, sorted.body[0]);
const updated = await call('PUT', `/books/${created.body.id}`, { title: 'Mockoon in Practice', author: 'Nobody', year: 2026 });
check('updates a book', updated.body.title === 'Mockoon in Practice', updated.body);
check('update keeps the id', updated.body.id === created.body.id, updated.body);
const deleted = await call('DELETE', `/books/${created.body.id}`);
check('deletes a book', deleted.status === 200);
check('delete is persisted', (await call('GET', '/books')).body.length === 8);
check('missing book is a 404', (await call('GET', '/books/does-not-exist')).status === 404);

console.log('calculator');
const sum = await call('POST', '/calculations', { a: 6, op: '+', b: 7 });
check('server evaluates 6 + 7', sum.body.result === 13, sum.body);
const product = await call('POST', '/calculations', { a: 6, op: '*', b: 7 });
check('server evaluates 6 * 7', product.body.result === 42, product.body);
const quotient = await call('POST', '/calculations', { a: 9, op: '/', b: 2 });
check('server evaluates 9 / 2', quotient.body.result === 4.5, quotient.body);
const remainder = await call('POST', '/calculations', { a: 9, op: '%', b: 2 });
check('server evaluates 9 % 2', remainder.body.result === 1, remainder.body);
const difference = await call('POST', '/calculations', { a: 9, op: '-', b: 2 });
check('server evaluates 9 - 2', difference.body.result === 7, difference.body);
const divByZero = await call('POST', '/calculations', { a: 9, op: '/', b: 0 });
check('division by zero is rejected', divByZero.status === 400 && divByZero.body.error === 'division_by_zero', divByZero.body);
const history = await call('GET', '/calculations');
check('history kept every accepted calculation', history.body.length === 5, history.body.length);
check('history entries carry a timestamp', typeof history.body[0].computedAt === 'string', history.body[0]);
check('history entries store numbers, not strings', typeof history.body[0].a === 'number', history.body[0]);
const oneLeft = await call('DELETE', `/calculations/${history.body[0].id}`);
check('drops one history entry', oneLeft.status === 200 && (await call('GET', '/calculations')).body.length === 4);
await call('PUT', '/calculations', []);
check('history can be cleared', (await call('GET', '/calculations')).body.length === 0);

console.log('game');
const outcomes = new Set<string>();
for (let i = 0; i < 40; i += 1) {
  const round = await call('POST', '/rounds', { move: 'rock' });
  if (round.status !== 201) { check('round played', false, round.body); break; }
  outcomes.add(round.body.outcome);
  const expected = round.body.computerMove === 'scissors' ? 'win' : round.body.computerMove === 'rock' ? 'draw' : 'loss';
  if (round.body.outcome !== expected) { check('outcome matches the moves', false, round.body); break; }
}
check('server decides every outcome correctly', true);
check('server picks varied computer moves', outcomes.size >= 2, [...outcomes]);
const rounds = await call('GET', '/rounds');
check('every round was recorded', rounds.body.length === 40, rounds.body.length);
const badMove = await call('POST', '/rounds', { move: 'lizard' });
check('unknown move is rejected', badMove.status === 400 && badMove.body.error === 'invalid_move', badMove.body);
await call('PUT', '/rounds', []);
check('round history can be reset', (await call('GET', '/rounds')).body.length === 0);

console.log('gallery');
const image = await call('POST', '/images', { name: 'From a URL', source: 'url', url: 'https://picsum.photos/id/237/600/400', bytes: 0, addedAt: new Date().toISOString() });
check('adds an image', image.status === 201 && typeof image.body.id === 'string', image.body);
check('gallery grew', (await call('GET', '/images')).body.length === 5);
await call('DELETE', `/images/${image.body.id}`);
check('removes an image', (await call('GET', '/images')).body.length === 4);
const dataUrl = `data:image/png;base64,${'A'.repeat(200000)}`;
const uploaded = await call('POST', '/images', { name: 'Dropped file', source: 'upload', url: dataUrl, bytes: dataUrl.length, addedAt: new Date().toISOString() });
check('accepts a large data URL upload', uploaded.status === 201, uploaded.status);
const readBack = await call('GET', `/images/${uploaded.body.id}`);
check('data URL survives the round trip', readBack.body.url === dataUrl);
await call('DELETE', `/images/${uploaded.body.id}`);

console.log('notes');
const note = await call('POST', '/notes', { title: 'Written by the check', body: 'x', todos: [{ id: 't1', text: 'first', done: false }], updatedAt: new Date().toISOString() });
check('creates a note', note.status === 201, note.body);
const patched = await call('PATCH', `/notes/${note.body.id}`, { todos: [{ id: 't1', text: 'first', done: true }] });
check('patch merges into a note', patched.body.todos[0].done === true && patched.body.title === 'Written by the check', patched.body);
await call('DELETE', `/notes/${note.body.id}`);
check('notes back to the seeded two', (await call('GET', '/notes')).body.length === 2);

console.log('blog');
const post = await call('POST', '/posts', { title: 'Hello', author: 'check', body: 'text', tags: ['a'], imageUrl: '', youtubeUrl: 'https://youtu.be/aQhLI-9NfoQ', publishedAt: new Date().toISOString() });
check('publishes a post', post.status === 201, post.body);
check('tags survive as an array', Array.isArray((await call('GET', `/posts/${post.body.id}`)).body.tags));
await call('DELETE', `/posts/${post.body.id}`);
check('posts back to the seeded two', (await call('GET', '/posts')).body.length === 2);

console.log(`\n${checks - failures}/${checks} checks passed`);
if (failures > 0) process.exit(1);
