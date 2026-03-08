import { render, screen } from '@testing-library/angular';
import { provideRouter } from '@angular/router';

import { ProductCardComponent } from './product-card.component';
import { Product } from '../../../models/Product';

const mockProduct: Product = {
  id: 'p1',
  name: 'Summer Silk Dress',
  description: 'Elegant summer dress',
  price: 2999,
  material: 'Silk',
  category: 'Evening',
  categoryId: 'cat-1',
  colors: [
    { name: 'Navy', hex: '#1e3a5f' },
    { name: 'Blush', hex: '#f4c2c2' },
  ],
  images: ['https://example.com/dress.jpg'],
  featured: true,
  available: true,
  createdAt: null,
  updatedAt: null,
};

describe('ProductCardComponent', () => {
  const defaultProviders = [provideRouter([])];

  it('renders product name and price', async () => {
    await render(ProductCardComponent, {
      providers: defaultProviders,
      componentProperties: {
        product: mockProduct,
        categoryName: 'Evening Wear',
      },
    });

    expect(screen.getByText('Summer Silk Dress')).toBeInTheDocument();
    expect(screen.getByText('₹2,999')).toBeInTheDocument();
  });

  it('renders category name when provided', async () => {
    await render(ProductCardComponent, {
      providers: defaultProviders,
      componentProperties: {
        product: mockProduct,
        categoryName: 'Evening Wear',
      },
    });

    expect(screen.getByText('Evening Wear')).toBeInTheDocument();
  });

  it('does not render category when categoryName is empty', async () => {
    await render(ProductCardComponent, {
      providers: defaultProviders,
      componentProperties: {
        product: mockProduct,
        categoryName: '',
      },
    });

    expect(screen.queryByText('Evening Wear')).not.toBeInTheDocument();
  });

  it('renders product image when images exist', async () => {
    await render(ProductCardComponent, {
      providers: defaultProviders,
      componentProperties: {
        product: mockProduct,
        categoryName: '',
      },
    });

    const img = screen.getByRole('img', { name: 'Summer Silk Dress' });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/dress.jpg');
  });

  it('renders "No image" placeholder when product has no images', async () => {
    const productNoImages = { ...mockProduct, images: [] };
    await render(ProductCardComponent, {
      providers: defaultProviders,
      componentProperties: {
        product: productNoImages,
        categoryName: '',
      },
    });

    expect(screen.getByText('No image')).toBeInTheDocument();
  });

  it('renders "Out of Stock" overlay when product is unavailable', async () => {
    const outOfStockProduct = { ...mockProduct, available: false };
    await render(ProductCardComponent, {
      providers: defaultProviders,
      componentProperties: {
        product: outOfStockProduct,
        categoryName: '',
      },
    });

    expect(screen.getByLabelText('Out of stock')).toBeInTheDocument();
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });

  it('renders color swatches when product has colors', async () => {
    await render(ProductCardComponent, {
      providers: defaultProviders,
      componentProperties: {
        product: mockProduct,
        categoryName: '',
      },
    });

    expect(screen.getByLabelText('Color: Navy')).toBeInTheDocument();
    expect(screen.getByLabelText('Color: Blush')).toBeInTheDocument();
  });

  it('links to product detail page', async () => {
    await render(ProductCardComponent, {
      providers: defaultProviders,
      componentProperties: {
        product: mockProduct,
        categoryName: '',
      },
    });

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/product/p1');
  });
});
