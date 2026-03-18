import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-500">{{ title }}</p>
          <p class="text-3xl font-bold text-gray-900 mt-1">{{ value }}</p>
          @if (change !== undefined) {
            <p class="text-sm mt-1" [class]="change >= 0 ? 'text-green-600' : 'text-red-600'">
              <span>{{ change >= 0 ? '↑' : '↓' }}</span>
              {{ Math.abs(change) }}% vs mes anterior
            </p>
          }
        </div>
        <div [class]="'w-12 h-12 rounded-xl flex items-center justify-center ' + iconBg">
          <svg class="w-6 h-6" [class]="iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="icon"/>
          </svg>
        </div>
      </div>
    </div>
  `
})
export class StatCardComponent {
  @Input() title = '';
  @Input() value: string | number = '';
  @Input() icon = '';
  @Input() iconBg = 'bg-blue-100';
  @Input() iconColor = 'text-blue-600';
  @Input() change?: number;

  Math = Math;
}
