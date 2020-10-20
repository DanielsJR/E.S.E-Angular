import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizIncompleteTextItemComponent } from './quiz-incomplete-text-item.component';

describe('QuizIncompleteTextItemComponent', () => {
  let component: QuizIncompleteTextItemComponent;
  let fixture: ComponentFixture<QuizIncompleteTextItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizIncompleteTextItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizIncompleteTextItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
