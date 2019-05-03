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
import { SubjectStoreService } from './subject-store.service';



describe('Course Store Service', () => {
  let courseStoreService: CourseStoreService;
  let subjectStoreService: SubjectStoreService;
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
        { provide: CourseBackendService, useValue: spy },
        { provide: HttpClient, useValue: httpStub },

      ]

    });

    courseStoreService = TestBed.get(CourseStoreService);
    subjectStoreService = TestBed.get(SubjectStoreService);
    courseBackendServiceSpy = TestBed.get(CourseBackendService);
    isLoadingService = TestBed.get(IsLoadingService);

  });

  afterEach(() => {

  });

  it('should be created', inject([CourseStoreService], (service: CourseStoreService) => {
    expect(service).toBeTruthy();
  }));

  it('should get All courses', fakeAsync(() => {
    let courses: Course[];
    courseStoreService.courses$.subscribe(data => courses = data);

    let isLoading;
    courseStoreService.isLoadingGetCourses$.subscribe(data => isLoading = data);

    const coursesTest: Course[] = [courseTest, courseTest2];
    courseBackendServiceSpy.getCourses.and.returnValue(asyncData(coursesTest));
    courseStoreService.loadAllCourses('2019');

    expect(isLoading).toBeTruthy();
    expect(courses.length).toEqual(0);
    tick();
    expect(courses).toEqual(coursesTest);
    expect(courses.length).toEqual(2);
    expect(isLoading).toBeFalsy();
    expect(courseBackendServiceSpy.getCourses).toHaveBeenCalledWith('2019');
    expect(courseBackendServiceSpy.getCourses).toHaveBeenCalledTimes(1);

    courseStoreService.loadAllCourses('2019');
    expect(courseBackendServiceSpy.getCourses).toHaveBeenCalledTimes(1);//cache

  }));

  it('should get one course', fakeAsync(() => {
    let courses: Course[];
    courseStoreService.courses$.subscribe(data => courses = data);

    const coursesTest: Course[] = [courseTest, courseTest2];
    courseBackendServiceSpy.getCourses.and.returnValue(asyncData(coursesTest));
    courseStoreService.loadAllCourses('2019');

    let course: Course;
    courseStoreService.loadOneCourse(courseTest.name).subscribe(data => course = data);

    expect(course).not.toEqual(courseTest);
    tick();
    expect(courses[0]).toEqual(course);

  }));

  it('should create course', fakeAsync(() => {
    let courses: Course[];
    courseStoreService.courses$.subscribe(data => courses = data);

    const coursesTest: Course[] = [courseTest];
    courseBackendServiceSpy.getCourses.and.returnValue(asyncData(coursesTest));
    courseStoreService.loadAllCourses('2019');
    tick();

    let isLoading;
    isLoadingService.isLoading$.subscribe(data => isLoading = data);

    courseBackendServiceSpy.create.and.returnValue(asyncData(courseTest2));
    let course: Course;
    courseStoreService.create(courseTest2).subscribe(data => course = data);

    expect(isLoading).toBeTruthy();
    expect(courses.length).toEqual(1);
    tick();
    expect(course).toEqual(courseTest2);
    expect(courses.length).toEqual(2);
    expect(isLoading).toBeFalsy();

  }));

  it('should update course', fakeAsync(() => {
    let courses: Course[];
    courseStoreService.courses$.subscribe(data => courses = data);

    const coursesTest: Course[] = [courseTest];
    courseBackendServiceSpy.getCourses.and.returnValue(asyncData(coursesTest));
    courseStoreService.loadAllCourses('2019');
    tick();

    let isLoading;
    isLoadingService.isLoading$.subscribe(data => isLoading = data);

    spyOn(subjectStoreService, 'updateCourseInSubjectStore');

    courseBackendServiceSpy.update.and.returnValue(asyncData(courseTest));
    let course: Course;
    courseStoreService.update(courseTest).subscribe(data => course = data);

    expect(isLoading).toBeTruthy();
    tick();
    expect(course).toEqual(courseTest);
    expect(subjectStoreService.updateCourseInSubjectStore).toHaveBeenCalledWith(course);
    expect(isLoading).toBeFalsy();
    expect(courses.length).toEqual(1);
    expect(courses[0]).toEqual(course);
  }));

  it('should delete course', fakeAsync(() => {
    let courses: Course[];
    courseStoreService.courses$.subscribe(data => courses = data);

    const coursesTest: Course[] = [courseTest];
    courseBackendServiceSpy.getCourses.and.returnValue(asyncData(coursesTest));
    courseStoreService.loadAllCourses('2019');
    tick();

    courseBackendServiceSpy.delete.and.returnValue(asyncData(courseTest));
    let course: Course;
    courseStoreService.delete(courseTest).subscribe(data => course = data);

    expect(courses.length).toEqual(1);
    tick();
    expect(course).toEqual(courseTest);
    expect(courses.length).toEqual(0);

  }));

  it('should update a ChiefTeacher In CourseStore OneToOne', fakeAsync(() => {
    let courses: Course[];
    courseStoreService.courses$.subscribe(data => courses = data);

    let courseModified: Course = deepCopy(courseTest);
    let courseModified2: Course = deepCopy(courseTest2);
    courseModified.chiefTeacher = teacherTest;
    courseModified2.chiefTeacher = teacherTest;
    const coursesTest: Course[] = [courseModified, courseModified2];
    courseBackendServiceSpy.getCourses.and.returnValue(asyncData(coursesTest));
    courseStoreService.loadAllCourses(courseModified.year);
    tick();

    spyOn(subjectStoreService, 'updateTeacherInSubjectStore');

    let teacherModified: User = deepCopy(teacherTest);
    teacherModified.username = 'tModif';

    expect(courses[0].chiefTeacher).toEqual(teacherTest);
    expect(courses[1].chiefTeacher).toEqual(teacherTest);

    courseStoreService.updateChiefTeacherInCourseStoreOneToOne(teacherModified);

    expect(courses[0].chiefTeacher).toEqual(teacherModified);
    expect(courses[1].chiefTeacher).not.toEqual(teacherModified);// change in only one course
    expect(courses[1].chiefTeacher).toEqual(teacherTest);
    expect(subjectStoreService.updateTeacherInSubjectStore).toHaveBeenCalledWith(teacherModified);

    //not found
    courseStoreService.updateChiefTeacherInCourseStoreOneToOne(teacherTest2);

    expect(courses[0].chiefTeacher).toEqual(teacherModified);
    expect(courses[1].chiefTeacher).not.toEqual(teacherModified);
    expect(subjectStoreService.updateTeacherInSubjectStore).toHaveBeenCalledTimes(1);

  }));

  it('should update a ChiefTeacher In CourseStore OneToMany', fakeAsync(() => {
    let courses: Course[];
    courseStoreService.courses$.subscribe(data => courses = data);

    let courseModified: Course = deepCopy(courseTest);
    let courseModified2: Course = deepCopy(courseTest2);
    courseModified.chiefTeacher = teacherTest;
    courseModified2.chiefTeacher = teacherTest;
    const coursesTest: Course[] = [courseModified, courseModified2];
    courseBackendServiceSpy.getCourses.and.returnValue(asyncData(coursesTest));
    courseStoreService.loadAllCourses(courseModified.year);
    tick();

    spyOn(subjectStoreService, 'updateTeacherInSubjectStore');

    let teacherModified: User = deepCopy(teacherTest);
    teacherModified.username = 'tModif';

    expect(courses[0].chiefTeacher).toEqual(teacherTest);
    expect(courses[1].chiefTeacher).toEqual(teacherTest);
        
    courseStoreService.updateChiefTeacherInCourseStoreOneToMany(teacherModified);

    expect(courses[0].chiefTeacher).toEqual(teacherModified);
    expect(courses[1].chiefTeacher).toEqual(teacherModified);
    expect(courses[0].chiefTeacher).not.toEqual(teacherTest);
    expect(courses[1].chiefTeacher).not.toEqual(teacherTest);
    expect(subjectStoreService.updateTeacherInSubjectStore).toHaveBeenCalledWith(teacherModified);

    //not found
    courseStoreService.updateChiefTeacherInCourseStoreOneToMany(teacherTest2);

    expect(courses[0].chiefTeacher).toEqual(teacherModified);
    expect(subjectStoreService.updateTeacherInSubjectStore).toHaveBeenCalledTimes(1);

  }));

  it('should update a Student In CourseStore oneToOne', fakeAsync(() => {
    let courses: Course[];
    courseStoreService.courses$.subscribe(data => courses = data);

    let courseModified: Course = deepCopy(courseTest);
    let courseModified2: Course = deepCopy(courseTest2);
    courseModified2.students[0] = courseModified.students[0];
    const coursesTest: Course[] = [courseModified, courseModified2];
    courseBackendServiceSpy.getCourses.and.returnValue(asyncData(coursesTest));
    courseStoreService.loadAllCourses(courseModified.year);
    tick();

    spyOn(subjectStoreService, 'updateCourseInSubjectStore');

    let studentModified: User = deepCopy(studentTest);
    studentModified.username = 'sModif';
    courseStoreService.updateStudentInCourseStoreOneToOne(studentModified);
    expect(courses[0].students[0]).toEqual(studentModified);
    expect(courses[1].students[0]).not.toEqual(studentModified);
    expect(subjectStoreService.updateCourseInSubjectStore).toHaveBeenCalledTimes(1);

    //not found
    courseStoreService.updateStudentInCourseStoreOneToMany(studentTest3);
    expect(courses[0].students).not.toContain(studentTest3);
    expect(courses[1].students).not.toContain(studentTest3);
    expect(subjectStoreService.updateCourseInSubjectStore).toHaveBeenCalledTimes(1);



  }));

  it('should delete a Student In CourseStore OneToOne', fakeAsync(() => {
    let courses: Course[];
    courseStoreService.courses$.subscribe(data => courses = data);

    let courseModified: Course = deepCopy(courseTest);
    let courseModified2: Course = deepCopy(courseTest2);
    courseModified2.students[0] = courseModified.students[0];
    const coursesTest: Course[] = [courseModified, courseModified2];
    courseBackendServiceSpy.getCourses.and.returnValue(asyncData(coursesTest));
    courseStoreService.loadAllCourses(courseModified.year);
    tick();

    spyOn(subjectStoreService, 'updateCourseInSubjectStore');

    expect(courses.length).toEqual(2);
    expect(courses[0].students.length).toEqual(2);
    expect(courses[1].students.length).toEqual(2);

    courseStoreService.deleteStudentInCourseStoreOneToOne(studentTest);

    expect(subjectStoreService.updateCourseInSubjectStore).toHaveBeenCalledTimes(1);
    expect(courses[0].students.length).toEqual(1);//delete in only one course
    expect(courses[1].students.length).toEqual(2);

    //not found
    courseStoreService.deleteStudentInCourseStoreOneToOne(studentTest3);
    
    expect(subjectStoreService.updateCourseInSubjectStore).toHaveBeenCalledTimes(1);
    expect(courses[0].students.length).toEqual(1);
    expect(courses[1].students.length).toEqual(2);
   
  }));

  it('should update a Student In CourseStore oneToMany', fakeAsync(() => {
    let courses: Course[];
    courseStoreService.courses$.subscribe(data => courses = data);

    let courseModified: Course = deepCopy(courseTest);
    let courseModified2: Course = deepCopy(courseTest2);
    courseModified2.students[0] = courseModified.students[0];
    const coursesTest: Course[] = [courseModified, courseModified2];
    courseBackendServiceSpy.getCourses.and.returnValue(asyncData(coursesTest));
    courseStoreService.loadAllCourses(courseModified.year);
    tick();

    spyOn(subjectStoreService, 'updateCourseInSubjectStore');

    let studentModified: User = deepCopy(courseModified.students[0]);
    studentModified.username = 'sModif';

    expect(courses[0].students[0]).toEqual(courseModified.students[0]);
    expect(courses[1].students[0]).toEqual(courseModified.students[0]);

    courseStoreService.updateStudentInCourseStoreOneToMany(studentModified);

    expect(courses[0].students[0]).toEqual(studentModified);
    expect(courses[1].students[0]).toEqual(studentModified);
    expect(subjectStoreService.updateCourseInSubjectStore).toHaveBeenCalledTimes(2);

    //not found
    courseStoreService.updateStudentInCourseStoreOneToMany(studentTest3);

    expect(courses[0].students).not.toContain(studentTest3);
    expect(courses[1].students).not.toContain(studentTest3);
    expect(subjectStoreService.updateCourseInSubjectStore).toHaveBeenCalledTimes(2);

  }));

  it('should delete a Student In CourseStore OneToMany', fakeAsync(() => {
    let courses: Course[];
    courseStoreService.courses$.subscribe(data => courses = data);

    let courseModified: Course = deepCopy(courseTest);
    let courseModified2: Course = deepCopy(courseTest2);
    courseModified2.students[0] = courseModified.students[0];
    const coursesTest: Course[] = [courseModified, courseModified2];
    courseBackendServiceSpy.getCourses.and.returnValue(asyncData(coursesTest));
    courseStoreService.loadAllCourses(courseModified.year);
    tick();

    spyOn(subjectStoreService, 'updateCourseInSubjectStore');

    expect(courses[0].students.length).toEqual(2);
    expect(courses[1].students.length).toEqual(2);

    courseStoreService.deleteStudentInCourseStoreOneToMany(courseModified.students[0]);

    expect(subjectStoreService.updateCourseInSubjectStore).toHaveBeenCalledTimes(2);
    expect(courses[0].students.length).toEqual(1);
    expect(courses[1].students.length).toEqual(1);

  }));



});


