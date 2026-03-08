import { Injectable, inject } from '@angular/core';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from '@angular/fire/storage';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import imageCompression from 'browser-image-compression';

import { validateImageFile } from '../utils/validate-image';

/** Storage path prefix for product images: products/{productId}/{filename} */
const PRODUCT_IMAGES_PATH = 'products';

/** Max width/height for compressed images (pixels). */
const MAX_IMAGE_DIMENSION = 1920;

/** Target quality for compression (0–1). */
const COMPRESSION_QUALITY = 0.85;

/**
 * ImageService: Handles product image upload and deletion via Firebase Storage.
 *
 * - Validates files with validateImageFile before upload
 * - Compresses images (max 1920px, quality 0.85) to reduce size
 * - Uploads to products/{productId}/{filename}
 * - deleteImage accepts a download URL and deletes the file
 *
 * @example
 * // Upload
 * this.imageService.uploadProductImage(file, 'prod-123').subscribe(url => ...);
 *
 * // Delete
 * this.imageService.deleteImage(downloadUrl).subscribe(() => ...);
 */
@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private readonly storage = inject(Storage);

  /**
   * Compress an image file before upload.
   * Limits max dimension to 1920px and applies reasonable quality.
   */
  private async compressImage(file: File): Promise<File> {
    const options = {
      maxWidthOrHeight: MAX_IMAGE_DIMENSION,
      useWebWorker: true,
      initialQuality: COMPRESSION_QUALITY,
      preserveExif: false,
    };
    return imageCompression(file, options);
  }

  /**
   * Generate a safe, unique filename for storage.
   * Uses timestamp + sanitized original name to avoid collisions.
   */
  private generateFilename(originalName: string): string {
    const sanitized = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const ext = sanitized.includes('.') ? sanitized.slice(sanitized.lastIndexOf('.')) : '';
    const base = sanitized.replace(/\.[^.]+$/, '') || 'image';
    return `${Date.now()}-${base}${ext}`;
  }

  /**
   * Upload a product image: validate → compress → upload → return download URL.
   *
   * @param file - Image file (JPEG, PNG, WebP, GIF)
   * @param productId - Product ID for storage path
   * @returns Observable of the download URL
   */
  uploadProductImage(file: File, productId: string): Observable<string> {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return throwError(() => new Error(validation.error));
    }

    const filename = this.generateFilename(file.name);
    const storagePath = `${PRODUCT_IMAGES_PATH}/${productId}/${filename}`;

    return from(this.compressImage(file)).pipe(
      switchMap((compressed) => {
        const storageRef = ref(this.storage, storagePath);
        return from(uploadBytes(storageRef, compressed));
      }),
      switchMap(() => {
        const storageRef = ref(this.storage, storagePath);
        return from(getDownloadURL(storageRef));
      }),
      catchError((error) => {
        console.error('Error uploading product image:', error);
        return throwError(
          () => new Error(error?.message ?? 'Failed to upload image')
        );
      })
    );
  }

  /**
   * Delete an image from Storage by its download URL.
   * Firebase ref() accepts a full URL to create a reference for deletion.
   *
   * @param url - Full download URL from getDownloadURL()
   * @returns Observable that completes when deletion succeeds
   */
  deleteImage(url: string): Observable<void> {
    if (!url || typeof url !== 'string') {
      return throwError(() => new Error('Invalid image URL'));
    }

    const storageRef = ref(this.storage, url);

    return from(deleteObject(storageRef)).pipe(
      catchError((error) => {
        console.error('Error deleting image:', error);
        return throwError(
          () => new Error(error?.message ?? 'Failed to delete image')
        );
      })
    );
  }
}
