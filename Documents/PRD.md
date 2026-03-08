# Product Requirements Document (PRD)
## Musani Wear — Discover & Order Dresses via WhatsApp

**Project Name:** Musani Wear
**Version:** 0.1.0
**Last Updated:** March 8, 2026
**Status:** Draft

---

## 1. Product Overview

### 1.1 Project Summary

Musani Wear is a mobile-first web application designed to help a small dress boutique business in Mangalore, India establish an elegant online presence and streamline customer engagement. The application serves as a product showcase and direct-to-customer ordering platform that integrates seamlessly with WhatsApp, eliminating the need for a traditional payment gateway or complex checkout process.

The business problem is clear: boutique owners lack an affordable, easy-to-manage online catalog system that doesn't require technical expertise. Customers currently communicate via personal WhatsApp messages or phone calls, creating friction and lost sales opportunities. Musani Wear solves this by providing a beautiful, mobile-optimized catalog that automatically generates WhatsApp inquiries pre-filled with product details.

The core value proposition: boutique customers can browse products on their mobile phones, see high-quality images and detailed information, and seamlessly transition to WhatsApp conversations with the business owner to confirm availability and place orders—all without needing a separate payment app or creating an account.

### 1.2 Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1.0 | March 8, 2026 | Product Team | Initial draft - MVP scope definition |

---

## 2. Problem Statement

### 2.1 User Problem

**For Boutique Customers:**
Customers interested in purchasing dresses from Musani Wear currently face multiple friction points:
- **Discovery:** No centralized online catalog; customers must rely on Instagram photos, WhatsApp status updates, or in-person visits to see available styles
- **Information gaps:** When browsing via social media, customers can't easily compare prices, see all color options, or verify if products are in stock
- **Ordering friction:** Interested customers must manually type product details into WhatsApp messages, increasing likelihood of miscommunication about color, size, or specifications
- **Mobile limitations:** The target demographic (women in Mangalore/Karnataka, ages 18-50) primarily browses on mobile phones; current channels don't provide optimized mobile experiences

**For Boutique Owner/Admin:**
The business owner currently lacks an efficient way to manage inventory and customer inquiries:
- **Manual catalog management:** Products are scattered across Instagram, WhatsApp groups, and personal notes; no centralized system
- **No availability tracking:** Out-of-stock products remain posted, leading to disappointed customers who inquire about unavailable items
- **Repetitive inquiries:** Answering the same questions about fabric, color availability, and pricing repeatedly consumes time
- **No analytics:** No visibility into what products get attention, which customers are window-shopping vs. seriously interested, or inventory performance

### 2.2 Current Solutions & Gaps

**Current approaches (all inadequate):**
1. **Instagram/Social Media + WhatsApp:** Reaches audience but creates discovery friction; no inventory management; WhatsApp is unstructured and difficult to scale
2. **Basic WhatsApp Business:** Enables messaging but no product catalog integration; customers must manually search for product photos in chat history
3. **Generic e-commerce platforms (Shopify, WooCommerce):** Overkill for a small boutique; costly ($30-100/month), complex setup, unnecessary payment gateway integration, high friction for admin management

**Why existing solutions don't work:**
- Too expensive for a bootstrapped boutique business (target budget: minimal overhead)
- Too complex for non-technical boutique owners to update products independently
- Force unnecessary payment processing when customers prefer WhatsApp discussions for orders
- Don't optimize for the primary user behavior: mobile browsing + WhatsApp communication

### 2.3 Opportunity

**Market timing & strategic importance:**
- Small boutiques in tier-2 Indian cities (like Mangalore) are increasingly going digital but need affordable, simple tools
- WhatsApp has 98%+ adoption among target customers in India; leveraging it reduces friction rather than adding new platforms
- COVID-19 normalized online shopping even for niche boutiques; customers now expect online discovery
- The boutique is actively losing sales from customers who don't discover the catalog online
- First-mover advantage: competitors in Mangalore use only Instagram; a dedicated boutique website + WhatsApp integration is differentiated

**Revenue impact:**
- Estimated 20-30% sales lift from customers who browse online and message via WhatsApp (vs. current 0% digital sales)
- Reduced time spent on inventory questions = owner can focus on product creation and customer service

---

## 3. Goals & Success Metrics

### 3.1 Business Goals

1. **Enable efficient product discovery:** Customers can browse the complete product catalog (50-100 dresses) in organized categories, reducing barriers to purchase
2. **Reduce admin overhead:** Boutique owner can add, edit, and update product information in under 2 minutes per product, enabling weekly catalog updates without operational burden
3. **Drive WhatsApp engagement:** Pre-populate WhatsApp messages with product details, increasing conversion from browsing to inquiry from current baseline to 25%+ inquiry rate
4. **Establish digital-first brand presence:** Provide a professional, elegant online storefront that reinforces boutique's luxury positioning and becomes the primary customer discovery point within 6 months

### 3.2 User Goals

**Customer goals:**
- Browse and discover dress styles without visiting in-person or endlessly scrolling Instagram
- Quickly confirm color availability and pricing before messaging
- Seamlessly transition to WhatsApp messaging to ask follow-up questions about fit, customization, or bulk orders

**Admin goals:**
- Manage product catalog independently without developer intervention
- Stay on top of inventory status and availability
- Understand which products are generating customer interest

### 3.3 Success Metrics

| Metric | Target | Measurement Method | Timeline |
|--------|--------|-------------------|----------|
| **Product browsing engagement** | 70% of site visitors view 3+ products | Google Analytics (pages per session) | 30 days post-launch |
| **WhatsApp inquiry conversion rate** | 25% of product views trigger "Ask Availability" button clicks | Click tracking on button via analytics | 30 days post-launch |
| **Admin product update time** | Under 2 minutes per product edit/add | Time-tracking during admin training | Ongoing from launch |
| **Mobile usability** | 95%+ of traffic on mobile phones | Google Analytics device breakdown | Ongoing from launch |
| **Site performance (Lighthouse)** | 85+ performance score | Lighthouse CI on production | Ongoing from launch |
| **Catalog completeness** | 100% of products (50-100 dresses) uploaded and visible | Manual audit of product count | Pre-launch validation |
| **Customer repeat browsing** | 40% of visitors return within 7 days | Google Analytics return visitor % | 60 days post-launch |
| **Page load time (mobile 3G)** | Under 3 seconds | PageSpeed Insights, WebPageTest | Ongoing from launch |
| **Admin dashboard usability** | 0 support requests from admin within first 2 weeks | Support ticket tracking | Post-launch |
| **Site uptime** | 99.5% availability | Firebase Hosting uptime monitoring | Ongoing from launch |

---

## 4. Target Users & Personas

### 4.1 Primary Persona: Priya - The Instagram-Savvy Dress Buyer

- **Demographics:** 28 years old, Bangalore/Mangalore, employed in IT/finance sector, monthly income 60,000-150,000 INR, college-educated, fluent in English + Kannada/Tamil
- **Technographics:** Daily smartphone user (iPhone or Android), comfortable with e-commerce apps, uses Instagram, WhatsApp, and Swiggy; doesn't use traditional websites much
- **Goals:**
  - Find elegant, unique dresses for office, casual, and party wear without visiting physical stores
  - Discover local boutique designers to support small businesses
  - Get accurate pricing and color options before committing to a purchase
