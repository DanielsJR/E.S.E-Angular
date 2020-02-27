import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginHostComponent } from './login-host.component';
import { LoginHostModule } from './login-host.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { httpStub, routerStub } from '../../testing/stubs';

describe('Login Host Component', () => {
  let component: LoginHostComponent;
  let fixture: ComponentFixture<LoginHostComponent>;


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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
