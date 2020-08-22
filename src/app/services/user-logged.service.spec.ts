import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UserLoggedService } from './user-logged.service';
import { UserBackendService } from './user-backend.service';
import { HttpClient } from 'selenium-webdriver/http';
import { httpStub } from '../testing/stubs';
import { asyncData } from '../testing/async-helpers';
import { adminTest } from '../testing/models';
import { User } from '../models/user';
import { LocalStorageService } from './local-storage.service';
import { ROLE_MANAGER, ROLE_ADMIN, ROLE_STUDENT, ROLE_TEACHER, URI_ADMIN, URI_STUDENT, URI_MANAGER, URI_TEACHER } from '../app.config';


describe('User Logged Service', () => {
  let userLoggedService: UserLoggedService;
  let userBackendServiceSpy: jasmine.SpyObj<UserBackendService>;

  let localStorageService: LocalStorageService;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('UserBackendService', ['getUserByUsernameSecured']);
     
    TestBed.configureTestingModule({
      providers: [
        UserLoggedService,
        LocalStorageService,
        { provide: UserBackendService, useValue: spy },
        { provide: HttpClient, useValue: httpStub },
      ]

    });

    userLoggedService = TestBed.get(UserLoggedService);
    userBackendServiceSpy = TestBed.get(UserBackendService);
    localStorageService = TestBed.get(LocalStorageService);
  
  });

  afterEach(() => {

  });

  it('should be created', () => {
    expect(userLoggedService).toBeTruthy();
  });

  it('should get User from Backend', fakeAsync(() => {
    spyOn(userLoggedService, 'userLoggedNext').and.callThrough();
    userBackendServiceSpy.getUserByUsernameSecured.and.returnValue(asyncData(adminTest));

    let user: User;
    userLoggedService.getUserFromBackEnd().subscribe(data => user = data);
    tick();

    expect(user).toEqual(adminTest);
    expect(userLoggedService.userLoggedNext).toHaveBeenCalled();
  }));

  it('should emit user observable', fakeAsync(() => {
    let user: User;
    userLoggedService.userLogged$.subscribe(data => user = data);

    userLoggedService.userLoggedNext(adminTest);
    tick();
    expect(user).toEqual(adminTest);

  }));

  it('should check role', () => {
    let spy = spyOn(localStorageService, 'getTokenRoles').and.returnValue([ROLE_ADMIN])
    expect(userLoggedService.isAdmin()).toBeTruthy(ROLE_ADMIN);

    spy.and.returnValue([ROLE_MANAGER]);
    expect(userLoggedService.isManager()).toBeTruthy(ROLE_MANAGER);

    spy.and.returnValue([ROLE_TEACHER]);
    expect(userLoggedService.isTeacher()).toBeTruthy(ROLE_TEACHER);

    spy.and.returnValue([ROLE_STUDENT]);
    expect(userLoggedService.isStudent()).toBeTruthy(ROLE_STUDENT);

    spy.and.returnValue([ROLE_MANAGER, ROLE_TEACHER]);
    expect(userLoggedService.isAdmin()).toBeFalsy(ROLE_ADMIN)
    expect(userLoggedService.isManager()).toBeTruthy(ROLE_MANAGER);
    expect(userLoggedService.isTeacher()).toBeTruthy(ROLE_TEACHER);
    expect(userLoggedService.isStudent()).toBeFalsy(ROLE_STUDENT);

  });

  it('should check on hasPrivileges', () => {
    expect(userLoggedService.hasPrivileges()).toBeFalsy();
    let spy = spyOn(localStorageService, 'getTokenRoles').and.returnValue([ROLE_ADMIN])
    expect(userLoggedService.hasPrivileges()).toBeTruthy();

    spy.and.returnValue([ROLE_MANAGER]);
    expect(userLoggedService.hasPrivileges()).toBeTruthy();

    spy.and.returnValue([ROLE_TEACHER]);
    expect(userLoggedService.hasPrivileges()).toBeTruthy();

    spy.and.returnValue([ROLE_STUDENT]);
    expect(userLoggedService.hasPrivileges()).toBeTruthy();

    spy.and.returnValue([]);
    expect(userLoggedService.hasPrivileges()).toBeFalsy();

  });

  it('should getPrivilege', () => {
    expect(userLoggedService.getPrivilege()).toEqual('no role');
    let spy = spyOn(localStorageService, 'getTokenRoles').and.returnValue([ROLE_ADMIN, ROLE_MANAGER]);
    expect(userLoggedService.getPrivilege()).toEqual(ROLE_ADMIN);

    spy.and.returnValue([ROLE_MANAGER, ROLE_TEACHER]);
    expect(userLoggedService.getPrivilege()).toEqual(ROLE_MANAGER);

    spy.and.returnValue([ROLE_TEACHER]);
    expect(userLoggedService.getPrivilege()).toEqual(ROLE_TEACHER);

    spy.and.returnValue([ROLE_STUDENT]);
    expect(userLoggedService.getPrivilege()).toEqual(ROLE_STUDENT);

  });

  it('should getUriRole', () => {
    let spy = spyOn(localStorageService, 'getTokenRoles').and.returnValue([ROLE_ADMIN, ROLE_MANAGER]);
    expect(userLoggedService.getUriRole()).toEqual(URI_ADMIN);

    spy.and.returnValue([ROLE_MANAGER]);
    expect(userLoggedService.getUriRole()).toEqual(URI_MANAGER);

    spy.and.returnValue([ROLE_TEACHER]);
    expect(userLoggedService.getUriRole()).toEqual(URI_TEACHER);

    spy.and.returnValue([ROLE_STUDENT]);
    expect(userLoggedService.getUriRole()).toEqual(URI_STUDENT);

  });



});


