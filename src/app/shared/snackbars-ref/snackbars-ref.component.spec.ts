import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackbarsRefComponent } from './snackbars-ref.component';

describe('SnackbarsRefComponent', () => {
  let component: SnackbarsRefComponent;
  let fixture: ComponentFixture<SnackbarsRefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnackbarsRefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackbarsRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
