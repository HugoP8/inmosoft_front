import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LeadService } from '../../../core/services/lead.service';
import { ClientService } from '../../../core/services/client.service';
import { Client } from '../../../core/models';

@Component({
  selector: 'app-lead-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './lead-form.component.html'
})
export class LeadFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private leadService = inject(LeadService);
  private clientService = inject(ClientService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  saving = signal(false);
  error = signal('');
  isEdit = signal(false);
  leadId = signal('');
  clients = signal<Client[]>([]);

  form = this.fb.group({
    title:        ['', Validators.required],
    clientId:     ['', Validators.required],
    priority:     ['medium'],
    budget:       [0],
    source:       [''],
    notes:        [''],
    status:       ['new'],
  });

  ngOnInit(): void {
    this.clientService.getAll({ limit: 200 }).subscribe(r => this.clients.set(r.data));

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.leadId.set(id);
      this.leadService.getById(id).subscribe(l => {
        this.form.patchValue({ ...l as any, clientId: l.client?.id });
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    const req = this.isEdit()
      ? this.leadService.update(this.leadId(), this.form.value as any)
      : this.leadService.create(this.form.value as any);
    req.subscribe({
      next: () => this.router.navigate(['/leads']),
      error: (err) => { this.error.set(err.error?.message || 'Error'); this.saving.set(false); }
    });
  }

  isInvalid(f: string): boolean { const c = this.form.get(f); return !!(c?.invalid && c?.touched); }
}