- **Pain Points:**
  - Spends 20-30 minutes scrolling Instagram to find one dress that interests her
  - Lost track of products from boutiques weeks ago; can't find them again
  - Has to message the boutique owner to ask basic questions: "What colors do you have in this style?" "What's the price?"
  - Frustrated when boutiques say items are out of stock after she asks
  - Prefer to discuss customization options (fabric, length, sleeve style) via messaging, not instant checkout
- **Behaviors:**
  - Browses Instagram/Pinterest during lunch breaks and evenings on mobile
  - Makes purchase decisions over 2-3 days (not impulse purchases)
  - Appreciates WhatsApp for direct communication with sellers
  - Asks friends for boutique recommendations before discovering independently
  - Uses Google Maps to find local boutiques
- **Quote:** *"I love supporting local designers, but it's so frustrating when I see a beautiful dress on their Instagram but can't easily check if it's available in my size or color. I end up not messaging because I'd have to search through old posts."*

### 4.2 Secondary Persona: Deepa - The Boutique Owner

- **Demographics:** 42 years old, Mangalore, business owner for 8 years, moderate technical comfort, fluent in Kannada + English
- **Technographics:** Uses smartphone for business (WhatsApp Business), basic knowledge of Instagram, never used Shopify/WooCommerce, intimidated by "complicated tech"
- **Goals:**
  - Showcase products to new customers without opening a physical storefront branch
  - Reduce time spent answering repetitive questions (sizes, colors, pricing)
  - Track which products customers ask about most to guide future designs
  - Maintain boutique's luxury image online
- **Pain Points:**
  - Spends 3-4 hours daily managing WhatsApp inquiries and Instagram DMs
  - Frequently tells customers "we're out of stock" after they've already asked, wasting both people's time
  - Has 120+ dresses in inventory but no organized system to track what's available
  - Lost potential sales because customers can't easily browse; many friends ask "Where did you see that dress?" and never follow up
  - Can't update product info herself; depends on someone else to post to Instagram or WhatsApp
  - Concerned about security: handles payment discussions over unsecured WhatsApp
- **Behaviors:**
  - Wakes up early to respond to customer messages before opening the boutique
  - Manually tracks inventory in a notebook and WhatsApp groups
  - Relies on in-person consultations and tried-and-true customer relationships
  - Gets excited about boutique analytics but doesn't know where to start
- **Quote:** *"I love my business and my customers, but I'm drowning in messages. Every day it's the same questions: 'Do you have this in blue?' 'What's the price?' I need a simple way to show my products online so people can see everything, and I have time to actually design dresses instead of answering the same questions 50 times a day."*

### 4.3 Tertiary Persona: Aditya - The Sales Associate

- **Demographics:** 24 years old, works part-time at Deepa's boutique, college student, tech-savvy
- **Role:** Helps customers in-store, manages Instagram, occasionally manages WhatsApp during Deepa's busy hours
- **Goals:** Help customers find products quickly, reduce owner's messaging burden
- **Pain Points:** Gets frustrated when he can't find a specific product in inventory when customer asks; wastes time searching WhatsApp conversation history
- **Behaviors:** Familiar with apps and social media; can help admin onboarding if needed
- **Quote:** *"When customers come in asking about products from Instagram, I have to dig through photos or check physical inventory. A simple catalog would help so much."*

---

## 5. Features & Requirements

### 5.1 Priority 0 (P0) - Must Have

These features are critical for MVP launch. Without them, the product doesn't provide core value.

#### Feature: Product Browse & Grid Display

- **Description:** Customers can view all products in an organized grid layout with product cards showing primary image, name, price, and availability status. The grid should be responsive and optimized for mobile phones (1-2 columns on mobile, 3-4 on desktop). No pagination; use infinite scroll or lazy loading.

- **User Story:** As a customer browsing on mobile, I want to see all available dresses in a clean grid layout so that I can quickly browse products without scrolling through infinite text lists or complicated navigation.

- **Acceptance Criteria:**
  - [ ] Product grid displays in 1 column on mobile (< 640px), 2 columns on tablet (640px-1024px), 3-4 columns on desktop (>1024px)
  - [ ] Each product card shows: primary product image (cover image at 300x400px minimum), product name (max 50 characters visible), price in INR (₹ symbol prefix), and availability badge ("In Stock" or "Out of Stock")
  - [ ] Availability badge is green background with white text for "In Stock", gray background for "Out of Stock"
  - [ ] Product cards are clickable; clicking navigates to product detail page
  - [ ] Images load with 1.5-2 second delay on 3G connections (tested via WebPageTest or Chrome DevTools 3G throttle); no broken image placeholders visible
  - [ ] Grid loads first 20 products instantly; subsequent products load via infinite scroll as user approaches bottom of page
  - [ ] "No products found" message appears if zero products exist in a category
  - [ ] Mobile users can scroll horizontally if accidentally zoomed

- **Dependencies:**
  - Firestore database with products collection populated
  - Firebase Storage with product images uploaded
  - Category system must exist (P0 Feature: Manage Categories)

---

#### Feature: Category Filter / Browse by Category

- **Description:** Products can be organized and browsed by category. Default categories are: New Arrivals, Stitched, Unstitched, Luxe. Customers can filter the grid to show products from a specific category. Filter UI is sticky header or sidebar button on mobile.

- **User Story:** As a customer who knows I want an "unstitched" dress, I want to quickly filter products by category so that I don't have to scroll through irrelevant stitched options.

- **Acceptance Criteria:**
  - [ ] Category filter is accessible on main shop page in a sticky header (mobile) or sidebar (desktop)
  - [ ] Default categories exist: "New Arrivals", "Stitched", "Unstitched", "Luxe"
  - [ ] Clicking a category filters the grid to show only products in that category
  - [ ] "All Products" option shows all categories at once
  - [ ] Active category is visually highlighted (underline, background color, or bold text)
  - [ ] Category filter persists when user navigates to product detail and back
  - [ ] Clicking category on mobile scrolls the grid to top and updates results within 500ms
  - [ ] URL updates to include category parameter (e.g., `/shop?category=unstitched`) for shareable links
  - [ ] Category list shows product count next to each category name (e.g., "Stitched (15)")

- **Dependencies:**
  - Product Browse feature (above)
  - Category management system (P0 Feature: Manage Categories)
  - Products must have category field populated in Firestore

---

#### Feature: Product Detail Page

- **Description:** Detailed view of a single product showing: multiple product images in a gallery with zoom capability, product name, description (max 500 characters), price (INR), color options with swatches, fabric/material, in-stock/out-of-stock badge, and "Ask Availability" button.

- **User Story:** As a customer interested in a specific dress, I want to see high-quality images, color options, and product details so that I can decide if it matches what I'm looking for before messaging the owner.

