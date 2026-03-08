# TECH_STACK.md - Musani Wear

**Project Type:** Angular SPA - Dress Boutique E-Commerce with Firebase Backend
**Last Updated:** March 8, 2026
**Document Status:** Production-Ready

---

## 1. Executive Summary

Musani Wear is a modern, lightweight Single Page Application (SPA) built with Angular and Firebase. The stack prioritizes:

- **Rapid development** with Angular's mature ecosystem
- **Zero backend infrastructure** via Firebase managed services
- **Type safety** with TypeScript in strict mode
- **Real-time data sync** through Firestore
- **Scalability** with serverless Firebase hosting
- **Simplicity** using NgRx store for predictable, centralized state management

All dependencies are locked to exact versions for reproducibility and stability across development, staging, and production environments.

---

## 2. Core Technology Stack

### 2.1 Runtime & Build System

#### Node.js
- **Version:** 24.14.0 LTS (Krypton)
- **Why chosen:**
  - Active LTS support through October 2026, Maintenance LTS through April 2028
  - Latest stable features (ES2024 support)
  - Excellent performance for development builds
  - Team familiarity with modern Node.js ecosystem
  - Faster npm package resolution compared to older versions
- **Installation:** Via NVM or direct download from https://nodejs.org/
  ```bash
  # Using NVM (recommended)
  nvm install 24.14.0
  nvm use 24.14.0
  nvm alias default 24.14.0

  # Verify installation
  node --version  # v24.14.0
  npm --version   # 11.x.x (comes with Node.js)
  ```

#### TypeScript
- **Version:** 5.9.2 (stable)
- **Why chosen:**
  - Latest stable version with excellent Angular 21 compatibility
  - Full support for ES2024 syntax and features
  - Strict mode enabled by default (ensures type safety)
  - Exceptional IDE support with intelligent code completion
  - Catches type errors at compile time, preventing runtime bugs
- **Why not TypeScript 6.0:** RC version not yet stable; v5.9.2 provides stability for production
- **Installation:** Installed via npm, specified in package.json
  ```bash
  npm install --save-dev typescript@5.9.2
  ```

---

### 2.2 Frontend Framework & Core

#### Angular
- **Version:** 21.2.0
- **Why chosen:**
  - Latest stable release (published March 2026)
  - Full TypeScript 5.9 compatibility
  - Mature ecosystem with 10+ years of battle-tested patterns
  - Component-based architecture enables reusable, testable UI modules
  - Excellent routing system (lazy loading, guards, resolvers)
  - Built-in reactive forms with powerful validation
  - Angular CLI provides zero-configuration scaffolding
  - Strong typing and dependency injection reduce bugs
  - Extensive official documentation and community support
  - Team has 3+ years Angular experience
- **Alternative Considered:** React
  - Why not chosen: Team already proficient in Angular; smaller SPA doesn't require React's ecosystem flexibility; Angular's batteries-included approach better fits this scope
- **Installation:**
  ```bash
  npm install @angular/core@21.2.0 @angular/common@21.2.0 @angular/router@21.2.0 @angular/forms@21.2.0 @angular/platform-browser@21.2.0
  ```

#### Angular CLI
- **Version:** 21.2.0 (matches @angular/core version)
- **Why chosen:**
  - Official Angular scaffold and development tool
  - Zero-configuration development server with hot reload
  - Integrated TypeScript compilation
  - Built-in testing and linting support
  - Automated code generation (components, services, modules)
- **Global Installation:**
  ```bash
  npm install -g @angular/cli@21.2.0

  # Verify installation
  ng version
  ```

#### NgRx Store
- **Version:** 19.0.0 (or latest compatible with Angular 21)
- **Why chosen:**
  - Official Angular state management library (Redux pattern)
  - Predictable, centralized state with Actions, Reducers, Effects, and Selectors
  - Excellent DevTools for time-travel debugging and state inspection
  - Strong typing and testability
  - Scales well as app complexity grows
  - Integrates seamlessly with RxJS and Angular
- **Installation:**
  ```bash
  npm install @ngrx/store@19 @ngrx/effects@19 @ngrx/store-devtools@19
  ```

#### AngularFire (Firebase SDK for Angular)
- **Version:** 20.0.1
- **Why chosen:**
  - Official Angular wrapper for Firebase SDK
  - Seamless Firestore integration with RxJS Observables
  - Simplified authentication state management
  - Built-in typing for Firebase operations
  - Zero configuration needed
  - Handles unsubscription automatically in many cases
