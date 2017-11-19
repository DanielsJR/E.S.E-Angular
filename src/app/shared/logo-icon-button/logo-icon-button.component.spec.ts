import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoIconButtonComponent } from './logo-icon-button.component';

describe('LogoIconButtonComponent', () => {
  let component: LogoIconButtonComponent;
  let fixture: ComponentFixture<LogoIconButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogoIconButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoIconButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
