import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { PipelineService } from '../../core/services/pipeline.service';
import { PipelineStage, User } from '../../core/models';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {
  private authService = inject(AuthService);
  private pipelineService = inject(PipelineService);
  private fb = inject(FormBuilder);

  activeTab = signal<'profile' | 'pipeline' | 'security'>('profile');
  stages = signal<PipelineStage[]>([]);
  currentUser = signal<User | null>(null);
  savingProfile = signal(false);
  savingPassword = signal(false);
  successMsg = signal('');

  profileForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName:  ['', Validators.required],
    email:     ['', [Validators.required, Validators.email]],
  });

  passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword:     ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  });

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.currentUser.set(user);
    if (user) this.profileForm.patchValue(user);
    this.pipelineService.getStages().subscribe(s => this.stages.set(s));
  }

  setTab(tab: 'profile' | 'pipeline' | 'security'): void {
    this.activeTab.set(tab);
    this.successMsg.set('');
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;
    // Would call userService.updateProfile() - placeholder
    this.successMsg.set('Perfil actualizado correctamente');
  }

  deleteStage(id: string): void {
    if (!confirm('¿Eliminar esta etapa?')) return;
    this.pipelineService.deleteStage(id).subscribe(() => {
      this.stages.update(s => s.filter(x => x.id !== id));
    });
  }
}
