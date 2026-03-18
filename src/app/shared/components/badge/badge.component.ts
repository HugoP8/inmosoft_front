import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type BadgeVariant = 'green' | 'yellow' | 'red' | 'blue' | 'gray' | 'purple' | 'orange';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="badgeClass">{{ label }}</span>
  `
})
export class BadgeComponent {
  @Input() label = '';
  @Input() variant: BadgeVariant = 'gray';

  get badgeClass(): string {
    const map: Record<BadgeVariant, string> = {
      green:  'badge-green',
      yellow: 'badge-yellow',
      red:    'badge-red',
      blue:   'badge-blue',
      gray:   'badge-gray',
      purple: 'badge-purple',
      orange: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800',
    };
    return map[this.variant];
  }
}
