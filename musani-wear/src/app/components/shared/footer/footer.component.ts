import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { WhatsAppService } from '../../../services/whatsapp.service';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, AsyncPipe],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  private readonly whatsAppService = inject(WhatsAppService);
  private readonly settingsService = inject(SettingsService);

  readonly currentYear = new Date().getFullYear();
  readonly whatsappUrl$ = this.whatsAppService.generateGeneralInquiryUrl();
  readonly instagramUrl$ = this.settingsService.getSettings().pipe(
    map((s) => (s?.instagramUrl?.trim() ?? '') || ''),
    catchError(() => of(''))
  );
}
