import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <h2>Acceso no autorizado</h2>
    <p>No tienes permisos para acceder a esta página.</p>
    <a routerLink="/">Volver</a>
  `,
  styles: [`
    h2 { color: #dc2626; }
  `]
})
export class UnauthorizedComponent {}
