import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoMiniFabComponent } from './logo-mini-fab.component';

describe('LogoMiniFabComponent', () => {
  let component: LogoMiniFabComponent;
  let fixture: ComponentFixture<LogoMiniFabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogoMiniFabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoMiniFabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
