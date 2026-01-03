export interface Student {
  id: number;
  userId: number;
  careerId: number;
  academicPeriodId: number;
  isActive?: boolean;
  hasVinculation?: boolean;
  hasDualPractice?: boolean;
  hasPreprofessionalPractice?: boolean;
}
