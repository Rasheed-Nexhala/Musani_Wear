import { slugify } from './slugify';

describe('slugify', () => {
  it('converts text to lowercase URL-friendly slug', () => {
    expect(slugify('Floral Summer Dress')).toBe('floral-summer-dress');
  });

  it('removes diacritics (accents)', () => {
    expect(slugify('Élégant & Chic')).toBe('elegant-chic');
  });

  it('removes special characters', () => {
    expect(slugify('Dress #1 @ Sale!')).toBe('dress-1-sale');
  });

  it('collapses multiple spaces and hyphens', () => {
    expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces');
    expect(slugify('double--hyphen')).toBe('double-hyphen');
  });

  it('trims leading and trailing hyphens', () => {
    expect(slugify('---Leading Hyphens')).toBe('leading-hyphens');
    expect(slugify('Trailing Hyphens---')).toBe('trailing-hyphens');
  });

  it('handles empty string', () => {
    expect(slugify('')).toBe('');
  });

  it('handles whitespace-only string', () => {
    expect(slugify('   ')).toBe('');
  });

  it('preserves numbers', () => {
    expect(slugify('Dress 2024 Collection')).toBe('dress-2024-collection');
  });
});
