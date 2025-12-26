import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page-container">
      <!-- HEADER -->
      <div class="page-header">
        <div class="header-left">
          <span class="material-icons header-icon">groups</span>
          <div>
            <h1>Usuarios del Sistema</h1>
            <p>Gestión de usuarios y roles</p>
          </div>
        </div>
        <a routerLink="/admin/users/new" class="btn-primary">
          <span class="material-icons">person_add</span>
          Nuevo Usuario
        </a>
      </div>

      <!-- STATS -->
      <div class="stats-row">
        <div class="stat-box">
          <span class="material-icons">groups</span>
          <div>
            <div class="stat-value">{{ users.length }}</div>
            <div class="stat-label">Total Usuarios</div>
          </div>
        </div>
        <div class="stat-box">
          <span class="material-icons">admin_panel_settings</span>
          <div>
            <div class="stat-value">{{ countByRole('Administrador') }}</div>
            <div class="stat-label">Administradores</div>
          </div>
        </div>
        <div class="stat-box">
          <span class="material-icons">supervisor_account</span>
          <div>
            <div class="stat-value">{{ countByRole('Coordinador') }}</div>
            <div class="stat-label">Coordinadores</div>
          </div>
        </div>
        <div class="stat-box">
          <span class="material-icons">corporate_fare</span>
          <div>
            <div class="stat-value">{{ countByRole('Tutor Empresarial') }}</div>
            <div class="stat-label">Tutores</div>
          </div>
        </div>
      </div>

      <!-- FILTERS -->
      <div class="filters-section">
        <div class="search-box">
          <span class="material-icons">search</span>
          <input 
            type="text" 
            placeholder="Buscar por nombre o email..."
            [(ngModel)]="searchTerm"
            (input)="filterUsers()"
          />
          <button 
            *ngIf="searchTerm" 
            (click)="clearSearch()"
            class="clear-btn"
          >
            <span class="material-icons">close</span>
          </button>
        </div>

        <div class="filter-tabs">
          <button class="tab" [class.active]="filterRole === 'all'" (click)="setRoleFilter('all')">
            <span class="material-icons">all_inclusive</span>
            Todos ({{ users.length }})
          </button>
          <button class="tab" [class.active]="filterRole === 'Administrador'" (click)="setRoleFilter('Administrador')">
            <span class="material-icons">admin_panel_settings</span>
            Admin ({{ countByRole('Administrador') }})
          </button>
          <button class="tab" [class.active]="filterRole === 'Coordinador'" (click)="setRoleFilter('Coordinador')">
            <span class="material-icons">supervisor_account</span>
            Coordinador ({{ countByRole('Coordinador') }})
          </button>
          <button class="tab" [class.active]="filterRole === 'Tutor Empresarial'" (click)="setRoleFilter('Tutor Empresarial')">
            <span class="material-icons">corporate_fare</span>
            Tutor ({{ countByRole('Tutor Empresarial') }})
          </button>
          <button class="tab" [class.active]="filterRole === 'Estudiante'" (click)="setRoleFilter('Estudiante')">
            <span class="material-icons">school</span>
            Estudiante ({{ countByRole('Estudiante') }})
          </button>
        </div>
      </div>

      <!-- USERS GRID -->
      <div class="users-grid" *ngIf="!loading && filteredUsers.length > 0">
        <div class="user-card" *ngFor="let user of filteredUsers">
          <div class="card-header">
            <div class="user-avatar">
              <span class="material-icons">{{ getRoleIcon(getPrimaryRole(user)) }}</span>
            </div>
            <div class="user-info">
              <h3>{{ getUserFullName(user) }}</h3>
              <div class="user-email">
                <span class="material-icons">email</span>
                {{ user.email }}
              </div>
            </div>
          </div>

          <div class="card-body">
            <div class="info-row">
              <span class="material-icons">badge</span>
              <span>{{ user.email }}</span>
            </div>
            <div class="info-row">
              <span class="material-icons">verified_user</span>
              <span>{{ getUserRoles(user) }}</span>
            </div>
            <div class="role-badge" [class]="getPrimaryRole(user).toLowerCase().replace(' ', '-')">
              <span class="material-icons">{{ getRoleIcon(getPrimaryRole(user)) }}</span>
              {{ getPrimaryRole(user) }}
            </div>
          </div>

          <div class="card-footer">
            <a [routerLink]="['/admin/users', user.id]" class="btn-action view">
              <span class="material-icons">visibility</span>
              Ver
            </a>
            <a [routerLink]="['/admin/users', user.id, 'edit']" class="btn-action edit">
              <span class="material-icons">edit</span>
              Editar
            </a>
            <button (click)="deleteUser(user.id)" class="btn-action delete">
              <span class="material-icons">delete</span>
              Eliminar
            </button>
          </div>
        </div>
      </div>

      <!-- EMPTY STATE -->
      <div class="empty-state" *ngIf="!loading && filteredUsers.length === 0">
        <span class="material-icons">{{ searchTerm ? 'person_search' : 'group_add' }}</span>
        <h3>{{ searchTerm ? 'No se encontraron usuarios' : 'No hay usuarios registrados' }}</h3>
        <p>{{ searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza agregando el primer usuario' }}</p>
        <button (click)="clearSearch()" class="btn-secondary" *ngIf="searchTerm">
          <span class="material-icons">clear</span>
          Limpiar Búsqueda
        </button>
        <a routerLink="/admin/users/new" class="btn-primary" *ngIf="!searchTerm">
          <span class="material-icons">person_add</span>
          Crear Primer Usuario
        </a>
      </div>

      <!-- LOADING -->
      <div class="loading-state" *ngIf="loading">
        <div class="spinner"></div>
        <p>Cargando usuarios...</p>
      </div>
    </div>
  `,
styles: [`
/* ================= CONTENEDOR GENERAL ================= */
.page-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 24px;
  min-height: 100vh;
  background-image:
    linear-gradient(rgba(15,23,42,.85), rgba(15,23,42,.85)),
    url('https://yavirac.edu.ec/wp-content/uploads/2024/05/vision.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  color: #fff;
  font-family: 'Poppins', sans-serif;
}

/* ================= HEADER ================= */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 36px;
  border-bottom: 2px solid rgba(255,255,255,.15);
  padding-bottom: 16px;
}

.header-left {
  display: flex;
  gap: 16px;
  align-items: center;
}

.header-icon {
  font-size: 48px;
  color: #fbbf24;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 800;
  margin: 0;
}

.page-header p {
  font-size: 15px;
  color: #e2e8f0;
  margin: 4px 0 0;
}

/* ================= BOTONES ================= */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg,#2563eb,#1e40af);
  color: #fff;
  border-radius: 12px;
  font-weight: 700;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: .3s;
  box-shadow: 0 12px 24px rgba(37,99,235,.35);
}

