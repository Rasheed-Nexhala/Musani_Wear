import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { WhatsAppService } from '../../../services/whatsapp.service';

/**
 * Floating WhatsApp button shown on all pages.
 * Only renders when a WhatsApp number is configured in app settings.
 */
@Component({
  selector: 'app-floating-whatsapp-button',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './floating-whatsapp-button.component.html',
})
export class FloatingWhatsAppButtonComponent {
  protected readonly whatsappUrl$ = inject(WhatsAppService).generateGeneralInquiryUrl();
}
