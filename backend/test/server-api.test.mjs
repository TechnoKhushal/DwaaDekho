import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL ||= 'postgresql://test:test@127.0.0.1:5432/test?schema=public';
process.env.ALLOWED_ORIGINS = 'https://test.example';

const { app } = await import('../dist/server.js');
const { prisma } = await import('../dist/config/database.js');
let server;
let baseUrl;

before(async () => {
  server = app.listen(0, '127.0.0.1');
  await new Promise((resolveReady, reject) => {
    server.once('listening', resolveReady);
    server.once('error', reject);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (server?.listening) {
    await new Promise((resolveClose, reject) => server.close(error => error ? reject(error) : resolveClose()));
  }
});

test('liveness response is available without database access and includes request ID', async () => {
  const response = await fetch(`${baseUrl}/health/live`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(body, { status: 'ok' });
  assert.ok(response.headers.get('x-request-id'));
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
});

test('invalid catalogue limits are rejected before a database query', async () => {
  const response = await fetch(`${baseUrl}/api/v1/medicines?limit=51`);
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.error.code, 'INVALID_LIMIT');
});

test('repeated and oversized search parameters are rejected before a database query', async () => {
  const repeated = await fetch(`${baseUrl}/api/v1/medicines?q=one&q=two`);
  const oversized = await fetch(`${baseUrl}/api/v1/medicines?q=${'x'.repeat(101)}`);

  assert.equal(repeated.status, 400);
  assert.equal((await repeated.json()).error.code, 'INVALID_QUERY');
  assert.equal(oversized.status, 400);
  assert.equal((await oversized.json()).error.code, 'INVALID_QUERY');
});

test('catalogue search returns only selected fields from the database query', async () => {
  const original = prisma.medicine.findMany;
  let queryArgs;
  prisma.medicine.findMany = async (args) => {
    queryArgs = args;
    return [{ id: 'medicine-1', name: 'Example', genericName: 'Example salt' }];
  };

  try {
    const response = await fetch(`${baseUrl}/api/v1/medicines?q=example&limit=5`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body, { success: true, data: [{ id: 'medicine-1', name: 'Example', genericName: 'Example salt' }] });
    assert.equal(queryArgs.take, 5);
    assert.equal(queryArgs.where.OR[0].name.contains, 'example');
    assert.equal(queryArgs.orderBy.name, 'asc');
    assert.ok(queryArgs.select.id);
  } finally {
    prisma.medicine.findMany = original;
  }
});

test('catalogue detail returns the selected medicine record', async () => {
  const original = prisma.medicine.findUnique;
  let queryArgs;
  prisma.medicine.findUnique = async (args) => {
    queryArgs = args;
    return { id: 'medicine-1', name: 'Example', genericName: 'Example salt' };
  };

  try {
    const response = await fetch(`${baseUrl}/api/v1/medicines/medicine-1`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body, { success: true, data: { id: 'medicine-1', name: 'Example', genericName: 'Example salt' } });
    assert.equal(queryArgs.where.id, 'medicine-1');
    assert.ok(queryArgs.select.id);
  } finally {
    prisma.medicine.findUnique = original;
  }
});

test('unknown medicine IDs return a not-found response', async () => {
  const original = prisma.medicine.findUnique;
  prisma.medicine.findUnique = async () => null;

  try {
    const response = await fetch(`${baseUrl}/api/v1/medicines/missing`);
    const body = await response.json();

    assert.equal(response.status, 404);
    assert.equal(body.error.code, 'NOT_FOUND');
  } finally {
    prisma.medicine.findUnique = original;
  }
});

test('nearby pharmacy search validates input and returns distance-sorted public listings', async () => {
  const original = prisma.pharmacyProfile.findMany;
  let queryArgs;
  prisma.pharmacyProfile.findMany = async (args) => {
    queryArgs = args;
    return [
      { id: 'far', pharmacyName: 'Far Pharmacy', latitude: 12.99, longitude: 77.59, address: 'Sample Road', rating: 4.4, isJanAushadhi: false, isOpen: true, serviceAreaKm: 10 },
      { id: 'near', pharmacyName: 'Near Pharmacy', latitude: 12.972, longitude: 77.595, address: 'Sample Lane', rating: 4.8, isJanAushadhi: true, isOpen: true, serviceAreaKm: 5 },
    ];
  };

  try {
    const response = await fetch(`${baseUrl}/api/v1/pharmacies/nearby?lat=12.9716&lng=77.5946&radius=5&minRating=4&janAushadhi=true&isOpen=true`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.meta.count, 2);
    assert.deepEqual(body.data.map((pharmacy) => pharmacy.id), ['near', 'far']);
    assert.ok(body.data[0].distanceKm < body.data[1].distanceKm);
    assert.equal('phone' in body.data[0], false);
    assert.equal(queryArgs.where.verificationStatus, 'VERIFIED');
    assert.equal(queryArgs.where.isVerified, true);
    assert.equal(queryArgs.where.isJanAushadhi, true);
    assert.equal(queryArgs.where.isOpen, true);
    assert.equal(queryArgs.where.rating.gte, 4);
  } finally {
    prisma.pharmacyProfile.findMany = original;
  }
});

test('invalid nearby pharmacy coordinates and repeated filters are rejected before database access', async () => {
  const original = prisma.pharmacyProfile.findMany;
  let calls = 0;
  prisma.pharmacyProfile.findMany = async () => { calls += 1; return []; };

  try {
    const invalidCoordinates = await fetch(`${baseUrl}/api/v1/pharmacies/nearby?lat=91&lng=0`);
    const repeatedRadius = await fetch(`${baseUrl}/api/v1/pharmacies/nearby?lat=0&lng=0&radius=1&radius=2`);
    const invalidBoolean = await fetch(`${baseUrl}/api/v1/pharmacies/nearby?lat=0&lng=0&isOpen=yes`);

    assert.equal(invalidCoordinates.status, 400);
    assert.equal(repeatedRadius.status, 400);
    assert.equal(invalidBoolean.status, 400);
    assert.equal(calls, 0);
  } finally {
    prisma.pharmacyProfile.findMany = original;
  }
});

test('database failures return a generic response without leaking internal details', async () => {
  const original = prisma.medicine.findMany;
  prisma.medicine.findMany = async () => { throw new Error('sensitive database detail'); };

  try {
    const response = await fetch(`${baseUrl}/api/v1/medicines`);
    const body = await response.json();

    assert.equal(response.status, 500);
    assert.equal(body.error.code, 'INTERNAL_SERVER_ERROR');
    assert.doesNotMatch(JSON.stringify(body), /sensitive database detail/);
  } finally {
    prisma.medicine.findMany = original;
  }
});

test('unknown API routes return a stable JSON not-found response', async () => {
  const response = await fetch(`${baseUrl}/api/v1/unknown`);
  const body = await response.json();

  assert.equal(response.status, 404);
  assert.deepEqual(body, { success: false, error: { code: 'NOT_FOUND', message: 'Endpoint not found.' } });
});

test('unknown browser origins receive no CORS permission', async () => {
  const response = await fetch(`${baseUrl}/health/live`, {
    headers: { Origin: 'https://unlisted.example' },
  });

  assert.equal(response.status, 200);
  assert.equal(response.headers.get('access-control-allow-origin'), null);
});

test('production API startup fails closed when database configuration is missing', () => {
  const entry = resolve(fileURLToPath(new URL('../dist/server.js', import.meta.url)));
  const result = spawnSync(process.execPath, [entry], {
    encoding: 'utf8',
    timeout: 10_000,
    env: { ...process.env, NODE_ENV: 'production', DATABASE_URL: '', PORT: '0' },
  });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /DATABASE_URL must be configured/);
});
