import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../../core/services/client.service';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './client-form.component.html'
})
export class ClientFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private clientService = inject(ClientService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loading = signal(false);
  saving = signal(false);
  error = signal('');
  isEdit = signal(false);
  clientId = signal('');

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName:  ['', Validators.required],
    email:     ['', [Validators.required, Validators.email]],
    phone:     [''],
    type:      ['buyer', Validators.required],
    source:    ['other'],
    notes:     [''],
    address:   [''],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.clientId.set(id);
      this.loading.set(true);
      this.clientService.getById(id).subscribe({
        next: (c) => { this.form.patchValue(c as any); this.loading.set(false); },
        error: () => this.loading.set(false)
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    const req = this.isEdit()
      ? this.clientService.update(this.clientId(), this.form.value as any)
      : this.clientService.create(this.form.value as any);
    req.subscribe({
      next: () => this.router.navigate(['/clients']),
      error: (err) => { this.error.set(err.error?.message || 'Error al guardar'); this.saving.set(false); }
    });
  }

  isInvalid(f: string): boolean { const c = this.form.get(f); return !!(c?.invalid && c?.touched); }
}
