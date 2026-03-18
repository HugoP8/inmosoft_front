import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SaleService } from '../../../core/services/sale.service';
import { LeadService } from '../../../core/services/lead.service';
import { PropertyService } from '../../../core/services/property.service';
import { ClientService } from '../../../core/services/client.service';
import { Lead, Property, Client } from '../../../core/models';

@Component({
  selector: 'app-sale-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './sale-form.component.html'
})
export class SaleFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private saleService = inject(SaleService);
  private leadService = inject(LeadService);
  private propertyService = inject(PropertyService);
  private clientService = inject(ClientService);
  private router = inject(Router);

  saving = signal(false);
  error = signal('');
  leads = signal<Lead[]>([]);
  properties = signal<Property[]>([]);
  clients = signal<Client[]>([]);

  form = this.fb.group({
    leadId:     ['', Validators.required],
    propertyId: ['', Validators.required],
    clientId:   ['', Validators.required],
    price:      [0, [Validators.required, Validators.min(1)]],
    commission: [0],
    notes:      [''],
  });

  ngOnInit(): void {
    this.leadService.getAll({ limit: 200 }).subscribe(r => this.leads.set(r.data));
    this.propertyService.getAll({ limit: 200, status: 'available' }).subscribe(r => this.properties.set(r.data));
    this.clientService.getAll({ limit: 200 }).subscribe(r => this.clients.set(r.data));
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    this.saleService.create(this.form.value).subscribe({
      next: () => this.router.navigate(['/sales']),
      error: (err) => { this.error.set(err.error?.message || 'Error'); this.saving.set(false); }
    });
  }

  isInvalid(f: string): boolean { const c = this.form.get(f); return !!(c?.invalid && c?.touched); }
}
