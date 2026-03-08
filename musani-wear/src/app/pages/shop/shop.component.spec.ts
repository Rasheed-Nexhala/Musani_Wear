import { render, screen, fireEvent } from '@testing-library/angular';
import { provideRouter } from '@angular/router';
import { of, Subject } from 'rxjs';

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

import { ShopComponent } from './shop.component';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../models/Product';
import { Category } from '../../models/Category';

const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Summer Dress',
    description: 'Light dress',
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
  {
    id: 'p2',
    name: 'Evening Gown',
    description: 'Elegant gown',
    price: 4999,
    material: 'Silk',
    category: 'Evening',
    categoryId: 'cat-2',
    colors: [],
    images: [],
    featured: true,
    available: true,
    createdAt: null,
    updatedAt: null,
  },
];

const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Casual Wear', slug: 'casual-wear', description: '', order: 1 },
  { id: 'cat-2', name: 'Evening Wear', slug: 'evening-wear', description: '', order: 2 },
];

describe('ShopComponent', () => {
  const mockProductService = {
    getAllProducts: jest.fn().mockReturnValue(of(mockProducts)),
    getProductsByCategory: jest.fn().mockReturnValue(of(mockProducts)),
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
    mockProductService.getProductsByCategory.mockReturnValue(of(mockProducts));
    mockCategoryService.getAllCategories.mockReturnValue(of(mockCategories));
  });

  it('renders shop heading', async () => {
    await render(ShopComponent, { providers: defaultProviders });

    expect(screen.getByRole('heading', { name: /shop all products/i })).toBeInTheDocument();
  });

  it('renders category filter with All Products and category tabs', async () => {
    await render(ShopComponent, { providers: defaultProviders });

    expect(screen.getByRole('button', { name: /all products/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /casual wear/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /evening wear/i })).toBeInTheDocument();
  });

  it('shows loading state initially', async () => {
    const delayedProducts = new Subject<Product[]>();
    mockProductService.getAllProducts.mockReturnValue(delayedProducts.asObservable());
    await render(ShopComponent, { providers: defaultProviders });

    expect(screen.getByRole('status', { name: /loading products/i })).toBeInTheDocument();
    delayedProducts.next(mockProducts);
    delayedProducts.complete();
  });

  it('renders product grid when products load', async () => {
    await render(ShopComponent, { providers: defaultProviders });

    expect(screen.getByText('Summer Dress')).toBeInTheDocument();
    expect(screen.getByText('Evening Gown')).toBeInTheDocument();
  });

  it('calls getProductsByCategory when category filter is clicked', async () => {
    await render(ShopComponent, { providers: defaultProviders });

    fireEvent.click(screen.getByRole('button', { name: /casual wear/i }));

    expect(mockProductService.getProductsByCategory).toHaveBeenCalledWith('cat-1');
  });

  it('calls getAllProducts when All Products is clicked', async () => {
    await render(ShopComponent, { providers: defaultProviders });

    fireEvent.click(screen.getByRole('button', { name: /all products/i }));

    expect(mockProductService.getAllProducts).toHaveBeenCalled();
  });

  it('shows "No products found" when category has no products', async () => {
    mockProductService.getProductsByCategory.mockReturnValue(of([]));
    await render(ShopComponent, { providers: defaultProviders });

    fireEvent.click(screen.getByRole('button', { name: /casual wear/i }));

    expect(screen.getByText(/no products found/i)).toBeInTheDocument();
  });
});
