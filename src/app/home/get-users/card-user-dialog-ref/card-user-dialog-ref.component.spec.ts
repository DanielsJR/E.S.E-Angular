import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardUserDialogRefComponent } from './card-user-dialog-ref.component';

describe('CardUserDialogRefComponent', () => {
  let component: CardUserDialogRefComponent;
  let fixture: ComponentFixture<CardUserDialogRefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardUserDialogRefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardUserDialogRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
