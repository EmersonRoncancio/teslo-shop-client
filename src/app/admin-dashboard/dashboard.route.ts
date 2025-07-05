import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './layouts/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/products-page/products-page.component').then(
            (m) => m.ProductsPageComponent
          ),
      },
      {
        path: 'products/:id',
        loadComponent: () =>
          import('./pages/product-page/product-page.component').then(
            (m) => m.ProductPageComponent
          ),
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];