.btn-primary:hover {
  background: linear-gradient(135deg,#f97316,#ea580c);
  transform: translateY(-3px);
}

/* ================= STATS ================= */
.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit,minmax(240px,1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.stat-box {
  background: rgba(255,255,255,.95);
  color: #0f172a;
  border-left: 5px solid #2563eb;
  border-radius: 18px;
  padding: 22px;
  display: flex;
  gap: 16px;
  align-items: center;
  box-shadow: 0 15px 30px rgba(0,0,0,.25);
  transition: .3s;
}

.stat-box:hover {
  transform: translateY(-6px);
}

.stat-box .material-icons {
  font-size: 42px;
  color: #2563eb;
}

.stat-value {
  font-size: 32px;
  font-weight: 800;
}

.stat-label {
  font-size: 14px;
  color: #475569;
}

/* ================= FILTROS ================= */
.filters-section {
  margin-bottom: 32px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,.12);
  backdrop-filter: blur(6px);
  padding: 12px 14px;
  border-radius: 14px;
  margin-bottom: 16px;
}

.search-box input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: white;
  font-size: 15px;
}

.clear-btn {
  background: none;
  border: none;
  color: #fbbf24;
  cursor: pointer;
}

/* ================= TABS ================= */
.filter-tabs {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tab {
  background: rgba(255,255,255,.12);
  border: 1px solid rgba(255,255,255,.2);
  color: white;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: .3s;
}

.tab.active,
.tab:hover {
  background: #2563eb;
  border-color: #2563eb;
}

/* ================= GRID USUARIOS ================= */
.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(320px,1fr));
  gap: 24px;
}

