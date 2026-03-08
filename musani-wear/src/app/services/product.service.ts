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

import { Product } from '../models/Product';

const PRODUCTS_COLLECTION = 'products';

/**
 * ProductService: Firestore-backed CRUD for products.
 * All methods return Observables; uses from() to convert Firestore Promises.
 *
 * Firestore composite index required for getFeaturedProducts:
 * Collection: products | Fields: featured (Ascending), available (Ascending), createdAt (Descending)
 * Create at: Firebase Console > Firestore > Indexes > Composite
 */
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly firestore = inject(Firestore);
  private readonly productsCollection = collection(this.firestore, PRODUCTS_COLLECTION);

  /** Get all products. */
  getAllProducts(): Observable<Product[]> {
    return from(getDocs(this.productsCollection)).pipe(
      map((snapshot) =>
        snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        } as Product))
      ),
      catchError((error) => {
        console.error('Error fetching products:', error);
        return throwError(() => new Error('Failed to fetch products'));
      })
    );
  }

  /**
   * Get featured, available products ordered by createdAt desc.
   * Requires Firestore composite index: products (featured, available, createdAt).
   */
  getFeaturedProducts(): Observable<Product[]> {
    const q = query(
      this.productsCollection,
      where('featured', '==', true),
      where('available', '==', true),
      orderBy('createdAt', 'desc')
    );

    return from(getDocs(q)).pipe(
      map((snapshot) =>
        snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        } as Product))
      ),
      catchError((error) => {
        console.error('Error fetching featured products:', error);
        return throwError(() => new Error('Failed to fetch featured products'));
      })
    );
  }

  /** Get a single product by ID. */
  getProductById(id: string): Observable<Product | null> {
    const docRef = doc(this.firestore, PRODUCTS_COLLECTION, id);
    return from(getDoc(docRef)).pipe(
      map((docSnap) => {
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() } as Product;
        }
        return null;
      }),
      catchError((error) => {
        console.error('Error fetching product:', error);
        return throwError(() => new Error('Failed to fetch product'));
      })
    );
  }

  /** Get products by category, ordered by createdAt desc. */
  getProductsByCategory(categoryId: string): Observable<Product[]> {
    const q = query(
      this.productsCollection,
      where('categoryId', '==', categoryId),
      orderBy('createdAt', 'desc')
    );

    return from(getDocs(q)).pipe(
      map((snapshot) =>
        snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        } as Product))
      ),
      catchError((error) => {
        console.error('Error fetching products by category:', error);
        return throwError(() => new Error('Failed to fetch products by category'));
      })
    );
  }

  /** Create a new product. Returns the new document ID. */
  createProduct(product: Omit<Product, 'id'>): Observable<string> {
    const now = Timestamp.now();
    const payload = {
      ...product,
      createdAt: now,
      updatedAt: now,
    };

    return from(addDoc(this.productsCollection, payload)).pipe(
      map((docRef) => docRef.id),
      catchError((error) => {
        console.error('Error adding product:', error);
        return throwError(() => new Error('Failed to add product'));
      })
    );
  }

  /** Update an existing product. */
  updateProduct(id: string, product: Partial<Product>): Observable<void> {
    const docRef = doc(this.firestore, PRODUCTS_COLLECTION, id);
    const payload: Record<string, unknown> = { ...product, updatedAt: Timestamp.now() };
    delete payload['id'];

    return from(updateDoc(docRef, payload)).pipe(
      catchError((error) => {
        console.error('Error updating product:', error);
        return throwError(() => new Error('Failed to update product'));
      })
    );
  }

  /** Delete a product. */
  deleteProduct(id: string): Observable<void> {
    const docRef = doc(this.firestore, PRODUCTS_COLLECTION, id);

    return from(deleteDoc(docRef)).pipe(
      catchError((error) => {
        console.error('Error deleting product:', error);
        return throwError(() => new Error('Failed to delete product'));
      })
    );
  }
}
