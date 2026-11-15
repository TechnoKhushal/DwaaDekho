const { after, before, test } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

process.env.NODE_ENV = 'test';
process.env.ALLOWED_ORIGINS = 'https://test.example';

const app = require('../legacy-server.cjs');
let server;
let baseUrl;

before(async () => {
  server = app.listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (server?.listening) {
    await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
});

test('serves a filtered development catalogue response with security headers', async () => {
  const response = await fetch(`${baseUrl}/api/medicines?q=dolo`, {
    headers: { Origin: 'https://test.example' },
  });
  const items = await response.json();

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(items));
  assert.ok(items.length > 0);
  assert.equal(response.headers.get('access-control-allow-origin'), 'https://test.example');
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(response.headers.get('x-frame-options'), 'DENY');
});

test('does not grant CORS access to an unlisted origin', async () => {
  const response = await fetch(`${baseUrl}/api/medicines`, {
    headers: { Origin: 'https://unlisted.example' },
  });

  assert.equal(response.headers.get('access-control-allow-origin'), null);
});

test('rejects JSON bodies larger than the configured limit', async () => {
  const response = await fetch(`${baseUrl}/api/unknown`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ payload: 'x'.repeat(1024 * 1024) }),
  });

  assert.equal(response.status, 413);
});

test('refuses to start the legacy fixture server in production', () => {
  const serverPath = path.resolve(__dirname, '..', 'legacy-server.cjs');
  const result = spawnSync(process.execPath, [serverPath], {
    encoding: 'utf8',
    timeout: 10_000,
    env: { ...process.env, NODE_ENV: 'production', PORT: '0' },
  });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /legacy static-data API is disabled in production/);
});
