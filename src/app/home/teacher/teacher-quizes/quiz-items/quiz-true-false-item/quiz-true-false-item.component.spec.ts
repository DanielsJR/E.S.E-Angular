import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizTrueFalseItemComponent } from './quiz-true-false-item.component';

describe('QuizTrueFalseItemComponent', () => {
  let component: QuizTrueFalseItemComponent;
  let fixture: ComponentFixture<QuizTrueFalseItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizTrueFalseItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizTrueFalseItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
