import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VisitService } from '../../../core/services/visit.service';
import { LeadService } from '../../../core/services/lead.service';
import { PropertyService } from '../../../core/services/property.service';
import { Lead, Property } from '../../../core/models';

@Component({
  selector: 'app-visit-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './visit-form.component.html'
})
export class VisitFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private visitService = inject(VisitService);
  private leadService = inject(LeadService);
  private propertyService = inject(PropertyService);
  private router = inject(Router);

  saving = signal(false);
  error = signal('');
  leads = signal<Lead[]>([]);
  properties = signal<Property[]>([]);

  form = this.fb.group({
    leadId:      ['', Validators.required],
    propertyId:  ['', Validators.required],
    scheduledAt: ['', Validators.required],
    notes:       [''],
  });

  ngOnInit(): void {
    this.leadService.getAll({ limit: 200 }).subscribe(r => this.leads.set(r.data));
    this.propertyService.getAll({ limit: 200 }).subscribe(r => this.properties.set(r.data));
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    this.visitService.create(this.form.value).subscribe({
      next: () => this.router.navigate(['/visits']),
      error: (err) => { this.error.set(err.error?.message || 'Error'); this.saving.set(false); }
    });
  }

  isInvalid(f: string): boolean { const c = this.form.get(f); return !!(c?.invalid && c?.touched); }
}
