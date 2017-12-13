import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGetTeachersComponent } from './admin-get-teachers.component';

describe('AdminGetTeachersComponent', () => {
  let component: AdminGetTeachersComponent;
  let fixture: ComponentFixture<AdminGetTeachersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminGetTeachersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminGetTeachersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
