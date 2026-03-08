# Musani Wear - Complete Application Flow

**Project Type:** Web Application — Product Showcase Website
**Tech Stack:** Angular 20+ + Tailwind CSS + Firebase + NgRx Store
**Build Date:** 2026-03-08

---

## 1. Entry Points

### 1.1 Direct URL Access

**Home Page**
- **URL:** `https://musaniware.com/` or `https://musaniware.com/home`
- **Initial Screen:** Home page loads
- **Behavior:**
  - IF user already authenticated as admin → redirect to `/admin` dashboard
  - ELSE → display public home page with hero banner, featured products, category showcase
- **Initial Content:** Hero banner, featured products grid (8 latest), category cards, footer

**Shop Page**
- **URL:** `https://musaniware.com/shop`
- **Initial Screen:** All Products page
- **Behavior:**
  - IF user authenticated as admin → still show customer view (admin can view customer-facing site)
  - ELSE → display product grid with filters, search, and availability badges
- **Initial Content:** Product grid (all products), category filter, search bar

**Product Detail Page**
- **URL:** `https://musaniware.com/product/:id`
- **Example:** `https://musaniware.com/product/prod_001`
- **Initial Screen:** Product detail view
- **Behavior:**
  - IF product ID exists in Firestore → load and display product data
  - ELSE → show 404 page with "Product not found" message and link back to Shop
- **Initial Content:** Product gallery, name, price, description, color options, availability badge

**Category Page**
- **URL:** `https://musaniware.com/category/:slug`
- **Examples:**
  - `https://musaniware.com/category/new-arrivals`
  - `https://musaniware.com/category/stitched`
  - `https://musaniware.com/category/unstitched`
  - `https://musaniware.com/category/luxe`
- **Initial Screen:** Category-filtered product grid
- **Behavior:**
  - IF category slug exists → load products filtered by category
  - ELSE → show 404 page and link back to Shop
- **Initial Content:** Breadcrumb (Home > Category), filtered product grid, category title

**Admin Login**
- **URL:** `https://musaniware.com/admin/login`
- **Initial Screen:** Login form
- **Behavior:**
  - IF user already authenticated as admin → redirect to `/admin` dashboard
  - ELSE → display login form
- **Initial Content:** Email input, password input, login button, "Forgot password?" link

**Admin Protected Routes (if not authenticated)**
- **URLs:** `/admin`, `/admin/products`, `/admin/categories`, `/admin/products/new`, `/admin/products/:id/edit`
- **Initial Behavior:**
  - IF user NOT authenticated → redirect to `/admin/login`
  - ELSE → allow access to requested admin page

### 1.2 Deep Links

**Product Share Link**
- **Pattern:** `https://musaniware.com/product/:id`
- **Example:** `https://musaniware.com/product/prod_fancy_saree_001`
- **Behavior:**
  - IF product exists → load product detail
  - IF product not found → show 404 with navigation back to Shop
  - Mobile: Show full product gallery with swipe navigation

**Category Deep Link**
- **Pattern:** `https://musaniware.com/category/:slug`
- **Behavior:**
  - IF category exists → show filtered products
  - IF category not found → redirect to Shop page
  - Show breadcrumb navigation

### 1.3 Session / Authentication Flow

**Firebase Authentication**
- **Type:** Firebase Authentication with email/password
- **Storage:** Session stored in browser localStorage via Firebase SDK
- **Behavior:**
  - Admin credentials verified against Firebase Auth
  - On successful login, Firebase SDK stores auth token in localStorage
  - Auth token persists across page refreshes
  - On logout, auth token cleared from localStorage
  - All admin pages check for valid auth token before rendering

---

## 2. Navigation Structure & Site Map

### 2.1 Navigation Map (ASCII Diagram)

```
┌─ MUSANI WEAR (Logo) ──────────────────────────────────────────────────┐
│                                                                         │
│  [Home] [Shop] [Categories ▼] [WhatsApp Icon]                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    │                   │                   │
              [HOME /]          [SHOP /shop]        [CATEGORY /:slug]
                    │                   │                   │
            ┌─ Featured ─┐      ┌─ Grid View ─┐    ┌─ Filtered Grid ─┐
            │ Products   │      │ Category    │    │ (By Category)   │
            │ Categories │      │ Filter      │    │                 │
            │ Showcase   │      │ Search Bar  │    │ [New Arrivals]  │
            │            │      │ In Stock    │    │ [Stitched]      │
            └────────────┘      │ Badge       │    │ [Unstitched]    │
                    │           │ Product Card│    │ [Luxe]          │
            ┌─ Footer ──┐       │ Click → PDP │    └─────────────────┘
            │ WhatsApp  │       └─────────────┘             │
            │ Contact   │               │                   │
            └───────────┘               │                   │
                    │           ┌───────┴────────────────────┘
                    │           │
                    │     [PRODUCT DETAIL /product/:id]
                    │           │
                    │     ┌─ Image Gallery ─┐
                    │     │ Product Info    │
                    │     │ Color Swatches  │
                    │     │ In/Out Stock    │
                    │     │ WhatsApp Button │
                    │     └─────────────────┘
                    │             │
                    └─────────────┴─ [Footer with WhatsApp]
                                    │
                                    └─ Opens WhatsApp with prefilled message


ADMIN SECTION
┌─ /admin/login ──────────────────────────────────────────┐
│ Email Input                                              │
│ Password Input                                           │
│ [Login] Button                                           │
│                                                          │
│ Behavior: Firebase Auth verification → Dashboard if OK  │
└──────────────────────────────────────────────────────────┘
         │
         └─ Success ──→ [ADMIN DASHBOARD /admin]
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
    [Products List]   [Categories]   [Dashboard Stats]
    /admin/products   /admin/       /admin (main view)
         │            categories
         │
    ┌────┴────┐
    │          │
[Add New]  [Edit/Delete]
/new       /:id/edit
```

### 2.2 Full Navigation Hierarchy

**Customer-Facing Routes:**
```
/                           Home Page
/shop                       All Products Page (Shop)
/category/new-arrivals      New Arrivals Category
/category/stitched          Stitched Category
/category/unstitched        Unstitched Category
/category/luxe              Luxe Category
/product/:id                Product Detail Page

/404                        Not Found Page (automatic for invalid routes)
```

**Admin Routes (Protected):**
```
/admin/login                Login Page (public, but redirects if authenticated)
/admin                      Admin Dashboard
/admin/products             Products List
/admin/products/new         Add New Product Form
/admin/products/:id/edit    Edit Product Form
/admin/categories           Categories Management
```

### 2.3 Top Navigation Bar

**Desktop View (1024px+):**
```
┌──────────────────────────────────────────────────────────────┐
│ [Logo: Musani Wear]  [Shop]  [Categories ▼]  [WhatsApp Icon] │
└──────────────────────────────────────────────────────────────┘
```

**Mobile View (<640px):**
```
┌──────────────────────────────────────┐
│ [≡]  [Logo: Musani Wear]  [WhatsApp] │
└──────────────────────────────────────┘

  Hamburger Menu Dropdown:
  ├─ Shop
  ├─ New Arrivals
  ├─ Stitched
  ├─ Unstitched
  └─ Luxe
```

**Tablet View (640px - 1024px):**
```
┌──────────────────────────────────────────────────┐
│ [Logo: Musani Wear]  [Shop]  [Categories ▼]      │
│                                      [WhatsApp]  │
└──────────────────────────────────────────────────┘
```

### 2.4 Categories Dropdown Menu

**Behavior on Desktop:**
1. User hovers over "Categories" text
2. Dropdown menu appears with 300ms fade-in animation
3. IF user clicks a category → navigate to `/category/:slug`
4. IF user moves cursor away → dropdown fades out after 200ms

**Categories Listed:**
- New Arrivals
- Stitched
- Unstitched
- Luxe

### 2.5 Admin Sidebar Navigation

**Desktop View:**
```
┌──────────────────────────┐
│ MUSANI WEAR (Logo)       │
├──────────────────────────┤
│ □ Dashboard              │ ← /admin
├──────────────────────────┤
│ □ Products               │ ← /admin/products
│  └─ Add New Product      │    /admin/products/new
│  └─ Edit Product         │    /admin/products/:id/edit
├──────────────────────────┤
│ □ Categories             │ ← /admin/categories
├──────────────────────────┤
│ [Logout]                 │
└──────────────────────────┘
```

**Mobile View:**
- Sidebar collapses to icon-only or becomes hamburger menu
- Same links accessible via hamburger toggle

---

## 3. Complete User Flows with Decision Logic

### 3.1 Flow: Customer Browses Home Page

**User Goal:** Explore featured products and brand categories

**Entry Point:** User lands on `https://musaniware.com/` (homepage)

#### Happy Path

```
1. Page loads at /
   └─> Angular app initializes
   └─> Fetch hero banner config (title, image, tagline)
   └─> Fetch featured products (latest 8 from Firestore)
   └─> Fetch category showcase data

2. User sees rendered page:
   ├─ Hero Banner
   │  ├─ Background image
   │  ├─ Brand name: "Musani Wear"
   │  ├─ Tagline: "[Tagline from config]"
   │  └─ Call-to-action button: "Shop Now" → /shop
   │
   ├─ Featured Products Section
   │  ├─ Grid of 8 product cards (2 cols mobile, 4 cols desktop)
   │  ├─ Each card shows:
   │  │  ├─ Product image (thumbnail)
   │  │  ├─ Product name
   │  │  ├─ Price (INR)
   │  │  └─ Availability badge (green "In Stock" or red "Out of Stock")
   │  └─ Card hover effect: slight scale-up, shadow increase
   │
   ├─ Category Showcase Section
   │  ├─ 4 category cards (New Arrivals, Stitched, Unstitched, Luxe)
   │  ├─ Each shows category icon and name
   │  └─ Click card → navigate to /category/:slug
   │
   └─ Footer
      ├─ About text
      ├─ WhatsApp contact icon (green)
      ├─ Social media links (if applicable)
      └─ Copyright info

3. User clicks "Shop Now" button
   └─> Navigate to /shop

4. User clicks on category card (e.g., "Stitched")
   └─> Navigate to /category/stitched

5. User clicks on featured product card
   └─> Navigate to /product/:id

6. User scrolls to footer and clicks WhatsApp icon
   └─> Open https://wa.me/[business_number]
   └─> No pre-filled message (just general inquiry)
```

#### Error Scenarios

**Error: Featured products fail to load**
- **Trigger:** Firebase Firestore request times out or returns error
- **User sees:**
  - Loading skeleton/shimmer on product cards for 3 seconds
  - IF still loading after 3 seconds: "Loading products..." text
  - IF error persists: Retry button appears
- **User actions:**
  - Click [Retry] → fetch products again
  - If retry fails: Show error message "Unable to load products. Please try again later." with dismiss button
  - User can still navigate via navbar

