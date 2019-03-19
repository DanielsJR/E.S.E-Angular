import { TestBed, inject } from '@angular/core/testing';
// Http testing module and mocking controller
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { API_SERVER, URI_TOKEN_AUTH } from '../../app.config';
import { HttpErrorResponse } from '@angular/common/http';

import { LoginService } from './login.service';
import { LoginModule } from './login.module';
import { Token } from '../../models/token';

const loginUrl = API_SERVER + URI_TOKEN_AUTH;

describe('Login Service', () => {
  let httpTestingController: HttpTestingController;
  let loginService: LoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        LoginModule,
        HttpClientTestingModule,
      ],

    });

    httpTestingController = TestBed.get(HttpTestingController);
    loginService = TestBed.get(LoginService);

  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', inject([LoginService], (service: LoginService) => {
    expect(service).toBeTruthy();
  }));

  it('should login', () => {
    const testToken: Token = { token: 'TestToken' };
    loginService.login('user01', 'password01').subscribe(token =>
      expect(token).toEqual(testToken)
    );

    const req = httpTestingController.expectOne(loginUrl);

    expect(req.request.method).toEqual('POST');

    req.flush(testToken);

  });

  it('should logout', () => {
    loginService.logout();
    expect(loginService.isAuth).toBeFalsy();
  });
});
