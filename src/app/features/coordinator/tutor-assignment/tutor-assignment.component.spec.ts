import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TutorAssignmentComponent } from './tutor-assignment.component';

// Servicios reales
import { UserService } from '../../../core/services/user.service';
import { TrainingAssignmentService } from '../../../core/services/training-assignment.service';
import { AcademicPeriodService } from '../../../core/services/academic-period.service';
import { CareerService } from '../../../core/services/career.service';

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

class CareerServiceMock {
  getById() { return undefined; }
}

describe('TutorAssignmentComponent', () => {
  let component: TutorAssignmentComponent;
  let fixture: ComponentFixture<TutorAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutorAssignmentComponent],
      providers: [
        { provide: UserService, useClass: UserServiceMock },
        { provide: TrainingAssignmentService, useClass: TrainingAssignmentServiceMock },
        { provide: AcademicPeriodService, useClass: AcademicPeriodServiceMock },
        { provide: CareerService, useClass: CareerServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TutorAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
