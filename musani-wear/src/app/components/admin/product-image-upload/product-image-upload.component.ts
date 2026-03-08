import { Component, input, output } from '@angular/core';
import { validateImageFile } from '../../../utils/validate-image';

/**
 * Product image upload component for admin product form.
 * Displays existing image thumbnails with remove option, and file input for adding new images.
 * Validates files with validateImageFile before emitting; shows error if invalid.
 */
@Component({
  selector: 'app-product-image-upload',
  standalone: true,
  templateUrl: './product-image-upload.component.html',
})
export class ProductImageUploadComponent {
  /** URLs of existing product images to display as thumbnails. */
  existingImages = input<string[]>([]);

  /** Emitted when user selects valid image files. */
  imagesAdded = output<File[]>();

  /** Emitted when user removes an existing image by URL. */
  imageRemoved = output<string>();

  /** Validation error message to display (e.g. invalid type or size). */
  validationError = '';

  /** Handle file selection: validate each file, emit valid ones, show error for invalid. */
  onFileSelected(event: Event): void {
    this.validationError = '';
    const inputEl = event.target as HTMLInputElement;
    const files = inputEl.files;
    if (!files?.length) return;

    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const result = validateImageFile(file);
      if (result.valid) {
        validFiles.push(file);
      } else {
        this.validationError = result.error ?? 'Invalid image file';
        inputEl.value = '';
        return;
      }
    }

    if (validFiles.length > 0) {
      this.imagesAdded.emit(validFiles);
    }
    inputEl.value = '';
  }

  /** Emit removal of an existing image. */
  removeImage(url: string): void {
    this.imageRemoved.emit(url);
  }
}
