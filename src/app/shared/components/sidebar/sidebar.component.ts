import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <aside class="sidebar">
      <a *ngFor="let item of items" [routerLink]="item.path">
        {{ item.label }}
      </a>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 220px;
      background: #f3f4f6;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    a {
      text-decoration: none;
      font-weight: 600;
      color: #1f2937;
    }
  `]
})
export class SidebarComponent {
  @Input() items: { label: string; path: string }[] = [];
}
