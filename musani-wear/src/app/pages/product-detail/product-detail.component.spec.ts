import { render, screen, fireEvent } from '@testing-library/angular';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
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

import { ProductDetailComponent } from './product-detail.component';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { WhatsAppService } from '../../services/whatsapp.service';
import { Product } from '../../models/Product';

const mockProduct: Product = {
  id: 'p1',
  name: 'Elegant Evening Gown',
  description: 'A stunning evening gown',
  price: 4999,
  material: 'Silk',
  category: 'Evening',
  categoryId: 'cat-1',
  colors: [
    { name: 'Black', hex: '#000000' },
    { name: 'Red', hex: '#cc0000' },
  ],
  images: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
  featured: true,
  available: true,
  createdAt: null,
  updatedAt: null,
};

describe('ProductDetailComponent', () => {
  const mockProductService = {
    getProductById: jest.fn().mockReturnValue(of(mockProduct)),
  };

  const mockCategoryService = {
    getCategoryById: jest.fn().mockReturnValue(of({ id: 'cat-1', name: 'Evening Wear', slug: 'evening-wear', description: '', order: 1 })),
  };

  const mockWhatsAppService = {
    getProductInquiryUrl: jest.fn().mockReturnValue(of('https://wa.me/919876543210?text=Hi')),
  };

  const defaultProviders = [
    provideRouter([]),
    {
      provide: ActivatedRoute,
      useValue: {
        params: of({ id: 'p1' }),
      },
    },
    { provide: ProductService, useValue: mockProductService },
    { provide: CategoryService, useValue: mockCategoryService },
    { provide: WhatsAppService, useValue: mockWhatsAppService },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockProductService.getProductById.mockReturnValue(of(mockProduct));
    mockCategoryService.getCategoryById.mockReturnValue(of({ id: 'cat-1', name: 'Evening Wear', slug: 'evening-wear', description: '', order: 1 }));
    mockWhatsAppService.getProductInquiryUrl.mockReturnValue(of('https://wa.me/919876543210?text=Hi'));
  });

  it('renders loading state initially before product loads', async () => {
    const delayedProduct = new Subject<Product | null>();
    mockProductService.getProductById.mockReturnValue(delayedProduct.asObservable());
    await render(ProductDetailComponent, { providers: defaultProviders });

    expect(screen.getByText(/loading product/i)).toBeInTheDocument();
    delayedProduct.complete();
  });

  it('renders product name and price when product loads', async () => {
    await render(ProductDetailComponent, { providers: defaultProviders });

    expect(screen.getByRole('heading', { name: /elegant evening gown/i })).toBeInTheDocument();
    expect(screen.getByText('₹4,999')).toBeInTheDocument();
  });

  it('renders breadcrumb links to Home and Shop', async () => {
    await render(ProductDetailComponent, { providers: defaultProviders });

    expect(screen.getByRole('link', { name: /^home$/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /^shop$/i })).toHaveAttribute('href', '/shop');
  });

  it('renders WhatsApp inquiry button', async () => {
    await render(ProductDetailComponent, { providers: defaultProviders });

    const whatsappLink = screen.getByRole('link', { name: /ask availability on whatsapp/i });
    expect(whatsappLink).toBeInTheDocument();
    expect(whatsappLink).toHaveAttribute('href', 'https://wa.me/919876543210?text=Hi');
  });

  it('calls setSelectedColor when color button is clicked', async () => {
    await render(ProductDetailComponent, { providers: defaultProviders });

    const blackColorButton = screen.getByLabelText(/select color black/i);
    fireEvent.click(blackColorButton);

    expect(screen.getByText(/selected: black/i)).toBeInTheDocument();
  });

  it('switches displayed image when thumbnail is clicked', async () => {
    await render(ProductDetailComponent, { providers: defaultProviders });

    const thumbnail2 = screen.getByLabelText(/view image 2/i);
    fireEvent.click(thumbnail2);

    const mainImgs = screen.getAllByRole('img', { name: /elegant evening gown/i });
    const mainImg = mainImgs.find((img) => !img.getAttribute('alt')?.includes('thumbnail'));
    expect(mainImg).toBeDefined();
    expect(mainImg).toHaveAttribute('src', 'https://example.com/img2.jpg');
  });

  it('renders "Product not found" when product does not exist', async () => {
    mockProductService.getProductById.mockReturnValue(of(null));
    await render(ProductDetailComponent, { providers: defaultProviders });

    expect(screen.getByRole('heading', { name: /product not found/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to shop/i })).toHaveAttribute('href', '/shop');
  });

  it('renders In Stock badge when product is available', async () => {
    await render(ProductDetailComponent, { providers: defaultProviders });

    expect(screen.getByText('In Stock')).toBeInTheDocument();
  });

  it('renders Out of Stock badge when product is unavailable', async () => {
    const outOfStockProduct = { ...mockProduct, available: false };
    mockProductService.getProductById.mockReturnValue(of(outOfStockProduct));
    await render(ProductDetailComponent, { providers: defaultProviders });

    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });
});
