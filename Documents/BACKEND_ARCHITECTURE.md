# Musani Wear - Backend Architecture

**Project:** Dress Boutique Showcase Website
**Backend:** Firebase (Firestore + Storage + Authentication + Hosting)
**Frontend:** Angular 20+
**Last Updated:** March 2026

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Firestore Database Schema](#2-firestore-database-schema)
3. [TypeScript Data Models & Interfaces](#3-typescript-data-models--interfaces)
4. [Firebase Security Rules](#4-firebase-security-rules)
5. [Firebase Storage Structure](#5-firebase-storage-structure)
6. [Angular Service Architecture](#6-angular-service-architecture)
7. [NgRx State Management](#7-ngrx-state-management)
8. [Admin Operations](#8-admin-operations)
9. [Authentication & Authorization](#9-authentication--authorization)
10. [WhatsApp Integration](#10-whatsapp-integration)
11. [Firestore Queries & Indexes](#11-firestore-queries--indexes)
12. [Error Handling](#12-error-handling)
13. [Performance & Optimization](#13-performance--optimization)
14. [Deployment & Configuration](#14-deployment--configuration)

---

## 1. Architecture Overview

### 1.1 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      Angular 20+ Frontend                        │
│                   (Component + Services)                         │
└────────────────┬────────────────────────────┬────────────────────┘
                 │                            │
         ┌───────▼────────┐         ┌────────▼──────────┐
         │  Firebase Auth │         │   AngularFire     │
         │  (Admin Login) │         │  (Firestore SDK)  │
         └───────┬────────┘         └────────┬──────────┘
                 │                           │
         ┌───────▼─────────────────────────▼────────────┐
         │         Firebase Console / SDK               │
         │  (Authentication + Realtime Connection)      │
         └───────┬──────────────────┬──────────────────┬┘
                 │                  │                  │
         ┌───────▼──────┐  ┌────────▼────────┐  ┌─────▼──────────┐
         │  Firestore   │  │ Firebase Storage│  │ Firebase Auth  │
         │  (Realtime   │  │ (CDN-served     │  │ (Admin User)   │
         │   Database)  │  │  Images)        │  │                │
         └──────────────┘  └─────────────────┘  └────────────────┘
```

### 1.2 Key Design Principles

1. **Serverless Architecture:** No custom backend server needed
2. **Firestore as Primary Database:** Real-time data synchronization
3. **Firebase Storage for Media:** CDN-served images with optimized URLs
4. **Client-Side Authentication:** Firebase Auth for admin panel only
5. **NgRx Store:** Centralized state management with Actions, Reducers, Effects, Selectors
6. **Security by Rules:** Firestore security rules enforce access control
7. **Real-Time Updates:** Components auto-update when Firestore data changes

### 1.3 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Angular 20+, TypeScript 5+ | UI rendering, state management |
| State Management | NgRx Store (Actions, Reducers, Effects, Selectors) | Predictable data flow |
| Database | Firestore | Real-time document storage |
| Storage | Firebase Storage | Product image hosting (CDN) |
| Authentication | Firebase Authentication | Admin login/logout |
| Hosting | Firebase Hosting | Static site deployment |
| Package Manager | npm | Dependency management |

---

## 2. Firestore Database Schema

### 2.1 Entity Relationship Diagram

```
┌──────────────────┐
│   /products      │
│  (Collection)    │
│                  │
│ - id (PK)        │
│ - name           │
│ - description    │─────┐
│ - price          │     │
│ - material       │     │ References
│ - category (FK)  │     │ (De-normalized)
│ - colors[]       │     │
│ - images[]       │     │
│ - inStock        │     │
│ - featured       │     │
│ - createdAt      │     │
│ - updatedAt      │     │
└──────────────────┘     │
                         │
                    ┌────▼─────────────┐
                    │  /categories     │
                    │ (Collection)     │
                    │                  │
                    │ - id (PK)        │
                    │ - name           │
                    │ - slug           │
                    │ - order          │
                    │ - createdAt      │
                    └──────────────────┘

Relationships:
- Product.category → Categories.slug (many-to-one)
- Products indexed by category for fast queries
- No join operations needed (Firestore limitation)
- Category data de-normalized in product documents if needed
```

### 2.2 Collections & Document Structure

#### 2.2.1 Collection: `/products`

**Purpose:** Store all dress products with metadata

**Document ID:** Auto-generated Firestore ID (e.g., `aB3dEf9gHiJk2lmN`)

```javascript
// Example product document
{
  id: "aB3dEf9gHiJk2lmN",
  name: "Embroidered Anarkali Suit",
  description: "Premium georgette Anarkali suit with intricate gold embroidery...",
  price: 2499,
  material: "Georgette",
  category: "stitched",                    // References /categories/:id
  colors: ["#FF0000", "Navy Blue", "#2E8B57"],
  images: [
    "https://firebasestorage.googleapis.com/v0/.../products/aB3dEf9gHiJk2lmN/1706000001-abc123.webp",
    "https://firebasestorage.googleapis.com/v0/.../products/aB3dEf9gHiJk2lmN/1706000002-def456.webp"
  ],
  inStock: true,
  featured: true,
  createdAt: Timestamp.now(),              // Server timestamp
  updatedAt: Timestamp.now()
}
```

**Field Specifications:**

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `id` | string | Yes | Auto-generated | Unique Firestore document ID |
| `name` | string | Yes | 1-200 chars | Product display name |
| `description` | string | Yes | 1-2000 chars | Full product description |
| `price` | number | Yes | > 0 | Price in INR |
| `material` | string | Yes | 1-100 chars | Fabric material (e.g., Georgette) |
| `category` | string | Yes | Valid slug | FK to `/categories/:id` |
| `colors` | string[] | Yes | 1-10 items | Hex codes or color names |
| `images` | string[] | Yes | 1-15 URLs | Firebase Storage public URLs |
| `inStock` | boolean | Yes | N/A | Inventory status |
| `featured` | boolean | No | Default: false | Show on homepage |
| `createdAt` | Timestamp | Yes | Server-set | UTC creation timestamp |
| `updatedAt` | Timestamp | Yes | Server-set | UTC last modified timestamp |

**Indexes Required:**
```
Collection: products
  Index 1: category (Ascending), createdAt (Descending)
  Index 2: featured (Ascending), createdAt (Descending)
  Index 3: category (Ascending), inStock (Ascending), createdAt (Descending)
  Index 4: inStock (Ascending), createdAt (Descending)
```

---

#### 2.2.2 Collection: `/categories`

**Purpose:** Store product categories and display order

**Document ID:** Slug string (e.g., `new-arrivals`, `stitched`)

```javascript
// Example category document
{
  id: "new-arrivals",
  name: "New Arrivals",
  slug: "new-arrivals",
  order: 1,
  createdAt: Timestamp.now()
}
```

**Field Specifications:**

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `id` | string | Yes | Slug format | Unique category identifier |
| `name` | string | Yes | 1-100 chars | Display name |
| `slug` | string | Yes | Unique, slug format | URL-friendly slug |
| `order` | number | Yes | Positive integer | Display order (1, 2, 3...) |
| `createdAt` | Timestamp | Yes | Server-set | UTC creation timestamp |

**Default Categories (Seed on First Setup):**

```javascript
[
  {
    id: "new-arrivals",
    name: "New Arrivals",
    slug: "new-arrivals",
    order: 1,
    createdAt: Timestamp.now()
  },
  {
    id: "stitched",
    name: "Stitched",
    slug: "stitched",
    order: 2,
    createdAt: Timestamp.now()
  },
  {
    id: "unstitched",
    name: "Unstitched",
    slug: "unstitched",
    order: 3,
    createdAt: Timestamp.now()
  },
  {
    id: "luxe",
    name: "Luxe",
    slug: "luxe",
    order: 4,
    createdAt: Timestamp.now()
  }
]
```

---

#### 2.2.3 Collection: `/settings`

**Purpose:** Store global business configuration

**Document ID:** `config` (single document)

```javascript
// Settings document
{
  id: "config",
  whatsappNumber: "+919876543210",
  businessName: "Musani Wear",
  businessEmail: "info@musaniwear.com",
  updatedAt: Timestamp.now()
}
```

**Field Specifications:**

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `id` | string | Yes | "config" | Fixed document ID |
| `whatsappNumber` | string | Yes | E.164 format | WhatsApp number with country code |
| `businessName` | string | Yes | 1-100 chars | Business display name |
| `businessEmail` | string | Yes | Valid email | Support/contact email |
| `updatedAt` | Timestamp | Yes | Server-set | UTC last modified timestamp |

**Validation Rules:**

```
whatsappNumber:
  - Must match E.164 format: +[1-3 digits][4-14 digits]
  - Example: +919876543210 (India)
  - No spaces or special characters except '+'

businessName:
  - Alphanumeric + spaces, hyphens, apostrophes
  - 3-100 characters

businessEmail:
  - Valid email format
  - Pattern: ^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$
```

---

## 3. TypeScript Data Models & Interfaces

### 3.1 Product Model

```typescript
/**
 * Product interface matching Firestore /products collection schema
 * Represents a dress product with all metadata
 */
export interface Product {
  // Identifiers & Metadata
  id: string;                          // Firestore document ID
  name: string;                        // Product name (1-200 chars)
  description: string;                 // Detailed product description (1-2000 chars)

  // Pricing & Inventory
  price: number;                       // Price in INR (positive number)
  inStock: boolean;                    // Inventory status

  // Categorization & Attributes
  material: string;                    // Fabric material (e.g., "Georgette", "Cotton")
  category: string;                    // Category slug (e.g., "new-arrivals", "stitched")
  colors: string[];                    // Available colors (hex codes or names)

  // Media
  images: string[];                    // Array of Firebase Storage download URLs

  // Display Control
  featured: boolean;                   // Whether to show on homepage featured section

  // Timestamps (Firestore)
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
}

/**
 * Product creation form model
 * Used when admin creates or edits a product
 */
export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  material: string;
  category: string;
  colors: string[];
  images: string[];
  inStock: boolean;
  featured: boolean;
}

/**
 * Product query filter model
 * Used to filter products on frontend
 */
export interface ProductFilter {
  category?: string;                   // Filter by category slug
  inStock?: boolean;                   // Filter by inventory status
  featured?: boolean;                  // Filter by featured status
  sortBy?: 'newest' | 'oldest' | 'name' | 'price';
  sortOrder?: 'asc' | 'desc';
  limit?: number;                      // Pagination limit
}

/**
 * Paginated products response
 * Used for pagination and infinite scroll
 */
export interface PaginatedProducts {
  items: Product[];
  hasMore: boolean;                    // Whether more results available
  lastDocumentSnapshot?: any;          // Firestore query cursor for pagination
  totalCount: number;                  // Total products matching filter
}
```

**Validation Rules:**

```typescript
// Product name validation
export const ProductNameValidator = {
  minLength: 1,
  maxLength: 200,
  pattern: /^[a-zA-Z0-9\s\-&()]+$/,    // Alphanumeric + spaces, hyphens, ampersand, parentheses
  message: 'Product name must be 1-200 characters (alphanumeric, spaces, hyphens allowed)'
};

// Product description validation
export const ProductDescriptionValidator = {
  minLength: 10,
  maxLength: 2000,
  pattern: /^[a-zA-Z0-9\s\.,\-&()\n]+$/,
  message: 'Description must be 10-2000 characters'
};

// Product price validation
export const ProductPriceValidator = {
  minValue: 1,
  maxValue: 999999,
  pattern: /^\d+(\.\d{1,2})?$/,        // Decimal with up to 2 places
  message: 'Price must be between 1 and 999999 INR'
};

// Material validation
export const ProductMaterialValidator = {
  minLength: 1,
  maxLength: 100,
  pattern: /^[a-zA-Z\s\-&()]+$/,
  message: 'Material must be 1-100 characters'
};

// Color array validation
export const ProductColorsValidator = {
  minItems: 1,
  maxItems: 10,
  colorPattern: /^(#[0-9a-fA-F]{6}|[a-zA-Z\s]+)$/,  // Hex or color name
  message: 'Must have 1-10 colors (hex codes or color names)'
};

// Images array validation
export const ProductImagesValidator = {
  minItems: 1,
  maxItems: 15,
  urlPattern: /^https:\/\/firebasestorage\.googleapis\.com\/.+$/,
  maxFileSize: 5 * 1024 * 1024,        // 5MB
  allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  message: 'Must have 1-15 images (JPEG, PNG, or WebP, max 5MB each)'
};
```

---

### 3.2 Category Model

```typescript
/**
 * Category interface matching Firestore /categories collection schema
 * Represents a product category for organization
 */
export interface Category {
  id: string;                          // Unique category identifier (slug)
  name: string;                        // Display name
  slug: string;                        // URL-friendly slug
  order: number;                       // Display order for sorting
  createdAt: firebase.firestore.Timestamp;
}

/**
 * Category creation form model
 */
export interface CategoryFormData {
  name: string;
  slug: string;
  order: number;
}
```

**Validation Rules:**

```typescript
// Category name validation
export const CategoryNameValidator = {
  minLength: 1,
  maxLength: 100,
  pattern: /^[a-zA-Z0-9\s\-&()]+$/,
  message: 'Category name must be 1-100 characters'
};

// Category slug validation
export const CategorySlugValidator = {
  minLength: 1,
  maxLength: 50,
  pattern: /^[a-z0-9]+(-[a-z0-9]+)*$/,  // kebab-case only
  message: 'Slug must be lowercase letters, numbers, and hyphens (kebab-case)'
};

// Category order validation
export const CategoryOrderValidator = {
  minValue: 1,
  maxValue: 100,
  message: 'Order must be a positive integer'
};
```

---

### 3.3 Settings Model

```typescript
/**
 * Settings interface matching Firestore /settings/config document
 * Represents global business configuration
 */
export interface BusinessSettings {
  id: string;                          // Fixed: "config"
  whatsappNumber: string;              // E.164 format: +[country][number]
  businessName: string;                // Business display name
  businessEmail: string;               // Contact email
  updatedAt: firebase.firestore.Timestamp;
}

/**
 * Settings update form model
 */
export interface BusinessSettingsFormData {
  whatsappNumber: string;
  businessName: string;
  businessEmail: string;
}
```

**Validation Rules:**

```typescript
// WhatsApp number validation (E.164 format)
export const WhatsAppNumberValidator = {
  pattern: /^\+[1-9]\d{1,14}$/,        // E.164 format
  minLength: 7,                        // Minimum international number length
  maxLength: 15,
  message: 'WhatsApp number must be in E.164 format (e.g., +919876543210)'
};

// Business name validation
export const BusinessNameValidator = {
  minLength: 2,
  maxLength: 100,
  pattern: /^[a-zA-Z0-9\s\-'&()]+$/,
  message: 'Business name must be 2-100 characters'
};

// Business email validation
export const BusinessEmailValidator = {
  pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
  message: 'Must be a valid email address'
};
```

---

### 3.4 Error Models

```typescript
/**
 * Standardized error response model
 * All errors from services should conform to this structure
 */
export interface AppError {
  code: string;                        // Error code (e.g., "VALIDATION_ERROR", "AUTH_ERROR")
  message: string;                     // User-friendly error message
  details?: ErrorDetail[];             // Field-level error details
  timestamp: Date;                     // When error occurred
}

/**
 * Field-level error detail
 * Used for validation errors on specific fields
 */
export interface ErrorDetail {
  field: string;                       // Field name (e.g., "price", "colors")
  message: string;                     // Field-specific error message
}

/**
 * Error codes used throughout the application
 */
export enum ErrorCode {
  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',

  // Authentication errors
  AUTH_ERROR = 'AUTH_ERROR',
  AUTH_REQUIRED = 'AUTH_REQUIRED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  SESSION_EXPIRED = 'SESSION_EXPIRED',

  // Authorization errors
  FORBIDDEN = 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',

  // Firestore errors
  DOCUMENT_NOT_FOUND = 'DOCUMENT_NOT_FOUND',
  COLLECTION_NOT_FOUND = 'COLLECTION_NOT_FOUND',
  DATABASE_ERROR = 'DATABASE_ERROR',

  // Storage errors
  STORAGE_ERROR = 'STORAGE_ERROR',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  UPLOAD_FAILED = 'UPLOAD_FAILED',

  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',

  // Generic errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}
```

---

## 4. Firebase Security Rules

### 4.1 Firestore Security Rules

**File Location:** `firestore.rules` (deploy via Firebase CLI)

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // ================================================================
    // PRODUCTS COLLECTION
    // Public Read, Admin Write Only
    // ================================================================
    match /products/{productId} {
      // Public read: anyone can view products
      allow read: if true;

      // Write allowed only if user is authenticated (admin)
      // Admin is any authenticated user (configure more restrictively if needed)
      allow write: if request.auth != null;

      // Validate write operations
      allow create, update: if request.auth != null &&
        // Validate required fields
        request.resource.data.name is string &&
        request.resource.data.name.size() >= 1 &&
        request.resource.data.name.size() <= 200 &&

        request.resource.data.description is string &&
        request.resource.data.description.size() >= 10 &&
        request.resource.data.description.size() <= 2000 &&

        request.resource.data.price is number &&
        request.resource.data.price > 0 &&

        request.resource.data.material is string &&
        request.resource.data.material.size() >= 1 &&
        request.resource.data.material.size() <= 100 &&

        request.resource.data.category is string &&
        request.resource.data.category.size() >= 1 &&

        request.resource.data.colors is list &&
        request.resource.data.colors.size() >= 1 &&
        request.resource.data.colors.size() <= 10 &&

        request.resource.data.images is list &&
        request.resource.data.images.size() >= 1 &&
        request.resource.data.images.size() <= 15 &&

        request.resource.data.inStock is bool &&
        request.resource.data.featured is bool &&

        request.resource.data.updatedAt is timestamp;

      // Prevent deletion from client (safer workflow)
      allow delete: if false;
    }

    // ================================================================
    // CATEGORIES COLLECTION
    // Public Read, Admin Write Only
    // ================================================================
    match /categories/{categoryId} {
      // Public read: anyone can view categories
      allow read: if true;

      // Write allowed only if user is authenticated (admin)
      allow write: if request.auth != null;

      // Validate write operations
      allow create, update: if request.auth != null &&
        request.resource.data.name is string &&
        request.resource.data.name.size() >= 1 &&
        request.resource.data.name.size() <= 100 &&

        request.resource.data.slug is string &&
        request.resource.data.slug.size() >= 1 &&
        request.resource.data.slug.size() <= 50 &&

        request.resource.data.order is number &&
        request.resource.data.order > 0;
    }

    // ================================================================
    // SETTINGS COLLECTION
    // Public Read, Admin Write Only
    // ================================================================
    match /settings/{settingId} {
      // Public read: anyone can view settings (business info, WhatsApp)
      allow read: if true;

      // Write allowed only if user is authenticated (admin)
      allow write: if request.auth != null;

      // Validate write operations
      allow create, update: if request.auth != null &&
        request.resource.data.whatsappNumber is string &&
        request.resource.data.whatsappNumber.matches('^\\+[1-9]\\d{1,14}$') &&

        request.resource.data.businessName is string &&
        request.resource.data.businessName.size() >= 2 &&
        request.resource.data.businessName.size() <= 100 &&

        request.resource.data.businessEmail is string &&
        request.resource.data.businessEmail.matches('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}$');
    }

    // ================================================================
    // DEFAULT: DENY ALL OTHER ACCESS
    // ================================================================
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 4.2 Security Rules Deployment

**Deploy via Firebase CLI:**

```bash
# Install Firebase CLI (one-time)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Set active project
firebase use musani-wear-project

# Deploy security rules
firebase deploy --only firestore:rules

# View deployed rules in Firebase Console
# Firebase Console > Firestore > Rules tab
```

### 4.3 Authentication Security

**Firebase Authentication Setup:**

1. **Enable Email/Password Authentication:**
   - Firebase Console > Authentication > Sign-in method
   - Enable Email/Password provider
   - Disable sign-ups (admin manually creates user account)

2. **Create Admin User:**
   - Firebase Console > Authentication > Users
   - Click "Add user"
   - Email: admin@musaniwear.com
   - Password: Strong, 12+ characters, mixed case + numbers + symbols

3. **Enable Security Features:**
   - Enforce password policy (minimum 6 characters)
   - Enable multi-factor authentication (recommended for production)
   - Configure email verification for password reset

4. **Session Security:**
   - Access tokens expire after 1 hour automatically
   - Refresh tokens stored in secure, http-only cookies
   - Clear tokens on logout

---

## 5. Firebase Storage Structure

### 5.1 Storage Bucket Organization

**Firebase Storage Path Structure:**

```
gs://musani-wear-storage/
├── products/
│   ├── {productId1}/
│   │   ├── 1706000001-abc123.webp
│   │   ├── 1706000002-def456.webp
│   │   └── 1706000003-ghi789.webp
│   ├── {productId2}/
│   │   ├── 1706000004-jkl012.webp
│   │   └── 1706000005-mno345.webp
│   └── ...
└── temp/                          // Temporary uploads during edit
    └── {sessionId}/
        └── {timestamp}-{uuid}.webp
```

### 5.2 Image Upload & Naming Convention

**Upload Process:**

```typescript
// Naming convention: {timestamp}-{uuid}.{extension}
// Example: 1706000001-550e8400e29b41d4.webp

const timestamp = Date.now();          // Unix timestamp in milliseconds
const uuid = generateUUID();           // RFC 4122 UUID v4
const extension = 'webp';              // Always use WebP format
const fileName = `${timestamp}-${uuid}.${extension}`;

// Storage path
const storagePath = `products/${productId}/${fileName}`;
```

**Image Specifications:**

| Property | Specification |
|----------|---------------|
| Format | WebP (primary), JPEG/PNG fallback |
| Max File Size | 5 MB per image |
| Max Images per Product | 15 images |
| Image Dimensions (Target) | 1200x1200px (main), 600x600px (thumbnail) |
| Aspect Ratio | 1:1 (square) or 4:3 |
| Compression Quality | 80% (WebP) |
| Color Space | sRGB |

### 5.3 Firebase Storage Security Rules

**File Location:** `storage.rules` (deploy via Firebase CLI)

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {

    // ================================================================
    // PRODUCTS FOLDER
    // Public Read, Authenticated Write Only
    // ================================================================
    match /products/{productId}/{imageFile} {
      // Public read: anyone can download product images
      // Served via CDN for fast global distribution
      allow read: if true;

      // Write allowed only if user is authenticated (admin)
      allow write: if request.auth != null &&
        // Validate file size (5 MB max)
        request.resource.size <= 5 * 1024 * 1024 &&
        // Validate file type (images only)
        request.resource.contentType.matches('image/(jpeg|png|webp)');

      // Prevent deletion from client
      allow delete: if false;
    }

    // ================================================================
    // TEMPORARY FOLDER
    // Authenticated Write Only (for in-progress uploads)
    // ================================================================
    match /temp/{sessionId}/{tempFile} {
      // Only authenticated users can write to temp
      allow write: if request.auth != null &&
        request.resource.size <= 5 * 1024 * 1024 &&
        request.resource.contentType.matches('image/(jpeg|png|webp)');

      // Allow reading own temp files
      allow read: if request.auth != null;

      // Allow deletion of own temp files
      allow delete: if request.auth != null;
    }

    // ================================================================
    // DEFAULT: DENY ALL OTHER ACCESS
    // ================================================================
    match /{allPaths=**} {
      allow read, write, delete: if false;
    }
  }
}
```

**Deploy Storage Rules:**

```bash
firebase deploy --only storage
```

### 5.4 Image Upload Implementation

**Upload Service (TypeScript/Angular):**

```typescript
import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytes, getBytes, listAll, deleteObject } from '@angular/fire/storage';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ImageService {

  constructor(private storage: Storage) {}

  /**
   * Upload image to Firebase Storage
   * Returns public download URL after successful upload
   */
  uploadProductImage(productId: string, file: File): Observable<string> {
    const timestamp = Date.now();
    const uuid = this.generateUUID();
    const extension = this.getFileExtension(file.name);
    const fileName = `${timestamp}-${uuid}.${extension}`;
    const storagePath = `products/${productId}/${fileName}`;

    const storageRef = ref(this.storage, storagePath);

    return from(uploadBytes(storageRef, file)).pipe(
      switchMap(() => this.getDownloadUrl(storagePath))
    );
  }

  /**
   * Get public download URL for stored image
   */
  getDownloadUrl(storagePath: string): Observable<string> {
    const storageRef = ref(this.storage, storagePath);
    // In production, use getDownloadURL() from @angular/fire/storage
    // For now, return predictable URL based on storage path
    return from(Promise.resolve(
      `https://firebasestorage.googleapis.com/v0/b/musani-wear.appspot.com/o/${encodeURIComponent(storagePath)}?alt=media`
    ));
  }

  /**
   * Delete image from Firebase Storage
   */
  deleteImage(storagePath: string): Observable<void> {
    const storageRef = ref(this.storage, storagePath);
    return from(deleteObject(storageRef));
  }

  /**
   * List all images for a product
   */
  listProductImages(productId: string): Observable<string[]> {
    const folderRef = ref(this.storage, `products/${productId}`);

    return from(listAll(folderRef)).pipe(
      switchMap((result) => {
        const downloadUrlPromises = result.items.map(itemRef =>
          this.getDownloadUrl(itemRef.fullPath)
        );
        return Promise.all(downloadUrlPromises);
      }),
      map(urls => urls)
    );
  }

  /**
   * Validate file before upload
   */
  validateImage(file: File): { valid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024; // 5 MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Invalid file type. Only JPEG, PNG, and WebP allowed.' };
    }

    if (file.size > maxSize) {
      return { valid: false, error: 'File too large. Maximum 5 MB allowed.' };
    }

    return { valid: true };
  }

  private generateUUID(): string {
    // Simple UUID v4 generator
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }).replace(/-/g, '');
  }

  private getFileExtension(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() || 'webp';
  }
}
```

---

## 6. Angular Service Architecture

### 6.1 Service Layer Overview

**Service Structure:**

```
src/app/
├── services/
│   ├── product.service.ts          // CRUD for products
│   ├── category.service.ts         // CRUD for categories
│   ├── image.service.ts            // Upload/delete images
│   ├── auth.service.ts             // Admin login/logout
│   ├── settings.service.ts         // Read/write business settings
│   ├── whatsapp.service.ts         // WhatsApp URL generation
│   └── error.service.ts            // Centralized error handling
│
├── store/
│   ├── product.store.ts            // Product state with BehaviorSubject
│   ├── category.store.ts           // Category state
│   ├── settings.store.ts           // Settings state
│   └── auth.store.ts               // Authentication state
│
├── models/
│   └── index.ts                    // All TypeScript interfaces
│
└── components/
    ├── admin/
    │   ├── product-form/
    │   ├── product-list/
    │   └── settings/
    └── public/
        ├── product-gallery/
        └── product-detail/
```

### 6.2 Product Service

**File:** `src/app/services/product.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, doc, getDoc, setDoc, updateDoc,
         query, where, orderBy, limit, startAfter, Query, QueryConstraint,
         Timestamp, deleteDoc } from '@angular/fire/firestore';
import { Observable, BehaviorSubject, from, throwError } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import { Product, ProductFormData, ProductFilter, PaginatedProducts } from '../models';

@Injectable({ providedIn: 'root' })
export class ProductService {

  constructor(private firestore: Firestore) {}

  /**
   * Get all products with optional filters
   */
  getProducts(filter?: ProductFilter): Observable<Product[]> {
    const productsRef = collection(this.firestore, 'products');

    const constraints: QueryConstraint[] = [];

    // Apply category filter
    if (filter?.category) {
      constraints.push(where('category', '==', filter.category));
    }

    // Apply stock filter
    if (filter?.inStock !== undefined) {
      constraints.push(where('inStock', '==', filter.inStock));
    }

    // Apply featured filter
    if (filter?.featured !== undefined) {
      constraints.push(where('featured', '==', filter.featured));
    }

    // Add ordering
    constraints.push(orderBy('createdAt', 'desc'));

    // Add pagination
    if (filter?.limit) {
      constraints.push(limit(filter.limit));
    }

    const q = query(productsRef, ...constraints);

    return from(getDocs(q)).pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Product));
      }),
      catchError(error => this.handleError(error, 'Failed to fetch products'))
    );
  }

  /**
   * Get single product by ID
   */
  getProduct(productId: string): Observable<Product | null> {
    const productRef = doc(this.firestore, 'products', productId);

    return from(getDoc(productRef)).pipe(
      map(docSnapshot => {
        if (!docSnapshot.exists()) {
          return null;
        }
        return {
          id: docSnapshot.id,
          ...docSnapshot.data()
        } as Product;
      }),
      catchError(error => this.handleError(error, 'Failed to fetch product'))
    );
  }

  /**
   * Get paginated products with cursor
   */
  getPaginatedProducts(filter?: ProductFilter, lastDoc?: any): Observable<PaginatedProducts> {
    const productsRef = collection(this.firestore, 'products');
    const pageSize = filter?.limit || 12;

    const constraints: QueryConstraint[] = [
      orderBy('createdAt', 'desc'),
      limit(pageSize + 1)  // Fetch +1 to check if more results exist
    ];

    if (filter?.category) {
      constraints.push(where('category', '==', filter.category));
    }

    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    const q = query(productsRef, ...constraints);

    return from(getDocs(q)).pipe(
      map(snapshot => {
        const docs = snapshot.docs;
        const hasMore = docs.length > pageSize;
        const items = hasMore ? docs.slice(0, pageSize) : docs;

        return {
          items: items.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Product)),
          hasMore,
          lastDocumentSnapshot: items[items.length - 1],
          totalCount: docs.length
        };
      }),
      catchError(error => this.handleError(error, 'Failed to fetch paginated products'))
    );
  }

  /**
   * Create new product
   */
  createProduct(formData: ProductFormData): Observable<string> {
    const productsRef = collection(this.firestore, 'products');
    const newDocRef = doc(productsRef);

    const productData: any = {
      ...formData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    return from(setDoc(newDocRef, productData)).pipe(
      map(() => newDocRef.id),
      catchError(error => this.handleError(error, 'Failed to create product'))
    );
  }

  /**
   * Update existing product
   */
  updateProduct(productId: string, updates: Partial<ProductFormData>): Observable<void> {
    const productRef = doc(this.firestore, 'products', productId);

    const updateData = {
      ...updates,
      updatedAt: Timestamp.now()
    };

    return from(updateDoc(productRef, updateData)).pipe(
      catchError(error => this.handleError(error, 'Failed to update product'))
    );
  }

  /**
   * Delete product
   */
  deleteProduct(productId: string): Observable<void> {
    const productRef = doc(this.firestore, 'products', productId);
    return from(deleteDoc(productRef)).pipe(
      catchError(error => this.handleError(error, 'Failed to delete product'))
    );
  }

  /**
   * Get featured products (for homepage)
   */
  getFeaturedProducts(limit: number = 8): Observable<Product[]> {
    return this.getProducts({
      featured: true,
      limit,
      sortBy: 'newest'
    });
  }

  /**
   * Search products by name
   * Note: Full-text search in Firestore requires Algolia or similar
   * This is a client-side filter
   */
  searchProducts(query: string, products: Product[]): Product[] {
    const lowerQuery = query.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery)
    );
  }

  private handleError(error: any, message: string): Observable<never> {
    console.error(message, error);
    return throwError(() => ({
      code: 'DATABASE_ERROR',
      message,
      details: error.message
    }));
  }
}
```

### 6.3 Category Service

**File:** `src/app/services/category.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, doc, setDoc, updateDoc, deleteDoc,
         query, orderBy, Query, Timestamp } from '@angular/fire/firestore';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Category, CategoryFormData } from '../models';

