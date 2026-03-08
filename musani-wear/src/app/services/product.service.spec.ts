import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { ProductService } from './product.service';
import { Product } from '../models/Product';

const mockGetDocs = jest.fn();
const mockGetDoc = jest.fn();
const mockAddDoc = jest.fn();
const mockUpdateDoc = jest.fn();
const mockDeleteDoc = jest.fn();

const mockFirestore = {};

jest.mock('@angular/fire/firestore', () => ({
  Firestore: function MockFirestore() {},
  collection: jest.fn((_fs: unknown, _path: string) => ({ _path: 'products' })),
  doc: jest.fn((_fs: unknown, _col: string, id: string) => ({ _id: id })),
  getDocs: (...args: unknown[]) => mockGetDocs(...args),
  getDoc: (...args: unknown[]) => mockGetDoc(...args),
  addDoc: (...args: unknown[]) => mockAddDoc(...args),
  updateDoc: (...args: unknown[]) => mockUpdateDoc(...args),
  deleteDoc: (...args: unknown[]) => mockDeleteDoc(...args),
  query: jest.fn((...args: unknown[]) => ({ _query: args })),
  where: jest.fn((field: string, op: string, value: unknown) => ({ field, op, value })),
  orderBy: jest.fn((field: string, _dir?: string) => ({ field })),
  Timestamp: {
    now: () => ({ seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 }),
  },
}));

describe('ProductService', () => {
  let service: ProductService;

  const mockProductData = {
    name: 'Test Dress',
    description: 'A beautiful dress',
    price: 2499,
    material: 'Silk',
    category: 'Evening',
    categoryId: 'cat1',
    colors: [{ name: 'Red', hex: '#ff0000' }],
    images: ['url1'],
    featured: true,
    available: true,
    createdAt: null,
    updatedAt: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        { provide: Firestore, useValue: mockFirestore },
      ],
    });
    service = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllProducts', () => {
    it('should return products from Firestore', (done) => {
      const mockDocs = [
        { id: '1', data: () => ({ ...mockProductData, name: 'Dress 1' }) },
        { id: '2', data: () => ({ ...mockProductData, name: 'Dress 2' }) },
      ];
      mockGetDocs.mockResolvedValue({ docs: mockDocs });

      service.getAllProducts().subscribe({
        next: (products) => {
          expect(products).toHaveLength(2);
          expect(products[0].id).toBe('1');
          expect(products[0].name).toBe('Dress 1');
          expect(products[1].id).toBe('2');
          expect(products[1].name).toBe('Dress 2');
          done();
        },
        error: (err) => done.fail(err),
      });
    });

    it('should return empty array when no products', (done) => {
      mockGetDocs.mockResolvedValue({ docs: [] });

      service.getAllProducts().subscribe({
        next: (products) => {
          expect(products).toEqual([]);
          done();
        },
        error: (err) => done.fail(err),
      });
    });

    it('should propagate errors', (done) => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockGetDocs.mockRejectedValue(new Error('Network error'));

      service.getAllProducts().subscribe({
        next: () => {
          consoleSpy.mockRestore();
          done.fail('Should have errored');
        },
        error: (err) => {
          expect(err.message).toBe('Failed to fetch products');
          consoleSpy.mockRestore();
          done();
        },
      });
    });
  });

  describe('getProductById', () => {
    it('should return product when it exists', (done) => {
      mockGetDoc.mockResolvedValue({
        exists: () => true,
        id: 'prod-1',
        data: () => ({ ...mockProductData, name: 'Single Dress' }),
      });

      service.getProductById('prod-1').subscribe({
        next: (product) => {
          expect(product).not.toBeNull();
          expect(product!.id).toBe('prod-1');
          expect(product!.name).toBe('Single Dress');
          done();
        },
        error: (err) => done.fail(err),
      });
    });

    it('should return null when product does not exist', (done) => {
      mockGetDoc.mockResolvedValue({ exists: () => false });

      service.getProductById('nonexistent').subscribe({
        next: (product) => {
          expect(product).toBeNull();
          done();
        },
        error: (err) => done.fail(err),
      });
    });
  });

  describe('createProduct', () => {
    it('should return new document id', (done) => {
      mockAddDoc.mockResolvedValue({ id: 'new-doc-123' });

      service.createProduct(mockProductData as Omit<Product, 'id'>).subscribe({
        next: (id) => {
          expect(id).toBe('new-doc-123');
          expect(mockAddDoc).toHaveBeenCalled();
          const callPayload = mockAddDoc.mock.calls[0][1] as Record<string, unknown>;
          expect(callPayload.name).toBe('Test Dress');
          expect(callPayload.createdAt).toBeDefined();
          expect(callPayload.updatedAt).toBeDefined();
          done();
        },
        error: (err) => done.fail(err),
      });
    });
  });

  describe('updateProduct', () => {
    it('should call updateDoc with payload and updatedAt', (done) => {
      mockUpdateDoc.mockResolvedValue(undefined);

      service.updateProduct('prod-1', { name: 'Updated Name' }).subscribe({
        next: () => {
          expect(mockUpdateDoc).toHaveBeenCalled();
          const callPayload = mockUpdateDoc.mock.calls[0][1] as Record<string, unknown>;
          expect(callPayload.name).toBe('Updated Name');
          expect(callPayload.updatedAt).toBeDefined();
          expect(callPayload.id).toBeUndefined();
          done();
        },
        error: (err) => done.fail(err),
      });
    });
  });

  describe('deleteProduct', () => {
    it('should call deleteDoc', (done) => {
      mockDeleteDoc.mockResolvedValue(undefined);

      service.deleteProduct('prod-1').subscribe({
        next: () => {
          expect(mockDeleteDoc).toHaveBeenCalled();
          done();
        },
        error: (err) => done.fail(err),
      });
    });
  });
});
