import { TrainingType } from './training-assignment.model';

export interface StudentFilter {
  careerId?: number;
  academicPeriodId?: number;
  trainingType?: TrainingType;
}
