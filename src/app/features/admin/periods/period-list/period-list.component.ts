import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PeriodService } from '../../../../core/services/period.service';
import { AcademicPeriod } from '../../../../core/models/academic-period.model';

@Component({
  selector: 'app-period-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page-container">
      <!-- HEADER -->
      <div class="page-header">
        <div class="header-left">
          <span class="material-icons header-icon">event_note</span>
          <div>
            <h1>Periodos Académicos</h1>
            <p>Gestión de periodos del sistema</p>
          </div>
        </div>
        <a routerLink="/admin/periods/new" class="btn-primary">
          <span class="material-icons">add_circle</span>
          Nuevo Periodo
        </a>
      </div>

      <!-- FILTERS -->
      <div class="filters-section">
        <div class="search-box">
          <span class="material-icons">search</span>
          <input 
            type="text" 
            placeholder="Buscar periodo..."
            [(ngModel)]="searchTerm"
            (input)="filterPeriods()"
          />
        </div>

        <div class="filter-tabs">
          <button 
            class="tab" 
            [class.active]="filterStatus === 'all'"
            (click)="setFilter('all')"
          >
            <span class="material-icons">all_inclusive</span>
            Todos ({{ periods.length }})
          </button>
          <button 
            class="tab" 
            [class.active]="filterStatus === 'Activo'"
            (click)="setFilter('Activo')"
          >
            <span class="material-icons">check_circle</span>
            Activos ({{ countByStatus('Activo') }})
          </button>
          <button 
            class="tab" 
            [class.active]="filterStatus === 'Inactivo'"
            (click)="setFilter('Inactivo')"
          >
            <span class="material-icons">cancel</span>
            Inactivos ({{ countByStatus('Inactivo') }})
          </button>
        </div>
      </div>

      <!-- PERIODS GRID -->
      <div class="periods-grid" *ngIf="!loading && filteredPeriods.length > 0">
        <div class="period-card" *ngFor="let period of filteredPeriods">
          <div class="card-header">
            <div class="period-info">
              <h3>{{ period.name }}</h3>
              <div class="period-dates">
                <span class="material-icons">calendar_today</span>
                {{ period.startDate | date:'dd/MM/yyyy' }} - {{ period.endDate | date:'dd/MM/yyyy' }}
              </div>
            </div>
            <span class="status-badge" [class]="period.status.toLowerCase()">
              <span class="material-icons">
                {{ period.status === 'Activo' ? 'check_circle' : 'cancel' }}
              </span>
              {{ period.status }}
            </span>
          </div>

          <div class="card-body">
            <div class="info-row">
              <span class="material-icons">description</span>
              <span>{{ period.description || 'Sin descripción' }}</span>
            </div>
            <div class="info-row">
              <span class="material-icons">school</span>
              <span>{{ period.careers?.length || 0 }} carreras vinculadas</span>
            </div>
          </div>

          <div class="card-footer">
            <a [routerLink]="['/admin/periods', period.id]" class="btn-action view">
              <span class="material-icons">visibility</span>
              Ver
            </a>
            <a [routerLink]="['/admin/periods', period.id, 'edit']" class="btn-action edit">
              <span class="material-icons">edit</span>
              Editar
            </a>
            <a [routerLink]="['/admin/periods', period.id, 'careers']" class="btn-action assign">
              <span class="material-icons">school</span>
              Carreras
            </a>
            <button (click)="deletePeriod(period.id)" class="btn-action delete">
              <span class="material-icons">delete</span>
              Eliminar
            </button>
          </div>
        </div>
      </div>

      <!-- EMPTY STATE -->
      <div class="empty-state" *ngIf="!loading && filteredPeriods.length === 0">
        <span class="material-icons">event_busy</span>
        <h3>No hay periodos</h3>
        <p>{{ searchTerm ? 'No se encontraron resultados' : 'Comienza creando un nuevo periodo académico' }}</p>
        <a routerLink="/admin/periods/new" class="btn-primary" *ngIf="!searchTerm">
          <span class="material-icons">add_circle</span>
          Crear Primer Periodo
        </a>
      </div>

      <!-- LOADING -->
      <div class="loading-state" *ngIf="loading">
        <div class="spinner"></div>
        <p>Cargando periodos...</p>
      </div>
    </div>
  `,
styles: [`
/* ================= CONTENEDOR GENERAL ================= */
.page-container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 48px 28px;
  min-height: 100vh;
  background-image:
    linear-gradient(
      rgba(15, 23, 42, 0.85),
      rgba(15, 23, 42, 0.9)
    ),
    url('https://yavirac.edu.ec/wp-content/uploads/2024/05/vision.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  color: #ffffff;
  font-family: 'Poppins', sans-serif;
}

/* ================= ENCABEZADO ================= */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.15);
  padding-bottom: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 18px;
}

