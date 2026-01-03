export type CareerType = 'DUAL' | 'TRADITIONAL';

export interface Career {
  id: number;
  name: string;
  academicPeriodId: number;

  hasVinculation: boolean;
  hasDualInternship: boolean;
  hasPreprofessional: boolean;
}
