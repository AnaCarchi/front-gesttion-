export type EvaluationFieldType = 'text' | 'number' | 'select' | 'textarea';

export interface EvaluationTemplateField {
  id: number;
  name: string;
  type: EvaluationFieldType;
  required: boolean;
  options?: string[];
}

export interface EvaluationTemplate {
  id: number;
  name: string;
  type: string;
  fields: EvaluationTemplateField[];
}
