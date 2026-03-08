import { Component, input, output } from '@angular/core';

/**
 * Reusable error display component following Musani design system.
 * Shows a styled error message with optional retry button.
 *
 * Design: bg-error/10, border-error, text-error per design system.
 * Error Banner pattern: role="alert", aria-live="polite" for accessibility.
 */
@Component({
  selector: 'app-error-display',
  standalone: true,
  template: `
    @if (error()) {
    <div
      role="alert"
      aria-live="polite"
      class="rounded-lg border-l-4 border-error bg-error/10 p-4 text-error"
    >
      <p class="font-body font-medium">{{ error() }}</p>
      @if (showRetry()) {
        <button
          type="button"
          (click)="retry.emit()"
          class="mt-4 inline-flex items-center justify-center gap-2 bg-error text-white hover:opacity-90 px-4 py-2 rounded-full font-body font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2 min-h-[44px] min-w-[44px]"
          aria-label="Retry"
        >
          Retry
        </button>
      }
    </div>
    }
  `,
})
export class ErrorDisplayComponent {
  /** Error message to display. When null/undefined, component shows nothing. */
  readonly error = input<string | null>(null);

  /** Whether to show the retry button. Default: true when retry output is used. */
  readonly showRetry = input<boolean>(true);

  /** Emitted when user clicks Retry. Parent should re-fetch data. */
  readonly retry = output<void>();
}
