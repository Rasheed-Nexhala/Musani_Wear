import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { WhatsAppService } from '../../../services/whatsapp.service';
import { SettingsService } from '../../../services/settings.service';

/** Combined contact URLs for floating buttons. */
interface ContactUrls {
  whatsapp: string;
  call: string;
  instagram: string;
}

/**
 * Floating contact buttons (WhatsApp, Call, Instagram) shown on all pages.
 * Only renders when at least one contact is configured in app settings.
 */
@Component({
  selector: 'app-floating-whatsapp-button',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './floating-whatsapp-button.component.html',
})
export class FloatingWhatsAppButtonComponent {
  private readonly whatsAppService = inject(WhatsAppService);
  private readonly settingsService = inject(SettingsService);

  private readonly instagramUrl$ = this.settingsService.getSettings().pipe(
    map((s) => (s?.instagramUrl?.trim() ?? '') || ''),
    catchError(() => of(''))
  );

  protected readonly contactUrls$ = combineLatest([
    this.whatsAppService.generateGeneralInquiryUrl(),
    this.whatsAppService.getCallUrl(),
    this.instagramUrl$,
  ]).pipe(
    map(([whatsapp, call, instagram]) => ({ whatsapp, call, instagram } as ContactUrls))
  );
}
