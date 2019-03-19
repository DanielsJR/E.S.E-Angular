import { TestBed, inject } from '@angular/core/testing';
// Http testing module and mocking controller
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';

import { UserBackendService } from './user-backend.service';
import { User } from '../models/user';
import { URI_MANAGERS, API_SERVER, URI_USERS, URI_USERNAME, URI_ROLE, URI_PASS, ROLE_MANAGER } from '../app.config';
import { managerTest, managerTest2 } from '../testing/models';

const userURL = API_SERVER + URI_USERS;
const uriRole = URI_MANAGERS;

describe('User Backend Service', () => {
  let httpTestingController: HttpTestingController;
  let userBackendService: UserBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],

      providers: [
        UserBackendService,
      ]

    });

    httpTestingController = TestBed.get(HttpTestingController);
    userBackendService = TestBed.get(UserBackendService);

  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', inject([UserBackendService], (service: UserBackendService) => {
    expect(service).toBeTruthy();
  }));

  it('should getUsers', () => {
    const usersTest: User[] = [managerTest, managerTest2];

    userBackendService.getUsers(uriRole)
      .subscribe(data => {
        expect(data).toEqual(usersTest);
        expect(data.length).toEqual(2);
      });

    const req = httpTestingController.expectOne(userURL + URI_MANAGERS);

    expect(req.request.method).toEqual('GET');

    req.flush(usersTest);

  });

  it('should create user', () => {
    userBackendService.create(managerTest, uriRole)
      .subscribe(data => expect(data).toEqual(managerTest));

    const req = httpTestingController.expectOne(userURL + URI_MANAGERS);

    expect(req.request.method).toEqual('POST');

    req.flush(managerTest);

  });

  it('should update user', () => {
    userBackendService.update(managerTest, uriRole)
      .subscribe(data => expect(data).toEqual(managerTest));

    const req = httpTestingController.expectOne(userURL + URI_MANAGERS + '/manager01');

    expect(req.request.method).toEqual('PUT');

    req.flush(managerTest);

  });

  it('should delete user', () => {
    userBackendService.delete(managerTest, uriRole)
      .subscribe(data => expect(data).toBeTruthy());

    const req = httpTestingController.expectOne(userURL + URI_MANAGERS + '/manager01');

    expect(req.request.method).toEqual('DELETE');

    req.flush(managerTest);

  });

  it('should get user by id', () => {
    userBackendService.getUserById('m01', uriRole)
      .subscribe(data => expect(data).toEqual(managerTest));

    const req = httpTestingController.expectOne(userURL + URI_MANAGERS + '/m01');

    expect(req.request.method).toEqual('GET');

    req.flush(managerTest);

  });

  it('should get user by username', () => {
    userBackendService.getUserByUsername('manager01', uriRole)
      .subscribe(data => expect(data).toEqual(managerTest));

    const req = httpTestingController.expectOne(userURL + URI_MANAGERS + URI_USERNAME + '/manager01');

    expect(req.request.method).toEqual('GET');

    req.flush(managerTest);

  });

  it('should get users by role', () => {
    const usersTest: User[] = [managerTest, managerTest2];

    userBackendService.getUsersByRole(ROLE_MANAGER, uriRole)
      .subscribe(data => {
        expect(data).toEqual(usersTest);
        expect(data.length).toEqual(2);
      });

    const req = httpTestingController.expectOne(userURL + URI_MANAGERS + '/'+ ROLE_MANAGER);

    expect(req.request.method).toEqual('GET');

    req.flush(usersTest);

  });

  it('should reset user pass', () => {
    userBackendService.resetUserPassword('manager01', 'manager01@ESE1', uriRole)
      .subscribe(data => expect(data).toBeTruthy());

    const req = httpTestingController.expectOne(`${userURL}${URI_MANAGERS}${URI_PASS}/manager01`);

    expect(req.request.method).toEqual('PATCH');

    req.flush(managerTest);

  });

  it('should set user roles', () => {
    let userRolesTest: User = {
      id: 'm01',
      username: 'manager01',
      roles: ['MANAGER', 'TEACHER']
    };
    const newRoles = ['MANAGER', 'TEACHER'];
    userBackendService.setRoles('manager01', newRoles, uriRole)
      .subscribe(data => {
        expect(data).toEqual(userRolesTest);
        expect(data.roles.length).toEqual(2);
      });

    const req = httpTestingController.expectOne(userURL + URI_MANAGERS + URI_ROLE + '/manager01');

    expect(req.request.method).toEqual('PATCH');

    req.flush(userRolesTest);

  });

  it('should get user by username secured', () => {
    userBackendService.getUserByUsernameSecured('manager01')
      .subscribe(data => expect(data).toEqual(managerTest));

    const req = httpTestingController.expectOne(userURL + '/manager01');

    expect(req.request.method).toEqual('GET');

    req.flush(managerTest);

  });

  it('should update user secured', () => {
    userBackendService.updateSecured(managerTest)
      .subscribe(data => expect(data).toEqual(managerTest));

    const req = httpTestingController.expectOne(userURL + '/manager01');

    expect(req.request.method).toEqual('PUT');

    req.flush(managerTest);

  });

  it('should set user pass secured', () => {
    const passwords = ['password', 'newPassword'];

    userBackendService.setUserPasswordSecured('manager01', passwords)
      .subscribe(data => expect(data).toBeTruthy());

    const req = httpTestingController.expectOne(userURL + '/manager01');

    expect(req.request.method).toEqual('PATCH');

    req.flush(managerTest);

  });

});


