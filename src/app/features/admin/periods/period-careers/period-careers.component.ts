import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { CareerService } from '../../../../core/services/career.service';
import { Career } from '../../../../core/models';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-period-careers',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  template: `
    <h2>Carreras del Periodo</h2>

    <div class="grid">
      <mat-card *ngFor="let career of careers">
        <mat-card-title>{{ career.name }}</mat-card-title>

        <mat-card-content>
          <p>
            <mat-icon>school</mat-icon>
            {{ career.name }}
          </p>
          
          <p *ngIf="career.hasVinculation">
            <mat-icon>handshake</mat-icon>
            Vinculación
          </p>

          <p *ngIf="career.hasDualInternship">
            <mat-icon>engineering</mat-icon>
            Prácticas Dual
          </p>

          <p *ngIf="career.hasPreprofessional">
            <mat-icon>work</mat-icon>
            Prácticas Preprofesionales
          </p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 16px;
    }

    mat-card p {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 4px 0;
    }
  `]
})
export class PeriodCareersComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private careerService = inject(CareerService);

  careers: Career[] = [];

  ngOnInit(): void {
    const periodId = Number(this.route.snapshot.paramMap.get('id'));
    this.careers = this.careerService.getByPeriod(periodId);
  }
}
