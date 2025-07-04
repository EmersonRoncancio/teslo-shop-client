import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from '../interfaces/auth.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccesUser } from '../interfaces/acces.interface';
import { rxResource } from '@angular/core/rxjs-interop';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
interface registerUserType {
  fullName: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  urlApi = environment.url_api;
  private _AuthStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));
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

  user = computed<User | null>(() => {
    return this._user();
  });
  token = computed<string | null>(() => this._token());

  loginAcces(email: string, password: string): Observable<boolean | any> {
    return this.http
      .post<AccesUser>(`${this.urlApi}/auth/login`, {
        email: email,
        password: password,
      })
      .pipe(
        tap((response) => {
          this.handleStatusSuccess(response.user, response.token);
        }),
        map(() => true),
        catchError((error) => {
          this.handleStatusError();
          return error;
        })
      );
  }

  checkAuthStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
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
          this.handleStatusSuccess(response.user, response.token);
        }),
        map(() => true),
        catchError(() => {
          this.handleStatusError();
          return of(false);
        })
      );
  }

  registerUser(registerUser: registerUserType): Observable<boolean | any> {
    console.log(registerUser);
    return this.http
      .post<AccesUser>(`${this.urlApi}/auth/register`, registerUser)
      .pipe(
        tap((response) => {
          this.handleStatusSuccess(response.user, response.token);
        }),
        map(() => true),
        catchError((error) => {
          this.handleStatusError();
          return error;
        })
      );
  }

  logout() {
    this._AuthStatus.set('not-authenticated');
    this._user.set(null);
    this._token.set(null);
    localStorage.removeItem('token');
  }

  private handleStatusSuccess(user: User, token: string) {
    this._AuthStatus.set('authenticated');
    this._user.set(user);
    this._token.set(token);
    localStorage.setItem('token', token || '');
  }

  private handleStatusError() {
    this._AuthStatus.set('not-authenticated');
    this._user.set(null);
    this._token.set(null);
    localStorage.removeItem('token');
  }
}
