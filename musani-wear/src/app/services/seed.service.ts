import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
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
}
