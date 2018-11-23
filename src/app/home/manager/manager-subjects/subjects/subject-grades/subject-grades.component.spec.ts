import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectGradesComponent } from './subject-grades.component';

describe('SubjectGradesComponent', () => {
  let component: SubjectGradesComponent;
  let fixture: ComponentFixture<SubjectGradesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectGradesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectGradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
