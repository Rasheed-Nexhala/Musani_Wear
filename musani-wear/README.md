# Musani Wear - Development Guide

Musani Wear is an Angular e-commerce boutique website for dress showcase and admin management, built with Angular 20+, Firebase, and Tailwind CSS.

## Prerequisites

- **Node.js** 18+ and npm
- **Angular CLI** 20+
- **Firebase CLI**
- **Git**

## Setup Instructions

1. **Clone repository**
   ```bash
   git clone <repo-url>
   cd musani-wear
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Copy `src/environments/environment.example.ts` to `src/environments/environment.ts`
   - Add your Firebase config values (see `.env.example` for variable names)
   - Optionally copy to `environment.prod.ts` for production

4. **Run development server**
   ```bash
   ng serve
   ```

5. **Open browser** to [http://localhost:4200](http://localhost:4200)

## Folder Structure

```
src/
├── app/
│   ├── pages/           # Page components (home, shop, category, product-detail, admin)
│   ├── components/      # Reusable presentational components (navbar, footer)
│   ├── services/        # Firebase services (auth, seed, data layer)
│   ├── models/          # TypeScript interfaces
│   ├── guards/          # Route guards (admin)
│   ├── store/           # NgRx state (actions, reducers, effects, selectors)
│   ├── utils/           # Pure functions (format, validate, parse)
│   └── shared/          # Shared constants, helpers used across components
├── environments/        # Firebase config (environment.ts, environment.prod.ts)
└── styles.css           # Global Tailwind styles
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `ng serve` | Start development server |
| `ng build` | Build for development |
| `ng build --configuration production` | Production build |
| `ng test` | Run unit tests |
| `ng e2e` | Run end-to-end tests |
| `firebase deploy` | Deploy to Firebase Hosting |

## Firebase Rules

Security rules for Firestore and Storage are defined in `firebase.json` and `firestore.rules` (or `storage.rules`). Ensure rules are configured before deploying to production.

## Code Scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component:

```bash
ng generate component component-name
```

For a complete list of available schematics (components, directives, pipes, etc.):

```bash
ng generate --help
```

## Additional Resources

- [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli)
- [Firebase Console](https://console.firebase.google.com)