- **Acceptance Criteria:**
  - [ ] Product page loads with primary image displayed prominently (80% of viewport width on mobile, centered)
  - [ ] Product details visible: name, price (₹ symbol), description, fabric/material (e.g., "Georgette", "Silk"), availability status
  - [ ] Image gallery shows up to 10 images; user can swipe (mobile) or click arrows (desktop) to navigate
  - [ ] Image zoom feature: on desktop, clicking image opens lightbox with full-resolution zoom; on mobile, pinch-to-zoom works on images
  - [ ] Color swatches display as clickable circles with color preview (e.g., red swatch, blue swatch). Clicking swatch shows "Selected: [Color Name]" text below swatches
  - [ ] At least 1 color option must be set per product; up to 10 color options supported
  - [ ] Availability badge clearly shows "In Stock" (green) or "Out of Stock" (gray) at top of page
  - [ ] "Ask Availability" button is prominent (primary color, 48px height minimum for touch targets), positioned below product details
  - [ ] Product name is H1 heading; description uses semantic HTML (p tags)
  - [ ] Pressing back button or clicking back arrow navigates back to shop grid at previous category/scroll position (if browser history available)
  - [ ] Breadcrumb navigation shows: Home > Shop > [Category Name] > [Product Name]
  - [ ] Page title (browser tab) shows product name (e.g., "Elegant Blue Anarkali | Musani Wear")

- **Dependencies:**
  - Product Browse feature (grid)
  - Firestore product schema with images, colors, material fields
  - Firebase Storage for image hosting
  - Ask Availability feature (below)

---

#### Feature: Ask Availability Button (WhatsApp Integration)

- **Description:** Button on product detail page that pre-fills a WhatsApp message with product details (name, selected color, price) and opens WhatsApp chat with business owner. WhatsApp number is configured by admin in dashboard.

- **User Story:** As a customer interested in a dress, I want to click one button and automatically message the owner with product details so that I don't have to type the details manually and risk miscommunication.

- **Acceptance Criteria:**
  - [ ] "Ask Availability" button is visible on product detail page (and also on product card hover on desktop)
  - [ ] Clicking button opens WhatsApp with pre-filled message: "Hi! I'm interested in [Product Name] (Color: [Selected Color], Price: ₹[Price]). Could you please confirm availability?"
  - [ ] Example output: "Hi! I'm interested in Elegant Blue Anarkali (Color: Blue, Price: ₹2,499). Could you please confirm availability?"
  - [ ] WhatsApp number is dynamically retrieved from admin settings (stored in Firestore config collection)
  - [ ] If WhatsApp number is not configured, button shows error message: "Contact information not set up yet. Please try again later."
  - [ ] On mobile, clicking button opens WhatsApp app (if installed) via `https://wa.me/[PHONENUMBER]?text=[MESSAGE]` deep link
  - [ ] On desktop, clicking button opens WhatsApp Web via same deep link (if user authenticated)
  - [ ] If color is not selected before clicking button, message includes: "Color: Not specified"
  - [ ] Button text is clear: "Ask Availability" or "Message on WhatsApp"
  - [ ] No payment, no address input, no account creation required

- **Dependencies:**
  - Product Detail page feature
  - Admin WhatsApp number configuration (P0 Feature: Admin Settings)
  - Firebase Firestore config collection with admin_phone field

---

#### Feature: Admin Login (Firebase Authentication)

- **Description:** Secure admin login page using Firebase Email + Password authentication. Only authenticated admins can access product management features.

- **User Story:** As the boutique owner, I want to log in with my email and password so that only I can manage the product catalog and settings.

- **Acceptance Criteria:**
  - [ ] Login page displays email input and password input with labels
  - [ ] Email validation: accepted format is standard email (example@domain.com); error if invalid: "Please enter a valid email address"
  - [ ] Password field masks characters (dots or asterisks); show/hide toggle available
  - [ ] "Forgot Password" link is visible; clicking navigates to password reset flow
  - [ ] Password reset flow: user enters email, receives Firebase reset link via email, can reset password via email link
  - [ ] Login button is disabled until both email and password are filled; loading spinner appears during auth request
  - [ ] On successful login: Firebase Auth token is stored, user redirected to `/admin/dashboard`
  - [ ] On failed login: error message appears below form: "Email or password is incorrect. Please try again."
  - [ ] On failed login: incorrect password is logged for security monitoring (no password stored)
  - [ ] Login state persists across page refreshes (Firebase session management)
  - [ ] Logout option is available in admin dashboard
  - [ ] Unauthenticated users trying to access `/admin/*` pages are redirected to login page
  - [ ] Page title is "Admin Login | Musani Wear"

- **Dependencies:**
  - Firebase project initialized
  - Firebase Authentication enabled with Email/Password provider
  - Admin user email configured in Firebase Auth

---

#### Feature: Admin Dashboard Overview

- **Description:** Admin home page showing quick stats: total products, in-stock vs. out-of-stock count, recent activity or quick links to manage products, categories, and settings.

- **User Story:** As a boutique owner logging in, I want to see a quick overview of my inventory so that I know my product status at a glance before making updates.

- **Acceptance Criteria:**
  - [ ] Dashboard displays 3-4 key metrics:
    - "Total Products": shows count of all products (e.g., "45 products")
    - "In Stock": shows count of in-stock products (e.g., "38 in stock")
    - "Out of Stock": shows count of out-of-stock products (e.g., "7 out of stock")
    - "Last Updated": shows timestamp of most recent product edit (e.g., "Last updated: Today at 2:30 PM")
  - [ ] Metrics are displayed as cards with large, readable numbers (18px+ font size)
  - [ ] Dashboard shows quick action buttons: "Add New Product", "View All Products", "Manage Categories", "Settings"
  - [ ] Each button navigates to respective page
  - [ ] Recent activity log shows last 5 product edits with: product name, action (added/edited), timestamp
  - [ ] Page is fully responsive and loads within 1 second
  - [ ] Dashboard is the default page after admin login

- **Dependencies:**
  - Admin authentication (Login feature)
  - Firestore products collection
  - Product edit tracking (timestamps in Firestore)

---

#### Feature: Admin Add Product

- **Description:** Form to add a new product with fields: name, description, price (INR), color options (with color swatches), fabric/material, category, multiple image upload, and initial availability status.

- **User Story:** As a boutique owner, I want to add a new product to my catalog with all details in one form so that my dress designs are immediately discoverable by customers.

- **Acceptance Criteria:**
  - [ ] Form displays these fields:
    - "Product Name" (text input, max 50 characters) - required
    - "Description" (textarea, max 500 characters) - optional
    - "Price" (number input in INR, no decimals) - required, must be > 0
    - "Fabric/Material" (text input, max 100 characters) - optional (examples: "Georgette", "Silk", "Cotton")
    - "Category" (dropdown: New Arrivals, Stitched, Unstitched, Luxe) - required
    - "Availability" (toggle: In Stock / Out of Stock) - defaults to "In Stock"
    - "Images" (file upload, multiple images, max 10) - at least 1 image required
    - "Color Options" (add/remove color options with color picker) - at least 1 color required, max 10
  - [ ] Each color option requires: color name (e.g., "Blue", "Maroon") and hex color code or color picker input
  - [ ] Image upload accepts JPG, PNG, WebP; shows preview thumbnail for each uploaded image
  - [ ] First uploaded image is set as primary/cover image automatically
  - [ ] Images are resized to max 1200x1500px by Firebase Storage; original aspect ratio preserved
  - [ ] Form validation on submit: error messages appear inline below each field if required field is empty
  - [ ] On successful submit: product created in Firestore, images uploaded to Firebase Storage, user sees success message: "Product '[Product Name]' added successfully" and is redirected to product detail page or product list
  - [ ] Form has "Save" button (primary color) and "Cancel" button; "Cancel" navigates back to dashboard
  - [ ] Image upload shows progress bar during upload; disabled until complete
  - [ ] Form remembers input if user navigates back (via localStorage or state management) for 5 minutes
  - [ ] Character counters visible for name (50 max) and description (500 max)

