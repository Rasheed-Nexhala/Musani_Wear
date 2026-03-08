import {
  Component,
  inject,
  DestroyRef,
  signal,
  computed,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/Category';
import { slugify } from '../../../utils/slugify';
import { DeleteConfirmationModalComponent } from '../../../components/admin/delete-confirmation-modal/delete-confirmation-modal.component';
import { ContentLoaderComponent } from '../../../components/shared/content-loader/content-loader.component';
import { FocusTrapDirective } from '../../../directives/focus-trap.directive';

/**
 * Admin Categories: CRUD for product categories.
 * - Table: Name, Slug, Description, Actions (Edit, Delete)
 * - Modal: Add/Edit form with name, slug, description, order
 * - Delete: Uses delete-confirmation-modal (not confirm())
 */
@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    DeleteConfirmationModalComponent,
    ContentLoaderComponent,
    FocusTrapDirective,
  ],
  templateUrl: './admin-categories.component.html',
})
export class AdminCategoriesComponent {
  private readonly categoryService = inject(CategoryService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  /** Refresh trigger: increment to reload categories after create/update/delete. */
  private readonly refresh$ = new BehaviorSubject(0);

  categories$ = this.refresh$.pipe(
    switchMap(() =>
      this.categoryService.getAllCategories().pipe(
        catchError((err) => {
          console.error('Error fetching categories:', err);
          return of([] as Category[]);
        })
      )
    )
  );

  /** Whether the add/edit modal is visible. */
  showCategoryForm = signal(false);

  /** Category being edited, or null when adding. */
  editingCategory = signal<Category | null>(null);

  /** Whether save is in progress. */
  saving = signal(false);

  /** Error message to display. */
  errorMessage = signal('');

  /** Delete modal: category ID to delete, or null when closed. */
  categoryToDelete = signal<string | null>(null);

  /** Computed: is delete modal open. */
  deleteModalOpen = computed(() => this.categoryToDelete() !== null);

  categoryForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(1)]],
    slug: ['', [Validators.required, Validators.minLength(1)]],
    description: [''],
    order: [0, [Validators.required, Validators.min(0)]],
  });

  constructor() {
    this.categoryForm
      .get('name')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((name) => {
        if (!this.editingCategory() && name) {
          this.categoryForm.patchValue(
            { slug: slugify(name) },
            { emitEvent: false }
          );
        }
      });
  }

  /** Whether a form control is invalid and touched. */
  hasError(controlName: string): boolean {
    const c = this.categoryForm.get(controlName);
    return !!(c?.invalid && c?.touched);
  }

  /** Open modal for adding a new category. */
  addCategory(): void {
    this.editingCategory.set(null);
    this.categoryForm.reset({ name: '', slug: '', description: '', order: 0 });
    this.errorMessage.set('');
    this.showCategoryForm.set(true);
  }

  /** Open modal for editing an existing category. */
  editCategory(cat: Category): void {
    this.editingCategory.set(cat);
    this.categoryForm.patchValue({
      name: cat.name,
      slug: cat.slug,
      description: cat.description ?? '',
      order: cat.order ?? 0,
    });
    this.errorMessage.set('');
    this.showCategoryForm.set(true);
  }

  /** Close the add/edit modal and reset state. */
  closeCategoryForm(): void {
    this.showCategoryForm.set(false);
    this.editingCategory.set(null);
    this.categoryForm.reset({ name: '', slug: '', description: '', order: 0 });
    this.errorMessage.set('');
  }

  /** Save category: create or update based on editingCategory. */
  saveCategory(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set('');
    this.saving.set(true);

    const value = this.categoryForm.value;
    const payload = {
      name: value.name ?? '',
      slug: value.slug ?? '',
      description: value.description ?? '',
      order: Number(value.order) ?? 0,
    };

    const editing = this.editingCategory();

    if (editing?.id) {
      this.categoryService.updateCategory(editing.id, payload).subscribe({
        next: () => {
          this.saving.set(false);
          this.closeCategoryForm();
          this.refresh$.next(this.refresh$.value + 1);
        },
        error: (err) => {
          this.saving.set(false);
          this.errorMessage.set(err?.message ?? 'Failed to update category.');
        },
      });
    } else {
      this.categoryService.createCategory(payload).subscribe({
        next: () => {
          this.saving.set(false);
          this.closeCategoryForm();
          this.refresh$.next(this.refresh$.value + 1);
        },
        error: (err) => {
          this.saving.set(false);
          this.errorMessage.set(err?.message ?? 'Failed to create category.');
        },
      });
    }
  }

  /** Open delete confirmation modal for a category. */
  openDeleteModal(id: string): void {
    this.categoryToDelete.set(id);
  }

  /** Close delete modal. */
  closeDeleteModal(): void {
    this.categoryToDelete.set(null);
  }

  /** Called when user confirms delete in modal. */
  onDeleteConfirmed(): void {
    const id = this.categoryToDelete();
    if (!id) return;

    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.refresh$.next(this.refresh$.value + 1);
      },
      error: () => {
        this.errorMessage.set('Failed to delete category.');
        this.closeDeleteModal();
      },
    });
  }

  /** Called when user cancels delete. */
  onDeleteCancelled(): void {
    this.closeDeleteModal();
  }
}
