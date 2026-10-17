const assert = require('assert');
const { normalizeTag, normalizeTags } = require('../src/utils/tagNormalizer');

console.log('Running Tag Normalizer & Deduplication Test Suite...');

// 1. Single tag canonical casing
assert.strictEqual(normalizeTag('Tailwind css'), 'Tailwind CSS');
assert.strictEqual(normalizeTag('tailwindcss'), 'Tailwind CSS');
assert.strictEqual(normalizeTag('tailwind'), 'Tailwind CSS');
assert.strictEqual(normalizeTag('react'), 'React.js');
assert.strictEqual(normalizeTag('react.js'), 'React.js');
assert.strictEqual(normalizeTag('node.js'), 'Node.js');
assert.strictEqual(normalizeTag('nodejs'), 'Node.js');
assert.strictEqual(normalizeTag('express'), 'Express.js');
assert.strictEqual(normalizeTag('mongodb'), 'MongoDB');
assert.strictEqual(normalizeTag('mongo'), 'MongoDB');
assert.strictEqual(normalizeTag('redux'), 'Redux Toolkit');
assert.strictEqual(normalizeTag('redux toolkit'), 'Redux Toolkit');
assert.strictEqual(normalizeTag('javascript'), 'JavaScript');
assert.strictEqual(normalizeTag('c'), 'C');
assert.strictEqual(normalizeTag('c language'), 'C');
assert.strictEqual(normalizeTag('c programming'), 'C');
assert.strictEqual(normalizeTag('mysql'), 'MySQL');
assert.strictEqual(normalizeTag('stripe'), 'Stripe');

// 2. Case-insensitive deduplication of array
const duplicateInput = [
  'Tailwind css',
  'Tailwind CSS',
  'tailwindcss',
  'react',
  'React.js',
  'Node.js',
  'node',
  'c',
  'C Language',
];

const deduplicated = normalizeTags(duplicateInput);
console.log('Deduplicated output:', deduplicated);

assert.strictEqual(deduplicated.length, 4, 'Should deduplicate down to 4 canonical tags');
assert.deepStrictEqual(deduplicated, ['Tailwind CSS', 'React.js', 'Node.js', 'C']);

console.log('✓ All 20 assertion checks passed successfully.');
