# IMPLEMENTATION_PLAN.md - Musani Wear

**Project Name:** Musani Wear
**Project Type:** Dress boutique showcase website (no payment gateway)
**Tech Stack:** Angular 20+ | Tailwind CSS | Firebase (Firestore + Storage + Auth + Hosting) | NgRx Store
**Duration:** 10 days (6 phases)
**Team:** Solo developer or small team (full-stack focus)
**Document Version:** 1.0
**Last Updated:** 2026-03-08

---

## Table of Contents

1. [Overview](#overview)
2. [Phase Breakdown](#phase-breakdown)
3. [Detailed Phase Plans](#detailed-phase-plans)
4. [Feature Implementation Mapping](#feature-implementation-mapping)
5. [Success Criteria](#success-criteria)
6. [Risk Mitigation](#risk-mitigation)
7. [Weekly Milestones](#weekly-milestones)
8. [Post-MVP Roadmap](#post-mvp-roadmap)

---

## Overview

### Project Vision

Musani Wear is a serverless e-commerce showcase platform for a dress boutique. The platform enables customers to browse collections and submit inquiries via WhatsApp, while providing admin capabilities for product and inventory management through a protected Firebase-backed panel.

### Key Features

**Customer-Facing:**
- Responsive product showcase across Home, Shop, and Category pages
- Product detail view with image gallery and color selection
- WhatsApp ordering integration (no payment gateway)
- Floating WhatsApp contact button

**Admin Panel:**
- Secure authentication via Firebase
- Product management (CRUD operations)
- Category management
- Inventory status tracking
- Business settings configuration

### Technology Justification

| Technology | Rationale |
|-----------|-----------|
| Angular 20+ | Enterprise-grade framework, strong typing, built-in RxJS support |
| Tailwind CSS | Rapid UI development, responsive defaults, design consistency |
| Firebase | Serverless architecture (no backend maintenance), built-in auth, storage, and hosting |
| Firestore | Real-time document database, excellent for product catalogs, scalable |
| NgRx Store | Predictable state management with Actions, Reducers, Effects, Selectors |

### Assumptions & Constraints

- Solo developer or small team (prefer pair programming for knowledge sharing)
- No payment gateway required (WhatsApp-based ordering)
- Firebase free tier sufficient initially (may scale after launch)
- All product images hosted in Firebase Storage
- Admin users limited to 2-3 people initially
- Firestore security rules prevent public writes

---

## Phase Breakdown

### Dependency Graph

```
Phase 1: Foundation (Days 1-2)
    ↓
Phase 2: Firebase Services (Days 2-3)
    ↓
Phase 3: Admin Panel (Days 3-5)  ←→  Phase 4: Customer Pages (Days 5-8)
    ↓
Phase 5: Polish & Performance (Days 8-10)
    ↓
Phase 6: Deployment (Day 10)
```

**Critical Dependencies:**
- Phase 1 must complete before Phases 2, 3, 4
- Phase 2 must complete before Phases 3, 4
- Phase 3 and 4 can run in parallel (both depend on Phase 2)
- Phase 5 requires Phases 3 and 4 complete
- Phase 6 requires Phase 5 complete

### Timeline Overview

| Phase | Days | Focus | Team Size |
|-------|------|-------|-----------|
| 1: Foundation | 1-2 | Setup, Infrastructure | 1-2 devs |
| 2: Firebase Services | 2-3 | Backend Logic | 1 dev |
| 3: Admin Panel | 3-5 | Management UI | 1 dev |
| 4: Customer Pages | 5-8 | Showcase UI | 1 dev |
| 5: Polish & Performance | 8-10 | QA, Optimization | 1 dev |
| 6: Deployment | 10 | Production Launch | 1 dev |

**Total Development Time:** 10 days (assumes 8-hour work days)
**Recommended Schedule:** 2 weeks (including buffer time, testing, bug fixes)

---

## Detailed Phase Plans

### Phase 1: Project Setup & Foundation

**Duration:** Days 1-2 (5-8 hours)
**Goal:** Initialize Angular project with Firebase, Tailwind CSS, routing, and basic architecture
**Milestone Criteria:**
- [ ] Angular 20+ project runs locally
- [ ] Firebase Firestore, Auth, Storage connected
- [ ] Tailwind CSS configured and working
- [ ] Routing structure in place (public + admin protected)
- [ ] Base layout components (Navbar, Footer) built
- [ ] 4 default categories seeded in Firestore
- [ ] Auth Guard protecting admin routes
- [ ] All team members can run project locally

#### Task 1.1: Create Angular Project

**Subtasks:**

1.1.1 Create new Angular project
```bash
ng new musani-wear --routing --skip-git
cd musani-wear
```

1.1.2 Verify Angular version
```bash
ng version
# Should show Angular 20.x.x or higher
```

1.1.3 Create initial folder structure
```bash
# Run in src/app/
mkdir -p pages/{home,shop,category,product-detail,admin}
mkdir -p components/{shared,admin}
mkdir -p services
mkdir -p models
mkdir -p guards
mkdir -p store
mkdir -p utils
mkdir -p shared
```

1.1.3a **Component Architecture: Keep Components Dummy**

Most components should be **presentational (dummy)** – they receive data via `@Input()`, emit events via `@Output()`, and delegate logic to **utils** or **shared** methods. This makes testing easy:

- **Utils/shared** → Pure functions, test with Jest (no Angular needed)
- **Components** → Thin wrappers, test behavior with Angular Testing Library (minimal mocking)

| Component Type | Responsibility | Logic Location |
|----------------|----------------|----------------|
| **Dummy (most)** | Display data, call callbacks | Utils/shared for formatting, validation |
| **Smart (few)** | Fetch data, dispatch actions | Services, NgRx effects |

**Rule:** If a component has non-trivial logic (formatting, validation, URL building), move it to `utils/` or `shared/`.

1.1.4 Create .gitignore with sensitive patterns
```
node_modules/
dist/
.angular/
.firebase/
src/environments/environment.*.ts
!src/environments/environment.prod.ts
.DS_Store
*.log
```

**Time Estimate:** 20 minutes
**Blockers:** None

---

#### Task 1.1b: Create Utils & Shared Methods (for Easy Testing)

Create pure functions in `utils/` and `shared/` so components stay dummy and logic is testable with Jest.

**Utils** (`src/app/utils/`):

| File | Methods | Purpose |
|------|---------|---------|
| `format-price.ts` | `formatPrice(amount: number): string` | Format INR with ₹ and commas (e.g. ₹2,499) |
| `format-phone.ts` | `formatPhoneForWhatsApp(number: string): string` | Strip + for wa.me URL |
| `validate-whatsapp.ts` | `isValidWhatsAppNumber(num: string): boolean` | E.164 format check |
| `validate-email.ts` | `isValidEmail(email: string): boolean` | Email format validation |
| `validate-image.ts` | `validateImageFile(file: File): { valid: boolean; error?: string }` | Type, size checks |
| `build-whatsapp-message.ts` | `buildProductInquiryMessageText(product, color): string` | Pre-filled message text |
| `slugify.ts` | `slugify(text: string): string` | URL-friendly slug from name |

**Shared** (`src/app/shared/`):

| File | Contents | Purpose |
|------|-----------|---------|
| `constants.ts` | `MAX_IMAGE_SIZE_MB`, `ALLOWED_IMAGE_TYPES`, etc. | Reusable constants |
| `index.ts` | Re-exports from utils | Single import path |

**Example** (`utils/format-price.ts`):

```typescript
export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}
```

**Why:** Components call `formatPrice(product.price)` instead of inline logic. Jest tests `formatPrice` in isolation; component tests only verify it's displayed.

**Time Estimate:** 30 minutes
**Blockers:** None

---

#### Task 1.2: Install & Configure Tailwind CSS

**Subtasks:**

1.2.1 Install Tailwind via npm
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

1.2.2 Update `tailwind.config.js`
```javascript
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'gold': '#D4AF37',
        'cream': '#FFF8DC',
        'charcoal': '#2C2C2C',
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

1.2.3 Update `src/styles.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Global custom styles */
html {
  scroll-behavior: smooth;
}

body {
  @apply font-body text-gray-900;
}

h1, h2, h3, h4, h5, h6 {
  @apply font-display font-bold;
}

.btn-primary {
  @apply px-6 py-3 bg-gold text-charcoal font-semibold rounded hover:bg-opacity-90 transition;
}

.btn-secondary {
  @apply px-6 py-3 border-2 border-charcoal text-charcoal rounded hover:bg-charcoal hover:text-white transition;
}
```

1.2.4 Update `angular.json` to include Tailwind fonts
```json
"styles": [
  "src/styles.css",
  {
    "input": "node_modules/@fontsource/playfair-display/index.css"
  },
  {
    "input": "node_modules/@fontsource/inter/index.css"
  }
]
```

1.2.5 Install fonts
```bash
npm install @fontsource/playfair-display @fontsource/inter
```

**Time Estimate:** 30 minutes
**Blockers:** None

---

#### Task 1.3: Set Up Firebase Project

**Subtasks:**

1.3.1 Create Firebase project in console
- Go to https://console.firebase.google.com
- Click "Add project" → Name: "musani-wear"
- Disable Google Analytics initially (can enable later)
- Create project

1.3.2 Enable Firebase services
- Enable Firestore Database (start in test mode for development)
- Enable Authentication (Email/Password provider)
- Enable Cloud Storage
- Enable Hosting

1.3.3 Get Firebase config
- In Firebase Console, go to Project Settings
- Copy configuration object

1.3.4 Create environment files
```bash
# src/environments/environment.ts
export const environment = {
  production: false,
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "musani-wear-xxx.firebaseapp.com",
    projectId: "musani-wear-xxx",
    storageBucket: "musani-wear-xxx.appspot.com",
    messagingSenderId: "xxx",
    appId: "xxx",
  }
};

# src/environments/environment.prod.ts
export const environment = {
  production: true,
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "musani-wear-xxx.firebaseapp.com",
    projectId: "musani-wear-xxx",
    storageBucket: "musani-wear-xxx.appspot.com",
    messagingSenderId: "xxx",
    appId: "xxx",
  }
};
```

**Time Estimate:** 20 minutes
**Blockers:** Must have Firebase account (free tier works)

---

#### Task 1.4: Install & Configure AngularFire

**Subtasks:**

1.4.1 Install AngularFire and NgRx
```bash
npm install @angular/fire firebase @ngrx/store @ngrx/effects @ngrx/store-devtools
```

1.4.2 Update `app.config.ts` (or `app.module.ts` if using older Angular)
```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { environment } from './environments/environment';
import { routes } from './app.routes';
// Task 2.10: Add provideStore, provideEffects, provideStoreDevtools with NgRx reducers/effects

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ]
};
```

1.4.3 Test Firebase connection
- Add a simple log in a component to verify initialization
- Check browser console for Firebase initialization logs

**Time Estimate:** 15 minutes
**Blockers:** AngularFire version compatibility with Angular 20+

---

#### Task 1.5: Set Up Angular Router with Lazy-Loaded Modules

**Subtasks:**

1.5.1 Generate routing modules
```bash
ng generate module public --routing
ng generate module admin --routing
```

1.5.2 Create `app.routes.ts`
```typescript
import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./public/public.routes').then(m => m.PUBLIC_ROUTES),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },
  {
    path: '404',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
  {
    path: '**',
    redirectTo: '/404',
  },
];
```

1.5.3 Create `public.routes.ts`
```typescript
import { Routes } from '@angular/router';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'shop',
    loadComponent: () => import('../pages/shop/shop.component').then(m => m.ShopComponent),
  },
  {
    path: 'category/:slug',
    loadComponent: () => import('../pages/category/category.component').then(m => m.CategoryComponent),
  },
  {
    path: 'product/:id',
    loadComponent: () => import('../pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
  },
];
```

1.5.4 Create `admin.routes.ts`
```typescript
import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('../pages/admin/admin-login/admin-login.component').then(m => m.AdminLoginComponent),
  },
  {
    path: '',
    loadComponent: () => import('../pages/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
  },
  {
    path: 'products',
    loadComponent: () => import('../pages/admin/admin-products/admin-products.component').then(m => m.AdminProductsComponent),
  },
  {
    path: 'products/new',
    loadComponent: () => import('../pages/admin/admin-product-form/admin-product-form.component').then(m => m.AdminProductFormComponent),
  },
  {
    path: 'products/:id/edit',
    loadComponent: () => import('../pages/admin/admin-product-form/admin-product-form.component').then(m => m.AdminProductFormComponent),
  },
  {
    path: 'categories',
    loadComponent: () => import('../pages/admin/admin-categories/admin-categories.component').then(m => m.AdminCategoriesComponent),
  },
  {
    path: 'settings',
    loadComponent: () => import('../pages/admin/admin-settings/admin-settings.component').then(m => m.AdminSettingsComponent),
  },
];
```

**Time Estimate:** 30 minutes
**Blockers:** None (uses standard Angular routing)

---

#### Task 1.6: Create Auth Guard for Admin Routes

**Subtasks:**

1.6.1 Generate auth guard
```bash
ng generate guard guards/admin
```

1.6.2 Implement `admin.guard.ts`
```typescript
import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export const adminGuard: CanActivateFn = async (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(true);
      } else {
        router.navigate(['/admin/login']);
        resolve(false);
      }
    });
  });
};
```

**Time Estimate:** 20 minutes
**Blockers:** None

---

#### Task 1.7: Create Base Layout Components

**Subtasks:**

1.7.1 Generate Navbar component
```bash
ng generate component components/shared/navbar
```

1.7.2 Implement Navbar
```html
<!-- navbar.component.html -->
<nav class="bg-white shadow-sm sticky top-0 z-40">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-16">
      <!-- Logo -->
      <a routerLink="/" class="text-2xl font-display font-bold text-charcoal">
        Musani Wear
      </a>

      <!-- Navigation Links -->
      <div class="hidden md:flex space-x-8">
        <a routerLink="/" routerLinkActive="border-b-2 border-gold"
           [routerLinkActiveOptions]="{ exact: true }"
           class="text-gray-700 hover:text-gold transition">Home</a>
        <a routerLink="/shop" routerLinkActive="border-b-2 border-gold"
           class="text-gray-700 hover:text-gold transition">Shop</a>
      </div>

      <!-- Admin Link (if authenticated) -->
      <div *ngIf="isAdmin$ | async">
        <a routerLink="/admin" class="text-gray-700 hover:text-gold transition">Admin</a>
      </div>
    </div>
  </div>