@Injectable({ providedIn: 'root' })
export class CategoryService {

  constructor(private firestore: Firestore) {}

  /**
   * Get all categories, sorted by display order
   */
  getCategories(): Observable<Category[]> {
    const categoriesRef = collection(this.firestore, 'categories');
    const q = query(categoriesRef, orderBy('order', 'asc'));

    return from(getDocs(q)).pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Category));
      }),
      catchError(error => this.handleError(error, 'Failed to fetch categories'))
    );
  }

  /**
   * Create new category
   */
  createCategory(formData: CategoryFormData): Observable<string> {
    const categoriesRef = collection(this.firestore, 'categories');

    const categoryData = {
      ...formData,
      id: formData.slug,
      createdAt: Timestamp.now()
    };

    return from(setDoc(doc(categoriesRef, formData.slug), categoryData)).pipe(
      map(() => formData.slug),
      catchError(error => this.handleError(error, 'Failed to create category'))
    );
  }

  /**
   * Update category
   */
  updateCategory(categoryId: string, updates: Partial<CategoryFormData>): Observable<void> {
    const categoryRef = doc(this.firestore, 'categories', categoryId);
    return from(updateDoc(categoryRef, updates)).pipe(
      catchError(error => this.handleError(error, 'Failed to update category'))
    );
  }

  /**
   * Delete category
   */
  deleteCategory(categoryId: string): Observable<void> {
    const categoryRef = doc(this.firestore, 'categories', categoryId);
    return from(deleteDoc(categoryRef)).pipe(
      catchError(error => this.handleError(error, 'Failed to delete category'))
    );
  }

  /**
   * Seed default categories (run once on first setup)
   */
  seedDefaultCategories(): Observable<void> {
    const defaultCategories: CategoryFormData[] = [
      { name: 'New Arrivals', slug: 'new-arrivals', order: 1 },
      { name: 'Stitched', slug: 'stitched', order: 2 },
      { name: 'Unstitched', slug: 'unstitched', order: 3 },
      { name: 'Luxe', slug: 'luxe', order: 4 }
    ];

    const categoriesRef = collection(this.firestore, 'categories');

    const promises = defaultCategories.map(cat =>
      setDoc(doc(categoriesRef, cat.slug), {
        ...cat,
        id: cat.slug,
        createdAt: Timestamp.now()
      })
    );

    return from(Promise.all(promises)).pipe(
      map(() => undefined),
      catchError(error => this.handleError(error, 'Failed to seed categories'))
    );
  }

  private handleError(error: any, message: string): Observable<never> {
    console.error(message, error);
    return throwError(() => ({
      code: 'DATABASE_ERROR',
      message,
      details: error.message
    }));
  }
}
```

### 6.4 Settings Service

**File:** `src/app/services/settings.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc, updateDoc, Timestamp } from '@angular/fire/firestore';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BusinessSettings, BusinessSettingsFormData } from '../models';

