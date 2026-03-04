import { describe, test, expect } from 'vitest';
import { isValidEmail, isValidPassword } from '../utils/validators';

describe('isValidEmail', () => {
  test.each([
    ['user@example.com', true],
    ['a@b.co', true],
    ['name+tag@domain.org', true],
    ['missing-at.com', false],
    ['@no-local.com', false],
    ['no-domain@', false],
    ['', false],
  ])('isValidEmail(%s) => %s', (email, expected) => {
    expect(isValidEmail(email)).toBe(expected);
  });
});

describe('isValidPassword', () => {
  test.each([
    ['StrongPass1', true],
    ['Ab1aaaaa', true],
    ['lowercase1', false],   // no uppercase
    ['UPPERCASE1', false],   // no lowercase
    ['NoDigitHere', false],  // no digit
    ['Ab1', false],          // too short
    ['', false],
  ])('isValidPassword(%s) => %s', (password, expected) => {
    expect(isValidPassword(password)).toBe(expected);
  });
});
