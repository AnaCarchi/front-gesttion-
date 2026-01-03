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

    const user: User = {
      id: Date.now(),
      email: form.value.email,
      password: form.value.password,
      isActive: true,
      roles: [
        {
          id: Date.now(),
          name: 'STUDENT'
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
}
