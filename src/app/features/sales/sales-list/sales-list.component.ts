import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SaleService } from '../../../core/services/sale.service';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { Sale } from '../../../core/models';

@Component({
  selector: 'app-sales-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, BadgeComponent, CurrencyPipe, DatePipe],
  templateUrl: './sales-list.component.html'
})
export class SalesListComponent implements OnInit {
  private saleService = inject(SaleService);

  sales = signal<Sale[]>([]);
  loading = signal(true);
  total = signal(0);
  filters = { status: '', page: 1, limit: 20 };

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.saleService.getAll(this.filters).subscribe({
      next: (res) => { this.sales.set(res.data); this.total.set(res.meta.total); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  close(id: string): void {
    if (!confirm('¿Cerrar esta venta como completada?')) return;
    this.saleService.close(id).subscribe(() => this.load());
  }

  statusBadge(status: string): { label: string; variant: any } {
    const map: any = {
      pending:   { label: 'Pendiente',  variant: 'yellow' },
      signed:    { label: 'Firmada',    variant: 'blue' },
      completed: { label: 'Completada', variant: 'green' },
      cancelled: { label: 'Cancelada',  variant: 'red' },
    };
    return map[status] || { label: status, variant: 'gray' };
  }

  get totalRevenue(): number {
    return this.sales().reduce((sum, s) => sum + (s.commission || 0), 0);
  }
}