**Error: Hero banner image fails to load**
- **Trigger:** Image URL returns 404 or network timeout
- **User sees:**
  - Colored background placeholder instead of image
  - Text still visible and readable
  - No error message shown (graceful degradation)

---

### 3.2 Flow: Customer Browses All Products (Shop Page)

**User Goal:** View all products, filter by category, search for specific items

**Entry Point:** User clicks "Shop" in navbar OR clicks "Shop Now" on homepage OR direct URL `/shop`

#### Happy Path

```
1. Page loads at /shop
   └─> Fetch all products from Firestore
   └─> Fetch categories for filter
   └─> Initialize filter state (All Products selected by default)

2. User sees rendered page:
   ├─ Top Section
   │  ├─ Page title: "Shop All Products" or "Dress Collection"
   │  ├─ Search bar (centered)
   │  │  └─ Placeholder: "Search by name, color, material..."
   │  └─ Result counter: "Showing [X] products"
   │
   ├─ Left Sidebar (Desktop) / Top Tabs (Mobile)
   │  ├─ Category filter options:
   │  │  ├─ ◉ All Products (default selected)
   │  │  ├─ ○ New Arrivals
   │  │  ├─ ○ Stitched
   │  │  ├─ ○ Unstitched
   │  │  └─ ○ Luxe
   │  └─ Click category → filter grid by category
   │
   └─ Product Grid
      ├─ Responsive layout:
      │  ├─ Mobile (<640px): 2 columns
      │  ├─ Tablet (640-1024px): 3 columns
      │  └─ Desktop (>1024px): 4 columns
      ├─ Each product card shows:
      │  ├─ Product image (square thumbnail)
      │  ├─ Product name
      │  ├─ Price (₹ format)
      │  ├─ Availability badge:
      │  │  ├─ Green "In Stock" if inventory > 0
      │  │  └─ Red "Out of Stock" if inventory = 0
      │  └─ Hover: slight scale, shadow, appearance of quick view
      └─ Click card → navigate to /product/:id

3. User types in search bar: "saree"
   └─> Real-time search (debounced 300ms)
   └─> IF search matches product names → filter results
   └─> IF no matches → show "No products found. Try another search."
   └─> Result counter updates dynamically
   └─> Search is case-insensitive
   └─> Search applies WITHIN current category filter

4. User clicks "Stitched" category
   └─> Category tab/button becomes highlighted/active
   └─> Product grid re-filters to show only Stitched products
   └─> Page scrolls to top of grid
   └─> Result counter updates: "Showing [X] Stitched products"
   └─> If product was previously in search, search result also re-filters
   └─> URL may update to include category (optional: /shop?category=stitched)

5. User clicks product card
   └─> Navigate to /product/:id (see flow 3.3)

6. User scrolls down to see more products (infinite scroll or pagination)
   └─> IF infinite scroll enabled:
       └─> Load next batch of 12 products as user reaches bottom
       └─> Show loading indicator briefly
   └─> IF pagination enabled:
       └─> Show page numbers at bottom (e.g., Page 1 / 3)
       └─> Click next page → load next 12 products

```

#### Error Scenarios

**Error: Products fail to load**
- **Trigger:** Firestore request fails or times out
- **User sees:**
  - Loading skeleton cards for 3 seconds
  - Then error message: "Unable to load products. Please try again."
  - [Retry] button appears
- **User actions:** Click [Retry] → fetch products again

**Error: Search yields no results**
- **Trigger:** User searches for term with no matching products
- **User sees:**
  - Empty grid with message: "No products found matching 'xyz'. Try a different search."
  - [Clear Search] button to reset

**Error: Category filter has no products**
- **Trigger:** User selects "Luxe" category but no products exist in that category
- **User sees:**
  - Empty grid with message: "No products in this category yet."
  - [View All Products] button to reset filter

---

### 3.3 Flow: Customer Views Product Detail

**User Goal:** See full product information, select color, and inquire via WhatsApp

**Entry Point:** User clicks product card from Home, Shop, or Category page

#### Happy Path

```
1. Page loads at /product/:id (e.g., /product/prod_001)
   └─> Fetch product data from Firestore by ID
   └─> IF product exists:
       └─> Initialize image gallery
       └─> Set default color to first color option
       └─> Render page
   └─> IF product not found:
       └─> Show 404 page (see error scenario below)

2. User sees rendered Product Detail page:
   ├─ Breadcrumb Navigation (top)
   │  └─ [Home /] > [Category Name /category/:slug] > [Product Name]
   │
   ├─ Left Section - Image Gallery (Desktop) / Top (Mobile)
   │  ├─ Large main image (responsive to container)
   │  ├─ Thumbnail strip below (shows 4-6 thumbnails)
   │  ├─ Desktop: Hover effect on main image (zoom slightly)
   │  ├─ Mobile: Swipe left/right to change images
   │  └─ Image counter: "[Current] / [Total]" (e.g., "1 / 5")
   │
   ├─ Right Section - Product Info (Desktop) / Bottom (Mobile)
   │  ├─ Product Name (large heading)
   │  ├─ Price
   │  │  └─ Formatted as "₹[Amount]" (e.g., "₹2,499")
   │  ├─ Category badge (e.g., "Stitched" in colored pill)
   │  ├─ Availability Badge
   │  │  ├─ Green "In Stock" if inventory > 0
   │  │  └─ Red "Out of Stock" if inventory = 0
   │  │
   │  ├─ Description (product story/details)
   │  │  └─ Multi-line text explaining fabric, fit, care instructions
   │  │
   │  ├─ Product Details Section
   │  │  ├─ Material/Fabric: [e.g., "Cotton Blend"]
   │  │  ├─ Care Instructions: [e.g., "Hand wash in cold water"]
   │  │  └─ Other specs as relevant
   │  │
   │  ├─ Color Selection
   │  │  ├─ "Available Colors:" label
   │  │  ├─ Color swatches (circular or square)
   │  │  ├─ Each swatch shows actual color
   │  │  ├─ Default swatch is pre-selected (highlighted border)
   │  │  ├─ User clicks swatch → update selected color
   │  │  ├─ Update main image to show selected color
   │  │  └─ Color name appears below swatch (e.g., "Maroon", "Navy Blue")
   │  │
   │  └─ Call-to-Action Button
   │     └─ "Ask Availability on WhatsApp" button (green, prominent)
   │        ├─ Button shows WhatsApp icon
   │        ├─ IF product Out of Stock:
   │        │  └─ Button text: "Notify me on WhatsApp"
   │        │  └─ Pre-filled message: "Hi! Is [Product Name] in [Color] coming back in stock soon?"
   │        └─ IF product In Stock:
   │           └─ Button text: "Ask Availability on WhatsApp"
   │           └─ Pre-filled message: "Hi! I'm interested in [Product Name] (Color: [Selected Color], Price: ₹[Price]). Could you please confirm availability?"
   │
   └─ Footer (same as homepage)

3. User clicks on color swatch (e.g., "Maroon")
   └─> Selected color is highlighted (thick border or checkmark)
   └─> Main product image updates to show Maroon color variant
   └─> Thumbnail strip updates if different images for this color
   └─> Color name displays below swatches
   └─> WhatsApp message will include selected color

4. User clicks "Ask Availability on WhatsApp" button
   └─> IF product In Stock:
       └─> Open WhatsApp with pre-filled message:
           "Hi! I'm interested in [Product Name] (Color: [Selected Color], Price: ₹[Price]). Could you please confirm availability?"
   └─> IF product Out of Stock:
       └─> Open WhatsApp with pre-filled message:
           "Hi! Is [Product Name] in [Selected Color] coming back in stock soon?"
   └─> Link: https://wa.me/[business_number]?text=[URL_encoded_message]
   └─> WhatsApp app opens (mobile) or WhatsApp Web opens (desktop)
   └─> User sends message and waits for reply from business owner

5. User clicks thumbnail image in gallery
   └─> Main image updates to show clicked thumbnail
   └─> Update image counter

6. User swipes left on main image (mobile)
   └─> Show next image in gallery
   └─> Update image counter
   └─> Animate slide transition

7. User scrolls down to read full product description
   └─> Expandable sections (if description is long):
       ├─ Material & Care
       ├─ Sizing Guidelines
       ├─ Shipping & Returns
       └─ FAQ (if applicable)

8. User clicks Breadcrumb link (e.g., "Stitched")
   └─> Navigate to /category/stitched

9. User clicks breadcrumb "Home"
   └─> Navigate to /

```

#### Error Scenarios

**Error: Product not found (404)**
- **Trigger:** User navigates to `/product/invalid_id` or product was deleted
- **User sees:**
  - Page title: "404 - Product Not Found"
  - Message: "The product you're looking for doesn't exist or has been removed."
  - [Back to Shop] button → /shop
  - [Home] button → /
  - Illustration (optional)
- **User actions:** Navigate back using provided buttons or browser back button

**Error: Product images fail to load**
- **Trigger:** Firebase Storage URL returns 404 or network error
- **User sees:**
  - Placeholder image (gray background with image icon)
  - Text: "Unable to load image"
  - Main product info still visible
  - WhatsApp button still functional
- **No blocking error:** User can still inquire via WhatsApp

**Error: Product data fails to load (incomplete)**
- **Trigger:** Firestore returns product but missing some fields
- **User sees:**
  - Available data displays normally
  - Missing data shows placeholder or is omitted
  - Example: If no color options, "Color" section not shown
  - Example: If no description, only key details shown
  - WhatsApp button still works with available data

---

### 3.4 Flow: Customer Views Category Page

**User Goal:** Browse products within a specific category

**Entry Point:** User clicks category card (Home), category link (navbar), or navigates to `/category/:slug`

#### Happy Path

```
1. Page loads at /category/:slug (e.g., /category/stitched)
   └─> Fetch category data and products for that category
   └─> IF category exists:
       └─> Render category page
   └─> IF category not found:
       └─> Show 404 page

2. User sees rendered Category page:
   ├─ Breadcrumb Navigation
   │  └─ [Home /] > [Category Name]
   │
   ├─ Category Header
   │  ├─ Category name as large heading (e.g., "Stitched")
   │  ├─ Category description (optional)
   │  └─ Product count: "Showing [X] products"
   │
   ├─ Product Grid
   │  ├─ Same layout as Shop page
   │  ├─ Responsive: 2 cols (mobile), 3 cols (tablet), 4 cols (desktop)
   │  ├─ Each product card:
   │  │  ├─ Image, name, price, availability badge
   │  │  └─ Click card → navigate to /product/:id
   │  └─ Products sorted by newest first (or by popularity)
   │
   └─ Footer

3. User clicks product card
   └─> Navigate to /product/:id

4. User clicks "Home" breadcrumb
   └─> Navigate to /

5. User uses browser back button
   └─> Return to previous page (Shop or Home)

```

#### Error Scenarios

