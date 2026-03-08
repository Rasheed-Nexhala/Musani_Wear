import { Component, input } from '@angular/core';

/**
 * Reusable stats card for admin dashboard.
 * Displays an icon, numeric value, and label in a white card.
 */
@Component({
  selector: 'app-stats-card',
  standalone: true,
  templateUrl: './stats-card.component.html',
})
export class StatsCardComponent {
  /** Display label (e.g. "Total Products") */
  label = input.required<string>();
  /** Numeric value to show */
  value = input.required<number>();
  /** Emoji or icon (e.g. '📦') */
  icon = input<string>('');
}
