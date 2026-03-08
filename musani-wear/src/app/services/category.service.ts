import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from '@angular/fire/firestore';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Category } from '../models/Category';

const CATEGORIES_COLLECTION = 'categories';

/**
 * CategoryService: Firestore-backed CRUD for categories.
 * All methods return Observables; uses from() to convert Firestore Promises.
 * Categories are ordered by 'order' field (ascending) for getAllCategories.
 */
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly firestore = inject(Firestore);
  private readonly categoriesCollection = collection(
    this.firestore,
    CATEGORIES_COLLECTION
  );

  /** Get all categories, ordered by order field ascending. */
  getAllCategories(): Observable<Category[]> {
    const q = query(
      this.categoriesCollection,
      orderBy('order', 'asc')
    );

    return from(getDocs(q)).pipe(
      map((snapshot) =>
        snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        } as Category))
      ),
      catchError((error) => {
        console.warn(
          'Categories order index may be missing; falling back to unordered fetch. Error:',
          error
        );
        return from(getDocs(this.categoriesCollection)).pipe(
          map((snapshot) => {
            const categories = snapshot.docs.map((d) => ({
              id: d.id,
              ...d.data(),
            } as Category));
            return categories.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          }),
          catchError((fallbackError) => {
            console.error('Error fetching categories:', fallbackError);
            return throwError(() => new Error('Failed to fetch categories'));
          })
        );
      })
    );
  }

  /** Get a single category by ID. */
  getCategoryById(id: string): Observable<Category | null> {
    const docRef = doc(this.firestore, CATEGORIES_COLLECTION, id);
    return from(getDoc(docRef)).pipe(
      map((docSnap) => {
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() } as Category;
        }
        return null;
      }),
      catchError((error) => {
        console.error('Error fetching category:', error);
        return throwError(() => new Error('Failed to fetch category'));
      })
    );
  }

  /** Get a category by slug. Returns first match or null. */
  getCategoryBySlug(slug: string): Observable<Category | null> {
    const q = query(
      this.categoriesCollection,
      where('slug', '==', slug)
    );

    return from(getDocs(q)).pipe(
      map((snapshot) => {
        if (snapshot.empty) return null;
        const d = snapshot.docs[0];
        return { id: d.id, ...d.data() } as Category;
      }),
      catchError((error) => {
        console.error('Error fetching category by slug:', error);
        return throwError(() => new Error('Failed to fetch category by slug'));
      })
    );
  }

  /** Create a new category. Returns the new document ID. Timestamps are set by the service. */
  createCategory(
    category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>
  ): Observable<string> {
    const now = Timestamp.now();
    const payload = {
      ...category,
      createdAt: now,
      updatedAt: now,
    };

    return from(addDoc(this.categoriesCollection, payload)).pipe(
      map((docRef) => docRef.id),
      catchError((error) => {
        console.error('Error adding category:', error);
        return throwError(() => new Error('Failed to add category'));
      })
    );
  }

  /** Update an existing category. */
  updateCategory(id: string, category: Partial<Category>): Observable<void> {
    const docRef = doc(this.firestore, CATEGORIES_COLLECTION, id);
    const payload: Record<string, unknown> = {
      ...category,
      updatedAt: Timestamp.now(),
    };
    delete payload['id'];

    return from(updateDoc(docRef, payload)).pipe(
      catchError((error) => {
        console.error('Error updating category:', error);
        return throwError(() => new Error('Failed to update category'));
      })
    );
  }

  /** Delete a category. */
  deleteCategory(id: string): Observable<void> {
    const docRef = doc(this.firestore, CATEGORIES_COLLECTION, id);

    return from(deleteDoc(docRef)).pipe(
      catchError((error) => {
        console.error('Error deleting category:', error);
        return throwError(() => new Error('Failed to delete category'));
      })
    );
  }
}
