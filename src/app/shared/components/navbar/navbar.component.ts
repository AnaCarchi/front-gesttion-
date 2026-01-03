import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar">
      <span class="title">Sistema Yavirac</span>
      <button (click)="logout()">Cerrar sesión</button>
    </nav>
  `,
  styles: [`
    .navbar {
      background: #1f2937;
      color: white;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    button {
      background: #ef4444;
      border: none;
      color: white;
      padding: 6px 14px;
      border-radius: 6px;
      cursor: pointer;
    }
  `]
})
export class NavbarComponent {
  private auth = inject(AuthService);

  logout(): void {
    this.auth.logout();
  }
}
