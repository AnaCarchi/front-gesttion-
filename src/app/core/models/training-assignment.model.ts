export type TrainingType =
  | 'VINCULATION'
  | 'DUAL_PRACTICE'
  | 'PREPROFESSIONAL_PRACTICE';

export type TrainingStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'FAILED';

export interface TrainingDocument {
  name: string;
  uploadedAt: string;
}

export interface TrainingAssignment {
  id: number;

  studentId: number;
  studentName: string;

  careerId: number;
  academicPeriodId: number;

  type: TrainingType;

  enterpriseId?: number;
  enterpriseName?: string;

  tutorEnterpriseId?: number;
  tutorAcademicId?: number;

  grade?: number;
  status?: TrainingStatus;

  hours?: number; // solo vinculación
  documents?: TrainingDocument[];
}
