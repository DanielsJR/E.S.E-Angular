import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { managerTest, managerTest2, teacherTest2, teacherTest, studentTest, studentTest2 } from '../testing/models';
import { HttpClient } from '@angular/common/http';
import { httpStub } from '../testing/stubs';
import { asyncData } from '../testing/async-helpers';
import { UserStoreService } from './user-store.service';
import { UserBackendService } from './user-backend.service';
import { User } from '../models/user';
import { ROLE_MANAGER, ROLE_TEACHER, ROLE_STUDENT, URI_TEACHER, URI_MANAGER, URI_STUDENT } from '../app.config';
import { deepCopy } from '../shared/functions/deepCopy';
import { CourseStoreService } from './course-store.service';
import { GENDERS } from '../models/genders';
import { GradeStoreService } from './grade-store.service';
import { SubjectStoreService } from './subject-store.service';



describe('User Store Service', () => {
  let userStoreService: UserStoreService;
  let courseStoreService: CourseStoreService;
  let subjectStoreService: SubjectStoreService;
  let gradeStoreService: GradeStoreService;
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
        { provide: UserBackendService, useValue: spy },
        { provide: HttpClient, useValue: httpStub },

      ]

    });

    userStoreService = TestBed.get(UserStoreService);
    courseStoreService = TestBed.get(CourseStoreService);
    gradeStoreService = TestBed.get(GradeStoreService);
    subjectStoreService = TestBed.get(SubjectStoreService);
    userBackendServiceSpy = TestBed.get(UserBackendService);
  });

  afterEach(() => {

  });

  //MANAGERS********************************
  it('should be created', inject([UserStoreService], (service: UserStoreService) => {
    expect(service).toBeTruthy();
  }));

  it('should get all Managers', fakeAsync(() => {
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
    expect(userBackendServiceSpy.getUsers).toHaveBeenCalledWith(URI_MANAGER);

    userStoreService.loadAllManagers();
    expect(userBackendServiceSpy.getUsers).toHaveBeenCalledTimes(1);//cache
  }));

  it('should get one Manager', fakeAsync(() => {
    let users: User[];
    userStoreService.managers$.subscribe(data => users = data);

    const managersTest: User[] = [managerTest, managerTest2];
    userBackendServiceSpy.getUsers.and.returnValue(asyncData(managersTest));
    userStoreService.loadAllManagers();

    let user: User;
    userStoreService.loadOneManager(managerTest.id).subscribe(data => user = data);

    expect(user).toEqual(undefined);
    tick();
    expect(users[0]).toEqual(user);
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

    expect(user).toEqual(undefined);
    expect(users.length).toEqual(1);
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

    spyOn(userStoreService, 'updateInManagerDataStore').and.callThrough();
    spyOn(userStoreService, 'updateInTeacherDataStore').and.callThrough();

    let userCopy: User = deepCopy(managerTest);
    userCopy.gender = GENDERS[1].value;
    userBackendServiceSpy.update.and.returnValue(asyncData(userCopy));

    let user: User;
    userStoreService.updateManager(managerTest).subscribe(data => user = data);

    expect(users.length).toEqual(1);
    tick();
    expect(user).toEqual(userCopy);
    expect(users[0]).toEqual(user);
    expect(users.length).toEqual(1);
    expect(userStoreService.updateInManagerDataStore).toHaveBeenCalledWith(user);
    expect(userStoreService.updateInTeacherDataStore).toHaveBeenCalledWith(user);

  }));

  it('should delete Manager', fakeAsync(() => {
    let users: User[];
    userStoreService.managers$.subscribe(data => users = data);

    const managersTest: User[] = [managerTest];
    userBackendServiceSpy.getUsers.and.returnValue(asyncData(managersTest));
    userStoreService.loadAllManagers();
    tick();

    spyOn(userStoreService, 'deleteInManagerDataStore').and.callThrough();
    spyOn(userStoreService, 'deleteInTeacherDataStore').and.callThrough();
    userBackendServiceSpy.delete.and.returnValue(asyncData(managerTest));

    let deleted: boolean;
    userStoreService.deleteManager(managerTest).subscribe(data => deleted = data);

    expect(users.length).toEqual(1);
    tick();
    expect(userStoreService.deleteInManagerDataStore).toHaveBeenCalledWith(managerTest);
    expect(userStoreService.deleteInTeacherDataStore).toHaveBeenCalledWith(managerTest);
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

    spyOn(userStoreService, 'updateInManagerDataStore').and.callThrough();
    spyOn(userStoreService, 'updateInTeacherDataStore').and.callThrough();

    let userModif: User = deepCopy(managerTest);
    userModif.roles = [ROLE_MANAGER, ROLE_TEACHER];
    userBackendServiceSpy.setRoles.and.returnValue(asyncData(userModif));

    let user: User;
    userStoreService.setManagerRoles(managerTest).subscribe(data => user = data);//update
    tick();

    expect(userStoreService.updateInManagerDataStore).toHaveBeenCalledWith(user);
    expect(userStoreService.updateInTeacherDataStore).toHaveBeenCalledWith(user);
    expect(users[0]).toEqual(user);
    expect(users.length).toEqual(1);
    expect(users[0].roles.includes(ROLE_TEACHER)).toBeTruthy('now it is a teacher too');


    userBackendServiceSpy.setRoles.and.returnValue(asyncData(managerTest2));//adds
    userStoreService.setManagerRoles(managerTest2).subscribe();
    tick();

    expect(userStoreService.updateInManagerDataStore).toHaveBeenCalledWith(user);
    expect(userStoreService.updateInTeacherDataStore).toHaveBeenCalledWith(user);
    expect(users.length).toEqual(2);
    expect(users[0]).toEqual(user);
    expect(users[1]).toEqual(managerTest2);


    userBackendServiceSpy.setRoles.and.returnValue(asyncData(teacherTest));//not found
    userStoreService.setManagerRoles(teacherTest).subscribe();
    tick();

    expect(userStoreService.updateInManagerDataStore).toHaveBeenCalledWith(user);
    expect(userStoreService.updateInTeacherDataStore).toHaveBeenCalledWith(user);
    expect(users.length).toEqual(2);
    expect(users[0]).toEqual(user);
    expect(users[1]).toEqual(managerTest2);


  }));

  it('should update In ManagerDataStore', fakeAsync(() => {
    let users: User[];
    userStoreService.managers$.subscribe(data => users = data);

    const managersTest: User[] = [managerTest];
    userBackendServiceSpy.getUsers.and.returnValue(asyncData(managersTest));
    userStoreService.loadAllManagers();
    tick();

    //found && includes managerRole (updates it)
    let userModif = deepCopy(managerTest);
    userModif.roles = [ROLE_MANAGER, ROLE_TEACHER];
    userStoreService.updateInManagerDataStore(userModif);

    expect(users[0]).toEqual(userModif);
    expect(users.length).toEqual(1);
    expect(users[0].roles).toContain(ROLE_TEACHER);

    //found && not includes managerRole (splices it)
    userModif.roles = [ROLE_TEACHER];
    userStoreService.updateInManagerDataStore(userModif);

    expect(users.length).toEqual(0);

    //not found && includes managerRole (adds it)
    userStoreService.updateInManagerDataStore(managerTest2);

    expect(users[0]).toEqual(managerTest2);
    expect(users.length).toEqual(1);

    //not found and not includes role (do nothing)
    userStoreService.updateInManagerDataStore(studentTest);

    expect(users.length).toEqual(1);


  }));

  it('should delete In ManagerDataStore', fakeAsync(() => {
    let users: User[];
    userStoreService.managers$.subscribe(data => users = data);

    const managersTest: User[] = [managerTest];
    userBackendServiceSpy.getUsers.and.returnValue(asyncData(managersTest));
    userStoreService.loadAllManagers();
    tick();

    expect(users.length).toBe(1, 'there is one');
    userStoreService.deleteInManagerDataStore(managerTest);//found
    expect(users).toEqual([]);

    expect(users.length).toBe(0, 'there is cero');
    userStoreService.deleteInManagerDataStore(managerTest);//not found
    expect(users.length).toBe(0, 'there is cero');
  }));

  //TEACHERS********************************
  it('should get all Teachers', fakeAsync(() => {
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
    expect(userBackendServiceSpy.getUsers).toHaveBeenCalledWith(URI_TEACHER);

    userStoreService.loadAllTeachers();
    expect(userBackendServiceSpy.getUsers).toHaveBeenCalledTimes(1);//cache

  }));

  it('should get one Teacher', fakeAsync(() => {
    let users: User[];
    userStoreService.teachers$.subscribe(data => users = data);

    const teachersTest: User[] = [teacherTest, teacherTest2];
    userBackendServiceSpy.getUsers.and.returnValue(asyncData(teachersTest));
    userStoreService.loadAllTeachers();

    let user: User;
    userStoreService.loadOneTeacher(teacherTest.id).subscribe(data => user = data);

    expect(user).toEqual(undefined);
    tick();
    expect(users[0]).toEqual(user);
  }));

  it('should create Teacher', fakeAsync(() => {
    let users: User[];
    userStoreService.teachers$.subscribe(data => users = data);

    const teachersTest: User[] = [teacherTest];
    userBackendServiceSpy.getUsers.and.returnValue(asyncData(teachersTest));
    userStoreService.loadAllTeachers();
    tick();

    userBackendServiceSpy.create.and.returnValue(asyncData(teacherTest2));
    let user: User;
    userStoreService.createTeacher(teacherTest2).subscribe(data => user = data);

    expect(user).toEqual(undefined);
    expect(users.length).toEqual(1);
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
    spyOn(userStoreService, 'updateInTeacherDataStore').and.callThrough();

    const teachersTest: User[] = [teacherTest];
    userBackendServiceSpy.getUsers.and.returnValue(asyncData(teachersTest));
    userStoreService.loadAllTeachers();
    tick();

    let userCopy: User = deepCopy(teacherTest);
    userCopy.gender = GENDERS[1].value;
    userBackendServiceSpy.update.and.returnValue(asyncData(userCopy));

    let user: User;
    userStoreService.updateTeacher(teacherTest).subscribe(data => user = data);

    expect(users.length).toEqual(1);
    tick();
    expect(user).toEqual(userCopy);
    expect(users[0]).toEqual(user);
    expect(users.length).toEqual(1);
    expect(userStoreService.updateInManagerDataStore).toHaveBeenCalledWith(user);
    expect(userStoreService.updateInTeacherDataStore).toHaveBeenCalledWith(user);

  }));

  it('should delete Teacher', fakeAsync(() => {
    let users: User[];
    userStoreService.teachers$.subscribe(data => users = data);

    const teachersTest: User[] = [teacherTest];
    userBackendServiceSpy.getUsers.and.returnValue(asyncData(teachersTest));
    userStoreService.loadAllTeachers();
    tick();

    spyOn(userStoreService, 'deleteInManagerDataStore').and.callThrough();
    spyOn(userStoreService, 'deleteInTeacherDataStore').and.callThrough();
    userBackendServiceSpy.delete.and.returnValue(asyncData(teacherTest));

    let deleted: boolean;
    userStoreService.deleteTeacher(teacherTest).subscribe(data => deleted = data);

    expect(users.length).toEqual(1);
    tick();
    expect(userStoreService.deleteInTeacherDataStore).toHaveBeenCalledWith(teacherTest);
    expect(userStoreService.deleteInManagerDataStore).toHaveBeenCalledWith(teacherTest);
    expect(deleted).toBeTruthy();
    expect(users).toEqual([]);
    expect(users.length).toEqual(0);

  }));

  it('should set Teacher Roles', fakeAsync(() => {
    let users: User[];
    userStoreService.teachers$.subscribe(data => users = data);

    const teachersTest: User[] = [teacherTest];
    userBackendServiceSpy.getUsers.and.returnValue(asyncData(teachersTest));
    userStoreService.loadAllTeachers();
    tick();

    spyOn(userStoreService, 'updateInManagerDataStore').and.callThrough();
    spyOn(userStoreService, 'updateInTeacherDataStore').and.callThrough();

    let userModif = deepCopy(teacherTest);
    userModif.roles = [ROLE_MANAGER, ROLE_TEACHER];
    userBackendServiceSpy.setRoles.and.returnValue(asyncData(userModif));

    let user: User;
    userStoreService.setTeacherRoles(teacherTest).subscribe(data => user = data);//updates
    tick();

    expect(userStoreService.updateInManagerDataStore).toHaveBeenCalledWith(user);
    expect(userStoreService.updateInTeacherDataStore).toHaveBeenCalledWith(user);
    expect(users[0]).toEqual(user);
    expect(users.length).toEqual(1);
    expect(users[0].roles).toContain(ROLE_TEACHER);

    userBackendServiceSpy.setRoles.and.returnValue(asyncData(teacherTest2));//adds
    userStoreService.setTeacherRoles(teacherTest2).subscribe();
    tick();

    expect(userStoreService.updateInManagerDataStore).toHaveBeenCalledWith(user);
    expect(userStoreService.updateInTeacherDataStore).toHaveBeenCalledWith(user);
    expect(users.length).toEqual(2);

    userBackendServiceSpy.setRoles.and.returnValue(asyncData(managerTest2));//not found
    userStoreService.setTeacherRoles(managerTest2).subscribe();
    tick();

    expect(userStoreService.updateInManagerDataStore).toHaveBeenCalledWith(user);
    expect(userStoreService.updateInTeacherDataStore).toHaveBeenCalledWith(user);
    expect(users.length).toEqual(2);

  }));

  it('should update In TeacherDataStore', fakeAsync(() => {
    let users: User[];
    userStoreService.teachers$.subscribe(data => users = data);

    const teachersTest: User[] = [teacherTest];
    userBackendServiceSpy.getUsers.and.returnValue(asyncData(teachersTest));
    userStoreService.loadAllTeachers();
    tick();

    spyOn(courseStoreService, 'updateChiefTeacherInCourseStoreOneToOne');
    spyOn(subjectStoreService, 'updateTeacherInSubjectStore');
                     
    //found && includes teacherRole (updates it)
    let userModif = deepCopy(teacherTest);
    userModif.roles = [ROLE_MANAGER, ROLE_TEACHER];
    userStoreService.updateInTeacherDataStore(userModif);

    expect(users[0]).toEqual(userModif);
    expect(users.length).toEqual(1);
    expect(users[0].roles).toContain(ROLE_MANAGER);
    expect(courseStoreService.updateChiefTeacherInCourseStoreOneToOne).toHaveBeenCalledWith(userModif);
    expect(subjectStoreService.updateTeacherInSubjectStore).toHaveBeenCalledWith(userModif);

    //found && not includes teacherRole (splices it)
    userModif.roles = [ROLE_MANAGER];
    userStoreService.updateInTeacherDataStore(userModif);

    expect(users).toEqual([]);
    expect(users.length).toEqual(0);
    expect(courseStoreService.updateChiefTeacherInCourseStoreOneToOne).toHaveBeenCalledWith(userModif);
    expect(subjectStoreService.updateTeacherInSubjectStore).toHaveBeenCalledWith(userModif);

    //not found && includes teacherRole (adds it)
    userStoreService.updateInTeacherDataStore(teacherTest2);

    expect(users[0]).toEqual(teacherTest2);
    expect(users.length).toEqual(1);
    expect(courseStoreService.updateChiefTeacherInCourseStoreOneToOne).toHaveBeenCalledWith(userModif);
    expect(subjectStoreService.updateTeacherInSubjectStore).toHaveBeenCalledWith(userModif);

    //not found and not includes teacherRole
    userStoreService.updateInTeacherDataStore(studentTest);

    expect(users.length).toEqual(1);
    expect(courseStoreService.updateChiefTeacherInCourseStoreOneToOne).toHaveBeenCalledTimes(3);
    expect(subjectStoreService.updateTeacherInSubjectStore).toHaveBeenCalledTimes(3);
  }));

  it('should delete In TeacherDataStore', fakeAsync(() => {
    let users: User[];
    userStoreService.teachers$.subscribe(data => users = data);

    const teachersTest: User[] = [teacherTest];
    userBackendServiceSpy.getUsers.and.returnValue(asyncData(teachersTest));
    userStoreService.loadAllTeachers();
    tick();

    expect(users.length).toBe(1, 'there is one');
    userStoreService.deleteInTeacherDataStore(teacherTest);//found
    expect(users).toEqual([]);

    expect(users.length).toEqual(0);
    userStoreService.deleteInTeacherDataStore(teacherTest);//not found
    expect(users.length).toEqual(0);
  }));

  //STUDENTS********************************
  it('should get all Students', fakeAsync(() => {
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
    expect(userBackendServiceSpy.getUsers).toHaveBeenCalledWith(URI_STUDENT);

    userStoreService.loadAllStudents();
    expect(userBackendServiceSpy.getUsers).toHaveBeenCalledTimes(1);//cache

  }));

  it('should get one Student', fakeAsync(() => {
    let users: User[];
    userStoreService.students$.subscribe(data => users = data);

    const studentsTest: User[] = [studentTest, studentTest2];
    userBackendServiceSpy.getUsers.and.returnValue(asyncData(studentsTest));
    userStoreService.loadAllStudents();

    let user: User;
    userStoreService.loadOneStudent(studentTest.id).subscribe(data => user = data);

    expect(user).toEqual(undefined);
    tick();
    expect(users[0]).toEqual(user);

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

    expect(user).toEqual(undefined);
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

    spyOn(userStoreService, 'updateInStudentDataStore').and.callThrough();

    let userCopy: User = deepCopy(studentTest);
    userCopy.gender = GENDERS[1].value;
    userBackendServiceSpy.update.and.returnValue(asyncData(userCopy));

    let user: User;
    userStoreService.updateStudent(studentTest).subscribe(data => user = data);

    expect(users.length).toEqual(1);
    tick();
    expect(user).toEqual(userCopy);
    expect(users[0]).toEqual(user);
    expect(users.length).toEqual(1);
    expect(userStoreService.updateInStudentDataStore).toHaveBeenCalledWith(user);
  }));

  it('should delete Student', fakeAsync(() => {
    let users: User[];
    userStoreService.students$.subscribe(data => users = data);

    const studentsTest: User[] = [studentTest];
    userBackendServiceSpy.getUsers.and.returnValue(asyncData(studentsTest));
    userStoreService.loadAllStudents();
    tick();

    spyOn(userStoreService, 'deleteInStudentDataStore').and.callThrough();
    userBackendServiceSpy.delete.and.returnValue(asyncData(studentTest));

    let deleted: boolean;
    userStoreService.deleteStudent(studentTest).subscribe(data => deleted = data);

    expect(users.length).toEqual(1);
    tick();
    expect(userStoreService.deleteInStudentDataStore).toHaveBeenCalledWith(studentTest);
    expect(deleted).toBeTruthy();
    expect(users.length).toEqual(0);

  }));

  it('should update In StudentDataStore', fakeAsync(() => {
    let users: User[];
    userStoreService.students$.subscribe(data => users = data);

    const studentsTest: User[] = [studentTest];
    userBackendServiceSpy.getUsers.and.returnValue(asyncData(studentsTest));
    userStoreService.loadAllStudents();
    tick();

    spyOn(courseStoreService, 'updateStudentInCourseStoreOneToOne');
    spyOn(gradeStoreService, 'updateStudentInGradeStore');

    //found && includes studentRole (updates it)
    let userModif: User = deepCopy(studentTest);
    userModif.gender = GENDERS[1].value;
    userStoreService.updateInStudentDataStore(userModif);

    expect(users[0]).toEqual(userModif);
    expect(users.length).toEqual(1);
    expect(users[0].gender).toEqual(GENDERS[1].value);
    expect(courseStoreService.updateStudentInCourseStoreOneToOne).toHaveBeenCalledWith(userModif);
    expect(gradeStoreService.updateStudentInGradeStore).toHaveBeenCalledWith(userModif);

    //not found and not includes studentRole
    userStoreService.updateInStudentDataStore(teacherTest);
    expect(courseStoreService.updateStudentInCourseStoreOneToOne).toHaveBeenCalledTimes(1);
    expect(gradeStoreService.updateStudentInGradeStore).toHaveBeenCalledTimes(1);
    expect(users.length).toEqual(1);
  }));

  it('should delete In StudentDataStore', fakeAsync(() => {
    let users: User[];
    userStoreService.students$.subscribe(data => users = data);

    const studentsTest: User[] = [studentTest];
    userBackendServiceSpy.getUsers.and.returnValue(asyncData(studentsTest));
    userStoreService.loadAllStudents();
    tick();

    expect(users.length).toEqual(1);
    userStoreService.deleteInStudentDataStore(studentTest);
    expect(users).toEqual([]);

    expect(users.length).toEqual(0);
    userStoreService.deleteInStudentDataStore(studentTest);
    expect(users.length).toEqual(0);
  }));


});


