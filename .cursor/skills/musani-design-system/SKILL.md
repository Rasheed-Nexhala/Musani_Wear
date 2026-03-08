---
name: musani-design-system
description: Implements Musani Wear brand UI components, colors, typography, and layout following the design system. Use when building or styling Angular components, Tailwind classes, or UI for Musani Wear boutique website, dress showcase, or admin panel.
---

# Musani Wear Design System

Design system for Musani Wear—a premium South Asian fashion boutique. Ensures consistent, elegant, accessible UI across all platforms.

## Design Principles

1. **Clarity through Elegance** — Simplicity serves luxury; remove unnecessary elements
2. **Hierarchy through Color** — Gold (#C9A84C) guides attention to CTAs and products
3. **Refinement through Spacing** — Generous whitespace conveys premium positioning
4. **Consistency Builds Trust** — Every component follows predictable patterns
5. **Accessibility is Inclusive** — WCAG 2.1 AA is non-negotiable
6. **Performance Respects Users** — Fast loading and smooth interactions feel premium

## Quick Reference: Design Tokens

### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `primary-dark` | #C9A84C | CTAs, prices, active nav, focus rings |
| `primary-light` | #E8D5A3 | Hover states, subtle backgrounds |
| `primary-bg` | #F5F0E6 | Hover card backgrounds, disabled |
| `bg-primary` | #FAF7F0 | Main page background (ivory) |
| `bg-white` | #FFFFFF | Cards, modals, inputs |
| `text-dark` | #1A1A1A | Headings, primary text |
| `text-medium` | #4A4A4A | Body text |
| `text-light` | #9A9A9A | Helper text, captions |
| `success` | #2E7D32 | In-stock, success states |
| `error` | #C62828 | Out-of-stock, errors |
| `whatsapp` | #25D366 | WhatsApp buttons |
| `border` | #E8E0D5 | Borders, dividers |

### Typography

- **Display font:** Playfair Display (headings, brand)
- **Body font:** Inter (body text)
- **Scale:** Display 3rem → H1 2.25rem → H2 1.875rem → H3 1.5rem → H4 1.25rem → Body 1rem → Small 0.875rem → Caption 0.75rem

### Spacing (8px base)

`xs:4px` | `sm:8px` | `md:16px` | `lg:24px` | `xl:32px` | `2xl:48px` | `3xl:64px` | `4xl:96px`

### Border Radius

`sm:4px` (badges) | `md:8px` (cards, inputs) | `lg:16px` (modals) | `full` (CTAs, pills)

### Shadows

`shadow-sm` (cards at rest) | `shadow-base` (cards hover) | `shadow-md` (dropdowns) | `shadow-lg` (modals) | `shadow-gold` (premium highlights)

---

## Component Patterns

### Primary Button

```html
<button class="
  bg-primary-dark text-white
  hover:bg-opacity-90 active:bg-opacity-80
  focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
  px-6 py-3 rounded-full
  font-body font-semibold text-base
  transition-all duration-200
  min-h-[48px] min-w-[48px]
">
  Action
</button>
```

### Secondary Button

```html
<button class="
  bg-white text-primary-dark border-2 border-primary-dark
  hover:bg-primary-light active:bg-primary-bg
  focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-offset-2
  px-6 py-3 rounded-full font-body font-semibold text-base
  transition-all duration-200 min-h-[48px]
">
  Secondary
</button>
```

### WhatsApp Button

```html
<a href="https://wa.me/919876543210?text=..." target="_blank" rel="noopener noreferrer"
   class="inline-flex items-center gap-2 bg-whatsapp text-white hover:opacity-90
          px-4 py-2 rounded-full font-body font-semibold text-sm
          focus:outline-none focus:ring-2 focus:ring-whatsapp focus:ring-offset-2
          min-h-[44px]" aria-label="Send WhatsApp message">
  <!-- Icon + text -->
</a>
```

### Product Card Structure

- White bg, `rounded-lg`, `shadow-sm` → `shadow-base` on hover
- Image: 3:4 aspect ratio, `object-cover`, zoom on hover (`group-hover:scale-105`)
- Badges: top-left (In Stock / Out of Stock), top-right (favorite icon)
- Content: `p-4 md:p-6`, product name (H3), description (line-clamp-2), price (gold), color swatches, CTA button

### Status Badges

```html
<!-- In Stock -->
<span class="inline-block bg-success text-white px-3 py-1 rounded-full font-body text-caption font-semibold">In Stock</span>
<!-- Out of Stock -->
<span class="inline-block bg-error text-white px-3 py-1 rounded-full font-body text-caption font-semibold">Out of Stock</span>
```

### Form Input (floating label pattern)

- `border-2 border-border`, `rounded-md`, `px-4 py-3`
- Focus: `focus:border-primary-dark focus:ring-2 focus:ring-primary-dark focus:ring-opacity-20`
- Error: `border-error`, `aria-invalid`, `aria-describedby` for error message
- Use `peer` + `peer-placeholder-shown` / `peer-focus` for floating label

### Navigation Bar

- `bg-bg-primary`, `border-b border-border`, `sticky top-0 z-40`
- Height: `h-16 md:h-20`
- Logo: Playfair Display, `text-2xl md:text-3xl font-bold`
- Nav links: `hover:text-primary-dark`, active: `border-b-2 border-primary-dark`
- Mobile: hamburger → slide-in drawer from right, `shadow-lg`

### Empty State

- Centered icon (text-light), heading (H3), description, primary CTA button

### Error Banner

- `bg-error bg-opacity-10 border-l-4 border-error`, `role="alert"`, `aria-live="polite"`

### Loading States

- **Spinner:** `animate-spin rounded-full border-2 border-border border-t-primary-dark`
- **Skeleton:** `animate-pulse` + `bg-border rounded` blocks

---

## Layout Rules

- **Container:** `max-w-6xl mx-auto px-4 md:px-8`
- **Product grid:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`
- **Feature grid:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`
- **Page section:** `py-4xl` (96px) top/bottom, `px-2xl` (48px) sides

---

## Accessibility Checklist

- [ ] All interactive elements: `min-h-[44px] min-w-[44px]` (touch targets)
- [ ] Focus: `focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-offset-2`
- [ ] Icon buttons: `aria-label` required
- [ ] Form inputs: `aria-invalid`, `aria-describedby` for errors
- [ ] Skip link: `<a href="#main" class="sr-only focus:not-sr-only">Skip to main content</a>`
- [ ] Images: descriptive `alt` for products; `alt=""` for decorative
- [ ] Respect `prefers-reduced-motion` in global CSS

---

## Tailwind Config

Ensure `tailwind.config.js` extends theme with design tokens. See [reference.md](reference.md) for full config.

---

## Additional Resources

- Full design spec: [Documents/DESIGN_SYSTEM.md](../../Documents/DESIGN_SYSTEM.md)
- Detailed tokens, component markup, animations: [reference.md](reference.md)
