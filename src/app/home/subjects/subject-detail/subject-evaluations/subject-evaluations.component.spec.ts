import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectEvaluationsComponent } from './subject-evaluations.component';

describe('SubjectEvaluationsComponent', () => {
  let component: SubjectEvaluationsComponent;
  let fixture: ComponentFixture<SubjectEvaluationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectEvaluationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectEvaluationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
