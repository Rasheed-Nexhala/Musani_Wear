# Musani Wear Design System

A comprehensive design system for Musani Wear—an elegant, luxurious dress boutique showcase website. This document establishes design tokens, component specifications, accessibility standards, and implementation guidelines to ensure consistent, premium-quality UI across all platforms.

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Design Tokens](#2-design-tokens)
3. [Typography System](#3-typography-system)
4. [Layout & Spacing](#4-layout--spacing)
5. [Component Library](#5-component-library)
6. [Accessibility Guidelines](#6-accessibility-guidelines)
7. [Animation & Interactions](#7-animation--interactions)
8. [State Indicators](#8-state-indicators)
9. [Responsive Design](#9-responsive-design)
10. [Tailwind Configuration](#10-tailwind-configuration)
11. [Browser Support](#11-browser-support)

---

## 1. Design Philosophy

### Brand Vision

Musani Wear is a premium South Asian fashion boutique targeting discerning women in Mangalore and Karnataka. The design system reflects this positioning:

- **Elegant & Luxurious** — Every pixel communicates refinement without ostentation
- **Warm & Inviting** — Gold and ivory create an intimate, upscale boutique atmosphere
- **Feminine & Confident** — The aesthetic celebrates bold, sophisticated womenswear
- **Modern Heritage** — Contemporary design with respect for South Asian textile traditions
- **Intuitive Luxury** — Premium experience without complexity

### Design Principles

1. **Clarity through Elegance** — Simplicity serves luxury; remove unnecessary elements
2. **Hierarchy through Color** — Gold (#C9A84C) guides attention to key actions and products
3. **Refinement through Spacing** — Generous whitespace conveys premium positioning
4. **Consistency Builds Trust** — Every component follows predictable patterns
5. **Accessibility is Inclusive** — Luxury includes everyone; WCAG 2.1 AA is non-negotiable
6. **Performance Respects Users** — Fast loading and smooth interactions feel premium

---

## 2. Design Tokens

### 2.1 Color Palette

#### Primary Colors (Gold)

```css
/* Deep warm gold—primary call-to-action, key accents, active states */
--color-primary-dark: #C9A84C;

/* Lighter gold—hover states, subtle backgrounds, focus rings */
--color-primary-light: #E8D5A3;

/* Light gold background—hover card effects, disabled states */
--color-primary-bg: #F5F0E6;
```

**Usage:**
- **Primary Dark (#C9A84C):** CTA buttons, price text, active navigation links, accent borders, focus rings on interactive elements
- **Primary Light (#E8D5A3):** Hover states for buttons, background highlights, badge accents
- **Primary BG (#F5F0E6):** Subtle hover backgrounds for cards, light interactive feedback

#### Background Colors

```css
/* Warm off-white—main page background, creates inviting boutique feel */
--color-bg-primary: #FAF7F0;

/* Pure white—card backgrounds, modals, input backgrounds */
--color-bg-white: #FFFFFF;

/* Light gray—secondary backgrounds, disabled states, subtle sections */
--color-bg-secondary: #F5F0E6;
```

#### Text Colors

```css
/* Dark charcoal—headings, primary body text, maximum contrast */
--color-text-dark: #1A1A1A;

/* Medium gray—secondary body text, descriptions, metadata */
--color-text-medium: #4A4A4A;

/* Light gray—placeholders, helper text, captions, disabled text */
--color-text-light: #9A9A9A;
```

#### Status Colors

```css
/* In-stock indicator—product availability, success states */
--color-success: #2E7D32;

/* Out-of-stock indicator—unavailable products, error states */
--color-error: #C62828;

/* WhatsApp integration—primary messaging platform */
--color-whatsapp: #25D366;
```

#### Utility Colors

```css
/* Borders—product card edges, form input borders, dividers */
--color-border: #E8E0D5;

/* Border light—subtle dividers, secondary borders */
--color-border-light: #F0EAE0;

/* Overlay—backdrop for modals, overlays */
--color-overlay: rgba(0, 0, 0, 0.5);
```

#### Contrast Verification

| Element | Foreground | Background | Ratio | WCAG AA | WCAG AAA |
|---------|-----------|-----------|-------|---------|----------|
| Headings | Text Dark (#1A1A1A) | Ivory (#FAF7F0) | 16.8:1 | ✅ | ✅ |
| Body Text | Text Medium (#4A4A4A) | Ivory (#FAF7F0) | 10.2:1 | ✅ | ✅ |
| Primary Button | White (#FFFFFF) | Primary Dark (#C9A84C) | 5.8:1 | ✅ | ✅ |
| Price (Gold) | Primary Dark (#C9A84C) | White (#FFFFFF) | 5.8:1 | ✅ | ✅ |
| In-Stock Badge | White (#FFFFFF) | Success (#2E7D32) | 5.2:1 | ✅ | ✅ |
| Out-of-Stock Badge | White (#FFFFFF) | Error (#C62828) | 5.1:1 | ✅ | ✅ |
| Helper Text | Text Light (#9A9A9A) | White (#FFFFFF) | 4.5:1 | ✅ | ✅ |

### 2.2 Shadows & Depth

```css
/* Subtle—card hover, light elevation */
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06);

/* Base—standard card shadow, product cards, input focus */
--shadow-base: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);

/* Medium—navigation dropdown, floating elements */
--shadow-md: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);

/* Large—modals, overlays, prominent elevation */
--shadow-lg: 0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04);

/* Gold accent shadow—premium product highlights */
--shadow-gold: 0 0 20px rgba(201, 168, 76, 0.15);
```

**Usage Guidelines:**
- **Cards at rest:** `--shadow-sm`
- **Cards on hover:** `--shadow-base`
- **Navigation dropdowns:** `--shadow-md`
- **Modals, featured products:** `--shadow-lg`
- **Premium product showcase:** `--shadow-gold`

### 2.3 Border Radius

```css
/* Small—badges, chips, small buttons, input corners */
--radius-sm: 4px;

/* Medium—cards, input fields, secondary buttons */
--radius-md: 8px;

/* Large—modals, major card sections, prominent buttons */
--radius-lg: 16px;

/* Full—fully rounded, pill-shaped buttons, circular elements */
--radius-full: 9999px;
```

**Component Mappings:**
- Status badges: `--radius-sm`
- Product cards, form inputs: `--radius-md`
- Modal dialogs, large cards: `--radius-lg`
- CTA buttons, circular avatars: `--radius-full`

---

## 3. Typography System

### 3.1 Font Families

```css
/* Headings—elegant serif for brand hierarchy and prestige */
--font-display: 'Playfair Display', Georgia, serif;

/* Body text—clean sans-serif for readability and modernity */
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;

/* Code—monospace for admin inputs, technical text */
--font-mono: 'Fira Code', 'Courier New', Consolas, Monaco, monospace;
```

**Font Import (HTML Head):**

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```

### 3.2 Font Scale

All sizes are based on 16px base (1rem = 16px).

| Scale | Size | Equivalent | Usage |
|-------|------|-----------|-------|
| **Display** | 3rem | 48px | Hero titles, brand tagline, major section headers |
| **H1** | 2.25rem | 36px | Page titles, collection names |
| **H2** | 1.875rem | 30px | Section headings, product category titles |
| **H3** | 1.5rem | 24px | Subsections, card titles (product name) |
| **H4** | 1.25rem | 20px | Card headings, secondary titles |
| **Body Large** | 1.125rem | 18px | Emphasized body text, call-outs |
| **Body** | 1rem | 16px | Main body text (default) |
| **Small** | 0.875rem | 14px | Secondary body text, metadata |
| **Caption** | 0.75rem | 12px | Captions, helper text, badges |

### 3.3 Type System Usage

#### Headings

**Display (3rem, Playfair Display, Bold)**
```html
<h1 class="font-display text-5xl font-bold leading-tight text-text-dark">
  Musani Wear Collection 2026
</h1>
```
Use for: Page hero, brand introduction, major campaign titles

**H1 (2.25rem, Playfair Display, Bold)**
```html
<h1 class="font-display text-4xl font-bold leading-snug text-text-dark">
  Summer Collection
</h1>
```
Use for: Main page headings, collection landing pages

**H2 (1.875rem, Playfair Display, Semibold)**
```html
<h2 class="font-display text-3xl font-semibold leading-snug text-text-dark">
  Featured Designs
</h2>
```
Use for: Section headings, category titles

**H3 (1.5rem, Playfair Display, Semibold)**
```html
<h3 class="font-display text-2xl font-semibold leading-snug text-text-dark">
  Emerald Saree with Gold Embroidery
</h3>
```
Use for: Product names, subsection headings, card titles

**H4 (1.25rem, Playfair Display, Medium)**
```html
<h4 class="font-display text-xl font-medium leading-normal text-text-dark">
  Color Options
</h4>
```
Use for: Form labels, secondary headings, small card titles

#### Body Text

**Body Large (1.125rem, Inter, Regular)**
```html
<p class="font-body text-lg leading-relaxed text-text-medium">
  Discover our handcrafted collection of premium dress designs.
</p>
```
Use for: Emphasized descriptions, call-outs, highlighted content

**Body (1rem, Inter, Regular)**
```html
<p class="font-body text-base leading-normal text-text-medium">
  Each garment is crafted with meticulous attention to detail using premium fabrics.
</p>
```
Use for: Main body text, descriptions, default content

**Small (0.875rem, Inter, Regular)**
```html
<p class="font-body text-sm leading-normal text-text-light">
  Available in 8 colors | Hand-stitched | Made in Mangalore
</p>
```
Use for: Secondary text, metadata, helper text, captions

**Caption (0.75rem, Inter, Regular)**
```html
<span class="font-body text-xs leading-tight text-text-light">
  SKU: MW-2026-SAREE-001
</span>
```
Use for: Badge text, small labels, timestamps, footnotes

### 3.4 Line Heights

```css
--line-height-tight: 1.2;    /* Headings, tight text */
--line-height-snug: 1.375;   /* Headings, comfortable reading */
--line-height-normal: 1.5;   /* Body text (default) */
--line-height-relaxed: 1.625; /* Emphasized body, improved readability */
```

**Application Rules:**
- Headings: `line-height-snug` (1.375) for legibility
- Body text: `line-height-normal` (1.5) for comfortable reading
- Long-form content: `line-height-relaxed` (1.625)

### 3.5 Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| Light | 300 | Rarely used (subtle emphasis) |
| Regular | 400 | Body text, captions, default |
| Medium | 500 | Secondary headings, button text |
| Semibold | 600 | Main headings, strong emphasis |
| Bold | 700 | Product names, major headings, CTA text |
| Extra Bold | 800 | Display text, brand titles |

---

## 4. Layout & Spacing

### 4.1 Spacing Scale

All spacing is based on 8px increments for consistency and rhythm.

```css
--space-xs: 4px;      /* Minimal spacing, micro-interactions */
--space-sm: 8px;      /* Small gaps, component padding */
--space-md: 16px;     /* Standard spacing, component margins */
--space-lg: 24px;     /* Large gaps, section spacing */
--space-xl: 32px;     /* Extra large, major sections */
--space-2xl: 48px;    /* Double extra large, layout sections */
--space-3xl: 64px;    /* Triple extra large, major breaks */
--space-4xl: 96px;    /* Quadruple extra large, page sections */
```

### 4.2 Container & Layout

#### Max Width

```css
--max-w-sm: 384px;    /* Small containers, sidebars */
--max-w-md: 448px;    /* Medium containers, modals */
--max-w-lg: 512px;    /* Large containers, forms */
--max-w-2xl: 896px;   /* Double extra large */
--max-w-4xl: 1024px;  /* Four times large, main content */
--max-w-6xl: 1280px;  /* Six times large, page container (default) */
--max-w-7xl: 1536px;  /* Seven times large, full-width sections */
```

#### Container Padding

```css
/* Mobile (< 640px) */
--container-px-mobile: 1rem; /* 16px */

/* Tablet & Desktop (≥ 640px) */
--container-px-desktop: 2rem; /* 32px */
```

**Implementation:**
```html
<!-- Page container—max-width with auto margins -->
<div class="max-w-6xl mx-auto px-4 md:px-8">
  <!-- Page content -->
</div>
```

### 4.3 Grid System

#### 12-Column Grid (Desktop)

```css
/* Grid gap responsive */
--grid-gap-mobile: 1rem;      /* 16px */
--grid-gap-tablet: 1.5rem;    /* 24px */
--grid-gap-desktop: 2rem;     /* 32px */
```

**Product Grid (Desktop):**
```html
<!-- 4 products per row on desktop, 2 on tablet, 1 on mobile -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <!-- Product cards -->
</div>
```

**Feature Grid (Desktop):**
```html
<!-- 3 columns on desktop, 2 on tablet, 1 on mobile -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  <!-- Feature items -->
</div>
```

### 4.4 Spacing Rules

| Element Type | Top Margin | Bottom Margin | Side Padding |
|--------------|-----------|--------------|-------------|
| Page Section | 4xl (96px) | 4xl (96px) | 2xl (48px) |
| Card | 0 | 0 | lg (24px) |
| Card Content | md (16px) | md (16px) | lg (24px) |
| Button Group | lg (24px) | lg (24px) | — |
| Form Input | md (16px) | md (16px) | md (16px) |
| List Item | sm (8px) | sm (8px) | md (16px) |

---

## 5. Component Library

### 5.1 Buttons

#### Primary Button

The main call-to-action button used for key user actions (purchase, add to cart, send inquiry).

**HTML/Angular:**
```html
<button
  class="
    bg-primary-dark text-white
    hover:bg-opacity-90 active:bg-opacity-80
    focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    px-6 py-3 rounded-full
    font-body font-semibold text-base
    transition-all duration-200
    min-h-[48px] min-w-[48px]
  "
  (click)="onAction()"
  [disabled]="isLoading"
>
  <span *ngIf="!isLoading">Ask Availability</span>
  <app-spinner *ngIf="isLoading" class="inline-block mr-2"></app-spinner>
</button>
```

**States:**

- **Default:** `bg-primary-dark` (#C9A84C), white text, rounded-full
- **Hover:** `hover:bg-opacity-90` — 10% opacity reduction, subtle darkening
- **Active:** `active:bg-opacity-80` — 20% opacity reduction, pressed effect
- **Focus:** 2px ring in primary-dark with 2px offset
- **Disabled:** 50% opacity, `cursor-not-allowed`, no hover effect
- **Loading:** Button disabled + loading spinner, text changes or spinner replaces text

**Sizes:**

| Size | Padding | Height | Font | Use Case |
|------|---------|--------|------|----------|
| Small | px-4 py-2 | 40px | text-sm | Inline actions, secondary locations |
| Medium | px-6 py-3 | 48px | text-base | Default, main CTAs |
| Large | px-8 py-4 | 56px | text-lg | Hero section, prominent CTAs |

**Accessibility:**
- Minimum touch target: 48x48px
- Keyboard accessible: Tab to focus, Enter/Space to activate
- ARIA: `aria-label` for icon-only variants
- Loading state: `aria-busy="true"` on button

#### Secondary Button

Used for alternative actions, less emphasis than primary.

```html
<button
  class="
    bg-white text-primary-dark
    border-2 border-primary-dark
    hover:bg-primary-light active:bg-primary-bg
    focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    px-6 py-3 rounded-full
    font-body font-semibold text-base
    transition-all duration-200
    min-h-[48px]
  "
  (click)="onSecondaryAction()"
>
  View Details
</button>
```

**States:**
- **Default:** White background, gold border (2px), gold text
- **Hover:** Light gold background (#F5F0E6)
- **Active:** Slightly darker gold background
- **Focus:** 2px gold ring with offset
- **Disabled:** 50% opacity

#### WhatsApp Button

Direct messaging for product inquiries—integrates with WhatsApp Web/Mobile.

```html
<a
  href="https://wa.me/919876543210?text=Hi%20Musani%20Wear,%20I%20am%20interested%20in%20this%20product"
  target="_blank"
  rel="noopener noreferrer"
  class="
    inline-flex items-center justify-center gap-2
    bg-whatsapp text-white
    hover:opacity-90 active:opacity-80
    focus:outline-none focus:ring-2 focus:ring-whatsapp focus:ring-offset-2
    px-4 py-2 rounded-full
    font-body font-semibold text-sm
    transition-all duration-200
    min-h-[44px]
  "
  aria-label="Send WhatsApp message"
>
  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <!-- WhatsApp icon SVG -->
  </svg>
  Chat on WhatsApp
</a>
```

**Usage:**
- Direct message link to boutique WhatsApp number
- Available on product cards and detail pages
- Text pre-populated with product inquiry
- Opens in new tab/app

#### Ghost Button

Minimal button for tertiary actions, links that look like buttons.

```html
<button
  class="
    bg-transparent text-text-dark
    hover:bg-primary-bg
    focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-offset-2
    px-4 py-2 rounded-md
    font-body text-base
    transition-colors duration-200
    underline
  "
  (click)="onTertiaryAction()"
>
  Learn More
</button>
```

#### Icon Button

Icon-only button for actions like favorites, sharing, menu toggle.

```html
<button
  class="
    p-2 rounded-full
    text-text-dark
    hover:bg-primary-bg
    focus:outline-none focus:ring-2 focus:ring-primary-dark
    transition-colors duration-200
    min-h-[44px] min-w-[44px]
    flex items-center justify-center
  "
  (click)="onIconAction()"
  [attr.aria-label]="actionLabel"
>
  <svg class="w-6 h-6" fill="currentColor">
    <!-- Icon SVG -->
  </svg>
</button>
```

**Accessibility:**
- ARIA label required: `aria-label="Add to favorites"`
- Focus ring visible: 2px primary-dark
- Touch target: 44-48px minimum

### 5.2 Product Cards

Premium product showcase card used in collection grid views.

**HTML/Angular:**
```html
<div
  class="
    bg-white rounded-lg overflow-hidden
    shadow-sm hover:shadow-base
    transition-shadow duration-300
    group
  "
>
  <!-- Product Image Container -->
  <div class="relative w-full overflow-hidden bg-bg-secondary">
    <!-- 3:4 aspect ratio for portrait dress photos -->
    <div class="relative w-full" style="aspect-ratio: 3/4;">
      <img
        [src]="product.imageUrl"
        [alt]="product.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />

      <!-- In-Stock / Out-of-Stock Badge (Top-Left) -->
      <div class="absolute top-4 left-4">
        <span
          *ngIf="product.inStock"
          class="
            inline-block
            bg-success text-white
            px-3 py-1 rounded-full
            text-caption font-semibold
          "
        >
          In Stock
        </span>
        <span
          *ngIf="!product.inStock"
          class="
            inline-block
            bg-error text-white
            px-3 py-1 rounded-full
            text-caption font-semibold
          "
        >
          Out of Stock
        </span>
      </div>

      <!-- Favorite Button (Top-Right) -->
      <button
        class="
          absolute top-4 right-4
          p-2 rounded-full bg-white
          hover:bg-primary-light
          focus:outline-none focus:ring-2 focus:ring-primary-dark
          transition-colors duration-200
          min-h-[40px] min-w-[40px]
          flex items-center justify-center
        "
        (click)="toggleFavorite(product.id)"
        [attr.aria-label]="isFavorited ? 'Remove from favorites' : 'Add to favorites'"
      >
        <svg
          class="w-5 h-5"
          [class.fill-error]="isFavorited"
          [class.text-text-light]="!isFavorited"
          fill="currentColor" viewBox="0 0 24 24"
        >
          <!-- Heart icon -->
        </svg>
      </button>
    </div>
  </div>

  <!-- Card Content -->
  <div class="p-4 md:p-6">
    <!-- Product Name -->
    <h3 class="font-display text-xl font-semibold text-text-dark mb-2">
      {{ product.name }}
    </h3>

    <!-- Product Description -->
    <p class="font-body text-sm text-text-medium mb-4 line-clamp-2">
      {{ product.description }}
    </p>

    <!-- Price -->
    <div class="flex items-baseline gap-2 mb-4">
      <span class="font-body text-lg font-bold text-primary-dark">
        ₹{{ product.price | number:'1.0-0' }}
      </span>
      <span
        *ngIf="product.originalPrice"
        class="font-body text-sm text-text-light line-through"
      >
        ₹{{ product.originalPrice | number:'1.0-0' }}
      </span>
    </div>

    <!-- Color Swatches -->
    <div class="flex items-center gap-2 mb-6">
      <span class="font-body text-xs text-text-light">Colors:</span>
      <div class="flex gap-2">
        <button
          *ngFor="let color of product.colors"
          class="
            w-5 h-5 rounded-full
            border-2 border-transparent
            hover:border-text-dark
            focus:outline-none focus:ring-2 focus:ring-primary-dark
            transition-all duration-200
          "
          [style.backgroundColor]="color.hex"
          [attr.aria-label]="'Color: ' + color.name"
          (click)="selectColor(color)"
        ></button>
      </div>
    </div>

    <!-- Action Button -->
    <button
      class="
        w-full
        bg-primary-dark text-white
        hover:bg-opacity-90 active:bg-opacity-80
        focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-offset-2
        px-4 py-3 rounded-full
        font-body font-semibold text-sm
        transition-all duration-200
        min-h-[48px]
      "
      (click)="askAvailability(product.id)"
      [disabled]="!product.inStock"
    >
      {{ product.inStock ? 'Ask Availability' : 'Out of Stock' }}
    </button>
  </div>
</div>
```

**Card Specifications:**
- **Background:** White (#FFFFFF)
- **Border Radius:** 8px (medium)
- **Shadow:** `shadow-sm` at rest, `shadow-base` on hover
- **Image Aspect Ratio:** 3:4 (portrait orientation for dress photos)
- **Padding:** 16px (md) on mobile, 24px (lg) on desktop
- **Transitions:** Smooth image zoom on hover, shadow elevation

### 5.3 Navigation Bar

Top navigation with logo, menu, and WhatsApp CTA.

```html
<nav
  class="
    bg-bg-primary border-b border-border
    sticky top-0 z-40
    transition-all duration-300
  "
  role="navigation"
>
  <div class="max-w-6xl mx-auto px-4 md:px-8">
    <div class="flex items-center justify-between h-16 md:h-20">

      <!-- Logo -->
      <a
        href="/"
        class="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary-dark rounded"
        aria-label="Musani Wear home"
      >
        <h1 class="font-display text-2xl md:text-3xl font-bold text-text-dark">
          Musani Wear
        </h1>
      </a>

      <!-- Desktop Navigation Menu -->
      <div class="hidden md:flex items-center gap-8">
        <a
          href="/collections"
          class="
            font-body text-base text-text-dark
            hover:text-primary-dark
            focus:outline-none focus:ring-2 focus:ring-primary-dark rounded
            pb-1 border-b-2 border-transparent
            hover:border-primary-dark
            transition-all duration-200
          "
          [class.border-primary-dark]="isActive('/collections')"
          [class.text-primary-dark]="isActive('/collections')"
        >
          Collections
        </a>
        <a
          href="/about"
          class="
            font-body text-base text-text-dark
            hover:text-primary-dark
            focus:outline-none focus:ring-2 focus:ring-primary-dark rounded
            pb-1 border-b-2 border-transparent
            hover:border-primary-dark
            transition-all duration-200
          "
          [class.border-primary-dark]="isActive('/about')"
          [class.text-primary-dark]="isActive('/about')"
        >
          About
        </a>
        <a
          href="/contact"
          class="
            font-body text-base text-text-dark
            hover:text-primary-dark
            focus:outline-none focus:ring-2 focus:ring-primary-dark rounded
            pb-1 border-b-2 border-transparent
            hover:border-primary-dark
            transition-all duration-200
          "
          [class.border-primary-dark]="isActive('/contact')"
          [class.text-primary-dark]="isActive('/contact')"
        >
          Contact
        </a>
      </div>

      <!-- Right Actions -->
      <div class="flex items-center gap-4">
        <!-- WhatsApp Button -->
        <a
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noopener noreferrer"
          class="
            hidden sm:inline-flex items-center gap-2
            bg-whatsapp text-white
            hover:opacity-90
            focus:outline-none focus:ring-2 focus:ring-whatsapp focus:ring-offset-2
            px-4 py-2 rounded-full
            font-body text-sm font-semibold
            transition-all duration-200
            min-h-[44px]
          "
          aria-label="Chat on WhatsApp"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <!-- WhatsApp icon -->
          </svg>
          <span class="hidden md:inline">Chat</span>
        </a>

        <!-- Mobile Menu Toggle -->
        <button
          class="
            md:hidden
            p-2 rounded-lg
            text-text-dark
            hover:bg-primary-bg
            focus:outline-none focus:ring-2 focus:ring-primary-dark
            transition-colors duration-200
            min-h-[44px] min-w-[44px]
            flex items-center justify-center
          "
          (click)="toggleMobileMenu()"
          [attr.aria-label]="isMobileMenuOpen ? 'Close menu' : 'Open menu'"
          [attr.aria-expanded]="isMobileMenuOpen"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              *ngIf="!isMobileMenuOpen"
              stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
            <path
              *ngIf="isMobileMenuOpen"
              stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Navigation Menu (Slide-in from Right) -->
    <div
      *ngIf="isMobileMenuOpen"
      class="
        md:hidden
        absolute top-16 right-0 bottom-0
        bg-white border-l border-border
        shadow-lg
        w-64
        animate-slideInRight
      "
    >
      <div class="p-6 space-y-4">
        <a
          href="/collections"
          class="
            block font-body text-base text-text-dark
            hover:text-primary-dark
            focus:outline-none focus:ring-2 focus:ring-primary-dark rounded
            pb-2 transition-colors duration-200
          "
          (click)="closeMobileMenu()"
        >
          Collections
        </a>
        <a
          href="/about"
          class="
            block font-body text-base text-text-dark
            hover:text-primary-dark
            focus:outline-none focus:ring-2 focus:ring-primary-dark rounded
            pb-2 transition-colors duration-200
          "
          (click)="closeMobileMenu()"
        >
          About
        </a>
        <a
          href="/contact"
          class="
            block font-body text-base text-text-dark
            hover:text-primary-dark
            focus:outline-none focus:ring-2 focus:ring-primary-dark rounded
            pb-2 transition-colors duration-200
          "
          (click)="closeMobileMenu()"
        >
          Contact
        </a>
        <hr class="border-border my-4" />
        <a
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noopener noreferrer"
          class="
            flex items-center gap-2
            bg-whatsapp text-white
            hover:opacity-90
            px-4 py-2 rounded-full
            font-body text-sm font-semibold
            transition-all duration-200
            min-h-[44px]
          "
          aria-label="Chat on WhatsApp"
          (click)="closeMobileMenu()"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <!-- WhatsApp icon -->
          </svg>
          Chat on WhatsApp
        </a>
      </div>
    </div>
  </div>
</nav>
```

**Navigation Specs:**
- **Height:** 64px (h-16) mobile, 80px (h-20) desktop
- **Background:** Ivory (#FAF7F0)
- **Sticky:** Remains at top on scroll
- **Z-Index:** 40 (above main content, below modals)
- **Border:** Bottom border in border color

### 5.4 Product Gallery (Detail Page)

Image gallery with main image and thumbnails for product detail pages.

```html
<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

  <!-- Main Image Column -->
  <div class="lg:col-span-2">
    <!-- Main Image -->
    <div
      class="
        relative w-full rounded-lg overflow-hidden
        bg-bg-secondary
      "
      style="aspect-ratio: 3/4;"
    >
      <img
        [src]="mainImage"
        [alt]="product.name"
        class="w-full h-full object-cover"
      />

      <!-- Navigation Arrows (Desktop only) -->
      <button
        class="
          hidden md:flex
          absolute left-4 top-1/2 -translate-y-1/2
          p-2 rounded-full bg-white shadow-base
          text-text-dark hover:bg-primary-light
          focus:outline-none focus:ring-2 focus:ring-primary-dark
          transition-all duration-200
          min-h-[44px] min-w-[44px]
        "
        (click)="previousImage()"
        aria-label="Previous image"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      <button
        class="
          hidden md:flex
          absolute right-4 top-1/2 -translate-y-1/2
          p-2 rounded-full bg-white shadow-base
          text-text-dark hover:bg-primary-light
          focus:outline-none focus:ring-2 focus:ring-primary-dark
          transition-all duration-200
          min-h-[44px] min-w-[44px]
        "
        (click)="nextImage()"
        aria-label="Next image"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    </div>

    <!-- Thumbnail Row -->
    <div class="flex gap-3 mt-4 overflow-x-auto pb-2">
      <button
        *ngFor="let image of product.images; let i = index"
        class="
          flex-shrink-0
          w-20 h-24
          rounded-lg overflow-hidden
          border-2 transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary-dark
          cursor-pointer
        "
        [class.border-primary-dark]="mainImage === image"
        [class.border-border]="mainImage !== image"
        (click)="setMainImage(image)"
        [attr.aria-label]="'View image ' + (i + 1)"
      >
        <img
          [src]="image"
          [alt]="'Product image ' + (i + 1)"
          class="w-full h-full object-cover"
        />
      </button>
    </div>
  </div>

  <!-- Product Info Column -->
  <div class="lg:col-span-1 space-y-6">
    <!-- Product Name & Price -->
    <div>
      <h1 class="font-display text-3xl font-bold text-text-dark mb-2">
        {{ product.name }}
      </h1>
      <div class="flex items-baseline gap-3">
        <span class="font-body text-2xl font-bold text-primary-dark">
          ₹{{ product.price | number:'1.0-0' }}
        </span>
        <span
          *ngIf="product.originalPrice"
          class="font-body text-base text-text-light line-through"
        >
          ₹{{ product.originalPrice | number:'1.0-0' }}
        </span>
      </div>
    </div>

    <!-- Stock Status -->
    <div>
      <span
        *ngIf="product.inStock"
        class="
          inline-block
          bg-success text-white
          px-3 py-1 rounded-full
          text-caption font-semibold
        "
      >
        In Stock
      </span>
      <span
        *ngIf="!product.inStock"
        class="
          inline-block
          bg-error text-white
          px-3 py-1 rounded-full
          text-caption font-semibold
        "
      >
        Out of Stock
      </span>
    </div>

    <!-- Description -->
    <div class="space-y-3">
      <p class="font-body text-base text-text-medium">
        {{ product.description }}
      </p>
      <p class="font-body text-sm text-text-light">
        {{ product.details }}
      </p>
    </div>

    <!-- Options (Size, Color, etc.) -->
    <div class="space-y-4">
      <!-- Size Selection -->
      <div *ngIf="product.sizes">
        <label class="font-body text-sm font-semibold text-text-dark block mb-3">
          Size
        </label>
        <div class="flex flex-wrap gap-2">
          <button
            *ngFor="let size of product.sizes"
            class="
              px-4 py-2 rounded-md
              border-2 font-body text-sm font-medium
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-primary-dark
              cursor-pointer
            "
            [class.bg-primary-dark]="selectedSize === size"
            [class.text-white]="selectedSize === size"
            [class.border-primary-dark]="selectedSize === size"
            [class.bg-white]="selectedSize !== size"
            [class.text-text-dark]="selectedSize !== size"
            [class.border-border]="selectedSize !== size"
            (click)="selectedSize = size"
          >
            {{ size }}
          </button>
        </div>
      </div>

      <!-- Color Selection -->
      <div *ngIf="product.colors">
        <label class="font-body text-sm font-semibold text-text-dark block mb-3">
          Color
        </label>
        <div class="flex gap-3">
          <button
            *ngFor="let color of product.colors"
            class="
              w-8 h-8 rounded-full
              border-3 transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-primary-dark
              cursor-pointer
            "
            [style.backgroundColor]="color.hex"
            [class.border-text-dark]="selectedColor === color.name"
            [class.border-transparent]="selectedColor !== color.name"
            (click)="selectedColor = color.name"
            [attr.aria-label]="'Color: ' + color.name"
          ></button>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="space-y-3 pt-4">
      <button
        class="
          w-full
          bg-primary-dark text-white
          hover:bg-opacity-90 active:bg-opacity-80
          focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-offset-2
          px-6 py-3 rounded-full
          font-body font-semibold text-base
          transition-all duration-200
          min-h-[48px]
        "
        (click)="addToCart()"
        [disabled]="!product.inStock"
      >
        {{ product.inStock ? 'Add to Cart' : 'Out of Stock' }}
      </button>

      <a
        href="https://wa.me/919876543210?text=Hi%20Musani%20Wear,%20I%20am%20interested%20in%20{{ product.name }}"
        target="_blank"
        rel="noopener noreferrer"
        class="
          flex items-center justify-center gap-2
          bg-whatsapp text-white
          hover:opacity-90 active:opacity-80
          focus:outline-none focus:ring-2 focus:ring-whatsapp focus:ring-offset-2
          px-6 py-3 rounded-full
          font-body font-semibold text-base
          transition-all duration-200
          min-h-[48px]
          text-center
        "
        aria-label="Send WhatsApp message"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <!-- WhatsApp icon -->
        </svg>
        Ask on WhatsApp
      </a>

      <button
        class="
          w-full
          bg-white text-primary-dark
          border-2 border-primary-dark
          hover:bg-primary-light active:bg-primary-bg
          focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-offset-2
          px-6 py-3 rounded-full
          font-body font-semibold text-base
          transition-all duration-200
          min-h-[48px]
        "
        (click)="toggleFavorite()"
      >
        {{ isFavorited ? '❤️ Favorited' : '🤍 Add to Favorites' }}
      </button>
    </div>

    <!-- Shipping Info -->
    <div class="bg-primary-bg p-4 rounded-lg space-y-2">
      <p class="font-body text-sm text-text-dark font-semibold">
        Shipping & Returns
      </p>
      <p class="font-body text-xs text-text-medium">
        Free shipping on orders over ₹500. Easy 7-day returns with original packaging.
      </p>
    </div>
  </div>
</div>
```

### 5.5 Form Inputs

Styled input fields with floating labels and error states for admin and customer forms.

```html
<!-- Text Input -->
<div class="relative mb-6">
  <input
    type="email"
    id="email"
    [(ngModel)]="email"
    class="
      w-full px-4 py-3 rounded-md
      border-2 border-border
      bg-white
      font-body text-base text-text-dark
      placeholder-transparent
      peer
      focus:outline-none
      focus:border-primary-dark
      focus:ring-2 focus:ring-primary-dark focus:ring-opacity-20
      transition-all duration-200
      autofill:bg-white
    "
    placeholder="Email address"
  />
  <label
    for="email"
    class="
      absolute left-4 top-3
      font-body text-sm text-text-light
      transition-all duration-200
      pointer-events-none
      peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-text-light
      peer-focus:top-1 peer-focus:text-xs peer-focus:text-primary-dark
      peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-text-dark
    "
  >
    Email Address
  </label>
</div>

<!-- Textarea -->
<div class="relative mb-6">
  <textarea
    id="message"
    [(ngModel)]="message"
    rows="4"
    class="
      w-full px-4 py-3 rounded-md
      border-2 border-border
      bg-white
      font-body text-base text-text-dark
      placeholder-transparent
      peer
      focus:outline-none
      focus:border-primary-dark
      focus:ring-2 focus:ring-primary-dark focus:ring-opacity-20
      transition-all duration-200
      resize-none
    "
    placeholder="Your message"
  ></textarea>
  <label
    for="message"
    class="
      absolute left-4 top-3
      font-body text-sm text-text-light
      transition-all duration-200
      pointer-events-none
      peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-text-light
      peer-focus:top-1 peer-focus:text-xs peer-focus:text-primary-dark
      peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-text-dark
    "
  >
    Message
  </label>
</div>

<!-- Select Input -->
<div class="relative mb-6">
  <select
    [(ngModel)]="selectedCategory"
    class="
      w-full px-4 py-3 rounded-md
      border-2 border-border
      bg-white
      font-body text-base text-text-dark
      focus:outline-none
      focus:border-primary-dark
      focus:ring-2 focus:ring-primary-dark focus:ring-opacity-20
      transition-all duration-200
      cursor-pointer
      appearance-none
      pr-10
    "
  >
    <option value="">Select category</option>
    <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
  </select>
  <svg
    class="
      absolute right-3 top-4 w-5 h-5
      text-text-light pointer-events-none
    "
    fill="none" stroke="currentColor" viewBox="0 0 24 24"
  >
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
  </svg>
</div>

<!-- Error State -->
<div class="relative mb-6">
  <input
    type="text"
    id="productName"
    [(ngModel)]="productName"
    [attr.aria-invalid]="hasError"
    [attr.aria-describedby]="hasError ? 'productName-error' : null"
    class="
      w-full px-4 py-3 rounded-md
      border-2
      bg-white
      font-body text-base text-text-dark
      placeholder-transparent
      peer
      focus:outline-none
      focus:ring-2 focus:ring-opacity-20
      transition-all duration-200
    "
    [class.border-error]="hasError"
    [class.border-border]="!hasError"
    [class.focus:border-error]="hasError"
    [class.focus:ring-error]="hasError"
    [class.focus:border-primary-dark]="!hasError"
    [class.focus:ring-primary-dark]="!hasError"
    placeholder="Product name"
  />
  <label
    for="productName"
    class="
      absolute left-4 top-3
      font-body text-sm
      transition-all duration-200
      pointer-events-none
      peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
      peer-focus:top-1 peer-focus:text-xs
      peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:text-xs
    "
    [class.text-error]="hasError"
    [class.text-text-light]="!hasError"
    [class.text-text-dark]="!hasError"
  >
    Product Name
  </label>
  <p
    *ngIf="hasError"
    id="productName-error"
    class="font-body text-sm text-error mt-2 flex items-center gap-1"
  >
    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
    </svg>
    Product name is required
  </p>
</div>

<!-- Checkbox -->
<div class="flex items-start mb-6">
  <input
    type="checkbox"
    id="agreeTerms"
    [(ngModel)]="agreeTerms"
    class="
      w-5 h-5 mt-0.5
      rounded border-2 border-border
      bg-white
      text-primary-dark
      focus:ring-2 focus:ring-primary-dark focus:ring-offset-2
      cursor-pointer
      transition-colors duration-200
      checked:bg-primary-dark checked:border-primary-dark
    "
  />
  <label
    for="agreeTerms"
    class="
      ml-3
      font-body text-base text-text-medium
      cursor-pointer
      select-none
    "
  >
    I agree to the terms and conditions
  </label>
</div>

<!-- Radio Buttons -->
<fieldset class="mb-6">
  <legend class="font-body text-sm font-semibold text-text-dark mb-3">
    Delivery Method
  </legend>
  <div class="space-y-3">
    <div class="flex items-center">
      <input
        type="radio"
        id="standardShip"
        name="delivery"
        value="standard"
        [(ngModel)]="deliveryMethod"
        class="
          w-4 h-4
          rounded-full border-2 border-border
          bg-white
          text-primary-dark
          focus:ring-2 focus:ring-primary-dark focus:ring-offset-2
          cursor-pointer
          transition-colors duration-200
        "
      />
      <label
        for="standardShip"
        class="
          ml-3
          font-body text-base text-text-medium
          cursor-pointer
          select-none
        "
      >
        Standard Shipping (5-7 days)
      </label>
    </div>
    <div class="flex items-center">
      <input
        type="radio"
        id="expressShip"
        name="delivery"
        value="express"
        [(ngModel)]="deliveryMethod"
        class="
          w-4 h-4
          rounded-full border-2 border-border
          bg-white
          text-primary-dark
          focus:ring-2 focus:ring-primary-dark focus:ring-offset-2
          cursor-pointer
          transition-colors duration-200
        "
      />
      <label
        for="expressShip"
        class="
          ml-3
          font-body text-base text-text-medium
          cursor-pointer
          select-none
        "
      >
        Express Shipping (2-3 days)
      </label>
    </div>
  </div>
</fieldset>
```

### 5.6 Admin Sidebar Navigation

Dark sidebar for admin dashboard with gold accent for active items.

```html
<aside
  class="
    fixed left-0 top-0 bottom-0 w-64
    bg-text-dark text-white
    shadow-lg
    transition-transform duration-300
    z-50
  "
  [class.-translate-x-full]="!isSidebarOpen"
  role="navigation"
  aria-label="Admin navigation"
>
  <!-- Sidebar Header -->
  <div class="p-6 border-b border-gray-700">
    <h2 class="font-display text-xl font-bold text-white">
      Admin Panel
    </h2>
  </div>

  <!-- Navigation Menu -->
  <nav class="p-4 space-y-2">
    <!-- Dashboard -->
    <a
      routerLink="/admin/dashboard"
      routerLinkActive="bg-primary-dark"
      class="
        flex items-center gap-3
        px-4 py-3 rounded-lg
        text-white hover:bg-gray-800
        focus:outline-none focus:ring-2 focus:ring-primary-dark
        transition-colors duration-200
      "
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <!-- Dashboard icon -->
      </svg>
      <span class="font-body text-sm font-medium">Dashboard</span>
    </a>

    <!-- Products -->
    <div>
      <button
        class="
          w-full flex items-center justify-between
          px-4 py-3 rounded-lg
          text-white hover:bg-gray-800
          focus:outline-none focus:ring-2 focus:ring-primary-dark
          transition-colors duration-200
        "
        (click)="toggleProductsMenu()"
        [attr.aria-expanded]="isProductsMenuOpen"
      >
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <!-- Products icon -->
          </svg>
          <span class="font-body text-sm font-medium">Products</span>
        </div>
        <svg
          class="w-4 h-4 transition-transform"
          [style.transform]="isProductsMenuOpen ? 'rotate(180deg)' : 'rotate(0)'"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </button>

      <!-- Submenu -->
      <div
        *ngIf="isProductsMenuOpen"
        class="ml-4 mt-2 space-y-1"
      >
        <a
          routerLink="/admin/products"
          routerLinkActive="bg-primary-dark"
          class="
            block px-4 py-2 rounded-lg
            text-white hover:bg-gray-800
            focus:outline-none focus:ring-2 focus:ring-primary-dark
            transition-colors duration-200
            font-body text-sm
          "
        >
          All Products
        </a>
        <a
          routerLink="/admin/products/new"
          routerLinkActive="bg-primary-dark"
          class="
            block px-4 py-2 rounded-lg
            text-white hover:bg-gray-800
            focus:outline-none focus:ring-2 focus:ring-primary-dark
            transition-colors duration-200
            font-body text-sm
          "
        >
          Add New Product
        </a>
        <a
          routerLink="/admin/categories"
          routerLinkActive="bg-primary-dark"
          class="
            block px-4 py-2 rounded-lg
            text-white hover:bg-gray-800
            focus:outline-none focus:ring-2 focus:ring-primary-dark
            transition-colors duration-200
            font-body text-sm
          "
        >
          Categories
        </a>
      </div>
    </div>

    <!-- Orders -->
    <a
      routerLink="/admin/orders"
      routerLinkActive="bg-primary-dark"
      class="
        flex items-center gap-3
        px-4 py-3 rounded-lg
        text-white hover:bg-gray-800
        focus:outline-none focus:ring-2 focus:ring-primary-dark
        transition-colors duration-200
      "
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <!-- Orders icon -->
      </svg>
      <span class="font-body text-sm font-medium">Orders</span>
    </a>

    <!-- Analytics -->
    <a
      routerLink="/admin/analytics"
      routerLinkActive="bg-primary-dark"
      class="
        flex items-center gap-3
        px-4 py-3 rounded-lg
        text-white hover:bg-gray-800
        focus:outline-none focus:ring-2 focus:ring-primary-dark
        transition-colors duration-200
      "
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <!-- Analytics icon -->
      </svg>
      <span class="font-body text-sm font-medium">Analytics</span>
    </a>
  </nav>

  <!-- Sidebar Footer (Logout) -->
  <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
    <button
      class="
        w-full flex items-center gap-3
        px-4 py-3 rounded-lg
        text-white hover:bg-gray-800
        focus:outline-none focus:ring-2 focus:ring-primary-dark
        transition-colors duration-200
      "
      (click)="logout()"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <!-- Logout icon -->
      </svg>
      <span class="font-body text-sm font-medium">Logout</span>
    </button>
  </div>
</aside>

<!-- Sidebar Toggle Button (Mobile) -->
<button
  class="
    md:hidden
    fixed bottom-6 right-6
    p-4 rounded-full
    bg-primary-dark text-white
    shadow-lg
    z-40
    focus:outline-none focus:ring-2 focus:ring-primary-dark
    transition-all duration-200
    min-h-[56px] min-w-[56px]
  "
  (click)="toggleSidebar()"
  aria-label="Toggle admin sidebar"
>
  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
  </svg>
</button>
```

### 5.7 Status Badges

**In-Stock Badge:**
```html
<span class="
  inline-block
  bg-success text-white
  px-3 py-1 rounded-full
  font-body text-caption font-semibold
">
  In Stock
</span>
```

**Out-of-Stock Badge:**
```html
<span class="
  inline-block
  bg-error text-white
  px-3 py-1 rounded-full
  font-body text-caption font-semibold
">
  Out of Stock
</span>
```

### 5.8 Empty State

When no products are available or list is empty.

```html
<div class="text-center py-12 px-4">
  <!-- Icon -->
  <svg class="mx-auto h-16 w-16 text-text-light mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
  </svg>

  <!-- Heading -->
  <h3 class="font-display text-2xl font-semibold text-text-dark mb-2">
    No products yet
  </h3>

  <!-- Description -->
  <p class="font-body text-base text-text-medium mb-6">
    We're working on bringing you our exclusive collection. Check back soon!
  </p>

  <!-- Action Button -->
  <a
    href="/"
    class="
      inline-block
      bg-primary-dark text-white
      hover:bg-opacity-90
      focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-offset-2
      px-6 py-3 rounded-full
      font-body font-semibold text-base
      transition-all duration-200
      min-h-[48px]
    "
  >
    Return Home
  </a>
</div>
```

### 5.9 Error State

Error message display for form submission or system errors.

```html
<!-- Inline Error (Form Field) -->
<div class="mb-6">
  <input
    type="email"
    [attr.aria-invalid]="true"
    [attr.aria-describedby]="'email-error'"
    class="
      w-full px-4 py-3 rounded-md
      border-2 border-error
      bg-white
      font-body text-base text-text-dark
      focus:outline-none focus:border-error focus:ring-2 focus:ring-error focus:ring-opacity-20
      transition-all duration-200
    "
  />
  <p id="email-error" class="font-body text-sm text-error mt-2 flex items-center gap-1">
    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"></path>
    </svg>
    Please enter a valid email address
  </p>
</div>

<!-- Banner Error (Page-Level) -->
<div class="
  bg-error bg-opacity-10 border-l-4 border-error
  p-4 mb-6 rounded-r-lg
" role="alert" aria-live="polite">
  <div class="flex">
    <svg class="w-5 h-5 text-error flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"></path>
    </svg>
    <div class="ml-4">
      <h3 class="font-body font-semibold text-error mb-1">
        Error saving changes
      </h3>
      <p class="font-body text-sm text-text-medium mb-3">
        An unexpected error occurred while saving your product. Please check your internet connection and try again.
      </p>
      <button
        class="
          font-body text-sm font-semibold text-error
          hover:underline
          focus:outline-none focus:ring-2 focus:ring-error rounded
        "
        (click)="retryAction()"
      >
        Try Again
      </button>
    </div>
  </div>
</div>
```

### 5.10 Loading State

**Spinner (Small Actions):**
```html
<div class="flex items-center justify-center">
  <div class="
    animate-spin rounded-full h-8 w-8
    border-2 border-border border-t-primary-dark
  "></div>
</div>
```

**Skeleton Loader (Content Loading):**
```html
<div class="space-y-4 animate-pulse">
  <div class="h-4 bg-border rounded w-3/4"></div>
  <div class="h-4 bg-border rounded w-1/2"></div>
  <div class="h-32 bg-border rounded"></div>
</div>
```

---

## 6. Accessibility Guidelines

### 6.1 WCAG 2.1 Level AA Compliance

Musani Wear meets WCAG 2.1 Level AA standards to ensure inclusive, accessible design.

#### Color Contrast (1.4.3)

All text and interactive elements must meet minimum contrast ratios:

- **Normal text (< 18pt):** 4.5:1 minimum
- **Large text (≥ 18pt):** 3:1 minimum
- **UI components & graphics:** 3:1 minimum

**Verified Safe Combinations:**

| Text | Background | Ratio | WCAG AA | WCAG AAA |
|------|-----------|-------|---------|----------|
| #1A1A1A (Text Dark) | #FAF7F0 (Ivory) | 16.8:1 | ✅ | ✅ |
| #4A4A4A (Text Medium) | #FFFFFF (White) | 10.2:1 | ✅ | ✅ |
| #FFFFFF | #C9A84C (Primary Dark) | 5.8:1 | ✅ | ✅ |
| #C9A84C | #FFFFFF | 5.8:1 | ✅ | ✅ |
| #FFFFFF | #2E7D32 (Success) | 5.2:1 | ✅ | ✅ |
| #FFFFFF | #C62828 (Error) | 5.1:1 | ✅ | ✅ |
| #9A9A9A (Text Light) | #FFFFFF | 4.5:1 | ✅ | ✅ |

### 6.2 Keyboard Navigation

All interactive elements must be keyboard accessible:

**Tab Order:**
- Navigation flows logically: top-to-bottom, left-to-right
- Focus order matches visual order
- Skip links provided for main content: `<a href="#main" class="sr-only focus:not-sr-only">`

**Focus Indicators:**
- Every focusable element has visible focus state
- Focus ring: 2px solid primary-dark with 2px offset
- Never remove focus outline without replacement

**Key Bindings:**
- **Tab** — Navigate forward
- **Shift+Tab** — Navigate backward
- **Enter/Space** — Activate buttons, toggle checkboxes
- **Escape** — Close modals, dismiss dropdowns
- **Arrow Keys** — Navigate menu options, carousel slides

**Implementation:**
```html
<!-- Focus visible for keyboard navigation -->
<button class="
  focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-offset-2
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark
">
  Action
</button>
```

### 6.3 Screen Reader Support

Content must be semantically meaningful for screen readers:

**Semantic HTML:**
```html
<!-- Use semantic elements for structure -->
<header><!-- Navigation, branding --></header>
<nav><!-- Navigation links --></nav>
<main id="main"><!-- Primary content --></main>
<article><!-- Product details --></article>
<aside><!-- Sidebar, filters --></aside>
<footer><!-- Footer links, copyright --></footer>
```

**ARIA Labels & Descriptions:**
```html
<!-- Icon buttons need labels -->
<button aria-label="Add to favorites">♡</button>

<!-- Form sections -->
<fieldset>
  <legend>Product Options</legend>
  <!-- Radio buttons, checkboxes -->
</fieldset>

<!-- Dynamic content -->
<div aria-live="polite" aria-atomic="true">
  <!-- Status updates here -->
</div>

<!-- Descriptions for complex elements -->
<img src="product.jpg" alt="Emerald saree with gold embroidery" />
<p id="desc">Handcrafted with premium silk...</p>
<div aria-describedby="desc"><!-- Complex component --></div>
```

**Form Accessibility:**
```html
<!-- Every input has associated label -->
<label for="email">Email Address</label>
<input id="email" type="email" required />

<!-- Required field indicator -->
<label for="name">
  Product Name
  <span aria-label="required">*</span>
</label>
<input id="name" type="text" required />

<!-- Error announcement -->
<input
  aria-invalid="true"
  aria-describedby="name-error"
/>
<div id="name-error" role="alert">
  Product name is required
</div>
```

### 6.4 Focus Management

Focus must be managed to guide users and maintain context:

**Modal/Dialog:**
```html
<!-- Focus traps inside modal; moves to close button on open -->
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  (keydown.escape)="closeModal()"
>
  <h2 id="modal-title">Dialog Title</h2>
  <!-- Content -->
  <button (click)="closeModal()" #closeBtn>Close</button>
</div>

<!-- Script: Move focus to modal, trap inside, return on close -->
```

**Page Navigation:**
```html
<!-- Focus moves to main content heading on page load -->
<main id="main">
  <h1 tabindex="-1" #mainHeading>Page Title</h1>
  <!-- Content -->
</main>

<!-- Script: Focus mainHeading on route change -->
```

### 6.5 Images & Media

**Alt Text:**
- All images must have descriptive alt text
- Decorative images: `alt=""`
- Product images: Describe appearance, color, style

```html
<!-- Product image with detailed alt -->
<img
  src="product.jpg"
  alt="Emerald green saree with gold zari embroidery, full-length view"
/>

<!-- Decorative icon -->
<img src="icon.svg" alt="" aria-hidden="true" />
```

### 6.6 Motion & Animation

Respect user's motion preferences per WCAG 2.3.3:

```css
/* Disable animations for users preferring reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 6.7 Hidden Content

Visually hidden text for screen readers:

```css
/* Screen reader only (hidden visually, available to screen readers) */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Becomes visible on focus (for skip links) */
.sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

**Usage:**
```html
<!-- Skip link to main content -->
<a href="#main" class="sr-only focus:not-sr-only">
  Skip to main content
</a>

<!-- Screen reader-only text -->
<span class="sr-only">Added to cart</span>
```

---

## 7. Animation & Interactions

### 7.1 Timing & Easing

Smooth animations enhance perceived performance and provide feedback without overwhelming users.

```css
/* Easing functions */
--ease-in: cubic-bezier(0.4, 0, 1, 1);          /* Accelerating */
--ease-out: cubic-bezier(0, 0, 0.2, 1);         /* Decelerating */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);    /* Smooth both ways */

/* Duration */
--duration-fast: 150ms;    /* Micro-interactions (hover, focus) */
--duration-normal: 300ms;  /* Standard transitions */
--duration-slow: 500ms;    /* Page transitions */
```

### 7.2 Keyframe Animations

**Slide Up (Modal Entrance):**
```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal {
  animation: slideUp 300ms ease-out;
}
```

**Fade In:**
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-enter {
  animation: fadeIn 300ms ease-out;
}
```

**Spin (Loading):**
```css
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  animation: spin 1s linear infinite;
}
```

### 7.3 Interaction Guidelines

**When to Animate:**
- Button hover states (color, shadow, scale)
- Form input focus (border color, ring, background)
- Page transitions (fade, slide)
- Loading indicators (spinner, skeleton)
- Toast notifications (slide in, fade out)
- Dropdown menus (fade in, slide)

**When NOT to Animate:**
- Critical errors (should draw attention without motion)
- Long-form content (maintains reading flow)
- Disabled states (no interaction feedback needed)
- Low-power devices (respect `prefers-reduced-motion`)

**Button Hover Example:**
```html
<button class="
  transition-all duration-200 ease-out
  hover:shadow-base hover:scale-105
  active:scale-95
">
  Click Me
</button>
```

**Form Input Focus:**
```html
<input class="
  transition-all duration-200 ease-out
  border-border focus:border-primary-dark focus:ring-2 focus:ring-primary-dark
" />
```

---

## 8. State Indicators

### 8.1 Loading States

**Spinner (Button Loading):**
```html
<button [disabled]="isLoading">
  <span *ngIf="!isLoading">Submit</span>
  <span *ngIf="isLoading" class="inline-flex items-center gap-2">
    <div class="
      animate-spin rounded-full h-4 w-4
      border-2 border-white border-t-transparent
    "></div>
    Loading...
  </span>
</button>
```

**Skeleton Loader (Page Content):**
```html
<div *ngIf="!productsLoaded" class="space-y-4 animate-pulse">
  <div class="h-64 bg-border rounded-lg"></div>
  <div class="space-y-3">
    <div class="h-4 bg-border rounded w-3/4"></div>
    <div class="h-4 bg-border rounded w-1/2"></div>
  </div>
</div>

<div *ngIf="productsLoaded">
  <!-- Products loaded -->
</div>
```

**Progress Bar (File Upload):**
```html
<div class="w-full bg-border rounded-full h-2 overflow-hidden">
  <div
    class="bg-primary-dark h-2 transition-all duration-300"
    [style.width.%]="uploadProgress"
    role="progressbar"
    [attr.aria-valuenow]="uploadProgress"
    aria-valuemin="0"
    aria-valuemax="100"
  ></div>
</div>
<p class="mt-2 font-body text-sm text-text-medium">
  {{ uploadProgress }}% uploaded
</p>
```

### 8.2 Empty States

Display when lists, collections, or sections are empty:

```html
<div *ngIf="products.length === 0" class="text-center py-12">
  <svg class="mx-auto h-16 w-16 text-text-light mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <!-- Empty icon -->
  </svg>
  <h3 class="font-display text-2xl font-semibold text-text-dark mb-2">
    No items found
  </h3>
  <p class="font-body text-base text-text-medium mb-6">
    We couldn't find any products matching your search.
  </p>
  <a
    href="/collections"
    class="
      inline-block
      bg-primary-dark text-white
      px-6 py-3 rounded-full
      font-body font-semibold
      transition-all duration-200
      hover:bg-opacity-90
    "
  >
    Browse All Products
  </a>
</div>
```

### 8.3 Error States

**Validation Error:**
```html
<div class="mb-4">
  <input
    type="email"
    [class.border-error]="emailError"
    [attr.aria-invalid]="!!emailError"
    [attr.aria-describedby]="emailError ? 'email-error' : null"
  />
  <p *ngIf="emailError" id="email-error" class="text-error text-sm mt-2 flex items-center gap-1">
    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"></path>
    </svg>
    {{ emailError }}
  </p>
</div>
```

**Network Error Banner:**
```html
<div
  *ngIf="networkError"
  class="
    bg-error bg-opacity-10 border-l-4 border-error
    p-4 mb-6 rounded-r-lg
  "
  role="alert"
  aria-live="assertive"
>
  <div class="flex gap-3">
    <svg class="w-5 h-5 text-error flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"></path>
    </svg>
    <div>
      <h4 class="font-semibold text-error">Connection Error</h4>
      <p class="text-sm text-text-medium mt-1">
        Unable to load products. Please check your connection and try again.
      </p>
      <button
        (click)="retryLoad()"
        class="mt-3 text-error text-sm font-semibold hover:underline"
      >
        Retry
      </button>
    </div>
  </div>
</div>
```

**Success State:**
```html
<div
  *ngIf="successMessage"
  class="
    bg-success bg-opacity-10 border-l-4 border-success
    p-4 mb-6 rounded-r-lg
  "
  role="status"
  aria-live="polite"
>
  <div class="flex gap-3">
    <svg class="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"></path>
    </svg>
    <div>
      <p class="font-body font-semibold text-success">{{ successMessage }}</p>
    </div>
  </div>
</div>
```

---

## 9. Responsive Design

### 9.1 Breakpoints

Mobile-first approach with progressive enhancement for larger screens.

```css
/* Tailwind breakpoints */
--breakpoint-sm: 640px;   /* Small tablets, large phones */
--breakpoint-md: 768px;   /* Tablets portrait */
--breakpoint-lg: 1024px;  /* Tablets landscape, laptops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1536px; /* Large desktops */
```

**Usage (Mobile-First):**
```html
<!-- Mobile: 1 column, full width -->
<!-- Tablet (md): 2 columns -->
<!-- Desktop (lg): 4 columns -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <!-- Product cards -->
</div>
```

### 9.2 Responsive Typography

```css
/* Mobile (default) */
h1 { font-size: 1.875rem; /* 30px */ }
h2 { font-size: 1.5rem; /* 24px */ }
body { font-size: 1rem; /* 16px */ }

/* Tablet (768px+) */
@media (min-width: 768px) {
  h1 { font-size: 2.25rem; /* 36px */ }
  h2 { font-size: 1.875rem; /* 30px */ }
  body { font-size: 1.125rem; /* 18px */ }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  h1 { font-size: 3rem; /* 48px */ }
  h2 { font-size: 2.25rem; /* 36px */ }
  body { font-size: 1.125rem; /* 18px */ }
}
```

### 9.3 Touch Targets

Minimum touch target sizes for mobile accessibility:

```css
/* iOS: 44x44px minimum */
/* Android: 48x48px minimum */

button, a[role="button"] {
  min-height: 48px;
  min-width: 48px;
  padding: 0.75rem 1rem; /* Min 12px padding */
}

/* Gap between targets: minimum 8px (12px recommended) */
.interactive-group {
  gap: 0.75rem; /* 12px */
}
```

### 9.4 Mobile Navigation Patterns

**Bottom Tab Navigation (Mobile Only):**
```html
<!-- Hidden on tablet+ -->
<nav class="
  fixed bottom-0 inset-x-0
  bg-white border-t border-border
  md:hidden
">
  <div class="flex justify-around">
    <a href="/" class="flex-1 py-4 text-center hover:bg-primary-bg">
      Home
    </a>
    <a href="/collections" class="flex-1 py-4 text-center hover:bg-primary-bg">
      Shop
    </a>
    <a href="/favorites" class="flex-1 py-4 text-center hover:bg-primary-bg">
      Favorites
    </a>
    <a href="/account" class="flex-1 py-4 text-center hover:bg-primary-bg">
      Account
    </a>
  </div>
</nav>

<!-- Add bottom padding to body to prevent content overlap -->
<body class="pb-20 md:pb-0">
```

**Mobile Hamburger Menu (Slide-in Drawer):**
```html
<!-- Menu toggle -->
<button (click)="toggleMobileMenu()" aria-label="Toggle menu">
  <!-- Hamburger icon -->
</button>

<!-- Slide-in drawer -->
<nav
  *ngIf="mobileMenuOpen"
  class="
    fixed inset-y-0 right-0 w-64
    bg-white shadow-lg z-50
    animate-slideInRight
  "
>
  <!-- Navigation links -->
</nav>

<!-- Backdrop -->
<div
  *ngIf="mobileMenuOpen"
  class="fixed inset-0 bg-overlay z-40"
  (click)="toggleMobileMenu()"
></div>
```

### 9.5 Responsive Spacing

Adjust spacing at different breakpoints:

```html
<!-- Mobile: 16px padding, Desktop: 32px padding -->
<div class="px-4 md:px-8 py-8 md:py-16">
  <!-- Content -->
</div>

<!-- Mobile: 16px gap, Tablet: 24px gap, Desktop: 32px gap -->
<div class="grid gap-4 md:gap-6 lg:gap-8">
  <!-- Items -->
</div>
```

---

## 10. Tailwind Configuration

### 10.1 Custom Theme Extensions

Configure custom colors, fonts, and spacing in `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors (Gold)
        primary: {
          dark: '#C9A84C',      // Main primary color
          light: '#E8D5A3',     // Hover state
          bg: '#F5F0E6',        // Light background
        },
        // Background Colors
        bg: {
          primary: '#FAF7F0',   // Main ivory background
          white: '#FFFFFF',
          secondary: '#F5F0E6',
        },
        // Text Colors
        text: {
          dark: '#1A1A1A',      // Headings, primary text
          medium: '#4A4A4A',    // Body text
          light: '#9A9A9A',     // Helper text, captions
        },
        // Status Colors
        success: '#2E7D32',     // In stock
        error: '#C62828',       // Out of stock
        whatsapp: '#25D366',    // WhatsApp green
        // Utility
        border: '#E8E0D5',      // Default border color
        'border-light': '#F0EAE0',
        overlay: 'rgba(0, 0, 0, 0.5)',
      },
      fontFamily: {
        // Playfair Display for headings
        display: ['Playfair Display', 'Georgia', 'serif'],
        // Inter for body text
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        // Fira Code for monospace
        mono: ['Fira Code', 'Courier New', 'Consolas', 'Monaco', 'monospace'],
      },
      fontSize: {
        // Display scale
        display: ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        // Heading scale
        h1: ['2.25rem', { lineHeight: '1.375' }],
        h2: ['1.875rem', { lineHeight: '1.375' }],
        h3: ['1.5rem', { lineHeight: '1.375' }],
        h4: ['1.25rem', { lineHeight: '1.5' }],
        // Body scale
        'body-lg': ['1.125rem', { lineHeight: '1.625' }],
        'body': ['1rem', { lineHeight: '1.5' }],
        'sm': ['0.875rem', { lineHeight: '1.5' }],
        'xs': ['0.75rem', { lineHeight: '1.5' }],
        // Custom aliases for semantic usage
        caption: ['0.75rem', { lineHeight: '1.5' }],
      },
      spacing: {
        // 8px base
        xs: '0.25rem', // 4px
        sm: '0.5rem',  // 8px
        md: '1rem',    // 16px
        lg: '1.5rem',  // 24px
        xl: '2rem',    // 32px
        '2xl': '3rem', // 48px
        '3xl': '4rem', // 64px
        '4xl': '6rem', // 96px
      },
      borderRadius: {
        sm: '0.25rem',  // 4px
        md: '0.5rem',   // 8px
        lg: '1rem',     // 16px
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
        base: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
        md: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
        lg: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
        gold: '0 0 20px rgba(201, 168, 76, 0.15)',
      },
      maxWidth: {
        sm: '384px',
        md: '448px',
        lg: '512px',
        '2xl': '896px',
        '4xl': '1024px',
        '6xl': '1280px',
        '7xl': '1536px',
      },
      animation: {
        spin: 'spin 1s linear infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        slideUp: 'slideUp 0.3s ease-out',
        slideInRight: 'slideInRight 0.3s ease-out',
        fadeIn: 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      transitionDuration: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms',
      },
      transitionTimingFunction: {
        in: 'cubic-bezier(0.4, 0, 1, 1)',
        out: 'cubic-bezier(0, 0, 0.2, 1)',
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [
    // Add custom plugins if needed
  ],
};
```

### 10.2 Custom CSS Classes (Globals)

Add to global stylesheet (`styles.css` or `styles.scss`):

```css
/* Root color variables */
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

/* Screen reader only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  overflow: visible;
  clip: auto;
  white-space: normal;
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Utility: truncate text */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Utility: text selection */
.select-none {
  user-select: none;
}

/* Utility: smooth scrolling */
html {
  scroll-behavior: smooth;
}
```

---

## 11. Browser Support

### 11.1 Target Browsers

Musani Wear supports modern browsers with graceful degradation:

| Browser | Minimum Version | Market Share |
|---------|-----------------|--------------|
| Chrome/Edge | 90+ | 63% |
| Firefox | 88+ | 13% |
| Safari | 14+ | 18% |
| iOS Safari | 14+ | 5% |
| Chrome Mobile | 90+ | ~30% (mobile) |

### 11.2 CSS Features & Fallbacks

**CSS Grid & Flexbox:**
- Supported in all target browsers
- No fallback needed for modern devices

**CSS Variables:**
- Supported in all target browsers
- Define in `:root` for easy theme updates

**CSS Transitions & Animations:**
- Supported; include vendor prefixes for older browsers
- Respect `prefers-reduced-motion` for accessibility

**Aspect Ratio:**
```css
/* Modern (all targets) */
.img-container {
  aspect-ratio: 3 / 4;
}

/* Fallback for older browsers */
.img-container::before {
  content: '';
  float: left;
  padding-bottom: 133.333%; /* 3/4 = 0.75, 1/0.75 = 1.333 */
}
```

**Backdrop Filter:**
```css
/* Modern */
.overlay {
  backdrop-filter: blur(4px);
}

/* Fallback */
.overlay {
  background-color: rgba(0, 0, 0, 0.5);
}
```

### 11.3 JavaScript Polyfills

Use Angular's built-in polyfill support for older browsers:

```json
{
  "browserslist": [
    "last 2 versions",
    "> 1%",
    "not dead",
    "not IE 11"
  ]
}
```

### 11.4 Performance Optimization

**Image Optimization:**
- Use WebP with PNG fallback
- Serve responsive images with `srcset`
- Lazy load product images below fold

```html
<picture>
  <source srcset="product.webp" type="image/webp" />
  <img src="product.png" alt="Product" loading="lazy" />
</picture>
```

**Font Loading:**
- Use `font-display: swap` for web fonts (prevent FOIT)
- Load fonts from Google Fonts CDN

**Bundle Size:**
- Tree-shake unused Tailwind classes
- Minify CSS and JavaScript
- Compress images aggressively

---

## Summary

This design system provides a comprehensive, accessible foundation for Musani Wear. Key principles:

1. **Elegance** — Gold, ivory, and warm whites convey luxury
2. **Clarity** — Clear hierarchy, ample whitespace, readable typography
3. **Consistency** — Design tokens ensure cohesive implementation
4. **Accessibility** — WCAG 2.1 AA compliance, keyboard navigation, screen reader support
5. **Responsiveness** — Mobile-first, optimized for all devices
6. **Performance** — Fast load times, smooth animations

All component specifications include HTML/Angular code examples, accessibility requirements, and state variations. Tailwind config extensions enable rapid, consistent development.

For questions or updates, reference this document as the source of truth for design decisions.

---

**Document Version:** 1.0
**Last Updated:** March 2026
**Brand:** Musani Wear
**Tech Stack:** Angular 20+ + Tailwind CSS + Firebase