- **Why not 21.x:** Version 20.0.1 has proven stability; v21 still rolling out, less battle-tested in production
- **Installation:**
  ```bash
  npm install @angular/fire@20.0.1
  ```

---

### 2.3 Firebase Services (Backend)

#### Firebase JavaScript SDK
- **Version:** 12.10.0
- **Services included:**
  1. **Firestore** - Real-time NoSQL database for products, categories, admin settings
  2. **Firebase Storage** - Cloud storage for product images (up to 5GB included)
  3. **Firebase Authentication** - Secure admin login with email/password
  4. **Firebase Hosting** - Global CDN-backed hosting for the Angular app
- **Why chosen:**
  - Fully managed backend (no servers to maintain)
  - Real-time data synchronization without polling
  - Automatic scaling (handles 10k+ concurrent users)
  - Firestore provides ACID transactions and consistency
  - Firebase Auth handles password hashing, session management, and security
  - Storage provides automatic CDN distribution for images
  - Competitive pricing (generous free tier for MVP)
  - Supports offline-first architecture with local caching
- **Alternatives Considered:** Supabase, MongoDB Atlas
  - Why not chosen: Firebase provides tighter Angular integration, better real-time features, and simpler deployment
- **Installation:**
  ```bash
  npm install firebase@12.10.0
  ```

#### Firebase CLI
- **Version:** 15.7.0
- **Why chosen:**
  - Official Firebase deployment and management tool
  - Local emulator suite for development (firestore, auth, storage emulators)
  - Simple one-command deployment to Firebase Hosting
  - Manages environment configuration and secrets
- **Global Installation:**
  ```bash
  npm install -g firebase-tools@15.7.0

  # Verify installation
  firebase --version
  ```

---

### 2.4 Styling & CSS

#### Tailwind CSS
- **Version:** 4.1.0
- **Why chosen:**
  - Latest stable version with 5x faster builds than v3
  - Utility-first CSS reduces custom CSS by 90%
  - Smaller bundle size compared to Bootstrap or Material UI
  - Excellent dark mode support (built-in)
  - Responsive design utilities (@sm, @md, @lg breakpoints)
  - JIT (Just-In-Time) compilation generates only used styles
  - Exceptional TypeScript support and IDE autocomplete
  - Minimal configuration needed
  - Perfect for rapid prototyping and iteration
- **Why not Bootstrap or Material UI:** Tailwind's utility-first approach results in smaller CSS bundle; Material UI adds 300KB+ overhead
- **Installation:**
  ```bash
  npm install --save-dev tailwindcss@4.1.0 postcss@8.4.47 autoprefixer@10.4.20
  ```

#### @tailwindcss/typography
- **Version:** 0.5.19
- **Why chosen:**
  - Official typography plugin for Tailwind
  - Provides prose classes for rich text content (product descriptions)
  - Beautiful default typography without custom CSS
  - Full dark mode support
  - Responsive typography scaling
- **Installation:**
  ```bash
  npm install --save-dev @tailwindcss/typography@0.5.19
  ```

#### PostCSS
- **Version:** 8.4.47
- **Why chosen:**
  - CSS transformation tool that Tailwind requires
  - Processes Tailwind directives (@apply, @layer, etc.)
  - Autoprefixer plugin adds vendor prefixes automatically
  - Essential for CSS features to work in older browsers
- **Installation:** Included in Tailwind setup
  ```bash
  npm install --save-dev postcss@8.4.47
  ```

#### Autoprefixer
- **Version:** 10.4.20
- **Why chosen:**
  - Automatically adds vendor prefixes (-webkit-, -moz-, -ms-)
  - Ensures CSS compatibility with older browsers (IE11 if required)
  - Uses CanIUse database for accurate prefix generation
  - Zero configuration needed when used with PostCSS
- **Installation:** Included in Tailwind setup
  ```bash
  npm install --save-dev autoprefixer@10.4.20
  ```

---

## 3. Development Tools & Quality Assurance

### 3.1 Linting & Code Quality

#### ESLint
- **Version:** 9.15.0
- **Why chosen:**
  - Industry standard JavaScript/TypeScript linter
  - Catches logical errors, style inconsistencies, and suspicious patterns
  - Reduces code review time by enforcing standards automatically
  - Integrates seamlessly with Angular CLI and IDEs
  - Flat Config system (new v9 format) replaces .eslintrc
