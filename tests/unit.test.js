import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  nearest,
  palette,
  quantize,
  inventory,
  partsCsv,
  instructions,
} from '../src/mosaic.js';
test('exact palette matches and transparent pixels composite on white', () => {
  palette.forEach((color, index) => assert.equal(nearest(color.rgb), index));
  assert.deepEqual(quantize(new Uint8ClampedArray([0, 0, 0, 0])), [0]);
});
test('inventory totals and exports match all cells', () => {
  const cells = [0, 1, 1, 2];
  assert.equal(
    inventory(cells).reduce((sum, color) => sum + color.count, 0),
    4,
  );
  assert.match(partsCsv(cells), /Ink,#273844,2/);
  assert.match(instructions(cells, 2), /Row 2: Ink \| Ocean/);
  assert.match(instructions(cells, 2), /Physical fit is not validated/);
});
