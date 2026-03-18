import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PropertyService } from '../../../core/services/property.service';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { Property } from '../../../core/models';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, BadgeComponent, CurrencyPipe],
  templateUrl: './property-detail.component.html'
})
export class PropertyDetailComponent implements OnInit {
  private propertyService = inject(PropertyService);
  private route = inject(ActivatedRoute);

  property = signal<Property | null>(null);
  loading = signal(true);
  activeImageIndex = signal(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.propertyService.getById(id).subscribe({
      next: (p) => { this.property.set(p); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  get images(): string[] {
    const p = this.property();
    if (!p?.images?.length) return ['https://via.placeholder.com/800x500?text=Sin+imagen'];
    return p.images.map(i => i.url);
  }

  statusBadge(status: string): { label: string; variant: any } {
    const map: any = {
      available: { label: 'Disponible', variant: 'green' },
      reserved:  { label: 'Reservada',  variant: 'yellow' },
      sold:      { label: 'Vendida',    variant: 'red' },
      rented:    { label: 'Alquilada',  variant: 'blue' },
    };
    return map[status] || { label: status, variant: 'gray' };
  }
}
