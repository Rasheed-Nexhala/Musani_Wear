import { Component, input, output } from '@angular/core';
import { FocusTrapDirective } from '../../../directives/focus-trap.directive';

/**
 * Reusable delete confirmation modal.
 * Shows overlay with modal containing title, message, and Confirm/Cancel buttons.
 * Traps focus when open; Escape key closes.
 */
@Component({
  selector: 'app-delete-confirmation-modal',
  standalone: true,
  imports: [FocusTrapDirective],
  templateUrl: './delete-confirmation-modal.component.html',
})
export class DeleteConfirmationModalComponent {
  /** Whether the modal is visible. */
  isOpen = input.required<boolean>();

  /** Modal title (e.g. "Delete Product"). */
  title = input.required<string>();

  /** Modal message (e.g. "Are you sure you want to delete this product?"). */
  message = input.required<string>();

  /** Emitted when user confirms. */
  confirmed = output<void>();

  /** Emitted when user cancels. */
  cancelled = output<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  /** Prevent click from closing overlay when clicking modal content. */
  onModalClick(event: Event): void {
    event.stopPropagation();
  }
}
