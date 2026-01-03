import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-user-form',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  template: `
    <mat-card>
      <mat-card-title>Nuevo Usuario</mat-card-title>

      <mat-card-content>
        <form (ngSubmit)="save()">

          <mat-form-field appearance="outline" class="full">
            <mat-label>Nombre</mat-label>
            <input matInput [(ngModel)]="user.person.name" name="name" required />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>Apellido</mat-label>
            <input matInput [(ngModel)]="user.person.lastname" name="lastname" required />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>Email</mat-label>
            <input matInput [(ngModel)]="user.email" name="email" required />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>Contraseña</mat-label>
            <input matInput type="password" [(ngModel)]="user.password" name="password" required />
          </mat-form-field>

          <div class="actions">
            <button mat-raised-button color="primary">
              <mat-icon>save</mat-icon>
              Guardar
            </button>
          </div>

        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .full { width: 100%; }
    .actions {
      text-align: right;
      margin-top: 16px;
    }
  `]
})
export class UserFormComponent {

  private userService = inject(UserService);
  private router = inject(Router);

  user: User = {
    id: 0,
    email: '',
    password: '',
    isActive: true,
    roles: [],
    person: {
      id: Date.now(),
      name: '',
      lastname: '',
      identification: ''
    }
  };

  save(): void {
    this.userService.create(this.user);
    this.router.navigate(['admin/users']);
  }
}
