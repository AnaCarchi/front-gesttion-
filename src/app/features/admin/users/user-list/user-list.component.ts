import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
  <div class="header">
    <h2>Gestión de Usuarios</h2>
    <button mat-raised-button color="primary" (click)="create()">
      <mat-icon>person_add</mat-icon>
      Nuevo Usuario
    </button>
  </div>

  <table mat-table [dataSource]="users" class="mat-elevation-z1">

    <ng-container matColumnDef="name">
      <th mat-header-cell *matHeaderCellDef>Nombre</th>
      <td mat-cell *matCellDef="let u">
        {{ u.person?.name }} {{ u.person?.lastname }}
      </td>
    </ng-container>

    <ng-container matColumnDef="email">
      <th mat-header-cell *matHeaderCellDef>Email</th>
      <td mat-cell *matCellDef="let u">{{ u.email }}</td>
    </ng-container>

    <ng-container matColumnDef="roles">
      <th mat-header-cell *matHeaderCellDef>Roles</th>
      <td mat-cell *matCellDef="let u">
        {{ getRoleNames(u) }}
      </td>
    </ng-container>

    <ng-container matColumnDef="actions">
      <th mat-header-cell *matHeaderCellDef>Acciones</th>
      <td mat-cell *matCellDef="let u">
        <button mat-icon-button color="primary" (click)="assignRoles(u)">
          <mat-icon>security</mat-icon>
        </button>
      </td>
    </ng-container>

    <tr mat-header-row *matHeaderRowDef="columns"></tr>
    <tr mat-row *matRowDef="let row; columns: columns"></tr>
  </table>
`,

  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    table {
      width: 100%;
    }
  `]
})
export class UserListComponent implements OnInit {

  private userService = inject(UserService);
  private router = inject(Router);

  users: User[] = [];
  columns = ['name', 'email', 'roles', 'actions'];

  ngOnInit(): void {
    this.users = this.userService.getAll();
  }

  create(): void {
    this.router.navigate(['admin/users/new']);
  }

  assignRoles(user: User): void {
    this.router.navigate(['admin/users', user.id, 'roles']);
  }

  getRoleNames(user: User): string {
    if (!user.roles || user.roles.length === 0) {
      return 'Sin roles';
    }

    return user.roles.map(r => r.name).join(', ');
  }
}
