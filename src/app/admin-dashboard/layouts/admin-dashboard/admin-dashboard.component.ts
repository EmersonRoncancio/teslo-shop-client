import { Component, computed, inject } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { AuthServiceService } from '@auth/services/auth-service.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent {
  authService = inject(AuthServiceService);
  router = inject(Router);

  user = computed(() => this.authService.user());

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
