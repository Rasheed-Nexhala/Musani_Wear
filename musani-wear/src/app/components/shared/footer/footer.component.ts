import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Placeholder WhatsApp number until SettingsService (Phase 2) provides store contact. */
const PLACEHOLDER_WHATSAPP = 'https://wa.me/919876543210';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  readonly whatsappLink = PLACEHOLDER_WHATSAPP;
}
