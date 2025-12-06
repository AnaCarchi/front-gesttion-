import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <!-- Los toasts aparecerán aquí -->
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
    }
  `]
})
export class ToastNotificationsComponent {}
