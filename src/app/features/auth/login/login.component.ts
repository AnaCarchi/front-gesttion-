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
    password: ['', [Validators.required, Validators.minLength(6)]]
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

  // ===========================================================

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    const user = this.authService.login(
      email as string,
      password as string
    );

    this.loading = false;

    if (!user) {
      this.errorMessage = 'Credenciales incorrectas';
      return;
    }

    const roleName = user.roles[0]?.name;

    switch (roleName) {
      case 'ADMIN':
        this.router.navigate(['/admin']);
        break;
      case 'COORDINATOR':
        this.router.navigate(['/coordinator']);
        break;
      case 'TUTOR_ACADEMIC':
        this.router.navigate(['/tutor']);
        break;
      case 'TUTOR_ENTERPRISE':
        this.router.navigate(['/tutor-enterprise']);
        break;
      case 'STUDENT':
        this.router.navigate(['/student']);
        break;
      default:
        this.router.navigate(['/auth/login']);
    }
  }
}
