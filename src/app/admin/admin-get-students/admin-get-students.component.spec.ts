import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGetStudentsComponent } from './admin-get-students.component';

describe('AdminGetStudentsComponent', () => {
  let component: AdminGetStudentsComponent;
  let fixture: ComponentFixture<AdminGetStudentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminGetStudentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminGetStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