.header-icon {
  font-size: 48px;
  color: #fbbf24;
}

.page-header h1 {
  font-size: 34px;
  font-weight: 800;
  margin: 0;
}

.page-header p {
  color: #cbd5e1;
  margin: 4px 0 0;
  font-size: 15px;
}

/* ================= BOTÓN PRINCIPAL ================= */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  background: linear-gradient(135deg, #2563eb, #1e40af);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(37, 99, 235, 0.3);
  transition: all 0.3s ease;
}
.btn-primary:hover {
  background: linear-gradient(135deg, #f97316, #ea580c);
  transform: translateY(-2px);
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.4);
}

/* ================= FILTROS ================= */
.filters-section {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 32px;
}

.search-box {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 10px 14px;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

.search-box input {
  flex: 1;
  border: none;
  background: transparent;
  color: #fff;
  font-size: 15px;
  padding-left: 8px;
  outline: none;
}

.filter-tabs {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.tab {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 9px 18px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}
.tab.active {
  background: linear-gradient(135deg, #2563eb, #1e40af);
}
.tab:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

/* ================= TARJETAS DE PERIODOS ================= */
.periods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 24px;
}

.period-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 18px;
  padding: 26px;
  color: #0f172a;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.period-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 25px 45px rgba(0, 0, 0, 0.4);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.period-info h3 {
  margin: 0;
  font-weight: 800;
  color: #1e3a8a;
}

.period-dates {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #334155;
  font-size: 14px;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: 999px;
  padding: 5px 12px;
  font-weight: 700;
  font-size: 13px;
}
.status-badge.activo {
  background: #d1fae5;
  color: #065f46;
}
.status-badge.inactivo {
  background: #fee2e2;
  color: #991b1b;
}

/* ================= ACCIONES ================= */
.card-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: none;
  border-radius: 8px;
  padding: 7px 12px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 14px;
}

.view { background: #e0f2fe; color: #1e40af; }
.edit { background: #fef3c7; color: #92400e; }
.assign { background: #d1fae5; color: #065f46; }
.delete { background: #fee2e2; color: #991b1b; }

.btn-action:hover {
  transform: translateY(-3px);
  filter: brightness(1.05);
}

/* ================= ESTADOS ================= */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-state .material-icons {
  font-size: 64px;
  color: #fbbf24;
}

.empty-state h3 {
  margin: 16px 0 6px;
  font-size: 26px;
  color: #ffffff;
  font-weight: 700;
}

.empty-state p {
  color: #e2e8f0;
  font-size: 15px;
}

.spinner-small {
  width: 34px;
  height: 34px;
  border: 4px solid rgba(255,255,255,0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto;
}

.loading-state {
  text-align: center;
  padding: 80px 20px;
  color: #fff;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ================= RESPONSIVE ================= */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    gap: 12px;
  }

  .periods-grid {
    grid-template-columns: 1fr;
  }

  .btn-primary {
    width: 100%;
    justify-content: center;
  }
}
`]

})
export class PeriodListComponent implements OnInit {
  private periodService = inject(PeriodService);

  periods: AcademicPeriod[] = [];
  filteredPeriods: AcademicPeriod[] = [];
  loading = true;
  searchTerm = '';
  filterStatus: 'all' | 'Activo' | 'Inactivo' = 'all';

  ngOnInit(): void {
    this.loadPeriods();
  }

  loadPeriods(): void {
    this.loading = true;
    this.periodService.getAll().subscribe({
      next: (periods) => {
        this.periods = periods ?? [];
        this.filterPeriods();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading periods:', error);
        this.loading = false;
      }
    });
  }

  filterPeriods(): void {
    let result = [...this.periods];

    if (this.filterStatus !== 'all') {
      result = result.filter(p => p.status === this.filterStatus);
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(p => 
        (p.name?.toLowerCase() || '').includes(term) ||
        (p.description?.toLowerCase() || '').includes(term)
      );
    }

    this.filteredPeriods = result;
  }

  setFilter(status: 'all' | 'Activo' | 'Inactivo'): void {
    this.filterStatus = status;
    this.filterPeriods();
  }

  countByStatus(status: string): number {
    return this.periods.filter(p => p.status === status).length;
  }

  deletePeriod(id: number): void {
    if (confirm('¿Está seguro de eliminar este periodo? Esta acción no se puede deshacer.')) {
      this.periodService.delete(id).subscribe({
        next: () => this.loadPeriods(),
        error: (error) => {
          console.error('Error deleting period:', error);
          alert('Error al eliminar el periodo');
        }
      });
    }
  }
}
