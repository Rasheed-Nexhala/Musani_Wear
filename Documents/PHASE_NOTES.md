# Musani Wear — Phase Notes (Reflexion)

Lessons and outcomes from each implementation phase.

---

## Phase 1 — Foundation — 2026-03-08

### Completed
- [x] Task 1.1 — Create Angular project with folder structure
- [x] Task 1.1b — Create utils and shared methods (formatPrice, slugify, validateImageFile, etc.)
- [x] Task 1.2 — Install and configure Tailwind CSS (gold/cream/charcoal, Playfair Display + Inter)
- [x] Task 1.3 — Set up Firebase project (environment files)
- [x] Task 1.4 — Install and configure AngularFire
- [x] Task 1.5 — Set up Angular Router with lazy-loaded public/admin modules
- [x] Task 1.6 — Create Auth Guard for admin routes
- [x] Task 1.7 — Create Navbar and Footer components
- [x] Task 1.8 — Seed default categories in Firestore
- [x] Task 1.9 — Create README and project documentation
- [x] Task 1.10 — Configure Jest + Angular Testing Library

### Lessons Learned
- Tailwind v4 uses `@theme` in CSS instead of `tailwind.config.js`; adapted from IMPLEMENTATION_PLAN v3 approach.
- Angular 21 uses standalone components by default; routing uses `loadComponent` instead of module-based lazy loading.
- Created minimal AuthService in Phase 1 for Navbar; full NgRx AuthService comes in Phase 2.
- Jest replaced Vitest for `npm test`; Vitest remains in devDependencies but is unused.

### Blockers Resolved
- None. All tasks completed via subagents.

### Verification
- Verifier: Phase 1 checklist validated. Build and tests pass.
- Note: `environment.example.ts` exists at `musani-wear/src/environments/`; README instructions are correct.
- Bundle size warning (~500 kB budget exceeded) — address in Phase 5 polish.
