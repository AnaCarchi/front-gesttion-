export interface Period {
  id: number;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: 'Activo' | 'Inactivo';
}