import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectsQuizComponent } from './subjects-quiz.component';

describe('SubjectsQuizComponent', () => {
  let component: SubjectsQuizComponent;
  let fixture: ComponentFixture<SubjectsQuizComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectsQuizComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectsQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
