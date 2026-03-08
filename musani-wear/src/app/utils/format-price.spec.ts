import { formatPrice } from './format-price';

describe('formatPrice', () => {
  it('formats INR with comma separators', () => {
    expect(formatPrice(2499)).toBe('₹2,499');
  });

  it('handles zero', () => {
    expect(formatPrice(0)).toBe('₹0');
  });
});
