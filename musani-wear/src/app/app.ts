import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { FloatingWhatsAppButtonComponent } from './components/shared/floating-whatsapp-button/floating-whatsapp-button.component';
import { SeedService } from './services/seed.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, FloatingWhatsAppButtonComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly seedService = inject(SeedService);

  protected readonly title = signal('musani-wear');

  ngOnInit(): void {
    this.seedService.seedCategories().catch((err) => {
      console.error('Failed to seed categories:', err);
    });
  }
}