</nav>
```

1.7.3 Implement Navbar component logic
```typescript
// navbar.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `<!-- navbar template from above -->`,
})
export class NavbarComponent {
  private authService = inject(AuthService);
  isAdmin$ = this.authService.isAuthenticated$;
}
```

1.7.4 Generate Footer component
```bash
ng generate component components/shared/footer
```

1.7.5 Implement Footer
```html
<!-- footer.component.html -->
<footer class="bg-charcoal text-white mt-20">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Brand -->
      <div>
        <h3 class="text-2xl font-display font-bold text-gold mb-4">Musani Wear</h3>
        <p class="text-gray-300">Exquisite dress collections for every occasion.</p>
      </div>

      <!-- Links -->
      <div>
        <h4 class="font-semibold mb-4">Quick Links</h4>
        <ul class="space-y-2">
          <li><a href="#" class="text-gray-300 hover:text-gold transition">Shop</a></li>
          <li><a href="#" class="text-gray-300 hover:text-gold transition">About</a></li>
          <li><a href="#" class="text-gray-300 hover:text-gold transition">Contact</a></li>
        </ul>
      </div>

      <!-- Contact -->
      <div>
        <h4 class="font-semibold mb-4">Contact</h4>
        <p class="text-gray-300 mb-4">Reach out on WhatsApp for inquiries</p>
        <a [href]="whatsappLink" target="_blank"
           class="inline-block px-4 py-2 bg-green-500 rounded hover:bg-green-600 transition">
          WhatsApp
        </a>
      </div>
    </div>

    <!-- Copyright -->
    <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
      <p>&copy; 2024 Musani Wear. All rights reserved.</p>
    </div>
  </div>
</footer>
```

**Time Estimate:** 40 minutes
**Blockers:** None

---

#### Task 1.8: Seed Default Categories in Firestore

**Subtasks:**

1.8.1 Create category seeding service
```bash
ng generate service services/seed
```

1.8.2 Implement seed service
```typescript
// seed.service.ts
import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, query, where, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SeedService {
  private firestore = inject(Firestore);

  async seedCategories() {
    const categoriesRef = collection(this.firestore, 'categories');
    const q = query(categoriesRef, where('name', '==', 'Stitched'));
    const existing = await getDocs(q);

    if (existing.empty) {
      const categories = [
        { name: 'New Arrivals', slug: 'new-arrivals', description: 'Latest collections', order: 1 },
        { name: 'Stitched', slug: 'stitched', description: 'Ready-to-wear', order: 2 },
        { name: 'Unstitched', slug: 'unstitched', description: 'Custom stitching available', order: 3 },
        { name: 'Luxe', slug: 'luxe', description: 'Premium collections', order: 4 },
      ];

      for (const cat of categories) {
        await addDoc(categoriesRef, cat);
      }
      console.log('Categories seeded successfully');
    }
  }
}
```

1.8.3 Call seed on app init
```typescript
// app.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { SeedService } from './services/seed.service';

export class AppComponent implements OnInit {
  private seedService = inject(SeedService);

  ngOnInit() {
    this.seedService.seedCategories();
  }
}
```

**Time Estimate:** 20 minutes
**Blockers:** None

---

#### Task 1.9: Create Project Documentation

**Subtasks:**

1.9.1 Create README.md
```markdown
# Musani Wear - Development Guide

## Prerequisites
- Node.js 18+ and npm
- Angular CLI 20+
- Firebase CLI
- Git

## Setup Instructions

1. Clone repository
\`\`\`bash
git clone <repo-url>
cd musani-wear
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Configure Firebase
- Copy \`src/environments/environment.example.ts\` to \`src/environments/environment.ts\`
- Add your Firebase config

4. Run development server
\`\`\`bash
ng serve
\`\`\`

5. Open browser to http://localhost:4200

## Folder Structure
\`\`\`
src/
├── app/
│   ├── pages/           # Page components (dummy where possible)
│   ├── components/      # Reusable presentational components
│   ├── services/        # Firebase services (data layer)
│   ├── models/          # TypeScript interfaces
│   ├── guards/          # Route guards
│   ├── store/           # NgRx state (actions, reducers, effects, selectors)
│   ├── utils/           # Pure functions (format, validate, parse) — easy Jest tests
│   └── shared/          # Shared constants, helpers used across components
├── environments/        # Firebase config
└── styles.css          # Global Tailwind styles
\`\`\`

## Available Scripts

- \`ng serve\` - Start dev server
- \`ng build\` - Build for development
- \`ng build --configuration production\` - Production build
- \`ng test\` - Run unit tests
- \`firebase deploy\` - Deploy to Firebase Hosting
\`\`\`

## Firebase Rules
Security rules for Firestore and Storage are defined in firebase.json and firestore.rules files.
\`\`\`
```

1.9.2 Create .env.example
```
# Firebase Configuration (add to src/environments/environment.ts)
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# WhatsApp Business Number
WHATSAPP_NUMBER=+1234567890
```

**Time Estimate:** 20 minutes
**Blockers:** None

---

#### Task 1.10: Configure Jest + Angular Testing Library

**Subtasks:**

1.10.1 Install testing dependencies
```bash
npm install --save-dev jest jest-preset-angular @types/jest jest-environment-jsdom jsdom @testing-library/angular @testing-library/dom
```

1.10.2 Create `jest.config.ts` and `setup-jest.ts` (see TESTING.md Section 2.2)

1.10.3 Update `package.json` scripts: `"test": "jest"`, `"test:watch": "jest --watch"`, `"test:coverage": "jest --coverage"`

1.10.4 Run `npm test` and verify Jest executes (even with zero tests)

**Testing order (always follow):** 1) Sort dependencies for the unit under test → 2) First render test passes → 3) Add tests one by one. See **TESTING.md** for full strategy.

**Time Estimate:** 30 minutes
**Blockers:** None

---

### Phase 1 Completion Checklist

- [ ] Angular 20+ project created and runs locally
- [ ] Tailwind CSS installed and configured
- [ ] Firebase project created and services enabled
- [ ] AngularFire installed and initialized
- [ ] Angular Router configured with lazy-loaded modules
- [ ] Auth Guard protecting /admin routes
- [ ] Navbar and Footer components created
- [ ] 4 default categories seeded in Firestore
- [ ] README and setup documentation complete
- [ ] All team members can clone and run project locally
- [ ] No console errors on app startup
- [ ] Jest + Angular Testing Library configured (TESTING.md)
- [ ] Git repo initialized with main branch protected

**Phase 1 Effort:** 5-8 hours
**Recommended Completion Time:** End of Day 2

---

### Phase 2: Firebase Services Layer

**Duration:** Days 2-3 (6-8 hours)
**Goal:** Build all backend service classes with full TypeScript interfaces and Firestore integration
**Milestone Criteria:**
- [ ] All TypeScript models/interfaces defined
- [ ] AuthService functional (login, logout, getCurrentUser)
- [ ] ProductService CRUD operations working
- [ ] CategoryService CRUD operations working
- [ ] ImageService upload/delete working
- [ ] SettingsService reading/updating WhatsApp number
- [ ] WhatsAppService generating correct URLs
- [ ] Firestore security rules configured
- [ ] Firebase Storage rules configured
- [ ] All services tested in isolation

#### Task 2.1: Define TypeScript Models/Interfaces

**Subtasks:**

2.1.1 Generate model files
```bash
ng generate interface models/Product
ng generate interface models/Category
ng generate interface models/AppSettings
ng generate interface models/User
```

2.1.2 Define Product interface
```typescript
// models/Product.ts
export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  material: string;
  category: string;
  categoryId: string;
  colors: Color[];
  images: string[];
  featured: boolean;
  available: boolean;
  createdAt: any;
  updatedAt: any;
}

export interface Color {
  name: string;
  hex: string;
}
```

2.1.3 Define Category interface
```typescript
// models/Category.ts
export interface Category {
  id?: string;
  name: string;
  slug: string;
  description: string;
  order: number;
  createdAt: any;
  updatedAt: any;
}
```

2.1.4 Define AppSettings interface
```typescript
// models/AppSettings.ts
export interface AppSettings {
  id: string;
  businessName: string;
  whatsappNumber: string;
  businessEmail: string;
  businessPhone: string;
  updatedAt: any;
}
```

2.1.5 Define User interface
```typescript
// models/User.ts
export interface User {
  uid: string;
  email: string;
  displayName?: string;
}
```

**Time Estimate:** 30 minutes
**Blockers:** None

---

#### Task 2.2: Implement Auth with NgRx Store

**Subtasks:**

2.2.1 Generate auth store files
```bash
mkdir -p src/app/store/auth
ng generate service services/auth
```

2.2.2 Create auth actions, reducer, effects, selectors (see TECH_STACK.md Section 8 for NgRx patterns). AuthService dispatches actions; AuthEffects handle Firebase Auth calls. Components select `selectCurrentUser` and `selectIsAuthenticated` from the store.

2.2.3 AuthService (dispatches to NgRx)
```typescript
// services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { loginRequested, logoutRequested } from '../store/auth/auth.actions';
import { selectCurrentUser, selectIsAuthenticated } from '../store/auth/auth.selectors';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private store = inject(Store);

  currentUser$ = this.store.select(selectCurrentUser);
  isAuthenticated$ = this.store.select(selectIsAuthenticated);

  login(email: string, password: string): void {
    this.store.dispatch(loginRequested({ email, password }));
  }

  logout(): void {
    this.store.dispatch(logoutRequested());
  }
}
```

**Note:** AuthEffects (in `store/auth/auth.effects.ts`) handle `loginRequested` and `logoutRequested` by calling Firebase `signInWithEmailAndPassword` and `signOut`, then dispatching success/failure actions. Use `onAuthStateChanged` in an effect to sync auth state to the store.

