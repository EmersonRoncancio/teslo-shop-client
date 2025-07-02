import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  authService = inject(AuthServiceService);
  fb = inject(FormBuilder);
  hasError = signal(false);
  hasValue = signal(false);
  router = inject(Router);

  loginForms = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.loginForms.valid) {
      this.authService
        .loginAcces(
          this.loginForms.value.email!,
          this.loginForms.value.password!
        )
        .subscribe({
          next: () => this.router.navigateByUrl('/'),
          error: () => {
            this.hasError.set(true);
            setTimeout(() => {
              this.hasError.set(false);
            }, 3000);
          },
        });
    } else {
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      }, 3000);
    }
  }
}
