import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentSubjectsQuizComponent } from './student-subjects-quiz.component';

describe('StudentSubjectsQuizComponent', () => {
  let component: StudentSubjectsQuizComponent;
  let fixture: ComponentFixture<StudentSubjectsQuizComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentSubjectsQuizComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentSubjectsQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
