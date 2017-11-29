import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGetUsersComponent } from './admin-get-users.component';

describe('AdminGetUsersComponent', () => {
  let component: AdminGetUsersComponent;
  let fixture: ComponentFixture<AdminGetUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminGetUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminGetUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
