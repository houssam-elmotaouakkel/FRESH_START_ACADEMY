import { describe, test, expect } from 'vitest';
import { truncateText, cn, formatDuration, getInitials } from '../utils/helpers';

describe('truncateText', () => {
  test('keeps short text unchanged', () => {
    expect(truncateText('bonjour', 20)).toBe('bonjour');
  });

  test('trims long text with ellipsis', () => {
    expect(truncateText('abcdefghijklmnopqrstuvwxyz', 10)).toBe('abcdefghij...');
  });

  test('handles exact length', () => {
    expect(truncateText('12345', 5)).toBe('12345');
  });
});

describe('cn', () => {
  test('merges truthy class names', () => {
    expect(cn('btn', false, 'active', null, 'lg')).toBe('btn active lg');
  });

  test('returns empty string for all falsy', () => {
    expect(cn(false, null, undefined, '')).toBe('');
  });
});

describe('formatDuration', () => {
  test('formats hours', () => {
    expect(formatDuration(2)).toBe('2h');
  });

  test('formats fractional hours as minutes', () => {
    expect(formatDuration(0.5)).toBe('30 min');
  });
});

describe('getInitials', () => {
  test('returns uppercase initials', () => {
    expect(getInitials('Jean', 'Dupont')).toBe('JD');
  });

  test('handles missing values', () => {
    expect(getInitials(null, 'Dupont')).toBe('D');
    expect(getInitials(undefined, undefined)).toBe('');
  });
});