- **Installation:**
  ```bash
  npm install --save-dev eslint@9.15.0
  ```

#### ESLint Config for Prettier
- **Version:** 10.1.8
- **Why chosen:**
  - Disables ESLint rules that conflict with Prettier
  - Prevents formatting wars between linter and formatter
  - Recommended configuration by Prettier maintainers
- **Installation:**
  ```bash
  npm install --save-dev eslint-config-prettier@10.1.8
  ```

#### ESLint Plugin for Prettier
- **Version:** 5.5.5
- **Why chosen:**
  - Runs Prettier as an ESLint rule
  - Catches formatting issues during linting
  - Single tool integration for both linting and formatting
- **Installation:**
  ```bash
  npm install --save-dev eslint-plugin-prettier@5.5.5
  ```

#### Prettier
- **Version:** 4.0.0
- **Why chosen:**
  - Opinionated code formatter (ends formatting debates)
  - Supports TypeScript, HTML, CSS, JSON, YAML
  - Perfect formatting with zero configuration
  - Integrates with pre-commit hooks
  - Fast formatting speed
- **Installation:**
  ```bash
  npm install --save-dev prettier@4.0.0
  ```

### 3.2 Git Hooks & Commit Quality

#### Husky
- **Version:** 9.1.7
- **Why chosen:**
  - Git hooks made easy (prevents bad commits)
  - Runs linters before committing (catches issues early)
  - Runs tests before pushing (ensures quality)
  - Zero configuration for modern npm projects
  - All hook configs stored in .husky directory (version controlled)
- **Installation:**
  ```bash
  npm install --save-dev husky@9.1.7

  # Initialize Husky
  npx husky install
  ```

#### Lint-staged
- **Version:** 15.2.9
- **Why chosen:**
  - Runs linters only on staged files (faster feedback loop)
  - Prevents uncommitted errors from entering repository
  - Dramatically speeds up pre-commit hooks (only checks modified files)
  - Integrates perfectly with Husky
- **Installation:**
  ```bash
  npm install --save-dev lint-staged@15.2.9
  ```

### 3.3 Testing

#### Jest
- **Version:** 29.x (or latest compatible with jest-preset-angular)
- **Why chosen:**
  - Fast, parallel test execution
  - Simple API for unit testing utils, services, reducers
  - Excellent for pure functions and isolated logic
  - No browser required for most tests
- **Installation:**
  ```bash
  npm install --save-dev jest jest-preset-angular @types/jest jest-environment-jsdom jsdom
  ```

