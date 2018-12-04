import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPassDialogRefComponent } from './reset-pass-dialog-ref.component';

describe('ResetPassDialogRefComponent', () => {
  let component: ResetPassDialogRefComponent;
  let fixture: ComponentFixture<ResetPassDialogRefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPassDialogRefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPassDialogRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
