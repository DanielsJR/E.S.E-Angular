import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerCoursesComponent } from './manager-courses.component';

describe('ManagerCoursesComponent', () => {
  let component: ManagerCoursesComponent;
  let fixture: ComponentFixture<ManagerCoursesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerCoursesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
