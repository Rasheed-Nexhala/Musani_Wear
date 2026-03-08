import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  template: `<p>Admin Product Form ({{ isEdit ? 'Edit' : 'New' }})</p>`,
})
export class AdminProductFormComponent {
  protected get isEdit(): boolean {
    return !!this.route.snapshot.paramMap.get('id');
  }

  constructor(private readonly route: ActivatedRoute) {}
}
