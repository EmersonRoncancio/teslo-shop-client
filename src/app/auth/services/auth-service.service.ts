import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from '../interfaces/auth.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccesUser } from '../interfaces/acces.interface';
import { rxResource } from '@angular/core/rxjs-interop';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  urlApi = environment.url_api;
  private _AuthStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(null);
  http = inject(HttpClient);

  chechStatus = rxResource({
    params: () => ({ status: this._AuthStatus }),
    stream: ({ params }) => {
      return this.checkAuthStatus().pipe(
        tap(() => {
          console.log(this._AuthStatus());
        })
      );
    },
  });

  authStatus = computed(() => {
    if (this._AuthStatus() === 'checking') return 'checking';
    if (this._user()) return 'authenticated';
    return 'not-authenticated';
  });

  user = computed<User | null>(() => this._user());
  token = computed<string | null>(() => this._token());

  loginAcces(email: string, password: string): Observable<boolean | any> {
    return this.http
      .post<AccesUser>(`${this.urlApi}/auth/login`, {
        email: email,
        password: password,
      })
      .pipe(
        tap((response) => {
          this._user.set(response.user);
          this._token.set(response.token);
          this._AuthStatus.set('authenticated');
          localStorage.setItem('token', response.token);
        }),
        map(() => true),
        catchError((error) => {
          this._AuthStatus.set('not-authenticated');
          this._user.set(null);
          this._token.set(null);
          localStorage.removeItem('token');
          return error;
        })
      );
  }

  checkAuthStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this._AuthStatus.set('not-authenticated');
      this._user.set(null);
      this._token.set(null);
      return of(false);
    }
    return this.http
      .get<AccesUser>(`${this.urlApi}/auth/check-status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        tap((response) => {
          this._user.set(response.user);
          this._token.set(response.token);
          this._AuthStatus.set('authenticated');
          localStorage.setItem('token', response.token);
        }),
        map(() => true),
        catchError(() => {
          console.error('Error checking authentication status');
          this._AuthStatus.set('not-authenticated');
          this._user.set(null);
          this._token.set(null);
          localStorage.removeItem('token');
          return of(false);
        })
      );
  }
}
