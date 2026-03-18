import { Routes } from '@angular/router';

export const leadsRoutes: Routes = [
  { path: '', loadComponent: () => import('./leads-kanban/leads-kanban.component').then(m => m.LeadsKanbanComponent) },
  { path: 'new', loadComponent: () => import('./lead-form/lead-form.component').then(m => m.LeadFormComponent) },
  { path: ':id', loadComponent: () => import('./lead-detail/lead-detail.component').then(m => m.LeadDetailComponent) },
  { path: ':id/edit', loadComponent: () => import('./lead-form/lead-form.component').then(m => m.LeadFormComponent) },
];
