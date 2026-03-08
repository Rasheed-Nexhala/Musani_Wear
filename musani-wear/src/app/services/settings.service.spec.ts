import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { SettingsService } from './settings.service';
import { AppSettings } from '../models/AppSettings';

const mockGetDoc = jest.fn();
const mockSetDoc = jest.fn();
const mockUpdateDoc = jest.fn();

const mockFirestore = {};

jest.mock('@angular/fire/firestore', () => ({
  Firestore: function MockFirestore() {},
  doc: jest.fn((_fs: unknown, _col: string, id: string) => ({ _id: id })),
  getDoc: (...args: unknown[]) => mockGetDoc(...args),
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
  updateDoc: (...args: unknown[]) => mockUpdateDoc(...args),
  Timestamp: {
    now: () => ({ seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 }),
  },
}));

describe('SettingsService', () => {
  let service: SettingsService;

  const mockSettingsData: Omit<AppSettings, 'id'> = {
    businessName: 'Musani Wear',
    whatsappNumber: '+919876543210',
    businessEmail: 'hello@musaniwear.com',
    businessPhone: '+919876543210',
    updatedAt: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        SettingsService,
        { provide: Firestore, useValue: mockFirestore },
      ],
    });
    service = TestBed.inject(SettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getSettings', () => {
    it('should return settings when document exists', (done) => {
      mockGetDoc.mockResolvedValue({
        exists: () => true,
        id: 'app',
        data: () => ({ ...mockSettingsData }),
      });

      service.getSettings().subscribe({
        next: (settings) => {
          expect(settings).not.toBeNull();
          expect(settings!.id).toBe('app');
          expect(settings!.businessName).toBe('Musani Wear');
          expect(settings!.whatsappNumber).toBe('+919876543210');
          done();
        },
        error: (err) => done.fail(err),
      });
    });

    it('should return null when document does not exist', (done) => {
      mockGetDoc.mockResolvedValue({ exists: () => false });

      service.getSettings().subscribe({
        next: (settings) => {
          expect(settings).toBeNull();
          done();
        },
        error: (err) => done.fail(err),
      });
    });

    it('should propagate errors', (done) => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockGetDoc.mockRejectedValue(new Error('Network error'));

      service.getSettings().subscribe({
        next: () => {
          consoleSpy.mockRestore();
          done.fail('Should have errored');
        },
        error: (err) => {
          expect(err.message).toBe('Failed to fetch settings');
          consoleSpy.mockRestore();
          done();
        },
      });
    });
  });

  describe('updateSettings', () => {
    it('should call updateDoc when document exists', (done) => {
      mockGetDoc.mockResolvedValue({ exists: () => true });
      mockUpdateDoc.mockResolvedValue(undefined);

      service.updateSettings({ businessName: 'Updated Name' }).subscribe({
        next: () => {
          expect(mockGetDoc).toHaveBeenCalled();
          expect(mockUpdateDoc).toHaveBeenCalled();
          expect(mockSetDoc).not.toHaveBeenCalled();
          const payload = mockUpdateDoc.mock.calls[0][1] as Record<string, unknown>;
          expect(payload.businessName).toBe('Updated Name');
          expect(payload.updatedAt).toBeDefined();
          expect(payload.id).toBeUndefined();
          done();
        },
        error: (err) => done.fail(err),
      });
    });

    it('should call setDoc with merge when document does not exist', (done) => {
      mockGetDoc.mockResolvedValue({ exists: () => false });
      mockSetDoc.mockResolvedValue(undefined);

      service.updateSettings({ businessName: 'New Settings' }).subscribe({
        next: () => {
          expect(mockGetDoc).toHaveBeenCalled();
          expect(mockSetDoc).toHaveBeenCalled();
          expect(mockUpdateDoc).not.toHaveBeenCalled();
          const setDocArgs = mockSetDoc.mock.calls[0];
          expect(setDocArgs[2]).toEqual({ merge: true });
          const payload = setDocArgs[1] as Record<string, unknown>;
          expect(payload.businessName).toBe('New Settings');
          expect(payload.updatedAt).toBeDefined();
          expect(payload.id).toBeUndefined();
          done();
        },
        error: (err) => done.fail(err),
      });
    });

    it('should propagate errors', (done) => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockGetDoc.mockResolvedValue({ exists: () => true });
      mockUpdateDoc.mockRejectedValue(new Error('Permission denied'));

      service.updateSettings({ businessName: 'Test' }).subscribe({
        next: () => {
          consoleSpy.mockRestore();
          done.fail('Should have errored');
        },
        error: (err) => {
          expect(err.message).toBe('Failed to update settings');
          consoleSpy.mockRestore();
          done();
        },
      });
    });
  });
});
