import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from '@angular/fire/firestore';

/**
 * Seeds default data in Firestore when the app loads.
 * Idempotent: skips seeding if data already exists.
 */
@Injectable({
  providedIn: 'root',
})
export class SeedService {
  private readonly firestore = inject(Firestore);

  /**
   * Seeds default categories if none exist.
   * Uses presence of "Stitched" as a sentinel to avoid re-seeding.
   */
  async seedCategories(): Promise<void> {
    const categoriesRef = collection(this.firestore, 'categories');
    const q = query(categoriesRef, where('name', '==', 'Stitched'));
    const existing = await getDocs(q);

    if (existing.empty) {
      const categories = [
        {
          name: 'New Arrivals',
          slug: 'new-arrivals',
          description: 'Latest collections',
          order: 1,
        },
        {
          name: 'Stitched',
          slug: 'stitched',
          description: 'Ready-to-wear',
          order: 2,
        },
        {
          name: 'Unstitched',
          slug: 'unstitched',
          description: 'Custom stitching available',
          order: 3,
        },
        {
          name: 'Luxe',
          slug: 'luxe',
          description: 'Premium collections',
          order: 4,
        },
      ];

      for (const cat of categories) {
        await addDoc(categoriesRef, cat);
      }
      console.log('Categories seeded successfully');
    }
  }

  /**
   * Seeds example clothing products with online images.
   * Uses presence of "Silk Elegance Saree" as a sentinel to avoid re-seeding.
   */
  async seedProducts(): Promise<void> {
    const productsRef = collection(this.firestore, 'products');
    const q = query(productsRef, where('name', '==', 'Silk Elegance Saree'));
    const existing = await getDocs(q);

    if (!existing.empty) {
      return;
    }

    const categoriesRef = collection(this.firestore, 'categories');
    const catSnap = await getDocs(categoriesRef);
    type CatDoc = { id: string; slug?: string; order?: number };
    const categories: CatDoc[] = catSnap.docs
      .map((d) => ({ id: d.id, ...d.data() } as CatDoc))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    if (categories.length === 0) {
      console.warn('No categories found; run seedCategories first');
      return;
    }

    const getCatId = (slug: string) =>
      categories.find((c) => c.slug === slug)?.id ?? categories[0].id;

    const now = Timestamp.now();

    const products = [
      {
        name: 'Silk Elegance Saree',
        description: 'Handwoven pure silk saree with intricate gold zari border. Perfect for weddings and festive occasions.',
        price: 12999,
        material: 'Pure Silk',
        category: 'Saree',
        categoryId: getCatId('stitched'),
        colors: [
          { name: 'Maroon', hex: '#800020' },
          { name: 'Gold', hex: '#D4AF37' },
          { name: 'Navy Blue', hex: '#000080' },
        ],
        images: [
          'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
          'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800',
        ],
        featured: true,
        available: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Floral Anarkali Suit',
        description: 'Elegant anarkali suit with delicate floral embroidery. Comfortable cotton blend for all-day wear.',
        price: 4999,
        material: 'Cotton Blend',
        category: 'Stitched',
        categoryId: getCatId('stitched'),
        colors: [
          { name: 'Pink', hex: '#FFB6C1' },
          { name: 'Mint Green', hex: '#98FF98' },
          { name: 'White', hex: '#FFFFFF' },
        ],
        images: [
          'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800',
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
        ],
        featured: true,
        available: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Designer Lehenga Choli',
        description: 'Stunning designer lehenga with hand-embroidered choli. A statement piece for special celebrations.',
        price: 24999,
        material: 'Silk & Velvet',
        category: 'Luxe',
        categoryId: getCatId('luxe'),
        colors: [
          { name: 'Red', hex: '#DC143C' },
          { name: 'Royal Blue', hex: '#4169E1' },
          { name: 'Emerald', hex: '#50C878' },
        ],
        images: [
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
          'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
        ],
        featured: true,
        available: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Cotton Unstitched Suit Set',
        description: 'Premium unstitched cotton suit set. Ideal for custom tailoring to your perfect fit.',
        price: 3499,
        material: 'Pure Cotton',
        category: 'Unstitched',
        categoryId: getCatId('unstitched'),
        colors: [
          { name: 'Sky Blue', hex: '#87CEEB' },
          { name: 'Lavender', hex: '#E6E6FA' },
          { name: 'Peach', hex: '#FFDAB9' },
        ],
        images: [
          'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800',
          'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800',
        ],
        featured: false,
        available: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'New Arrival Embroidered Kurta',
        description: 'Latest collection kurta with contemporary embroidery. Lightweight and perfect for casual outings.',
        price: 2799,
        material: 'Chiffon',
        category: 'New Arrivals',
        categoryId: getCatId('new-arrivals'),
        colors: [
          { name: 'Coral', hex: '#FF7F50' },
          { name: 'Teal', hex: '#008080' },
          { name: 'Mustard', hex: '#FFDB58' },
        ],
        images: [
          'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800',
          'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800',
        ],
        featured: true,
        available: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Bridal Silk Saree',
        description: 'Exquisite bridal saree with heavy zardosi work. A timeless heirloom for your special day.',
        price: 45999,
        material: 'Banarasi Silk',
        category: 'Luxe',
        categoryId: getCatId('luxe'),
        colors: [
          { name: 'Cream', hex: '#FFFDD0' },
          { name: 'Rose Gold', hex: '#B76E79' },
          { name: 'Ivory', hex: '#FFFFF0' },
        ],
        images: [
          'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
          'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800',
        ],
        featured: true,
        available: true,
        createdAt: now,
        updatedAt: now,
      },
    ];

    for (const product of products) {
      await addDoc(productsRef, product);
    }
    console.log('Example products seeded successfully');
  }
}
