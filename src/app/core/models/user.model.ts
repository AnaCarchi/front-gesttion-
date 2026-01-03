import { Person } from './person.model';
import { Role } from './role.model';

export interface User {
  id: number;
  email: string;
  password: string;
  isActive: boolean;
  roles: Role[];
  person: Person;
  careerIds?: number[];
}
