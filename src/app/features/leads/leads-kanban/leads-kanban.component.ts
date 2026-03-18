import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LeadService } from '../../../core/services/lead.service';
import { PipelineService } from '../../../core/services/pipeline.service';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { Lead, LeadStatus, PipelineStage } from '../../../core/models';

@Component({
  selector: 'app-leads-kanban',
  standalone: true,
  imports: [CommonModule, RouterLink, BadgeComponent],
  templateUrl: './leads-kanban.component.html'
})
export class LeadsKanbanComponent implements OnInit {
  private leadService = inject(LeadService);
  private pipelineService = inject(PipelineService);

  stages = signal<PipelineStage[]>([]);
  leads = signal<Lead[]>([]);
  loading = signal(true);

  readonly STATUS_COLORS: Record<LeadStatus, string> = {
    new:          'border-t-blue-500',
    contacted:    'border-t-cyan-500',
    qualified:    'border-t-yellow-500',
    proposal:     'border-t-purple-500',
    negotiation:  'border-t-orange-500',
    closed_won:   'border-t-green-500',
    closed_lost:  'border-t-red-500',
  };

  readonly STATUS_LABELS: Record<LeadStatus, string> = {
    new: 'Nuevo', contacted: 'Contactado', qualified: 'Calificado',
    proposal: 'Propuesta', negotiation: 'Negociación',
    closed_won: 'Ganado', closed_lost: 'Perdido'
  };

  readonly PRIORITY_BADGE: Record<string, any> = {
    low: { label: 'Baja', variant: 'gray' },
    medium: { label: 'Media', variant: 'blue' },
    high: { label: 'Alta', variant: 'yellow' },
    urgent: { label: 'Urgente', variant: 'red' },
  };

  readonly ALL_STATUSES: LeadStatus[] = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'];

  ngOnInit(): void {
    this.leadService.getAll({ limit: 200 }).subscribe({
      next: (res) => { this.leads.set(res.data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  getLeadsByStatus(status: LeadStatus): Lead[] {
    return this.leads().filter(l => l.status === status);
  }

  countByStatus(status: LeadStatus): number {
    return this.getLeadsByStatus(status).length;
  }

  updateStatus(leadId: string, status: LeadStatus): void {
    this.leadService.updateStatus(leadId, status).subscribe(updated => {
      this.leads.update(leads => leads.map(l => l.id === leadId ? updated : l));
    });
  }

  clientName(lead: Lead): string {
    if (!lead.client) return 'Sin cliente';
    return `${lead.client.firstName} ${lead.client.lastName}`;
  }

  agentInitials(lead: Lead): string {
    if (!lead.assignedTo) return '?';
    return `${lead.assignedTo.firstName[0]}${lead.assignedTo.lastName[0]}`.toUpperCase();
  }
}