- **Dependencies:**
  - Admin authentication
  - Firestore products collection schema
  - Firebase Storage for image hosting
  - Category system

---

#### Feature: Admin Edit Product

- **Description:** Form to edit an existing product with all the same fields as "Add Product" plus ability to reorder/delete existing images, add new images, update colors, and change availability status.

- **User Story:** As a boutique owner, I want to update a product's details, images, or availability status without re-entering everything so that I can quickly mark items as out-of-stock or refresh product info.

- **Acceptance Criteria:**
  - [ ] Form loads pre-filled with current product data
  - [ ] All fields from "Add Product" are editable and pre-populated
  - [ ] Existing images display as thumbnails with drag-to-reorder functionality
  - [ ] Each image has delete (X) button; deleting removes from product and Firebase Storage
  - [ ] "Add more images" button allows uploading additional images (up to 10 total)
  - [ ] Color options are editable and deletable; can add new colors using color picker
  - [ ] Availability toggle is immediately changeable: "In Stock" ↔ "Out of Stock"
  - [ ] Form shows "Last modified: [date/time]" at bottom
  - [ ] On successful submit: product updated in Firestore, success message shown: "Product '[Product Name]' updated successfully"
  - [ ] "Save" and "Cancel" buttons are available
  - [ ] Delete product option is available: clicking "Delete" shows confirmation modal: "Are you sure you want to delete '[Product Name]'? This cannot be undone." with "Delete" and "Cancel" buttons
  - [ ] After deletion: product removed from Firestore, images removed from Firebase Storage, user redirected to products list with message: "Product deleted successfully"

- **Dependencies:**
  - Admin authentication
  - Firestore products collection
  - Firebase Storage management
  - Category system

---

#### Feature: Admin Delete Product

- **Description:** Ability to delete a product from the catalog. Includes confirmation dialog to prevent accidental deletion.

- **User Story:** As a boutique owner, I want to remove a product from my catalog when I stop making that style so that it doesn't confuse customers.

- **Acceptance Criteria:**
  - [ ] Delete button available on "Edit Product" page
  - [ ] Clicking delete shows modal confirmation: "Are you sure you want to delete '[Product Name]'? This action cannot be undone."
  - [ ] Modal has "Delete" (red, destructive action) and "Cancel" (gray) buttons
  - [ ] Pressing Escape key closes modal without deleting
  - [ ] On confirmation: product deleted from Firestore, all images deleted from Firebase Storage, user sees toast notification: "Product deleted successfully"
  - [ ] User is redirected to products list after deletion
  - [ ] Deleted product is immediately removed from customer-facing grid

- **Dependencies:**
  - Admin Edit Product feature
  - Firestore document deletion capability
  - Firebase Storage cleanup

---

#### Feature: Admin Manage Categories

- **Description:** Admin can view, create, edit, and delete product categories. Default categories (New Arrivals, Stitched, Unstitched, Luxe) are provided but can be customized.

- **User Story:** As a boutique owner, I want to organize my products into categories so that customers can easily find what they're looking for.

- **Acceptance Criteria:**
  - [ ] Category management page lists all existing categories in a table/list with columns: category name, product count, actions (edit, delete)
  - [ ] Default categories are provided: "New Arrivals", "Stitched", "Unstitched", "Luxe"
  - [ ] "Add Category" button opens modal with form: category name (text input, max 50 characters) - required
  - [ ] Creating category stores in Firestore: id, name, created_at timestamp
  - [ ] Edit category modal allows changing category name
  - [ ] Delete category button shows confirmation: "Delete category '[Category Name]'? Products in this category will need to be reassigned." (or auto-assign to 'Other' category)
  - [ ] Product count next to each category shows how many products are in that category
  - [ ] Category list is sortable by name or product count
  - [ ] Success messages appear after create/edit/delete: "Category '[Name]' created successfully"
  - [ ] Changes immediately reflect in product add/edit forms (category dropdown updates)

- **Dependencies:**
  - Admin authentication
  - Firestore categories collection
  - Firestore products collection (to count products per category)

---

#### Feature: Admin Settings / Configuration

- **Description:** Admin page to configure business settings, including: WhatsApp number for customer inquiries, business name, business description, and business contact info.

- **User Story:** As a boutique owner, I want to configure my business contact details in one place so that customers can reach me via WhatsApp and the "Ask Availability" button works correctly.

- **Acceptance Criteria:**
  - [ ] Settings page displays form with these fields:
    - "WhatsApp Number" (text input with +91 country code, 10-digit Indian number expected) - required
    - "Business Name" (text input, max 100 characters) - pre-filled with "Musani Wear" or current value
    - "Business Description" (textarea, max 500 characters) - optional
    - "Contact Email" (email input) - optional
  - [ ] WhatsApp number validation: must match pattern +91XXXXXXXXXX (10 digits after +91)
  - [ ] Error if invalid: "Please enter a valid WhatsApp number in format +91XXXXXXXXXX"
  - [ ] Settings stored in Firestore config collection: admin can update anytime
  - [ ] On successful save: success message "Settings updated successfully"
  - [ ] Settings are immediately reflected in "Ask Availability" button and customer-facing pages
  - [ ] Settings page is only accessible to authenticated admin

- **Dependencies:**
  - Admin authentication
  - Firestore config collection with admin settings

---

#### Feature: Admin Products List

- **Description:** List/table view of all products with name, price, category, availability status, and action buttons (edit, delete, view).

- **User Story:** As a boutique owner, I want to see all my products in one list so that I can quickly find and edit a product or check its status.

- **Acceptance Criteria:**
  - [ ] Products displayed in a responsive table (desktop) or card list (mobile) with columns: Product Name, Price (₹), Category, Availability Status, Actions
  - [ ] Table shows up to 20 products per page with pagination
  - [ ] Search bar at top filters products by name in real-time (debounce 300ms)
  - [ ] Filter dropdown: show products by category or availability (All / In Stock / Out of Stock)
  - [ ] Sort options: by name (A-Z), price (low to high), or date added (newest first)
  - [ ] Each row has "Edit" button (pencil icon) and "Delete" button (trash icon)
  - [ ] "View" button shows product detail as customer would see it
  - [ ] Clicking product name also opens edit page
  - [ ] Total product count displays at top: "Total: 45 products"
  - [ ] Empty state message if no products exist: "No products yet. [Add your first product]" (link to add product form)
  - [ ] Page is responsive and loads within 1 second

- **Dependencies:**
  - Admin authentication
  - Firestore products collection
  - Product edit and delete features

---

#### Feature: Responsive Mobile Design

- **Description:** Entire application is responsive and optimized for mobile phones (target screen sizes: 375px-480px width). Touch-friendly buttons, readable text, proper spacing, and mobile-optimized navigation.

- **User Story:** As a customer browsing on my iPhone or Android phone, I want the app to look polished and be easy to use on small screens so that I can comfortably browse and purchase.

