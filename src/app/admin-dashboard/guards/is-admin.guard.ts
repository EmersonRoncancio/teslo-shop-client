import { inject } from '@angular/core';
import { Router, type CanMatchFn } from '@angular/router';
import { AuthServiceService } from '@auth/services/auth-service.service';
import { first, firstValueFrom } from 'rxjs';

type roles = 'admin' | 'user';

export const isAdminGuard: CanMatchFn = async (route, segments) => {
  const router = inject(Router);
  const authService = inject(AuthServiceService);
  await firstValueFrom(authService.checkAuthStatus());

  const user = authService.user();

  if (!user?.roles.includes('admin')) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
