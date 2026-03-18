import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../../core/services/client.service';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { Client } from '../../../core/models';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, BadgeComponent],
  templateUrl: './clients-list.component.html'
})
export class ClientsListComponent implements OnInit {
  private clientService = inject(ClientService);

  clients = signal<Client[]>([]);
  loading = signal(true);
  total = signal(0);
  page = signal(1);

  filters = { search: '', type: '', source: '', page: 1, limit: 20 };

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.clientService.getAll({ ...this.filters, page: this.page() }).subscribe({
      next: (res) => { this.clients.set(res.data); this.total.set(res.meta.total); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  onSearch(): void { this.page.set(1); this.load(); }

  delete(id: string): void {
    if (!confirm('¿Eliminar este cliente?')) return;
    this.clientService.delete(id).subscribe(() => this.load());
  }

  typeBadge(type: string): { label: string; variant: any } {
    const map: any = {
      buyer: { label: 'Comprador', variant: 'blue' }, seller: { label: 'Vendedor', variant: 'green' },
      renter: { label: 'Inquilino', variant: 'yellow' }, investor: { label: 'Inversor', variant: 'purple' }
    };
    return map[type] || { label: type, variant: 'gray' };
  }

  sourceLabel(source: string): string {
    const map: any = {
      website: 'Web', referral: 'Referido', social: 'Redes Sociales', cold_call: 'Llamada fría', other: 'Otro'
    };
    return map[source] || source;
  }

  get initials(){ return (c: Client) => `${c.firstName[0]}${c.lastName[0]}`.toUpperCase(); }
}
