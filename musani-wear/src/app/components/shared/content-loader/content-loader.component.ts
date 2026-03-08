import { Component, input } from '@angular/core';

/**
 * Standard centered content loader (spinner + optional message).
 * Use for page sections that load async data (tables, forms, single-item views).
 * For product grids, use LoadingSkeletonComponent instead.
 *
 * Accessibility: role="status" and aria-label for screen readers.
 */
@Component({
  selector: 'app-content-loader',
  standalone: true,
  template: `
    <div
      class="flex flex-col items-center justify-center gap-4 py-12"
      role="status"
      [attr.aria-label]="label()"
    >
      <div
        class="w-12 h-12 rounded-full border-2 border-border border-t-gold animate-spin"
        aria-hidden="true"
      ></div>
      @if (message()) {
        <p class="text-charcoal font-body">{{ message() }}</p>
      }
    </div>
  `,
})
export class ContentLoaderComponent {
  /** Aria-label for screen readers. Default: "Loading" */
  readonly label = input<string>('Loading');

  /** Optional message shown below spinner. */
  readonly message = input<string>('');
}
