const test = require('node:test');
const assert = require('node:assert/strict');

const { getPagination, generateSlug } = require('../src/utils/helpers');
const { registerSchema } = require('../src/validators/authValidator');
const { createEnrollmentSchema } = require('../src/validators/enrollmentValidator');

test('helper getPagination should clamp values', () => {
  const pagination = getPagination(-1, 500);

  assert.equal(pagination.page, 1);
  assert.equal(pagination.limit, 100);
  assert.equal(pagination.skip, 0);
});

test('helper generateSlug should normalize text', () => {
  const slug = generateSlug('  Cours Français Débutant  ');

  assert.equal(slug, 'cours-francais-debutant');
});

test('auth register schema should parse valid payload', () => {
  const parsed = registerSchema.body.parse({
    email: 'USER@EXAMPLE.COM',
    password: 'StrongPass1',
    firstName: 'Jean',
    lastName: 'Dupont',
  });

  assert.equal(parsed.email, 'user@example.com');
  assert.equal(parsed.firstName, 'Jean');
});

test('enrollment schema should reject invalid courseId', () => {
  assert.throws(() => {
    createEnrollmentSchema.body.parse({
      courseId: '123',
    });
  });
});
