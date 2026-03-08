import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SettingsService } from '../../../services/settings.service';
import { ContentLoaderComponent } from '../../../components/shared/content-loader/content-loader.component';

/**
 * Admin Settings Page
 *
 * Manages business settings (name, WhatsApp, email, phone). Loads existing
 * settings in ngOnInit and patches the form. On save, updates Firestore via
 * SettingsService.
 *
 * State is held in signals so Angular always re-renders correctly, even when
 * Firestore callbacks run outside Zone.js.
 */
@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ContentLoaderComponent],
  templateUrl: './admin-settings.component.html',
})
export class AdminSettingsComponent implements OnInit {
  private readonly settingsService = inject(SettingsService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  /** True while the save request is in-flight. */
  readonly saving = signal(false);

  /** True while the initial settings fetch is in-flight. */
  readonly loadingSettings = signal(true);

  /** Set when the initial fetch fails; cleared on retry. */
  readonly loadError = signal<string | null>(null);

  /** Set after a successful save; cleared when the user starts saving again. */
  readonly successMessage = signal('');

  /** Set when the save request fails; cleared on next save attempt. */
  readonly errorMessage = signal<string | null>(null);

  readonly settingsForm = this.fb.nonNullable.group({
    businessName: ['', Validators.required],
    whatsappNumber: ['', Validators.required],
    businessEmail: ['', [Validators.required, Validators.email]],
    businessPhone: ['', Validators.required],
    instagramUrl: [''],
  });

  ngOnInit(): void {
    this.loadSettings();
  }

  private loadSettings(): void {
    this.loadingSettings.set(true);
    this.loadError.set(null);
    this.settingsService
      .getSettings()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (settings) => {
          if (settings) {
            this.settingsForm.patchValue({
              businessName: settings.businessName,
              whatsappNumber: settings.whatsappNumber,
              businessEmail: settings.businessEmail,
              businessPhone: settings.businessPhone,
              instagramUrl: settings.instagramUrl ?? '',
            });
          }
          this.loadingSettings.set(false);
        },
        error: (err: { message?: string }) => {
          this.loadError.set(err?.message ?? 'Failed to load settings. Please try again.');
          this.loadingSettings.set(false);
        },
      });
  }

  retryLoad(): void {
    this.loadSettings();
  }

  onSave(): void {
    if (this.settingsForm.invalid) {
      this.settingsForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.successMessage.set('');
    this.errorMessage.set(null);

    this.settingsService
      .updateSettings(this.settingsForm.getRawValue())
      .subscribe({
        next: () => {
          this.successMessage.set('Settings saved successfully.');
          this.errorMessage.set(null);
          this.saving.set(false);
        },
        error: (err: { message?: string }) => {
          this.errorMessage.set(err?.message ?? 'Failed to save settings. Please try again.');
          this.saving.set(false);
        },
      });
  }
}
