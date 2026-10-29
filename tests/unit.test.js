import { test } from 'node:test';
import assert from 'node:assert/strict';
import { changeCount } from '../src/counter.js';
test('increments and decrements', () => {
  assert.equal(changeCount(3, 1), 4);
  assert.equal(changeCount(3, -1), 2);
});
test('clamps both boundaries', () => {
  assert.equal(changeCount(0, -1), 0);
  assert.equal(changeCount(99, 1), 99);
});
