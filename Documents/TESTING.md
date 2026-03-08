# TESTING.md - Musani Wear

**Project:** Dress Boutique Showcase Website
**Testing Stack:** Jest + Angular Testing Library
**Last Updated:** March 8, 2026

---

## 1. Testing Philosophy

> **The more your tests resemble the way your software is used, the more confidence they can give you.**
> — [Angular Testing Library](https://testing-library.com/docs/angular-testing-library/intro/)

Musani Wear uses a two-tier testing approach:

| What to Test | Tool | Purpose |
|--------------|------|---------|
| **Simple methods, utils, pure logic** | Jest | Fast, isolated unit tests |
| **Component behavior (user interactions, rendering)** | Angular Testing Library | Tests that mirror real user usage |

**Test IDs (`data-testid`)** are used only as a **last resort** when semantic queries (label, role, text) are not practical.

---

## 1.1 Dummy Components + Utils = Easy Testing

**Architecture rule:** Most components should be **dummy (presentational)**. Move logic into **utils/** or **shared/**.

| Location | What Lives There | How to Test |
|----------|------------------|-------------|
| **utils/** | `formatPrice`, `validateEmail`, `buildWhatsAppMessage`, etc. | Jest – no Angular, no mocks |
| **shared/** | Constants, shared helpers | Jest – trivial tests |
| **Components** | Display data, call utils, emit events | Angular Testing Library – behavior only |

**Why this helps:**
- Utils are **pure functions** → Jest tests are fast and simple
- Components stay **thin** → Fewer dependencies to mock, simpler behavior tests
- Logic changes → Update utils + Jest tests; component tests often unchanged

---

## 2. Dependencies & Setup

### 2.1 Install Testing Dependencies

```bash
# Jest + Angular preset
npm install --save-dev jest jest-preset-angular @types/jest jest-environment-jsdom jsdom

# Angular Testing Library (requires @testing-library/dom from v17+)
npm install --save-dev @testing-library/angular @testing-library/dom
```

Or use `ng add` for Angular Testing Library:

```bash
ng add @testing-library/angular
```

### 2.2 Jest Configuration

Create `jest.config.ts`:

```typescript
import type { Config } from 'jest';
import { createCjsPreset } from 'jest-preset-angular/presets';

export default {
  ...createCjsPreset(),
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  collectCoverageFrom: [
    'src/**/*.{ts,html}',
    '!src/**/*.spec.ts',
    '!src/main.ts',
    '!src/environments/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
} satisfies Config;
```

Create `setup-jest.ts`:

```typescript
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
setupZoneTestEnv();
```

### 2.3 Update package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### 2.4 Angular project.json (if using Angular 17+)

```json
{
  "projects": {
    "musani-wear": {
      "architect": {
        "test": {
          "builder": "@angular-devkit/build-angular:jest",
          "options": {
            "config": "jest.config.ts"
          }
        }
      }
    }
  }
}
```

---

## 3. Testing Order (Critical)

**Always follow this order before writing any test:**

```text
1. DEPENDENCIES  →  Ensure all mocks/providers are configured
2. FIRST RENDER  →  Verify component renders without errors
3. ONE BY ONE    →  Add tests incrementally, verify each passes
```

### 3.1 Step 1: Sort Dependencies

Before testing a component or service:

- **Components:** Provide all required imports (Store, Router, services, etc.)
- **Services:** Mock Firebase, HTTP, or other external dependencies
- **Utils:** Usually no dependencies; can test in isolation

**Example – Component with NgRx Store:**

```typescript
import { provideStore } from '@ngrx/store';
import { provideRouter } from '@angular/router';
import { ProductEffects } from '../store/products/product.effects';
import { productReducer } from '../store/products/product.reducer';

const providers = [
  provideStore({ products: productReducer }),
  provideEffects(ProductEffects),
  provideRouter([]),
  // Mock any services the component needs
];
```

### 3.2 Step 2: First Render Test

**Always get the first render test passing before adding more tests.**

```typescript
it('should render without crashing', () => {
  render(ProductListComponent, {
    providers: [...],
    imports: [/* required modules */],
  });
  expect(screen.getByRole('heading', { name: /products/i })).toBeInTheDocument();
});
```

If this fails, fix dependencies and rendering before proceeding.

### 3.3 Step 3: Add Tests One by One

Add each test, run the suite, and ensure it passes before adding the next.

---

## 4. What to Test with Jest

### 4.1 Utils & Pure Functions (Priority: Test These First)

Utils live in `src/app/utils/`. See IMPLEMENTATION_PLAN Task 1.1b for the full list. Test each util in isolation – no Angular, no mocks.

```typescript
// utils/format-price.spec.ts
import { formatPrice } from './format-price';

describe('formatPrice', () => {
  it('formats INR with comma separators', () => {
    expect(formatPrice(2499)).toBe('₹2,499');
  });

  it('handles zero', () => {
    expect(formatPrice(0)).toBe('₹0');
  });
});
```

```typescript
// utils/validate-whatsapp.spec.ts
import { isValidWhatsAppNumber } from './validate-whatsapp';