#### Angular Testing Library
- **Version:** 17+ (requires @testing-library/dom)
- **Why chosen:**
  - Tests component behavior the way users interact (queries by role, label, text)
  - Encourages accessible, semantic markup
  - Avoids implementation-detail coupling; refactors don't break tests
  - [Official docs](https://testing-library.com/docs/angular-testing-library/intro/)
- **Installation:**
  ```bash
  npm install --save-dev @testing-library/angular @testing-library/dom
  # Or: ng add @testing-library/angular
  ```

**Testing strategy:** Jest for utils, services, reducers; Angular Testing Library for component behavior. Use `data-testid` only as last resort. See **TESTING.md** for full guidance.

---

## 4. Project Scaffolding & Setup

### 4.1 Creating a New Musani Wear Project

#### Step 1: Create Angular Project
```bash
# Create new Angular 21 project with routing and CSS
ng new musani-wear --routing --style=css --skip-git

cd musani-wear
```

#### Step 2: Install Dependencies
```bash
# Install exact versions from this tech stack
npm install --save-exact @angular/core@21.2.0 @angular/common@21.2.0 @angular/router@21.2.0 @angular/forms@21.2.0 @angular/platform-browser@21.2.0
npm install --save-exact firebase@12.10.0 @angular/fire@20.0.1 rxjs@7.8.2 @ngrx/store@19 @ngrx/effects@19 @ngrx/store-devtools@19

# Install Tailwind CSS and dependencies
npm install --save-dev --save-exact tailwindcss@4.1.0 @tailwindcss/typography@0.5.19 postcss@8.4.47 autoprefixer@10.4.20

# Install dev tools
npm install --save-dev --save-exact eslint@9.15.0 eslint-config-prettier@10.1.8 eslint-plugin-prettier@5.5.5 prettier@4.0.0 husky@9.1.7 lint-staged@15.2.9 typescript@5.9.2

# Install testing tools (Jest + Angular Testing Library)
npm install --save-dev jest jest-preset-angular @types/jest jest-environment-jsdom jsdom @testing-library/angular @testing-library/dom
```

#### Step 3: Configure Tailwind CSS

Create `tailwind.config.ts` in project root:
```typescript
import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} satisfies Config;
```

Create `postcss.config.js` in project root:
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

Update `src/styles.css`:
```css
@import "tailwindcss";
```

#### Step 4: Initialize Git & Husky
```bash
git init
git add .
git commit -m "Initial commit"

# Initialize Husky hooks
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"
```

#### Step 5: Configure Lint-Staged

Create `.lintstagedrc.json`:
```json
{
  "*.ts": ["eslint --fix", "prettier --write"],
  "*.html": ["prettier --write"],
  "*.css": ["prettier --write"],
  "*.json": ["prettier --write"]
}
```

#### Step 6: Configure ESLint

Create `eslint.config.js` (flat config):
```javascript
const eslintPluginPrettier = require('eslint-plugin-prettier');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = [
  {
    ignores: [
      'node_modules',
      'dist',
      '.angular',
    ],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        project: 'tsconfig.json',
        ecmaVersion: 2024,
        sourceType: 'module',
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
      },
    },
    plugins: {
      prettier: eslintPluginPrettier,
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/explicit-member-accessibility': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'error',
    },
  },
  eslintConfigPrettier,
];
```

#### Step 7: Configure Prettier

Create `.prettierrc.json`:
```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

Create `.prettierignore`:
```
node_modules
dist
.angular
coverage
.git
```

#### Step 8: Initialize Firebase Project
```bash
# Install Firebase CLI globally
npm install -g firebase-tools@15.7.0

# Log in to Firebase
firebase login

# Initialize Firebase in your project
firebase init hosting

# When prompted:
# - Select your Firebase project
# - Set public directory to: dist/musani-wear/browser
# - Configure as single-page app: Yes
# - Set up automatic builds: No (we'll use npm scripts)
```

---

## 5. Firestore Data Structure

The database schema is designed for scalability and real-time updates:

### 5.1 Collections & Documents

#### `/products` Collection
```typescript
interface Product {
  id: string;                    // Document ID (auto-generated)
  name: string;                  // Product name (indexed)
  description: string;           // Detailed description
  price: number;                 // Price in INR (indexed)
  material: string;              // e.g., "Cotton", "Silk", "Linen"
  category: string;              // Category slug (indexed)
  colors: string[];              // Array of color hex codes: ["#ff0000", "#00ff00"]
  images: string[];              // Array of Firebase Storage URLs
  inStock: boolean;              // Stock status (indexed)
  createdAt: Timestamp;          // Creation timestamp
  updatedAt: Timestamp;          // Last update timestamp
}
```

Firestore Indexes:
- Composite index: `(category, inStock, price)` for filtered queries
- Simple indexes: `price`, `inStock` for sorting

#### `/categories` Collection
```typescript
interface Category {
  id: string;                    // Document ID (e.g., "summer-collection")
  name: string;                  // Display name
  slug: string;                  // URL-friendly slug
  order: number;                 // Display order in UI
  createdAt: Timestamp;          // Creation timestamp
}
```

#### `/settings` Collection
```typescript
interface AppSettings {
  id: string;                    // Document ID: "general"
  whatsappNumber: string;        // Format: "+91XXXXXXXXXX"
  storeName: string;
  storeDescription: string;
  contactEmail: string;
  instagramUrl?: string;
  updatedAt: Timestamp;
}
```

---

## 6. Environment Configuration

### 6.1 Firebase Configuration

Create `src/environments/environment.ts` for development:
```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'your-project.firebaseapp.com',
    projectId: 'your-project-id',
    storageBucket: 'your-project.appspot.com',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_APP_ID',
  },
};
```

Create `src/environments/environment.prod.ts` for production:
```typescript
export const environment = {
  production: true,
  firebase: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'your-project.firebaseapp.com',
    projectId: 'your-project-id',
    storageBucket: 'your-project.appspot.com',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_APP_ID',
  },
};
```

**Important:** Obtain these values from Firebase Console > Project Settings > General.

### 6.2 Angular Configuration

Update `angular.json` for Tailwind CSS support:
```json
{
  "projects": {
    "musani-wear": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "src/styles.css"
            ]
          }
        }
      }
    }
  }
}
```

---

## 7. NPM Scripts & CLI Commands

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "ng": "ng",
    "start": "ng serve --open",
    "dev": "ng serve",
    "build": "ng build",
    "build:prod": "ng build --configuration production",
    "watch": "ng build --watch --configuration development",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src --ext .ts,.html",
    "lint:fix": "eslint src --ext .ts,.html --fix",
    "format": "prettier --write \"src/**/*.{ts,html,css,json}\"",
    "format:check": "prettier --check \"src/**/*.{ts,html,css,json}\"",
    "type-check": "tsc --noEmit",
    "firebase:emulator": "firebase emulators:start",
    "firebase:deploy": "firebase deploy",
    "firebase:deploy:hosting": "npm run build:prod && firebase deploy --only hosting",
    "firebase:logs": "firebase functions:log",
    "precommit": "lint-staged",
    "prepare": "husky install"
  }
}
```