/* ================= TARJETA ================= */
.user-card {
  background: rgba(255,255,255,.95);
  border-radius: 18px;
  box-shadow: 0 15px 35px rgba(0,0,0,.3);
  overflow: hidden;
  transition: .3s;
}

.user-card:hover {
  transform: translateY(-6px);
}

/* HEADER CARD */
.card-header {
  display: flex;
  gap: 14px;
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.user-avatar {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: linear-gradient(135deg,#2563eb,#1e40af);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.user-info h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
}

.user-email {
  font-size: 13px;
  color: #64748b;
  display: flex;
  gap: 4px;
}

/* BODY */
.card-body {
  padding: 18px 20px;
}

.info-row {
  display: flex;
  gap: 8px;
  font-size: 14px;
  color: #334155;
  margin-bottom: 8px;
}

/* ROLE BADGE */
.role-badge {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  margin-top: 12px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  background: #e0f2fe;
  color: #1e40af;
}

/* FOOTER */
.card-footer {
  display: flex;
  justify-content: space-between;
  padding: 16px 20px;
  background: #f8fafc;
}

.btn-action {
  border: none;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.view { background: #e0f2fe; color: #1e40af; }
.edit { background: #fef3c7; color: #92400e; }
.delete { background: #fee2e2; color: #991b1b; }

/* ================= EMPTY ================= */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-state .material-icons {
  font-size: 64px;
  color: #fbbf24;
}

/* ================= LOADING ================= */
.loading-state {
  text-align: center;
  padding: 80px;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(255,255,255,.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin .8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ================= RESPONSIVE ================= */
@media (max-width:768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .users-grid {
    grid-template-columns: 1fr;
  }
}
`]

})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);

  users: User[] = [];
  filteredUsers: User[] = [];
  loading = true;
  searchTerm = '';
  filterRole: string = 'all';

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: (users) => {
        this.users = users ?? [];
        this.filterUsers();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.loading = false;
      }
    });
  }

  getUserFullName(user: User): string {
  if (!user.person) return 'Sin nombre';
  const first = user.person.name || '';
  const last = user.person.lastname || '';
  return `${first} ${last}`.trim() || 'Sin nombre';
}


  filterUsers(): void {
    let result = [...this.users];
    if (this.filterRole !== 'all') {
      result = result.filter(u => this.hasRole(u, this.filterRole));
    }
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(u =>
        this.getUserFullName(u).toLowerCase().includes(term) ||
        (u.email?.toLowerCase() || '').includes(term)
      );
    }
    this.filteredUsers = result;
  }

  setRoleFilter(role: string): void {
    this.filterRole = role;
    this.filterUsers();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filterUsers();
  }

  countByRole(role: string): number {
    return this.users.filter(u => this.hasRole(u, role)).length;
  }

  hasRole(user: User, role: string): boolean {
    return !!user.roles?.some(r => r.name === role);
  }

  getPrimaryRole(user: User): string {
    if (!user.roles?.length) return 'Sin rol';
    return user.roles[0].name;
  }

  getUserRoles(user: User): string {
    if (!user.roles?.length) return 'Sin roles';
    return user.roles.map(r => r.name).join(', ');
  }

  getRoleIcon(role: string): string {
    const icons: Record<string, string> = {
      'Administrador': 'admin_panel_settings',
      'Coordinador': 'supervisor_account',
      'Tutor Empresarial': 'corporate_fare',
      'Estudiante': 'school'
    };
    return icons[role] || 'person';
  }

  deleteUser(id: number): void {
    if (confirm('¿Está seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
      this.userService.delete(id).subscribe({
        next: () => this.loadUsers(),
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
          alert('Error al eliminar el usuario.');
        }
      });
    }
  }
}
