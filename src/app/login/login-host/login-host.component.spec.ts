import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginHostComponent } from './login-host.component';
import { LoginHostModule } from './login-host.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

describe('LoginHostComponent', () => {
  let component: LoginHostComponent;
  let fixture: ComponentFixture<LoginHostComponent>;

  let httpStub: Partial<HttpClient>;
  let routerStub: Partial<Router>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        LoginHostModule,
        BrowserAnimationsModule,
      ],
      providers: [
         { provide: HttpClient, useValue: httpStub },
         { provide: Router, useValue: routerStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
