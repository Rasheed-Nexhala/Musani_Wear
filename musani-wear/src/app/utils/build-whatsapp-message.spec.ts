import { buildProductInquiryMessageText } from './build-whatsapp-message';

describe('buildProductInquiryMessageText', () => {
  it('builds base message without color', () => {
    const product = { name: 'Floral Dress', id: 'p1' };
    expect(buildProductInquiryMessageText(product)).toBe(
      "Hi! I'm interested in: Floral Dress (ID: p1)"
    );
  });

  it('appends color when provided', () => {
    const product = { name: 'Floral Dress', id: 'p1' };
    expect(buildProductInquiryMessageText(product, 'Blue')).toBe(
      "Hi! I'm interested in: Floral Dress (ID: p1) - Color: Blue"
    );
  });

  it('ignores empty color', () => {
    const product = { name: 'Floral Dress', id: 'p1' };
    expect(buildProductInquiryMessageText(product, '')).toBe(
      "Hi! I'm interested in: Floral Dress (ID: p1)"
    );
  });

  it('ignores whitespace-only color', () => {
    const product = { name: 'Floral Dress', id: 'p1' };
    expect(buildProductInquiryMessageText(product, '   ')).toBe(
      "Hi! I'm interested in: Floral Dress (ID: p1)"
    );
  });

  it('trims color when it has leading/trailing spaces', () => {
    const product = { name: 'Floral Dress', id: 'p1' };
    expect(buildProductInquiryMessageText(product, '  Red  ')).toBe(
      "Hi! I'm interested in: Floral Dress (ID: p1) - Color: Red"
    );
  });

  it('handles product with different name and id', () => {
    const product = { name: 'Summer Collection', id: 'prod-42' };
    expect(buildProductInquiryMessageText(product, 'Navy')).toBe(
      "Hi! I'm interested in: Summer Collection (ID: prod-42) - Color: Navy"
    );
  });
});
