import { inject } from '@angular/core';
import {
  Router,
  type CanMatchFn,
  type Route,
  type UrlSegment,
} from '@angular/router';
import { AuthServiceService } from '@auth/services/auth-service.service';
import { firstValueFrom } from 'rxjs';

export const notAuthenticatedGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[]
) => {
  const authService = inject(AuthServiceService);
  const router = inject(Router);

  const isAuthenticated = await firstValueFrom(authService.checkAuthStatus());

  if (isAuthenticated) {
    // Si el usuario ya está autenticado, redirigir a la página principal
    await router.navigate(['/']);
    return false; // No permitir el acceso a la ruta de autenticación
  }

  return true;
};
