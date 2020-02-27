import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizStudentComponent } from './quiz-student.component';

describe('QuizStudentComponent', () => {
  let component: QuizStudentComponent;
  let fixture: ComponentFixture<QuizStudentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizStudentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