- **Acceptance Criteria:**
  - [ ] All pages render correctly on screens as small as 375px width (iPhone SE)
  - [ ] Text is readable without zooming: body text minimum 16px, headings 20px+
  - [ ] Touch targets are minimum 48px x 48px for all buttons and clickable elements
  - [ ] No horizontal scrolling required on any page (except intentional image swiping)
  - [ ] Product grid shows 1 column on mobile, 2+ on larger screens
  - [ ] Navigation is mobile-friendly: hamburger menu (if needed) or bottom navigation
  - [ ] Images scale proportionally and don't break layout on small screens
  - [ ] Forms are single-column on mobile with proper spacing
  - [ ] Page title bar is sticky on mobile (for navigation context)
  - [ ] Tested on: iPhone SE, iPhone 12, Samsung Galaxy S21, Google Pixel 5 (via Chrome DevTools or actual devices)
  - [ ] Lighthouse Mobile Accessibility score: 90+

- **Dependencies:**
  - All customer-facing pages (browse, product detail, etc.)
  - All admin pages (dashboard, product forms)
  - Tailwind CSS responsive utilities

---

#### Feature: Fast Page Load Performance

- **Description:** Ensure pages load quickly on mobile 3G networks (typical Indian mobile condition). Target: Time to Interactive (TTI) < 3 seconds, page load time < 2 seconds.

- **User Story:** As a customer with a slow mobile connection, I want pages to load quickly so that I don't abandon the site waiting for images to load.

- **Acceptance Criteria:**
  - [ ] Lighthouse Performance score: 85+ on mobile 3G throttle
  - [ ] Time to Interactive (TTI): < 3 seconds on mobile 3G
  - [ ] First Contentful Paint (FCP): < 1.5 seconds on mobile 3G
  - [ ] Largest Contentful Paint (LCP): < 2.5 seconds on mobile 3G
  - [ ] Cumulative Layout Shift (CLS): < 0.1 (no layout jank)
  - [ ] Initial HTML bundle size: < 100KB gzipped
  - [ ] Images are optimized: WebP format with fallback to JPEG, lazy-loaded below fold
  - [ ] No unoptimized images larger than 300KB
  - [ ] Firebase Firestore queries are indexed and return < 200ms (p95)
  - [ ] CSS is critical inlined; non-critical CSS deferred
  - [ ] No render-blocking JavaScript in critical path
  - [ ] Tested via: Lighthouse CI, PageSpeed Insights, WebPageTest with 3G throttle

- **Dependencies:**
  - All pages (must be applied across entire application)
  - Angular build optimization
  - Image optimization (Squoosh, ImageOptim)
  - Firebase indexing

---

### 5.2 Priority 1 (P1) - Should Have

Important features that enhance the experience but aren't critical for initial launch. Can be added within 4-6 weeks post-MVP.

#### Feature: Product Search Bar

- **Description:** Search input on shop page allowing customers to find products by name or keyword. Real-time search with debounce.

- **User Story:** As a customer looking for a specific style (e.g., "blue anarkali"), I want to search by name so that I don't have to scroll through all products.

- **Acceptance Criteria:**
  - [ ] Search bar on shop page; input field with placeholder: "Search dresses..."
  - [ ] Typing searches products by name in real-time (debounce 300ms)
  - [ ] Search results update grid to show only matching products
  - [ ] Clear button (X icon) appears in input when text is entered; clears search and shows all products
  - [ ] If no results: "No dresses found for '[search term]'. Try different keywords." message
  - [ ] Search is case-insensitive and matches partial product names
  - [ ] Search icon button can also trigger search on Enter key
  - [ ] Search results respect active category filter

- **Dependencies:**
  - Product browse feature
  - Firestore full-text search (or client-side filtering for MVP)

---

#### Feature: Product Image Zoom

- **Description:** On product detail page, ability to zoom into product images for closer inspection of details (fabric texture, embroidery, etc.).

- **User Story:** As a customer examining a dress closely, I want to zoom into product images so that I can see embroidery details and fabric texture clearly.

- **Acceptance Criteria:**
  - [ ] Desktop: Clicking product image opens lightbox with full-resolution zoom
  - [ ] Mobile: Pinch-to-zoom works on product images within page
  - [ ] Lightbox allows navigation between images (arrow buttons or swipe)
  - [ ] Lightbox close button (X) or Escape key closes the view
  - [ ] Zoom goes up to 200% or full image resolution (whichever is smaller)
  - [ ] Smooth zoom animation (0.3s)

- **Dependencies:**
  - Product detail page
  - Image hosting via Firebase Storage

---

#### Feature: Share Product Link

- **Description:** Button on product detail page allowing customers to share product links via WhatsApp, email, or copy link to clipboard.

- **User Story:** As a customer who loves a dress, I want to share it with my friend via WhatsApp so that they can see it too.

- **Acceptance Criteria:**
  - [ ] "Share" button on product detail page
  - [ ] Clicking shows options: WhatsApp, Email, Copy Link
  - [ ] WhatsApp: Opens WhatsApp with link and product name (e.g., "Check out this dress: [Product Name] [product URL]")
  - [ ] Email: Opens email client with pre-filled subject and link
  - [ ] Copy Link: Copies product link to clipboard, shows toast: "Link copied!"
  - [ ] Product links are SEO-friendly: `example.com/products/[product-slug]`
  - [ ] Link includes product title for Open Graph preview (nice image/title when pasted on WhatsApp)

- **Dependencies:**
  - Product detail page
  - SEO-friendly URL structure
  - Open Graph meta tags

---

#### Feature: SEO-Friendly Product URLs

- **Description:** Product URLs are readable and SEO-friendly (e.g., `/products/elegant-blue-anarkali` instead of `/products/12345`). Includes meta tags for Open Graph and Twitter.

- **User Story:** As someone who finds a product via Google search, I want to see the product name in the URL so that I trust it's the right product.

- **Acceptance Criteria:**
  - [ ] Product URLs follow pattern: `/products/[product-slug]` where slug is URL-safe product name (e.g., "elegant-blue-anarkali-dress")
  - [ ] Slugs are lowercase, hyphen-separated, alphanumeric only
  - [ ] Product detail pages have meta tags:
    - Title: "[Product Name] - Musani Wear"
    - Description: "[First 150 chars of product description]"
    - Open Graph image: primary product image
    - Open Graph title: product name
    - Open Graph description: product description
    - Twitter card meta tags (for WhatsApp preview)
  - [ ] Google can crawl and index product pages
  - [ ] Sharing product link on WhatsApp shows preview: product image, name, price

- **Dependencies:**
  - Product detail page
  - Angular meta tags library or custom meta service
  - Firebase Hosting (supports server-side rendering or meta tag injection)

---

#### Feature: Product Filters (Advanced)

- **Description:** Additional filtering options beyond categories: price range, color, fabric type.

- **User Story:** As a customer looking for something specific, I want to filter by price and color so that I can narrow down options.

- **Acceptance Criteria:**
  - [ ] Filter panel on shop page (mobile: collapsible sidebar or bottom sheet; desktop: left sidebar)
  - [ ] Filter options: Category, Price Range (slider: ₹500-₹10,000), Color (checkboxes), Fabric (checkboxes)
  - [ ] Multiple selections within a filter are OR-ed (select blue OR red shows both)
  - [ ] Filters across categories are AND-ed (category AND price range)
  - [ ] "Clear Filters" button resets all selections
  - [ ] Number of matching products updates in real-time as filters change
  - [ ] Active filters displayed as chips with X to remove individual filters

