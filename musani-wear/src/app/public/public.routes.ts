import { Routes } from '@angular/router';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'shop',
    loadComponent: () =>
      import('../pages/shop/shop.component').then((m) => m.ShopComponent),
  },
  {
    path: 'category/:slug',
    loadComponent: () =>
      import('../pages/category/category.component').then(
        (m) => m.CategoryComponent
      ),
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('../pages/product-detail/product-detail.component').then(
        (m) => m.ProductDetailComponent
      ),
  },
];
