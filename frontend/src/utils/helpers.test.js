import test from 'node:test';
import assert from 'node:assert/strict';
import { truncateText, cn, formatDuration } from './helpers.js';

test('truncateText should keep short text unchanged', () => {
  assert.equal(truncateText('bonjour', 20), 'bonjour');
});

test('truncateText should trim long text with ellipsis', () => {
  assert.equal(truncateText('abcdefghijklmnopqrstuvwxyz', 10), 'abcdefghij...');
});

test('cn should merge truthy class names', () => {
  assert.equal(cn('btn', false, 'active', null, 'lg'), 'btn active lg');
});

test('formatDuration should format hours and minutes', () => {
  assert.equal(formatDuration(2), '2h');
  assert.equal(formatDuration(0.5), '30 min');
});
