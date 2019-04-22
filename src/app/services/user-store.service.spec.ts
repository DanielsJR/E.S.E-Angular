import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { managerTest, managerTest2, teacherTest2, teacherTest, studentTest, studentTest2 } from '../testing/models';
import { HttpClient } from '@angular/common/http';
import { httpStub } from '../testing/stubs';
import { asyncData } from '../testing/async-helpers';
import { UserStoreService } from './user-store.service';
import { UserBackendService } from './user-backend.service';
import { User } from '../models/user';
import { ROLE_MANAGER, ROLE_TEACHER } from '../app.config';
import { deepCopy } from '../shared/functions/deepCopy';


describe('User Store Service', () => {
  let userStoreService: UserStoreService;
  let userBackendServiceSpy: jasmine.SpyObj<UserBackendService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('UserBackendService', [
      'getUsers',
      'getUserById',
      'create',
      'update',
      'delete',
      'setRoles'
    ]);

    TestBed.configureTestingModule({
      providers: [
        UserStoreService,
        { provide: UserBackendService, useValue: spy },
        { provide: HttpClient, useValue: httpStub },

      ]

    });

    userStoreService = TestBed.get(UserStoreService);
    userBackendServiceSpy = TestBed.get(UserBackendService);
  });

  afterEach(() => {

  });

  //MANAGERS********************************
  it('should be created', inject([UserStoreService], (service: UserStoreService) => {
    expect(service).toBeTruthy();
  }));

  it('should get Managers', fakeAsync(() => {
    let users: User[];
    userStoreService.managers$.subscribe(data => users = data);

    let isLoading;
    userStoreService.isLoadingGetManagers$.subscribe(data => isLoading = data);

    const managersTest: User[] = [managerTest, managerTest2];
    userBackendServiceSpy.getUsers.and.returnValue(asyncData(managersTest));
    userStoreService.loadAllManagers();

    expect(isLoading).toBeTruthy();
    tick();
    expect(users).toEqual(managersTest);
    expect(users.length).toEqual(2);
    expect(isLoading).toBeFalsy();

  }));

  it('should create Manager', fakeAsync(() => {
    let users: User[];
    userStoreService.managers$.subscribe(data => users = data);

    const managersTest: User[] = [managerTest];
    userBackendServiceSpy.getUsers.and.returnValue(asyncData(managersTest));
    userStoreService.loadAllManagers();
    tick();

    userBackendServiceSpy.create.and.returnValue(asyncData(managerTest2));
    let user: User;
    userStoreService.createManager(managerTest2).subscribe(data => user = data);

    tick();
    expect(user).toEqual(managerTest2);
    expect(users[0]).toEqual(managerTest);
    expect(users[1]).toEqual(user);
    expect(users.length).toEqual(2);
  }));

  it('should update Manager', fakeAsync(() => {
    let users: User[];
    userStoreService.managers$.subscribe(data => users = data);

    const managersTest: User[] = [managerTest];
    userBackendServiceSpy.getUsers.and.returnValue(asyncData(managersTest));
    userStoreService.loadAllManagers();
    tick();

    userBackendServiceSpy.update.and.returnValue(asyncData(managerTest));

    let user: User;
    userStoreService.updateManager(managerTest).subscribe(data => user = data);

    tick();
    expect(user).toEqual(managerTest);
    expect(users[0]).toEqual(user);
    expect(users.length).toEqual(1);
  }));

  it('should delete Manager', fakeAsync(() => {
    let users: User[];
    userStoreService.managers$.subscribe(data => users = data);

    const managersTest: User[] = [managerTest];
    userBackendServiceSpy.getUsers.and.returnValue(asyncData(managersTest));
    userStoreService.loadAllManagers();
    tick();

    userBackendServiceSpy.delete.and.returnValue(asyncData(managerTest));

    let deleted: boolean;
    userStoreService.deleteManager(managerTest).subscribe(data => deleted = data);

    expect(users.length).toEqual(1);
    tick();
    expect(deleted).toBeTruthy();
    expect(users.length).toEqual(0);
  }));

  it('should set Manager Roles', fakeAsync(() => {
    let users: User[];
    userStoreService.managers$.subscribe(data => users = data);

    const managersTest: User[] = [managerTest];
    userBackendServiceSpy.getUsers.and.returnValue(asyncData(managersTest));
    userStoreService.loadAllManagers();
    tick();

    spyOn(userStoreService, 'updateInTeacherDataStore').and.callThrough();

    let userModif: User = deepCopy(managerTest);
    userModif.roles = [ROLE_MANAGER, ROLE_TEACHER];
    userBackendServiceSpy.setRoles.and.returnValue(asyncData(userModif));

    let user: User;
    userStoreService.setManagerRoles(userModif).subscribe(data => user = data);
    tick();

    expect(users[0]).toEqual(user);
    expect(users.length).toEqual(1);
    expect(users[0].roles).toContain(ROLE_TEACHER);
    expect(userStoreService.updateInTeacherDataStore).toHaveBeenCalled();

    userBackendServiceSpy.setRoles.and.returnValue(asyncData(managerTest2));
    userStoreService.setManagerRoles(managerTest2).subscribe();
    tick();
    expect(users.length).toEqual(1);//not found
    expect(users[0]).toEqual(user);


  }));

  it('should update In ManagerDataStore', fakeAsync(() => {
    let users: User[];
    userStoreService.managers$.subscribe(data => users = data);

    const managersTest: User[] = [managerTest];
    userBackendServiceSpy.getUsers.and.returnValue(asyncData(managersTest));
    userStoreService.loadAllManagers();
    tick();

    //found && includes managerRole (updates it)
    userStoreService.updateInManagerDataStore(managerTest);
    tick();
    expect(users[0]).toEqual(managerTest);
    expect(users.length).toEqual(1);

    //not found && includes managerRole (adds it)
    userStoreService.updateInManagerDataStore(managerTest2);
    tick();
    expect(users[1]).toEqual(managerTest2);
    expect(users.length).toEqual(2);

    //not found and not includes role
    userStoreService.updateInManagerDataStore(teacherTest);
    tick();
    expect(users.length).toEqual(2);

    //found && not includes managerRole (splices it)
    let userModif = deepCopy(managerTest);
    userModif.roles = [ROLE_TEACHER];
    userStoreService.updateInManagerDataStore(userModif);
    tick();
    expect(users[0]).toEqual(managerTest2);
    expect(users.length).toEqual(1);
  }));

  it('should delete In ManagerDataStore', fakeAsync(() => {
    let users: User[];
    userStoreService.managers$.subscribe(data => users = data);

    const managersTest: User[] = [managerTest];
    userBackendServiceSpy.getUsers.and.returnValue(asyncData(managersTest));
    userStoreService.loadAllManagers();
    tick();

    //found
    userStoreService.deleteInManagerDataStore(managerTest);
    tick();
    expect(users).toEqual([]);

    //not found
    userStoreService.deleteInManagerDataStore(managerTest);
    tick();
    expect(users.length).toEqual(0);
  }));

  //TEACHERS********************************
  it('should get Teachers', fakeAsync(() => {
    let users: User[];
    userStoreService.teachers$.subscribe(data => users = data);

    let isLoading;
    userStoreService.isLoadingGetTeachers$.subscribe(data => isLoading = data);

    const teachersTest: User[] = [teacherTest, teacherTest2];
    userBackendServiceSpy.getUsers.and.returnValue(asyncData(teachersTest));
    userStoreService.loadAllTeachers();

    expect(isLoading).toBeTruthy();
    tick();
    expect(users).toEqual(teachersTest);
    expect(users.length).toEqual(2);
    expect(isLoading).toBeFalsy();

  }));

  it('should create Teacher', fakeAsync(() => {
    let users: User[];
    userStoreService.teachers$.subscribe(data => users = data);

    const teachersTest: User[] = [teacherTest];
    userBackendServiceSpy.getUsers.and.returnValue(asyncData(teachersTest));
    userStoreService.loadAllTeachers();

    userBackendServiceSpy.create.and.returnValue(asyncData(teacherTest2));
    let user: User;
    userStoreService.createTeacher(teacherTest2).subscribe(data => user = data);

    tick();
    expect(user).toEqual(teacherTest2);
    expect(users[0]).toEqual(teacherTest);
    expect(users[1]).toEqual(user);
    expect(users.length).toEqual(2);

  }));

  it('should update Teacher', fakeAsync(() => {
    let users: User[];
    userStoreService.teachers$.subscribe(data => users = data);

    spyOn(userStoreService, 'updateInManagerDataStore').and.callThrough();

    const teachersTest: User[] = [teacherTest];
    userBackendServiceSpy.getUsers.and.returnValue(asyncData(teachersTest));
    userStoreService.loadAllTeachers();

    userBackendServiceSpy.update.and.returnValue(asyncData(teacherTest));
    let user: User;
    userStoreService.updateTeacher(teacherTest).subscribe(data => user = data);

    tick();
    expect(user).toEqual(teacherTest);
    expect(users[0]).toEqual(user);
    expect(users.length).toEqual(1);
    expect(userStoreService.updateInManagerDataStore).toHaveBeenCalled();

  }));

  it('should delete Teacher', fakeAsync(() => {
    let users: User[];
    userStoreService.teachers$.subscribe(data => users = data);

    spyOn(userStoreService, 'deleteInManagerDataStore').and.callThrough();

    const teachersTest: User[] = [teacherTest];
    userBackendServiceSpy.getUsers.and.returnValue(asyncData(teachersTest));
    userStoreService.loadAllTeachers();

    userBackendServiceSpy.delete.and.returnValue(asyncData(teacherTest));
    let deleted: boolean;
    userStoreService.deleteTeacher(teacherTest).subscribe(data => deleted = data);

    tick();
    expect(deleted).toBeTruthy();
    expect(users).toEqual([]);
    expect(users.length).toEqual(0);
    expect(userStoreService.deleteInManagerDataStore).toHaveBeenCalled();

  }));

  it('should set Teacher Roles', fakeAsync(() => {
    let users: User[];
    userStoreService.teachers$.subscribe(data => users = data);

    const teachersTest: User[] = [teacherTest];
    userBackendServiceSpy.getUsers.and.returnValue(asyncData(teachersTest));
    userStoreService.loadAllTeachers();
    tick();

    spyOn(userStoreService, 'updateInManagerDataStore').and.callThrough();

    let userModif = deepCopy(teacherTest);
    userModif.roles = [ROLE_MANAGER, ROLE_TEACHER];
    userBackendServiceSpy.setRoles.and.returnValue(asyncData(userModif));

    let user: User;
    userStoreService.setTeacherRoles(userModif).subscribe(data => user = data);
    tick();

    expect(users[0]).toEqual(user);
    expect(users.length).toEqual(1);
    expect(users[0].roles).toContain(ROLE_TEACHER);
    expect(userStoreService.updateInManagerDataStore).toHaveBeenCalled();

    userBackendServiceSpy.setRoles.and.returnValue(asyncData(managerTest2));
    userStoreService.setTeacherRoles(managerTest2).subscribe();
    tick();
    expect(users.length).toEqual(1);//not found
  }));

  it('should update In TeacherDataStore', fakeAsync(() => {
    let users: User[];
    userStoreService.teachers$.subscribe(data => users = data);

    const teachersTest: User[] = [teacherTest];
    userBackendServiceSpy.getUsers.and.returnValue(asyncData(teachersTest));
    userStoreService.loadAllTeachers();
    tick();

    //found && includes teacherRole (updates it)
    let userModif = deepCopy(teacherTest);
    userModif.roles = [ROLE_MANAGER, ROLE_TEACHER];
    userStoreService.updateInTeacherDataStore(userModif);
    tick();

    expect(users[0]).toEqual(userModif);
    expect(users.length).toEqual(1);
    expect(users[0].roles).toContain(ROLE_TEACHER);

    //found && not includes teacherRole (splices it)
    userModif.roles = [ROLE_MANAGER];
    userStoreService.updateInTeacherDataStore(userModif);
    tick();
    expect(users).toEqual([]);
    expect(users.length).toEqual(0);

    //not found && includes teacherRole (adds it)
    userStoreService.updateInTeacherDataStore(teacherTest2);
    tick();
    expect(users[0]).toEqual(teacherTest2);
    expect(users.length).toEqual(1);

    //not found and not includes teacherRole
    userStoreService.updateInTeacherDataStore(studentTest);
    tick();
    expect(users.length).toEqual(1);
  }));

  it('should delete In TeacherDataStore', fakeAsync(() => {
    let users: User[];
    userStoreService.teachers$.subscribe(data => users = data);

    const teachersTest: User[] = [teacherTest];
    userBackendServiceSpy.getUsers.and.returnValue(asyncData(teachersTest));
    userStoreService.loadAllTeachers();
    tick();

    //found
    userStoreService.deleteInTeacherDataStore(teacherTest);
    tick();
    expect(users).toEqual([]);

    //not found
    userStoreService.deleteInTeacherDataStore(teacherTest);
    tick();
    expect(users.length).toEqual(0);
  }));

  //STUDENTS********************************
  it('should get Students', fakeAsync(() => {
    let users: User[];
    userStoreService.students$.subscribe(data => users = data);

    let isLoading;
    userStoreService.isLoadingGetStudents$.subscribe(data => isLoading = data);

    const studentsTest: User[] = [studentTest, studentTest2];
    userBackendServiceSpy.getUsers.and.returnValue(asyncData(studentsTest));
    userStoreService.loadAllStudents();

    expect(isLoading).toBeTruthy();
    tick();
    expect(users).toEqual(studentsTest);
    expect(users.length).toEqual(2);
    expect(isLoading).toBeFalsy();

  }));

  it('should create Student', fakeAsync(() => {
    let users: User[];
    userStoreService.students$.subscribe(data => users = data);

    const studentsTest: User[] = [studentTest];
    userBackendServiceSpy.getUsers.and.returnValue(asyncData(studentsTest));
    userStoreService.loadAllStudents();
    tick();

    userBackendServiceSpy.create.and.returnValue(asyncData(studentTest2));
    let user: User;
    userStoreService.createStudent(studentTest2).subscribe(data => user = data);

    expect(users.length).toEqual(1);
    tick();
    expect(user).toEqual(studentTest2);
    expect(users[0]).toEqual(studentTest);
    expect(users[1]).toEqual(user);
    expect(users.length).toEqual(2);

  }));

  it('should update Student', fakeAsync(() => {
    let users: User[];
    userStoreService.students$.subscribe(data => users = data);

    const studentsTest: User[] = [studentTest];
    userBackendServiceSpy.getUsers.and.returnValue(asyncData(studentsTest));
    userStoreService.loadAllStudents();
    tick();

    userBackendServiceSpy.update.and.returnValue(asyncData(studentTest));
    let user: User;
    userStoreService.updateStudent(studentTest).subscribe(data => user = data);

    expect(users.length).toEqual(1);
    tick();
    expect(user).toEqual(studentTest);
    expect(users[0]).toEqual(user);
    expect(users.length).toEqual(1);
  }));

  it('should delete Student', fakeAsync(() => {
    let users: User[];
    userStoreService.students$.subscribe(data => users = data);

    const studentsTest: User[] = [studentTest];
    userBackendServiceSpy.getUsers.and.returnValue(asyncData(studentsTest));
    userStoreService.loadAllStudents();
    tick();

    userBackendServiceSpy.delete.and.returnValue(asyncData(studentTest));
    let deleted: boolean;
    userStoreService.deleteStudent(studentTest).subscribe(data => deleted = data);

    expect(users.length).toEqual(1);
    tick();
    expect(deleted).toBeTruthy();
    expect(users.length).toEqual(0);

  }));


});


