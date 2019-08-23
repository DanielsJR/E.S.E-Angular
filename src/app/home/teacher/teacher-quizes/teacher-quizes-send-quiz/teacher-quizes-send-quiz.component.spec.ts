import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherQuizesSendQuizComponent } from './teacher-quizes-send-quiz.component';

describe('TeacherQuizesSendQuizComponent', () => {
  let component: TeacherQuizesSendQuizComponent;
  let fixture: ComponentFixture<TeacherQuizesSendQuizComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherQuizesSendQuizComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherQuizesSendQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
