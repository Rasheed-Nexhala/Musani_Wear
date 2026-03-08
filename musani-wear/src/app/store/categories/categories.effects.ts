import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import {
  loadCategories,
  loadCategoriesSuccess,
  loadCategoriesFailure,
} from './categories.actions';
import { CategoryService } from '../../services/category.service';

@Injectable()
export class CategoriesEffects {
  private readonly actions$ = inject(Actions);
  private readonly categoryService = inject(CategoryService);

  /** Load all categories via CategoryService.getAllCategories(). */
  loadCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCategories),
      switchMap(() =>
        this.categoryService.getAllCategories().pipe(
          map((categories) => loadCategoriesSuccess({ categories })),
          catchError((err) =>
            of(loadCategoriesFailure({ error: err?.message ?? 'Failed to fetch categories' }))
          )
        )
      )
    )
  );
}
