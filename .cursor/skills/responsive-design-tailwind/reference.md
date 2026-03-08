# Responsive Design — Reference

Detailed patterns, component examples, and edge cases for Musani Wear responsive implementation.

---

## 1. Breakpoint Decision Matrix

| Scenario | Use | Example |
|----------|-----|---------|
| Layout changes (columns → rows) | `md:` or `lg:` | 1-col → 2-col → 4-col grid |
| Typography scaling | `md:` for first step | `text-2xl md:text-3xl lg:text-4xl` |
| Spacing/padding | `md:` for tablet | `px-4 md:px-8` |
| Hide/show elements | `md:` for nav toggle | `hidden md:flex` |
| Fine-tune at large desktop | `xl:` or `2xl:` | `max-w-6xl mx-auto` |

---

## 2. Product Card (Responsive)

```html
<div class="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-base transition-shadow group">
  <!-- Image: 3:4 aspect, consistent across viewports -->
  <div class="relative w-full" style="aspect-ratio: 3/4;">
    <img
      src="..."
      alt=""
      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    />
  </div>
  <!-- Content: padding scales -->
  <div class="p-4 md:p-6">
    <h3 class="font-display text-lg md:text-xl font-semibold text-text-dark mb-2">Product Name</h3>
    <p class="font-body text-sm text-text-medium line-clamp-2 mb-4">Description</p>
    <div class="flex items-baseline gap-2 mb-4">
      <span class="font-body text-base md:text-lg font-bold text-primary-dark">₹2,999</span>
    </div>
    <button class="w-full min-h-[48px] px-4 py-3 rounded-full bg-primary-dark text-white font-semibold">
      Ask Availability
    </button>
  </div>
</div>
```

---

## 3. Admin Sidebar (Mobile)

- Desktop: Fixed sidebar `w-64 md:block`
- Mobile: `md:hidden` sidebar; FAB `fixed bottom-6 right-6 md:hidden` to toggle
- Sidebar slides in from left: `-translate-x-full` when closed, `translate-x-0` when open
- Add `overflow-hidden` on body when drawer open to prevent scroll

---

## 4. Modal / Dialog

- Full-screen on mobile: `w-full h-full max-w-none max-h-none rounded-none`
- Centered on desktop: `md:max-w-md md:rounded-lg md:max-h-[90vh]`
- Backdrop: `fixed inset-0 bg-black/50` with `touch-action: none` to prevent scroll-through

---

## 5. Tables (Admin)

- Mobile: Card layout or horizontal scroll
- Desktop: Standard table

```html
<!-- Mobile: stacked cards -->
<div class="md:hidden space-y-4">
  <div *ngFor="let item of items" class="border rounded-lg p-4">
    <div class="font-semibold">{{ item.name }}</div>
    <div class="text-sm text-text-medium">{{ item.price }}</div>
  </div>
</div>

<!-- Desktop: table -->
<table class="hidden md:table w-full">
  ...
</table>
```

---

## 6. Orientation Considerations

- Portrait: Often single column, stacked layouts
- Landscape: May fit 2 columns on small tablets
- Use `aspect-ratio` and `object-cover` so images adapt without distortion

---

## 7. Safe Area Insets

For notched devices (iPhone X+), ensure content doesn't sit under the notch:

```css
/* In global styles if needed */
.safe-top {
  padding-top: env(safe-area-inset-top);
}
.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
```

---

## 8. Content-Based Breakpoints

When layout breaks visually (not just at device width), use `min-w-` or `container` queries:

```html
<!-- Flex wraps when items can't fit -->
<div class="flex flex-wrap gap-4">
  ...
</div>

<!-- Or use Tailwind container queries (Tailwind v4) -->
<div class="@container">
  <div class="@md:grid-cols-2">...</div>
</div>
```

---

## 9. Responsive Typography (Fluid)

For smooth scaling without discrete breakpoints:

```css
/* Optional: fluid type between min and max */
h1 {
  font-size: clamp(1.5rem, 5vw, 3rem);
}
```

---

## 10. Testing Viewports

| Device | Width | Height |
|--------|-------|--------|
| iPhone SE | 375px | 667px |
| iPhone 14 | 390px | 844px |
| iPad Mini | 768px | 1024px |
| iPad Pro | 1024px | 1366px |
| Desktop | 1280px | 800px |

Chrome DevTools: Toggle device toolbar (Cmd+Shift+M) and test these breakpoints.