**Error: Category not found (404)**
- **Trigger:** User navigates to `/category/invalid_slug`
- **User sees:**
  - Page title: "404 - Category Not Found"
  - Message: "The category you're looking for doesn't exist."
  - [Back to Shop] button
  - [Home] button
- **User actions:** Navigate back

**Error: No products in category**
- **Trigger:** Category exists but has zero products
- **User sees:**
  - Category name and description shown
  - Empty grid with message: "No products in this category yet. Check back soon!"
  - [View All Products] button → /shop
- **Not an error state:** Just an empty result

**Error: Products fail to load**
- **Trigger:** Firestore query fails
- **User sees:**
  - Loading skeletons for 3 seconds
  - Then error message: "Unable to load products. Please try again."
  - [Retry] button
- **User actions:** Click [Retry] or navigate back

---

### 3.5 Flow: Admin Logs In

**User Goal:** Authenticate as admin to access protected dashboard

**Entry Point:** User navigates to `/admin/login` (or tries to access `/admin` without auth)

#### Happy Path

```
1. Page loads at /admin/login
   └─> Check if user already authenticated (via Firebase token)
   └─> IF authenticated:
       └─> Redirect to /admin dashboard immediately
   └─> ELSE:
       └─> Display login form

2. User sees login form:
   ├─ Heading: "Admin Login"
   ├─ Email input field
   │  ├─ Label: "Email"
   │  ├─ Placeholder: "admin@musaniware.com"
   │  └─ Type: email
   ├─ Password input field
   │  ├─ Label: "Password"
   │  ├─ Type: password (text hidden)
   │  └─ Placeholder: "••••••••"
   ├─ [Remember Me] checkbox (optional)
   ├─ [Login] button (primary)
   └─ "Forgot Password?" link (if password reset enabled)

3. User enters email: "admin@musaniware.com"
   └─> Input value updates in real-time
   └─> No validation shown until form submission

4. User enters password: "securepassword123"
   └─> Input value updates (masked as dots)
   └─> No validation shown until form submission

5. User clicks [Login] button
   └─> Validate form:
       ├─ IF email field empty:
       │  └─> Show error: "Email is required"
       │  └─> Highlight email field with red border
       │  └─> Focus email field
       │  └─> Prevent submission
       └─> IF email format invalid (not user@domain.com):
           └─> Show error: "Enter a valid email address"
           └─> Highlight email field
           └─> Prevent submission
       └─> IF password field empty:
           └─> Show error: "Password is required"
           └─> Highlight password field
           └─> Prevent submission
   └─> IF all validation passes:
       └─> Disable login button
       └─> Show loading spinner in button: "Signing in..."
       └─> Submit credentials to Firebase Auth
       └─> Firebase calls: auth.signInWithEmailAndPassword(email, password)

6. Firebase processes authentication:
   └─> IF credentials valid:
       └─> Firebase generates auth token
       └─> Token stored in localStorage
       └─> Show success message: "Login successful! Redirecting..."
       └─> Wait 500ms
       └─> Redirect to /admin dashboard
   └─> IF credentials invalid:
       └─> Show error message: "Invalid email or password. Please try again."
       └─> Clear password field
       └─> Focus email field
       └─> Enable login button
       └─> No indication which field is wrong (security best practice)
   └─> IF Firebase service unavailable:
       └─> Show error: "Authentication service unavailable. Please try again later."
       └─> Enable login button

7. User successfully logs in
   └─> Redirect to /admin
   └─> Dashboard page loads with admin content
   └─> Sidebar shows "Dashboard", "Products", "Categories", "Logout"

```

#### Error Scenarios

**Error: Invalid credentials**
- **Trigger:** User enters non-existent email or wrong password
- **Message:** "Invalid email or password. Please try again."
- **Behavior:**
  - Red error banner appears below login button
  - Password field is cleared for security
  - Email field kept for convenience
  - Button becomes enabled again for retry
  - Error persists for 5 seconds, then auto-dismiss
- **User action:** Try again with correct credentials

**Error: Firebase authentication service down**
- **Trigger:** Firebase Auth API returns 500 error
- **Message:** "Authentication service unavailable. Please try again later."
- **Behavior:**
  - Error shown in red banner
  - User can retry
  - If persists, contact support message appears

**Error: Rate limiting (too many login attempts)**
- **Trigger:** User fails login 5+ times in 5 minutes
- **Message:** "Too many login attempts. Please try again in 15 minutes."
- **Behavior:**
  - Login button disabled
  - Countdown timer shows: "Try again in 15:00"
  - User can use "Forgot Password?" to reset and try recovery flow
  - After timeout, button re-enables

**Error: User closes browser before redirect**
- **Trigger:** Connection closes after auth but before redirect
- **Behavior:**
  - Firebase token still stored in localStorage
  - Next visit to /admin loads dashboard directly (token auto-detected)
  - Or user manually navigates to /admin

---

### 3.6 Flow: Admin Views Dashboard

**User Goal:** See product statistics and quick access to admin functions

**Entry Point:** Admin clicks "Dashboard" sidebar link or visits `/admin` after login

#### Happy Path

```
1. Page loads at /admin
   └─> Check authentication:
       ├─ IF no auth token in localStorage:
       │  └─> Redirect to /admin/login
       └─ IF valid auth token:
           └─> Continue to load dashboard
   └─> Fetch dashboard stats from Firestore:
       ├─ Total products count
       ├─ In Stock products count
       ├─ Out of Stock products count
       └─ Recent products (last 5-10)

2. User sees Admin Dashboard:
   ├─ Top Section - Header
   │  ├─ "Dashboard" heading
   │  ├─ Greeting: "Welcome, [Admin Name]"
   │  └─ Last login info: "Last logged in: [Date/Time]"
   │
   ├─ Stats Section (4 cards in row, responsive)
   │  ├─ Card 1: Total Products
   │  │  ├─ Icon (product icon)
   │  │  ├─ Number: "[Total count]" (e.g., "24")
   │  │  ├─ Label: "Total Products"
   │  │  └─ Change indicator (optional, e.g., "+2 this month")
   │  │
   │  ├─ Card 2: In Stock
   │  │  ├─ Icon (green checkmark)
   │  │  ├─ Number: "[In stock count]" (e.g., "20")
   │  │  ├─ Label: "In Stock"
   │  │  └─ Percentage: "[X]% of total"
   │  │
   │  ├─ Card 3: Out of Stock
   │  │  ├─ Icon (red warning)
   │  │  ├─ Number: "[Out of stock count]" (e.g., "4")
   │  │  ├─ Label: "Out of Stock"
   │  │  └─ Percentage: "[X]% of total"
   │  │
   │  └─ Card 4: Categories
   │     ├─ Icon (folder icon)
   │     ├─ Number: "[Category count]" (e.g., "4")
   │     └─ Label: "Categories"
   │
   ├─ Quick Actions Section
   │  ├─ [+ Add New Product] button → /admin/products/new
   │  └─ [View All Products] button → /admin/products
   │
   ├─ Recent Products Section
   │  ├─ Heading: "Recently Added Products"
   │  ├─ Table with columns:
   │  │  ├─ Image (small thumbnail)
   │  │  ├─ Name
   │  │  ├─ Category
   │  │  ├─ Price
   │  │  ├─ Stock Status
   │  │  └─ Actions (Edit, View)
   │  ├─ Shows last 5 products, newest first
   │  ├─ Click product row → navigate to /product/:id (customer view)
   │  └─ Click [Edit] → navigate to /admin/products/:id/edit
   │
   └─ Sidebar (left)
      ├─ ☑ Dashboard (current page, highlighted)
      ├─ Products → /admin/products
      ├─ Categories → /admin/categories
      └─ [Logout] button

3. User clicks [Add New Product] button
   └─> Navigate to /admin/products/new (see flow 3.8)

4. User clicks [View All Products] button
   └─> Navigate to /admin/products (see flow 3.7)

5. User clicks [Edit] on recent product
   └─> Navigate to /admin/products/:id/edit

6. User clicks product name in recent products table
   └─> Navigate to /product/:id (customer-facing product page)

7. User clicks "Products" sidebar link
   └─> Navigate to /admin/products

8. User clicks "Categories" sidebar link
   └─> Navigate to /admin/categories

9. User clicks [Logout] button
   └─> Firebase sign out: auth.signOut()
   └─> Clear auth token from localStorage
   └─> Clear any cached data
   └─> Redirect to /admin/login
   └─> Show confirmation: "You have been logged out."

```

#### Error Scenarios

**Error: Stats fail to load**
- **Trigger:** Firestore query timeout or error
- **User sees:**
  - Stat cards show skeleton loaders for 3 seconds
  - Then error state: "[Error loading stats]" with retry button
  - Sidebar and header still visible and functional
- **User actions:** Click [Retry] or navigate to Products page (still works)

**Error: Session expired while viewing**
- **Trigger:** Firebase token expires or is revoked
- **User sees:**
  - Page content fades slightly
  - Modal appears: "Your session has expired. Please log in again."
  - [Login Again] button
- **User actions:** Click button → redirect to /admin/login

---

### 3.7 Flow: Admin Manages Products List

**User Goal:** View all products, search, filter, edit, and delete products

**Entry Point:** Admin clicks "Products" sidebar link or visits `/admin/products`

#### Happy Path

