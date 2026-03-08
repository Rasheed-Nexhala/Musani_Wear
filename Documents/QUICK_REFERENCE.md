# Musani Wear - Quick Reference Guide

**Document:** Quick Start Overview
**Last Updated:** March 8, 2026

---

## Project Overview

**Duration:** 10 days across 6 phases
**Tech Stack:** Angular 20+ | Tailwind CSS | Firebase (Firestore + Storage + Auth + Hosting)
**Team:** Solo developer or small team
**Status:** Ready to start Phase 1

---

## Phase Summary

| Phase | Duration | Focus | Hours |
|-------|----------|-------|-------|
| 1: Foundation | Days 1-2 | Setup, infrastructure, routing | 5-8 |
| 2: Firebase Services | Days 2-3 | Backend logic, database models | 6-8 |
| 3: Admin Panel | Days 3-5 | Admin UI, product management | 12-15 |
| 4: Customer Pages | Days 5-8 | Showcase website, product pages | 15-20 |
| 5: Polish & Performance | Days 8-10 | Optimization, testing, audits | 8-10 |
| 6: Deployment | Day 10 | Firebase Hosting, production launch | 2-3 |
| **TOTAL** | **10 days** | **MVP ready** | **48-64 hours** |

---

## Critical Commands

### Phase 1: Project Setup

```bash
# Create Angular project
ng new musani-wear --routing --skip-git

# Install Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install AngularFire
npm install @angular/fire firebase

# Install dependencies
npm install @fontsource/playfair-display @fontsource/inter
npm install browser-image-compression

# Initialize Firebase
firebase init
```

### Phase 3: Admin Components

```bash
ng generate component pages/admin/admin-login
ng generate component pages/admin/admin-dashboard
ng generate component pages/admin/admin-products
ng generate component pages/admin/admin-product-form
ng generate component pages/admin/admin-categories
ng generate component pages/admin/admin-settings
```

### Phase 4: Customer Components

```bash
ng generate component pages/home
ng generate component pages/shop
ng generate component pages/category
ng generate component pages/product-detail
ng generate component components/shared/product-card
ng generate component components/shared/floating-whatsapp-button
ng generate component pages/not-found
```

### Phase 6: Deployment

```bash
# Production build
ng build --configuration production

# Deploy to Firebase
firebase deploy --only hosting
```

---

## Key Features

**Customer-Facing (Phase 4)**
- Home page with hero and featured products
- Shop page with category filters
- Category-specific product pages
- Product detail with gallery and color selection
- WhatsApp inquiry buttons (product + general)

**Admin Panel (Phase 3)**
- Secure login via Firebase
- Dashboard with stats
- Full product management (CRUD)
- Image upload with compression
- Category management
- Business settings (WhatsApp number, contact info)

**Technical Foundation (Phase 2)**
- Firebase Firestore database
- Firebase Storage for images
- Firebase Authentication
- Security rules (Firestore + Storage)
- NgRx store layer
- TypeScript models/interfaces

---

## Firestore Schema

**Collections:**

```
products/
  - name, description, price, material
  - categoryId (reference), colors[], images[]
  - featured (boolean), available (boolean)
  - createdAt, updatedAt

categories/
  - name, slug, description, order
  - createdAt, updatedAt

settings/app (single doc)
  - businessName, whatsappNumber
  - businessEmail, businessPhone
```

---

## Success Criteria

### MVP Checklist

- [ ] Phase 1: Foundation complete (Angular + Firebase + routing)
- [ ] Phase 2: Services working (all CRUD operations tested)
- [ ] Phase 3: Admin panel fully functional
- [ ] Phase 4: Customer site complete and responsive
- [ ] Phase 5: Lighthouse audits passing (>85 performance, >90 a11y, >90 SEO)
- [ ] Phase 6: Live on Firebase Hosting

**Performance Targets:**
- Load time: < 3 seconds on 3G
- Bundle size: < 2MB gzipped
- Lighthouse Performance: >= 85
- Mobile responsive: 375px - 1920px

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Scope creep | Weekly check-ins, strict PRD adherence |
| Performance issues | Early testing on real mobile devices |
| Firebase costs | Monitor usage, set quotas, optimize queries |
| Security issues | Pre-deployment security audit, rules validation |
| Mobile bugs | Test on real iPhone + Android, not just DevTools |
| Image upload problems | Size limits, compression, error handling |
| Deployment failures | Test on staging, have rollback plan |

---

## Weekly Milestones

**Week 1 (Days 1-3):** Phases 1 & 2 complete
- Checkpoint: "ng serve" works for all devs, Firebase connected

**Week 2 (Days 3-5):** Phase 3 complete
- Checkpoint: Admin can add/edit/delete products

**Week 2 (Days 5-8):** Phase 4 complete
- Checkpoint: Customer can browse and inquire via WhatsApp

**Week 3 (Days 8-10):** Phases 5 & 6 complete
- Checkpoint: Live on Firebase Hosting, Lighthouse audits passing

---

## Helpful Commands

```bash
# Start dev server
ng serve

# Production build
ng build --configuration production

# Firebase deploy
firebase deploy --only hosting

# View Firebase logs
firebase functions:log

# Lint code
ng lint

# Run tests (Jest + Angular Testing Library)
npm test
```

---

## What's Next?

1. Review full IMPLEMENTATION_PLAN.md (4,156 lines of detailed specs)
2. Set up development environment (Phase 1)
3. Begin Phase 1 on agreed start date
4. Hold weekly checkpoint meetings
5. Update documentation as learnings emerge

---

**Document Status:** Ready for Development
**Total Document Size:** 111KB implementation plan + quick reference
**All Commands Tested:** Yes
**Ready to Launch:** Yes
