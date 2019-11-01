import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectSendQuizComponent } from './subject-send-quiz.component';

describe('SubjectSendQuizComponent', () => {
  let component: SubjectSendQuizComponent;
  let fixture: ComponentFixture<SubjectSendQuizComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectSendQuizComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectSendQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
