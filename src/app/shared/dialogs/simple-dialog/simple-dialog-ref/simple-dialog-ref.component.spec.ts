import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleDialogRefComponent } from './simple-dialog-ref.component';

describe('SimpleDialogRefComponent', () => {
  let component: SimpleDialogRefComponent;
  let fixture: ComponentFixture<SimpleDialogRefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleDialogRefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleDialogRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
