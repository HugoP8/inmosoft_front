import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LeadService } from '../../../core/services/lead.service';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';
import { Lead } from '../../../core/models';

@Component({
  selector: 'app-lead-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, BadgeComponent, TimeAgoPipe, CurrencyPipe],
  templateUrl: './lead-detail.component.html'
})
export class LeadDetailComponent implements OnInit {
  private leadService = inject(LeadService);
  private route = inject(ActivatedRoute);

  lead = signal<Lead | null>(null);
  loading = signal(true);

  readonly STATUS_LABELS: Record<string, string> = {
    new: 'Nuevo', contacted: 'Contactado', qualified: 'Calificado',
    proposal: 'Propuesta', negotiation: 'Negociación', closed_won: 'Ganado', closed_lost: 'Perdido'
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.leadService.getById(id).subscribe({
      next: (l) => { this.lead.set(l); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  statusVariant(status: string): string {
    const map: any = { new: 'blue', contacted: 'blue', qualified: 'yellow', proposal: 'purple', negotiation: 'orange', closed_won: 'green', closed_lost: 'red' };
    return map[status] || 'gray';
  }
}
