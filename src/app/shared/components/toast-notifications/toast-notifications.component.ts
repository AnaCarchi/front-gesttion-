import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast" *ngIf="message">
      {{ message }}
    </div>
  `,
  styles: [`
    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #2563eb;
      color: white;
      padding: 12px 18px;
      border-radius: 8px;
    }
  `]
})
export class ToastNotificationsComponent {
  message = '';
}
