export interface Evaluation {
  id: number;
  trainingAssignmentId: number;

  evaluatorId: number;
  grade: number;
  comments?: string;

  evaluatedAt: string;
  templateId?: number;
  fields?: Array<{ fieldId: number; value: string }>;
  subjectType?: string;
  studentId?: number;
}
