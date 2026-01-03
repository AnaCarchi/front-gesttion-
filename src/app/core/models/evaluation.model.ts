export interface Evaluation {
  id: number;
  trainingAssignmentId: number;

  evaluatorId: number;
  grade: number;
  comments?: string;

  evaluatedAt: string;
}
