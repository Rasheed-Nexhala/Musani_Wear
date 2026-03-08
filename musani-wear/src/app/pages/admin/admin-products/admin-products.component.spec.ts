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

import { AdminProductsComponent } from './admin-products.component';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Product } from '../../../models/Product';
import { Category } from '../../../models/Category';

const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Summer Dress',
    description: 'Light summer dress',
    price: 1999,
    material: 'Cotton',
    category: 'Casual',
    categoryId: 'cat-1',
    colors: [],
    images: [],
    featured: false,
    available: true,
    createdAt: null,
    updatedAt: null,
  },
];

const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Casual Wear', slug: 'casual-wear', description: '', order: 1 },
];

describe('AdminProductsComponent', () => {
  const mockProductService = {
    getAllProducts: jest.fn().mockReturnValue(of(mockProducts)),
    deleteProduct: jest.fn(),
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
  });

  it('renders products table with heading', async () => {
    await render(AdminProductsComponent, { providers: defaultProviders });

    expect(screen.getByRole('heading', { name: /products/i })).toBeInTheDocument();
  });

  it('renders add product link', async () => {
    await render(AdminProductsComponent, { providers: defaultProviders });

    const addLink = screen.getByRole('link', { name: /add product/i });
    expect(addLink).toBeInTheDocument();
    expect(addLink).toHaveAttribute('href', '/admin/products/new');
  });

  it('renders product table with columns', async () => {
    await render(AdminProductsComponent, { providers: defaultProviders });

    expect(screen.getByRole('columnheader', { name: /image/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /category/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /price/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /status/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /actions/i })).toBeInTheDocument();
  });

  it('renders product rows with product name', async () => {
    await render(AdminProductsComponent, { providers: defaultProviders });

    expect(screen.getByText('Summer Dress')).toBeInTheDocument();
  });
});
