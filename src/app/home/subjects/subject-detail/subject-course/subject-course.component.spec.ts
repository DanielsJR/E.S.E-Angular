import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectCourseComponent } from './subject-course.component';

describe('SubjectCourseComponent', () => {
  let component: SubjectCourseComponent;
  let fixture: ComponentFixture<SubjectCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