@Injectable({ providedIn: 'root' })
export class SettingsService {

  private readonly SETTINGS_DOC_ID = 'config';

  constructor(private firestore: Firestore) {}

  /**
   * Get current business settings
   */
  getSettings(): Observable<BusinessSettings> {
    const settingsRef = doc(this.firestore, 'settings', this.SETTINGS_DOC_ID);

    return from(getDoc(settingsRef)).pipe(
      map(docSnapshot => {
        if (!docSnapshot.exists()) {
          throw new Error('Settings not found');
        }
        return {
          id: docSnapshot.id,
          ...docSnapshot.data()
        } as BusinessSettings;
      }),
      catchError(error => this.handleError(error, 'Failed to fetch settings'))
    );
  }

  /**
   * Update business settings
   */
  updateSettings(updates: BusinessSettingsFormData): Observable<void> {
    const settingsRef = doc(this.firestore, 'settings', this.SETTINGS_DOC_ID);

    const updateData = {
      ...updates,
      updatedAt: Timestamp.now()
    };

    return from(updateDoc(settingsRef, updateData)).pipe(
      catchError(error => this.handleError(error, 'Failed to update settings'))
    );
  }

  /**
   * Initialize settings (first-time setup)
   */
  initializeSettings(initialData: BusinessSettingsFormData): Observable<void> {
    const settingsRef = doc(this.firestore, 'settings', this.SETTINGS_DOC_ID);

    const settingsData = {
      id: this.SETTINGS_DOC_ID,
      ...initialData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    return from(setDoc(settingsRef, settingsData)).pipe(
      catchError(error => this.handleError(error, 'Failed to initialize settings'))
    );
  }

  private handleError(error: any, message: string): Observable<never> {
    console.error(message, error);
    return throwError(() => ({
      code: 'DATABASE_ERROR',
      message,
      details: error.message
    }));
  }
}
```

### 6.5 Authentication Service

**File:** `src/app/services/auth.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
import { Observable, from, throwError, BehaviorSubject } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private auth: Auth) {
    // Listen to auth state changes
    onAuthStateChanged(this.auth, user => {
      this.currentUserSubject.next(user);
      if (user) {
        console.log('User logged in:', user.email);
      }
    });
  }

  /**
   * Admin login with email and password
   */
  login(email: string, password: string): Observable<User> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      map(credential => credential.user),
      tap(user => {
        console.log('Login successful:', user.email);
        this.currentUserSubject.next(user);
      }),
      catchError(error => this.handleAuthError(error))
    );
  }

  /**
   * Admin logout
   */
  logout(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      tap(() => {
        console.log('Logout successful');
        this.currentUserSubject.next(null);
      }),
      catchError(error => this.handleAuthError(error))
    );
  }

  /**
   * Get current user synchronously
   */
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  /**
   * Get current user ID token (for API calls if needed)
   */
  getIdToken(): Observable<string | null> {
    const user = this.auth.currentUser;
    if (!user) {
      return from(Promise.resolve(null));
    }
    return from(user.getIdToken());
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.auth.currentUser !== null;
  }

  private handleAuthError(error: any): Observable<never> {
    let message = 'Authentication failed';

    switch (error.code) {
      case 'auth/user-not-found':
        message = 'User not found. Please check your email.';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password. Please try again.';
        break;
      case 'auth/invalid-email':
        message = 'Invalid email address.';
        break;
      case 'auth/user-disabled':
        message = 'User account has been disabled.';
        break;
      case 'auth/too-many-requests':
        message = 'Too many login attempts. Please try again later.';
        break;
      default:
        message = error.message || 'Authentication error occurred.';
    }

    console.error(message, error);
    return throwError(() => ({
      code: 'AUTH_ERROR',
      message,
      details: error.code
    }));
  }
}
```

### 6.6 WhatsApp Service

**File:** `src/app/services/whatsapp.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { SettingsService } from './settings.service';
import { Product, BusinessSettings } from '../models';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class WhatsAppService {

  constructor(private settingsService: SettingsService) {}

  /**
   * Generate WhatsApp message URL for a product inquiry
   * URL format: https://wa.me/{phoneNumber}?text={encodedMessage}
   */
  generateProductInquiryUrl(product: Product, color: string): Observable<string> {
    return this.settingsService.getSettings().pipe(
      map(settings => {
        const message = this.buildProductInquiryMessage(product, color);
        const encodedMessage = encodeURIComponent(message);
        const phoneNumber = this.formatPhoneNumber(settings.whatsappNumber);

        return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      })
    );
  }

  /**
   * Generate WhatsApp message URL for general inquiry
   */
  generateGeneralInquiryUrl(message: string): Observable<string> {
    return this.settingsService.getSettings().pipe(
      map(settings => {
        const encodedMessage = encodeURIComponent(message);
        const phoneNumber = this.formatPhoneNumber(settings.whatsappNumber);

        return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      })
    );
  }

  /**
   * Open WhatsApp chat (for direct clicks)
   */
  openProductInquiry(product: Product, color: string): void {
    this.generateProductInquiryUrl(product, color).subscribe(url => {
      window.open(url, '_blank');
    });
  }

  /**
   * Build formatted product inquiry message (delegate to utils for testability)
   */
  private buildProductInquiryMessage(product: Product, color: string): string {
    return buildProductInquiryMessageText(product, color); // from utils/build-whatsapp-message
  }

  /**
   * Format phone number for wa.me URL (delegate to utils)
   */
  private formatPhoneNumber(whatsappNumber: string): string {
    return formatPhoneForWhatsApp(whatsappNumber); // from utils/format-phone
  }
}
```

---

## 7. NgRx State Management

Musani Wear uses NgRx for centralized, predictable state management. See TECH_STACK.md Section 8 for full implementation details.

### 7.1 Store Structure

```
src/app/store/
├── products/           # Product feature state
│   ├── product.actions.ts
│   ├── product.reducer.ts
│   ├── product.effects.ts
│   └── product.selectors.ts
├── categories/         # Category feature state
│   ├── category.actions.ts
│   ├── category.reducer.ts
│   ├── category.effects.ts
│   └── category.selectors.ts
└── auth/               # Auth state
    ├── auth.actions.ts
    ├── auth.reducer.ts
    ├── auth.effects.ts
    └── auth.selectors.ts