**Time Estimate:** 50 minutes
**Blockers:** None

---

#### Task 2.3: Implement ProductService

**Subtasks:**

2.3.1 Generate ProductService
```bash
ng generate service services/product
```

2.3.2 Implement ProductService
```typescript
// services/product.service.ts
import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Query,
  DocumentData,
} from '@angular/fire/firestore';
import { Product } from '../models/Product';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private firestore = inject(Firestore);
  private productsCollection = collection(this.firestore, 'products');

  // Get all products
  getAllProducts(): Observable<Product[]> {
    return from(getDocs(this.productsCollection)).pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Product));
      }),
      catchError(error => {
        console.error('Error fetching products:', error);
        return throwError(() => new Error('Failed to fetch products'));
      })
    );
  }

  // Get featured products
  getFeaturedProducts(): Observable<Product[]> {
    const q = query(
      this.productsCollection,
      where('featured', '==', true),
      where('available', '==', true),
      orderBy('createdAt', 'desc')
    );

    return from(getDocs(q)).pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Product));
      }),
      catchError(error => {
        console.error('Error fetching featured products:', error);
        return throwError(() => new Error('Failed to fetch featured products'));
      })
    );
  }

  // Get product by ID
  getProductById(id: string): Observable<Product | null> {
    const docRef = doc(this.firestore, 'products', id);
    return from(getDoc(docRef)).pipe(
      map(docSnap => {
        if (docSnap.exists()) {
          return {
            id: docSnap.id,
            ...docSnap.data(),
          } as Product;
        }
        return null;
      }),
      catchError(error => {
        console.error('Error fetching product:', error);
        return throwError(() => new Error('Failed to fetch product'));
      })
    );
  }

  // Get products by category
  getProductsByCategory(categoryId: string): Observable<Product[]> {
    const q = query(
      this.productsCollection,
      where('categoryId', '==', categoryId),
      orderBy('createdAt', 'desc')
    );

    return from(getDocs(q)).pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Product));
      }),
      catchError(error => {
        console.error('Error fetching products by category:', error);
        return throwError(() => new Error('Failed to fetch products'));
      })
    );
  }

  // Add new product
  async addProduct(product: Omit<Product, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(this.productsCollection, {
        ...product,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding product:', error);
      throw new Error('Failed to add product');
    }
  }

  // Update product
  async updateProduct(id: string, product: Partial<Product>): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'products', id);
      await updateDoc(docRef, {
        ...product,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error('Failed to update product');
    }
  }

  // Delete product
  async deleteProduct(id: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'products', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error('Failed to delete product');
    }
  }

  // Toggle product availability
  async toggleAvailability(id: string): Promise<void> {
    try {
      const product = await (await getDoc(doc(this.firestore, 'products', id))).data();
      if (product) {
        await this.updateProduct(id, { available: !product['available'] });
      }
    } catch (error) {
      console.error('Error toggling availability:', error);
      throw new Error('Failed to toggle availability');
    }
  }
}
```

**Time Estimate:** 60 minutes
**Blockers:** Firestore indexes may need to be created for queries with multiple where clauses

---

#### Task 2.4: Implement CategoryService

**Subtasks:**

2.4.1 Generate CategoryService
```bash
ng generate service services/category
```

2.4.2 Implement CategoryService
```typescript
// services/category.service.ts
// Pure Firestore service - state lives in NgRx store. CategoryEffects call this service.
import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
} from '@angular/fire/firestore';
import { Category } from '../models/Category';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private firestore = inject(Firestore);
  private categoriesCollection = collection(this.firestore, 'categories');

  // Get all categories - CategoryEffects calls this and dispatches to store
  getAllCategories(): Observable<Category[]> {
    const q = query(this.categoriesCollection, orderBy('order', 'asc'));
    return from(getDocs(q)).pipe(
      map(snapshot =>
        snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Category))
      ),
      catchError(error => {
        console.error('Error fetching categories:', error);
        return throwError(() => new Error('Failed to fetch categories'));
      })
    );
  }

  // Add new category
  async addCategory(category: Omit<Category, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(this.categoriesCollection, {
        ...category,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding category:', error);
      throw new Error('Failed to add category');
    }
  }

  // Update category - dispatch loadCategories after to refresh NgRx store
  async updateCategory(id: string, category: Partial<Category>): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'categories', id);
      await updateDoc(docRef, {
        ...category,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating category:', error);
      throw new Error('Failed to update category');
    }
  }

  // Delete category
  async deleteCategory(id: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'categories', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw new Error('Failed to delete category');
    }
  }
}
```

**Note:** Use NgRx selector `selectCategoryBySlug` (in category.selectors.ts) for getting a category by slug from store state. Components select `selectCategories` from the store.

**Time Estimate:** 40 minutes
**Blockers:** None

---

#### Task 2.5: Implement ImageService

**Subtasks:**

2.5.1 Install image compression library
```bash
npm install browser-image-compression
```

2.5.2 Generate ImageService
```bash
ng generate service services/image
```

2.5.3 Implement ImageService
```typescript
// services/image.service.ts
import { Injectable, inject } from '@angular/core';
import {
  Storage,
  ref,
  uploadBytes,
  deleteObject,
  getDownloadURL,
  StorageError,
} from '@angular/fire/storage';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import imageCompression from 'browser-image-compression';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private storage = inject(Storage);

  // Upload image to Firebase Storage
  uploadImage(file: File, path: string): Observable<string> {
    return from(this.compressAndUpload(file, path)).pipe(
      map(url => url),
      catchError(error => {
        console.error('Error uploading image:', error);
        return throwError(() => new Error('Failed to upload image'));
      })
    );
  }

  private async compressAndUpload(file: File, path: string): Promise<string> {
    try {
      // Compress image before upload
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);

      // Upload to Firebase
      const storageRef = ref(this.storage, path);
      const snapshot = await uploadBytes(storageRef, compressedFile);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      return downloadUrl;
    } catch (error) {
      throw error;
    }
  }

  // Delete image from Firebase Storage
  deleteImage(imagePath: string): Observable<void> {
    return from(deleteObject(ref(this.storage, imagePath))).pipe(
      catchError(error => {
        console.error('Error deleting image:', error);
        return throwError(() => new Error('Failed to delete image'));
      })
    );
  }

  // Get download URL for image
  getDownloadUrl(imagePath: string): Observable<string> {
    return from(getDownloadURL(ref(this.storage, imagePath))).pipe(
      catchError(error => {
        console.error('Error getting download URL:', error);
        return throwError(() => new Error('Failed to get image URL'));
      })
    );
  }
}
```

**Time Estimate:** 45 minutes
**Blockers:** None

---

#### Task 2.6: Implement SettingsService

**Subtasks:**

2.6.1 Generate SettingsService
```bash
ng generate service services/settings
```

2.6.2 Implement SettingsService
```typescript
// services/settings.service.ts
import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { AppSettings } from '../models/AppSettings';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private firestore = inject(Firestore);
  private settingsDoc = doc(this.firestore, 'settings', 'app');
  private settingsCache = new BehaviorSubject<AppSettings | null>(null);

  settings$ = this.settingsCache.asObservable();

  constructor() {
    this.loadSettings();
  }

  private loadSettings(): void {
    getDoc(this.settingsDoc).then(docSnap => {
      if (docSnap.exists()) {
        this.settingsCache.next(docSnap.data() as AppSettings);
      }
    });
  }

  // Get settings
  getSettings(): Observable<AppSettings | null> {
    return from(getDoc(this.settingsDoc)).pipe(
      map(docSnap => {
        if (docSnap.exists()) {
          const settings = docSnap.data() as AppSettings;
          this.settingsCache.next(settings);
          return settings;
        }
        return null;
      }),
      catchError(error => {
        console.error('Error fetching settings:', error);
        return [null];
      })
    );
  }

  // Get WhatsApp number
  getWhatsAppNumber(): Observable<string> {
    return this.settings$.pipe(
      map(settings => settings?.whatsappNumber || '')
    );
  }

  // Update settings
  async updateSettings(settings: Partial<AppSettings>): Promise<void> {
    try {
      await updateDoc(this.settingsDoc, {
        ...settings,
        updatedAt: new Date(),
      });
      this.loadSettings();
    } catch (error) {
      console.error('Error updating settings:', error);
      throw new Error('Failed to update settings');
    }
  }

  // Initialize settings (first time)
  async initializeSettings(settings: AppSettings): Promise<void> {
    try {
      await setDoc(this.settingsDoc, {
        ...settings,
        updatedAt: new Date(),
      });
      this.loadSettings();
    } catch (error) {
      console.error('Error initializing settings:', error);
      throw new Error('Failed to initialize settings');
    }
  }
}
```

**Time Estimate:** 30 minutes
**Blockers:** None

---

#### Task 2.7: Implement WhatsAppService

**Subtasks:**

2.7.1 Generate WhatsAppService
```bash
ng generate service services/whats-app
```

2.7.2 Implement WhatsAppService
```typescript
// services/whats-app.service.ts
import { Injectable, inject } from '@angular/core';
import { SettingsService } from './settings.service';
import { Product } from '../models/Product';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WhatsAppService {
  private settingsService = inject(SettingsService);

  // Generate WhatsApp inquiry URL for product
  generateProductInquiryUrl(product: Product, selectedColor?: string): Observable<string> {
    return this.settingsService.getWhatsAppNumber().pipe(
      map(number => {
        const colorText = selectedColor ? ` (${selectedColor})` : '';
        const message = `Hi, I'm interested in the "${product.name}"${colorText}. Price: $${product.price}. Can you provide more details?`;
        const encodedMessage = encodeURIComponent(message);
        const cleanNumber = number.replace(/\D/g, '');
        return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
      })
    );
  }

  // Generate WhatsApp URL for general inquiry
  generateGeneralInquiryUrl(message: string = 'Hi, I have a question about your products.'): Observable<string> {
    return this.settingsService.getWhatsAppNumber().pipe(
      map(number => {
        const encodedMessage = encodeURIComponent(message);
        const cleanNumber = number.replace(/\D/g, '');
        return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
      })
    );
  }

  // Open WhatsApp chat
  openChat(url: string): void {
    window.open(url, '_blank');
  }
}
```

**Time Estimate:** 30 minutes
**Blockers:** None

---

#### Task 2.8: Configure Firestore Security Rules

**Subtasks:**

2.8.1 Create firestore.rules file
```bash
touch firestore.rules
```

2.8.2 Implement Firestore security rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access to products, categories, settings
    match /products/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && isAdmin();
    }

    match /categories/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && isAdmin();
    }

    match /settings/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && isAdmin();
    }

    // Admin auth check function
    function isAdmin() {
      return request.auth.token.email == 'admin@musaniwear.com';
    }
  }
}
```

2.8.3 Deploy rules to Firebase
```bash
firebase deploy --only firestore:rules
```

**Time Estimate:** 20 minutes
**Blockers:** Requires Firebase admin access

---

#### Task 2.9: Configure Firebase Storage Security Rules

**Subtasks:**

2.9.1 Create storage.rules file
```bash
touch storage.rules
```

2.9.2 Implement Storage security rules
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null &&
                      request.auth.token.email == 'admin@musaniwear.com' &&
                      request.resource.size < 5 * 1024 * 1024; // 5MB max
    }
  }
}
```

2.9.3 Deploy rules to Firebase
```bash
firebase deploy --only storage
```

**Time Estimate:** 15 minutes
**Blockers:** Requires Firebase admin access

---

#### Task 2.10: Set Up NgRx Store (Products, Categories, Auth)

**Subtasks:**

2.10.1 Create store folder structure
```bash
mkdir -p src/app/store/products src/app/store/categories src/app/store/auth
```

2.10.2 Generate actions, reducers, effects, selectors for products, categories, and auth. Product effects call ProductService; category effects call CategoryService; auth effects call Firebase Auth. See TECH_STACK.md Section 8 for full NgRx patterns.

2.10.3 Update `app.config.ts` to add NgRx providers:
```typescript
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { productReducer } from './store/products/product.reducer';
import { categoryReducer } from './store/categories/category.reducer';
import { authReducer } from './store/auth/auth.reducer';
import { ProductEffects } from './store/products/product.effects';
import { CategoryEffects } from './store/categories/category.effects';
import { AuthEffects } from './store/auth/auth.effects';

