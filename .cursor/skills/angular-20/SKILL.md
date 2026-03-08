---
name: angular-20
description: Provides Angular 20+ patterns, Signals, new control flow, standalone components, and modern APIs. Use when building or refactoring Angular apps, working with Signals, @if/@for/@switch, resource(), or Angular v20+ features.
---

# Angular 20+ Development

Reference: [Angular v20 Docs](https://v20.angular.dev/overview)

## Core Principles

- **Signals-first reactivity**: Prefer `signal()`, `computed()`, and `effect()` over RxJS for component state.
- **Standalone components**: New components are standalone by default; add to `imports` array.
- **New control flow**: Use `@if`, `@for`, `@switch` instead of `*ngIf`, `*ngFor`, `*ngSwitch`.
- **Build pipeline**: Angular CLI uses Vite and esbuild for fast builds.

---

## Signals

### Writable signals

```typescript
import { signal } from '@angular/core';

const count = signal(0);
count.set(3);
count.update(v => v + 1);
```

### Computed signals

```typescript
import { computed } from '@angular/core';

const doubleCount = computed(() => count() * 2);
```

### Component inputs/outputs as signals

```typescript
import { input, output, model } from '@angular/core';

@Component({...})
export class UserCard {
  // Input signal (read-only)
  userName = input.required<string>();
  // Two-way binding
  selected = model<boolean>(false);
  // Output
  clicked = output<void>();
}
```

### Effects

Use sparingly—for side effects (logging, DOM, localStorage). Avoid for state propagation; use `computed` instead.

```typescript
constructor() {
  effect(() => {
    console.log('Count:', count());
  });
}
```

---

## New Control Flow

### @if / @else if / @else

```html
@if (a > b) {
  <p>{{a}} is greater</p>
} @else if (b > a) {
  <p>{{b}} is greater</p>
} @else {
  <p>Equal</p>
}
```

### @for with track

Always use `track` with a unique identifier for performance.

```html
@for (item of items; track item.id) {
  <li>{{ item.name }}</li>
} @empty {
  <li>No items</li>
}
```

### @switch

```html
@switch (userRole) {
  @case ('admin') { <app-admin-panel /> }
  @case ('editor') { <app-editor-panel /> }
  @default { <app-viewer-panel /> }
}
```

---

## Async Data with resource()

For async data (e.g. HTTP), use `resource()` instead of manual `Observable` + `async` pipe.

```typescript
import { resource, computed } from '@angular/core';

const userId = signal('123');
const userResource = resource({
  params: () => ({ id: userId() }),
  loader: ({ params, abortSignal }) =>
    fetch(`/api/users/${params.id}`, { signal: abortSignal }).then(r => r.json()),
});

// Derived signal
const userName = computed(() =>
  userResource.hasValue() ? userResource.value().name : 'Loading...'
);
```

Template usage:

```html
@if (userResource.isLoading()) {
  <p>Loading...</p>
} @else if (userResource.error()) {
  <p>Error: {{ userResource.error() }}</p>
} @else if (userResource.hasValue()) {
  <p>{{ userResource.value().name }}</p>
}
```

---

## Standalone Components

Components are standalone by default. Import dependencies in the decorator:

```typescript
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, UserCard],
  template: `...`,
})
export class UserProfile {}
```

---

## Deferred Loading with @defer

Lazy-load template blocks for better initial load:

```html
@defer (on viewport) {
  <app-heavy-chart />
} @loading {
  <span>Loading chart...</span>
} @error {
  <span>Failed to load</span>
}
```

Triggers: `on viewport`, `on idle`, `on interaction`, `on hover`, `on immediate`, `when condition`.

---

## Component Checklist

- [ ] Use `input()`, `output()`, `model()` for component API
- [ ] Prefer `@if`/`@for`/`@switch` over structural directives
- [ ] Use `track` in `@for` with unique id
- [ ] Use `resource()` for async/HTTP data when appropriate
- [ ] Add components to `imports` (standalone)
- [ ] Use `@defer` for below-the-fold or heavy components

---

## Common Pitfalls

1. **Don't use effects for state propagation** → use `computed`
2. **Don't forget `track` in @for** → causes poor diffing performance
3. **Don't mix old and new patterns** → migrate `*ngIf` → `@if`, etc.
4. **resource() is experimental** → check [release notes](https://v20.angular.dev/guide/signals/reference/releases) before production

---

## Quick Reference Links

- [Signals](https://v20.angular.dev/guide/signals)
- [Control flow](https://v20.angular.dev/guide/templates/control-flow)
- [resource()](https://v20.angular.dev/guide/signals/resource)
- [Components](https://v20.angular.dev/guide/components)
- [@defer](https://v20.angular.dev/guide/templates/defer)
- [SSR](https://v20.angular.dev/guide/ssr)
