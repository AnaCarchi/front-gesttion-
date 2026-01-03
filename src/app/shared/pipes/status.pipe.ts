import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'status' })
export class StatusPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'APPROVED': return 'Aprobado';
      case 'FAILED': return 'Reprobado';
      default: return value;
    }
  }
}