// Add to providers array:
provideStore({ products: productReducer, categories: categoryReducer, auth: authReducer }),
provideEffects(ProductEffects, CategoryEffects, AuthEffects),
provideStoreDevtools({ maxAge: 25 }),
```

2.10.4 Components dispatch actions (e.g. `store.dispatch(loadProducts())`) and select state via selectors (e.g. `store.select(selectProducts)`).

**Time Estimate:** 60 minutes
**Blockers:** ProductService and CategoryService must exist first

---

### Phase 2 Completion Checklist

- [ ] All TypeScript models/interfaces defined and tested
- [ ] NgRx store configured (products, categories, auth)
- [ ] AuthService login/logout working via NgRx
- [ ] ProductService CRUD operations tested
- [ ] CategoryService CRUD operations tested
- [ ] ImageService upload/download working with compression
- [ ] SettingsService getting/updating settings
- [ ] WhatsAppService generating correct URLs
- [ ] Firestore security rules deployed
- [ ] Firebase Storage rules deployed
- [ ] No console errors when using services
- [ ] Services tested with real Firebase data
- [ ] Image compression working on upload
- [ ] Utils and services have Jest unit tests (TESTING.md)

**Phase 2 Effort:** 6-8 hours
**Recommended Completion Time:** End of Day 3

---

### Phase 3: Admin Panel

**Duration:** Days 3-5 (12-15 hours)
**Goal:** Build fully functional admin interface for product and category management
**Milestone Criteria:**
- [ ] Admin login page functional with Firebase auth
- [ ] Auth Guard protecting all /admin routes
- [ ] Admin Dashboard with stats cards
- [ ] Admin Products List with full CRUD
- [ ] Product add/edit form with image upload
- [ ] Categories management page
- [ ] Settings page with WhatsApp config
- [ ] All forms validated and error handling
- [ ] Loading states and spinners
- [ ] Delete confirmation dialogs

#### Admin Panel Component Structure

```
admin/
├── admin-login/
├── admin-dashboard/
├── admin-layout/
├── admin-products/
├── admin-product-form/
├── admin-categories/
├── admin-settings/
└── components/
    ├── product-image-upload/
    ├── color-picker/
    ├── delete-confirmation-modal/
    └── stats-card/
```

#### Task 3.1: Admin Login Page

**Subtasks:**

3.1.1 Generate login component
```bash
ng generate component pages/admin/admin-login
```

3.1.2 Implement login template
```html
<div class="min-h-screen bg-gray-100 flex items-center justify-center">
  <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
    <h1 class="text-3xl font-display font-bold text-charcoal mb-6">Admin Login</h1>

    <form [formGroup]="form" (ngSubmit)="onLogin()">
      <!-- Email -->
      <div class="mb-4">
        <label class="block text-gray-700 font-semibold mb-2">Email</label>
        <input
          type="email"
          formControlName="email"
          class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-gold"
        />
        <p *ngIf="form.get('email')?.invalid && form.get('email')?.touched"
           class="text-red-500 text-sm mt-1">
          Invalid email
        </p>
      </div>

      <!-- Password -->
      <div class="mb-6">
        <label class="block text-gray-700 font-semibold mb-2">Password</label>
        <input
          type="password"
          formControlName="password"
          class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-gold"
        />
        <p *ngIf="form.get('password')?.invalid && form.get('password')?.touched"
           class="text-red-500 text-sm mt-1">
          Password required
        </p>
      </div>

      <!-- Error Message -->
      <p *ngIf="errorMessage" class="text-red-500 text-sm mb-4">{{ errorMessage }}</p>

      <!-- Loading State -->
      <button
        type="submit"
        [disabled]="form.invalid || loading"
        class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
    </form>
  </div>
</div>
```

3.1.3 Implement login component logic
```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-login.component.html',
})
export class AdminLoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  loading = false;
  errorMessage = '';

  async onLogin() {
    if (this.form.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    try {
      const { email, password } = this.form.value;
      await this.authService.login(email!, password!);
      this.router.navigate(['/admin']);
    } catch (error: any) {
      this.errorMessage = error.message || 'Login failed';
    } finally {
      this.loading = false;
    }
  }
}
```

**Time Estimate:** 45 minutes
**Blockers:** None

---

#### Task 3.2: Admin Dashboard

**Subtasks:**

3.2.1 Generate dashboard component
```bash
ng generate component pages/admin/admin-dashboard
```

3.2.2 Implement dashboard with stats cards
```html
<div class="p-6">
  <h1 class="text-3xl font-display font-bold mb-8">Admin Dashboard</h1>

  <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    <!-- Total Products -->
    <app-stats-card
      [label]="'Total Products'"
      [value]="(totalProducts$ | async) || 0"
      [icon]="'📦'"
    ></app-stats-card>

    <!-- In Stock -->
    <app-stats-card
      [label]="'In Stock'"
      [value]="(inStock$ | async) || 0"
      [icon]="'✓'"
    ></app-stats-card>

    <!-- Out of Stock -->
    <app-stats-card
      [label]="'Out of Stock'"
      [value]="(outOfStock$ | async) || 0"
      [icon]="'✗'"
    ></app-stats-card>

    <!-- Categories -->
    <app-stats-card
      [label]="'Categories'"
      [value]="(totalCategories$ | async) || 0"
      [icon]="'📋'"
    ></app-stats-card>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Quick Actions -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-xl font-semibold mb-4">Quick Actions</h2>
      <div class="space-y-2">
        <button
          routerLink="/admin/products/new"
          class="w-full btn-primary text-left"
        >
          Add New Product
        </button>
        <button
          routerLink="/admin/categories"
          class="w-full btn-secondary text-left"
        >
          Manage Categories
        </button>
        <button
          routerLink="/admin/settings"
          class="w-full btn-secondary text-left"
        >
          Business Settings
        </button>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-xl font-semibold mb-4">Recent Products</h2>
      <div *ngIf="(recentProducts$ | async) as products" class="space-y-2">
        <div *ngFor="let product of products.slice(0, 5)" class="text-sm">
          <p class="font-semibold">{{ product.name }}</p>
          <p class="text-gray-500">${{ product.price }}</p>
        </div>
      </div>
    </div>
  </div>
</div>
```

3.2.3 Implement dashboard component logic
```typescript
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Observable, map } from 'rxjs';
import { Product } from '../../../models/Product';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  totalProducts$!: Observable<number>;
  inStock$!: Observable<number>;
  outOfStock$!: Observable<number>;
  totalCategories$!: Observable<number>;
  recentProducts$!: Observable<Product[]>;

  ngOnInit() {
    const products$ = this.productService.getAllProducts();

    this.totalProducts$ = products$.pipe(map(p => p.length));
    this.inStock$ = products$.pipe(
      map(p => p.filter(prod => prod.available).length)
    );
    this.outOfStock$ = products$.pipe(
      map(p => p.filter(prod => !prod.available).length)
    );
    this.totalCategories$ = this.categoryService.getAllCategories().pipe(
      map(c => c.length)
    );
    this.recentProducts$ = products$.pipe(
      map(p => p.sort((a, b) => b.createdAt - a.createdAt))
    );
  }
}
```

**Time Estimate:** 45 minutes
**Blockers:** Stats card component must be created

---

#### Task 3.3: Admin Products List

**Subtasks:**

3.3.1 Generate products list component
```bash
ng generate component pages/admin/admin-products
```

3.3.2 Implement products list with table
```html
<div class="p-6">
  <div class="flex justify-between items-center mb-8">
    <h1 class="text-3xl font-display font-bold">Products</h1>
    <a routerLink="/admin/products/new" class="btn-primary">Add Product</a>
  </div>

  <div class="bg-white rounded-lg shadow overflow-hidden">
    <table class="w-full">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-sm font-semibold">Image</th>
          <th class="px-6 py-3 text-left text-sm font-semibold">Name</th>
          <th class="px-6 py-3 text-left text-sm font-semibold">Category</th>
          <th class="px-6 py-3 text-left text-sm font-semibold">Price</th>
          <th class="px-6 py-3 text-left text-sm font-semibold">Status</th>
          <th class="px-6 py-3 text-left text-sm font-semibold">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let product of (products$ | async)" class="border-t hover:bg-gray-50">
          <td class="px-6 py-4">
            <img
              *ngIf="product.images.length"
              [src]="product.images[0]"
              alt="{{ product.name }}"
              class="h-12 w-12 object-cover rounded"
            />
          </td>
          <td class="px-6 py-4 font-semibold">{{ product.name }}</td>
          <td class="px-6 py-4">{{ getCategoryName(product.categoryId) }}</td>
          <td class="px-6 py-4">${{ product.price }}</td>
          <td class="px-6 py-4">
            <span
              [class]="product.available ? 'text-green-600' : 'text-red-600'"
              class="font-semibold"
            >
              {{ product.available ? 'In Stock' : 'Out of Stock' }}
            </span>
          </td>
          <td class="px-6 py-4 space-x-2">
            <a
              [routerLink]="['/admin/products', product.id, 'edit']"
              class="text-gold hover:underline"
            >
              Edit
            </a>
            <button
              (click)="deleteProduct(product.id!)"
              class="text-red-600 hover:underline"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

3.3.3 Implement products list component logic
```typescript
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Observable } from 'rxjs';
import { Product } from '../../../models/Product';
import { Category } from '../../../models/Category';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-products.component.html',
})
export class AdminProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  products$!: Observable<Product[]>;
  categories: Category[] = [];

  ngOnInit() {
    this.products$ = this.productService.getAllProducts();
    this.categoryService.categories$.subscribe(cats => {
      this.categories = cats;
    });
  }

  getCategoryName(categoryId: string): string {
    return this.categories.find(c => c.id === categoryId)?.name || 'Unknown';
  }

  async deleteProduct(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await this.productService.deleteProduct(id);
      } catch (error) {
        alert('Failed to delete product');
      }
    }
  }
}
```

**Time Estimate:** 1 hour
**Blockers:** None

---

#### Task 3.4: Admin Product Form

**Subtasks:**

3.4.1 Generate product form component
```bash
ng generate component pages/admin/admin-product-form
```

3.4.2 Implement product form with image upload
```html
<div class="p-6">
  <h1 class="text-3xl font-display font-bold mb-8">
    {{ isEditMode ? 'Edit Product' : 'Add Product' }}
  </h1>

  <form [formGroup]="form" (ngSubmit)="onSubmit()" class="bg-white p-6 rounded-lg shadow">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Product Name -->
      <div>
        <label class="block font-semibold mb-2">Product Name</label>
        <input
          type="text"
          formControlName="name"
          class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-gold"
        />
      </div>

      <!-- Price -->
      <div>
        <label class="block font-semibold mb-2">Price ($)</label>
        <input
          type="number"
          formControlName="price"
          step="0.01"
          class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-gold"
        />
      </div>

      <!-- Category -->
      <div>
        <label class="block font-semibold mb-2">Category</label>
        <select
          formControlName="categoryId"
          class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-gold"
        >
          <option value="">Select Category</option>
          <option *ngFor="let cat of (categories$ | async)" [value]="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <!-- Material -->
      <div>
        <label class="block font-semibold mb-2">Material</label>
        <input
          type="text"
          formControlName="material"
          placeholder="e.g., Cotton, Silk, Polyester"
          class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-gold"
        />
      </div>
    </div>

    <!-- Description -->
    <div class="mt-6">
      <label class="block font-semibold mb-2">Description</label>
      <textarea
        formControlName="description"
        rows="4"
        class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-gold"
      ></textarea>
    </div>

    <!-- Colors -->
    <div class="mt-6">
      <label class="block font-semibold mb-4">Colors</label>
      <div formArrayName="colors" class="space-y-2">
        <div
          *ngFor="let colorGroup of colorsFormArray.controls; let i = index"
          [formGroupName]="i"
          class="flex gap-2 items-end"
        >
          <input
            type="text"
            formControlName="name"
            placeholder="Color name"
            class="flex-1 px-4 py-2 border border-gray-300 rounded"
          />
          <input
            type="color"
            formControlName="hex"
            class="h-10 w-20 border border-gray-300 rounded cursor-pointer"
          />
          <button
            type="button"
            (click)="removeColor(i)"
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Remove
          </button>
        </div>
      </div>
      <button
        type="button"
        (click)="addColor()"
        class="mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
      >
        Add Color
      </button>
    </div>

    <!-- Images Upload -->
    <div class="mt-6">
      <label class="block font-semibold mb-4">Product Images</label>
      <app-product-image-upload
        (imagesAdded)="onImagesAdded($event)"
        [existingImages]="existingImages"
      ></app-product-image-upload>
    </div>

    <!-- Availability & Featured -->
    <div class="mt-6 flex gap-6">
      <label class="flex items-center">
        <input type="checkbox" formControlName="available" class="mr-2" />
        <span>Available</span>
      </label>
      <label class="flex items-center">
        <input type="checkbox" formControlName="featured" class="mr-2" />
        <span>Featured Product</span>
      </label>
    </div>

    <!-- Submit -->
    <div class="mt-8 flex gap-4">
      <button type="submit" [disabled]="form.invalid || loading" class="btn-primary">
        {{ loading ? 'Saving...' : 'Save Product' }}
      </button>
      <a routerLink="/admin/products" class="btn-secondary">Cancel</a>
    </div>
  </form>
</div>
```

