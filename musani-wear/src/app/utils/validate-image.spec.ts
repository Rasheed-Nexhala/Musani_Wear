import { validateImageFile } from './validate-image';
import { MAX_IMAGE_SIZE_BYTES } from '../shared/constants';

describe('validateImageFile', () => {
  const createMockFile = (type: string, size: number): File =>
    Object.assign(new Blob(['x'.repeat(size)], { type }), {
      name: 'test.jpg',
      lastModified: Date.now(),
    }) as File;

  it('returns valid for allowed JPEG type within size limit', () => {
    const file = createMockFile('image/jpeg', 1024);
    expect(validateImageFile(file)).toEqual({ valid: true });
  });

  it('returns valid for allowed PNG type within size limit', () => {
    const file = createMockFile('image/png', 2048);
    expect(validateImageFile(file)).toEqual({ valid: true });
  });

  it('returns valid for allowed WebP type within size limit', () => {
    const file = createMockFile('image/webp', 1024);
    expect(validateImageFile(file)).toEqual({ valid: true });
  });

  it('returns valid for allowed GIF type within size limit', () => {
    const file = createMockFile('image/gif', 1024);
    expect(validateImageFile(file)).toEqual({ valid: true });
  });

  it('returns valid for image/jpg (alias) within size limit', () => {
    const file = createMockFile('image/jpg', 1024);
    expect(validateImageFile(file)).toEqual({ valid: true });
  });

  it('returns invalid with error for disallowed file type', () => {
    const file = createMockFile('application/pdf', 1024);
    const result = validateImageFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid file type');
    expect(result.error).toContain('Allowed');
  });

  it('returns invalid with error when file exceeds size limit', () => {
    const file = createMockFile('image/jpeg', MAX_IMAGE_SIZE_BYTES + 1);
    const result = validateImageFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('File size exceeds');
    expect(result.error).toContain('MB limit');
  });

  it('returns valid when file size equals limit', () => {
    const file = createMockFile('image/jpeg', MAX_IMAGE_SIZE_BYTES);
    expect(validateImageFile(file)).toEqual({ valid: true });
  });
});
