import { Routes } from '@angular/router';
import { notAuthenticatedGuard } from '@auth/guards/not-authenticated.guard';
import { isAdminGuard } from './admin-dashboard/guards/is-admin.guard';

export const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin-dashboard/dashboard.route').then((m) => m.routes),
    canMatch: [isAdminGuard],
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.routes),
    canMatch: [notAuthenticatedGuard],
  },
  {
    path: '',
    loadChildren: () =>
      import('./store-front/store-front.routes').then((m) => m.routes),
  },
];