```
1. Page loads at /admin/products
   └─> Check authentication → if not authenticated, redirect to /admin/login
   └─> Fetch all products from Firestore
   └─> Fetch categories for filter dropdown

2. User sees Products List page:
   ├─ Top Section
   │  ├─ Heading: "Products"
   │  ├─ Search bar: "Search by product name, category, ID..."
   │  ├─ Filter dropdown: "Category: [All Products ▼]"
   │  └─ [+ Add New Product] button (prominent, green)
   │
   ├─ Table View (Desktop) / Card View (Mobile)
   │  ├─ Columns (Desktop):
   │  │  ├─ Checkbox (select all / individual select)
   │  │  ├─ Image (thumbnail, 40x40px)
   │  │  ├─ Product Name (click → edit)
   │  │  ├─ Category (text, filterable)
   │  │  ├─ Price (INR, right-aligned)
   │  │  ├─ Status (In Stock / Out of Stock, colored pill)
   │  │  ├─ Added Date (e.g., "Mar 5, 2026")
   │  │  └─ Actions (Edit, Delete buttons)
   │  │
   │  ├─ Rows (show 20 products per page)
   │  │  ├─ Row is clickable → navigate to /admin/products/:id/edit
   │  │  ├─ Alternating row colors for readability
   │  │  └─ Hover effect: row background lightens
   │  │
   │  └─ Pagination (bottom)
   │     ├─ "Showing [X] to [Y] of [Total]"
   │     ├─ Previous / Next buttons
   │     └─ Page number selector (e.g., "1 | 2 | 3")
   │
   └─ Bulk Actions Section (if products selected)
      ├─ "[X] products selected"
      ├─ Bulk status toggle: [Mark as In Stock] [Mark as Out of Stock]
      └─ [Delete Selected] button (with confirmation)

3. User types in search bar: "saree"
   └─> Debounced search (300ms)
   └─> IF matches found → filter table to show matching products
   └─> IF no matches → "No products found" message
   └─> Result count updates

4. User clicks category filter dropdown
   └─> Show dropdown with options:
       ├─ All Products
       ├─ New Arrivals
       ├─ Stitched
       ├─ Unstitched
       └─ Luxe
   └─> Click option → filter table to show only products in that category
   └─> Dropdown closes
   └─> Table updates, result count updates

5. User clicks [Edit] button on a product row
   └─> Navigate to /admin/products/:id/edit (see flow 3.8)

6. User clicks [Delete] button on a product row
   └─> Show confirmation modal:
       ├─ Title: "Delete Product?"
       ├─ Message: "Are you sure you want to delete '[Product Name]'? This action cannot be undone."
       ├─ [Cancel] button
       └─ [Delete] button (red, prominent)
   └─> IF [Cancel] clicked:
       └─> Modal closes, product stays
   └─> IF [Delete] clicked:
       └─> Disable delete button, show "Deleting..." spinner
       └─> Delete from Firestore
       └─> Delete images from Firebase Storage (if applicable)
       └─> Show success toast: "[Product Name] has been deleted."
       └─> Remove row from table
       └─> Update result count

7. User clicks product name in table
   └─> Navigate to /admin/products/:id/edit

8. User clicks [+ Add New Product] button
   └─> Navigate to /admin/products/new

9. User selects product checkbox
   └─> Row is highlighted
   └─> Checkbox is checked
   └─> "Select All" checkbox at table top updates state
   └─> Bulk Actions section appears or updates

10. User clicks bulk status toggle: [Mark as In Stock]
    └─> Confirmation: "Update [X] products to In Stock?"
    └─> [Confirm] [Cancel]
    └─> IF Confirm:
        └─> Update Firestore docs for selected products
        └─> Status column updates for each row
        └─> Show success: "[X] products marked as In Stock"
        └─> Selection cleared

11. User clicks pagination "Next" button
    └─> Load next 20 products
    └─> Scroll to top of table
    └─> Page number updates

```

#### Error Scenarios

**Error: Products fail to load**
- **Trigger:** Firestore query fails
- **User sees:**
  - Table skeleton loaders for 3 seconds
  - Error message: "Unable to load products. Please try again."
  - [Retry] button
- **User actions:** Click [Retry]

**Error: Delete fails**
- **Trigger:** Firestore delete operation fails
- **User sees:**
  - After "Deleting..." spinner, error modal appears:
    "Unable to delete product. Please try again."
  - [Retry] [Cancel] buttons
- **User actions:** Click [Retry] or [Cancel]

**Error: Bulk update fails**
- **Trigger:** Firestore batch update fails
- **User sees:**
  - Error toast: "Unable to update [X] products. Please try again."
  - Affected rows revert to previous state
- **User actions:** Try bulk action again or edit individually

---

### 3.8 Flow: Admin Adds or Edits a Product

**User Goal:** Create new product or update existing product information

**Entry Point:**
- NEW: Admin clicks [+ Add New Product] button → navigates to `/admin/products/new`
- EDIT: Admin clicks [Edit] on a product → navigates to `/admin/products/:id/edit`

#### Happy Path - NEW PRODUCT

```
1. Page loads at /admin/products/new
   └─> Check authentication → if not authenticated, redirect to /admin/login
   └─> Initialize empty form with default values:
       ├─ Product Name: ""
       ├─ Description: ""
       ├─ Price: 0
       ├─ Material: ""
       ├─ Category: [Select Category]
       ├─ Colors: [] (empty array)
       ├─ Images: [] (empty array)
       └─ In Stock: true (checked)
   └─> Fetch categories from Firestore for dropdown

2. User sees Add Product form:
   ├─ Page heading: "Add New Product"
   │
   ├─ Basic Information Section
   │  ├─ Product Name field
   │  │  ├─ Label: "Product Name *"
   │  │  ├─ Input: text, max 100 characters
   │  │  ├─ Placeholder: "e.g., Maroon Silk Saree"
   │  │  └─ Character counter: "[0]/100"
   │  │
   │  └─ Description field
   │     ├─ Label: "Description *"
   │     ├─ Input: textarea, max 1000 characters
   │     ├─ Placeholder: "Describe the product, materials, fit, care instructions..."
   │     └─ Character counter: "[0]/1000"
   │
   ├─ Pricing & Stock Section
   │  ├─ Price field
   │  │  ├─ Label: "Price (INR) *"
   │  │  ├─ Input: number
   │  │  ├─ Prefix: "₹"
   │  │  └─ Placeholder: "0"
   │  │
   │  └─ Stock Status toggle
   │     ├─ Label: "Availability"
   │     ├─ Toggle: ☑ In Stock / Out of Stock (checkbox)
   │     └─ IF checked: "In Stock", IF unchecked: "Out of Stock"
   │
   ├─ Product Details Section
   │  ├─ Material/Fabric field
   │  │  ├─ Label: "Material/Fabric"
   │  │  ├─ Input: text, max 100 characters
   │  │  └─ Placeholder: "e.g., Cotton Blend, Silk, Georgette"
   │  │
   │  └─ Category dropdown
   │     ├─ Label: "Category *"
   │     ├─ Dropdown: [Select Category ▼]
   │     └─ Options: New Arrivals, Stitched, Unstitched, Luxe
   │
   ├─ Colors Section
   │  ├─ Heading: "Available Colors"
   │  ├─ Instructions: "Add at least one color"
   │  ├─ Color swatches/inputs:
   │  │  ├─ Row for each color:
   │  │  │  ├─ Color picker (visual color swatch)
   │  │  │  ├─ Color name input (text field, e.g., "Maroon")
   │  │  │  └─ [Remove] button (X icon)
   │  │  └─ Show 0 colors initially
   │  │
   │  └─ [+ Add Color] button
   │     └─> Click → add new empty color input row
   │        └─> Focus on new color picker
   │        └─> Can add unlimited colors (practical limit ~10)
   │
   ├─ Images Section
   │  ├─ Heading: "Product Images"
   │  ├─ Instructions: "Upload multiple images (JPG, PNG, max 5MB each)"
   │  ├─ Drag & Drop Zone
   │  │  ├─ Text: "Drag images here or click to select"
   │  │  ├─ Accepts: *.jpg, *.png, *.jpeg
   │  │  └─ Click zone → opens file picker
   │  │
   │  ├─ Image Previews (grid)
   │  │  ├─ Thumbnail for each uploaded image (100x100px)
   │  │  ├─ Filename displayed below thumbnail
   │  │  ├─ File size displayed (e.g., "2.3 MB")
   │  │  └─ [X] delete button on hover/corner
   │  │
   │  └─ Upload progress bar (while uploading)
   │     └─> Shows "[X]% uploaded" for each image
   │
   └─ Form Actions (bottom)
      ├─ [Save Product] button (green, prominent)
      ├─ [Save as Draft] button (optional, saves but doesn't publish)
      └─ [Cancel] button (gray)

3. User enters Product Name: "Maroon Silk Saree"
   └─> Input value updates in real-time
   └─> Character counter updates: "15/100"
   └─> No validation error (yet)

4. User enters Description: "This beautiful saree is..."
   └─> Input value updates
   └─> Character counter: "25/1000"

5. User enters Price: "2499"
   └─> Value updates, displayed as "₹2499"
   └─> Real-time formatting with thousand separators: "₹2,499" (display only)

6. User leaves Stock Status toggle checked (In Stock)
   └─> Availability set to "In Stock"

7. User enters Material: "Cotton Blend"
   └─> Input value updates

8. User clicks Category dropdown and selects "Stitched"
   └─> Dropdown closes
   └─> Category field shows "Stitched"

9. User clicks [+ Add Color] button
   └─> New color row appears
   ├─ Color picker defaults to "White" (hex #FFFFFF)
   └─ Color name input is empty and focused

10. User clicks color picker swatch
    └─> Color picker modal/palette opens
    └─> User can:
        ├─ Click predefined colors (palette)
        ├─ Use color wheel to select
        ├─ Enter hex code directly (e.g., "#8B0000" for Maroon)
        └─ Preview shows current selection
    └─> User selects Maroon (#8B0000)
    └─> Swatch updates to show Maroon
    └─> Modal closes
    └─> Color picker returns to closed state

11. User enters Color name: "Maroon"
    └─> Input value updates

12. User clicks [+ Add Color] again to add second color
    └─> Another color row appears
    └─> User repeats process: selects Navy Blue, names it "Navy"

13. User clicks drag & drop zone in Images Section
    └─> File picker dialog opens (native browser file picker)
    └─> User selects multiple images: saree_1.jpg, saree_2.jpg
    └─> Files are selected (validation on next step)

14. Files are processing:
    └─> Validation happens:
        ├─ IF file type not .jpg/.png:
        │  └─> Error: "[filename] is not a supported format. Use JPG or PNG."
        │  └─> File not added to list
        └─> IF file size > 5MB:
            └─> Error: "[filename] is too large (5MB max)."
            └─> File not added to list
    └─> IF files valid:
        └─> Images added to upload queue
        └─> Previews appear in Image Previews grid
        └─> Each shows filename, size, and delete button
        └─> Upload to Firebase Storage starts immediately
        └─> Progress bar shows: "saree_1.jpg: 45% uploaded"
        └─> Once uploaded: progress bar disappears, thumbnail stays visible

15. User drags additional images to drag zone
    └─> Same process repeats (validation, upload, preview)

16. User reviews all form fields before submission:
    ├─ Product Name: "Maroon Silk Saree"
    ├─ Description: "This beautiful saree is..."
    ├─ Price: "₹2,499"
    ├─ Material: "Cotton Blend"
    ├─ Category: "Stitched"
    ├─ Stock: In Stock (checked)
    ├─ Colors: [Maroon, Navy]
    └─ Images: [2 images uploaded]

17. User clicks [Save Product] button
    └─> Validate form:
        ├─ IF Product Name empty → Error: "Product name is required"
        ├─ IF Description empty → Error: "Description is required"
        ├─ IF Price empty or 0 → Error: "Price is required (must be > 0)"
        ├─ IF Category not selected → Error: "Category is required"
        ├─ IF no colors added → Error: "Add at least one color"
        ├─ IF no images uploaded → Error: "Upload at least one image"
        └─> On any error: Show error summary at top in red box
            └─> Scroll to first error
            └─> Highlight invalid fields with red border
    └─> IF all validation passes:
        └─> Disable [Save Product] button
        └─> Show loading spinner: "Saving..."
        └─> Prepare data object:
            {
              name: "Maroon Silk Saree",
              description: "...",
              price: 2499,
              material: "Cotton Blend",
              category: "stitched",
              colors: [
                { name: "Maroon", hex: "#8B0000" },
                { name: "Navy", hex: "#000080" }
              ],
              images: ["gs://bucket/image1.jpg", "gs://bucket/image2.jpg"],
              inStock: true,
              createdAt: [Current timestamp],
              updatedAt: [Current timestamp]
            }
        └─> POST to Firestore: `products` collection
        └─> Firebase creates new document with auto-generated ID
        └─> Data saved successfully
        └─> Show success toast: "Product saved successfully!"
        └─> Wait 1 second
        └─> Redirect to /admin/products (products list)

```

