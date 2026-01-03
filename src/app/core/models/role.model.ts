export type RoleName =
  | 'ADMIN'
  | 'COORDINATOR'
  | 'TUTOR_ACADEMIC'
  | 'TUTOR_ENTERPRISE'
  | 'STUDENT';

export interface Role {
  id: number;
  name: RoleName;
}
