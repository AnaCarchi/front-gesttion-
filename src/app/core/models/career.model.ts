import { AcademicPeriod } from './academic-period.model';
import { Student } from './student.model'; 

export interface Career {
  id: number;
  code: string;
  name: string;
  description?: string;
  isDual: boolean;
  status: string;
  students?: Student[];               
  academicPeriod?: AcademicPeriod;
}