#### Happy Path - EDIT PRODUCT

```
1. Page loads at /admin/products/:id/edit (e.g., /admin/products/prod_001/edit)
   └─> Check authentication
   └─> Fetch product data from Firestore by ID
   └─> IF product exists:
       └─> Populate form with existing data:
           ├─ Product Name: "[existing name]"
           ├─ Description: "[existing description]"
           ├─ Price: [existing price]
           ├─ Material: "[existing material]"
           ├─ Category: "[existing category]"
           ├─ Colors: [list of existing colors with swatches]
           ├─ Images: [thumbnails of existing images]
           └─ Stock Status: [existing status]
   └─> IF product not found:
       └─> Show error: "Product not found."
       └─> Redirect to /admin/products

2. User sees Edit Product form (same layout as New, but with pre-populated data)
   └─> Page heading: "Edit Product - [Product Name]"
   └─> All fields populated with existing values
   └─> Images show as previews with delete buttons
   └─> Colors shown with swatches and names

3. User changes Price from "₹2,499" to "₹2,999"
   └─> Input value updates
   └─> Form marks as "unsaved changes"
   └─> Show visual indicator: form title changes color or shows "*" (modified)

4. User deletes one color by clicking [X] button on color row
   └─> Confirmation dialog: "Remove color 'Maroon'?"
   └─> IF [Remove] clicked:
       └─> Color row removed
       └─> Remaining colors reorder
   └─> IF [Cancel] clicked:
       └─> Dialog closes, color stays

5. User deletes one image by clicking [X] button on image thumbnail
   └─> Image thumbnail disappears immediately
   └─> File marked for deletion
   └─> Confirmation will happen on save

6. User clicks [Save Product] button
   └─> Validation same as above
   └─> IF valid:
       └─> Disable button, show "Saving..."
       └─> Prepare update object (only changed fields + updatedAt)
       └─> PATCH to Firestore: update existing document
       └─> IF images marked for deletion:
           └─> Delete from Firebase Storage
       └─> Show success: "Product updated successfully!"
       └─> Redirect to /admin/products

7. User clicks [Cancel] button
   └─> IF form has unsaved changes:
       └─> Confirmation dialog: "Discard changes? Any unsaved edits will be lost."
       └─> [Discard] [Keep Editing]
       └─> IF [Discard]:
           └─> Redirect to /admin/products
       └─> IF [Keep Editing]:
           └─> Dialog closes, stay on form
   └─> IF no unsaved changes:
       └─> Redirect directly to /admin/products

```

#### Error Scenarios

**Error: Required fields missing**
- **Trigger:** User clicks [Save] with empty required fields
- **User sees:**
  - Red error box at top: "Please fix [X] errors below"
  - Invalid fields highlighted with red border
  - Specific error message below each field
  - Page scrolls to first error
- **User actions:** Fill required fields and try again

**Error: Invalid file format for images**
- **Trigger:** User tries to upload .gif, .webp, or other unsupported format
- **User sees:**
  - Error message: "[filename] is not a supported format. Use JPG or PNG."
  - File not added to previews
  - Other valid files from same selection are added
- **User actions:** Re-select with correct formats

**Error: Image upload fails**
- **Trigger:** Firebase Storage returns error during upload
- **User sees:**
  - Image thumbnail shows error overlay: "Upload failed"
  - [Retry] button appears on thumbnail
- **User actions:** Click [Retry] to re-upload, or delete and re-upload

**Error: Price format invalid**
- **Trigger:** User enters non-numeric value in price field
- **User sees:**
  - On blur: Error message "Price must be a number (INR)"
  - Field highlighted with red border
- **User actions:** Clear and enter valid number

**Error: Save fails (Firestore error)**
- **Trigger:** Firestore write operation fails
- **User sees:**
  - Loading spinner stops
  - Error modal: "Unable to save product. Please try again."
  - [Retry] [Cancel] buttons
  - Form data is preserved
- **User actions:** Click [Retry] or fix issues and try again

**Error: Product already exists (edit only)**
- **Trigger:** Another admin deleted/modified product while user was editing
- **User sees:**
  - Error: "This product has been modified or deleted by another user."
  - [Reload] [Go Back] options
- **User actions:** Click [Reload] to see latest data, or [Go Back] to list

---

### 3.9 Flow: Admin Manages Categories

**User Goal:** View, add, edit, or delete product categories

**Entry Point:** Admin clicks "Categories" sidebar link or visits `/admin/categories`

#### Happy Path

```
1. Page loads at /admin/categories
   └─> Check authentication
   └─> Fetch categories from Firestore
   └─> Initialize state with all categories

2. User sees Categories page:
   ├─ Page heading: "Categories"
   │
   ├─ Add Category Section
   │  ├─ Input field: "Category Name"
   │  ├─ Placeholder: "e.g., Formal Wear"
   │  └─ [+ Add Category] button
   │
   ├─ Categories List (table or card view)
   │  ├─ Columns:
   │  │  ├─ Category Name
   │  │  ├─ Product Count (e.g., "8 products")
   │  │  └─ Actions (Edit, Delete)
   │  │
   │  └─ Rows for each category:
   │     ├─ "New Arrivals" | 8 products | [Edit] [Delete]
   │     ├─ "Stitched" | 12 products | [Edit] [Delete]
   │     ├─ "Unstitched" | 6 products | [Edit] [Delete]
   │     └─ "Luxe" | 4 products | [Edit] [Delete]
   │
   └─ Note: "Categories with 0 products can be deleted."

3. User types in category input: "Sarees"
   └─> Input value updates

4. User clicks [+ Add Category] button
   └─> Validate:
       ├─ IF input empty → Error: "Category name is required"
       │  └─> Highlight input with red border
       │  └─> Focus input
       ├─ IF category already exists (case-insensitive) → Error: "This category already exists"
       │  └─> Clear input
       │  └─> Focus input
       └─> IF valid:
           └─> Disable button, show "Adding..."
           └─> Save to Firestore: `categories` collection
           └─> Show success toast: "Category 'Sarees' added successfully!"
           └─> Clear input field
           └─> Add new row to categories table
           └─> Enable button

5. User wants to edit category name
   └─> Click [Edit] button on category row
   └─> Inline edit mode:
       ├─ Category name becomes editable input field
       ├─ Current name pre-filled
       ├─ [Save] [Cancel] buttons appear
   └─> User changes "Sarees" to "Premium Sarees"
   └─> Clicks [Save]
   └─> Validate: IF name already exists in another category → Error
   └─> IF valid:
       └─> Update Firestore document
       └─> Show success: "Category updated!"
       └─> Return to view mode
       └─> Table shows updated name

6. User clicks [Delete] on category
   └─> Fetch product count for this category
   └─> IF category has products (> 0):
       └─> Show error modal: "Cannot delete category with products"
       └─> Message: "This category has 8 products. Move or delete products first."
       └─> [Go to Products] button → /admin/products?category=luxe
       └─> [Close] button
   └─> IF category has 0 products:
       └─> Show confirmation modal:
           ├─ Title: "Delete Category?"
           ├─ Message: "Are you sure? This cannot be undone."
           ├─ [Cancel] button
           └─ [Delete] button (red)
       └─> IF [Delete] clicked:
           └─> Disable button, show "Deleting..."
           └─> Delete from Firestore
           └─> Row removed from table
           └─> Show success: "Category deleted!"

```

#### Error Scenarios

**Error: Category name already exists**
- **Trigger:** User tries to add or rename to a name that already exists
- **User sees:** "This category already exists. Please use a different name."
- **User actions:** Clear input and try different name

**Error: Cannot delete category with products**
- **Trigger:** User tries to delete category that has products
- **User sees:** Modal with message about products in category
- **User actions:** Move products to different category or delete them first

**Error: Fetch categories fails**
- **Trigger:** Firestore query fails
- **User sees:** Error message: "Unable to load categories. Please try again."
- **User actions:** Click [Retry] or refresh page

---

### 3.10 Flow: Admin Logs Out

**User Goal:** End admin session and return to login screen

**Entry Point:** Admin clicks [Logout] button in sidebar

#### Happy Path

```
1. User clicks [Logout] button in sidebar
   └─> Confirmation dialog appears:
       ├─ Title: "Confirm Logout?"
       ├─ Message: "You will be logged out of the admin panel."
       ├─ [Cancel] button
       └─ [Logout] button (red)

2. User clicks [Logout] button in confirmation
   └─> Disable button, show "Signing out..."
   └─> Firebase: auth.signOut()
   └─> Clear localStorage of auth token
   └─> Clear cached user data
   └─> Redirect to /admin/login
   └─> Show success message: "You have been logged out. See you soon!"

3. User is now on login page
   └─> Cannot access /admin routes
   └─> Must log in again to access admin panel

```

#### Alternative: Session Expires

```
1. Admin is viewing dashboard
2. After ~1 hour of inactivity, Firebase token expires
3. Next action (fetch data, navigate) triggers auth check
4. Auth check fails, token is invalid
5. Modal appears: "Your session has expired. Please log in again."
6. [Login] button on modal
7. Click → Redirect to /admin/login
8. Must re-enter credentials
```

---

## 4. Screen Inventory

Complete inventory of all screens/pages:

| Route | Screen Name | Access Level | Purpose | Key Components | Transitions From |
|-------|-------------|--------------|---------|-----------------|------------------|
| `/` | Home | Public | Landing page, brand showcase | Hero banner, featured products, category cards, footer | N/A (entry) |
| `/shop` | All Products | Public | Browse entire catalog | Product grid, category filter, search bar, pagination | Home, navbar |
| `/category/:slug` | Category View | Public | Browse category-specific products | Filtered product grid, breadcrumb, category title | Home, navbar, category cards |
| `/product/:id` | Product Detail | Public | View single product details | Image gallery, product info, color swatches, WhatsApp button, breadcrumb | Shop, Category, Home (featured) |
| `/404` | Not Found | Public | Error page for invalid routes | Error message, navigation buttons | Any invalid route |
| `/admin/login` | Admin Login | Public | Admin authentication | Email input, password input, login button | Redirect from protected routes |
| `/admin` | Admin Dashboard | Authenticated (Admin) | Admin home, stats overview | Stats cards, quick actions, recent products | Admin login, sidebar nav |
| `/admin/products` | Products List | Authenticated (Admin) | Manage all products | Product table, search, filter, bulk actions, pagination | Admin dashboard, sidebar nav |
| `/admin/products/new` | Add Product | Authenticated (Admin) | Create new product | Form (name, description, price, category, colors, images), upload | Products list, dashboard |
| `/admin/products/:id/edit` | Edit Product | Authenticated (Admin) | Modify existing product | Same as Add Product form, pre-populated with data | Products list, dashboard |
| `/admin/categories` | Categories Management | Authenticated (Admin) | Manage product categories | Categories list, add category input, edit/delete actions | Admin dashboard, sidebar nav |