### 7.1 Common Development Commands

```bash
# Start development server (auto-opens browser at http://localhost:4200)
npm start

# Build for production
npm run build:prod

# Run linter and fix issues
npm run lint:fix

# Format code with Prettier
npm run format

# Type check without emitting code
npm run type-check

# Deploy to Firebase Hosting
npm run firebase:deploy:hosting

# Start Firebase Emulator Suite (local development)
npm run firebase:emulator
```

---

## 8. NgRx Store (State Management)

Musani Wear uses NgRx for predictable, centralized state management with Actions, Reducers, Effects, and Selectors.

### 8.1 NgRx Store Structure

```
src/app/store/
├── products/                    # Product feature state
│   ├── product.actions.ts       # Load, create, update, delete actions
│   ├── product.reducer.ts       # State transitions
│   ├── product.effects.ts      # Firestore API calls (async)
│   └── product.selectors.ts     # Derived state (products$, loading$, etc.)
├── categories/                  # Category feature state
│   ├── category.actions.ts
│   ├── category.reducer.ts
│   ├── category.effects.ts
│   └── category.selectors.ts
└── index.ts                     # ProvideStore configuration
```

### 8.2 Product Store Example

**Actions** (`product.actions.ts`):
```typescript
import { createAction, props } from '@ngrx/store';
import { Product, ProductFilter } from '../models';

export const loadProducts = createAction('[Products] Load', props<{ filter?: ProductFilter }>());
export const loadProductsSuccess = createAction('[Products] Load Success', props<{ products: Product[] }>());
export const loadProductsFailure = createAction('[Products] Load Failure', props<{ error: string }>());
export const selectProduct = createAction('[Products] Select', props<{ id: string }>());
```

**Reducer** (`product.reducer.ts`):
```typescript
import { createReducer, on } from '@ngrx/store';
import * as ProductActions from './product.actions';

export interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = { products: [], selectedProduct: null, loading: false, error: null };

export const productReducer = createReducer(
  initialState,
  on(ProductActions.loadProducts, state => ({ ...state, loading: true, error: null })),
  on(ProductActions.loadProductsSuccess, (state, { products }) => ({ ...state, products, loading: false })),
  on(ProductActions.loadProductsFailure, (state, { error }) => ({ ...state, error, loading: false }))
);
```

**Effects** (`product.effects.ts`):
```typescript
import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, of } from 'rxjs';
import { ProductService } from '../../services/product.service';
import * as ProductActions from './product.actions';

export const loadProducts$ = createEffect((actions$ = inject(Actions), productService = inject(ProductService)) =>
  actions$.pipe(
    ofType(ProductActions.loadProducts),
    switchMap(({ filter }) =>
      productService.getProducts(filter).pipe(
        map(products => ProductActions.loadProductsSuccess({ products })),
        catchError(err => of(ProductActions.loadProductsFailure({ error: err.message })))
      )
    )
  )
);
```

**Selectors** (`product.selectors.ts`):
```typescript
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductState } from './product.reducer';

export const selectProductState = createFeatureSelector<ProductState>('products');
export const selectProducts = createSelector(selectProductState, state => state.products);
export const selectLoading = createSelector(selectProductState, state => state.loading);
export const selectError = createSelector(selectProductState, state => state.error);
```