```

### 7.2 Data Flow

1. **Components** dispatch actions (e.g. `store.dispatch(loadProducts())`)
2. **Effects** listen for actions, call ProductService/CategoryService (Firestore), dispatch success/failure actions
3. **Reducers** handle actions and update state immutably
4. **Selectors** expose derived state (e.g. `selectProducts`, `selectLoading`, `selectCategoryBySlug`)
5. **Components** select state via `store.select(selectProducts)` and display in templates

### 7.3 Key Patterns

- **Product state:** products[], selectedProduct, loading, error, currentFilter
- **Category state:** categories[], loading, error
- **Auth state:** currentUser, loading, error
- **Effects** handle all Firestore async calls; services remain pure data-access layers

---

## 8. Admin Operations

### 8.1 Product Management Operations

**Typical Admin Workflow:**

```typescript
// 1. Create new product with images
const formData = {
  name: 'Embroidered Anarkali Suit',
  description: 'Premium georgette Anarkali...',
  price: 2499,
  material: 'Georgette',
  category: 'stitched',
  colors: ['#FF0000', 'Navy Blue'],
  images: [], // Populated after upload
  inStock: true,
  featured: true
};

// 2. Upload images
file1 → Firebase Storage → Get URL → Add to images[]
file2 → Firebase Storage → Get URL → Add to images[]