---

## 5. Interaction Patterns & Detailed Behaviors

### 5.1 Forms

**Standard Product Form Pattern (Add/Edit):**

```
1. User focuses on field (e.g., "Product Name" input)
   └─> Border color changes to blue (--color-primary-500)
   └─> Label text color changes to blue
   └─> Show subtle shadow or glow
   └─> Cursor is positioned in field

2. User types input: "Maroon Silk Saree"
   └─> Character counter updates (if applicable): "15/100"
   └─> No validation error shown yet
   └─> Field remains focused (blue border)

3. User leaves field (blur)
   └─> Run validation:
       ├─> IF field is required and empty:
       │  ├─ Show error icon (red X) inside field (right side)
       │  ├─ Show error message below field in red text: "[Field] is required"
       │  ├─ Border changes to red
       │  └─ Background tint turns light red
       │
       ├─> IF field has format validation (e.g., price must be number):
       │  ├─ IF format invalid:
       │  │  ├─ Show error icon, message, red border
       │  │  └─ Example: "Price must be a number"
       │  └─ IF format valid:
       │     ├─ Show success icon (green checkmark)
       │     ├─ Border turns green
       │     └─ No error message
       │
       └─> IF field is optional and valid:
           └─ No icon or special styling (neutral state)

4. User corrects invalid field
   └─> Type valid input (e.g., "2499" in price field)
   └─> On blur again:
       └─> Validation passes
       └─> Red error state clears
       └─> Green checkmark appears

5. User clicks Submit [Save Product] button
   └─> Validate entire form:
       ├─ Check all required fields have values
       ├─ Check all fields pass format validation
       ├─ IF any field invalid:
       │  ├─ Scroll to top of form
       │  ├─ Show error summary: "Please fix [X] errors below"
       │  ├─ Highlight all invalid fields with red borders
       │  ├─ Disable submit button (cannot retry without fixes)
       │  └─ Focus on first invalid field
       │
       └─> IF all valid:
           ├─ Disable [Save] button
           ├─ Change button text: "Saving..."
           ├─ Show loading spinner icon in button
           ├─ Show semi-transparent overlay on form (optional, prevent accidental re-focus)
           ├─ Submit form data to Firestore
           └─ Handle response (success/error)

6. Form Submission Success
   └─> Show success toast (top-right, green background):
       ├─ Icon: Checkmark (green)
       ├─ Message: "Product saved successfully!"
       └─ Auto-dismiss after 3 seconds or manual close
   └─> Disable overlay
   └─> Re-enable submit button (in case user wants to edit again)
   └─> Redirect to previous page after 1 second

```

**Search Input Pattern:**

```
1. User clicks search bar: "Search by product name..."
   └─> Border changes to blue
   └─> Clear button (X icon) appears on right side (if field not empty)
   └─> Cursor active in field

2. User types: "saree"
   └─> Input value updates in real-time
   └─> Clear button visible
   └─> Search triggers after 300ms debounce (not on every keystroke)
   └─> Results filter in real-time as user types
   └─> Result counter updates: "Showing [X] products for 'saree'"

3. User clicks clear button (X)
   └─> Input clears
   └─> Clear button disappears
   └─> Results reset to full list
   └─> Focus returns to search input

4. User presses Escape key while in search
   └─> Input clears
   └─> Results reset
   └─> Focus remains in search (or blur depending on UX preference)

```

**Category Filter Pattern:**

```
1. User hovers over category filter (Desktop)
   └─> Dropdown appears with fade-in (300ms animation)
   └─> Options become visible and interactive

2. User clicks category option: "Stitched"
   └─> Selected category is highlighted (checkmark or bold)
   └─> Dropdown fades out (200ms)
   └─> Product grid re-filters to show only Stitched products
   └─> Product count updates in header

3. User hovers away from dropdown without selecting (Desktop)
   └─> Dropdown fades out after 200ms delay

4. User clicks the same category again (toggle off)
   └─> Category de-selected
   └─> Returns to "All Products"
   └─> Filter resets

```

### 5.2 Loading States

**Product Grid Loading:**
```
1. Page initializes or filter changes
   └─> Show skeleton/shimmer placeholders for product cards
   └─> 4 placeholder cards shown (or based on grid width)
   └─> Skeleton animation: left-to-right shimmer effect
   └─> Duration: ~2-3 seconds (or until data loads)

2. Data loads from Firestore
   └─> Skeleton placeholders fade out
   └─> Actual product cards fade in
   └─> Smooth transition (200ms fade)

3. If loading takes > 3 seconds
   └─> Show message: "Loading products..." (below skeleton)
   └─> Offer [Retry] button if still loading after 5 seconds
```

**Button Loading State:**
```
1. User clicks [Save Product] button
   └─> Button becomes disabled (no longer clickable)
   └─> Button background darkens or shows disabled state
   └─> Button text changes: "[Original text]" → "Saving..."
   └─> Loading spinner appears inside button (left side of text)
   └─> Spinner rotates continuously

2. Request completes
   └─> Spinner disappears
   └─> Button text reverts to original: "Save Product"
   └─> Button re-enables (becomes clickable again)
   └─> Success/error toast appears separately
```

### 5.3 Modals & Dialogs

**Confirmation Modal Pattern:**

```
1. User triggers modal-requiring action (e.g., clicks [Delete])
   └─> Background dims with semi-transparent overlay (opacity 0.4-0.5)
   └─> Fade-in animation (200-300ms)
   └─> Modal appears, centered on screen

2. Modal Layout
   ├─ Header
   │  ├─ Title: "Delete Product?" (bold, large)
   │  └─ Close button (X icon, top-right)
   │
   ├─ Body
   │  └─ Message: "Are you sure? This action cannot be undone."
   │
   └─ Footer
      ├─ [Cancel] button (gray, secondary style)
      └─ [Delete] button (red, primary action style)

3. User clicks [Cancel] or X button
   └─> Modal fades out (200ms)
   └─> Background overlay removes
   └─> Focus returns to trigger element (e.g., delete button)
   └─> Page state unchanged

4. User clicks [Delete] button (destructive action)
   └─> Disable both buttons
   └─> Show loading spinner in [Delete] button: "Deleting..."
   └─> Execute action (delete request to Firestore)
   └─> ON SUCCESS:
       └─> Modal closes
       └─> Success toast appears: "Product deleted successfully!"
       └─> Page content updates (row removed from table)
   └─> ON ERROR:
       └─> Re-enable buttons
       └─> Error message appears in modal body: "Unable to delete. Please try again."
       └─> User can retry or close modal

5. User presses Escape key while modal open
   └─> Modal closes (same as [Cancel] button)
   └─> Focus returns to page

6. User clicks background/overlay
   └─> Modal closes (if clickable overlay enabled)

```

**Error Modal Pattern:**

```
1. Error occurs (e.g., product not found)
   └─> Background dims
   └─> Error modal appears, centered

2. Modal Layout
   ├─ Icon: Error icon (red circle with X)
   ├─ Title: "Error" or specific error title
   ├─ Message: Descriptive error text
   └─ Buttons:
      ├─ [OK] button (single button, closes modal)
      └─ [Retry] or [Go Back] (optional, context-dependent)

3. User clicks [OK] or [X]
   └─> Modal closes
   └─> User returns to previous context

```

### 5.4 Toast Notifications

**Toast Pattern:**

```
Position: Top-right corner of screen
Height: 60-80px
Width: 300-400px (responsive)
Background: Color-coded (green success, red error, blue info, yellow warning)
Border: Left border (4-5px) matching background color
Elevation: Raised shadow (Z-index high, above all content)

SUCCESS TOAST:
├─ Icon: Green checkmark circle
├─ Title: "Success!" (optional)
├─ Message: "Product saved successfully!"
├─ Auto-dismiss: 3-4 seconds (fade out)
├─ Close button (X): Immediate dismiss on click
└─ Animation: Slide-in from right (300ms), slide-out to right (300ms)

ERROR TOAST:
├─ Icon: Red X circle
├─ Title: "Error" (optional)
├─ Message: "[Specific error message]"
├─ Auto-dismiss: 5-6 seconds (longer than success)
├─ Close button (X): Manual dismiss available
└─ Animation: Slide-in from right, doesn't auto-dismiss if dismissed manually

INFO TOAST:
├─ Icon: Blue info circle (i)
├─ Message: "Your session has expired."
└─ Auto-dismiss: 4 seconds

WARNING TOAST:
├─ Icon: Yellow warning triangle
├─ Message: "[Warning message]"
└─ Auto-dismiss: 5 seconds

Multiple Toasts:
├─ Stack vertically if multiple appear
├─ Space between each: 10-15px
├─ Newest appears at top
└─ Old toasts push down (or push off-screen if space limited)
```

### 5.5 Hover Effects & Interactions

**Product Card Hover (Desktop):**
```
1. User hovers mouse over product card
   └─> Card scales up slightly (1.02 to 1.05 scale)
   └─> Shadow increases (from light to prominent)
   └─> Transition: 200ms, smooth (ease-in-out)
   └─> Card background may lighten slightly
   └─> Cursor changes to pointer

2. "Quick View" overlay may appear (optional)
   └─> Semi-transparent overlay appears on image
   └─> "View Details" button shows in center of image
   └─> Opacity of overlay: 0.7

3. User moves away from card
   └─> Effects reverse (scale down, shadow reduce)
   └─> Transition: 200ms, smooth
```

**Link / Button Hover (Desktop):**
```
1. User hovers over link or button
   └─> Color changes (usually darker or color shift)
   └─> Underline appears on links (if not already present)
   └─> Background changes on buttons (darker shade)
   └─> Cursor changes to pointer

2. User moves away
   └─> Colors and styles revert
   └─> Transition: 150ms, smooth
```

**Category Badge Hover:**
```
1. User hovers over category badge/pill
   └─> Background slightly darkens
   └─> Text color may invert (for contrast)
   └─> Cursor shows pointer icon
```

### 5.6 Image Gallery Interactions

**Desktop - Mouse Hover:**
```
1. User hovers over main product image
   └─> Zoom effect (slight, 1.1x scale)
   └─> Cursor changes to magnifying glass (optional)
   └─> Transition: smooth, 200ms

2. User hovers away
   └─> Image returns to normal scale
```

