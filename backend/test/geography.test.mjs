import assert from 'node:assert/strict';
import { test } from 'node:test';
import { calculateDistanceKm, validateCoordinates, validateSearchRadius } from '../src/domain/geography.ts';

test('distance between the same valid coordinates is zero', () => {
  assert.equal(calculateDistanceKm({ latitude: 12.9716, longitude: 77.5946 }, { latitude: 12.9716, longitude: 77.5946 }), 0);
});

test('distance uses great-circle distance across the antimeridian', () => {
  const distance = calculateDistanceKm({ latitude: 0, longitude: 179.5 }, { latitude: 0, longitude: -179.5 });
  assert.ok(Math.abs(distance - 111.195) < 0.1);
});

test('coordinate validation rejects out-of-range and non-finite values', () => {
  assert.throws(() => validateCoordinates({ latitude: 91, longitude: 0 }), RangeError);
  assert.throws(() => validateCoordinates({ latitude: 0, longitude: Number.NaN }), RangeError);
});

test('pharmacy search radius is restricted to integer kilometers from one to ten', () => {
  for (const radius of [1, 5, 10]) assert.doesNotThrow(() => validateSearchRadius(radius));
  for (const radius of [0, 11, 1.5, Number.POSITIVE_INFINITY]) assert.throws(() => validateSearchRadius(radius), RangeError);
});
