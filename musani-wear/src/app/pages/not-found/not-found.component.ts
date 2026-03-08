import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16" id="main">
      <h1 class="text-2xl md:text-4xl font-display font-bold text-charcoal mb-4 text-center">
        Page Not Found
      </h1>
      <p class="text-charcoal/80 font-body text-lg mb-8 text-center max-w-md">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <div class="flex flex-wrap gap-4 justify-center">
        <a
          routerLink="/"
          class="inline-flex items-center justify-center px-6 py-3 bg-gold text-charcoal font-semibold rounded-full hover:opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 min-h-[48px]"
        >
          Go to Home
        </a>
        <a
          routerLink="/shop"
          class="inline-flex items-center justify-center px-6 py-3 border-2 border-charcoal text-charcoal font-semibold rounded-full hover:bg-charcoal hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 min-h-[48px]"
        >
          Browse Shop
        </a>
      </div>
    </main>
  `,
})
export class NotFoundComponent implements OnInit {
  private readonly seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.setPageTitle('Page Not Found - Musani Wear');
  }
}
