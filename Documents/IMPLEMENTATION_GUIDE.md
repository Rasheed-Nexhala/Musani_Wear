# Musani Wear - Implementation Guide

Practical code examples and step-by-step implementation instructions for common tasks.

---

## Table of Contents

1. [Initial Setup](#1-initial-setup)
2. [Creating Your First Product](#2-creating-your-first-product)
3. [Product Gallery Component](#3-product-gallery-component)
4. [Admin Panel Examples](#4-admin-panel-examples)
5. [Common Queries & Operations](#5-common-queries--operations)
6. [Error Handling Examples](#6-error-handling-examples)
7. [Testing & Debugging](#7-testing--debugging)

---

## 1. Initial Setup

### Step 1.1: Firebase Project Configuration

**Create Firebase Project:**

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Google account
firebase login

# Create or select project
firebase projects:create musani-wear --display-name "Musani Wear"
```

**Connect Angular App:**

```bash
# In your Angular project root
npm install @angular/fire firebase

# Initialize Firebase in your project
firebase init
```

**Add Firebase to Angular:**

```typescript
// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

bootstrapApplication(AppComponent, {
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideAuth(() => getAuth())
  ]
}).catch(err => console.error(err));
```

**Environment Configuration:**

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyDxxx...',
    authDomain: 'musani-wear.firebaseapp.com',
    projectId: 'musani-wear',
    storageBucket: 'musani-wear.appspot.com',
    messagingSenderId: '123456789',
    appId: '1:123456789:web:xxx'
  }
};
```

### Step 1.2: Seed Initial Data

**Create Seeding Service:**

```typescript
import { Injectable } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { SettingsService } from '../services/settings.service';
import { Observable, combineLatest } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SeedService {

  constructor(
    private categoryService: CategoryService,
    private settingsService: SettingsService
  ) {}

  /**
   * Run first-time setup
   */
  initializeApp(): Observable<any> {
    return combineLatest([
      this.categoryService.seedDefaultCategories(),
      this.settingsService.initializeSettings({
        whatsappNumber: '+919876543210',
        businessName: 'Musani Wear',
        businessEmail: 'info@musaniwear.com'
      })
    ]);
  }
}
```

**Call on App Startup:**

```typescript
// src/app/app.component.ts
export class AppComponent implements OnInit {

  constructor(private seedService: SeedService) {}

  ngOnInit(): void {
    // Run once on first app load
    this.seedService.initializeApp().subscribe({
      next: () => console.log('App initialized'),
      error: (err) => console.error('Initialization failed:', err)
    });
  }
}
```

---

## 2. Creating Your First Product

### Step 2.1: Upload Product Images

**HTML File Input:**

```html
<!-- admin/product-form/product-form.component.html -->
<div class="image-upload">
  <label>Product Images</label>
  <input
    type="file"
    multiple
    accept="image/*"
    (change)="onImagesSelected($event)"
  />
  <div class="image-preview" *ngFor="let image of selectedImages">
    <img [src]="image.preview" alt="Product image" />
    <button (click)="removeImage(image)">Remove</button>
  </div>
</div>
```

**Component Logic:**

```typescript
// admin/product-form/product-form.component.ts
import { Component } from '@angular/core';
import { ImageService } from '../../services/image.service';
import { validateImageFile } from '../../utils/validate-image';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent {

  selectedImages: any[] = [];
  uploadedImageUrls: string[] = [];
  isUploading = false;

  constructor(private imageService: ImageService) {}

  /**
   * Handle image selection (use utils for validation - easy to test)
   */
  onImagesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);

    files.forEach(file => {
      const validation = validateImageFile(file as File); // from utils/validate-image
      if (!validation.valid) {
        alert(validation.error);
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImages.push({
          file: file as File,
          preview: e.target?.result
        });
      };
      reader.readAsDataURL(file as File);
    });
  }

  /**
   * Remove image from selection
   */
  removeImage(image: any): void {
    this.selectedImages = this.selectedImages.filter(img => img !== image);
  }

  /**
   * Upload all selected images
   */
  uploadImages(productId: string): Promise<string[]> {
    this.isUploading = true;

    const uploadPromises = this.selectedImages.map(img =>
      this.imageService.uploadProductImage(productId, img.file)
        .toPromise()
    );

    return Promise.all(uploadPromises)
      .then(urls => {
        this.uploadedImageUrls = urls.filter((url): url is string => !!url);
        this.isUploading = false;
        return this.uploadedImageUrls;
      })
      .catch(error => {
        console.error('Upload failed:', error);
        this.isUploading = false;
        throw error;
      });
  }
}
```

### Step 2.2: Create Product Form

**Form Component:**

```typescript
// admin/product-form/product-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Product, ProductFormData } from '../../models';
import { Router } from '@angular/router';
import { selectCategories } from '../../store/categories/category.selectors';
import { loadCategories, createProductRequested } from '../../store';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent implements OnInit {

  productForm!: FormGroup;
  categories$ = this.store.select(selectCategories);
  isSubmitting = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.store.dispatch(loadCategories());
  }

  /**
   * Initialize product form with validators
   */
  initializeForm(): void {
    this.productForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(200)
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(2000)
      ]],
      price: ['', [
        Validators.required,
        Validators.min(1),
        Validators.max(999999)
      ]],
      material: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100)
      ]],
      category: ['', Validators.required],
      colors: [[], Validators.required],
      inStock: [true],
      featured: [false]
    });
  }

  /**
   * Load categories for dropdown (NgRx)
   */
  loadCategories(): void {
    this.store.dispatch(loadCategories());
  }

  /**
   * Submit form and create product
   */
  onSubmit(): void {
    if (this.productForm.invalid) {
      this.error = 'Please fill all required fields correctly';
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    const formData: ProductFormData = {
      ...this.productForm.value,
      images: this.uploadedImageUrls || []
    };

    this.store.dispatch(createProductRequested({ formData }));
    // Listen for createProductSuccess in component (or use effect to navigate to /admin/products)
    // Listen for createProductFailure to set this.error and this.isSubmitting = false
  }
}
```

**Form HTML:**

```html
<!-- admin/product-form/product-form.component.html -->
<form [formGroup]="productForm" (ngSubmit)="onSubmit()">

  <!-- Product Name -->
  <div class="form-group">
    <label>Product Name *</label>
    <input
      type="text"
      formControlName="name"
      placeholder="e.g., Embroidered Anarkali Suit"
    />
    <span class="error" *ngIf="productForm.get('name')?.invalid && productForm.get('name')?.touched">
      Required (1-200 characters)
    </span>
  </div>

  <!-- Description -->
  <div class="form-group">
    <label>Description *</label>
    <textarea
      formControlName="description"
      placeholder="Detailed product description"
      rows="5"
    ></textarea>
    <span class="error" *ngIf="productForm.get('description')?.invalid && productForm.get('description')?.touched">
      Required (10-2000 characters)
    </span>
  </div>

  <!-- Price -->
  <div class="form-group">
    <label>Price (INR) *</label>
    <input
      type="number"
      formControlName="price"
      placeholder="2499"
      min="1"
    />
    <span class="error" *ngIf="productForm.get('price')?.invalid && productForm.get('price')?.touched">
      Required, greater than 0
    </span>
  </div>

  <!-- Material -->
  <div class="form-group">
    <label>Material *</label>
    <input
      type="text"
      formControlName="material"
      placeholder="e.g., Georgette, Cotton"
    />
  </div>

  <!-- Category -->
  <div class="form-group">
    <label>Category *</label>
    <select formControlName="category">
      <option value="">Select Category</option>
      <option *ngFor="let cat of categories" [value]="cat.slug">
        {{ cat.name }}
      </option>
    </select>
  </div>

  <!-- Colors -->
  <div class="form-group">
    <label>Colors (comma-separated) *</label>
    <input
      type="text"
      placeholder="#FF0000, Navy Blue, #2E8B57"
      (change)="onColorsChanged($event)"
    />
  </div>

  <!-- Stock Status -->
  <div class="form-group">
    <label>
      <input type="checkbox" formControlName="inStock" />
      In Stock
    </label>
  </div>

  <!-- Featured -->
  <div class="form-group">
    <label>
      <input type="checkbox" formControlName="featured" />
      Featured on Homepage
    </label>
  </div>

  <!-- Images Upload -->
  <div class="form-group">
    <label>Product Images *</label>
    <input
      type="file"
      multiple
      accept="image/*"
      (change)="onImagesSelected($event)"
    />
    <div class="image-preview" *ngFor="let image of selectedImages">
      <img [src]="image.preview" alt="Preview" width="100" />
      <button type="button" (click)="removeImage(image)">Remove</button>
    </div>
  </div>

  <!-- Error Message -->
  <div class="error-message" *ngIf="error">
    {{ error }}
  </div>

  <!-- Submit -->
  <button type="submit" [disabled]="isSubmitting">
    {{ isSubmitting ? 'Creating...' : 'Create Product' }}
  </button>

</form>
```

---

## 3. Product Gallery Component

### Step 3.1: Product Gallery Component

```typescript
// public/product-gallery/product-gallery.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Product, Category } from '../../models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { selectProducts, selectLoading, selectError } from '../../store/products/product.selectors';
import { selectCategories } from '../../store/categories/category.selectors';
import { loadProducts, loadCategories } from '../../store';

@Component({
  selector: 'app-product-gallery',
  templateUrl: './product-gallery.component.html',
  styleUrls: ['./product-gallery.component.css']
})
export class ProductGalleryComponent implements OnInit, OnDestroy {

  products$ = this.store.select(selectProducts);
  categories$ = this.store.select(selectCategories);
  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);

  selectedCategory: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get category from URL
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.selectedCategory = params['category'] || null;
        this.loadProducts();
      });
  }

  /**
   * Load products with optional category filter (NgRx)
   */
  loadProducts(): void {
    const filter = this.selectedCategory
      ? { category: this.selectedCategory }
      : undefined;

    this.store.dispatch(loadProducts({ filter }));
  }

  /**
   * Filter by category
   */
  filterByCategory(categorySlug: string): void {
    this.selectedCategory = categorySlug;
    this.loadProducts();
  }

  /**
   * Clear filter
   */
  clearFilter(): void {
    this.selectedCategory = null;
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

**Gallery HTML Template:**

```html
<!-- public/product-gallery/product-gallery.component.html -->
<div class="gallery-container">

  <!-- Category Filter -->
  <div class="category-filter">
    <h3>Categories</h3>
    <button
      [class.active]="!selectedCategory"
      (click)="clearFilter()"
    >
      All Products
    </button>
    <button
      *ngFor="let cat of categories$ | async"
      [class.active]="selectedCategory === cat.slug"
      (click)="filterByCategory(cat.slug)"
    >
      {{ cat.name }}
    </button>
  </div>

  <!-- Products Grid -->
  <div class="products-grid">

    <!-- Loading State -->
    <div class="loading-message" *ngIf="loading$ | async">
      <p>Loading products...</p>
    </div>

    <!-- Error State -->
    <div class="error-message" *ngIf="error$ | async as error">
      <p>{{ error }}</p>
    </div>

    <!-- Product Cards -->
    <div class="product-card" *ngFor="let product of products$ | async">
      <div class="product-image">
        <img
          [src]="product.images[0]"
          [alt]="product.name"
          loading="lazy"
        />
        <span class="product-featured" *ngIf="product.featured">Featured</span>
      </div>

      <div class="product-info">
        <h4>{{ product.name }}</h4>
        <p class="material">Material: {{ product.material }}</p>
        <p class="price">₹{{ product.price | number:'1.0-0' }}</p>

        <!-- Colors -->
        <div class="colors">
          <span class="color-label">Available Colors:</span>
          <div class="color-swatches">
            <span
              *ngFor="let color of product.colors"
              class="color-swatch"
              [style.backgroundColor]="color"
              [title]="color"
            ></span>
          </div>
        </div>

        <!-- Stock Status -->
        <p [class.out-of-stock]="!product.inStock">
          {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
        </p>

        <!-- Actions -->
        <div class="actions">
          <button (click)="viewDetails(product.id)">
            View Details
          </button>
          <button (click)="askAvailability(product)">
            Ask Availability
          </button>
        </div>
      </div>
    </div>

  </div>

  <!-- No Products Message -->
  <div class="no-products" *ngIf="(products$ | async)?.length === 0 && !(loading$ | async)">
    <p>No products found in this category.</p>
  </div>

</div>
```

---

## 4. Admin Panel Examples

### Step 4.1: Admin Login

```typescript
// admin/login/login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  templateUrl: './login.component.html'
})
export class AdminLoginComponent {

  loginForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Submit login form
   */
  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.error = null;

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (user) => {
        console.log('Logged in as:', user.email);
        this.router.navigate(['/admin/dashboard']);
      },
      error: (error) => {
        this.error = error.message;
        this.isLoading = false;
      }
    });
  }

  /**
   * Toggle password visibility
   */
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
```

**Login HTML:**

```html
<!-- admin/login/login.component.html -->
<div class="login-container">
  <div class="login-card">
    <h1>Admin Login</h1>
    <p>Musani Wear Admin Panel</p>

    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">

      <!-- Email -->
      <div class="form-group">
        <label for="email">Email Address</label>
        <input
          id="email"
          type="email"
          formControlName="email"
          placeholder="admin@musaniwear.com"
          autocomplete="email"
        />
        <span class="error" *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
          Please enter a valid email
        </span>
      </div>

      <!-- Password -->
      <div class="form-group">
        <label for="password">Password</label>
        <div class="password-input">
          <input
            id="password"
            [type]="showPassword ? 'text' : 'password'"
            formControlName="password"
            placeholder="Enter your password"
            autocomplete="current-password"
          />
          <button
            type="button"
            (click)="togglePassword()"
            class="toggle-password"
          >
            {{ showPassword ? 'Hide' : 'Show' }}
          </button>
        </div>
        <span class="error" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
          Password required (min 6 characters)
        </span>
      </div>

      <!-- Error Message -->
      <div class="error-message" *ngIf="error">
        <p>{{ error }}</p>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        class="btn-login"
        [disabled]="isLoading || loginForm.invalid"
      >
        {{ isLoading ? 'Logging in...' : 'Login' }}
      </button>

    </form>

    <!-- Info -->
    <div class="info-box">
      <p>Use your admin credentials to access the product management panel.</p>
    </div>
  </div>
</div>
```

### Step 4.2: Product Management List

```typescript
// admin/product-list/product-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Product } from '../../models';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { selectProducts, selectLoading, selectError } from '../../store/products/product.selectors';
import { loadProducts, deleteProductRequested } from '../../store';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit, OnDestroy {

  products$ = this.store.select(selectProducts);
  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.store.dispatch(loadProducts());
  }

  /**
   * Navigate to edit product
   */
  editProduct(productId: string): void {
    this.router.navigate(['/admin/products/edit', productId]);
  }

  /**
   * Delete product with confirmation (NgRx)
   */
  deleteProduct(productId: string, productName: string): void {
    if (confirm(`Delete "${productName}"? This cannot be undone.`)) {
      this.store.dispatch(deleteProductRequested({ productId }));
      // Listen for deleteProductSuccess/deleteProductFailure in component or effect
    }
  }

  /**
   * Create new product
   */
  createProduct(): void {
    this.router.navigate(['/admin/products/new']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

**Product List HTML:**

```html
<!-- admin/product-list/product-list.component.html -->
<div class="product-management">

  <div class="header">
    <h2>Product Management</h2>
    <button (click)="createProduct()" class="btn-primary">
      + Add New Product
    </button>
  </div>

  <!-- Loading State -->
  <div class="loading" *ngIf="loading$ | async">
    <p>Loading products...</p>
  </div>

  <!-- Error State -->
  <div class="error" *ngIf="error$ | async as error">
    <p>{{ error }}</p>
  </div>

  <!-- Products Table -->
  <table class="products-table" *ngIf="!(loading$ | async)">
    <thead>
      <tr>
        <th>Image</th>
        <th>Name</th>
        <th>Price</th>
        <th>Category</th>
        <th>Stock</th>
        <th>Featured</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let product of products$ | async">
        <td>
          <img [src]="product.images[0]" alt="{{ product.name }}" width="60" />
        </td>
        <td>{{ product.name }}</td>
        <td>₹{{ product.price | number:'1.0-0' }}</td>
        <td>{{ product.category }}</td>
        <td>
          <span [class.in-stock]="product.inStock" [class.out-of-stock]="!product.inStock">
            {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
          </span>
        </td>
        <td>
          <span *ngIf="product.featured" class="badge-featured">Featured</span>
        </td>
        <td class="actions">
          <button (click)="editProduct(product.id)" class="btn-edit">Edit</button>
          <button (click)="deleteProduct(product.id, product.name)" class="btn-delete">Delete</button>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- No Products -->
  <div class="no-products" *ngIf="(products$ | async)?.length === 0 && !(loading$ | async)">
    <p>No products created yet.</p>
    <button (click)="createProduct()">Create First Product</button>
  </div>

</div>
```

---

## 5. Common Queries & Operations

### Query 1: Get Products by Category (NgRx)

```typescript
// In any component
this.store.dispatch(loadProducts({
  filter: { category: 'stitched', sortBy: 'newest', limit: 12 }
}));

// Select results
this.store.select(selectProducts).subscribe(products => {
  console.log('Stitched products:', products);
});
```

### Query 2: Get Featured Products for Homepage

```typescript
// In homepage component
this.store.dispatch(loadFeaturedProducts({ limit: 8 }));
```

### Query 3: Get In-Stock Products Only

```typescript
this.store.dispatch(loadProducts({ filter: { inStock: true, limit: 20 } }));
```

### Query 4: Search Products (Client-Side)

```typescript
searchQuery = new BehaviorSubject<string>('');

results$ = this.searchQuery.pipe(
  debounceTime(300),
  switchMap(query =>
    this.store.select(selectProducts).pipe(
      map(products => productService.searchProducts(query, products))
    )
  )
);

// Usage
onSearchChange(query: string): void {
  this.searchQuery.next(query);
}
```

### Query 5: Paginate Products

```typescript
page = 0;
pageSize = 12;

loadMore(): void {
  this.store.dispatch(loadPaginatedProducts({
    filter: { limit: this.pageSize },
    lastDoc: this.lastDocSnapshot
  }));

  this.store.select(selectPaginatedProducts).subscribe(result => {
    this.lastDocSnapshot = result.lastDocumentSnapshot;
    console.log(`Loaded ${result.items.length} products`);
  });
}
```

---

## 6. Error Handling Examples

### Handle Product Creation Error (NgRx)

```typescript
this.store.dispatch(createProductRequested({ formData }));

// In component: listen for createProductSuccess / createProductFailure
this.store.select(selectCreateProductStatus).subscribe(status => {
  if (status === 'success') this.successMessage = 'Product created successfully!';
});
this.store.select(selectProductError).subscribe(error => {
  if (error) {
    if (error.code === 'VALIDATION_ERROR') {
      this.displayFieldErrors(error.details);
    } else {
      this.displayGenericError(error.message);
    }
  }
});
```

### Handle Authentication Error

```typescript
this.authService.login(email, password).subscribe({
  next: (user) => { /* success */ },
  error: (error) => {
    switch (error.code) {
      case 'auth/user-not-found':
        alert('User not found. Please check your email.');
        break;
      case 'auth/wrong-password':
        alert('Incorrect password. Please try again.');
        break;
      case 'auth/too-many-requests':
        alert('Too many login attempts. Please try again later.');
        break;
      default:
        alert('Login failed: ' + error.message);
    }
  }
});
```

### Handle Image Upload Error

```typescript
this.imageService.uploadProductImage(productId, file).subscribe({
  next: (downloadUrl) => {
    console.log('Image uploaded:', downloadUrl);
  },
  error: (error) => {
    if (error.message.includes('FILE_TOO_LARGE')) {
      alert('Image is too large (max 5MB)');
    } else if (error.message.includes('INVALID_FILE_TYPE')) {
      alert('Invalid file type. Please use JPEG, PNG, or WebP.');
    } else {
      alert('Upload failed: ' + error.message);
    }
  }
});
```

---

## 7. Testing & Debugging

### Testing Strategy (Jest + Angular Testing Library)

**Read TESTING.md** for the full testing guide. Summary:

1. **Jest** – Utils, service methods, NgRx reducers (simple, isolated logic)
2. **Angular Testing Library** – Component behavior (user interactions, rendering)
3. **Test IDs** – Use `data-testid` only as last resort
4. **Order:** Dependencies → First render test → Add tests one by one

```bash
npm test           # Run all tests
npm run test:watch # Watch mode
npm run test:coverage # Coverage report
```

### Local Development with Firebase Emulator

```bash
# Start emulator suite
firebase emulators:start

# In browser, go to: http://localhost:4200
# Firestore Emulator: http://localhost:4000
```

**Use Emulator in Angular:**

```typescript
// In development environment only
import { connectFirestoreEmulator } from '@angular/fire/firestore';

if (environment.development) {
  connectFirestoreEmulator(this.firestore, 'localhost', 8080);
}
```

### Debug Firestore Queries

```typescript
// Add logging to ProductService
this.productService.getProducts(filter).subscribe({
  next: (products) => {
    console.log('Query result:', {
      filter,
      resultCount: products.length,
      products
    });
  }
});
```

### Monitor Authentication State

```typescript
this.authService.currentUser$.subscribe(user => {
  console.log('Auth state changed:', {
    isAuthenticated: !!user,
    email: user?.email,
    uid: user?.uid
  });
});
```

### Test WhatsApp URL Generation

```typescript
// In component
this.whatsappService.generateProductInquiryUrl(
  this.product,
  'Red'
).subscribe(url => {
  console.log('WhatsApp URL:', url);
  // Open in new tab to test
  window.open(url, '_blank');
});
```

### Console Logging Strategy

```typescript
// Use consistent logging patterns
class Logger {
  static log(context: string, message: string, data?: any): void {
    console.log(`[${context}] ${message}`, data || '');
  }

  static error(context: string, message: string, error?: any): void {
    console.error(`[${context}] ${message}`, error || '');
  }
}

// Usage
Logger.log('ProductService', 'Fetching products', { category });
Logger.error('ImageService', 'Upload failed', uploadError);
```

---

## Deployment Checklist

Before deploying to production:

- [ ] All tests passing
- [ ] Firebase rules reviewed and tested
- [ ] Admin user created in Firebase Console
- [ ] WhatsApp number validated in E.164 format
- [ ] Firebase Storage quotas reviewed
- [ ] Image optimization verified
- [ ] Error handling tested
- [ ] Performance optimization complete
- [ ] Build production version: `ng build --configuration production`
- [ ] Deploy: `firebase deploy`

```bash
# Final deployment commands
ng build --configuration production
firebase deploy
```

---

End of Implementation Guide