// 3. Create product in Firestore (NgRx)
store.dispatch(createProductRequested({ formData }));
// Listen for createProductSuccess/createProductFailure in component or effect

// 4. Update product (e.g., price change)
store.dispatch(updateProductRequested({ productId, updates: { price: 2299 } }));

// 5. Delete product
store.dispatch(deleteProductRequested({ productId }));
```

### 8.2 Settings Management

**Update Business Settings:**

```typescript
const updatedSettings = {
  whatsappNumber: '+919876543210',
  businessName: 'Musani Wear',
  businessEmail: 'support@musaniwear.com'
};

settingsService.updateSettings(updatedSettings).subscribe(
  () => console.log('Settings updated'),
  error => console.error('Update failed:', error)
);
```

### 8.3 Image Management Operations

**Upload Product Image:**

```typescript
const file = event.target.files[0]; // From file input

// Validate
const validation = imageService.validateImage(file);
if (!validation.valid) {
  console.error(validation.error);
  return;
}

// Upload
imageService.uploadProductImage(productId, file).subscribe(
  (downloadUrl) => {
    console.log('Image uploaded:', downloadUrl);
    // Add URL to product images array (NgRx)
    store.dispatch(updateProductRequested({ productId, updates: { images: [...currentImages, downloadUrl] } }));
  },
  (error) => console.error('Upload failed:', error)
);
```

**Delete Product Image:**

```typescript
const storagePath = 'products/{productId}/{fileName}';

