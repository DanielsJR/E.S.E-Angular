import { TestBed, inject } from '@angular/core/testing';
// Http testing module and mocking controller
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { API_SERVER, URI_TOKEN_AUTH } from '../../app.config';
import { HttpErrorResponse } from '@angular/common/http';

import { LoginService } from './login.service';
import { LoginModule } from './login.module';
import { Token } from '../../models/token';
import { LocalStorageService } from '../../services/local-storage.service';
import { SessionStorageService } from '../../services/session-storage.service';

const loginUrl = API_SERVER + URI_TOKEN_AUTH;

describe('Login Service', () => {
  let httpTestingController: HttpTestingController;
  let loginService: LoginService;
  let localStorageService: LocalStorageService;
  let sessionStorageService: SessionStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        LoginModule,
        HttpClientTestingModule,
      ],

      providers: [
        LocalStorageService,
        SessionStorageService
      ]

    });

    httpTestingController = TestBed.get(HttpTestingController);
    loginService = TestBed.get(LoginService);
    localStorageService = TestBed.get(LocalStorageService);
    sessionStorageService = TestBed.get(SessionStorageService);

  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', inject([LoginService], (service: LoginService) => {
    expect(service).toBeTruthy();
  }));

  it('should login', () => {
    const testToken: Token = { token: 'TestToken' };
    loginService.login('user01', 'password01')
      .subscribe(token => expect(token).toEqual(testToken));

    const req = httpTestingController.expectOne(loginUrl);
    expect(req.request.method).toEqual('POST');

    req.flush(testToken);

  });

  it('should logout', () => {
    spyOn(localStorageService, 'clearLocalStorage');
    spyOn(sessionStorageService, 'clearSessionStorage');

    loginService.logout();

    expect(loginService.isAuth).toBeFalsy();
    expect(localStorageService.clearLocalStorage).toHaveBeenCalled();
    expect(sessionStorageService.clearSessionStorage).toHaveBeenCalled();

  });
});
