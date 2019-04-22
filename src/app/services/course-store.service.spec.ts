import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { Course } from '../models/course';
import { courseTest, courseTest2, teacherTest, teacherTest2, studentTest, studentTest3, studentTest2 } from '../testing/models';
import { CourseStoreService } from '../services/course-store.service';
import { HttpClient } from '@angular/common/http';
import { httpStub } from '../testing/stubs';
import { CourseBackendService } from './course-backend.service';
import { asyncData } from '../testing/async-helpers';
import { IsLoadingService } from './isLoadingService.service';
import { User } from '../models/user';
import { deepCopy } from '../shared/functions/deepCopy';



describe('Course Store Service', () => {
  let courseStoreService: CourseStoreService;
  let courseBackendServiceSpy: jasmine.SpyObj<CourseBackendService>;
  let isLoadingService: IsLoadingService;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('CourseBackendService', [
      'getCourses',
      'create',
      'update',
      'delete',
      'getCourseByName',
    ]);

    TestBed.configureTestingModule({
      providers: [
        CourseStoreService,
        { provide: CourseBackendService, useValue: spy },
        { provide: HttpClient, useValue: httpStub },
        IsLoadingService,
      ]

    });

    courseStoreService = TestBed.get(CourseStoreService);
    courseBackendServiceSpy = TestBed.get(CourseBackendService);
    isLoadingService = TestBed.get(IsLoadingService);

  });

  afterEach(() => {

  });

  it('should be created', inject([CourseStoreService], (service: CourseStoreService) => {
    expect(service).toBeTruthy();
  }));

  it('should get Allcourses', fakeAsync(() => {
    let courses: Course[];
    courseStoreService.courses$.subscribe(data => courses = data);

    let isLoading;
    courseStoreService.isLoadingGetCourses$.subscribe(data => isLoading = data);

    const coursesTest: Course[] = [courseTest, courseTest2];
    courseBackendServiceSpy.getCourses.and.returnValue(asyncData(coursesTest));
    courseStoreService.loadAllCourses('2019');

    expect(isLoading).toBeTruthy();
    tick();
    expect(courses).toEqual(coursesTest);
    expect(courses.length).toEqual(2);
    expect(isLoading).toBeFalsy();

  }));

  it('should get one course', fakeAsync(() => {
    const coursesTest: Course[] = [courseTest, courseTest2];
    courseBackendServiceSpy.getCourses.and.returnValue(asyncData(coursesTest));
    courseStoreService.loadAllCourses('2019');

    let course: Course;
    courseStoreService.loadOneCourse(courseTest.name).subscribe(data => course = data);

    //not found
    expect(course).not.toEqual(courseTest);

    tick();
    //found
    expect(course).toEqual(courseTest);

  }));

  it('should create course', fakeAsync(() => {
    let isLoading;
    isLoadingService.isLoading$.subscribe(data => isLoading = data);

    courseBackendServiceSpy.create.and.returnValue(asyncData(courseTest));
    let course: Course;
    courseStoreService.create(courseTest).subscribe(data => course = data);

    expect(isLoading).toBeTruthy();
    tick();
    expect(course).toEqual(courseTest);
    expect(isLoading).toBeFalsy();

  }));

  it('should update course', fakeAsync(() => {
    let isLoading;
    isLoadingService.isLoading$.subscribe(data => isLoading = data);

    courseBackendServiceSpy.update.and.returnValue(asyncData(courseTest));
    let course: Course;
    courseStoreService.update(courseTest).subscribe(data => course = data);
    expect(isLoading).toBeTruthy();
    tick();

    expect(course).toEqual(courseTest);
    expect(isLoading).toBeFalsy();
  }));

  it('should delete course', fakeAsync(() => {
    courseBackendServiceSpy.delete.and.returnValue(asyncData(courseTest));
    let course: Course;
    courseStoreService.delete(courseTest).subscribe(data => course = data);
    tick();

    expect(course).toEqual(courseTest);

  }));

  it('should update a ChiefTeacher In CourseStore OneToMany', fakeAsync(() => {
    let courses: Course[];
    courseStoreService.courses$.subscribe(data => courses = data);

    const coursesTest: Course[] = [deepCopy(courseTest)];
    courseBackendServiceSpy.getCourses.and.returnValue(asyncData(coursesTest));
    courseStoreService.loadAllCourses(courseTest.year);
    tick();

    let teacherModified: User = deepCopy(teacherTest);
    teacherModified.username = 'tModif';
    courseStoreService.updateChiefTeacherInCourseStoreOneToMany(teacherModified);
    tick();
    expect(courses[0].chiefTeacher).toEqual(teacherModified);

    //not found
    courseStoreService.updateChiefTeacherInCourseStoreOneToMany(teacherTest2);
    tick();
    expect(courses[0].chiefTeacher).toEqual(teacherModified);

  }));

  it('should update a ChiefTeacher In CourseStore OneToOne', fakeAsync(() => {
    let courses: Course[];
    courseStoreService.courses$.subscribe(data => courses = data);

    const coursesTest: Course[] = [deepCopy(courseTest)];
    courseBackendServiceSpy.getCourses.and.returnValue(asyncData(coursesTest));
    courseStoreService.loadAllCourses(courseTest.year);
    tick();

    let teacherModified: User = deepCopy(teacherTest);
    teacherModified.username = 'tModif';
    courseStoreService.updateChiefTeacherInCourseStoreOneToOne(teacherModified);
    tick();
    expect(courses[0].chiefTeacher.username).toEqual('tModif');

    //not found
    courseStoreService.updateChiefTeacherInCourseStoreOneToMany(teacherTest2);
    tick();
    expect(courses[0].chiefTeacher).toEqual(teacherModified);

  }));

  it('should tell if there is a Student In A Course', () => {
    expect(courseStoreService.isStudentInACourse(studentTest, courseTest.students)).toBeTruthy();
    expect(courseStoreService.isStudentInACourse(studentTest3, courseTest.students)).toBeFalsy();
  });

  it('should update a Student In CourseStore oneToMany', fakeAsync(() => {
    let courses: Course[];
    courseStoreService.courses$.subscribe(data => courses = data);

    let courseModified: Course = deepCopy(courseTest);
    let courseModified2: Course = deepCopy(courseTest2);
    courseModified2.students[2] = courseModified.students[0];
    const coursesTest: Course[] = [courseModified, courseModified2];
    courseBackendServiceSpy.getCourses.and.returnValue(asyncData(coursesTest));
    courseStoreService.loadAllCourses(courseModified.year);
    tick();

    let studentModified: User = deepCopy(courseModified.students[0]);
    studentModified.username = 'sModif';
    courseStoreService.updateStudentInCourseStoreOnetoMany(studentModified);
    tick();
    expect(courses[0].students[0].username).toEqual('sModif');
    expect(courses[1].students[2].username).toEqual('sModif');

    //not found
    courseStoreService.updateStudentInCourseStoreOnetoMany(studentTest3);
    tick();
    expect(courses[0].students).not.toContain(studentTest3);

  }));

  it('should update a Student In CourseStore oneToOne', fakeAsync(() => {
    let courses: Course[];
    courseStoreService.courses$.subscribe(data => courses = data);

    let courseModified: Course = deepCopy(courseTest);
    let courseModified2: Course = deepCopy(courseTest2);
    courseModified2.students[2] = courseModified.students[0];
    const coursesTest: Course[] = [courseModified, courseModified2];
    courseBackendServiceSpy.getCourses.and.returnValue(asyncData(coursesTest));
    courseStoreService.loadAllCourses(courseModified.year);
    tick();

    let studentModified: User = deepCopy(studentTest);
    studentModified.username = 'sModif';
    courseStoreService.updateStudentInCourseStoreOneToOne(studentModified);
    tick();
    expect(courses[0].students[0].username).toEqual('sModif');
    expect(courses[1].students[2].username).toEqual('student01');

    //not found
    courseStoreService.updateStudentInCourseStoreOnetoMany(studentTest3);
    tick();
    expect(courses[0].students).not.toContain(studentTest3);



  }));

  it('should delete a Student In CourseStore OneToOne', fakeAsync(() => {
    let courses: Course[];
    courseStoreService.courses$.subscribe(data => courses = data);

    const coursesTest: Course[] = [deepCopy(courseTest)];
    courseBackendServiceSpy.getCourses.and.returnValue(asyncData(coursesTest));
    courseStoreService.loadAllCourses('2019');
    tick();
    expect(courses[0].students.length).toEqual(2);

    courseStoreService.deleteStudentInCourseStoreOneToOne(studentTest);
    tick();
    expect(courses[0].students.length).toEqual(1);
    expect(courseTest.students.length).toEqual(2);

  }));

});