- **Dependencies:**
  - Product browse feature
  - Firestore indexing for filtered queries

---

### 5.3 Priority 2 (P2) - Nice to Have

Features for future consideration (post-6 weeks).

- **WhatsApp Chat Floating Button:** A fixed WhatsApp button in bottom-right corner of shop pages for general inquiries (not product-specific). Text: "Message us" with pre-filled message: "Hi! I have a question about your dresses."

- **Recently Viewed Products:** Small section on home page or shop page showing products the customer viewed in their last 7 days. Uses localStorage to track (client-side only, no user accounts).

- **Admin Analytics Dashboard:** Chart showing product view counts, top 5 most-viewed products, most-inquired products, traffic trends over time.

- **Admin Bulk Product Upload:** CSV/Excel upload to add/update multiple products at once instead of one-by-one form.

- **Product Reviews/Ratings:** Display star ratings and customer reviews on product detail page (optional; can be read-only initially with admin moderation).

- **Wishlist:** Customers can save favorite products to a wishlist (localStorage-based, no accounts required).

---

## 6. Out of Scope

**Explicitly NOT included in this MVP version:**

1. **No payment gateway integration** — Stripe, PayPal, Razorpay, or any payment processing. All orders are finalized via WhatsApp conversation with business owner; payments happen offline (cash, bank transfer, COD, etc.).

2. **No shopping cart or "Add to Cart"** — Customers browse and ask about availability directly; no cart feature. Cart implies checkout, which is not in scope.

3. **No customer accounts or user authentication** — No customer login, signup, or registration required. Browsing is fully public; no need to create accounts.

4. **No order management system** — Admin cannot track orders placed, see order history, or manage deliveries in the app. Order discussions happen via WhatsApp; business owner manages fulfillment offline.

5. **No delivery/shipping integration** — No shipping address collection, no delivery tracking, no integration with shipping APIs (Delhivery, Shiprocket, etc.). Delivery is arranged via WhatsApp conversation.

6. **No customer messaging/chatbot within app** — All customer inquiries happen via WhatsApp only. No in-app chat, no live chat, no chatbot.

7. **No multi-language support** — Application is English-only for MVP. Kannada, Tamil, Telugu translations are not in scope.

8. **No social media integrations** — No "Log in with Google/Facebook", no auto-posting to Instagram, no social media syncing.

9. **No subscription/membership features** — No VIP tiers, no subscription plans, no loyalty programs in MVP.

10. **No mobile app (iOS/Android native)** — Web application only; no native iOS or Android apps. Web app is mobile-responsive but not a native app.

11. **No API for third-party integrations** — No REST API or webhooks for external systems to integrate with Musani Wear.

12. **No advanced inventory forecasting** — No AI-based stock predictions or reorder suggestions.

13. **No returns/refunds management** — Returns are not managed in the app; all handled offline via WhatsApp.

14. **No tax calculation** — No automatic tax computation or GST calculation in the app.

15. **No multi-vendor support** — Single business owner only; not a marketplace for multiple sellers.

*Why this matters: These exclusions prevent scope creep and AI hallucinations about unrequested features. Development focus is solely on catalog + WhatsApp integration.*

---

## 7. User Scenarios

### 7.1 Happy Path: Customer Discovers & Inquires About a Dress

**Context:** Priya (customer) is looking for a casual dress for office wear. She finds Musani Wear via Instagram or Google Search.

**Steps:**

1. **Priya visits the website** (musani-wear.com or direct link from Instagram)
   - Page loads: Home page with featured products and category highlights
   - Expected: Hero banner, 3-4 featured products visible, navigation to shop page

2. **Priya navigates to Shop page**
   - Clicks "Shop" button or browses featured products
   - Expected: Grid of products loads (10-15 visible on scroll); category filter on top (New Arrivals, Stitched, Unstitched, Luxe)

3. **Priya filters by "Stitched" category**
   - Clicks "Stitched" category button
   - Expected: Grid updates to show only stitched dresses; product count updates (e.g., "Showing 23 stitched dresses")

4. **Priya scrolls and finds a blue dress she likes**
   - Clicks product card for "Elegant Blue Anarkali"
   - Expected: Product detail page loads with: primary image, product name, price (₹2,499), description, color swatches (blue selected), fabric (Georgette), availability badge (In Stock), "Ask Availability" button

5. **Priya wants to check other colors**
   - Clicks color swatch for "Maroon"
   - Expected: Selected color updates to maroon; product title updates if needed; "Ask Availability" message will include "Color: Maroon"

6. **Priya clicks "Ask Availability" button**
   - Button action: Opens WhatsApp with message: "Hi! I'm interested in Elegant Blue Anarkali (Color: Maroon, Price: ₹2,499). Could you please confirm availability?"
   - Expected (on mobile): WhatsApp app opens (if installed) with pre-filled message to business owner's number
   - Expected (on desktop): WhatsApp Web opens with message

7. **Priya messages business owner**
   - Types follow-up question in WhatsApp: "Can this be done in sleeveless style?"
   - Expected: Deepa (owner) responds within hours confirming availability and customization options

8. **Result:** Order is confirmed, payment arranged offline, dress is delivered

---

### 7.2 Alternative Path: Customer Shares Dress with Friend via WhatsApp

**Context:** Priya finds a dress but wants her friend Anjali's opinion before messaging the owner.

**Steps:**

1. Priya is on product detail page for "Elegant Blue Anarkali"
2. Priya clicks "Share" button
3. Expected: Modal appears with share options (WhatsApp, Email, Copy Link)
4. Priya clicks "WhatsApp"
5. Expected: WhatsApp opens with message: "Check out this dress: Elegant Blue Anarkali ₹2,499 [product link]"
6. Priya selects friend "Anjali" as recipient
7. Expected: Message sent with product link and preview image
8. Anjali receives message and clicks product link
9. Expected: Product detail page opens for Anjali; she can see all details and also click "Ask Availability"

---

### 7.3 Admin Flow: Deepa Adds a New Product

**Context:** Deepa has designed a new maroon lehenga and wants to add it to the catalog.

**Steps:**

1. **Deepa logs in to admin dashboard**
   - Navigates to `/admin/login`
   - Enters email and password
   - Expected: Redirects to admin dashboard showing stats (total products, in-stock count, etc.)

2. **Deepa clicks "Add New Product" button**
   - Expected: Navigates to add product form

