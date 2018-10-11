import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerCreateCourseComponent } from './manager-create-course.component';

describe('ManagerCreateCourseComponent', () => {
  let component: ManagerCreateCourseComponent;
  let fixture: ComponentFixture<ManagerCreateCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerCreateCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerCreateCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