describe('isValidWhatsAppNumber', () => {
  it('accepts E.164 format', () => {
    expect(isValidWhatsAppNumber('+919876543210')).toBe(true);
  });
  it('rejects invalid format', () => {
    expect(isValidWhatsAppNumber('9876543210')).toBe(false);
  });
});
```

### 4.2 Service Methods (with Mocks)

```typescript
// services/whats-app.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { WhatsAppService } from './whats-app.service';
import { SettingsService } from './settings.service';
import { of } from 'rxjs';

describe('WhatsAppService', () => {
  let service: WhatsAppService;
  let settingsMock: { getWhatsAppNumber: jest.Mock };

  beforeEach(() => {
    settingsMock = { getWhatsAppNumber: jest.fn().mockReturnValue(of('+919876543210')) };
    TestBed.configureTestingModule({
      providers: [
        WhatsAppService,
        { provide: SettingsService, useValue: settingsMock },
      ],
    });
    service = TestBed.inject(WhatsAppService);
  });

  it('generates correct WhatsApp URL for product', (done) => {
    service.generateProductInquiryUrl({ name: 'Test Dress', price: 1999 } as any).subscribe(url => {
      expect(url).toContain('wa.me/');
      expect(url).toContain('Test%20Dress');
      done();
    });
  });
});
```

### 4.3 NgRx Reducers (Pure Functions)

```typescript
// store/products/product.reducer.spec.ts
import { productReducer } from './product.reducer';
import * as ProductActions from './product.actions';

describe('productReducer', () => {
  it('should set loading on loadProducts', () => {
    const state = productReducer(undefined, ProductActions.loadProducts({ filter: {} }));
    expect(state.loading).toBe(true);
  });

  it('should set products on loadProductsSuccess', () => {
    const products = [{ id: '1', name: 'Dress' }];
    const state = productReducer(
      { loading: true, products: [], error: null },
      ProductActions.loadProductsSuccess({ products })
    );
    expect(state.products).toEqual(products);
    expect(state.loading).toBe(false);
  });
});
```

---

## 5. What to Test with Angular Testing Library

Use [Angular Testing Library](https://testing-library.com/docs/angular-testing-library/intro/) for **component behavior** – how users interact with the UI.

### 5.1 Query Priority (Prefer Semantic Queries)

1. **By role + name** (most accessible): `getByRole('button', { name: /submit/i })`
2. **By label** (forms): `getByLabelText('Product Name')`
3. **By text**: `getByText('Add to Cart')`
4. **By test ID** (last resort): `getByTestId('product-card-1')`

### 5.2 Component Behavior Example

```typescript
// product-form.component.spec.ts
import { render, screen, fireEvent } from '@testing-library/angular';
import { ProductFormComponent } from './product-form.component';
import { provideStore } from '@ngrx/store';
import { provideRouter } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

describe('ProductFormComponent', () => {
  const providers = [
    provideStore({}),
    provideRouter([]),
    // Add other providers
  ];

  it('should render without crashing', async () => {
    await render(ProductFormComponent, {
      providers,
      imports: [ReactiveFormsModule],
    });
    expect(screen.getByRole('heading', { name: /add product/i })).toBeInTheDocument();
  });

  it('should show validation error when name is empty', async () => {
    await render(ProductFormComponent, { providers, imports: [ReactiveFormsModule] });

    const submitButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(submitButton);

    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
  });

  it('should call createProduct when form is valid', async () => {
    const dispatchSpy = jest.fn();
    await render(ProductFormComponent, {
      providers: [
        ...providers,
        { provide: Store, useValue: { dispatch: dispatchSpy } },
      ],
      imports: [ReactiveFormsModule],
    });

    await fireEvent.input(screen.getByLabelText(/product name/i), { target: { value: 'Test Dress' } });
    await fireEvent.input(screen.getByLabelText(/price/i), { target: { value: '1999' } });
    // ... fill other required fields

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: expect.stringContaining('Create') }));
  });
});
```

### 5.3 When to Use data-testid

Use `data-testid` only when:

- No semantic role or label exists (e.g. custom chart, complex layout)
- Text content is dynamic or not user-facing
- Multiple elements share the same role/label

```html
<!-- Last resort -->
<div data-testid="product-card" *ngFor="let p of products">
```

```typescript
const card = screen.getByTestId('product-card');
```

---

## 6. File Naming & Structure

| File Type | Test File | Location |
|-----------|-----------|----------|
| Component | `component-name.component.spec.ts` | Same folder as component |
| Service | `service-name.service.spec.ts` | Same folder as service |
| Util | `util-name.spec.ts` | Same folder as util |
| Reducer | `reducer-name.reducer.spec.ts` | Same folder as reducer |
| Effect | `effect-name.effects.spec.ts` | Same folder as effect |

---

## 7. Checklist Before Writing Tests

- [ ] Dependencies (providers, mocks) configured for the unit under test
- [ ] First render test passes
- [ ] Tests added one at a time; each passes before adding the next
- [ ] Jest used for: utils, service methods, reducers
- [ ] Angular Testing Library used for: component behavior
- [ ] `data-testid` used only as last resort
- [ ] Semantic queries preferred (role, label, text)

---

## 8. Quick Reference

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

**Resources:**
- [Angular Testing Library](https://testing-library.com/docs/angular-testing-library/intro/)
- [DOM Testing Library Queries](https://testing-library.com/docs/queries/about)
- [jest-preset-angular](https://thymikee.github.io/jest-preset-angular/docs)

---

**End of TESTING.md**
