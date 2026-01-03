import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { User } from '../../../core/models';
import { UserService } from '../../../core/services/user.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {

  loading = false;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  submit(form: NgForm): void {
    if (form.invalid) return;

    const roleName = this.resolveRole(form.value.email);

    const user: User = {
      id: Date.now(),
      email: form.value.email,
      password: form.value.password,
      isActive: true,
      roles: [
        {
          id: Date.now(),
          name: roleName
        }
      ],
      person: {
        id: Date.now(),
        name: form.value.name,
        lastname: form.value.lastname,
        identification: ''
      }
    };

    this.userService.create(user);
    this.router.navigate(['/auth/login']);
  }

  private resolveRole(email: string): User['roles'][number]['name'] {
    const normalizedEmail = (email || '').toLowerCase();

    if (normalizedEmail.includes('admin')) {
      return 'ADMIN';
    }

    if (normalizedEmail.includes('coordinator')) {
      return 'COORDINATOR';
    }

    if (normalizedEmail.includes('tutor-enterprise') || normalizedEmail.includes('enterprise')) {
      return 'TUTOR_ENTERPRISE';
    }

    if (normalizedEmail.includes('tutor-academic') || normalizedEmail.includes('academic')) {
      return 'TUTOR_ACADEMIC';
    }

    if (normalizedEmail.includes('tutor')) {
      return 'TUTOR_ACADEMIC';
    }

    return 'STUDENT';
  }
}