### 8.3 App Configuration

```typescript
// app.config.ts
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { productReducer } from './store/products/product.reducer';
import { ProductEffects } from './store/products/product.effects';

export const appConfig = {
  providers: [
    provideStore({ products: productReducer, categories: categoryReducer }),
    provideEffects(ProductEffects, CategoryEffects),
    provideStoreDevtools({ maxAge: 25 })
  ]
};
```

### 8.4 Why NgRx for Musani Wear

| Aspect | NgRx |
|--------|------|
| Predictability | Single source of truth, unidirectional data flow |
| DevTools | Time-travel debugging, state inspection |
| Testability | Pure reducers, isolated effects |
| Scalability | Feature-based state slices |
| Firebase Integration | Effects handle async Firestore calls cleanly |

---

## 9. Security Considerations

### 9.1 Firebase Security Rules

Set Firestore security rules in Firebase Console:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read for products (showcase)
    match /products/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Allow public read for categories
    match /categories/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Only admins can read/write settings
    match /settings/{document=**} {
      allow read, write: if isAdmin();
    }

    // Helper function
    function isAdmin() {
      return request.auth != null &&
             request.auth.uid in get(/databases/$(database)/documents/admins/users).data.uids;
    }
  }
}
```

### 9.2 Authentication

Enable Firebase Authentication in Console > Authentication > Sign-in method:
- Email/Password for admin login
- Disable public sign-up (invite-only)

### 9.3 Storage Security

Set Firebase Storage rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;  // Public read for product images
      allow write: if isAdmin();  // Admin upload only
    }

    function isAdmin() {
      return request.auth != null &&
             request.auth.token.admin == true;
    }
  }
}
```

### 9.4 CORS & API Security

Enable CORS in Firebase Hosting `firebase.json`:

```json
{
  "hosting": {
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=3600"
          }
        ]
      }
    ]
  }
}
```

### 9.5 TypeScript Strict Mode

Ensure `tsconfig.json` has strict mode enabled:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true
  }
}
```

---

## 10. Performance Budgets

### 10.1 Frontend Performance Targets

| Metric | Target | Tool |
|--------|--------|------|
| Initial Bundle Size (gzipped) | < 150KB | webpack-bundle-analyzer |
| Time to Interactive (TTI) | < 2.5 seconds | Lighthouse |
| First Contentful Paint (FCP) | < 1 second | Lighthouse |
| Largest Contentful Paint (LCP) | < 2 seconds | Lighthouse |
| Cumulative Layout Shift (CLS) | < 0.05 | Lighthouse |
| Lighthouse Performance Score | > 90 | Lighthouse |

### 10.2 Achieving Performance Targets

**Code Splitting:**
```typescript
// Lazy load admin module
const routes: Routes = [
  { path: '', component: ShopComponent },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [AdminGuard],
  },
];
```

**Image Optimization:**
- Use WebP format for product images (convert via Firebase Storage)
- Add height/width attributes to prevent layout shift
- Use lazy loading for below-the-fold images

**Bundle Analysis:**
```bash
ng build --stats-json
webpack-bundle-analyzer dist/musani-wear/browser/stats.json
```

---

## 11. Deployment & CI/CD

### 11.1 Firebase Hosting Deployment

#### Manual Deployment
```bash
# Build production bundle
npm run build:prod

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

#### Automated Deployment (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Build and Deploy to Firebase

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js 24
        uses: actions/setup-node@v4
        with:
          node-version: '24.14.0'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run type-check

      - name: Build production
        run: npm run build:prod

      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          channelId: live
          projectId: ${{ secrets.FIREBASE_PROJECT_ID }}
