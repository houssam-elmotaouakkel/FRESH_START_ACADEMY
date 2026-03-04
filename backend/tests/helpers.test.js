/**
 * Unit tests — Helpers
 */
const {
  getPagination,
  generateSlug,
  generateUniqueSlug,
  excludeFields,
  isEmpty,
} = require('../src/utils/helpers');

describe('helpers.getPagination', () => {
  test('returns default page=1, limit=10', () => {
    const p = getPagination();
    expect(p.page).toBe(1);
    expect(p.limit).toBe(10);
    expect(p.skip).toBe(0);
  });

  test('clamps negative page to 1', () => {
    const p = getPagination(-5, 10);
    expect(p.page).toBe(1);
    expect(p.skip).toBe(0);
  });

  test('clamps limit to max 100', () => {
    const p = getPagination(1, 500);
    expect(p.limit).toBe(100);
  });

  test('clamps limit to min 1', () => {
    const p = getPagination(1, -3);
    expect(p.limit).toBe(1);
  });

  test('calculates correct skip for page 3, limit 20', () => {
    const p = getPagination(3, 20);
    expect(p.skip).toBe(40);
    expect(p.take).toBe(20);
  });
});

describe('helpers.generateSlug', () => {
  test('normalises whitespace and accents', () => {
    expect(generateSlug('  Cours Français Débutant  ')).toBe('cours-francais-debutant');
  });

  test('removes special characters', () => {
    expect(generateSlug('Hello @World!')).toBe('hello-world');
  });

  test('collapses multiple dashes', () => {
    expect(generateSlug('a---b')).toBe('a-b');
  });
});

describe('helpers.generateUniqueSlug', () => {
  test('appends a timestamp suffix', () => {
    const slug = generateUniqueSlug('Test Course');
    expect(slug).toMatch(/^test-course-[a-z0-9]+$/);
  });
});

describe('helpers.excludeFields', () => {
  test('removes specified keys', () => {
    const result = excludeFields({ a: 1, b: 2, password: 'x' }, ['password']);
    expect(result).toEqual({ a: 1, b: 2 });
    expect(result).not.toHaveProperty('password');
  });
});

describe('helpers.isEmpty', () => {
  test.each([
    [null, true],
    [undefined, true],
    ['', true],
    ['  ', true],
    [[], true],
    [{}, true],
    ['hello', false],
    [[1], false],
    [{ a: 1 }, false],
  ])('isEmpty(%j) => %s', (value, expected) => {
    expect(isEmpty(value)).toBe(expected);
  });
});
