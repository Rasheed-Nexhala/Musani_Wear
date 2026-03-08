import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { Product } from '../models/Product';

const mockGetSettings = jest.fn();

jest.mock('@angular/fire/firestore', () => ({
  Firestore: function MockFirestore() {},
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  Timestamp: { now: () => ({ seconds: 0, nanoseconds: 0 }) },
}));

import { WhatsAppService } from './whatsapp.service';
import { SettingsService } from './settings.service';

describe('WhatsAppService', () => {
  let service: WhatsAppService;

  const mockProduct: Product = {
    id: 'p1',
    name: 'Floral Dress',
    description: 'A beautiful dress',
    price: 2499,
    material: 'Silk',
    category: 'Evening',
    categoryId: 'cat1',
    colors: [{ name: 'Blue', hex: '#0000ff' }],
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
        WhatsAppService,
        {
          provide: SettingsService,
          useValue: { getSettings: mockGetSettings },
        },
      ],
    });
    service = TestBed.inject(WhatsAppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getWhatsAppUrl', () => {
    it('should return wa.me URL without message when message is omitted', () => {
      const url = service.getWhatsAppUrl('+919876543210');
      expect(url).toBe('https://wa.me/919876543210');
    });

    it('should strip leading plus from phone number', () => {
      const url = service.getWhatsAppUrl('+919876543210');
      expect(url).toContain('wa.me/919876543210');
      expect(url).not.toContain('+');
    });

    it('should handle phone without plus prefix', () => {
      const url = service.getWhatsAppUrl('919876543210');
      expect(url).toBe('https://wa.me/919876543210');
    });

    it('should append encoded message when provided', () => {
      const url = service.getWhatsAppUrl('+919876543210', 'Hi there!');
      expect(url).toBe('https://wa.me/919876543210?text=Hi%20there!');
    });

    it('should URL-encode special characters in message', () => {
      const url = service.getWhatsAppUrl('+919876543210', 'Hello & goodbye?');
      expect(url).toContain('wa.me/919876543210');
      expect(url).toContain('text=');
      expect(decodeURIComponent(url.split('text=')[1])).toBe('Hello & goodbye?');
    });

    it('should trim whitespace from phone and message', () => {
      const url = service.getWhatsAppUrl('  +919876543210  ', '  Hello  ');
      expect(url).toBe('https://wa.me/919876543210?text=Hello');
    });
  });

  describe('getProductInquiryUrl (with phoneNumber)', () => {
    it('should return wa.me URL with product inquiry message', () => {
      const url = service.getProductInquiryUrl(
        mockProduct,
        undefined,
        '+919876543210'
      ) as string;
      expect(url).toContain('https://wa.me/919876543210');
      expect(url).toContain('text=');
      expect(decodeURIComponent(url.split('text=')[1])).toContain(
        "Hi! I'm interested in: Floral Dress (ID: p1)"
      );
    });

    it('should include color in message when provided', () => {
      const url = service.getProductInquiryUrl(
        mockProduct,
        'Blue',
        '+919876543210'
      ) as string;
      expect(decodeURIComponent(url.split('text=')[1])).toContain(
        "Hi! I'm interested in: Floral Dress (ID: p1) - Color: Blue"
      );
    });

    it('should handle product without id', () => {
      const productNoId = { ...mockProduct, id: undefined };
      const url = service.getProductInquiryUrl(
        productNoId,
        undefined,
        '+919876543210'
      ) as string;
      expect(decodeURIComponent(url.split('text=')[1])).toContain(
        "Hi! I'm interested in: Floral Dress (ID: )"
      );
    });
  });

  describe('getProductInquiryUrl (without phoneNumber - uses SettingsService)', () => {
    it('should return Observable that emits wa.me URL using settings whatsappNumber', (done) => {
      mockGetSettings.mockReturnValue(
        of({
          id: 'app',
          businessName: 'Musani Wear',
          whatsappNumber: '+919876543210',
          businessEmail: 'hello@musaniwear.com',
          businessPhone: '+919876543210',
          updatedAt: null,
        })
      );

      const result = service.getProductInquiryUrl(mockProduct, 'Red');
      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Observable);

      (result as Observable<string>).subscribe({
        next: (url: string) => {
          expect(url).toContain('https://wa.me/919876543210');
          expect(url).toContain('text=');
          expect(decodeURIComponent(url.split('text=')[1])).toContain(
            "Hi! I'm interested in: Floral Dress (ID: p1) - Color: Red"
          );
          expect(mockGetSettings).toHaveBeenCalled();
          done();
        },
        error: (err) => done.fail(err),
      });
    });

    it('should return empty string when settings has no whatsappNumber', (done) => {
      mockGetSettings.mockReturnValue(
        of({
          id: 'app',
          businessName: 'Musani Wear',
          whatsappNumber: '',
          businessEmail: 'hello@musaniwear.com',
          businessPhone: '+919876543210',
          updatedAt: null,
        })
      );

      const result = service.getProductInquiryUrl(mockProduct);
      (result as Observable<string>).subscribe({
        next: (url: string) => {
          expect(url).toBe('');
          done();
        },
        error: (err) => done.fail(err),
      });
    });

    it('should return empty string when settings is null', (done) => {
      mockGetSettings.mockReturnValue(of(null));

      const result = service.getProductInquiryUrl(mockProduct);
      (result as Observable<string>).subscribe({
        next: (url: string) => {
          expect(url).toBe('');
          done();
        },
        error: (err) => done.fail(err),
      });
    });
  });
});
