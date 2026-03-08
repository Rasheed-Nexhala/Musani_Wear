import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  doc,
  getDoc,
  setDoc,
  Timestamp,
} from '@angular/fire/firestore';
import { Observable, from, throwError, TimeoutError } from 'rxjs';
import { map, catchError, timeout, shareReplay, tap } from 'rxjs/operators';

import { AppSettings } from '../models/AppSettings';

/**
 * Max ms to wait for a Firestore response before treating it as an error.
 * Reduced from 10s → 5s so users see feedback sooner on slow connections.
 */
const FIRESTORE_TIMEOUT_MS = 5_000;

const SETTINGS_COLLECTION = 'settings';
const SETTINGS_DOC_ID = 'app';

/**
 * SettingsService: Firestore-backed read/update for app settings.
 * Uses a single document at settings/app.
 *
 * Settings are cached after the first fetch using shareReplay(1), so multiple
 * components (Footer, FloatingButton, AdminSettings) all share one network
 * request instead of each firing their own.
 */
@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly firestore = inject(Firestore);

  /**
   * In-memory cache of the settings Observable.
   * - Set on first call to getSettings().
   * - Cleared on error → allows retryLoad() to re-fetch.
   * - Cleared after updateSettings() → next read gets fresh data.
   */
  private settingsCache$: Observable<AppSettings | null> | null = null;

  /**
   * Returns app settings, fetching from Firestore only on the first call.
   * All subsequent callers share the cached result via shareReplay(1).
   * Returns null if the settings document does not exist yet.
   */
  getSettings(): Observable<AppSettings | null> {
    if (!this.settingsCache$) {
      const docRef = doc(this.firestore, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
      this.settingsCache$ = from(getDoc(docRef)).pipe(
        timeout(FIRESTORE_TIMEOUT_MS),
        map((docSnap) => {
          if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as AppSettings;
          }
          return null;
        }),
        catchError((error) => {
          // Clear the cache so the next getSettings() call retries the fetch
          // instead of replaying the same error.
          this.settingsCache$ = null;
          const message =
            error instanceof TimeoutError
              ? 'Settings request timed out. Check your connection.'
              : 'Failed to fetch settings';
          console.error('Error fetching settings:', error);
          return throwError(() => new Error(message));
        }),
        shareReplay(1),
      );
    }
    return this.settingsCache$;
  }

  /**
   * Update app settings. Uses setDoc with merge:true which creates the document
   * if it doesn't exist, or merges into it if it does — no pre-check needed.
   * Invalidates the settings cache after a successful save so the next
   * getSettings() call fetches the updated values from Firestore.
   */
  updateSettings(settings: Partial<AppSettings>): Observable<void> {
    const docRef = doc(this.firestore, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    const payload: Record<string, unknown> = {
      ...settings,
      updatedAt: Timestamp.now(),
    };
    delete payload['id'];

    return from(setDoc(docRef, payload, { merge: true })).pipe(
      timeout(FIRESTORE_TIMEOUT_MS),
      tap(() => {
        this.settingsCache$ = null;
      }),
      catchError((error) => {
        const message =
          error instanceof TimeoutError
            ? 'Save timed out. Check your connection and try again.'
            : 'Failed to update settings';
        console.error('Error updating settings:', error);
        return throwError(() => new Error(message));
      }),
    );
  }
}
