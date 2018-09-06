import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerCoursesDetailComponent } from './manager-courses-detail.component';

describe('ManagerCoursesDetailComponent', () => {
  let component: ManagerCoursesDetailComponent;
  let fixture: ComponentFixture<ManagerCoursesDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerCoursesDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerCoursesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
