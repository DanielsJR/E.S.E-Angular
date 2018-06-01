import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetPassDialogRefComponent } from './set-pass-dialog-ref.component';

describe('SetPassDialogRefComponent', () => {
  let component: SetPassDialogRefComponent;
  let fixture: ComponentFixture<SetPassDialogRefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetPassDialogRefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetPassDialogRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
