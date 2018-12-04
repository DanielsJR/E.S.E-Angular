import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectsCoursesComponent } from './subjects-courses.component';

describe('SubjectsCoursesComponent', () => {
  let component: SubjectsCoursesComponent;
  let fixture: ComponentFixture<SubjectsCoursesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectsCoursesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectsCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
