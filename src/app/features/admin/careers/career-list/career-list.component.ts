import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CareerService } from '../../../../core/services/career.service';
import { Career } from '../../../../core/models/career.model';

@Component({
  selector: 'app-career-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page-container">
      <!-- HEADER -->
      <div class="page-header">
        <div class="header-left">
          <span class="material-icons header-icon">school</span>
          <div>
            <h1>Carreras</h1>
            <p>Gestión de carreras del instituto</p>
          </div>
        </div>
        <a routerLink="/admin/careers/new" class="btn-primary">
          <span class="material-icons">add_circle</span>
          Nueva Carrera
        </a>
      </div>

      <!-- STATS -->
      <div class="stats-row">
        <div class="stat-box">
          <span class="material-icons">school</span>
          <div>
            <div class="stat-value">{{ careers.length }}</div>
            <div class="stat-label">Total Carreras</div>
          </div>
        </div>
        <div class="stat-box">
          <span class="material-icons">groups</span>
          <div>
            <div class="stat-value">{{ getTotalStudents() }}</div>
            <div class="stat-label">Estudiantes Vinculados</div>
          </div>
        </div>
        <div class="stat-box">
          <span class="material-icons">trending_up</span>
          <div>
            <div class="stat-value">{{ filteredCareers.length }}</div>
            <div class="stat-label">Resultados</div>
          </div>
        </div>
      </div>

      <!-- SEARCH -->
      <div class="search-section">
        <div class="search-box">
          <span class="material-icons">search</span>
          <input 
            type="text" 
            placeholder="Buscar carrera por nombre o código..."
            [(ngModel)]="searchTerm"
            (input)="filterCareers()"
          />
          <button *ngIf="searchTerm" (click)="clearSearch()" class="clear-btn">
            <span class="material-icons">close</span>
          </button>
        </div>
      </div>

      <!-- CAREERS TABLE -->
      <div class="table-card" *ngIf="!loading && filteredCareers.length > 0">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th><span class="material-icons">tag</span>Código</th>
                <th><span class="material-icons">school</span>Nombre</th>
                <th><span class="material-icons">description</span>Descripción</th>
                <th><span class="material-icons">groups</span>Estudiantes</th>
                <th class="actions-header"><span class="material-icons">settings</span>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let career of filteredCareers" class="table-row">
                <td><div class="code-badge">{{ career.code || '-' }}</div></td>
                <td>
                  <div class="career-name">
                    <span class="material-icons">school</span>
                    {{ career.name }}
                  </div>
                </td>
                <td>
                  <div class="description-cell">
                    {{ career.description || '-' }}
                  </div>
                </td>
                <td>
                  <div class="students-count">
                    <span class="material-icons">person</span>
                    {{ career.students?.length || 0 }}
                  </div>
                </td>
                <td class="actions-cell">
                  <div class="actions-group">
                    <button 
                      [routerLink]="['/admin/careers', career.id]"
                      class="btn-action view"
                      title="Ver detalles"
                    >
                      <span class="material-icons">visibility</span>
                    </button>
                    <button 
                      [routerLink]="['/admin/careers', career.id, 'edit']"
                      class="btn-action edit"
                      title="Editar"
                    >
                      <span class="material-icons">edit</span>
                    </button>
                    <button 
                      (click)="deleteCareer(career.id)"
                      class="btn-action delete"
                      title="Eliminar"
                    >
                      <span class="material-icons">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- EMPTY STATE -->
      <div class="empty-state" *ngIf="!loading && filteredCareers.length === 0">
        <span class="material-icons">{{ searchTerm ? 'search_off' : 'school' }}</span>
        <h3>{{ searchTerm ? 'No se encontraron resultados' : 'No hay carreras registradas' }}</h3>
        <p>{{ searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza agregando la primera carrera' }}</p>
        <a routerLink="/admin/careers/new" class="btn-primary" *ngIf="!searchTerm">
          <span class="material-icons">add_circle</span>
          Crear Primera Carrera
        </a>
        <button (click)="clearSearch()" class="btn-secondary" *ngIf="searchTerm">
          <span class="material-icons">clear</span>
          Limpiar Búsqueda
        </button>
      </div>

      <!-- LOADING -->
      <div class="loading-state" *ngIf="loading">
        <div class="spinner"></div>
        <p>Cargando carreras...</p>
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
  flex-wrap: wrap;
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

/* ================= BOTÓN ================= */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg,#2563eb,#1e40af);
  color: #fff;
  border-radius: 12px;
  font-weight: 700;
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

/* ================= GRID ================= */
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

/* ROLE */
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

  .btn-primary {
    width: 100%;
    justify-content: center;
  }
}
`]
})
export class CareerListComponent implements OnInit {
  private careerService = inject(CareerService);

  careers: Career[] = [];
  filteredCareers: Career[] = [];
  loading = true;
  searchTerm = '';

  ngOnInit(): void {
    this.loadCareers();
  }

  loadCareers(): void {
    this.loading = true;
    this.careerService.getAll().subscribe({
      next: (careers) => {
        this.careers = careers || [];
        this.filterCareers();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading careers:', error);
        this.loading = false;
      }
    });
  }

  filterCareers(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredCareers = !term
      ? this.careers
      : this.careers.filter(career =>
          career.name?.toLowerCase().includes(term) ||
          career.code?.toLowerCase().includes(term) ||
          career.description?.toLowerCase().includes(term)
        );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filterCareers();
  }

  getTotalStudents(): number {
    return this.careers.reduce((sum, c) => sum + (c.students?.length || 0), 0);
  }

  deleteCareer(id: number): void {
    if (confirm('¿Está seguro de eliminar esta carrera? Esta acción no se puede deshacer.')) {
      this.careerService.delete(id).subscribe({
        next: () => this.loadCareers(),
        error: (error) => {
          console.error('Error deleting career:', error);
          alert('Error al eliminar la carrera');
        }
      });
    }
  }
}