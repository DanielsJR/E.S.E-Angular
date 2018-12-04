import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetRolesDialogRefComponent } from './set-roles-dialog-ref.component';

describe('SetRolesDialogRefComponent', () => {
  let component: SetRolesDialogRefComponent;
  let fixture: ComponentFixture<SetRolesDialogRefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetRolesDialogRefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetRolesDialogRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
