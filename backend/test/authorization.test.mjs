import assert from 'node:assert/strict';
import { test } from 'node:test';
import { userFromVerifiedClaims } from '../src/domain/auth.ts';
import { canAccessPharmacyResources, isAdmin } from '../src/middleware/authorize.ts';

function invoke(middleware, user) {
  const result = { statusCode: 200, body: undefined, nextCalled: false };
  const req = user === undefined ? {} : { user };
  const res = {
    status(code) { result.statusCode = code; return this; },
    json(body) { result.body = body; return this; },
  };
  middleware(req, res, () => { result.nextCalled = true; });
  return result;
}

test('authorization uses server-managed app metadata and ignores user-controlled role metadata', () => {
  assert.equal(userFromVerifiedClaims({ sub: 'user-1', user_metadata: { role: 'admin' } }).role, 'buyer');
  assert.equal(userFromVerifiedClaims({ sub: 'user-1', app_metadata: { role: 'doctor' } }).role, 'doctor');
  assert.equal(userFromVerifiedClaims({ sub: 'user-1', app_metadata: { role: 'root' } }).role, 'buyer');
  assert.equal(userFromVerifiedClaims({ sub: '' }), null);
});

test('pharmacy access admits owner and staff but denies buyers', () => {
  assert.equal(invoke(canAccessPharmacyResources, { id: 'owner', role: 'pharmacy_owner' }).nextCalled, true);
  assert.equal(invoke(canAccessPharmacyResources, { id: 'staff', role: 'pharmacy_staff' }).nextCalled, true);
  assert.equal(invoke(canAccessPharmacyResources, { id: 'buyer', role: 'buyer' }).statusCode, 403);
});

test('admin access rejects missing users and non-admin roles', () => {
  assert.equal(invoke(isAdmin).statusCode, 401);
  assert.equal(invoke(isAdmin, { id: 'doctor', role: 'doctor' }).statusCode, 403);
  assert.equal(invoke(isAdmin, { id: 'admin', role: 'admin' }).nextCalled, true);
});
