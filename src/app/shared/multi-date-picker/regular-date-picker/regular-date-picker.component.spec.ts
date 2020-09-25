import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularDatePickerComponent } from './regular-date-picker.component';

describe('RegularDatePickerComponent', () => {
  let component: RegularDatePickerComponent;
  let fixture: ComponentFixture<RegularDatePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegularDatePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegularDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
