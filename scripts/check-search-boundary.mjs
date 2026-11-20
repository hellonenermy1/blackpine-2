import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

// Exercise the actual runtime functions, without maintaining a second validation implementation.
const source = await fs.readFile(new URL('../src/site.js', import.meta.url), 'utf8');
const start = source.indexOf('  const validateSearchIndex =');
const end = source.indexOf('  let searchIndexPromise;', start);
assert.ok(start > 0 && end > start);
const code = `${source.slice(start, end)}\n({ validateSearchIndex, readSearchIndex })`;
let cases = 0;
for (const locale of ['en', 'fr', 'es']) {
  const runtime = new vm.Script(code).runInNewContext({ french: locale === 'fr', spanish: locale === 'es', TextDecoder });
  const relative = locale === 'en' ? '' : `${locale}/`;
  const entries = JSON.parse(await fs.readFile(new URL(`../dist/${relative}search-index.json`, import.meta.url), 'utf8'));
  assert.equal(runtime.validateSearchIndex(entries).length, entries.length);
  const first = entries[0];
  for (const value of ['javascript:alert(1)', '//example.com/', '/%2e%2e/', '/a/../b/', '/a\\b/', '/a/?next=external', '/a/#fragment', 'https://example.com/']) {
    assert.throws(() => runtime.validateSearchIndex([{ ...first, path: value }]), /search path/);
    cases += 1;
  }
  const wrongLocale = locale === 'fr' ? '/es/contact/' : '/fr/contact/';
  assert.throws(() => runtime.validateSearchIndex([{ ...first, path: wrongLocale }]), /search locale/);
  assert.throws(() => runtime.validateSearchIndex([first, first]), /Duplicate/);
  assert.throws(() => runtime.validateSearchIndex([{ ...first, headings: {} }]), /headings/);
  assert.throws(() => runtime.validateSearchIndex([{ ...first, title: 'x'.repeat(301) }]), /field/);
  assert.throws(() => runtime.validateSearchIndex(new Array(501).fill(first)), /index/);
  assert.throws(() => runtime.validateSearchIndex({}), /index/);
  const validResponse = new Response(JSON.stringify(entries));
  assert.equal((await runtime.readSearchIndex(validResponse)).length, entries.length);
  await assert.rejects(runtime.readSearchIndex(new Response('{invalid')), /JSON|property|position/i);
  let cancelled = false;
  const oversized = new ReadableStream({
    pull(controller) { controller.enqueue(new Uint8Array(1024 * 1024 + 1)); },
    cancel() { cancelled = true; }
  });
  await assert.rejects(runtime.readSearchIndex(new Response(oversized)), /size limit/);
  assert.equal(cancelled, true);
  cases += 9;
}
console.log(`Search boundary checks passed: three valid locale indexes and ${cases} rejection/stream-limit cases.`);
