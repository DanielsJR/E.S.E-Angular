import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizStudentDetailComponent } from './quiz-student-detail.component';

describe('QuizStudentDetailComponent', () => {
  let component: QuizStudentDetailComponent;
  let fixture: ComponentFixture<QuizStudentDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizStudentDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizStudentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