3.4.3 Implement product form component logic
```typescript
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Product, Color } from '../../../models/Product';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-product-form.component.html',
})
export class AdminProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  form = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    material: ['', Validators.required],
    categoryId: ['', Validators.required],
    colors: this.fb.array([]),
    available: [true],
    featured: [false],
  });

  categories$!: Observable<any[]>;
  loading = false;
  isEditMode = false;
  existingImages: string[] = [];
  newImages: File[] = [];
  productId?: string;

  ngOnInit() {
    this.categories$ = this.categoryService.getAllCategories();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = params['id'];
        this.loadProduct();
      }
    });
  }

  get colorsFormArray(): FormArray {
    return this.form.get('colors') as FormArray;
  }

  private loadProduct() {
    if (!this.productId) return;
    this.productService.getProductById(this.productId).subscribe(product => {
      if (product) {
        this.form.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          material: product.material,
          categoryId: product.categoryId,
          available: product.available,
          featured: product.featured,
        });

        product.colors.forEach(color => {
          this.colorsFormArray.push(
            this.fb.group({
              name: [color.name],
              hex: [color.hex],
            })
          );
        });

        this.existingImages = product.images;
      }
    });
  }

  addColor() {
    this.colorsFormArray.push(
      this.fb.group({
        name: [''],
        hex: ['#000000'],
      })
    );
  }

  removeColor(index: number) {
    this.colorsFormArray.removeAt(index);
  }

  onImagesAdded(files: File[]) {
    this.newImages = files;
  }

  async onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    try {
      const formValue = this.form.value;
      const product: Omit<Product, 'id'> = {
        name: formValue.name!,
        description: formValue.description!,
        price: formValue.price!,
        material: formValue.material!,
        categoryId: formValue.categoryId!,
        category: '', // will be populated by service
        colors: formValue.colors as Color[],
        images: this.existingImages,
        available: formValue.available!,
        featured: formValue.featured!,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (this.isEditMode && this.productId) {
        await this.productService.updateProduct(this.productId, product);
      } else {
        await this.productService.addProduct(product);
      }

      this.router.navigate(['/admin/products']);
    } catch (error) {
      alert('Failed to save product');
    } finally {
      this.loading = false;
    }
  }
}
```

**Time Estimate:** 2 hours
**Blockers:** Image upload component must be created

---

#### Task 3.5: Admin Categories

**Subtasks:**

3.5.1 Generate categories component
```bash
ng generate component pages/admin/admin-categories
```

3.5.2 Implement categories management
```html
<div class="p-6">
  <div class="flex justify-between items-center mb-8">
    <h1 class="text-3xl font-display font-bold">Categories</h1>
    <button (click)="showCategoryForm = true" class="btn-primary">Add Category</button>
  </div>

  <!-- Category List -->
  <div class="bg-white rounded-lg shadow">
    <table class="w-full">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left font-semibold">Name</th>
          <th class="px-6 py-3 text-left font-semibold">Slug</th>
          <th class="px-6 py-3 text-left font-semibold">Description</th>
          <th class="px-6 py-3 text-left font-semibold">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let cat of (categories$ | async)" class="border-t hover:bg-gray-50">
          <td class="px-6 py-4 font-semibold">{{ cat.name }}</td>
          <td class="px-6 py-4">{{ cat.slug }}</td>
          <td class="px-6 py-4">{{ cat.description }}</td>
          <td class="px-6 py-4 space-x-2">
            <button (click)="editCategory(cat)" class="text-gold hover:underline">
              Edit
            </button>
            <button (click)="deleteCategory(cat.id)" class="text-red-600 hover:underline">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Category Form Modal -->
  <div *ngIf="showCategoryForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-bold mb-4">{{ editingCategory ? 'Edit' : 'Add' }} Category</h2>

      <form [formGroup]="categoryForm" (ngSubmit)="saveCategory()">
        <div class="mb-4">
          <label class="block font-semibold mb-2">Name</label>
          <input
            type="text"
            formControlName="name"
            class="w-full px-4 py-2 border border-gray-300 rounded"
          />
        </div>

        <div class="mb-4">
          <label class="block font-semibold mb-2">Slug</label>
          <input
            type="text"
            formControlName="slug"
            class="w-full px-4 py-2 border border-gray-300 rounded"
          />
        </div>

        <div class="mb-4">
          <label class="block font-semibold mb-2">Description</label>
          <textarea
            formControlName="description"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded"
          ></textarea>
        </div>

        <div class="flex gap-2">
          <button type="submit" class="flex-1 btn-primary">Save</button>
          <button type="button" (click)="showCategoryForm = false" class="flex-1 btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
```

3.5.3 Implement categories component logic
```typescript
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { Observable } from 'rxjs';
import { Category } from '../../../models/Category';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-categories.component.html',
})
export class AdminCategoriesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);

  categories$!: Observable<Category[]>;
  categoryForm = this.fb.group({
    name: ['', Validators.required],
    slug: ['', Validators.required],
    description: [''],
    order: [0],
  });

  showCategoryForm = false;
  editingCategory: Category | null = null;

  ngOnInit() {
    this.categories$ = this.categoryService.getAllCategories();
  }

  editCategory(category: Category) {
    this.editingCategory = category;
    this.categoryForm.patchValue(category);
    this.showCategoryForm = true;
  }

  async saveCategory() {
    if (this.categoryForm.invalid) return;

    try {
      if (this.editingCategory) {
        await this.categoryService.updateCategory(this.editingCategory.id!, this.categoryForm.value as any);
      } else {
        await this.categoryService.addCategory(this.categoryForm.value as any);
      }
      this.showCategoryForm = false;
      this.categoryForm.reset();
      this.editingCategory = null;
    } catch (error) {
      alert('Failed to save category');
    }
  }

  async deleteCategory(id: string) {
    if (confirm('Are you sure?')) {
      try {
        await this.categoryService.deleteCategory(id);
      } catch (error) {
        alert('Failed to delete category');
      }
    }
  }
}
```

**Time Estimate:** 1.5 hours
**Blockers:** None

---

#### Task 3.6: Admin Settings

**Subtasks:**

3.6.1 Generate settings component
```bash
ng generate component pages/admin/admin-settings
```

3.6.2 Implement settings form
```html
<div class="p-6">
  <h1 class="text-3xl font-display font-bold mb-8">Business Settings</h1>

  <form [formGroup]="form" (ngSubmit)="onSave()" class="bg-white p-6 rounded-lg shadow max-w-2xl">
    <div class="mb-6">
      <label class="block font-semibold mb-2">Business Name</label>
      <input
        type="text"
        formControlName="businessName"
        class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-gold"
      />
    </div>

    <div class="mb-6">
      <label class="block font-semibold mb-2">WhatsApp Number</label>
      <input
        type="tel"
        formControlName="whatsappNumber"
        placeholder="+1234567890"
        class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-gold"
      />
      <p class="text-sm text-gray-500 mt-2">Include country code (e.g., +1 for US)</p>
    </div>

    <div class="mb-6">
      <label class="block font-semibold mb-2">Business Email</label>
      <input
        type="email"
        formControlName="businessEmail"
        class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-gold"
      />
    </div>

    <div class="mb-6">
      <label class="block font-semibold mb-2">Business Phone</label>
      <input
        type="tel"
        formControlName="businessPhone"
        class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-gold"
      />
    </div>

    <button type="submit" [disabled]="loading" class="btn-primary">
      {{ loading ? 'Saving...' : 'Save Settings' }}
    </button>
  </form>
</div>
```

3.6.3 Implement settings component logic
```typescript
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-settings.component.html',
})
export class AdminSettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private settingsService = inject(SettingsService);

  form = this.fb.group({
    businessName: ['', Validators.required],
    whatsappNumber: ['', Validators.required],
    businessEmail: ['', [Validators.required, Validators.email]],
    businessPhone: ['', Validators.required],
  });

  loading = false;

  ngOnInit() {
    this.settingsService.settings$.subscribe(settings => {
      if (settings) {
        this.form.patchValue(settings);
      }
    });
  }

  async onSave() {
    if (this.form.invalid) return;

    this.loading = true;
    try {
      await this.settingsService.updateSettings(this.form.value as any);
      alert('Settings saved successfully');
    } catch (error) {
      alert('Failed to save settings');
    } finally {
      this.loading = false;
    }
  }
}
```

**Time Estimate:** 1 hour
**Blockers:** None

---

### Phase 3 Completion Checklist

- [ ] Admin login page fully functional
- [ ] Auth guard protecting all /admin routes
- [ ] Dashboard with stats cards working
- [ ] Products list table displaying all products
- [ ] Product add form with all fields working
- [ ] Product edit form pre-populating data correctly
- [ ] Product delete with confirmation
- [ ] Image upload with preview and removal
- [ ] Categories CRUD operations working
- [ ] Settings page saving to Firestore
- [ ] All forms have validation
- [ ] Loading states on all async operations
- [ ] Error messages displaying properly
- [ ] Admin components have Angular Testing Library behavior tests (TESTING.md)

**Phase 3 Effort:** 12-15 hours
**Recommended Completion Time:** End of Day 5

---

### Phase 4: Customer-Facing Pages

**Duration:** Days 5-8 (15-20 hours)
**Goal:** Build beautiful, responsive showcase website for customers
**Milestone Criteria:**
- [ ] Home page with hero, featured products, categories
- [ ] Shop page with grid of all products
- [ ] Category page with filtered products
- [ ] Product detail page with gallery and WhatsApp button
- [ ] All pages fully responsive
- [ ] Floating WhatsApp button
- [ ] Loading states and error handling
- [ ] No console errors

#### Task 4.1: Home Page

**Subtasks:**

4.1.1 Generate home component
```bash
ng generate component pages/home
```

