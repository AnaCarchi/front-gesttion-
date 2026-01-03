import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loading = false;
  errorMessage = '';

  // ✅ FORMULARIO REACTIVO
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  // ================= GETTERS PARA EL TEMPLATE =================
  get email(): AbstractControl | null {
    return this.loginForm.get('email');
  }

  get password(): AbstractControl | null {
    return this.loginForm.get('password');
  }

  get role(): AbstractControl | null {
    return this.loginForm.get('role');
  }
  // ===========================================================

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { email, password, role } = this.loginForm.value;

    const success = this.authService.login(
      email as string,
      password as string
    );

    this.loading = false;

    if (!success) {
      this.errorMessage = 'Credenciales incorrectas';
      return;
    }

    // 🔀 REDIRECCIÓN SEGÚN ROL
    switch (role) {
      case 'admin':
        this.router.navigate(['/admin']);
        break;
      case 'coordinator':
        this.router.navigate(['/coordinator']);
        break;
      case 'tutor':
        this.router.navigate(['/tutor']);
        break;
      case 'student':
        this.router.navigate(['/student']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }
}
