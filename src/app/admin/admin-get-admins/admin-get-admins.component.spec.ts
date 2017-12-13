import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGetAdminsComponent } from './admin-get-admins.component';

describe('AdminGetAdminsComponent', () => {
  let component: AdminGetAdminsComponent;
  let fixture: ComponentFixture<AdminGetAdminsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminGetAdminsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminGetAdminsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
