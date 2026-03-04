/**
 * Unit tests — Validators
 */
const { registerSchema, loginSchema, changePasswordSchema } = require('../src/validators/authValidator');
const { createEnrollmentSchema } = require('../src/validators/enrollmentValidator');

describe('authValidator — registerSchema', () => {
  const validPayload = {
    email: 'User@Example.COM',
    password: 'StrongPass1',
    firstName: 'Jean',
    lastName: 'Dupont',
  };

  test('parses valid payload and lowercases email', () => {
    const result = registerSchema.body.parse(validPayload);
    expect(result.email).toBe('user@example.com');
    expect(result.firstName).toBe('Jean');
  });

  test('rejects missing email', () => {
    expect(() => registerSchema.body.parse({ ...validPayload, email: undefined })).toThrow();
  });

  test('rejects invalid email', () => {
    expect(() => registerSchema.body.parse({ ...validPayload, email: 'not-an-email' })).toThrow();
  });

  test('rejects short password', () => {
    expect(() => registerSchema.body.parse({ ...validPayload, password: 'Ab1' })).toThrow();
  });

  test('rejects password without uppercase', () => {
    expect(() => registerSchema.body.parse({ ...validPayload, password: 'lowercase1' })).toThrow();
  });

  test('rejects password without digit', () => {
    expect(() => registerSchema.body.parse({ ...validPayload, password: 'NoDigitHere' })).toThrow();
  });

  test('rejects short firstName', () => {
    expect(() => registerSchema.body.parse({ ...validPayload, firstName: 'J' })).toThrow();
  });
});

describe('authValidator — loginSchema', () => {
  test('parses valid login', () => {
    const result = loginSchema.body.parse({ email: 'A@B.COM', password: 'x' });
    expect(result.email).toBe('a@b.com');
  });

  test('rejects empty password', () => {
    expect(() => loginSchema.body.parse({ email: 'a@b.com', password: '' })).toThrow();
  });
});

describe('authValidator — changePasswordSchema', () => {
  test('rejects weak new password', () => {
    expect(() =>
      changePasswordSchema.body.parse({
        currentPassword: 'old',
        newPassword: 'weak',
      })
    ).toThrow();
  });

  test('accepts strong new password', () => {
    const result = changePasswordSchema.body.parse({
      currentPassword: 'old',
      newPassword: 'NewStrong1',
    });
    expect(result.newPassword).toBe('NewStrong1');
  });
});

describe('enrollmentValidator', () => {
  test('rejects non-UUID courseId', () => {
    expect(() => createEnrollmentSchema.body.parse({ courseId: '123' })).toThrow();
  });

  test('rejects numeric courseId', () => {
    expect(() => createEnrollmentSchema.body.parse({ courseId: 5 })).toThrow();
  });

  test('accepts valid UUID courseId', () => {
    const result = createEnrollmentSchema.body.parse({
      courseId: '550e8400-e29b-41d4-a716-446655440000',
    });
    expect(result.courseId).toBe('550e8400-e29b-41d4-a716-446655440000');
  });
});
