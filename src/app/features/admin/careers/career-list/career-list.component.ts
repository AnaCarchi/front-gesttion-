import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CareerService } from '../../../../core/services/career.service';
import { Career } from '../../../../core/models';

@Component({
  selector: 'app-career-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="career-list">
      <div class="list-header">
        <div>
          <h1>Gestión de Carreras</h1>
          <p>Administración de carreras académicas</p>
        </div>
        <a routerLink="/admin/careers/new" class="btn btn-primary">
          ➕ Nueva Carrera
        </a>
      </div>

      <div class="loading-spinner" *ngIf="loading">
        <div class="spinner"></div>
        <p>Cargando carreras...</p>
      </div>

      <div class="careers-grid" *ngIf="!loading && careers.length > 0">
        <div class="career-card" *ngFor="let career of careers">
          <div class="career-header">
            <h3>{{ career.name }}</h3>
            <span class="career-status" [class.active]="career.status === 'Activo'">
              {{ career.status }}
            </span>
          </div>

          <div class="career-body">
            <p *ngIf="career.description">{{ career.description }}</p>
            
            <div class="career-info">
              <span class="info-badge" *ngIf="career.isDual">
                🎓 Carrera Dual
              </span>
              <span class="info-badge" *ngIf="!career.isDual">
                📚 Carrera Tradicional
              </span>
            </div>
          </div>

          <div class="career-actions">
            <a [routerLink]="['/admin/careers', career.id, 'edit']" class="btn btn-sm btn-outline">
              ✏️ Editar
            </a>
            <button class="btn btn-sm btn-danger" (click)="deleteCareer(career)">
              🗑️ Eliminar
            </button>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="!loading && careers.length === 0">
        <div class="empty-icon">🎓</div>
        <h3>No hay carreras registradas</h3>
        <p>Comienza creando la primera carrera</p>
        <a routerLink="/admin/careers/new" class="btn btn-primary">
          Crear Primera Carrera
        </a>
      </div>

      <div class="error-message" *ngIf="errorMessage">
        <span>⚠️</span>
        <span>{{ errorMessage }}</span>
      </div>
    </div>
  `,
  styles: [`
    /* Similar a period-list.component.ts */
  `]
})
export class CareerListComponent implements OnInit {
  private careerService = inject(CareerService);

  careers: Career[] = [];
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadCareers();
  }

  private loadCareers(): void {
    this.loading = true;
    this.careerService.getAll().subscribe({
      next: (careers) => {
        this.careers = careers;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar las carreras';
        this.loading = false;
      }
    });
  }

  deleteCareer(career: Career): void {
    if (confirm(`¿Eliminar la carrera "${career.name}"?`)) {
      this.careerService.delete(career.id).subscribe({
        next: () => {
          this.careers = this.careers.filter(c => c.id !== career.id);
        },
        error: (error) => {
          this.errorMessage = 'Error al eliminar la carrera';
        }
      });
    }
  }
}