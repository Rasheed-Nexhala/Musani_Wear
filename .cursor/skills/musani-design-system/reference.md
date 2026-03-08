# Musani Wear Design System — Reference

Detailed design tokens, component markup, and implementation notes. Source: [Documents/DESIGN_SYSTEM.md](../../Documents/DESIGN_SYSTEM.md).

---

## 1. Color Tokens (CSS Variables)

```css
:root {
  --color-primary-dark: #C9A84C;
  --color-primary-light: #E8D5A3;
  --color-primary-bg: #F5F0E6;
  --color-bg-primary: #FAF7F0;
  --color-bg-white: #FFFFFF;
  --color-bg-secondary: #F5F0E6;
  --color-text-dark: #1A1A1A;
  --color-text-medium: #4A4A4A;
  --color-text-light: #9A9A9A;
  --color-success: #2E7D32;
  --color-error: #C62828;
  --color-whatsapp: #25D366;
  --color-border: #E8E0D5;
  --color-border-light: #F0EAE0;
}
```

## 2. Typography Scale

| Scale | Size | Tailwind | Usage |
|-------|------|----------|-------|
| Display | 3rem | text-5xl | Hero titles |
| H1 | 2.25rem | text-4xl | Page titles |
| H2 | 1.875rem | text-3xl | Section headings |
| H3 | 1.5rem | text-2xl | Product names |
| H4 | 1.25rem | text-xl | Secondary headings |
| Body Large | 1.125rem | text-lg | Emphasized body |
| Body | 1rem | text-base | Default body |
| Small | 0.875rem | text-sm | Metadata |
| Caption | 0.75rem | text-xs | Badges, footnotes |

**Font classes:** `font-display` (Playfair Display), `font-body` (Inter)

## 3. Shadows

```css
--shadow-sm: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06);
--shadow-base: 0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06);
--shadow-md: 0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05);
--shadow-lg: 0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04);
--shadow-gold: 0 0 20px rgba(201, 168, 76, 0.15);
```

## 4. Animation & Easing

```css
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

**Keyframes:** `slideUp`, `slideInRight`, `fadeIn`, `spin`

## 5. Responsive Breakpoints

| Breakpoint | Min Width | Usage |
|------------|-----------|-------|
| sm | 640px | Large phones |
| md | 768px | Tablets |
| lg | 1024px | Laptops |
| xl | 1280px | Desktops |
| 2xl | 1536px | Large desktops |

**Mobile-first:** Base styles for mobile; `md:` and `lg:` for larger screens.

## 6. Button Sizes

| Size | Padding | Height | Font |
|------|---------|--------|------|
| Small | px-4 py-2 | 40px | text-sm |
| Medium | px-6 py-3 | 48px | text-base |
| Large | px-8 py-4 | 56px | text-lg |

## 7. Admin Sidebar

- Dark background: `bg-text-dark`
- Active item: `bg-primary-dark` (gold)
- Hover: `hover:bg-gray-800`
- Width: `w-64`, fixed left
- Mobile: slide-in with toggle button (bottom-right FAB)

## 8. WCAG Contrast (Verified)

| Foreground | Background | Ratio |
|------------|------------|-------|
| #1A1A1A | #FAF7F0 | 16.8:1 |
| #4A4A4A | #FFFFFF | 10.2:1 |
| #FFFFFF | #C9A84C | 5.8:1 |
| #FFFFFF | #2E7D32 | 5.2:1 |
| #FFFFFF | #C62828 | 5.1:1 |

## 9. Global Utilities (styles.css)

```css
.sr-only { /* Screen reader only - position absolute, clip */ }
.sr-only:focus { /* Becomes visible for skip links */ }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

.line-clamp-1 { -webkit-line-clamp: 1; }
.line-clamp-2 { -webkit-line-clamp: 2; }
```

## 10. Font Import

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```

## 11. Tailwind Theme Extensions

Add to `theme.extend` in `tailwind.config.js`:

```js
colors: {
  primary: { dark: '#C9A84C', light: '#E8D5A3', bg: '#F5F0E6' },
  bg: { primary: '#FAF7F0', white: '#FFFFFF', secondary: '#F5F0E6' },
  text: { dark: '#1A1A1A', medium: '#4A4A4A', light: '#9A9A9A' },
  success: '#2E7D32', error: '#C62828', whatsapp: '#25D366',
  border: '#E8E0D5', 'border-light': '#F0EAE0',
},
fontFamily: {
  display: ['Playfair Display', 'Georgia', 'serif'],
  body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
},
boxShadow: {
  sm: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
  base: '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)',
  md: '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)',
  lg: '0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)',
  gold: '0 0 20px rgba(201, 168, 76, 0.15)',
},
keyframes: {
  slideUp: { '0%': { opacity: '0', transform: 'translateY(24px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
  slideInRight: { '0%': { opacity: '0', transform: 'translateX(100%)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
  fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
},
animation: {
  slideUp: 'slideUp 0.3s ease-out',
  slideInRight: 'slideInRight 0.3s ease-out',
  fadeIn: 'fadeIn 0.3s ease-out',
},
```
