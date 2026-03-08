import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  template: `<p>Product: {{ id }}</p>`,
})
export class ProductDetailComponent {
  constructor(private readonly route: ActivatedRoute) {}

  protected get id(): string {
    return this.route.snapshot.paramMap.get('id') ?? '';
  }
}
