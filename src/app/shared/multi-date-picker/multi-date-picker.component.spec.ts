import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiDatePickerComponent } from './multi-date-picker.component';

describe('MultiDataPickerComponent', () => {
  let component: MultiDatePickerComponent;
  let fixture: ComponentFixture<MultiDatePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiDatePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