**Mobile - Swipe Gesture:**
```
1. User swipes left on main image
   └─> Image animates slide-out to left (200ms)
   └─> Next image slides in from right
   └─> Image counter updates: "[Current] / [Total]"

2. User swipes right on main image
   └─> Previous image slides in from left
   └─> Image counter updates

3. User taps on thumbnail
   └─> Main image changes to clicked thumbnail
   └─> Smooth transition (150ms fade or slide)
```

---

## 6. Error Handling & Edge Cases

### 6.1 Network Errors

**Offline / No Internet Connection:**
- **Trigger:** User loses internet connectivity while using app
- **Display:** Persistent banner at top of page:
  - Icon: WiFi off (gray)
  - Message: "You're offline. Some features may not be available."
  - Background: Gray / neutral color
  - Stays visible until connection restored
- **Behavior:**
  - Cached data (if available) displays
  - Disable buttons requiring network (gray out, show tooltip: "Requires internet connection")
  - Queue user actions for sync when online
  - Show sync indicator when connection restored
  - Automatically dismiss banner when online

**API Timeout (Request takes > 10 seconds):**
- **Trigger:** Firestore query or Firebase Storage upload hangs
- **Display:** Error message: "Request timed out. Please check your connection and try again."
- **Actions:** [Retry] button, or navigate away

### 6.2 Data Errors

**Product Not Found (404):**
- **Trigger:** Invalid product ID in URL
- **Display:**
  - Page title: "404 - Product Not Found"
  - Message: "The product you're looking for doesn't exist or has been removed."
  - Illustration or icon
  - Action buttons: [Back to Shop] [Home]
- **Status Code:** HTTP 404 in logs

**Category Not Found:**
- **Trigger:** Invalid category slug
- **Display:**
  - Message: "This category doesn't exist."
  - [View All Products] button
  - [Home] button
- **Status Code:** HTTP 404

**Missing Product Data:**
- **Trigger:** Product document in Firestore is missing required fields
- **Display:**
  - Available fields display normally
  - Missing fields are either omitted or show placeholder text
  - Page still functional
  - Example: Missing color options → color section not shown

### 6.3 Authentication Errors

**Invalid Login Credentials:**
- **Trigger:** User enters wrong email or password
- **Display:** Error message: "Invalid email or password. Please try again."
- **Behavior:**
  - Password field cleared for security
  - Email field kept for convenience
  - No indication which field was wrong
  - Message dismisses after 5 seconds or user closes

**Session Expired:**
- **Trigger:** Firebase auth token expires (usually after 1 hour)
- **Display:** Modal dialog:
  - Title: "Session Expired"
  - Message: "Your session has expired. Please log in again."
  - [Login] button
- **Behavior:** Redirect to /admin/login on click

**Too Many Login Attempts:**
- **Trigger:** 5+ failed logins within 5 minutes
- **Display:** Message: "Too many login attempts. Please try again in 15 minutes."
- **Behavior:**
  - [Login] button disabled
  - Countdown timer shown: "Try again in 14:30"
  - User can use "Forgot Password?" link to reset

### 6.4 File Upload Errors

**Unsupported File Format:**
- **Trigger:** User uploads .gif, .webp, .svg, or other non-JPG/PNG file
- **Display:** Error message: "[filename] is not supported. Please use JPG or PNG."
- **Behavior:** File not added to upload queue

**File Too Large:**
- **Trigger:** User uploads file > 5MB
- **Display:** Error message: "[filename] is too large. Max file size is 5MB."
- **Behavior:** File not added to upload queue

**Upload Fails Mid-Process:**
- **Trigger:** Firebase Storage returns error (network interruption, quota exceeded)
- **Display:** Image thumbnail shows error overlay:
  - Icon: Red warning triangle
  - Text: "Upload failed"
  - [Retry] button overlay on image
- **Behavior:**
  - User can click [Retry] to re-upload
  - Or delete thumbnail and re-upload
  - Other successful uploads remain

**Upload Quota Exceeded:**
- **Trigger:** Firebase Storage quota reached
- **Display:** Error modal:
  - Title: "Storage Limit Reached"
  - Message: "Cannot upload more files. Contact support if you need more storage."
  - [Contact Support] link
  - [Cancel] button

### 6.5 Server Errors

**500 Internal Server Error:**
- **Trigger:** Firestore or Firebase function returns error
- **Display:** Error toast (top-right, red):
  - Icon: X circle (red)
  - Title: "Something went wrong"
  - Message: "We've encountered an error. Please try again."
  - Error ID: [Unique ID for support reference]
  - Close button (X)
  - Auto-dismiss: 6 seconds
- **Behavior:**
  - Operation is aborted / rolled back
  - User can retry action
  - Error ID provided for support tickets
  - Logging system captures error with timestamp and user context

**Rate Limiting (API rate limit exceeded):**
- **Trigger:** Too many requests in short time period
- **Display:** Error message: "Too many requests. Please wait a moment and try again."
- **Behavior:**
  - Requests are queued
  - User sees temporary disable on buttons
  - Automatically retry after cooldown (30 seconds)

### 6.6 Validation Errors

**Required Field Missing:**
- **Trigger:** User submits form with empty required field
- **Display:**
  - Error summary at top: "Please fix [X] errors below"
  - Field highlighted with red border
  - Error message below field: "[Field name] is required"
- **Behavior:** Form submission prevented

**Invalid Format:**
- **Trigger:** User enters invalid data format (e.g., text in price field)
- **Display:**
  - Field shows error: "Please enter a valid [type]" (e.g., "Please enter a valid number")
  - Red border and error icon
- **Behavior:** Form submission prevented until corrected

**Duplicate Entry:**
- **Trigger:** User tries to add category with name that already exists
- **Display:** Error message: "A category with this name already exists."
- **Behavior:** Submit prevented, user must change name

---

## 7. Responsive Behavior

### 7.1 Breakpoints & Layout Changes

| Device | Width | Layout Changes |
|--------|-------|-----------------|
| Mobile | < 640px | Single column, bottom nav (if used), hamburger menu, stack all sections vertically |
| Tablet | 640px - 1024px | Two columns for some sections, sidebar may collapse to icons, navigation adjusts |
| Desktop | > 1024px | Full multi-column layout, sidebar expanded, hover interactions enabled, grid 3-4 cols |

### 7.2 Navigation Responsive Behavior

**Mobile (< 640px):**
```
Top bar layout:
┌─────────────────────────────────────┐
│ [≡]  [Musani Wear] (centered)      │
└─────────────────────────────────────┘

Hamburger Menu (when open):
├─ Shop
├─ New Arrivals
├─ Stitched
├─ Unstitched
└─ Luxe

[WhatsApp Icon] (floating, bottom-right corner)

Admin Sidebar (if in admin):
- Collapses to hamburger menu
- Same menu structure
- Logout option moved to sidebar
```

**Tablet (640px - 1024px):**
```
Top bar layout:
┌────────────────────────────────────────────────┐
│ [Musani Wear]  [Shop]  [Categories ▼]         │
│                                  [WhatsApp]   │
└────────────────────────────────────────────────┘

Admin Sidebar:
- Icons only (no labels) on left
- Labels appear on hover
- Can be toggled to full width
```

**Desktop (> 1024px):**
```
Top bar layout:
┌────────────────────────────────────────────────────────┐
│ [Musani Wear]  [Shop]  [Categories ▼]   [WhatsApp]   │
└────────────────────────────────────────────────────────┘

Admin Sidebar:
- Full width, expanded (with labels)
- Persistent on left side
- Smooth collapse/expand animation
- Can toggle to icon-only or collapse completely
```

### 7.3 Product Grid Responsive Behavior

**Mobile (< 640px):**
```
Product Grid: 2 columns
- Product card width: ~[viewport-width - 32px] / 2
- Gap between cards: 16px
- Card stack: image on top, text below
- Text truncates at 1-2 lines (ellipsis)

Search bar:
- Full width
- Touches margins
- Keyboard overlay may push content up
```

**Tablet (640px - 1024px):**
```
Product Grid: 3 columns
- Balanced layout with equal spacing
- Larger card text visibility
```

**Desktop (> 1024px):**
```
Product Grid: 4 columns
- Full grid layout utilization
- Larger card size allows more information display
- Sidebar takes ~15-20% of width, grid takes remaining ~80-85%
```

### 7.4 Form Responsive Behavior

**Mobile:**
```
Form fields: Full width
Label above field (stacked)
Input height: 44px (touch-friendly, for mobile)
Button: Full width, 48px height (thumb-friendly)
Spacing between fields: 20px
Character counters: Visible below field
Error messages: Shown below field in red, larger font for readability
```

**Tablet:**
```
Form fields: 1-2 columns depending on field type
Some fields may display side-by-side (e.g., first name + last name)
Spacing and sizes adjusted for ease of use
```

**Desktop:**
```
Form fields: 2-3 columns (where appropriate)
All spacing and typography optimized for larger screen
More whitespace around form sections
```

### 7.5 Image Gallery Responsive Behavior

**Mobile:**
```
Main image: Full width, aspect ratio 1:1 (square)
Image gallery takes up top 50% of screen
Thumbnail strip: Horizontal scroll, below main image
Thumbnails: 60x60px, scrollable
Swipe gestures enabled (left/right)
No zoom on hover (touch device)
```

**Tablet:**
```
Main image: 60-70% of gallery width
Thumbnails: Vertical strip on right side
Can click thumbnails to change main image
Zoom may be subtle or disabled
```

**Desktop:**
```
Main image: Large, centered
Thumbnail strip: Below main image, horizontal
Zoom on hover: Enabled (magnifying glass cursor)
Can scroll thumbnails or use arrow buttons
```

### 7.6 Admin Interface Responsive Behavior

**Mobile:**
```
Sidebar: Hidden by default, hamburger toggle in top-left
Table: Converts to card layout (stacked, one product per card)
Each card shows key info:
├─ Image (small thumbnail)
├─ Name
├─ Price
├─ Status
└─ Actions (Edit/Delete buttons stack vertically)

Stats cards: Stack vertically, full width
Form: Full width, fields stack vertically
```

**Tablet:**
```
Sidebar: Icon-only (can toggle to full)
Table: Compressed, may hide some columns (Price, Date)
Stats cards: 2 per row (stacked on smaller tablets)
Form: Single or double column depending on space
```

**Desktop:**
```
Sidebar: Full width, expanded with labels
Table: Full width with all columns visible
Stats cards: 4 in one row (or 2x2)
Form: 2-3 column layout
```

---

## 8. Accessibility & Progressive Enhancement

### 8.1 Keyboard Navigation

**Tab Order (Customer-Facing):**
1. Top navigation links
2. Hero banner CTA button
3. Search bar
4. Category filter buttons
5. Product cards (each product is focusable)
6. Footer links and buttons

