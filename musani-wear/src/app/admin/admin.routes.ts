import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('../pages/admin/admin-login/admin-login.component').then(
        (m) => m.AdminLoginComponent
      ),
  },
  {
    path: '',
    loadComponent: () =>
      import('../pages/admin/admin-dashboard/admin-dashboard.component').then(
        (m) => m.AdminDashboardComponent
      ),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('../pages/admin/admin-products/admin-products.component').then(
        (m) => m.AdminProductsComponent
      ),
  },
  {
    path: 'products/new',
    loadComponent: () =>
      import('../pages/admin/admin-product-form/admin-product-form.component').then(
        (m) => m.AdminProductFormComponent
      ),
  },
  {
    path: 'products/:id/edit',
    loadComponent: () =>
      import('../pages/admin/admin-product-form/admin-product-form.component').then(
        (m) => m.AdminProductFormComponent
      ),
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('../pages/admin/admin-categories/admin-categories.component').then(
        (m) => m.AdminCategoriesComponent
      ),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('../pages/admin/admin-settings/admin-settings.component').then(
        (m) => m.AdminSettingsComponent
      ),
  },
];
