import { Directive, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Traps keyboard focus within the host element (e.g. modal dialog).
 * When active, Tab cycles through focusable elements; Shift+Tab cycles backward.
 * Restores focus to the previously focused element when the directive is destroyed.
 *
 * Use on modals that are conditionally rendered (@if). When the modal is removed,
 * focus is restored to the element that had focus before the modal opened.
 *
 * Usage:
 *   @if (isOpen()) {
 *     <div appFocusTrap role="dialog" ...>...</div>
 *   }
 */
@Directive({
  selector: '[appFocusTrap]',
  standalone: true,
})
export class FocusTrapDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private previousActive: HTMLElement | null = null;

  ngOnInit(): void {
    this.previousActive = document.activeElement as HTMLElement | null;
    const focusables = this.getFocusables();
    if (focusables.length > 0) {
      focusables[0].focus();
    }
    this.el.nativeElement.addEventListener('keydown', this.handleKeydown);
  }

  private handleKeydown = (e: KeyboardEvent): void => {
    if (e.key !== 'Tab') return;
    const focusables = this.getFocusables();
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  private getFocusables(): HTMLElement[] {
    const host = this.el.nativeElement;
    const nodes = host.querySelectorAll(FOCUSABLE_SELECTOR);
    return Array.from(nodes).filter(
      (el): el is HTMLElement =>
        el instanceof HTMLElement &&
        !el.hasAttribute('disabled') &&
        el.offsetParent !== null
    );
  }

  ngOnDestroy(): void {
    this.el.nativeElement.removeEventListener('keydown', this.handleKeydown);
    if (this.previousActive?.focus) {
      this.previousActive.focus();
    }
    this.previousActive = null;
  }
}
