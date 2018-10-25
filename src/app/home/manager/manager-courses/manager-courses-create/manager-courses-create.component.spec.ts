import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerCoursesCreateComponent } from './manager-courses-create.component';

describe('ManagerCreateCourseComponent', () => {
  let component: ManagerCoursesCreateComponent;
  let fixture: ComponentFixture<ManagerCoursesCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerCoursesCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerCoursesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
