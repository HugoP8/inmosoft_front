import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VisitService } from '../../../core/services/visit.service';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { Visit } from '../../../core/models';

@Component({
  selector: 'app-visits-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, BadgeComponent, DatePipe],
  templateUrl: './visits-list.component.html'
})
export class VisitsListComponent implements OnInit {
  private visitService = inject(VisitService);

  visits = signal<Visit[]>([]);
  loading = signal(true);
  total = signal(0);
  filters = { status: '', page: 1, limit: 20 };

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.visitService.getAll(this.filters).subscribe({
      next: (res) => { this.visits.set(res.data); this.total.set(res.meta.total); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  complete(id: string): void {
    this.visitService.complete(id, {}).subscribe(() => this.load());
  }

  cancel(id: string): void {
    if (!confirm('¿Cancelar esta visita?')) return;
    this.visitService.cancel(id).subscribe(() => this.load());
  }

  statusBadge(status: string): { label: string; variant: any } {
    const map: any = {
      scheduled:  { label: 'Programada', variant: 'blue' },
      completed:  { label: 'Completada', variant: 'green' },
      cancelled:  { label: 'Cancelada',  variant: 'red' },
      no_show:    { label: 'No asistió', variant: 'yellow' },
    };
    return map[status] || { label: status, variant: 'gray' };
  }
}
