import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { CategoryService } from './category.service';
import { Category } from '../models/Category';

const mockGetDocs = jest.fn();
const mockGetDoc = jest.fn();
const mockAddDoc = jest.fn();
const mockUpdateDoc = jest.fn();
const mockDeleteDoc = jest.fn();

const mockFirestore = {};

jest.mock('@angular/fire/firestore', () => ({
  Firestore: function MockFirestore() {},
  collection: jest.fn((_fs: unknown, _path: string) => ({ _path: 'categories' })),
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

describe('CategoryService', () => {
  let service: CategoryService;

  const mockCategoryData = {
    name: 'Evening Wear',
    slug: 'evening-wear',
    description: 'Elegant evening dresses',
    order: 1,
    createdAt: null,
    updatedAt: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        CategoryService,
        { provide: Firestore, useValue: mockFirestore },
      ],
    });
    service = TestBed.inject(CategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllCategories', () => {
    it('should return categories ordered by order field', (done) => {
      const mockDocs = [
        { id: '1', data: () => ({ ...mockCategoryData, name: 'Category 1', order: 1 }) },
        { id: '2', data: () => ({ ...mockCategoryData, name: 'Category 2', order: 2 }) },
      ];
      mockGetDocs.mockResolvedValue({ docs: mockDocs });

      service.getAllCategories().subscribe({
        next: (categories) => {
          expect(categories).toHaveLength(2);
          expect(categories[0].id).toBe('1');
          expect(categories[0].name).toBe('Category 1');
          expect(categories[1].id).toBe('2');
          expect(categories[1].name).toBe('Category 2');
          done();
        },
        error: (err) => done.fail(err),
      });
    });

    it('should return empty array when no categories', (done) => {
      mockGetDocs.mockResolvedValue({ docs: [] });

      service.getAllCategories().subscribe({
        next: (categories) => {
          expect(categories).toEqual([]);
          done();
        },
        error: (err) => done.fail(err),
      });
    });

    it('should propagate errors', (done) => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockGetDocs.mockRejectedValue(new Error('Network error'));

      service.getAllCategories().subscribe({
        next: () => {
          consoleSpy.mockRestore();
          done.fail('Should have errored');
        },
        error: (err) => {
          expect(err.message).toBe('Failed to fetch categories');
          consoleSpy.mockRestore();
          done();
        },
      });
    });
  });

  describe('getCategoryById', () => {
    it('should return category when it exists', (done) => {
      mockGetDoc.mockResolvedValue({
        exists: () => true,
        id: 'cat-1',
        data: () => ({ ...mockCategoryData, name: 'Single Category' }),
      });

      service.getCategoryById('cat-1').subscribe({
        next: (category) => {
          expect(category).not.toBeNull();
          expect(category!.id).toBe('cat-1');
          expect(category!.name).toBe('Single Category');
          done();
        },
        error: (err) => done.fail(err),
      });
    });

    it('should return null when category does not exist', (done) => {
      mockGetDoc.mockResolvedValue({ exists: () => false });

      service.getCategoryById('nonexistent').subscribe({
        next: (category) => {
          expect(category).toBeNull();
          done();
        },
        error: (err) => done.fail(err),
      });
    });
  });

  describe('getCategoryBySlug', () => {
    it('should return category when slug exists', (done) => {
      const mockDocs = [
        { id: 'cat-1', data: () => ({ ...mockCategoryData, slug: 'evening-wear' }) },
      ];
      mockGetDocs.mockResolvedValue({ docs: mockDocs, empty: false });

      service.getCategoryBySlug('evening-wear').subscribe({
        next: (category) => {
          expect(category).not.toBeNull();
          expect(category!.id).toBe('cat-1');
          expect(category!.slug).toBe('evening-wear');
          done();
        },
        error: (err) => done.fail(err),
      });
    });

    it('should return null when slug does not exist', (done) => {
      mockGetDocs.mockResolvedValue({ docs: [], empty: true });

      service.getCategoryBySlug('nonexistent-slug').subscribe({
        next: (category) => {
          expect(category).toBeNull();
          done();
        },
        error: (err) => done.fail(err),
      });
    });
  });

  describe('createCategory', () => {
    it('should return new document id', (done) => {
      mockAddDoc.mockResolvedValue({ id: 'new-cat-123' });

      service.createCategory(mockCategoryData as Omit<Category, 'id'>).subscribe({
        next: (id) => {
          expect(id).toBe('new-cat-123');
          expect(mockAddDoc).toHaveBeenCalled();
          const callPayload = mockAddDoc.mock.calls[0][1] as Record<string, unknown>;
          expect(callPayload.name).toBe('Evening Wear');
          expect(callPayload.slug).toBe('evening-wear');
          expect(callPayload.createdAt).toBeDefined();
          expect(callPayload.updatedAt).toBeDefined();
          done();
        },
        error: (err) => done.fail(err),
      });
    });
  });

  describe('updateCategory', () => {
    it('should call updateDoc with payload and updatedAt', (done) => {
      mockUpdateDoc.mockResolvedValue(undefined);

      service.updateCategory('cat-1', { name: 'Updated Name' }).subscribe({
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

  describe('deleteCategory', () => {
    it('should call deleteDoc', (done) => {
      mockDeleteDoc.mockResolvedValue(undefined);

      service.deleteCategory('cat-1').subscribe({
        next: () => {
          expect(mockDeleteDoc).toHaveBeenCalled();
          done();
        },
        error: (err) => done.fail(err),
      });
    });
  });
});
