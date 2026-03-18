import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PropertyService } from '../../../core/services/property.service';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { Property, PropertyStatus, PropertyType } from '../../../core/models';

@Component({
  selector: 'app-properties-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, BadgeComponent, CurrencyPipe],
  templateUrl: './properties-list.component.html'
})
export class PropertiesListComponent implements OnInit {
  private propertyService = inject(PropertyService);

  properties = signal<Property[]>([]);
  loading = signal(true);
  totalItems = signal(0);
  currentPage = signal(1);
  viewMode = signal<'grid' | 'list'>('grid');

  filters = { search: '', type: '', status: '', city: '', minPrice: '', maxPrice: '', page: 1, limit: 12 };

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.propertyService.getAll({ ...this.filters, page: this.currentPage() }).subscribe({
      next: (res) => {
        this.properties.set(res.data);
        this.totalItems.set(res.meta.total);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onSearch(): void { this.currentPage.set(1); this.load(); }

  changePage(page: number): void { this.currentPage.set(page); this.load(); }

  delete(id: string): void {
    if (!confirm('¿Eliminar esta propiedad?')) return;
    this.propertyService.delete(id).subscribe(() => this.load());
  }

  statusBadge(status: PropertyStatus): { label: string; variant: any } {
    const map: Record<PropertyStatus, { label: string; variant: any }> = {
      available: { label: 'Disponible', variant: 'green' },
      reserved:  { label: 'Reservada',  variant: 'yellow' },
      sold:      { label: 'Vendida',    variant: 'red' },
      rented:    { label: 'Alquilada',  variant: 'blue' },
    };
    return map[status] || { label: status, variant: 'gray' };
  }

  typLabel(type: PropertyType): string {
    const map: Record<PropertyType, string> = {
      house: 'Casa', apartment: 'Apartamento', land: 'Terreno', commercial: 'Comercial', office: 'Oficina'
    };
    return map[type] || type;
  }

  primaryImage(p: Property): string {
    const img = p.images?.find(i => i.isPrimary) || p.images?.[0];
    return img?.url || 'https://via.placeholder.com/400x250?text=Sin+imagen';
  }

  get totalPages(): number { return Math.ceil(this.totalItems() / this.filters.limit); }
  get pages(): number[] { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }
}
