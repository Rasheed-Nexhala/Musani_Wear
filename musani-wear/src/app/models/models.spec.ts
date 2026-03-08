/**
 * Smoke test: verify all models can be imported and satisfy their interfaces.
 */
import type { Color, Product, Category, AppSettings, User } from './index';

describe('Models', () => {
  it('Color interface allows valid objects', () => {
    const color: Color = { name: 'Gold', hex: '#D4AF37' };
    expect(color.name).toBe('Gold');
    expect(color.hex).toBe('#D4AF37');
  });

  it('Product interface allows valid objects', () => {
    const product: Product = {
      name: 'Test Dress',
      description: 'A test',
      price: 2499,
      material: 'Silk',
      category: 'Evening',
      categoryId: 'cat1',
      colors: [{ name: 'Gold', hex: '#D4AF37' }],
      images: [],
      featured: false,
      available: true,
      createdAt: null,
      updatedAt: null,
    };
    expect(product.name).toBe('Test Dress');
    expect(product.colors[0].name).toBe('Gold');
  });

  it('Category interface allows valid objects', () => {
    const category: Category = {
      name: 'Evening',
      slug: 'evening',
      description: 'Evening wear',
      order: 1,
      createdAt: null,
      updatedAt: null,
    };
    expect(category.slug).toBe('evening');
  });

  it('AppSettings interface allows valid objects', () => {
    const settings: AppSettings = {
      id: 'default',
      businessName: 'Musani Wear',
      whatsappNumber: '+919876543210',
      businessEmail: 'hello@musani.com',
      businessPhone: '+919876543210',
      updatedAt: null,
    };
    expect(settings.businessName).toBe('Musani Wear');
  });

  it('User interface allows valid objects', () => {
    const user: User = { uid: 'uid1', email: 'admin@musani.com' };
    expect(user.uid).toBe('uid1');
    const userWithName: User = { uid: 'uid2', email: 'a@b.com', displayName: 'Admin' };
    expect(userWithName.displayName).toBe('Admin');
  });
});
