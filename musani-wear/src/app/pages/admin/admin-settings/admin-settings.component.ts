import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SettingsService } from '../../../services/settings.service';

/**
 * Admin Settings Page
 *
 * Manages business settings (name, WhatsApp, email, phone). Loads existing
 * settings in ngOnInit and patches the form. On save, updates Firestore via
 * SettingsService.
 */
@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-settings.component.html',
})
export class AdminSettingsComponent implements OnInit {
  private readonly settingsService = inject(SettingsService);
  private readonly fb = inject(FormBuilder);

  /** True while updateSettings request is in flight */
  loading = false;

  /** Shown after successful save */
  successMessage = '';

  /** Inline error message when update fails (replaces alert). */
  errorMessage: string | null = null;

  readonly settingsForm = this.fb.nonNullable.group({
    businessName: ['', Validators.required],
    whatsappNumber: ['', Validators.required],
    businessEmail: ['', [Validators.required, Validators.email]],
    businessPhone: ['', Validators.required],
  });

  ngOnInit(): void {
    this.settingsService.getSettings().subscribe((settings) => {
      if (settings) {
        this.settingsForm.patchValue({
          businessName: settings.businessName,
          whatsappNumber: settings.whatsappNumber,
          businessEmail: settings.businessEmail,
          businessPhone: settings.businessPhone,
        });
      }
    });
  }

  onSave(): void {
    if (this.settingsForm.invalid) {
      this.settingsForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = null;

    this.settingsService
      .updateSettings(this.settingsForm.getRawValue())
      .subscribe({
        next: () => {
          this.successMessage = 'Settings saved successfully.';
          this.errorMessage = null;
        },
        error: (err: { message?: string }) => {
          this.errorMessage = err?.message ?? 'Failed to save settings. Please try again.';
        },
        complete: () => {
          this.loading = false;
        },
      });
  }
}
