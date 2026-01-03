export interface Internship {
  id: number;

  trainingAssignmentId: number;

  startDate: string;
  endDate: string;

  hours: number;
  description?: string;
}
