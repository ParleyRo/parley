import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseNumber, lineLength, castingWeight, ruleOfThree } from '../src/tools/calculations.js';

test('accepts Romanian decimals and rejects partial or nonfinite input', () => {
  assert.equal(parseNumber(' 0,33 '), 0.33);
  assert.equal(parseNumber('3.5'), 3.5);
  assert.equal(parseNumber('0'), 0);
  for (const input of ['', ' ', '3lbs', '1,2.3', 'Infinity', 'NaN', '1e999']) assert.equal(parseNumber(input), null);
});
test('preserves the existing fishing calculations and rounding', () => {
  assert.equal(lineLength(0.33, 320, 0.25), 557);
  assert.equal(lineLength(33, 320, 25), 557);
  assert.deepEqual(castingWeight(3.5), { grams: 99, min: 79, max: 119 });
  for (const value of [0, -1]) {
    assert.throws(() => lineLength(.33, 320, value));
    assert.throws(() => castingWeight(value));
  }
});
test('proportions handle zero numerators, negatives, rounding, and invalid denominators', () => {
  assert.equal(ruleOfThree(2, 3, 4), '6.00');
  assert.equal(ruleOfThree(3, 1, 1), '0.33');
  assert.equal(ruleOfThree(3, 1, 1, false), String(1 / 3));
  assert.equal(ruleOfThree(2, 0, 4), '0.00');
  assert.equal(ruleOfThree(2, -3, 4), '-6.00');
  assert.throws(() => ruleOfThree(0, 3, 4));
  assert.throws(() => lineLength(1e200, 1e200, 1));
});
