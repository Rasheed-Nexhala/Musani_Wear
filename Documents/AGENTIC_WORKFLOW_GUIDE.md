# Musani Wear — Agentic Workflow Guide

**Purpose:** Map the IMPLEMENTATION_PLAN to agentic patterns, Cursor subagents, skills, and human-in-the-loop checkpoints for optimal development.

**References:**
- [agentic-patterns-visual-guide.md](./agentic-patterns-visual-guide.md) — 24 patterns
- [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) — 6 phases, 10 days

---

## Table of Contents

1. [Pattern-to-Phase Mapping](#pattern-to-phase-mapping)
2. [Recommended Workflow by Phase](#recommended-workflow-by-phase)
3. [Subagent Usage Matrix](#subagent-usage-matrix)
4. [Skill Usage by Task](#skill-usage-by-task)
5. [Human-in-the-Loop Checkpoints](#human-in-the-loop-checkpoints)
6. [All Prompts Reference](#all-prompts-reference)
7. [Recommended Slash Commands](#recommended-slash-commands)
8. [Cursor Commands & Rules](#cursor-commands--rules)
9. [Quick Reference: Phase → Pattern → Subagent → Skill](#quick-reference)

---

## Pattern-to-Phase Mapping

| Phase | Primary Patterns | Rationale |
|-------|------------------|-----------|
| **Phase 1: Foundation** | **Code-as-Orchestrator** (Pattern 7), **Constraint/Checklist-Driven Planning** (Pattern 9) | Fixed pipeline: setup → Tailwind → Firebase → routing → guards. No LLM decides order. Use checklist for completion gates. |
| **Phase 2: Firebase Services** | **Tool Dispatch** (Pattern 1), **Structured Output** (Pattern 24), **Evaluator-Worker** (Pattern 17) | Services are "tools"; NgRx actions/reducers use typed interfaces. Evaluator = test-runner subagent validates output. |
| **Phase 3: Admin Panel** | **Planner-Executor Split** (Pattern 6), **Human-in-the-Loop** (Pattern 23), **Self-Correction Retry** (Pattern 16) | You (human) plan high-level; Cursor executes tasks. Approval gates before destructive actions (delete product). |
| **Phase 4: Customer Pages** | **Code-as-Orchestrator**, **Structured Output**, **Guardrails** (Pattern 18) | Fixed page flow. Typed models. Guardrails = validation (PII, image size). |
| **Phase 5: Polish** | **Evals-in-the-Loop** (Pattern 19), **Evaluator-Worker** | Verifier subagent runs evals; test-runner ensures coverage. |
| **Phase 6: Deployment** | **Constraint/Checklist Planning**, **Human-in-the-Loop (Approval Gate)** | Checklist before deploy; human approves production push. |

### Supporting Patterns (All Phases)

| Pattern | Usage |
|---------|-------|
| **Memory Patterns** (20) | Short-term: current chat context. Long-term: IMPLEMENTATION_PLAN, TESTING.md as reference. |
| **Reflexion** (2) | After each phase: store "lessons learned" in a simple notes file (e.g. `Documents/PHASE_NOTES.md`). |
| **Skill Router** (15) | Route tasks: Angular → angular-20 skill; Firebase → firebase-angular; Tests → jest-angular + angular-testing-library. |

---

## Recommended Workflow by Phase

### Phase 1: Foundation (Days 1–2)

**Workflow:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 1 WORKFLOW                                                             │
│                                                                              │
│ 1. HUMAN: Read IMPLEMENTATION_PLAN Phase 1, decide starting task (e.g. 1.1)  │
│ 2. CURSOR: @angular-20 @firebase-angular — implement Task 1.1–1.2            │
│ 3. HUMAN: Review generated code, approve or request changes                  │
│ 4. CURSOR: Continue Tasks 1.3–1.5 (Firebase, routing)                        │
│ 5. HUMAN: Verify ng serve works, Firebase connects                           │
│ 6. CURSOR: Tasks 1.6–1.8 (guard, layout, seed)                               │
│ 7. CURSOR: mcp_task subagent_type=verifier — validate Phase 1 checklist     │
│ 8. CURSOR: mcp_task subagent_type=test-runner — run tests, fix failures     │
│ 9. HUMAN: Final sign-off on Phase 1                                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Cursor prompts to use:**
- *"Implement Task 1.1 from IMPLEMENTATION_PLAN: create Angular project with folder structure. Use @angular-20 skill."*
- *"Add Firebase config per Task 1.3–1.4. Use @firebase-angular skill."*
- *"Run the verifier agent to validate Phase 1 completion checklist."*

---

### Phase 2: Firebase Services (Days 2–3)

**Workflow:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 2 WORKFLOW                                                             │
│                                                                              │
│ 1. HUMAN: Confirm Phase 1 done, start Phase 2                                 │
│ 2. CURSOR: @firebase-angular — implement models (Task 2.1)                   │
│ 3. CURSOR: Implement AuthService + NgRx auth (Task 2.2)                     │
│ 4. CURSOR: Implement ProductService, CategoryService (Tasks 2.3–2.4)         │
│ 5. HUMAN: Review service interfaces, approve Firestore structure             │
│ 6. CURSOR: Implement ImageService, SettingsService, WhatsAppService         │
│ 7. CURSOR: mcp_task subagent_type=security-auditor — audit Firestore rules  │
│ 8. CURSOR: Deploy rules (Task 2.8–2.9) — HUMAN approves deploy               │
│ 9. CURSOR: mcp_task subagent_type=test-runner — add Jest tests for utils     │
│ 10. CURSOR: mcp_task subagent_type=verifier — validate Phase 2 checklist    │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Cursor prompts:**
- *"Implement ProductService per Task 2.3. Use @firebase-angular for Firestore patterns."*
- *"Run security-auditor agent on firestore.rules and storage.rules."*
- *"Add Jest unit tests for formatPrice, slugify, validateImageFile per TESTING.md."*

---

### Phase 3: Admin Panel (Days 3–5)

**Workflow:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 3 WORKFLOW (Human-in-the-Loop heavy)                                   │
│                                                                              │
│ 1. HUMAN: Approve admin component structure from IMPLEMENTATION_PLAN         │
│ 2. CURSOR: Implement admin-login (Task 3.1) — HUMAN tests login flow         │
│ 3. CURSOR: Implement admin-dashboard (Task 3.2)                              │
│ 4. CURSOR: Implement admin-products list + CRUD (Task 3.3–3.4)              │
│ 5. HUMAN: APPROVAL GATE — Test add/edit/delete product before proceeding     │
│ 6. CURSOR: Implement admin-categories, admin-settings                        │
│ 7. HUMAN: APPROVAL GATE — Verify delete confirmation modal works            │
│ 8. CURSOR: mcp_task subagent_type=test-runner — component tests for forms   │
│ 9. CURSOR: mcp_task subagent_type=verifier — validate Phase 3 checklist     │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Human-in-the-Loop (Pattern 23):**
- **Mode 2 (Checkpoint-based):** After Task 3.4, pause and have human test product CRUD.
- **Mode 3 (Approval Gate):** Before implementing delete, confirm: "I'm about to add delete with confirmation. Proceed?"

---

### Phase 4: Customer Pages (Days 5–8)

**Workflow:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 4 WORKFLOW                                                             │
│                                                                              │
│ 1. CURSOR: @angular-20 — implement Home page (Task 4.1)                      │
│ 2. CURSOR: Implement ProductCard component (Task 4.2)                         │
│ 3. CURSOR: Implement Shop, Category, Product Detail pages                     │
│ 4. HUMAN: Review UI on mobile (DevTools responsive)                          │
│ 5. CURSOR: Implement floating WhatsApp button (Task 4.6)                      │
│ 6. CURSOR: Add guardrails — validate buildWhatsAppMessage, image alt text    │
│ 7. CURSOR: mcp_task subagent_type=test-runner — component tests for pages   │
│ 8. CURSOR: mcp_task subagent_type=verifier — validate Phase 4 checklist     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Phase 5: Polish & Performance (Days 8–10)

**Workflow:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 5 WORKFLOW (Evals-in-the-Loop)                                         │
│                                                                              │
│ 1. CURSOR: mcp_task subagent_type=verifier — full MVP checklist              │
│ 2. CURSOR: Run Lighthouse audit (Task 5.4) — HUMAN reviews scores           │
│ 3. CURSOR: Fix accessibility issues (Task 5.6)                              │
│ 4. CURSOR: mcp_task subagent_type=test-runner — ensure coverage > 60%       │
│ 5. HUMAN: Manual smoke test on real device                                   │
│ 6. CURSOR: Document any regressions in PHASE_NOTES.md (Reflexion)           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Phase 6: Deployment (Day 10)

**Workflow:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 6 WORKFLOW (Approval Gate)                                              │
│                                                                              │
│ 1. CURSOR: Production build (Task 6.1) — verify no errors                     │
│ 2. CURSOR: mcp_task subagent_type=security-auditor — final audit             │
│ 3. HUMAN: APPROVAL GATE — "Ready to deploy to Firebase Hosting. Proceed?"    │
│ 4. CURSOR: firebase deploy (Task 6.3)                                        │
│ 5. HUMAN: Post-deployment verification (Task 6.4)                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Subagent Usage Matrix

| Subagent | When to Use | Phase |
|----------|--------------|-------|
| **verifier** | After each phase or major task; validates checklist, runs tests | All |
| **test-runner** | When adding/changing code; tests fail; need coverage | 1, 2, 3, 4, 5 |
| **debugger** | Build errors, runtime errors, test failures, unexpected behavior | All |
| **security-auditor** | Firestore/Storage rules, auth guards, before deploy | 2, 6 |
| **explore** | Need to find files, understand codebase structure | Any |
| **generalPurpose** | Multi-step research, complex questions | Any |
| **shell** | Git, npm, firebase CLI commands | All |

**Example Cursor prompts for subagents:**
- *"Launch the verifier agent to validate Phase 2 completion against IMPLEMENTATION_PLAN."*
- *"Run the test-runner agent — tests are failing in product.service.spec.ts."*
- *"Use the debugger agent to fix: 'Cannot read property of undefined' in admin-product-form."*
- *"Run security-auditor on firestore.rules before we deploy."*

---

## Skill Usage by Task

| Task / Area | Skill(s) | Why |
|-------------|----------|-----|
| Angular components, routing, signals | `@angular-20` | Modern patterns, @if/@for, standalone |
| Firestore, Auth, Storage, rules | `@firebase-angular` | Firebase + Angular patterns |
| Component tests (behavior) | `@angular-testing-library` | User-centric queries |
| Utils, services, reducers (unit) | `@jest-angular` | Jest setup, mocking |
| Any task | `@Documents/IMPLEMENTATION_PLAN.md` | Task details |
| Testing strategy | `@Documents/TESTING.md` | If exists |

**How to invoke:** In Cursor chat, type `@` and select the skill or document.

---

## Human-in-the-Loop Checkpoints

### Mode 1: Evaluator Flag (Simplest)

- **When:** Verifier or test-runner reports `needs_human_input: true` (e.g. ambiguous requirement).
- **Action:** Human clarifies in chat, Cursor resumes.

### Mode 2: Checkpoint-Based (Long Reviews)

| Checkpoint | Phase | Human Action |
|------------|-------|--------------|
| After Phase 1 | 1 | Run `ng serve`, verify homepage, Firebase init |
| After Phase 2 | 2 | Add product via Firestore Console, verify services |
| After Task 3.4 | 3 | Full product CRUD test in admin UI |
| After Phase 4 | 4 | Browse as customer, test WhatsApp links |
| After Phase 5 | 5 | Lighthouse + manual smoke test |

### Mode 3: Approval Gate (High-Risk)

| Gate | Action |
|------|--------|
| Deploy Firestore/Storage rules | Human confirms rules reviewed |
| Delete product implementation | Human confirms UX (confirmation modal) |
| Production deploy | Human explicitly approves `firebase deploy` |

---

## All Prompts Reference

Copy-paste these prompts into Cursor chat. Replace placeholders like `X.Y`, `N`, `[file]` as needed.

### Phase 1: Foundation

| Task | Prompt |
|------|--------|
| 1.1 | Implement Task 1.1 from @Documents/IMPLEMENTATION_PLAN.md: create Angular project with folder structure. Use @angular-20 skill. |
| 1.1b | Implement Task 1.1b: create utils and shared methods (formatPrice, formatPhoneForWhatsApp, validateWhatsAppNumber, validateEmail, validateImageFile, buildProductInquiryMessageText, slugify). Use @angular-20 skill. |
| 1.2 | Implement Task 1.2: install and configure Tailwind CSS with gold/cream/charcoal colors and Playfair Display + Inter fonts. Use @angular-20 and @musani-design-system skills. |
| 1.3–1.4 | Implement Tasks 1.3–1.4: set up Firebase project and AngularFire. Use @firebase-angular skill. Reference @Documents/IMPLEMENTATION_PLAN.md. |
| 1.5 | Implement Task 1.5: set up Angular Router with lazy-loaded public and admin modules. Use @angular-20 skill. |
| 1.6 | Implement Task 1.6: create Auth Guard for admin routes. Use @angular-20 and @firebase-angular skills. |
| 1.7 | Implement Task 1.7: create Navbar and Footer components. Use @angular-20 and @musani-design-system skills. |
| 1.8 | Implement Task 1.8: seed default categories in Firestore. Use @firebase-angular skill. |
| 1.9 | Implement Task 1.9: create README and project documentation. Use @Documents/IMPLEMENTATION_PLAN.md. |
| 1.10 | Implement Task 1.10: configure Jest + Angular Testing Library. Use @jest-angular and @angular-testing-library skills. Reference @Documents/TESTING.md if it exists. |

### Phase 2: Firebase Services

| Task | Prompt |
|------|--------|
| 2.1 | Implement Task 2.1: define TypeScript models (Product, Category, AppSettings, User). Use @firebase-angular skill. |
| 2.2 | Implement Task 2.2: implement Auth with NgRx Store (actions, reducer, effects, selectors). Use @angular-20 and @firebase-angular skills. |
| 2.3 | Implement Task 2.3: implement ProductService with full CRUD. Use @firebase-angular skill. Reference @Documents/IMPLEMENTATION_PLAN.md. |
| 2.4 | Implement Task 2.4: implement CategoryService. Use @firebase-angular skill. |
| 2.5 | Implement Task 2.5: implement ImageService with compression. Use @firebase-angular skill. |
| 2.6 | Implement Task 2.6: implement SettingsService. Use @firebase-angular skill. |
| 2.7 | Implement Task 2.7: implement WhatsAppService. Use @firebase-angular skill. |
| 2.8–2.9 | Implement Tasks 2.8–2.9: configure Firestore and Storage security rules. Use @firebase-angular skill. Reference @Documents/IMPLEMENTATION_PLAN.md. |
| 2.10 | Implement Task 2.10: set up NgRx Store for products, categories, auth. Use @angular-20 skill. |
| Tests | Add Jest unit tests for formatPrice, slugify, validateImageFile, buildProductInquiryMessageText per @Documents/TESTING.md. Use @jest-angular skill. |

### Phase 3: Admin Panel

| Task | Prompt |
|------|--------|
| 3.1 | Implement Task 3.1: Admin Login Page. Use @angular-20, @firebase-angular, and @musani-design-system skills. |
| 3.2 | Implement Task 3.2: Admin Dashboard with stats cards. Use @angular-20 and @musani-design-system skills. |
| 3.3 | Implement Task 3.3: Admin Products List with full CRUD. Use @angular-20 and @firebase-angular skills. |
| 3.4 | Implement Task 3.4: Admin Product Form with image upload. Use @angular-20, @firebase-angular, and @musani-design-system skills. Include delete confirmation modal. |
| 3.5 | Implement Task 3.5: Admin Categories management. Use @angular-20 and @firebase-angular skills. |
| 3.6 | Implement Task 3.6: Admin Settings page with WhatsApp config. Use @angular-20 and @firebase-angular skills. |
| Tests | Add Angular Testing Library component tests for admin forms. Use @angular-testing-library skill. Reference @Documents/TESTING.md. |

### Phase 4: Customer Pages

| Task | Prompt |
|------|--------|
| 4.1 | Implement Task 4.1: Home Page with hero and featured products. Use @angular-20 and @musani-design-system skills. |
| 4.2 | Implement Task 4.2: Product Card component. Use @angular-20 and @musani-design-system skills. |
| 4.3 | Implement Task 4.3: Shop / All Products Page. Use @angular-20 and @musani-design-system skills. |
| 4.4 | Implement Task 4.4: Category Page with filtered products. Use @angular-20 and @musani-design-system skills. |
| 4.5 | Implement Task 4.5: Product Detail Page with image gallery and color selection. Use @angular-20 and @musani-design-system skills. |
| 4.6 | Implement Task 4.6: Floating WhatsApp Button. Use @angular-20 and @musani-design-system skills. |
| Tests | Add component tests for ProductCard, ProductDetail, Shop pages. Use @angular-testing-library skill. |

### Phase 5: Polish & Performance

| Task | Prompt |
|------|--------|
| 5.1 | Implement Task 5.1: Mobile responsiveness testing and fixes. Use @angular-20 and @musani-design-system skills. |
| 5.2 | Implement Task 5.2: Image optimization (lazy load, compression). Use @angular-20 skill. |
| 5.3 | Implement Task 5.3: SEO optimization (meta tags, structured data). Use @angular-20 skill. |
| 5.4 | Run Lighthouse audit per Task 5.4. Report scores and suggest fixes. |
| 5.5 | Implement Task 5.5: Error handling and loading states. Use @angular-20 skill. |
| 5.6 | Implement Task 5.6: Accessibility audit and fixes. Use @angular-20 and @musani-design-system skills. |
| Tests | Ensure test coverage > 60%. Run @jest-angular and @angular-testing-library. |

### Phase 6: Deployment

| Task | Prompt |
|------|--------|
| 6.1 | Run production build per Task 6.1. Verify no errors. |
| 6.2 | Implement Task 6.2: Firebase Hosting setup. Use @firebase-angular skill. |
| 6.3 | Execute Task 6.3: Deploy to Firebase Hosting. (Human approval required before running.) |
| 6.4 | Execute Task 6.4: Post-deployment verification checklist. |

### Subagent Prompts

| Subagent | Prompt |
|----------|--------|
| Verifier | Launch the verifier agent to validate Phase N completion against @Documents/IMPLEMENTATION_PLAN.md. Run tests, check checklist, report findings. |
| Test-runner | Run the test-runner agent. Tests are failing in [file]. Fix failures while preserving test intent. |
| Test-runner (generic) | Run the test-runner agent. Run npm test, fix any failures, ensure coverage meets requirements. |
| Debugger | Use the debugger agent. Error: [paste error message]. Identify root cause, implement minimal fix, verify solution. |
| Security-auditor | Run security-auditor agent on firestore.rules and storage.rules. Report findings by severity with file paths and line references. |
| Explore | Use explore agent to find [what you need] in the codebase. Thoroughness: [quick/medium/very thorough]. |

### Generic / Reusable Prompts

| Use Case | Prompt |
|----------|--------|
| Implement any task | Implement Task X.Y from @Documents/IMPLEMENTATION_PLAN.md. Use @angular-20 for Angular, @firebase-angular for Firebase, @musani-design-system for UI. |
| Start a phase | I'm starting Phase N from @Documents/IMPLEMENTATION_PLAN.md. List the tasks and suggest the best order. Reference @Documents/AGENTIC_WORKFLOW_GUIDE.md. |
| Add phase notes | Add a Reflexion entry to @Documents/PHASE_NOTES.md for Phase N. Include: completed tasks, lessons learned, blockers resolved. |
| Pre-deploy checklist | Run through the Phase 6 and Success Criteria checklists from @Documents/IMPLEMENTATION_PLAN.md. Verify each item. |

---

## Recommended Slash Commands

These commands are created in `.cursor/commands/`. Type `/` in Cursor chat to see them. The filename becomes the command (e.g. `verify-phase.md` → `/verify-phase`).

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/implement-task` | Implement a task from IMPLEMENTATION_PLAN | Start any task — add task number in chat (e.g. "2.3") |
| `/verify-phase` | Run verifier agent for phase completion | After completing a phase — add phase number (e.g. "Phase 2") |
| `/run-tests` | Run test-runner, fix failures | Tests failing or before phase sign-off — optionally add file path |
| `/security-audit` | Run security-auditor on Firebase rules | Before deploying rules or going live |
| `/debug` | Run debugger agent | When you have an error — paste error message in chat |
| `/start-phase` | Begin a phase with full context | Start of each phase — add phase number |
| `/add-phase-notes` | Add Reflexion entry to PHASE_NOTES.md | After completing a phase — add phase number and date |

---

## Cursor Commands & Rules

### Suggested Cursor Rules (`.cursor/rules/` or project rules)

1. **Always reference IMPLEMENTATION_PLAN** when implementing tasks.
2. **Use skills** — `@angular-20` for Angular, `@firebase-angular` for Firebase, `@musani-design-system` for UI.
3. **Run verifier** after completing a phase.
4. **Run test-runner** when tests fail or before marking a task done.
5. **No deploy** without human approval.

### How to Use Slash Commands

1. Type `/` in Cursor's Agent or Chat input
2. Select a command from the dropdown (e.g. `/implement-task`)
3. Add context in your message (e.g. "Task 2.3" or "Phase 2" or paste error for `/debug`)

---

## Quick Reference

| Phase | Patterns | Subagents | Skills | Human Gate |
|------|-----------|------------|--------|------------|
| 1 | Code-as-Orchestrator, Checklist | verifier, test-runner | angular-20, firebase-angular | ng serve works |
| 2 | Tool Dispatch, Structured Output, Evaluator-Worker | verifier, test-runner, security-auditor | firebase-angular, jest-angular | Rules deploy |
| 3 | Planner-Executor, Human-in-the-Loop, Self-Correction | verifier, test-runner | angular-20, angular-testing-library | Product CRUD test |
| 4 | Code-as-Orchestrator, Guardrails | verifier, test-runner | angular-20 | Mobile review |
| 5 | Evals-in-the-Loop, Evaluator-Worker | verifier, test-runner | jest-angular, angular-testing-library | Lighthouse + smoke |
| 6 | Checklist, Approval Gate | verifier, security-auditor | firebase-angular | Production deploy |

---

## Reflexion: Phase Notes Template

After each phase, add to `Documents/PHASE_NOTES.md`:

```markdown
## Phase N — [Name] — [Date]

### Completed
- [x] Task X.Y
- [x] Task X.Z

### Lessons Learned
- [What went wrong and how we fixed it]
- [What to do differently next time]

### Blockers Resolved
- [Any blockers and resolutions]
```

This implements **Pattern 2: Reflexion** — lessons persist across sessions.

---

## Summary: Best Workflow

1. **Start each phase** with human reading IMPLEMENTATION_PLAN.
2. **Implement** using Cursor + skills (`@angular-20`, `@firebase-angular`, etc.).
3. **Pause at checkpoints** for human verification (Mode 2).
4. **Use approval gates** for destructive or deploy actions (Mode 3).
5. **Run verifier** after each phase.
6. **Run test-runner** when tests fail or before phase sign-off.
7. **Run security-auditor** before deploying rules or going live.
8. **Use debugger** when errors occur.
9. **Document lessons** in PHASE_NOTES.md (Reflexion).

This workflow combines **Code-as-Orchestrator** (you + Cursor control the flow), **Evaluator-Worker** (verifier/test-runner judge output), **Human-in-the-Loop** (checkpoints + approval gates), and **Constraint/Checklist Planning** (IMPLEMENTATION_PLAN + phase checklists).
