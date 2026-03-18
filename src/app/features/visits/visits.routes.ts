import { Routes } from '@angular/router';

export const visitsRoutes: Routes = [
  { path: '', loadComponent: () => import('./visits-list/visits-list.component').then(m => m.VisitsListComponent) },
  { path: 'new', loadComponent: () => import('./visit-form/visit-form.component').then(m => m.VisitFormComponent) },
];
