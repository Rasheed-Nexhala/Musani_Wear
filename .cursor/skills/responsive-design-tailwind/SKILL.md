---
name: responsive-design-tailwind
description: Implements mobile and tablet responsive design using Tailwind CSS following world standards (mobile-first, WCAG touch targets, content-based breakpoints). Use when building or refactoring Angular components for Musani Wear, implementing responsive layouts, fixing viewport issues, or when the user mentions mobile, tablet, responsive, breakpoints, or viewport.
---

# Responsive Design with Tailwind (Musani Wear)

Mobile and tablet responsive design using Tailwind CSS, aligned with industry standards and the Musani Wear design system. Applies to the complete Musani Wear project (public site, admin panel, product cards, forms, navigation).

---

## Core Principle: Mobile-First

Always write base styles for the smallest viewport first, then enhance for larger screens. Over 70% of global traffic is mobile; Google uses mobile-first indexing.

```html
<!-- Base = mobile; md: = tablet; lg: = desktop -->
<div class="px-4 md:px-8 lg:px-12">
  <h1 class="text-2xl md:text-3xl lg:text-4xl">Title</h1>
</div>
```

---

## Breakpoints (Tailwind Defaults)

| Prefix | Min Width | Device Type | Usage |
|--------|-----------|-------------|-------|
| *(base)* | 0px | Mobile phones | Default styles |
| `sm:` | 640px | Large phones, small tablets | Phablets |
| `md:` | 768px | Tablets portrait | Primary tablet breakpoint |
| `lg:` | 1024px | Tablets landscape, laptops | Desktop start |
| `xl:` | 1280px | Desktops | Wide layouts |
| `2xl:` | 1536px | Large desktops | Max content width |

**World standards mapping:**
- Mobile: 320px–480px (base)
- Tablet: 481px–768px (`sm:` to `md:`)
- Small desktop: 769px–1024px (`md:` to `lg:`)
- Large desktop: 1025px+ (`lg:` and up)

---

## Layout Patterns

### Container

```html
<div class="max-w-6xl mx-auto px-4 md:px-8">
  <!-- Content -->
</div>
```

- Mobile: 16px horizontal padding
- Tablet+: 32px horizontal padding
- Max width: 1280px (6xl)

### Product Grid

```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
  <!-- Product cards -->
</div>
```

- Mobile: 1 column
- Tablet (sm): 2 columns
- Desktop (lg): 4 columns

### Feature / Section Grid

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
  <!-- Feature items -->
</div>
```

### Two-Column Layout (Product Detail)

```html
<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
  <div class="lg:col-span-2"><!-- Main image --></div>
  <div class="lg:col-span-1"><!-- Product info --></div>
</div>
```

---

## Typography Scaling

Scale headings and body text for readability across viewports:

```html
<!-- Hero / Display -->
<h1 class="text-3xl sm:text-4xl md:text-5xl font-display font-bold">

<!-- Page title -->
<h1 class="text-2xl md:text-3xl lg:text-4xl font-display font-bold">

<!-- Section heading -->
<h2 class="text-xl md:text-2xl lg:text-3xl font-display font-semibold">

<!-- Body text: keep 1rem on mobile, optionally larger on desktop -->
<p class="text-base md:text-lg font-body">
```

---

## Touch Targets (WCAG 2.1)

Minimum interactive element sizes for mobile accessibility:

| Platform | Minimum | Recommended |
|----------|---------|-------------|
| iOS HIG | 44×44px | 48×48px |
| Android | 48×48px | 48×48px |
| WCAG 2.5.5 | 44×44px | — |

**Apply to all buttons, links, and icon buttons:**

```html
<button class="min-h-[48px] min-w-[48px] px-4 py-3">
  Action
</button>

<!-- Icon-only button -->
<button class="min-h-[48px] min-w-[48px] flex items-center justify-center p-2" aria-label="Menu">
  <svg class="w-6 h-6">...</svg>
</button>
```

**Gap between touch targets:** Minimum 8px; 12px recommended.

---

## Navigation Patterns

### Navbar (Sticky)

```html
<nav class="sticky top-0 z-40 bg-bg-primary border-b border-border">
  <div class="max-w-6xl mx-auto px-4 md:px-8">
    <div class="flex items-center justify-between h-16 md:h-20">
      <!-- Logo: smaller on mobile -->
      <a href="/" class="font-display text-2xl md:text-3xl font-bold">Musani Wear</a>

      <!-- Desktop nav: hidden on mobile -->
      <div class="hidden md:flex items-center gap-8">...</div>

      <!-- Mobile menu toggle: visible only on mobile -->
      <button class="md:hidden min-h-[48px] min-w-[48px]" aria-label="Open menu">...</button>
    </div>
  </div>
</nav>
```

### Mobile Drawer (Slide-in)

- Toggle: `md:hidden` (visible only below 768px)
- Drawer: `fixed inset-y-0 right-0 w-64 md:hidden`, slide-in animation
- Backdrop: `fixed inset-0 bg-black/50` with click-to-close

---

## Spacing Scale (Responsive)

```html
<!-- Section padding -->
<section class="py-12 md:py-16 lg:py-24 px-4 md:px-8">

<!-- Card padding -->
<div class="p-4 md:p-6">

<!-- Gap between items -->
<div class="flex gap-3 md:gap-4 lg:gap-6">
```

---

## Show / Hide by Viewport

```html
<!-- Hide on mobile, show on tablet+ -->
<div class="hidden md:block">Desktop only</div>

<!-- Show on mobile, hide on tablet+ -->
<div class="md:hidden">Mobile only</div>

<!-- Show text on larger screens only -->
<span class="hidden sm:inline">Full label</span>
<span class="sm:hidden">Short</span>
```

---

## Images & Media

- **Aspect ratio:** Use `aspect-ratio: 3/4` for product images (portrait dresses)
- **Object fit:** `object-cover` for consistent cropping
- **Responsive images:** Use `srcset` or responsive `width` for performance

```html
<div class="relative w-full" style="aspect-ratio: 3/4;">
  <img src="..." alt="..." class="w-full h-full object-cover" loading="lazy" />
</div>
```

---

## Forms (Mobile-Optimized)

- Full-width inputs on mobile: `w-full`
- Larger tap targets: `min-h-[48px] py-3 px-4`
- Stack labels above inputs on small screens
- Use `inputmode`, `autocomplete` for better mobile keyboards

```html
<input
  type="tel"
  inputmode="numeric"
  class="w-full min-h-[48px] px-4 py-3 text-base"
  placeholder="Phone number"
/>
```

---

## Checklist Before Shipping

- [ ] Base styles work at 320px width (iPhone SE)
- [ ] No horizontal scroll at any viewport
- [ ] All interactive elements ≥ 48×48px
- [ ] Text readable without zoom (min 16px body)
- [ ] Images scale correctly (aspect-ratio, object-cover)
- [ ] Navigation usable on mobile (drawer or bottom nav)
- [ ] Forms usable on mobile (full-width, large inputs)
- [ ] Test in portrait and landscape on real devices or DevTools

---

## Additional Resources

- Detailed breakpoint patterns and component examples: [reference.md](reference.md)
- Musani design tokens and component specs: [musani-design-system](../musani-design-system/SKILL.md)
- Full design system: [Documents/DESIGN_SYSTEM.md](../../../Documents/DESIGN_SYSTEM.md)
