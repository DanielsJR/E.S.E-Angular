import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerGetStudentDialogRefComponent } from './manager-get-student-dialog-ref.component';

describe('ManagerGetStudentDialogRefComponent', () => {
  let component: ManagerGetStudentDialogRefComponent;
  let fixture: ComponentFixture<ManagerGetStudentDialogRefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerGetStudentDialogRefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerGetStudentDialogRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
