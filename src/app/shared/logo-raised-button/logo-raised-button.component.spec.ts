import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoRaisedButtonComponent } from './logo-raised-button.component';

describe('LogoRaisedButtonComponent', () => {
  let component: LogoRaisedButtonComponent;
  let fixture: ComponentFixture<LogoRaisedButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogoRaisedButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoRaisedButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