```

### 11.2 Environment-Specific Configurations

**Development:**
```bash
npm run dev
# Runs on http://localhost:4200 with hot reload
```

**Staging:**
```bash
firebase use staging
npm run build:prod
firebase deploy --only hosting
```

**Production:**
```bash
firebase use production
npm run build:prod
firebase deploy --only hosting
# Also deploy: firebase deploy (for functions, if added)
```

---

## 12. Browser & Platform Support

### 12.1 Supported Browsers

**Desktop:**
- Chrome 110+ (released Jan 2023 or later)
- Firefox 109+ (released Jan 2023 or later)
- Safari 16+ (macOS Monterey or later)
- Edge 110+ (Chromium-based)

**Mobile:**
- iOS Safari 15+ (iOS 15, 16, 17)
- Chrome Android (latest 2 versions)

**Not Supported:**
- Internet Explorer (all versions)
- Opera Mini
- UC Browser

### 12.2 Progressive Enhancement

**Core Functionality (no JavaScript):**
- Product listings are readable as semantic HTML
- Basic navigation works
- Links to WhatsApp are functional

**With JavaScript (Enhanced Experience):**
- Image gallery lightbox
- Real-time category filtering
- Add to wishlist (localStorage)
- Smooth animations
- Dark mode toggle (localStorage)

**Graceful Degradation:**
```typescript
// Example: Detect WebP support
export function supportsWebP(): boolean {
  const elem = document.createElement('canvas');
  return elem.toDataURL('image/webp') !== 'data:,';
}

// Use fallback image if WebP not supported
<img
  [src]="supportsWebP() ? product.imageWebP : product.imageJpg"
  alt="product"
/>
```

---

## 13. Version Upgrade Policy

### 13.1 Upgrade Schedule

**Security Patches (X.Y.Z):**
- **When:** Immediately upon CVE disclosure
- **Example:** Angular 21.2.0 → 21.2.1
- **Risk:** Minimal (backward compatible)
- **Process:** Direct upgrade without extensive testing

**Patch Versions (X.Y.0):**
- **When:** Monthly, after testing in development
- **Example:** Angular 21.1.0 → 21.2.0
- **Risk:** Low (new features, minor bug fixes)
- **Process:**
  1. Update locally: `npm update @angular/core@21.2.0`
  2. Run full test suite: `npm test`
  3. Deploy to staging
  4. Verify for 1 week
  5. Deploy to production

**Minor Versions (X.0.0):**
- **When:** Quarterly or when compelling feature needed
- **Example:** Angular 21 → Angular 22
- **Risk:** Medium (may include breaking changes)
- **Process:**
  1. Read full changelog
  2. Create feature branch: `git checkout -b upgrade/angular-22`
  3. Update: `npm install @angular/core@22.0.0 @angular/common@22.0.0 ...`
  4. Fix breaking changes (TypeScript will catch most)
  5. Full regression testing (unit + e2e + manual)
  6. Deploy to staging for 2 weeks
  7. Merge to main with release notes

### 13.2 Dependency Audit

**Weekly:**
```bash
npm audit
# Check for vulnerabilities
```

**Monthly:**
```bash
npm outdated
# Check for available updates
```

**Tool:** GitHub Dependabot (auto-creates PRs for security updates)

---

## 14. Debugging & Development

### 14.1 Local Development Setup

```bash
# Start both development server and Firebase emulator
npm run dev
# In another terminal:
npm run firebase:emulator
```

**Access:**
- App: http://localhost:4200
- Firestore Emulator UI: http://localhost:4000
- Storage Emulator: http://localhost:9199

### 14.2 VS Code Extensions (Recommended)

Install in VS Code:
- **Angular Language Service** - Component templates intellisense
- **ESLint** - Real-time linting
- **Prettier - Code formatter** - Format on save
- **Firebase Explorer** - Manage Firebase resources
- **Tailwind CSS IntelliSense** - Class name autocomplete
- **Thunder Client** or **REST Client** - API testing

### 14.3 Debugging in Browser

```typescript
// Add debugging in components
export class ProductListComponent {
  products$ = this.store.select(selectProducts);

  constructor(private store: Store) {
    // NgRx DevTools shows state changes automatically
    this.products$.subscribe((products) => {
      console.log('Products updated:', products);
    });
  }
}
```

Open Chrome DevTools:
- Console: View logs and errors
- Network: Monitor Firestore requests
- Application > Local Storage: View stored data
- Lighthouse: Run performance audit

---

## 15. Troubleshooting Common Issues

### Issue: Firebase Initialization Error
```typescript
// Error: App initialization failed
// Solution: Ensure environment config has correct Firebase credentials
```

### Issue: Firestore Queries Returning Empty
```typescript
// Solution: Check Firestore Security Rules
// Ensure user is authenticated and has read permission
```

### Issue: CORS Errors for Firebase Storage
```typescript
// Solution: Verify Firebase Storage rules allow public read
// Check Firebase Console > Storage > Rules
```

### Issue: Build Size Exceeds Budget
```bash
# Analyze bundle
ng build --stats-json
webpack-bundle-analyzer dist/musani-wear/browser/stats.json

