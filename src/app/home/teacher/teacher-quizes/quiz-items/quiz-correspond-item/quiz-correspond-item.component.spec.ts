import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizCorrespondItemComponent } from './quiz-correspond-item.component';

describe('QuizCorrespondItemComponent', () => {
  let component: QuizCorrespondItemComponent;
  let fixture: ComponentFixture<QuizCorrespondItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizCorrespondItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizCorrespondItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