3. **Deepa fills in product details:**
   - Name: "Maroon Embroidered Lehenga"
   - Description: "Beautiful maroon lehenga with hand embroidery and..."
   - Price: ₹4,999
   - Category: "New Arrivals"
   - Fabric: "Pure Silk"
   - Availability: "In Stock" (toggle enabled)
   - Colors: Add 2 options — Maroon (#800000) and Burgundy (#5C0A0A)

4. **Deepa uploads product images**
   - Clicks "Upload Images" and selects 5 photos from her phone
   - Expected: Image previews appear; first image is set as cover/primary image
   - First image is used for product grid card

5. **Deepa clicks "Save Product"**
   - Expected: Form validates (all required fields filled)
   - Success message: "Product 'Maroon Embroidered Lehenga' added successfully"
   - Deepa is redirected to product detail page (as customer would see it)

6. **Product is now live on customer-facing store**
   - Expected: Product appears in "New Arrivals" category on shop page
   - Customers can immediately find it, view details, click "Ask Availability"

---

### 7.4 Edge Case: Customer Tries to Share a Product But Can't Find WhatsApp

**Context:** Customer visits website on desktop and tries to share product via WhatsApp, but WhatsApp is not installed.

**Steps:**

1. Customer on product detail page clicks "Share" button
2. Clicks "WhatsApp" option
3. Expected: WhatsApp Web link opens in new tab
4. IF customer is logged into WhatsApp Web: Message compose window appears with pre-filled message
5. IF customer is NOT logged into: WhatsApp Web login page appears
6. Customer scans QR code to authenticate (standard WhatsApp Web flow)
7. After auth: Message compose window with pre-filled message appears
8. Result: Message can be sent normally

---

### 7.5 Error Scenario: Admin Tries to Add Product Without Image

**Context:** Deepa (admin) is adding a new product but forgets to upload images.

**Steps:**

1. Deepa fills in all product fields (name, price, category, colors)
2. Deepa clicks "Save Product" without uploading any images
3. Expected: Form validation fails
4. Error message appears below Images field: "At least 1 product image is required"
5. Submit button remains disabled (faded)
6. Deepa uploads at least 1 image
7. Error message clears; submit button re-enables
8. Expected: Form submits successfully

---

### 7.6 Error Scenario: Out of Stock Product Shows "Ask Availability"

**Context:** Customer sees a beautiful dress but it's marked "Out of Stock".

**Steps:**

1. Customer on product detail page
2. Availability badge shows: "Out of Stock" (gray background)
3. "Ask Availability" button is still visible and enabled
4. Customer can still click "Ask Availability" to ask about restock or custom order
5. Expected: Message pre-filled as normal: "Hi! I'm interested in [Product] (Color: [Color], Price: ₹[Price]). Could you please confirm availability?"
6. Deepa receives message and can respond: "This is currently out of stock, but we can do a custom order if interested!"
7. Result: Sales opportunity not lost despite out-of-stock status

---

## 8. Dependencies & Constraints

### 8.1 Technical Dependencies

- **Firebase Project:** Firestore database, Firebase Storage, Firebase Hosting, Firebase Authentication
- **Firebase Firestore Schema:**
  - `products` collection with fields: id, name, description, price, category, fabric, images, colors, availability, created_at, updated_at
  - `categories` collection with fields: id, name, created_at
  - `config` collection with fields: admin_phone, business_name, business_description, contact_email
- **Firebase Storage:** Image hosting at scale (~5-50GB estimated for 50-200 products with 5-10 images each)
- **Angular 20+** with TypeScript, NgRx, Tailwind CSS
- **Firebase Admin SDK** for backend operations (if needed for image processing)
- **Email service** (optional for admin password reset): Firebase built-in or external service like Resend/SendGrid

### 8.2 Business Constraints

- **Timeline:** MVP launch within 8 weeks from approval
  - Weeks 1-2: Design & architecture finalization
  - Weeks 3-6: Development (frontend + admin backend)
  - Week 7: QA, bug fixes, optimization
  - Week 8: Launch, training, go-live support

- **Budget:** Minimal hosting costs (Firebase Spark Plan free up to limits, or Blaze Pay-as-you-go)
  - Firebase: $0 for MVP (Spark free tier), up to $100-200/month at scale (Blaze)
  - Custom domain: ~₹500-1,000/year (optional for MVP)
  - Developer time: 2-3 developers for 8 weeks

- **Team:**
  - 1 Frontend Developer (Angular, Tailwind, NgRx)
  - 1 Backend/Firebase Developer (Firestore, Storage, Auth setup)
  - 1 UI/UX Designer (product & admin interfaces)
  - Project Manager / Product Owner

- **Admin Tech Competence:** Business owner (Deepa) is non-technical; all admin UI must be intuitive with clear labels and no jargon. Training required but minimal.

- **No compliance burden (MVP):** No GDPR, HIPAA, or PCI-DSS compliance needed for MVP (no payment processing, no user accounts with personal data). India-based business, so no international data regulations.

### 8.3 External Dependencies

- **WhatsApp Business API:** Not needed for MVP. Using standard WhatsApp deep links (wa.me) is sufficient.
- **Google Analytics (optional):** For tracking page views and user behavior
- **Search Engine Indexing:** Dependent on Firebase Hosting's SEO support and proper meta tag implementation

---

## 9. Non-Functional Requirements

### 9.1 Performance

- **Page Load Time:**
  - Initial page load: < 2 seconds on mobile 3G
  - Time to Interactive (TTI): < 3 seconds on mobile 3G
  - Largest Contentful Paint (LCP): < 2.5 seconds
  - First Contentful Paint (FCP): < 1.5 seconds

- **API Response Times:**
  - Firestore queries: < 200ms (p95) for product listings
  - Authentication: < 500ms for login/logout

- **Bundle Size:**
  - Initial HTML: < 100KB gzipped
  - JavaScript: < 200KB gzipped (Angular app)
  - CSS: < 50KB gzipped

- **Concurrent Users:**
  - Support 500 concurrent users for MVP launch
  - Scale to 5,000 concurrent users within 6 months (via Firebase auto-scaling)

### 9.2 Security

- **Authentication:** Firebase Email/Password authentication for admin
  - Password requirements: Minimum 8 characters (Firebase default)
  - Sessions: HTTP-only cookies managed by Firebase
  - CSRF protection: Built into Firebase Auth

- **Data Encryption:**
  - In Transit: TLS 1.3 (Firebase Hosting default)
  - At Rest: Firestore default encryption

- **Access Control:**
  - Admin pages protected by Firebase Auth rules
  - Firestore Security Rules: admin can only read/write their own data
  - Public read access to products collection for all visitors

- **API Security:**
  - No API keys exposed on frontend (Firebase has built-in restrictions)
  - Firebase Storage rules: public read, authenticated write only for images

- **Compliance:**
  - No GDPR compliance required for MVP (no user account data stored)
  - No PCI-DSS (no payment processing)
  - Privacy policy displayed on website (optional for MVP)

### 9.3 Accessibility

- **Standards:** WCAG 2.1 Level AA
  - Text contrast: Minimum 4.5:1 for normal text, 3:1 for large text
  - Font sizes: Minimum 16px for body text on mobile
  - Touch targets: Minimum 48px x 48px

- **Screen Reader Support:**
  - All images have alt text describing the product
  - Form labels associated with inputs
  - Navigation landmarks: header, main, footer
  - ARIA roles for custom components

- **Keyboard Navigation:**
  - Full keyboard support: Tab to navigate, Enter to activate buttons, Escape to close modals
  - Focus indicators visible (outline or highlight)
  - No keyboard traps

- **Color:** Not the only indicator of status (e.g., "In Stock" is green text + text label, not color alone)

### 9.4 Scalability

- **User Growth:**
  - MVP: 100-500 users in first month
  - Month 3: 1,000-5,000 users
  - Month 6: 5,000-20,000 users
  - Firebase Firestore scales automatically up to ~25,000 writes/second; sufficient for expected growth

- **Data Volume:**
  - Products: 50-200 items
  - Product images: ~10 per product (max 2,000 images)
  - Storage needed: ~5-50GB

- **Geographic Distribution:** India-focused initially (Mangalore/Karnataka); Firebase Hosting available globally

### 9.5 Reliability

- **Uptime:** 99.5% SLA (Firebase Hosting standard)
  - Target: < 3.6 hours downtime per month

- **Backup & Recovery:**
  - Firestore: Automatic daily backups (Google-managed)
  - Firebase Storage: Automatic redundancy across data centers
  - Images: CDN caching via Firebase Hosting

- **Error Handling:**
  - Network errors: Graceful fallbacks; show retry buttons
  - 404 errors: Friendly "Page not found" message with link to home
  - 5xx errors: "Something went wrong" message with error ID for support

- **Monitoring:**
  - Firebase Console: Dashboard for uptime, performance, errors
  - Error tracking (optional): Sentry or Firebase Crashlytics for detailed error analysis
  - Analytics: Google Analytics for user behavior and traffic

---

## 10. Timeline & Milestones

### 10.1 Project Phases

| Phase | Description | Target Dates | Deliverables |
|-------|-------------|--------------|--------------|
| **Phase 1: Planning & Design** | Requirements, wireframes, design system, Firebase schema | Week 1-2 | PRD, wireframes, design system, database schema, admin training plan |
| **Phase 2: Development** | Frontend (shop + product detail), Admin dashboard, Firebase integration | Week 3-6 | Working MVP, responsive design, admin features complete |
| **Phase 3: QA & Optimization** | Testing, bug fixes, performance optimization, security review | Week 7 | Test reports, performance metrics, security sign-off |
| **Phase 4: Launch & Training** | Deployment to Firebase Hosting, admin training, go-live support | Week 8 | Live website, admin trained, support plan in place |

### 10.2 Key Milestones

- **Week 1 (End):** Design & architecture finalized, Firebase project set up, team aligned
- **Week 2 (End):** Wireframes complete, Firestore schema finalized, Angular project boilerplate ready
- **Week 4 (End):** Customer-facing shop & product detail pages complete and functional
- **Week 6 (End):** Admin dashboard, product add/edit/delete complete, 80% feature complete
- **Week 7 (Mid):** Performance optimization complete, Lighthouse 85+, mobile testing complete
- **Week 7 (End):** All bugs fixed, security review complete, QA sign-off
- **Week 8 (Mid):** Live deployment to Firebase Hosting, admin training completed
- **Week 8 (End):** Go-live, 24-hour support monitoring, post-launch validation

---

## 11. Risks & Mitigation

| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|---------------------|
| **Firebase quota limits exceeded** | Site goes down during traffic spike | Low | Monitor Firebase metrics; set up alerts; upgrade to Blaze plan as needed; optimize queries |
| **Admin finds interface too complex** | Admin unable to manage products independently; ongoing developer support required | Medium | Invest in clear UI/UX; provide video tutorials and written docs; offer onboarding call |
| **Poor mobile performance** | High bounce rate; customers abandon site due to slow load times | Medium | Prioritize Lighthouse optimization early (Week 1-2); test on 3G; optimize images aggressively |
| **WhatsApp integration doesn't work** | Core user flow broken; customers can't message; sales lost | Low | Test wa.me links on multiple devices/OS; provide fallback (phone number) if needed |
| **Data loss due to Firebase misconfiguration** | Customer data or product catalog lost | Low | Enable Firestore automated backups; test restore procedures; document backup process |
| **Security breach or unauthorized admin access** | Business data compromised; customer WhatsApp number exposed | Low | Enforce strong passwords; use Firebase Auth; review Security Rules; implement rate limiting on auth |
| **Competitors copy the idea** | Competitive advantage lost | Low | Move fast to launch; focus on customer relationships; build brand loyalty; plan P2 features for differentiation |
| **Boutique owner changes contact details** | Customers messaging old WhatsApp number; missed sales | Low | Add reminder to update admin settings monthly; clear UI in admin dashboard |

---

## 12. Open Questions

- [ ] What is the boutique owner's current Instagram handle? Should we link to it from website?
- [ ] Are there specific color names/Indian textile terms the business uses for fabrics? (e.g., "Cotton Silk", "Chanderi")
- [ ] Do we need to support WhatsApp Business API for better integration, or is wa.me sufficient for MVP?
- [ ] What is the business owner's preferred email for password reset and admin communications?
- [ ] Are there specific design aesthetics the owner prefers? (Luxury, minimalist, traditional Indian, etc.)
- [ ] Should we plan for bulk product import feature (P1/P2), or is one-by-one entry acceptable for MVP?
- [ ] Will the boutique send pre-defined responses via WhatsApp (e.g., "Price list", "Stitching info"), or ad-hoc custom responses?
- [ ] What happens if a customer messages and the owner is unavailable? Should we add an auto-responder feature?
- [ ] Are there minimum order quantities (e.g., bulk discounts) the business wants to communicate?
- [ ] Should the website support the owner's local payment methods (Google Pay, PhonePe) displayed somewhere, or keep WhatsApp-only?

---

## 13. Approval & Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner / Business Owner | Deepa | | |
| Lead Developer / Tech Lead | | | |
| UI/UX Designer | | | |
| Project Manager | | | |

---

## Appendix

### A. Glossary

- **Firestore:** Google Cloud database service for storing product, category, and admin configuration data
- **Firebase Storage:** Google Cloud file storage for hosting product images
- **Firebase Hosting:** Google Cloud hosting platform for deploying the website
- **Firebase Authentication:** Service for admin login (Email/Password)
- **WhatsApp Deep Link:** `wa.me/[phone]?text=[message]` URL that opens WhatsApp with pre-filled message
- **SKU:** Stock Keeping Unit (product identifier); in MVP, product ID is auto-generated UUID
- **TTI:** Time to Interactive; measure of when a page becomes responsive to user input
- **LCP:** Largest Contentful Paint; metric for when main content finishes loading
- **NgRx:** Angular state management library (Actions, Reducers, Effects, Selectors) for predictable state
- **Tailwind CSS:** Utility-first CSS framework for rapid UI development
- **MVP:** Minimum Viable Product; initial launch with core P0 features only

### B. References

- [Firebase Documentation](https://firebase.google.com/docs)
- [Angular Documentation](https://angular.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [WCAG 2.1 Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Lighthouse Performance Auditing](https://developers.google.com/web/tools/lighthouse)
- [WhatsApp Business API & Deep Linking](https://www.whatsapp.com/business/api/)
- [Web Vitals - Google](https://web.dev/vitals/)

### C. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1.0 | March 8, 2026 | Product Team | Initial PRD creation with P0/P1/P2 features, user personas, success metrics, and detailed acceptance criteria |

---

## Notes for Development Team

- **Kick-off Meeting Topics:** Firebase schema validation, design system review, tech stack alignment, admin training plan
- **Definition of Done:** Feature complete with acceptance criteria met, unit tests passing, code reviewed, documented, and tested on mobile
- **Communication:** Daily standup during development (Weeks 3-7); weekly sync during planning and launch phases
- **Admin Training:** Record video tutorials (3-5 min each) for: adding products, editing availability, updating settings; provide written guide
- **Post-Launch Support:** 24-hour on-call support for first week; admin support available for 2 weeks for questions and minor tweaks

---

**END OF PRD**
