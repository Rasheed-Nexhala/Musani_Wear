import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  Timestamp,
} from '@angular/fire/firestore';
import { Observable, from, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import { AppSettings } from '../models/AppSettings';

const SETTINGS_COLLECTION = 'settings';
const SETTINGS_DOC_ID = 'app';

/**
 * SettingsService: Firestore-backed read/update for app settings.
 * Uses a single document at settings/app.
 * All methods return Observables; uses from() to convert Firestore Promises.
 */
@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly firestore = inject(Firestore);

  /** Get app settings. Returns null if document does not exist. */
  getSettings(): Observable<AppSettings | null> {
    const docRef = doc(this.firestore, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    return from(getDoc(docRef)).pipe(
      map((docSnap) => {
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() } as AppSettings;
        }
        return null;
      }),
      catchError((error) => {
        console.error('Error fetching settings:', error);
        return throwError(() => new Error('Failed to fetch settings'));
      })
    );
  }

  /**
   * Update app settings. Merges with existing data and sets updatedAt to Timestamp.now().
   * Uses updateDoc when document exists; setDoc with merge when it doesn't.
   */
  updateSettings(settings: Partial<AppSettings>): Observable<void> {
    const docRef = doc(this.firestore, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    const payload: Record<string, unknown> = {
      ...settings,
      updatedAt: Timestamp.now(),
    };
    delete payload['id'];

    return from(getDoc(docRef)).pipe(
      switchMap((snap) =>
        snap.exists()
          ? from(updateDoc(docRef, payload))
          : from(setDoc(docRef, payload, { merge: true }))
      ),
      catchError((error) => {
        console.error('Error updating settings:', error);
        return throwError(() => new Error('Failed to update settings'));
      })
    );
  }
}
