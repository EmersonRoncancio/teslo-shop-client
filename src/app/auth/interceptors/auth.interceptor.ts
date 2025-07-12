import {
  HttpEvent,
  HttpEventType,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthServiceService } from '@auth/services/auth-service.service';
import { Observable, tap } from 'rxjs';

export function AuthInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const authToken = inject(AuthServiceService).token();
  console.log('AuthInterceptor', authToken);

  const authRequest = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${authToken}`),
  });

  return next(authRequest).pipe(tap((event) => {}));
}
