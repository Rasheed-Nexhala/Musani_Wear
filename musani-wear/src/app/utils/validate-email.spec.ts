import { isValidEmail } from './validate-email';

describe('isValidEmail', () => {
  it('accepts valid email', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
  });

  it('accepts short valid email', () => {
    expect(isValidEmail('a@b.co')).toBe(true);
  });

  it('accepts email with subdomain', () => {
    expect(isValidEmail('user@mail.example.com')).toBe(true);
  });

  it('rejects invalid format', () => {
    expect(isValidEmail('invalid')).toBe(false);
  });

  it('rejects email without @', () => {
    expect(isValidEmail('userexample.com')).toBe(false);
  });

  it('rejects email without domain', () => {
    expect(isValidEmail('user@')).toBe(false);
  });

  it('trims whitespace before validation', () => {
    expect(isValidEmail('  user@example.com  ')).toBe(true);
  });

  it('rejects empty string', () => {
    expect(isValidEmail('')).toBe(false);
  });
});
