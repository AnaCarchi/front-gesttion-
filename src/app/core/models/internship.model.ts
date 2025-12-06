import { Enterprise } from './enterprise.model';
import { User } from './user.model';
import { Student } from './student.model';
import { AcademicPeriod } from './academic-period.model';

export interface Internship {
  id?: number;
  name: string;
  description?: string;
  enterprise: Enterprise;
  startDate: Date;
  endDate: Date;
  users?: User[];
  status: InternshipStatus;
  type: InternshipType;
  
  // Propiedades adicionales necesarias
  student?: Student;
  company?: Enterprise;
  period?: AcademicPeriod;
  tutor?: User;
  totalHours?: number;
  completedHours?: number;
  activitiesDescription?: string;
}

export enum InternshipType {
  DUAL = 'DUAL',
  PREPROFESSIONAL = 'PREPROFESSIONAL'
}

export type InternshipStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
