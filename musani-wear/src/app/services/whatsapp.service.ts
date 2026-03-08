import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { formatPhoneForWhatsApp } from '../utils/format-phone';
import { buildProductInquiryMessageText } from '../utils/build-whatsapp-message';
import { Product } from '../models/Product';
import { SettingsService } from './settings.service';

const WA_ME_BASE = 'https://wa.me/';

/**
 * WhatsAppService: Builds wa.me URLs for chat and product inquiries.
 * Uses formatPhoneForWhatsApp for phone formatting and buildProductInquiryMessageText for inquiry messages.
 */
@Injectable({
  providedIn: 'root',
})
export class WhatsAppService {
  private readonly settingsService = inject(SettingsService);

  /**
   * Returns a wa.me URL with optional pre-filled message.
   *
   * @param phoneNumber - E.164 format (e.g. +919876543210) or digits only
   * @param message - Optional pre-filled message (URL-encoded automatically)
   * @returns Full wa.me URL, e.g. https://wa.me/919876543210?text=Hello
   *
   * @example
   * getWhatsAppUrl('+919876543210')                    // "https://wa.me/919876543210"
   * getWhatsAppUrl('+919876543210', 'Hi there')       // "https://wa.me/919876543210?text=Hi%20there"
   */
  getWhatsAppUrl(phoneNumber: string, message?: string): string {
    const formatted = formatPhoneForWhatsApp(phoneNumber.trim());
    const base = `${WA_ME_BASE}${formatted}`;
    if (message?.trim()) {
      return `${base}?text=${encodeURIComponent(message.trim())}`;
    }
    return base;
  }

  /**
   * Returns a wa.me URL for a product inquiry.
   * When phoneNumber is provided: returns string synchronously.
   * When phoneNumber is omitted: fetches business WhatsApp from SettingsService and returns Observable.
   *
   * @param product - Product to inquire about (name and id used for message)
   * @param color - Optional color/variant the customer is interested in
   * @param phoneNumber - Optional; when omitted, uses whatsappNumber from app settings
   * @returns wa.me URL string, or Observable<string> when phone must be fetched from settings
   *
   * @example
   * // With phone provided (sync)
   * getProductInquiryUrl(product, 'Blue', '+919876543210')
   *
   * // Without phone (async - uses settings)
   * getProductInquiryUrl(product, 'Blue').subscribe(url => window.open(url))
   */
  /**
   * Returns a wa.me URL for general inquiries (e.g. from Home page CTA).
   * Fetches business WhatsApp from SettingsService and uses a generic message.
   *
   * @returns Observable of full wa.me URL, or empty string if no phone configured
   */
  generateGeneralInquiryUrl(): Observable<string> {
    const message = "Hi! I'm interested in your collections. Could you help me?";
    return this.settingsService.getSettings().pipe(
      map((settings) => {
        const phone = settings?.whatsappNumber?.trim() ?? '';
        return phone ? this.getWhatsAppUrl(phone, message) : '';
      })
    );
  }

  getProductInquiryUrl(
    product: Product,
    color?: string,
    phoneNumber?: string
  ): string | Observable<string> {
    const productForInquiry = {
      name: product.name,
      id: product.id ?? '',
    };
    const message = buildProductInquiryMessageText(productForInquiry, color);

    if (phoneNumber?.trim()) {
      return this.getWhatsAppUrl(phoneNumber.trim(), message);
    }

    return this.settingsService.getSettings().pipe(
      map((settings) => {
        const phone = settings?.whatsappNumber?.trim() ?? '';
        return phone ? this.getWhatsAppUrl(phone, message) : '';
      })
    );
  }
}