4.1.2 Implement home page
```html
<!-- Hero Section -->
<section class="bg-gradient-to-r from-charcoal to-gray-800 text-white py-20">
  <div class="max-w-7xl mx-auto px-4 text-center">
    <h1 class="text-5xl font-display font-bold mb-4">Musani Wear</h1>
    <p class="text-xl text-gray-300 mb-8">Exquisite dress collections for every occasion</p>
    <a routerLink="/shop" class="inline-block px-8 py-3 bg-gold text-charcoal font-bold rounded hover:bg-opacity-90 transition">
      Shop Now
    </a>
  </div>
</section>

<!-- Featured Products -->
<section class="py-20 bg-white">
  <div class="max-w-7xl mx-auto px-4">
    <h2 class="text-4xl font-display font-bold text-center mb-12">Featured Collections</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <app-product-card
        *ngFor="let product of (featuredProducts$ | async)"
        [product]="product"
      ></app-product-card>
    </div>
  </div>
</section>

<!-- Categories Showcase -->
<section class="py-20 bg-cream">
  <div class="max-w-7xl mx-auto px-4">
    <h2 class="text-4xl font-display font-bold text-center mb-12">Collections</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <a
        *ngFor="let category of (categories$ | async)"
        [routerLink]="['/category', category.slug]"
        class="group relative overflow-hidden rounded-lg shadow hover:shadow-lg transition"
      >
        <div class="bg-gradient-to-br from-gold to-yellow-500 h-48 flex items-center justify-center">
          <div class="text-center text-charcoal">
            <p class="text-3xl font-bold">{{ category.name }}</p>
            <p class="text-sm mt-2">{{ category.description }}</p>
          </div>
        </div>
      </a>
    </div>
  </div>
</section>

<!-- Call to Action -->
<section class="bg-charcoal text-white py-20">
  <div class="max-w-2xl mx-auto text-center">
    <h2 class="text-3xl font-display font-bold mb-4">Have Questions?</h2>
    <p class="mb-8">Reach out to us on WhatsApp for personalized recommendations</p>
    <a [href]="whatsappUrl$ | async" target="_blank" class="inline-block px-8 py-3 bg-green-500 rounded hover:bg-green-600 transition font-bold">
      Chat on WhatsApp
    </a>
  </div>
</section>
```

4.1.3 Implement home component logic
```typescript
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CategoryService } from '../services/category.service';
import { WhatsAppService } from '../services/whats-app.service';
import { Observable } from 'rxjs';
import { Product } from '../models/Product';
import { Category } from '../models/Category';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private whatsAppService = inject(WhatsAppService);

  featuredProducts$!: Observable<Product[]>;
  categories$!: Observable<Category[]>;
  whatsappUrl$!: Observable<string>;

  ngOnInit() {
    this.featuredProducts$ = this.productService.getFeaturedProducts();
    this.categories$ = this.categoryService.getAllCategories();
    this.whatsappUrl$ = this.whatsAppService.generateGeneralInquiryUrl();
  }
}
```

**Time Estimate:** 1.5 hours
**Blockers:** Product card component required

---

#### Task 4.2: Product Card Component

**Subtasks:**

4.2.1 Generate product card component
```bash
ng generate component components/shared/product-card
```

4.2.2 Implement product card
```html
<a
  [routerLink]="['/product', product.id]"
  class="group cursor-pointer bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition"
>
  <!-- Image Container -->
  <div class="relative bg-gray-100 overflow-hidden" style="aspect-ratio: 3/4">
    <img
      *ngIf="product.images.length"
      [src]="product.images[0]"
      [alt]="product.name"
      class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
    />
    <div *ngIf="!product.available" class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <span class="bg-red-500 text-white px-4 py-2 rounded">Out of Stock</span>
    </div>
  </div>

  <!-- Product Info -->
  <div class="p-4">
    <p class="text-sm text-gray-500 uppercase tracking-wide">{{ category }}</p>
    <h3 class="text-lg font-display font-bold text-charcoal line-clamp-2">{{ product.name }}</h3>
    <p class="text-2xl font-bold text-gold mt-2">{{ formatPrice(product.price) }}</p>

    <!-- Color Swatches -->
    <div *ngIf="product.colors.length" class="mt-4 flex gap-2">
      <div
        *ngFor="let color of product.colors"
        [style.backgroundColor]="color.hex"
        class="w-6 h-6 rounded-full border-2 border-gray-300"
        [title]="color.name"
      ></div>
    </div>
  </div>
</a>
```

4.2.3 Implement product card component logic
```typescript
import { Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/Product';
import { CategoryService } from '../../services/category.service';
import { formatPrice } from '../../utils/format-price';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent implements OnInit {
  @Input() product!: Product;
  formatPrice = formatPrice; // from utils - keeps component dummy, logic testable

  private categoryService = inject(CategoryService);
  category = '';

  ngOnInit() {
    this.categoryService.categories$.subscribe(cats => {
      const cat = cats.find(c => c.id === this.product.categoryId);
      this.category = cat?.name || '';
    });
  }
}
```

**Time Estimate:** 45 minutes
**Blockers:** None

---

#### Task 4.3: Shop / All Products Page

**Subtasks:**

4.3.1 Generate shop component
```bash
ng generate component pages/shop
```

4.3.2 Implement shop page with filters
```html
<div class="bg-white">
  <!-- Header -->
  <div class="bg-gray-50 border-b">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <h1 class="text-4xl font-display font-bold">Shop All Products</h1>
    </div>
  </div>

  <!-- Content -->
  <div class="max-w-7xl mx-auto px-4 py-12">
    <!-- Category Filter -->
    <div class="flex gap-4 mb-8 overflow-x-auto pb-4">
      <button
        (click)="selectedCategory = null"
        [class.border-b-2]="!selectedCategory"
        [class.border-gold]="!selectedCategory"
        class="whitespace-nowrap px-4 py-2 font-semibold text-gray-700 hover:text-gold transition"
      >
        All Products
      </button>
      <button
        *ngFor="let cat of (categories$ | async)"
        (click)="selectedCategory = cat.id"
        [class.border-b-2]="selectedCategory === cat.id"
        [class.border-gold]="selectedCategory === cat.id"
        class="whitespace-nowrap px-4 py-2 font-semibold text-gray-700 hover:text-gold transition"
      >
        {{ cat.name }}
      </button>
    </div>

    <!-- Product Grid -->
    <div *ngIf="(filteredProducts$ | async) as products; else loading"
         class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <app-product-card
        *ngFor="let product of products"
        [product]="product"
      ></app-product-card>
    </div>

    <!-- Loading State -->
    <ng-template #loading>
      <div class="col-span-full text-center py-12">
        <p class="text-gray-500">Loading products...</p>
      </div>
    </ng-template>

    <!-- Empty State -->
    <div *ngIf="(filteredProducts$ | async) as products; else loading">
      <div *ngIf="!products.length" class="col-span-full text-center py-12">
        <p class="text-gray-500 text-lg">No products found in this category</p>
      </div>
    </div>
  </div>
</div>
```

4.3.3 Implement shop component logic
```typescript
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { CategoryService } from '../services/category.service';
import { Observable, BehaviorSubject, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { ProductCardComponent } from '../components/shared/product-card/product-card.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './shop.component.html',
})
export class ShopComponent implements OnInit {
  private productService = inject(ProductService);

  categories$!: Observable<Category[]>;
  filteredProducts$!: Observable<Product[]>;

  selectedCategory: string | null = null;

  ngOnInit() {
    const categoryService = inject(CategoryService);
    this.categories$ = categoryService.getAllCategories();

    const selectedCategory$ = new BehaviorSubject<string | null>(null);

    this.filteredProducts$ = selectedCategory$.pipe(
      switchMap(categoryId => {
        if (!categoryId) {
          return this.productService.getAllProducts();
        }
        return this.productService.getProductsByCategory(categoryId);
      })
    );
  }

  ngOnDestroy() {
    // Handle cleanup if needed
  }
}
```

**Time Estimate:** 1 hour
**Blockers:** None

---

#### Task 4.4: Category Page

**Subtasks:**

4.4.1 Generate category component
```bash
ng generate component pages/category
```

4.4.2 Implement category page
```html
<div class="bg-white">
  <!-- Header -->
  <div *ngIf="(category$ | async) as category" class="bg-gradient-to-r from-gold to-yellow-500 text-charcoal py-12">
    <div class="max-w-7xl mx-auto px-4">
      <h1 class="text-4xl font-display font-bold">{{ category.name }}</h1>
      <p class="text-lg mt-2">{{ category.description }}</p>
    </div>
  </div>

  <!-- Products -->
  <div class="max-w-7xl mx-auto px-4 py-12">
    <div *ngIf="(products$ | async) as products; else loading"
         class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <app-product-card
        *ngFor="let product of products"
        [product]="product"
      ></app-product-card>
    </div>

    <ng-template #loading>
      <div class="col-span-full text-center py-12">
        <p class="text-gray-500">Loading products...</p>
      </div>
    </ng-template>
  </div>
</div>
```

4.4.3 Implement category component logic
```typescript
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CategoryService } from '../services/category.service';
import { Observable, switchMap } from 'rxjs';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { ProductCardComponent } from '../components/shared/product-card/product-card.component';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './category.component.html',
})
export class CategoryComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  category$!: Observable<Category | null>;
  products$!: Observable<Product[]>;

  ngOnInit() {
    this.category$ = this.route.params.pipe(
      switchMap(params => this.categoryService.getCategoryBySlug(params['slug']))
    );

    this.products$ = this.category$.pipe(
      switchMap(cat => {
        if (!cat?.id) return new Observable(observer => observer.next([]));
        return this.productService.getProductsByCategory(cat.id);
      })
    );
  }
}
```

**Time Estimate:** 1 hour
**Blockers:** None

---

#### Task 4.5: Product Detail Page

**Subtasks:**

4.5.1 Generate product detail component
```bash
ng generate component pages/product-detail
```

4.5.2 Implement product detail page
```html
<div class="bg-white">
  <!-- Breadcrumb -->
  <div class="max-w-7xl mx-auto px-4 py-4">
    <div class="flex gap-2 text-sm">
      <a routerLink="/" class="text-gold hover:underline">Home</a>
      <span>/</span>
      <a routerLink="/shop" class="text-gold hover:underline">Shop</a>
      <span>/</span>
      <span class="text-gray-600">{{ (product$ | async)?.name }}</span>
    </div>
  </div>

  <!-- Product Section -->
  <div *ngIf="(product$ | async) as product" class="max-w-7xl mx-auto px-4 py-12">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
      <!-- Image Gallery -->
      <div>
        <div class="bg-gray-100 rounded-lg overflow-hidden mb-4" style="aspect-ratio: 3/4">
          <img
            [src]="selectedImage || (product.images[0] || '')"
            [alt]="product.name"
            class="w-full h-full object-cover"
          />
        </div>
        <div *ngIf="product.images.length > 1" class="flex gap-2 overflow-x-auto">
          <button
            *ngFor="let img of product.images"
            (click)="selectedImage = img"
            [class.ring-2]="selectedImage === img"
            [class.ring-gold]="selectedImage === img"
            class="flex-shrink-0 w-16 h-20 rounded overflow-hidden"
          >
            <img [src]="img" [alt]="product.name" class="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      <!-- Product Info -->
      <div>
        <p class="text-sm text-gold uppercase tracking-wide mb-2">{{ categoryName }}</p>
        <h1 class="text-4xl font-display font-bold text-charcoal mb-4">{{ product.name }}</h1>
        <p class="text-3xl font-bold text-gold mb-6">${{ product.price }}</p>

        <!-- Description -->
        <p class="text-gray-700 mb-6">{{ product.description }}</p>

        <!-- Product Details -->
        <div class="bg-gray-50 p-4 rounded mb-6">
          <p class="mb-2"><strong>Material:</strong> {{ product.material }}</p>
          <p><strong>Availability:</strong>
            <span [class.text-green-600]="product.available" [class.text-red-600]="!product.available">
              {{ product.available ? 'In Stock' : 'Out of Stock' }}
            </span>
          </p>
        </div>

        <!-- Color Selection -->
        <div *ngIf="product.colors.length" class="mb-8">
          <h3 class="font-semibold mb-4">Available Colors</h3>
          <div class="flex gap-4">
            <button
              *ngFor="let color of product.colors"
              (click)="selectedColor = color.name"
              [class.ring-2]="selectedColor === color.name"
              [class.ring-offset-2]="selectedColor === color.name"
              [class.ring-gold]="selectedColor === color.name"
              [style.backgroundColor]="color.hex"
              class="w-10 h-10 rounded-full cursor-pointer transition"
              [title]="color.name"
            ></button>
          </div>
          <p class="text-sm text-gray-600 mt-2">Selected: {{ selectedColor || 'Choose a color' }}</p>
        </div>

        <!-- WhatsApp Button -->
        <a
          [href]="whatsappUrl$ | async"
          target="_blank"
          class="w-full inline-block px-8 py-4 bg-green-500 text-white font-bold text-center rounded hover:bg-green-600 transition mb-4"
        >
          Ask Availability on WhatsApp
        </a>

        <!-- Share Button -->
        <button
          (click)="shareProduct(product)"
          class="w-full px-8 py-4 border-2 border-charcoal text-charcoal font-bold rounded hover:bg-charcoal hover:text-white transition"
        >
          Share Product
        </button>
      </div>
    </div>
  </div>
</div>
```

