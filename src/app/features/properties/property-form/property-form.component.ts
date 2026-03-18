import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PropertyService } from '../../../core/services/property.service';

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './property-form.component.html'
})
export class PropertyFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private propertyService = inject(PropertyService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loading = signal(false);
  saving = signal(false);
  error = signal('');
  isEdit = signal(false);
  propertyId = signal('');
  currentStep = signal(1);
  totalSteps = 4;

  form = this.fb.group({
    title:         ['', Validators.required],
    description:   [''],
    type:          ['house', Validators.required],
    status:        ['available', Validators.required],
    price:         [0, [Validators.required, Validators.min(0)]],
    currency:      ['USD'],
    address:       ['', Validators.required],
    city:          ['', Validators.required],
    state:         [''],
    country:       [''],
    zipCode:       [''],
    bedrooms:      [0],
    bathrooms:     [0],
    area:          [0],
    parkingSpaces: [0],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.propertyId.set(id);
      this.loading.set(true);
      this.propertyService.getById(id).subscribe({
        next: (p) => { this.form.patchValue(p as any); this.loading.set(false); },
        error: () => this.loading.set(false)
      });
    }
  }

  nextStep(): void { if (this.currentStep() < this.totalSteps) this.currentStep.update(s => s + 1); }
  prevStep(): void { if (this.currentStep() > 1) this.currentStep.update(s => s - 1); }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    this.error.set('');

    const req = this.isEdit()
      ? this.propertyService.update(this.propertyId(), this.form.value as any)
      : this.propertyService.create(this.form.value as any);

    req.subscribe({
      next: () => this.router.navigate(['/properties']),
      error: (err) => { this.error.set(err.error?.message || 'Error al guardar'); this.saving.set(false); }
    });
  }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && c?.touched);
  }
}
