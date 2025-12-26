import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorAssignmentComponent } from './tutor-assignment.component';

describe('TutorAssignmentComponent', () => {
  let component: TutorAssignmentComponent;
  let fixture: ComponentFixture<TutorAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutorAssignmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TutorAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
