import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerSubjectGradesComponent } from './manager-subject-grades.component';

describe('ManagerSubjectGradesComponent', () => {
  let component: ManagerSubjectGradesComponent;
  let fixture: ComponentFixture<ManagerSubjectGradesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerSubjectGradesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerSubjectGradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
