import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-category',
  standalone: true,
  template: `<p>Category: {{ slug }}</p>`,
})
export class CategoryComponent {
  constructor(private readonly route: ActivatedRoute) {}

  protected get slug(): string {
    return this.route.snapshot.paramMap.get('slug') ?? '';
  }
}
