import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerDialogRefComponent } from './manager-dialog-ref.component';

describe('ManagerDialogRefComponent', () => {
  let component: ManagerDialogRefComponent;
  let fixture: ComponentFixture<ManagerDialogRefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerDialogRefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerDialogRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
