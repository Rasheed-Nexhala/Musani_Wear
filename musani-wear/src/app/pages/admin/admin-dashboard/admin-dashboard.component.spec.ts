import { render, screen } from '@testing-library/angular';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

jest.mock('@angular/fire/auth', () => ({
  Auth: {},
  authState: () => of(null),
  getAuth: () => ({}),
}));
jest.mock('@angular/fire/firestore', () => ({
  Firestore: {},
  collection: () => ({}),
  getDocs: () => Promise.resolve({ docs: [], empty: true }),
}));

import { AdminDashboardComponent } from './admin-dashboard.component';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Product } from '../../../models/Product';
import { Category } from '../../../models/Category';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Test Dress',
    description: 'A test dress',
    price: 2999,
    material: 'Silk',
    category: 'Evening',
    categoryId: 'cat-1',
    colors: [],
    images: [],
    featured: true,
    available: true,
    createdAt: null,
    updatedAt: null,
  },
  {
    id: '2',
    name: 'Out of Stock Dress',
    description: 'Unavailable',
    price: 1999,
    material: 'Cotton',
    category: 'Casual',
    categoryId: 'cat-1',
    colors: [],
    images: [],
    featured: false,
    available: false,
    createdAt: null,
    updatedAt: null,
  },
];

const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Evening Wear', slug: 'evening-wear', description: '', order: 1 },
];

describe('AdminDashboardComponent', () => {
  const mockProductService = {
    getAllProducts: jest.fn().mockReturnValue(of(mockProducts)),
  };

  const mockCategoryService = {
    getAllCategories: jest.fn().mockReturnValue(of(mockCategories)),
  };

  const defaultProviders = [
    provideRouter([]),
    { provide: ProductService, useValue: mockProductService },
    { provide: CategoryService, useValue: mockCategoryService },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockProductService.getAllProducts.mockReturnValue(of(mockProducts));
    mockCategoryService.getAllCategories.mockReturnValue(of(mockCategories));
  });

  it('renders dashboard heading', async () => {
    await render(AdminDashboardComponent, { providers: defaultProviders });

    expect(screen.getByRole('heading', { name: /admin dashboard/i })).toBeInTheDocument();
  });

  it('renders stats cards for total products, in stock, out of stock, categories', async () => {
    await render(AdminDashboardComponent, { providers: defaultProviders });

    expect(screen.getByText('Total Products')).toBeInTheDocument();
    expect(screen.getAllByText(/in stock/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/out of stock/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Categories')).toBeInTheDocument();
  });

  it('renders quick action links', async () => {
    await render(AdminDashboardComponent, { providers: defaultProviders });

    expect(screen.getByRole('link', { name: /view products/i })).toHaveAttribute(
      'href',
      '/admin/products'
    );
    expect(screen.getByRole('link', { name: /add product/i })).toHaveAttribute(
      'href',
      '/admin/products/new'
    );
    expect(screen.getByRole('link', { name: /manage categories/i })).toHaveAttribute(
      'href',
      '/admin/categories'
    );
    expect(screen.getByRole('link', { name: /settings/i })).toHaveAttribute(
      'href',
      '/admin/settings'
    );
  });

  it('renders recent products section', async () => {
    await render(AdminDashboardComponent, { providers: defaultProviders });

    expect(screen.getByRole('heading', { name: /recent products/i })).toBeInTheDocument();
    expect(screen.getByText('Test Dress')).toBeInTheDocument();
  });
});