# Tips:
# - Enable differential loading for modern browsers
# - Use route-level lazy loading
# - Remove unused dependencies
```

---

## 16. References & Resources

### Official Documentation
- [Angular Official Docs](https://angular.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [NgRx Docs](https://ngrx.io/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Community & Support
- [Angular Discord Community](https://discord.gg/angular)
- [Stack Overflow - Angular Tag](https://stackoverflow.com/questions/tagged/angular)
- [Firebase Community Slack](https://firebase.community/)

### Tools & Services
- [Firebase Console](https://console.firebase.google.com/)
- [Angular DevTools Extension](https://github.com/Angular-DevTools/angular-devtools)
- [Chrome Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

## 17. Dependency Lock Table

All exact versions for quick reference:

| Package | Version | Type | Purpose |
|---------|---------|------|---------|
| @angular/core | 21.2.0 | Framework | Core Angular framework |
| @angular/common | 21.2.0 | Framework | Common directives & pipes |
| @angular/router | 21.2.0 | Framework | Routing & navigation |
| @angular/forms | 21.2.0 | Framework | Reactive & template forms |
| @angular/platform-browser | 21.2.0 | Framework | Browser platform |
| @angular/fire | 20.0.1 | Integration | Firebase SDK wrapper |
| firebase | 12.10.0 | Backend | Firebase JavaScript SDK |
| rxjs | 7.8.2 | Core | Reactive programming (Angular/NgRx dependency) |
| @ngrx/store | 19.x | State | Centralized state management |
| @ngrx/effects | 19.x | State | Side effects (Firestore API calls) |
| @ngrx/store-devtools | 19.x | Dev | State debugging |
| tailwindcss | 4.1.0 | Styling | Utility CSS framework |
| @tailwindcss/typography | 0.5.19 | Styling | Typography plugin |
| postcss | 8.4.47 | Build | CSS transformation |
| autoprefixer | 10.4.20 | Build | Vendor prefix addition |
| typescript | 5.9.2 | Language | TypeScript compiler |
| @angular/cli | 21.2.0 | Build | Angular CLI tool |
| firebase-tools | 15.7.0 | Deploy | Firebase management CLI |
| eslint | 9.15.0 | Quality | JavaScript linter |
| prettier | 4.0.0 | Quality | Code formatter |
| husky | 9.1.7 | Quality | Git hooks |
| lint-staged | 15.2.9 | Quality | Pre-commit linting |
| eslint-config-prettier | 10.1.8 | Quality | ESLint-Prettier integration |
| eslint-plugin-prettier | 5.5.5 | Quality | Prettier ESLint plugin |
| jest | 29.x | Testing | Unit tests (utils, services, reducers) |
| jest-preset-angular | 16.x | Testing | Jest config for Angular |
| @testing-library/angular | 17+ | Testing | Component behavior tests |
| @testing-library/dom | 10+ | Testing | DOM queries (ATL dependency) |

---

## 18. Final Checklist for Production

Before deploying to production, verify:

- [ ] All environment variables configured in `.env` and Firebase Console
- [ ] TypeScript strict mode enabled and no errors
- [ ] All tests passing: `npm test`
- [ ] ESLint clean: `npm run lint`
- [ ] Lighthouse score > 90 for Performance
- [ ] Bundle size < 150KB gzipped
- [ ] Firebase Security Rules reviewed and tested
- [ ] CORS headers configured correctly
- [ ] Sentry/error tracking integrated (optional)
- [ ] Database backups enabled in Firebase Console
- [ ] SSL/TLS certificate auto-renewed (Firebase Hosting handles this)
- [ ] Custom domain configured (if using custom domain)
- [ ] Analytics/monitoring configured
- [ ] Team trained on deployment process
- [ ] Rollback plan documented

---

## Document Revision History

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-03-08 | 1.0.0 | Tech Lead | Initial creation, locked all versions for Angular 21 + Firebase |

---

**End of TECH_STACK.md**

This document is the source of truth for Musani Wear's technology stack. All exact versions are frozen to ensure reproducible environments across development, staging, and production. Questions or updates should be reviewed and documented in this file before implementation.