4.5.3 Implement product detail component logic
```typescript
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CategoryService } from '../services/category.service';
import { WhatsAppService } from '../services/whats-app.service';
import { Observable, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/Product';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private whatsAppService = inject(WhatsAppService);

  product$!: Observable<Product | null>;
  whatsappUrl$!: Observable<string>;
  categoryName = '';
  selectedImage = '';
  selectedColor = '';

  ngOnInit() {
    this.product$ = this.route.params.pipe(
      switchMap(params => this.productService.getProductById(params['id']))
    );

    this.product$.subscribe(product => {
      if (product) {
        this.selectedImage = product.images[0] || '';
        this.categoryService.categories$.subscribe(cats => {
          const cat = cats.find(c => c.id === product.categoryId);
          this.categoryName = cat?.name || '';
        });
      }
    });

    this.whatsappUrl$ = this.product$.pipe(
      switchMap(product => {
        if (!product) return new Observable(observer => observer.next(''));
        return this.whatsAppService.generateProductInquiryUrl(product, this.selectedColor || undefined);
      })
    );
  }

  shareProduct(product: Product) {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} from Musani Wear!`,
        url: window.location.href,
      });
    }
  }
}
```

**Time Estimate:** 2 hours
**Blockers:** None

---

#### Task 4.6: Floating WhatsApp Button

**Subtasks:**

4.6.1 Generate WhatsApp button component
```bash
ng generate component components/shared/floating-whatsapp-button
```

4.6.2 Implement floating button
```html
<a
  [href]="whatsappUrl$ | async"
  target="_blank"
  class="fixed bottom-8 right-8 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition z-40 text-2xl"
  title="Chat on WhatsApp"
  aria-label="Chat on WhatsApp"
>
  💬
</a>
```

4.6.2 Implement floating button logic
```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhatsAppService } from '../../services/whats-app.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-floating-whatsapp-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './floating-whatsapp-button.component.html',
})
export class FloatingWhatsAppButtonComponent {
  private whatsAppService = inject(WhatsAppService);

  whatsappUrl$: Observable<string> = this.whatsAppService.generateGeneralInquiryUrl();
}
```

4.6.3 Add to app layout
- Import FloatingWhatsAppButtonComponent in AppComponent
- Add `<app-floating-whatsapp-button></app-floating-whatsapp-button>` to app template

**Time Estimate:** 30 minutes
**Blockers:** None

---

### Phase 4 Completion Checklist

- [ ] Home page with hero section, featured products, categories
- [ ] Shop page with category filters
- [ ] Category detail page with filtered products
- [ ] Product detail page with image gallery
- [ ] Color selection on product detail
- [ ] WhatsApp integration on product pages
- [ ] Product card component reusable
- [ ] Floating WhatsApp button visible on all pages
- [ ] All pages responsive (mobile, tablet, desktop)
- [ ] Loading states working
- [ ] Error handling implemented
- [ ] No console errors in development or production build
- [ ] Customer-facing components have Angular Testing Library behavior tests (TESTING.md)

**Phase 4 Effort:** 15-20 hours
**Recommended Completion Time:** End of Day 8

---

### Phase 5: Polish & Performance

**Duration:** Days 8-10 (8-10 hours)
**Goal:** Optimize, test, and ensure production-ready quality
**Milestone Criteria:**
- [ ] Mobile responsiveness verified on real devices
- [ ] Lighthouse Performance score > 85
- [ ] Lighthouse SEO score > 90
- [ ] Lighthouse Accessibility score > 90
- [ ] All images lazy-loaded
- [ ] No broken links or 404 errors
- [ ] Form validation and error handling complete
- [ ] Loading states for all async operations
- [ ] No console errors or warnings
- [ ] Cross-browser compatibility tested

#### Task 5.1: Mobile Responsiveness Testing

**Subtasks:**

5.1.1 Test on various breakpoints
- Mobile (375px width)
- Tablet (768px width)
- Desktop (1024px+ width)

5.1.2 Fix responsive issues
- Ensure images display correctly
- Test navigation on mobile
- Test form inputs on mobile
- Check touch targets are 48px minimum

5.1.3 Test real devices
- iPhone (iOS)
- Android device
- Chrome DevTools mobile emulation

**Time Estimate:** 2 hours
**Blockers:** Real devices not required (but helpful)

---

#### Task 5.2: Image Optimization

**Subtasks:**

5.2.1 Implement lazy loading for product images
```typescript
// In product card component
<img
  [src]="product.images[0]"
  [alt]="product.name"
  loading="lazy"
  class="w-full h-full object-cover"
/>
```

5.2.2 Set image dimensions to prevent layout shift
```html
<img
  [src]="product.images[0]"
  [alt]="product.name"
  width="300"
  height="400"
  class="w-full h-full object-cover"
/>
```

5.2.3 Optimize Firebase Storage images
- Set max width to 1920px (task 2.5.2 already handles this)
- Enable compression before upload (already done)

**Time Estimate:** 1 hour
**Blockers:** None

---

#### Task 5.3: SEO Optimization

**Subtasks:**

5.3.1 Add Angular Meta service to app
```bash
npm install @angular/platform-browser
```

5.3.2 Implement SEO service
```typescript
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private meta = inject(Meta);
  private title = inject(Title);

  setPageTitle(title: string) {
    this.title.setTitle(title);
  }

  setMeta(name: string, content: string) {
    this.meta.updateTag({ name, content });
  }

  setOgTags(title: string, description: string, imageUrl: string) {
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: imageUrl });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
  }
}
```

5.3.3 Add SEO to pages
```typescript
// In product-detail component ngOnInit
this.product$.subscribe(product => {
  if (product) {
    this.seoService.setPageTitle(`${product.name} - Musani Wear`);
    this.seoService.setMeta('description', product.description);
    this.seoService.setOgTags(
      product.name,
      product.description,
      product.images[0]
    );
  }
});
```

**Time Estimate:** 1.5 hours
**Blockers:** None

---

#### Task 5.4: Lighthouse Audit

**Subtasks:**

5.4.1 Run Lighthouse in Chrome DevTools
- Open DevTools (F12)
- Go to Lighthouse tab
- Run audit for Desktop
- Review report

5.4.2 Fix performance issues
- Minify CSS/JS (automatic in production build)
- Remove unused CSS
- Defer non-critical scripts
- Use CSS containment for heavy components

5.4.3 Fix SEO issues
- Ensure all images have alt text
- Add meta description
- Ensure mobile viewport is set
- Use semantic HTML

5.4.4 Fix Accessibility issues
- Ensure sufficient color contrast
- Add ARIA labels where needed
- Ensure keyboard navigation works
- Use semantic HTML (h1, h2, button, etc.)

**Time Estimate:** 3 hours
**Blockers:** May require component refactoring

---

#### Task 5.5: Error Handling & Loading States

**Subtasks:**

5.5.1 Add error boundaries
```typescript
// Create error-handler.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-boundary',
  standalone: true,
  template: `
    <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <p class="font-bold">{{ error }}</p>
    </div>
  `
})
export class ErrorBoundaryComponent {
  @Input() error: string | null = null;
}
```

5.5.2 Add 404 page
```bash
ng generate component pages/not-found
```

5.5.3 Add loading skeleton
```typescript
// Create loading-skeleton.component.ts
@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  template: `
    <div class="animate-pulse">
      <div class="h-12 bg-gray-300 rounded mb-4"></div>
      <div class="h-6 bg-gray-300 rounded w-3/4"></div>
    </div>
  `
})
export class LoadingSkeletonComponent {}
```

**Time Estimate:** 2 hours
**Blockers:** None

---

#### Task 5.6: Accessibility Audit

**Subtasks:**

5.6.1 Add ARIA labels
```html
<!-- Example improvements -->
<button aria-label="Add to cart">Add</button>
<img alt="Product photo" src="..." />
<nav aria-label="Main navigation">...</nav>
```

5.6.2 Test keyboard navigation
- Tab through all interactive elements
- Ensure focus indicators visible
- Test with screen reader (NVDA or JAWS)

5.6.3 Check color contrast
- Use WebAIM contrast checker
- Ensure 4.5:1 ratio for small text
- Ensure 3:1 ratio for large text

**Time Estimate:** 2 hours
**Blockers:** May require design changes

---

### Phase 5 Completion Checklist

- [ ] Responsive on mobile (375px), tablet (768px), desktop (1280px)
- [ ] Lighthouse Performance score >= 85
- [ ] Lighthouse SEO score >= 90
- [ ] Lighthouse Accessibility score >= 90
- [ ] All images lazy-loaded
- [ ] 404 page created and working
- [ ] Error handling for all async operations
- [ ] Loading states visible
- [ ] Form validation working
- [ ] No console errors or warnings
- [ ] Tested on Chrome, Firefox, Safari
- [ ] Mobile touch targets minimum 48px
- [ ] All tests passing (`npm test`), coverage reviewed

**Phase 5 Effort:** 8-10 hours
**Recommended Completion Time:** End of Day 10

---

### Phase 6: Deployment

**Duration:** Day 10 (2-3 hours)
**Goal:** Deploy to Firebase Hosting and verify production
**Milestone Criteria:**
- [ ] Production build created successfully
- [ ] Firebase Hosting configured
- [ ] App deployed to Firebase Hosting
- [ ] Custom domain configured (if applicable)
- [ ] Production URLs verified working
- [ ] HTTPS enabled
- [ ] Analytics configured

#### Task 6.1: Production Build

**Subtasks:**

6.1.1 Create production build
```bash
ng build --configuration production
# Output should be in dist/musani-wear/
```

6.1.2 Verify build size
```bash
du -sh dist/musani-wear/
# Should be < 2MB gzipped
```

6.1.3 Test production build locally
```bash
npx http-server dist/musani-wear/ -c-1 -o -p 8080
# Visit http://localhost:8080
```

**Time Estimate:** 30 minutes
**Blockers:** May need to fix build errors

---

#### Task 6.2: Firebase Hosting Setup

**Subtasks:**

6.2.1 Install Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

6.2.2 Initialize Firebase Hosting
```bash
firebase init hosting
# Select project
# Set public directory to: dist/musani-wear
# Configure as SPA: yes
# Auto deploy from GitHub: optional
```

6.2.3 Update firebase.json
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
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=1y"
          }
        ]
      },
      {
        "source": "index.html",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=0, must-revalidate"
          }
        ]
      }
    ]
  }
}
```

**Time Estimate:** 30 minutes
**Blockers:** Requires Firebase project

---

#### Task 6.3: Deploy to Firebase Hosting

**Subtasks:**

6.3.1 Deploy
```bash
firebase deploy --only hosting
# Should show: Deploy complete!
# Hosting URL: https://musani-wear-xxx.web.app
```

6.3.2 Verify deployment
- Visit provided URL
- Test all pages
- Check form submissions
- Verify WhatsApp links work
- Test on mobile

6.3.3 Setup custom domain (optional)
- In Firebase Console → Hosting
- Click "Add custom domain"
- Follow DNS setup instructions
- Wait for SSL certificate (< 24 hours)

**Time Estimate:** 30 minutes
**Blockers:** May take time for SSL certificate

---

#### Task 6.4: Post-Deployment Verification

**Subtasks:**

6.4.1 Smoke test checklist
- [ ] Home page loads
- [ ] Shop page loads with products
- [ ] Product detail page loads
- [ ] WhatsApp links work
- [ ] Admin login page accessible
- [ ] Admin dashboard loads (if authenticated)
- [ ] Product add form works
- [ ] Images display correctly
- [ ] Responsive on mobile
- [ ] No console errors

6.4.2 Setup Firebase Analytics (optional)
```bash
firebase analytics:settings --project <project-id>
```

6.4.3 Setup error monitoring (optional)
- Enable Sentry or Firebase Crashlytics
- Test error tracking

**Time Estimate:** 1 hour
**Blockers:** None

---

### Phase 6 Completion Checklist

