---
name: angular-testing-library
description: Test Angular components using user-centric queries and interactions. Use when writing or debugging Angular component tests, setting up Angular Testing Library, or when the user mentions Angular testing, component tests, or Testing Library.
---

# Angular Testing Library

Test Angular components the way users interact with them. Avoid implementation details; focus on behavior.

**Guiding principle:** *The more your tests resemble the way your software is used, the more confidence they can give you.*

---

## Project-specific (Musani Wear)

**Stack:** Jest + Angular Testing Library. See [Documents/TESTING.md](../../../Documents/TESTING.md).

| What to Test | Tool |
|--------------|------|
| Utils, pure logic, reducers | Jest |
| Component behavior (user interactions) | Angular Testing Library |

**File naming:** `component-name.component.spec.ts` next to the component.

**Testing order:** 1) Dependencies (providers, mocks) → 2) First render passing → 3) Add tests one by one.

---

## Installation

ATL v17+ requires `@testing-library/dom`:

```bash
npm install --save-dev @testing-library/angular @testing-library/dom
```

Or: `ng add @testing-library/angular`

---

## Quick Start

### Basic render

```typescript
import { render, screen, fireEvent } from '@testing-library/angular';
import { MyComponent } from './my.component';

it('renders and responds to click', async () => {
  await render(MyComponent);
  expect(screen.getByRole('heading', { name: /welcome/i })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));
  expect(screen.getByText(/success/i)).toBeInTheDocument();
});
```

### With providers (e.g. NgRx, Router)

```typescript
await render(MyComponent, {
  providers: [
    provideStore({ products: productReducer }),
    provideEffects(ProductEffects),
    provideRouter([]),
  ],
  imports: [ReactiveFormsModule],
  inputs: { title: 'Test' },
  on: { submit: jest.fn() },
});
```

---

## Query Priority

1. **`getByRole`** – `getByRole('button', { name: /submit/i })`
2. **`getByLabelText`** – Forms
3. **`getByText`** – Non-interactive content
4. **`getByPlaceholderText`** – Only if no label
5. **`getByTestId`** – Last resort

---

## Key Behaviors

- **`fireEvent`** – ATL runs `detectChanges()` after events
- **`findBy`** – Runs change detection before querying (async)
- **`waitFor`** – Runs change detection before callback
- **`render`** – Imports `NoopAnimationsModule` by default

---

## Render Options (Common)

| Option | Purpose |
|--------|---------|
| `inputs` | Set `@Input()` / `input()` values |
| `on` | Subscribe to `@Output()` / `EventEmitter` |
| `providers` | Module-level DI |
| `componentProviders` | Component-level DI |
| `imports` | Modules/components to import |
| `declarations` | Components, directives, pipes |
| `routes` | Router config for `navigate()` |

---

## Rerender

```typescript
const { rerender } = await render(MyComponent, { inputs: { count: 5 } });
await rerender({ inputs: { count: 10 }, partialUpdate: true });
```

---

## When to Use data-testid

Only when: no semantic role/label, dynamic text, or multiple elements share role/label.

---

## Anti-Patterns

- ❌ Using `fixture.componentInstance` to assert internal state
- ❌ Querying by class or ID
- ❌ Testing implementation details instead of user-visible behavior

---

## Additional Resources

- [reference.md](reference.md) – Full API
- [TESTING.md](../../../Documents/TESTING.md) – Project testing guide
- [Angular Testing Library](https://testing-library.com/docs/angular-testing-library/intro/)
