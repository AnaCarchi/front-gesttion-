import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <h1>404</h1>
    <p>Página no encontrada</p>
    <a routerLink="/">Volver al inicio</a>
  `,
  styles: [`
    h1 { font-size: 64px; }
    p { color: #6b7280; }
  `]
})
export class NotFoundComponent {}
