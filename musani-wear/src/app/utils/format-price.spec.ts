import { formatPrice } from './format-price';

describe('formatPrice', () => {
  it('formats INR with comma separators', () => {
    expect(formatPrice(2499)).toBe('₹2,499');
  });

  it('handles zero', () => {
    expect(formatPrice(0)).toBe('₹0');
  });

  it('formats large numbers with Indian locale (lakh format)', () => {
    expect(formatPrice(125000)).toBe('₹1,25,000');
  });

  it('formats single-digit amounts', () => {
    expect(formatPrice(5)).toBe('₹5');
  });

  it('formats amounts with thousands separator', () => {
    expect(formatPrice(99999)).toBe('₹99,999');
  });
});
