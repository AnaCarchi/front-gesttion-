import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TutorListComponent } from './tutor-list.component';

// Servicios reales
import { UserService } from '../../../core/services/user.service';
import { TrainingAssignmentService } from '../../../core/services/training-assignment.service';
import { AcademicPeriodService } from '../../../core/services/academic-period.service';
import { AuthService } from '../../../core/services/auth.service';

// Mocks simples
class UserServiceMock {
  getAll() { return []; }
  getById() { return undefined; }
}

class TrainingAssignmentServiceMock {
  getAll() { return []; }
}

class AcademicPeriodServiceMock {
  getAll() { return []; }
}

class AuthServiceMock {
  getCurrentUser() { return null; }
}

describe('TutorListComponent', () => {
  let component: TutorListComponent;
  let fixture: ComponentFixture<TutorListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutorListComponent],
      providers: [
        { provide: UserService, useClass: UserServiceMock },
        { provide: TrainingAssignmentService, useClass: TrainingAssignmentServiceMock },
        { provide: AcademicPeriodService, useClass: AcademicPeriodServiceMock },
        { provide: AuthService, useClass: AuthServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TutorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
