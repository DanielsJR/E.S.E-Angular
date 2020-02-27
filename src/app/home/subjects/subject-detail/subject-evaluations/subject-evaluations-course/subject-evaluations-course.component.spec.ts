import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectEvaluationsCourseComponent } from './subject-evaluations-course.component';

describe('SubjectEvaluationsCourseComponent', () => {
  let component: SubjectEvaluationsCourseComponent;
  let fixture: ComponentFixture<SubjectEvaluationsCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectEvaluationsCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectEvaluationsCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
