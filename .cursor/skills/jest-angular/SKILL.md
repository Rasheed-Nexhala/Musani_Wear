---
name: jest-angular
description: Configure and run Jest for Angular projects. Use when setting up Jest, writing unit tests for utils, services, reducers, or when the user mentions Jest, jest-preset-angular, or unit testing in Angular.
---

# Jest for Angular Projects

Jest runs fast, isolated unit tests for pure logic, utils, services, and NgRx reducers. Use Angular Testing Library for component behavior.

**When to use Jest vs Angular Testing Library:**

| What to Test | Tool |
|--------------|------|
| Utils, pure functions, reducers | Jest |
| Component behavior (user interactions) | Angular Testing Library |

---

## Setup

### Dependencies

```bash
npm install --save-dev jest jest-preset-angular @types/jest jest-environment-jsdom jsdom
```

### jest.config.ts

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

### setup-jest.ts

```typescript
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
setupZoneTestEnv();
```

### package.json scripts

```json
"test": "jest",
"test:watch": "jest --watch",
"test:coverage": "jest --coverage"
```

---

## Utils & Pure Functions

No Angular, no mocks. Test in isolation.

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

---

## Services (with Mocks)

Use `TestBed` for Angular services. Mock dependencies with `jest.fn()`.

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

  it('generates correct WhatsApp URL', (done) => {
    service.generateProductInquiryUrl({ name: 'Test Dress', price: 1999 } as any).subscribe(url => {
      expect(url).toContain('wa.me/');
      expect(url).toContain('Test%20Dress');
      done();
    });
  });
});
```

---

## NgRx Reducers

Reducers are pure functions. Test state transitions directly.

```typescript
// store/products/product.reducer.spec.ts
import { productReducer } from './product.reducer';
import * as ProductActions from './product.actions';

describe('productReducer', () => {
  it('sets loading on loadProducts', () => {
    const state = productReducer(undefined, ProductActions.loadProducts({ filter: {} }));
    expect(state.loading).toBe(true);
  });

  it('sets products on loadProductsSuccess', () => {
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

## Common Jest Patterns

| Pattern | Usage |
|---------|-------|
| `jest.fn()` | Mock function, track calls |
| `jest.fn().mockReturnValue(x)` | Sync return value |
| `jest.fn().mockReturnValue(of(x))` | RxJS Observable |
| `jest.fn().mockResolvedValue(x)` | Promise |
| `expect(mock).toHaveBeenCalledWith(...)` | Assert call args |
| `expect(mock).toHaveBeenCalledTimes(n)` | Assert call count |

---

## File Naming

| File Type | Test File |
|-----------|-----------|
| Util | `util-name.spec.ts` |
| Service | `service-name.service.spec.ts` |
| Reducer | `reducer-name.reducer.spec.ts` |
| Effect | `effect-name.effects.spec.ts` |

---

## Additional Resources

- [reference.md](reference.md) – Mocks, matchers, async patterns
- [TESTING.md](../../../Documents/TESTING.md) – Full project testing guide