- [ ] Production build created (ng build --configuration production)
- [ ] Build size < 2MB gzipped
- [ ] Firebase Hosting configured
- [ ] App deployed to Firebase Hosting URL
- [ ] All pages accessible at production URL
- [ ] HTTPS working
- [ ] Custom domain configured (if applicable)
- [ ] Smoke tests passed
- [ ] No production errors in console

**Phase 6 Effort:** 2-3 hours
**Recommended Completion Time:** End of Day 10

---

## Feature Implementation Mapping

### P0 Features (Must Have for MVP)

| Feature | Phase | Status | Notes |
|---------|-------|--------|-------|
| Product showcase (Home, Shop, Category, Detail) | Phase 4 | Core | Responsive grid, image gallery |
| WhatsApp ordering integration | Phase 2, 4 | Core | Pre-filled inquiry messages |
| Admin product management | Phase 3 | Core | Full CRUD + image upload |
| Admin category management | Phase 3 | Core | Simple CRUD |
| Admin login/auth | Phase 3 | Core | Firebase Email/Password |
| Product image upload | Phase 3 | Core | Firebase Storage, compression |
| Responsive design | Phase 4, 5 | Core | Mobile-first, all breakpoints |
| Floating WhatsApp button | Phase 4 | Core | General inquiries |

### P1 Features (Post-MVP, v1.1)

| Feature | Target Version | Estimated Effort | Notes |
|---------|----------------|------------------|-------|
| Product search | v1.1 | 3 days | Full-text search in Firestore |
| Product filters (by color, material) | v1.1 | 2 days | Frontend filtering |
| Email notifications | v1.1 | 4 days | Firebase Cloud Functions |
| Newsletter signup | v1.1 | 2 days | Mailchimp integration |
| Product reviews/ratings | v1.2 | 5 days | Firestore sub-collection |
| User wishlists | v1.2 | 3 days | Firestore user documents |

### P2 Features (Nice to Have, Future)

- Advanced analytics dashboard
- Social media sharing
- Instagram feed integration
- Size guide/measurement tool
- Customer testimonials
- Blog/lookbook
- Video product tours
- AR try-on (mobile)
- Chat support
- Inventory management alerts

---

## Success Criteria for MVP

### Functional Requirements (All Must Pass)

**Product Showcase:**
- [ ] Home page displays 4+ featured products
- [ ] Home page displays all categories
- [ ] Shop page displays all products in grid
- [ ] Category page filters products correctly
- [ ] Product detail page shows all product info
- [ ] Image gallery works on product detail
- [ ] Color selection works (visual feedback)
- [ ] Out of stock badge displays when appropriate

**Admin Functions:**
- [ ] Admin can log in with email/password
- [ ] Admin can view all products
- [ ] Admin can add new product with all fields
- [ ] Admin can upload multiple images
- [ ] Admin can edit existing products
- [ ] Admin can delete products with confirmation
- [ ] Admin can manage categories (CRUD)
- [ ] Admin can update business settings (WhatsApp number)
- [ ] All admin changes reflect on front-end immediately

**WhatsApp Integration:**
- [ ] WhatsApp buttons have correct phone number
- [ ] Product inquiry messages include product name and price
- [ ] Color is included in message when selected
- [ ] General inquiry button works from floating button
- [ ] Links open WhatsApp (web or app)

**Error Handling:**
- [ ] 404 page shows for non-existent routes
- [ ] Error messages display for failed operations
- [ ] Network errors handled gracefully
- [ ] Form validation prevents invalid submission

### Non-Functional Requirements

**Performance:**
- [ ] Homepage loads in < 3 seconds on 3G
- [ ] Product pages load in < 2 seconds
- [ ] Lighthouse Performance score > 85
- [ ] Lighthouse Accessibility score > 90
- [ ] Bundle size < 2MB gzipped

**Security:**
- [ ] No critical vulnerabilities in `npm audit`
- [ ] Firestore security rules prevent public writes
- [ ] Admin routes protected by auth guard
- [ ] Passwords hashed by Firebase
- [ ] CORS configured appropriately

**Accessibility:**
- [ ] All images have alt text
- [ ] Form labels associated with inputs
- [ ] Color contrast > 4.5:1 (WCAG AA)
- [ ] Keyboard navigation works
- [ ] Touch targets > 48px

**Browser Support:**
- [ ] Chrome (latest 2 versions)
- [ ] Firefox (latest 2 versions)
- [ ] Safari (latest 2 versions)
- [ ] Mobile Safari (iOS 14+)
- [ ] Chrome Mobile (Android 8+)

**Responsiveness:**
- [ ] 375px width (mobile)
- [ ] 768px width (tablet)
- [ ] 1024px+ (desktop)
- [ ] No horizontal scroll
- [ ] All content accessible on mobile

---

## Risk Mitigation

### Identified Risks

| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|---------------------|
| Firebase quota exceeded (images) | Medium | Medium | Monitor storage usage, set quotas in Firebase Console, optimize images |
| Slow Firestore queries | Medium | Low | Use composite indexes, implement pagination, cache categories |
| Scope creep from stakeholders | High | High | Strict PRD adherence, defer P1/P2 features, weekly check-ins |
| Admin UI too complex | Medium | Medium | Keep forms simple, use modals for secondary actions, clear labels |
| Mobile performance issues | High | Medium | Test early on real devices, lazy load images, minimize bundle |
| Authentication issues | Medium | Low | Test thoroughly in Phase 3, use Firebase emulator |
| Image upload failures | Medium | Medium | Implement retry logic, show error messages, set file size limits |
| Deployment issues | Medium | Low | Test in staging first, use Firebase emulator, have rollback plan |
| Team knowledge gaps | Medium | High | Document architecture, pair program setup, maintain code comments |

### Contingency Plans

**If timeline slips by > 1 week:**
- Defer P1 features to post-MVP
- Reduce testing scope (min 60% unit test coverage)
- Simplify UI (remove animations, extra styling)
- Use more experienced developer for critical paths

**If Firebase quota exceeded:**
- Implement Cloud Storage lifecycle rules (auto-delete old images)
- Compress images more aggressively
- Resize images before upload
- Consider alternative storage (Cloudinary)

**If performance targets not met:**
- Profile with Lighthouse
- Implement route-level code splitting
- Enable Firestore caching
- Add CDN for images (Firebase CDN or Cloudinary)
- Defer to Phase 5 optimization

**If admin requests major changes:**
- Document change request
- Assess impact on timeline
- Move to P1 post-MVP if necessary
- Re-negotiate deadline

---

## Weekly Milestones & Checkpoints

### Week 1: Days 1-2 (Phase 1 Complete)

**Target Deliverables:**
- Angular project runs locally
- Firebase connected (Firestore, Auth, Storage)
- Tailwind configured
- Routing structure in place
- Navbar/Footer built
- Categories seeded

**Checkpoint Review:** Friday EOD
- Demo: "ng serve" works for all team members
- Verify no console errors
- Confirm Git repo set up correctly

**Success Criteria:** ALL team members can run app locally and see homepage

---

### Week 1: Days 2-3 (Phase 2 Complete)

**Target Deliverables:**
- TypeScript models defined
- AuthService working (login/logout)
- ProductService CRUD operations
- CategoryService CRUD operations
- ImageService uploads with compression
- WhatsAppService generating URLs
- Firestore security rules deployed

**Checkpoint Review:** Monday after Phase 2
- Manual testing: Add product via service, verify in Firestore
- Test image upload and compression
- Test category operations
- Verify auth guard works

**Success Criteria:** All services tested, no console errors

---

### Week 2: Days 3-5 (Phase 3 Complete)

**Target Deliverables:**
- Admin login page
- Admin Dashboard with stats
- Products list table with CRUD
- Product add/edit form
- Image upload with preview
- Categories management
- Settings page

**Checkpoint Review:** Friday EOD
- Demo: Log in as admin
- Add new product with images
- Edit product
- Delete product with confirmation
- Update categories
- Update WhatsApp number

**Success Criteria:** Admin can fully manage products/categories in under 5 minutes

---

### Week 2: Days 5-8 (Phase 4 Complete)

**Target Deliverables:**
- Home page with hero and featured products
- Shop page with all products and filters
- Category pages with filtered products
- Product detail page with gallery
- Color selection
- WhatsApp integration
- Floating WhatsApp button
- Responsive design

**Checkpoint Review:** Thursday
- Demo: Browse as customer
- Test product detail page
- Test WhatsApp links (should pre-fill message)
- Test on mobile (DevTools)

**Success Criteria:** Customer can browse and inquire via WhatsApp

---

### Week 3: Days 8-10 (Phase 5 & 6 Complete)

**Target Deliverables:**
- Lighthouse audits passing (>85 performance, >90 SEO/accessibility)
- Mobile responsive verified
- Image lazy loading
- 404 page
- Error handling
- Production build < 2MB
- Deployed to Firebase Hosting
- Custom domain (optional)

**Final Review:** Friday EOD
- Run Lighthouse audit (desktop + mobile)
- Test on real mobile device
- Verify production URL
- Test all smoke tests

**Success Criteria:** Live on Firebase Hosting, all smoke tests passing, ready for launch

---

## Post-MVP Roadmap

### Version 1.1 (Month 2, Weeks 5-8)

**Focus:** Search and User Experience Enhancements

**Features:**
- [ ] Full-text product search
- [ ] Product filtering (by color, material, price range)
- [ ] Saved favorites/wishlist
- [ ] Email notifications for inquiries
- [ ] Newsletter signup
- [ ] Product comparison

**Estimated Effort:** 15-20 development days
**Success Metrics:**
- Search used by > 40% of visitors
- Average session duration increases 30%

---

### Version 1.2 (Month 3-4, Weeks 9-16)

**Focus:** Engagement and Content

**Features:**
- [ ] Product reviews and ratings
- [ ] Customer testimonials
- [ ] Blog/lookbook content
- [ ] New Arrivals section (auto-update)
- [ ] Email digest of new products
- [ ] Social media share buttons

**Estimated Effort:** 25-30 development days
**Success Metrics:**
- Reviews on > 30% of products
- Social shares increase 50%

---

### Version 2.0 (Quarter 2, 12+ weeks)

**Focus:** Mobile App and Advanced Features

**Features:**
- [ ] React Native mobile app (iOS + Android)
- [ ] Push notifications
- [ ] In-app chat with admin
- [ ] Advanced inventory management
- [ ] Multiple admin users with roles
- [ ] Payment gateway integration (if needed)
- [ ] Order tracking

**Estimated Effort:** 60+ development days
**Success Metrics:**
- Mobile app adoption
- Order conversion improvement

---

### Technical Debt & Maintenance

**Ongoing (Every Sprint):**
- Security updates and patches
- Dependency updates
- Bug fixes from customer feedback
- Performance monitoring and optimization

**Quarterly:**
- Audit Firestore usage and optimize queries
- Review and update security rules
- Database backups and disaster recovery
- Staff training on new features

---

## Appendix: Helpful Commands

### Development

```bash
# Start dev server
ng serve

# Build for production
ng build --configuration production

# Run tests (Jest + Angular Testing Library)
npm test

# Lint code
ng lint
```

### Firebase

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase project
firebase init

# Deploy everything
firebase deploy

# Deploy only hosting
firebase deploy --only hosting

# Deploy only Firestore rules
firebase deploy --only firestore:rules

# Deploy only Storage rules
firebase deploy --only storage

# View logs
firebase functions:log
```

### Angular

```bash
# Generate component
ng generate component path/to/component

# Generate service
ng generate service path/to/service

# Generate guard
ng generate guard path/to/guard

# Build with source maps (debugging)
ng build --source-map
```

---

## Document Sign-Off

**Created By:** Implementation Plan Generator
**Date:** March 8, 2026
**Status:** Ready for Development
**Approved By:** [Project Manager/Lead Developer]

---

**Next Steps:**
1. Review this implementation plan with team
2. Adjust timelines based on team size and experience
3. Set up development environment (Phase 1)
4. Begin Phase 1 on agreed start date
5. Hold weekly checkpoint meetings
6. Update this document as learnings emerge

---

**End of IMPLEMENTATION_PLAN.md**