imageService.deleteImage(storagePath).subscribe(
  () => {
    console.log('Image deleted');
    // Remove from product images array (NgRx)
    const updatedImages = currentImages.filter(img => !img.includes(fileName));
    store.dispatch(updateProductRequested({ productId, updates: { images: updatedImages } }));
  },
  (error) => console.error('Deletion failed:', error)
);
```

---

## 9. Authentication & Authorization

### 9.1 Admin Login Flow

**Login Component Example:**

```typescript
export class AdminLoginComponent {

  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    // AuthService dispatches loginRequested; AuthEffects handles Firebase and redirects on success
    this.authService.login(email, password);
  }
}
```

### 9.2 Route Guards

**Auth Guard Example:**

```typescript
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      map(user => {
        if (user) {
          return true;
        } else {
          this.router.navigate(['/admin/login']);
          return false;
        }
      })
    );
  }
}

// Usage in routing
const routes: Routes = [
  {
    path: 'admin',
    children: [
      { path: 'login', component: AdminLoginComponent },
      {
        path: 'dashboard',
        component: AdminDashboardComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'products',
        component: ProductListComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];
```

### 9.3 Session Management

**Automatic Logout on Token Expiry:**

```typescript
@Injectable({ providedIn: 'root' })
export class SessionService {

  private tokenRefreshInterval: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Start session monitoring
   * Refresh token before expiry
   */
  startSessionMonitoring(): void {
    // Check token every 50 minutes (Firebase tokens valid for 1 hour)
    this.tokenRefreshInterval = setInterval(() => {
      this.authService.getIdToken().subscribe(
        (token) => {
          if (!token) {
            // Token expired, logout
            this.logout();
          }
        }
      );
    }, 50 * 60 * 1000);
  }

  /**
   * Stop session monitoring
   */
  stopSessionMonitoring(): void {
    if (this.tokenRefreshInterval) {
      clearInterval(this.tokenRefreshInterval);
    }
  }

  /**
   * Logout user
   */
  logout(): void {
    this.authService.logout().subscribe(() => {
      this.stopSessionMonitoring();
      this.router.navigate(['/admin/login']);
    });
  }
}
```

---

## 10. WhatsApp Integration

### 10.1 WhatsApp Contact Flow

**Product Page WhatsApp Button:**

```typescript
// In product detail component
onAskAvailability(color: string): void {
  this.whatsappService.openProductInquiry(this.product, color);
}

// Generated URL example
// Input:
//   - Product: "Embroidered Anarkali Suit"
//   - Color: "Red"
//   - Price: 2499
//   - WhatsApp: +919876543210
//
// Output URL:
// https://wa.me/919876543210?text=Hi!%20I'm%20interested%20in%20*Embroidered%20Anarkali%20Suit*%20(Color:%20Red,%20Price:%20₹2499).%20Could%20you%20please%20confirm%20availability%20and%20provide%20more%20details?
```

**Message Format:**

```
Hi! I'm interested in *{productName}* (Color: {color}, Price: ₹{price}).
Could you please confirm availability and provide more details?
```

### 10.2 Phone Number Validation

**E.164 Format:**

```
Valid: +919876543210 (India)
Valid: +14155552671 (USA)
Valid: +447911123456 (UK)

Invalid: 9876543210 (missing +)
Invalid: +91 9876543210 (with spaces)
Invalid: 009876543210 (with leading zeros)
```

---

## 11. Firestore Queries & Indexes

### 11.1 Composite Index Configuration

**Firebase Console > Firestore > Indexes**

Create these composite indexes:

```
Index 1: Products by Category + Creation Date
  Collection: products
  Field 1: category (Ascending)
  Field 2: createdAt (Descending)
  Status: Auto-created by Firebase

Index 2: Featured Products by Creation Date
  Collection: products
  Field 1: featured (Ascending)
  Field 2: createdAt (Descending)
  Status: Auto-created by Firebase

Index 3: Products by Category + Stock Status + Creation Date
  Collection: products
  Field 1: category (Ascending)
  Field 2: inStock (Ascending)
  Field 3: createdAt (Descending)
  Status: Auto-created by Firebase
```

### 11.2 Query Examples

**Get Products by Category:**

```typescript
// Query
where('category', '==', 'stitched')
.orderBy('createdAt', 'desc')

// Requires Index 1 or 3
```

**Get Featured Products:**

```typescript
// Query
where('featured', '==', true)
.orderBy('createdAt', 'desc')
.limit(8)

// Requires Index 2
```

**Get In-Stock Products by Category:**

```typescript
// Query
where('category', '==', 'luxe')
.where('inStock', '==', true)
.orderBy('createdAt', 'desc')

// Requires Index 3
```

---

## 12. Error Handling

### 12.1 Error Response Format

**Standardized Error Structure:**

```typescript
interface AppError {
  code: string;              // Machine-readable code
  message: string;           // User-friendly message
  details?: ErrorDetail[];   // Field-level errors
  timestamp: Date;           // Error occurrence time
}

interface ErrorDetail {
  field: string;             // Field name
  message: string;           // Field-specific message
}
```

**Example Error Responses:**

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Product validation failed",
  "details": [
    { "field": "price", "message": "Price must be greater than 0" },
    { "field": "colors", "message": "At least one color required" }
  ],
  "timestamp": "2026-03-08T10:30:00Z"
}
```

```json
{
  "code": "AUTH_ERROR",
  "message": "Incorrect password. Please try again.",
  "timestamp": "2026-03-08T10:30:00Z"
}
```

### 12.2 Error Interceptor

**Global Error Handling:**

```typescript
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private notificationService: NotificationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unexpected error occurred';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = error.error.message;
        } else {
          // Server-side error
          switch (error.status) {
            case 400:
              errorMessage = error.error?.message || 'Invalid request';
              break;
            case 401:
              errorMessage = 'Authentication required';
              break;
            case 403:
              errorMessage = 'Access denied';
              break;
            case 404:
              errorMessage = 'Resource not found';
              break;
            case 500:
              errorMessage = 'Server error. Please try again later.';
              break;
            default:
              errorMessage = `Error: ${error.status} ${error.statusText}`;
          }
        }

        this.notificationService.showError(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
```

---

## 13. Performance & Optimization

### 13.1 Firestore Performance Best Practices

**1. Pagination with limit():**

```typescript
// Bad: Fetch all products
query(productsRef, orderBy('createdAt', 'desc'))

// Good: Fetch in batches
query(productsRef, orderBy('createdAt', 'desc'), limit(20))
```

**2. Selective Field Retrieval:**

```typescript
// Firestore doesn't support select, but keep queries minimal
// Retrieve all fields needed, avoid multiple queries
```

**3. Batch Operations:**

```typescript
import { writeBatch } from '@angular/fire/firestore';

const batch = writeBatch(this.firestore);

// Add multiple products in single batch
const ref1 = doc(this.firestore, 'products', 'id1');
batch.set(ref1, productData1);

const ref2 = doc(this.firestore, 'products', 'id2');
batch.set(ref2, productData2);

await batch.commit();
```

### 13.2 Image Optimization

**Firebase Storage Optimization:**

```typescript
// 1. Use WebP format (smaller file size)
// 2. Resize images before upload (1200x1200px max)
// 3. Compress with 80% quality
// 4. Use CDN URLs for fast delivery

// Example URL
https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{path}?alt=media
```

**Angular Image Loading:**

```html
<!-- Native lazy loading -->
<img
  [src]="product.images[0]"
  loading="lazy"
  alt="Product"
/>

<!-- Or with Angular Image Directive -->
<img
  [ngSrc]="product.images[0]"
  [width]="600"
  [height]="600"
  priority="false"
/>
```

### 13.3 RxJS Performance

**Memory Leak Prevention:**

```typescript
// Unsubscribe from observables
export class ProductComponent implements OnDestroy {

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.productStore.products$
      .pipe(takeUntil(this.destroy$))
      .subscribe(products => this.products = products);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

**Share Operators:**

```typescript
// Share subscription among multiple subscribers
public products$ = this.productService.getProducts().pipe(
  shareReplay(1)  // Cache result, reuse for new subscribers
);
```

---

## 14. Deployment & Configuration

### 14.1 Firebase Project Setup

**Initialize Firebase Project:**

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Create project (or use existing)
firebase projects:create musani-wear

# Initialize in Angular project
firebase init
? Which Firebase features do you want?
  ✓ Hosting: Configure files for Firebase Hosting and proceed with deployment
  ✓ Firestore: Deploy rules and create indexes for Cloud Firestore
  ✓ Storage: Deploy Cloud Storage security rules
```

### 14.2 Configuration Files

**firebase.json:**

```json
{
  "hosting": {
    "public": "dist/musani-wear",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  }
}
```

**environment.ts:**

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'musani-wear.firebaseapp.com',
    projectId: 'musani-wear',
    storageBucket: 'musani-wear.appspot.com',
    messagingSenderId: 'YOUR_SENDER_ID',
    appId: 'YOUR_APP_ID'
  }
};
```

**environment.prod.ts:**

```typescript
export const environment = {
  production: true,
  firebase: {
    apiKey: process.env['FIREBASE_API_KEY'],
    authDomain: 'musani-wear.firebaseapp.com',
    projectId: 'musani-wear',
    storageBucket: 'musani-wear.appspot.com',
    messagingSenderId: process.env['FIREBASE_SENDER_ID'],
    appId: process.env['FIREBASE_APP_ID']
  }
};
```

### 14.3 Deployment Commands

**Deploy Everything:**

```bash
# Build Angular app
ng build --configuration production

# Deploy to Firebase
firebase deploy

# This deploys:
# - Hosting (Angular app to firebase.com domain)
# - Firestore rules (security rules)
# - Storage rules (image storage rules)
# - Firestore indexes (composite indexes)
```

**Deploy Specific Component:**

```bash
# Deploy only hosting
firebase deploy --only hosting

# Deploy only Firestore rules
firebase deploy --only firestore:rules

# Deploy only Storage rules
firebase deploy --only storage
```

### 14.4 Monitoring & Debugging

**Firebase Console Monitoring:**

```
Firestore:
  - Monitoring tab: View reads, writes, deletes
  - Usage tab: Check quota usage
  - Storage tab: View total data size

Storage:
  - Monitoring tab: View uploads, downloads, bandwidth
  - Usage tab: Check quota usage

Authentication:
  - Users tab: View admin user, last login
  - Sign-in method: Monitor active methods

Hosting:
  - Overview tab: View deployment history
  - Analytics: View page views, bounce rate
```

**Local Development:**

```bash
# Use Firebase Emulator Suite for local testing
firebase emulators:start

# Emulates:
# - Firestore Database
# - Firebase Storage
# - Firebase Authentication
# - Hosting
```

---

## Appendix: Complete File Structure

```
musani-wear/
├── src/
│   ├── app/
│   │   ├── services/
│   │   │   ├── product.service.ts
│   │   │   ├── category.service.ts
│   │   │   ├── image.service.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── settings.service.ts
│   │   │   ├── whatsapp.service.ts
│   │   │   └── error.service.ts
│   │   │
│   │   ├── store/
│   │   │   ├── product.store.ts
│   │   │   ├── category.store.ts
│   │   │   ├── settings.store.ts
│   │   │   └── auth.store.ts
│   │   │
│   │   ├── models/
│   │   │   └── index.ts          // All TypeScript interfaces
│   │   │
│   │   ├── guards/
│   │   │   └── auth.guard.ts
│   │   │
│   │   ├── interceptors/
│   │   │   └── error.interceptor.ts
│   │   │
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── product-form/
│   │   │   │   ├── product-list/
│   │   │   │   ├── category-list/
│   │   │   │   └── settings-panel/
│   │   │   │
│   │   │   └── public/
│   │   │       ├── product-gallery/
│   │   │       ├── product-detail/
│   │   │       └── category-nav/
│   │   │
│   │   ├── app.module.ts
│   │   ├── app.config.ts
│   │   └── app.component.ts
│   │
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   │
│   └── index.html
│
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
├── storage.rules
├── angular.json
├── tsconfig.json
├── package.json
└── README.md
```

---

## Summary

This comprehensive backend architecture for Musani Wear provides:

1. **Database Schema:** Complete Firestore structure with collections, field specifications, and relationships
2. **TypeScript Models:** Fully typed interfaces for all data models and API responses
3. **Security:** Firestore and Storage rules with authentication guards
4. **Services:** Modular Angular services for all data operations
5. **State Management:** NgRx store with Actions, Reducers, Effects, Selectors
6. **Error Handling:** Standardized error responses and global error handling
7. **WhatsApp Integration:** Client-side URL generation for customer inquiries
8. **Performance:** Pagination, lazy loading, batch operations
9. **Deployment:** Firebase configuration and deployment procedures

The architecture enables rapid development with clear separation of concerns, reactive data flows, and production-ready security practices.
