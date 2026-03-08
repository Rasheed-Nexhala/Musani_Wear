import { Component, inject, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { ImageService } from '../../../services/image.service';
import { Product } from '../../../models/Product';
import { Color } from '../../../models/Product';
import { ProductImageUploadComponent } from '../../../components/admin/product-image-upload/product-image-upload.component';
import { DeleteConfirmationModalComponent } from '../../../components/admin/delete-confirmation-modal/delete-confirmation-modal.component';
import { ContentLoaderComponent } from '../../../components/shared/content-loader/content-loader.component';

/**
 * Admin Product Form: create or edit a product.
 * - NEW: createProduct(images:[]) → get id → upload new images → updateProduct → navigate
 * - EDIT: load product, patch form; on submit: upload new images → updateProduct → navigate
 */
@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    RouterLink,
    ProductImageUploadComponent,
    DeleteConfirmationModalComponent,
    ContentLoaderComponent,
  ],
  templateUrl: './admin-product-form.component.html',
})
export class AdminProductFormComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly imageService = inject(ImageService);

  /** Route param id (undefined for new product). */
  productId = signal<string | undefined>(undefined);

  /** Whether we're in edit mode. */
  isEdit = computed(() => !!this.productId());

  /** True while loading product for edit. */
  loadingProduct = signal(false);

  /** Existing image URLs (from loaded product, minus any removed by user). */
  existingImages = signal<string[]>([]);

  /** New image files selected by user (not yet uploaded). */
  newImages = signal<File[]>([]);

  /** Whether form submission is in progress. */
  submitting = signal(false);

  /** Error message to display. */
  errorMessage = signal('');

  /** Whether delete confirmation modal is open. */
  deleteModalOpen = signal(false);

  categories$ = this.categoryService.getAllCategories();

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(1)]],
    description: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0)]],
    material: ['', [Validators.required]],
    categoryId: ['', [Validators.required]],
    colors: this.fb.array([]),
    available: [true],
    featured: [false],
  });

  get colorsArray(): FormArray {
    return this.form.get('colors') as FormArray;
  }

  /** Helper for template: whether a control is invalid and touched. */
  hasError(controlName: string): boolean {
    const c = this.form.get(controlName);
    return !!(c?.invalid && c?.touched);
  }

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productId.set(id);
      this.loadProduct(id);
    } else {
      this.addColor();
    }
  }

  private loadProduct(id: string): void {
    this.loadingProduct.set(true);
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        if (product) {
          this.patchForm(product);
          this.existingImages.set(product.images ?? []);
        }
        this.loadingProduct.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load product.');
        this.loadingProduct.set(false);
      },
    });
  }

  private patchForm(product: Product): void {
    this.form.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      material: product.material,
      categoryId: product.categoryId ?? '',
      available: product.available ?? true,
      featured: product.featured ?? false,
    });
    this.colorsArray.clear();
    const colors = product.colors ?? [];
    if (colors.length === 0) {
      this.addColor();
    } else {
      colors.forEach((c) =>
        this.colorsArray.push(
          this.fb.group({ name: [c.name, Validators.required], hex: [c.hex, Validators.required] })
        )
      );
    }
  }

  addColor(): void {
    this.colorsArray.push(
      this.fb.group({
        name: ['', Validators.required],
        hex: ['#000000', Validators.required],
      })
    );
  }

  removeColor(index: number): void {
    this.colorsArray.removeAt(index);
  }

  onImagesAdded(files: File[]): void {
    this.newImages.update((prev) => [...prev, ...files]);
  }

  onImageRemoved(url: string): void {
    this.existingImages.update((prev) => prev.filter((u) => u !== url));
  }

  /** Remove a new (not yet uploaded) image from the list. */
  removeNewImage(index: number): void {
    this.newImages.update((prev) => prev.filter((_, i) => i !== index));
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage.set('');
    this.submitting.set(true);

    const payload = this.buildProductPayload();
    const id = this.productId();

    if (id) {
      this.submitEdit(id, payload);
    } else {
      this.submitNew(payload);
    }
  }

  private buildProductPayload(): Omit<Product, 'id'> {
    const v = this.form.value;
    const colors: Color[] = (this.colorsArray.value ?? []).map((c: { name: string; hex: string }) => ({
      name: c.name,
      hex: c.hex,
    }));

    return {
      name: v.name ?? '',
      description: v.description ?? '',
      price: Number(v.price) ?? 0,
      material: v.material ?? '',
      categoryId: v.categoryId ?? '',
      category: '',
      colors,
      images: [],
      available: v.available ?? true,
      featured: v.featured ?? false,
      createdAt: null,
      updatedAt: null,
    };
  }

  private submitNew(payload: Omit<Product, 'id'>): void {
    this.productService
      .createProduct({ ...payload, images: [] })
      .pipe(
        switchMap((newId) => {
          const newFiles = this.newImages();
          if (newFiles.length === 0) {
            return of(void 0);
          }
          return forkJoin(
            newFiles.map((file) => this.imageService.uploadProductImage(file, newId))
          ).pipe(
            switchMap((urls) =>
              this.productService.updateProduct(newId, { images: urls })
            )
          );
        }),
        catchError((err) => {
          this.errorMessage.set(err?.message ?? 'Failed to save product.');
          this.submitting.set(false);
          throw err;
        })
      )
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.router.navigate(['/admin/products']);
        },
        error: () => {},
      });
  }

  private submitEdit(id: string, payload: Omit<Product, 'id'>): void {
    const newFiles = this.newImages();
    const existing = this.existingImages();

    if (newFiles.length === 0) {
      this.productService
        .updateProduct(id, {
          ...payload,
          images: existing,
        })
        .subscribe({
          next: () => {
            this.submitting.set(false);
            this.router.navigate(['/admin/products']);
          },
          error: (err) => {
            this.errorMessage.set(err?.message ?? 'Failed to update product.');
            this.submitting.set(false);
          },
        });
      return;
    }

    forkJoin(newFiles.map((file) => this.imageService.uploadProductImage(file, id)))
      .pipe(
        switchMap((newUrls) =>
          this.productService.updateProduct(id, {
            ...payload,
            images: [...existing, ...newUrls],
          })
        ),
        catchError((err) => {
          this.errorMessage.set(err?.message ?? 'Failed to update product.');
          this.submitting.set(false);
          throw err;
        })
      )
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.router.navigate(['/admin/products']);
        },
        error: () => {},
      });
  }

  openDeleteModal(): void {
    this.deleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.deleteModalOpen.set(false);
  }

  onDeleteConfirmed(): void {
    const id = this.productId();
    if (!id) return;

    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.router.navigate(['/admin/products']);
      },
      error: () => {
        this.errorMessage.set('Failed to delete product.');
        this.closeDeleteModal();
      },
    });
  }

  onDeleteCancelled(): void {
    this.closeDeleteModal();
  }
}
