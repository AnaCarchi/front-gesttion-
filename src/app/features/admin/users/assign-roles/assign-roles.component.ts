import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from '../../../../core/services/user.service';
import { User, RoleName } from '../../../../core/models';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-assign-roles',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  template: `
    <mat-card *ngIf="user">
      <mat-card-title>
        Asignar Roles
      </mat-card-title>

      <mat-card-content>
        <p>{{ user.person.name }} {{ user.person.lastname }}</p>

        <div class="roles">
          <mat-checkbox
            *ngFor="let role of roles"
            [checked]="hasRole(role)"
            (change)="toggleRole(role)"
          >
            {{ role }}
          </mat-checkbox>
        </div>

        <div class="actions">
          <button mat-raised-button color="primary" (click)="save()">
            <mat-icon>save</mat-icon>
            Guardar
          </button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .roles {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin: 16px 0;
    }
    .actions {
      text-align: right;
    }
  `]
})
export class AssignRolesComponent implements OnInit {

  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  user!: User;

  roles: RoleName[] = [
    'ADMIN',
    'COORDINATOR',
    'TUTOR_ACADEMIC',
    'TUTOR_ENTERPRISE',
    'STUDENT'
  ];

  ngOnInit(): void {
    const userId = Number(this.route.snapshot.paramMap.get('id'));
    this.user = this.userService.getById(userId)!;
  }

  hasRole(role: RoleName): boolean {
    return this.user.roles.some(r => r.name === role);
  }

  toggleRole(role: RoleName): void {
    if (this.hasRole(role)) {
      this.user.roles = this.user.roles.filter(r => r.name !== role);
    } else {
      this.user.roles.push({ id: Date.now(), name: role });
    }
  }

  save(): void {
    this.userService.update(this.user);
    this.router.navigate(['admin/users']);
  }
}
