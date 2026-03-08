import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `<p>Page not found.</p> <a routerLink="/">Go home</a>`,
})
export class NotFoundComponent {}
