import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizMultipleSelectionItemComponent } from './quiz-multiple-selection-item.component';

describe('QuizMultipleSelectionItemComponent', () => {
  let component: QuizMultipleSelectionItemComponent;
  let fixture: ComponentFixture<QuizMultipleSelectionItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizMultipleSelectionItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizMultipleSelectionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
