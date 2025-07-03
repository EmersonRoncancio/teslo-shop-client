import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '@auth/services/auth-service.service';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {
  authService = inject(AuthServiceService);
  fb = inject(FormBuilder);
  hasSucces = signal(false);
  hasError = signal(false);
  router = inject(Router);

  registerForms = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (!this.registerForms.valid) {
      return;
    }

    this.authService
      .registerUser({
        email: this.registerForms.value.email!,
        fullName: this.registerForms.value.fullName!,
        password: this.registerForms.value.password!,
      })
      .subscribe({
        next: () => {
          this.hasSucces.set(true);
          setTimeout(() => {
            this.hasSucces.set(false);
          }, 3000);
          this.router.navigateByUrl('/');
        },
        error: () => {
          this.hasError.set(true);
          setTimeout(() => {
            this.hasError.set(false);
          }, 3000);
          return;
        },
      });
  }
}
