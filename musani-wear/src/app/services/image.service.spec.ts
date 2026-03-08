import { TestBed } from '@angular/core/testing';
import { Storage } from '@angular/fire/storage';
import { ImageService } from './image.service';

const mockRef = jest.fn();
const mockUploadBytes = jest.fn();
const mockGetDownloadURL = jest.fn();
const mockDeleteObject = jest.fn();

jest.mock('@angular/fire/storage', () => ({
  Storage: function MockStorage() {},
  ref: (...args: unknown[]) => mockRef(...args),
  uploadBytes: (...args: unknown[]) => mockUploadBytes(...args),
  getDownloadURL: (...args: unknown[]) => mockGetDownloadURL(...args),
  deleteObject: (...args: unknown[]) => mockDeleteObject(...args),
}));

jest.mock('browser-image-compression', () => ({
  __esModule: true,
  default: jest.fn((file: File) => Promise.resolve(file)),
}));

describe('ImageService', () => {
  let service: ImageService;
  const mockStorage = {};

  const createValidImageFile = (name = 'test.jpg', size = 1024): File => {
    const blob = new Blob(['x'.repeat(size)], { type: 'image/jpeg' });
    return new File([blob], name, { type: 'image/jpeg' });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockRef.mockReturnValue({ _path: 'products/prod-1/test.jpg' });
    mockUploadBytes.mockResolvedValue(undefined);
    mockGetDownloadURL.mockResolvedValue('https://storage.example.com/products/prod-1/test.jpg');

    TestBed.configureTestingModule({
      providers: [ImageService, { provide: Storage, useValue: mockStorage }],
    });
    service = TestBed.inject(ImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('uploadProductImage', () => {
    it('should validate, compress, upload, and return download URL', (done) => {
      const file = createValidImageFile();

      service.uploadProductImage(file, 'prod-123').subscribe({
        next: (url) => {
          expect(url).toBe('https://storage.example.com/products/prod-1/test.jpg');
          expect(mockRef).toHaveBeenCalled();
          expect(mockUploadBytes).toHaveBeenCalled();
          expect(mockGetDownloadURL).toHaveBeenCalled();
          done();
        },
        error: (err) => done.fail(err),
      });
    });

    it('should reject invalid file type', (done) => {
      const invalidFile = new File(['x'], 'doc.pdf', { type: 'application/pdf' });

      service.uploadProductImage(invalidFile, 'prod-1').subscribe({
        next: () => done.fail('Should have errored'),
        error: (err) => {
          expect(err.message).toContain('Invalid file type');
          expect(mockUploadBytes).not.toHaveBeenCalled();
          done();
        },
      });
    });

    it('should reject file exceeding size limit', (done) => {
      const hugeFile = createValidImageFile('big.jpg', 6 * 1024 * 1024);

      service.uploadProductImage(hugeFile, 'prod-1').subscribe({
        next: () => done.fail('Should have errored'),
        error: (err) => {
          expect(err.message).toContain('exceeds');
          expect(mockUploadBytes).not.toHaveBeenCalled();
          done();
        },
      });
    });

    it('should propagate upload errors', (done) => {
      const file = createValidImageFile();
      mockUploadBytes.mockRejectedValueOnce(new Error('Storage quota exceeded'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      service.uploadProductImage(file, 'prod-1').subscribe({
        next: () => {
          consoleSpy.mockRestore();
          done.fail('Should have errored');
        },
        error: (err) => {
          expect(err.message).toBeDefined();
          consoleSpy.mockRestore();
          done();
        },
      });
    });
  });

  describe('deleteImage', () => {
    it('should delete image by URL', (done) => {
      const url = 'https://firebasestorage.googleapis.com/v0/b/bucket/o/products%2Fprod-1%2Fimg.jpg?alt=media';
      mockDeleteObject.mockResolvedValue(undefined);

      service.deleteImage(url).subscribe({
        next: () => {
          expect(mockRef).toHaveBeenCalledWith(mockStorage, url);
          expect(mockDeleteObject).toHaveBeenCalled();
          done();
        },
        error: (err) => done.fail(err),
      });
    });

    it('should reject empty URL', (done) => {
      service.deleteImage('').subscribe({
        next: () => done.fail('Should have errored'),
        error: (err) => {
          expect(err.message).toContain('Invalid image URL');
          expect(mockDeleteObject).not.toHaveBeenCalled();
          done();
        },
      });
    });

    it('should reject non-string URL', (done) => {
      service.deleteImage(null as unknown as string).subscribe({
        next: () => done.fail('Should have errored'),
        error: (err) => {
          expect(err.message).toContain('Invalid image URL');
          done();
        },
      });
    });

    it('should propagate delete errors', (done) => {
      const url = 'https://storage.example.com/products/prod-1/img.jpg';
      mockDeleteObject.mockRejectedValueOnce(new Error('Object not found'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      service.deleteImage(url).subscribe({
        next: () => {
          consoleSpy.mockRestore();
          done.fail('Should have errored');
        },
        error: (err) => {
          expect(err.message).toBeDefined();
          consoleSpy.mockRestore();
          done();
        },
      });
    });
  });
});
