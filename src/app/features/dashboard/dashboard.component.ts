import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReportService } from '../../core/services/report.service';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';
import { DashboardStats } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, StatCardComponent, TimeAgoPipe, CurrencyPipe],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private reportService = inject(ReportService);

  stats = signal<DashboardStats | null>(null);
  loading = signal(true);

  readonly ICONS = {
    properties: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    leads:      'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    sales:      'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    clients:    'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  };

  readonly STATUS_LABELS: Record<string, string> = {
    new: 'Nuevo', contacted: 'Contactado', qualified: 'Calificado',
    proposal: 'Propuesta', negotiation: 'Negociación',
    closed_won: 'Ganado', closed_lost: 'Perdido'
  };

  readonly STATUS_COLORS: Record<string, string> = {
    new: 'bg-blue-500', contacted: 'bg-cyan-500', qualified: 'bg-yellow-500',
    proposal: 'bg-purple-500', negotiation: 'bg-orange-500',
    closed_won: 'bg-green-500', closed_lost: 'bg-red-500'
  };

  ngOnInit(): void {
    this.reportService.getDashboardStats().subscribe({
      next: (data) => { this.stats.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  get statusEntries(): { key: string; value: number }[] {
    const s = this.stats();
    if (!s?.leadsByStatus) return [];
    return Object.entries(s.leadsByStatus).map(([key, value]) => ({ key, value }));
  }

  get totalLeadsByStatus(): number {
    return this.statusEntries.reduce((sum, e) => sum + e.value, 0);
  }
}
