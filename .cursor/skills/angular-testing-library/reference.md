# Angular Testing Library – API Reference

## render()

### By component type

```typescript
await render(AppComponent)
```

### By template (directives, custom bindings)

```typescript
await render('<app-component [value]="47"></app-component>', {
  declarations: [AppComponent],
  componentProperties: { anotherValue: 'x', sendValue: jest.fn() },
})
```

## RenderOptions

### inputs

Set `@Input` / `input()` properties.

```typescript
await render(AppComponent, {
  inputs: { counterValue: 10, ...aliasedInput('alias', 'value') },
})
```

### on

Subscribe to `EventEmitter` / `@Output`.

```typescript
await render(AppComponent, {
  on: { send: jest.fn() },
})
```

### bindings (Angular signals)

```typescript
import { inputBinding, outputBinding, twoWayBinding, signal } from '@angular/core'

await render(AppComponent, {
  bindings: [
    inputBinding('greeting', () => 'Hello'),
    twoWayBinding('name', signal('John')),
    outputBinding('submitValue', e => console.log(e)),
  ],
})
```

### declarations / providers / imports / routes

- `declarations` – Components, directives, pipes
- `providers` – Module-level DI
- `componentProviders` – Component-level DI
- `imports` – Modules (NoopAnimationsModule added by default)
- `routes` – Router config for `navigate()`

### Other options

| Option | Default | Purpose |
|--------|---------|---------|
| `detectChangesOnRender` | `true` | Run change detection after render |
| `autoDetectChanges` | `true` | Auto detect changes on events |
| `excludeComponentDeclaration` | `false` | Use when component is in imported module |

### Deprecated

- `componentInputs` → `inputs`
- `componentOutputs` → `on`
- `componentProperties` → `inputs` + `on`

## RenderResult

| Property | Purpose |
|----------|---------|
| `container` | DOM node of rendered component |
| `debug()` | Print DOM with syntax highlighting |
| `rerender(options)` | Update inputs, triggers `ngOnChanges` |
| `detectChanges()` | Trigger change detection |
| `fixture` | Angular `ComponentFixture` |
| `navigate(path \| element)` | Navigate via router |

## Query types

| Type | 0 matches | 1 match | >1 | Async |
|------|-----------|---------|-----|-------|
| `getBy*` | throws | element | throws | No |
| `queryBy*` | `null` | element | throws | No |
| `findBy*` | throws | element | throws | Yes |

## rerender with partialUpdate

```typescript
const { rerender } = await render(Counter, { inputs: { count: 4, name: 'Sarah' } })
await rerender({ inputs: { count: 7 }, partialUpdate: true })
// count=7, name stays 'Sarah' (not cleared)
```
