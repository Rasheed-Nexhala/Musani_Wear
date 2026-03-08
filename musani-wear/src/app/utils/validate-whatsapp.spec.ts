import { isValidWhatsAppNumber } from './validate-whatsapp';

describe('isValidWhatsAppNumber', () => {
  it('accepts valid E.164 format (India)', () => {
    expect(isValidWhatsAppNumber('+919876543210')).toBe(true);
  });

  it('accepts valid E.164 format (US)', () => {
    expect(isValidWhatsAppNumber('+12025551234')).toBe(true);
  });

  it('accepts valid E.164 format (15 digits)', () => {
    expect(isValidWhatsAppNumber('+123456789012345')).toBe(true);
  });

  it('rejects number without country code (missing +)', () => {
    expect(isValidWhatsAppNumber('9876543210')).toBe(false);
  });

  it('rejects number that is too short', () => {
    expect(isValidWhatsAppNumber('+123')).toBe(false);
  });

  it('rejects number with leading zero after +', () => {
    expect(isValidWhatsAppNumber('+019876543210')).toBe(false);
  });

  it('trims whitespace before validation', () => {
    expect(isValidWhatsAppNumber('  +919876543210  ')).toBe(true);
  });

  it('rejects empty string', () => {
    expect(isValidWhatsAppNumber('')).toBe(false);
  });
});
