import { formatPhoneForWhatsApp } from './format-phone';

describe('formatPhoneForWhatsApp', () => {
  it('strips leading plus for E.164 number', () => {
    expect(formatPhoneForWhatsApp('+919876543210')).toBe('919876543210');
  });

  it('leaves number unchanged when no leading plus', () => {
    expect(formatPhoneForWhatsApp('9876543210')).toBe('9876543210');
  });

  it('handles international numbers', () => {
    expect(formatPhoneForWhatsApp('+1234567890')).toBe('1234567890');
  });

  it('handles empty string', () => {
    expect(formatPhoneForWhatsApp('')).toBe('');
  });
});
