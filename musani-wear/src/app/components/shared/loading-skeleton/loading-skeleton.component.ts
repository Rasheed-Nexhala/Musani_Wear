import { Component, input } from '@angular/core';

/**
 * Reusable loading skeleton that mimics product grid layout.
 * Each card: image placeholder (aspect-[3/4]), title bar, price bar.
 * Uses animate-pulse and design tokens (bg-border, rounded-lg).
 */
@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  template: `
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      role="status"
      aria-label="Loading products"
    >
      @for (i of skeletonCount; track i) {
        <div class="bg-white rounded-lg overflow-hidden shadow-sm">
          <!-- Image placeholder (3:4 aspect ratio, matches product card) -->
          <div
            class="aspect-[3/4] bg-border animate-pulse rounded-t-lg"
            aria-hidden="true"
          ></div>
          <!-- Content placeholder -->
          <div class="p-4 space-y-2">
            <div class="h-4 bg-border animate-pulse rounded w-3/4" aria-hidden="true"></div>
            <div class="h-4 bg-border animate-pulse rounded w-1/2" aria-hidden="true"></div>
            <div class="h-6 bg-border animate-pulse rounded w-1/3 mt-2" aria-hidden="true"></div>
          </div>
        </div>
      }
    </div>
  `,
})
export class LoadingSkeletonComponent {
  /** Number of skeleton cards to display. Default: 4. */
  readonly count = input<number>(4);

  /** Internal array for @for loop. */
  protected get skeletonCount(): number[] {
    return Array.from({ length: this.count() }, (_, i) => i);
  }
}
