import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoFabComponent } from './logo-fab.component';

describe('LogoFabComponent', () => {
  let component: LogoFabComponent;
  let fixture: ComponentFixture<LogoFabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogoFabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoFabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