**Focus Indicators:**
- All focusable elements show clear focus ring (blue outline, 2px)
- Focus ring has sufficient contrast
- Focus visible on keyboard navigation (not on mouse click)

**Admin Keyboard Navigation:**
1. Sidebar navigation links
2. Form fields (top to bottom)
3. Submit/Cancel buttons
4. Table rows (navigable with arrow keys)

### 8.2 ARIA Labels & Semantic HTML

**Product Card:**
```html
<article aria-label="Product: Maroon Silk Saree, Price: ₹2,499, In Stock">
  <h3>Maroon Silk Saree</h3>
  <p>Price: ₹2,499</p>
  <span aria-label="In Stock">In Stock</span>
  <a href="/product/prod_001" aria-label="View details for Maroon Silk Saree">
    View Details
  </a>
</article>
```

**WhatsApp Button:**
```html
<a href="https://wa.me/..."
   aria-label="Ask availability on WhatsApp for Maroon Silk Saree in Maroon color at ₹2,499">
  <i class="icon-whatsapp" aria-hidden="true"></i>
  Ask Availability on WhatsApp
</a>
```

### 8.3 Color Contrast

- All text meets WCAG AA contrast ratio (4.5:1 for normal text, 3:1 for large text)
- Error messages in red have sufficient contrast with background
- Availability badges (green "In Stock", red "Out of Stock") have white/black text for contrast

---

## 9. Performance Considerations

### 9.1 Image Optimization

**Product Images:**
- Compressed JPG/PNG before upload
- Multiple sizes cached (thumbnail: 100x100, card: 300x300, detail: 800x800)
- Lazy loading on product grids
- WebP format served on modern browsers (with JPG fallback)

**Product Thumbnails in Admin:**
- 40x40px previews (minimal data)
- Cached aggressively

### 9.2 Data Fetching Optimization

**Pagination:**
- Fetch 20 products per page (not all at once)
- Infinite scroll or traditional pagination
- Search: debounced 300ms before fetching

**Caching:**
- Categories cached in memory (rarely change)
- Product data cached for 5 minutes (or on manual refresh)
- Auth token cached in localStorage

### 9.3 Rendering Optimization

**Skeleton Loaders:**
- Used to show loading state (better UX than spinner)
- Reduces perceived load time

**Lazy Loading:**
- Product images load as user scrolls (not all on page load)
- Admin product list rows virtualized (only visible rows rendered)

---

## 10. Security Considerations

### 10.1 Authentication

**Admin Routes Protected:**
- All `/admin/*` routes check for valid Firebase auth token
- Invalid or expired tokens redirect to `/admin/login`
- Token stored in localStorage with httpOnly flag not set (can be set if using Firebase SDK properly)

**Firebase Rules:**
```
// Firestore Rules (example)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Products: Public read, authenticated admin write
    match /products/{product} {
      allow read: if true;
      allow write: if request.auth != null && isAdmin(request.auth.uid);
    }

    // Categories: Public read, authenticated admin write
    match /categories/{category} {
      allow read: if true;
      allow write: if request.auth != null && isAdmin(request.auth.uid);
    }

    // Admin list (for role checking)
    match /admins/{uid} {
      allow read: if request.auth.uid == uid;
    }
  }

  function isAdmin(uid) {
    return exists(/databases/$(database)/documents/admins/$(uid));
  }
}
```

### 10.2 Data Validation

**Client-Side:**
- Email format validation
- Price must be number > 0
- Required fields checked before submit
- File type and size validated before upload

**Server-Side (Firestore):**
- Firebase Rules enforce authentication on writes
- Document structure validated
- No direct data mutation allowed for customers

### 10.3 XSS Prevention

- All user input sanitized before display
- Angular's built-in sanitization for HTML content
- No `innerHTML` usage for user-generated content
- Content Security Policy (CSP) headers set

### 10.4 CSRF Protection

- Firebase handles CSRF protection via auth tokens
- State mutation requires valid auth token in request headers

---

## 11. Summary: Complete User Journey Maps

### 11.1 Customer Journey: Browse & Inquire

```
User Lands on /
    ↓
Views Hero Banner + Featured Products + Categories
    ↓
Click "Shop Now" or Category Card
    ↓
Navigate to /shop or /category/:slug
    ↓
Browse Product Grid (filter by category, search)
    ↓
Click Product Card
    ↓
Navigate to /product/:id
    ↓
View Full Details (images, colors, description)
    ↓
Select Color Swatch
    ↓
Click "Ask Availability on WhatsApp"
    ↓
WhatsApp Opens with Prefilled Message
    ↓
Send Inquiry
    ↓
Business Owner Replies
    ↓
Conversation Continues via WhatsApp
```

### 11.2 Admin Journey: Manage Products

```
Admin Lands on /admin/login
    ↓
Enter Email & Password
    ↓
Firebase Auth Verification
    ↓
Redirect to /admin Dashboard
    ↓
View Stats Cards (Total, In Stock, Out of Stock)
    ↓
Click "Products" Link
    ↓
Navigate to /admin/products
    ↓
Search / Filter Products
    ↓
Click [Add New] or [Edit]
    ↓
Navigate to /admin/products/new or /admin/products/:id/edit
    ↓
Fill Product Form (name, description, price, category, colors, images)
    ↓
Upload Images to Firebase Storage
    ↓
Click [Save Product]
    ↓
Form Validation → Firestore Save → Success Toast
    ↓
Redirect to Products List
    ↓
Product appears on Customer-Facing Site
```

### 11.3 Admin Journey: Manage Availability

```
Admin Logs In
    ↓
Navigate to /admin/products
    ↓
Find Product
    ↓
Click [Edit] or Toggle Availability
    ↓
Change "In Stock" ↔ "Out of Stock"
    ↓
Click [Save]
    ↓
Firestore Updates
    ↓
Badge Updates on Customer Site
```

---

## 12. Appendix: Technical Specifications

### 12.1 WhatsApp Integration

**Message Format:**
```
Hi! I'm interested in [Product Name] (Color: [Selected Color], Price: ₹[Price]). Could you please confirm availability?
```

**WhatsApp Link Structure:**
```
https://wa.me/[BUSINESS_PHONE_NUMBER]?text=[URL_ENCODED_MESSAGE]

Example:
https://wa.me/919876543210?text=Hi%21%20I%27m%20interested%20in%20Maroon%20Silk%20Saree%20(Color%3A%20Maroon%2C%20Price%3A%20%E2%82%B92%2C499).%20Could%20you%20please%20confirm%20availability%3F
```

**Business Number Format:**
- Country code + number (no special characters)
- Example: 919876543210 (India)

### 12.2 Firebase Services Used

**Authentication (firebase.auth):**
- Email/password authentication
- Session management
- Token refresh on expire

**Firestore (firebase.firestore):**
- `products` collection (documents: product data)
- `categories` collection (documents: category names)
- `admins` collection (documents: admin UIDs for role checking)

**Firebase Storage (firebase.storage):**
- `/products/{productId}/*.jpg` (product images)
- Organized by product ID for easier management

**Firebase Hosting (optional):**
- Deploy Angular app
- Global CDN delivery
- SSL/TLS certificates

### 12.3 Data Models

**Product Document:**
```json
{
  "id": "prod_001",
  "name": "Maroon Silk Saree",
  "description": "Beautiful traditional silk saree with elegant design...",
  "price": 2499,
  "material": "Cotton Blend",
  "category": "stitched",
  "colors": [
    { "name": "Maroon", "hex": "#8B0000" },
    { "name": "Navy", "hex": "#000080" }
  ],
  "images": [
    "gs://bucket/products/prod_001/image1.jpg",
    "gs://bucket/products/prod_001/image2.jpg"
  ],
  "inStock": true,
  "createdAt": 1709865600000,
  "updatedAt": 1709865600000
}
```

**Category Document:**
```json
{
  "id": "cat_stitched",
  "name": "Stitched",
  "slug": "stitched",
  "description": "Pre-made, ready-to-wear stitched dresses"
}
```

**Admin Document:**
```json
{
  "uid": "firebase_uid_string",
  "email": "admin@musaniware.com",
  "role": "admin",
  "createdAt": 1709865600000
}
```

---

## 13. Appendix: Error Code Reference

| Error | Code | Message | Action |
|-------|------|---------|--------|
| Product Not Found | 404 | "The product you're looking for doesn't exist." | Show 404 page, offer navigation |
| Category Not Found | 404 | "This category doesn't exist." | Show 404, navigate to Shop |
| Unauthorized Access | 401 | "You are not authorized to access this page." | Redirect to /admin/login |
| Invalid Credentials | 401 | "Invalid email or password." | Clear password, retry |
| Session Expired | 401 | "Your session has expired. Please log in again." | Show modal, redirect to login |
| Network Error | NETWORK | "Unable to load products. Please try again." | Show retry button |
| Timeout | TIMEOUT | "Request timed out. Please try again." | Show retry button |
| Upload Failed | UPLOAD_ERROR | "[Filename] failed to upload." | Show retry button |
| File Too Large | FILE_SIZE | "[Filename] exceeds 5MB limit." | Remove file, select smaller one |
| Unsupported Format | FILE_TYPE | "[Filename] format not supported." | Select JPG or PNG |
| Duplicate Category | DUPLICATE | "This category already exists." | Change name, retry |
| Cannot Delete | CONSTRAINT | "Cannot delete category with products." | Move products first |
| Rate Limit | RATE_LIMIT | "Too many requests. Please wait." | Retry after cooldown |
| Server Error | 500 | "Something went wrong. Please try again." | Show error ID, retry |

---

**END OF APP_FLOW.md**

---

## Generation Summary

This comprehensive APP_FLOW.md document includes:

✅ **Entry Points** (Direct URLs, deep links, session/auth flows)
✅ **Navigation Structure** (Full sitemap, ASCII diagrams, responsive nav)
✅ **Complete User Flows** (Customer browse/inquire, Admin login, add/edit products, manage categories)
✅ **Decision Logic** (IF-THEN statements for every user action and system response)
✅ **Screen Inventory** (All 11 screens documented with routes, access levels, components)
✅ **Interaction Patterns** (Forms, loading states, modals, toasts, hover effects, gestures)
✅ **Error Handling** (404s, auth errors, validation errors, file upload failures, network errors)
✅ **Responsive Behavior** (Mobile/tablet/desktop breakpoints, layout changes, touch interactions)
✅ **Accessibility** (Keyboard navigation, ARIA labels, color contrast)
✅ **Security Considerations** (Authentication, Firestore rules, XSS prevention)
✅ **Data Models** (JSON structure for products, categories, admins)
✅ **WhatsApp Integration** (Message format, URL structure, pre-fill logic)

The document provides exact error messages, loading states, button behaviors, and transition logic so developers and AI can implement every feature with complete clarity.

