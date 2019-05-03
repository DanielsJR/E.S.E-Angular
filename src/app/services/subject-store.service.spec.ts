import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { subjectTest, subjectTest2, teacherTest, courseTest, teacherTest2, courseTest2 } from '../testing/models';
import { HttpClient } from '@angular/common/http';
import { httpStub } from '../testing/stubs';
import { asyncData } from '../testing/async-helpers';
import { IsLoadingService } from './isLoadingService.service';
import { SubjectStoreService } from './subject-store.service';
import { SubjectBackendService } from './subject-backend.service';
import { Subject } from '../models/subject';
import { deepCopy } from '../shared/functions/deepCopy';
import { User } from '../models/user';
import { Course } from '../models/course';
import { GradeStoreService } from './grade-store.service';




describe('Subject Store Service', () => {
  let subjectStoreService: SubjectStoreService;
  let subjectBackendServiceSpy: jasmine.SpyObj<SubjectBackendService>;
  let isLoadingService: IsLoadingService;
  let gradeStoreService: GradeStoreService;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('SubjectBackendService', [
      'getSubjects',
      'create',
      'update',
      'delete',
      'getSubjectByName',
      'getSubjectById'
    ]);

    TestBed.configureTestingModule({
      providers: [
        { provide: SubjectBackendService, useValue: spy },
        { provide: HttpClient, useValue: httpStub },
      ]

    });

    subjectStoreService = TestBed.get(SubjectStoreService);
    subjectBackendServiceSpy = TestBed.get(SubjectBackendService);
    gradeStoreService = TestBed.get(GradeStoreService);
    isLoadingService = TestBed.get(IsLoadingService);

  });

  afterEach(() => {

  });

  it('should be created', inject([SubjectStoreService], (service: SubjectStoreService) => {
    expect(service).toBeTruthy();
  }));

  it('should get Subjects', fakeAsync(() => {
    let subjects: Subject[];
    subjectStoreService.subjects$.subscribe(data => subjects = data);

    let isLoading;
    subjectStoreService.isLoadingGetSubjects$.subscribe(data => isLoading = data);

    const subjectsTest: Subject[] = [subjectTest, subjectTest2];
    subjectBackendServiceSpy.getSubjects.and.returnValue(asyncData(subjectsTest));
    subjectStoreService.loadAllSubjects();

    expect(isLoading).toBeTruthy();
    tick();
    expect(subjects).toEqual(subjectsTest);
    expect(subjects.length).toEqual(2);
    expect(isLoading).toBeFalsy();
    expect(subjectBackendServiceSpy.getSubjects).toHaveBeenCalledTimes(1);

    subjectStoreService.loadAllSubjects();
    expect(subjectBackendServiceSpy.getSubjects).toHaveBeenCalledTimes(1);

  }));

  it('should get one Subject', fakeAsync(() => {
    let subjects: Subject[];
    subjectStoreService.subjects$.subscribe(data => subjects = data);

    const subjectsTest: Subject[] = [subjectTest, subjectTest2];
    subjectBackendServiceSpy.getSubjects.and.returnValue(asyncData(subjectsTest));
    subjectStoreService.loadAllSubjects();

    let subject: Subject;
    subjectStoreService.loadOneSubject(subjectTest.id).subscribe(data => subject = data);

    expect(subject).toEqual(undefined);
    expect(subjects.length).toEqual(0);
    tick();
    expect(subjects[0]).toEqual(subject);
  }));

  it('should create Subject', fakeAsync(() => {
    let subjects: Subject[];
    subjectStoreService.subjects$.subscribe(data => subjects = data);

    const subjectsTest: Subject[] = [subjectTest];
    subjectBackendServiceSpy.getSubjects.and.returnValue(asyncData(subjectsTest));
    subjectStoreService.loadAllSubjects();
    tick();

    let isLoading;
    isLoadingService.isLoading$.subscribe(data => isLoading = data);

    let subject: Subject;
    subjectBackendServiceSpy.create.and.returnValue(asyncData(subjectTest2));
    subjectStoreService.create(subjectTest2).subscribe(data => subject = data);

    expect(isLoading).toBeTruthy();
    expect(subjects.length).toBe(1);
    tick();
    expect(subject).toEqual(subjectTest2);
    expect(isLoading).toBeFalsy();
    expect(subjects.length).toBe(2);
    expect(subjects[1]).toEqual(subject);

  }));

  it('should update Subject', fakeAsync(() => {
    let subjects: Subject[];
    subjectStoreService.subjects$.subscribe(data => subjects = data);

    const subjectsTest: Subject[] = [subjectTest];
    subjectBackendServiceSpy.getSubjects.and.returnValue(asyncData(subjectsTest));
    subjectStoreService.loadAllSubjects();
    tick();

    let isLoading;
    isLoadingService.isLoading$.subscribe(data => isLoading = data);

    let updateSubjectInGradeStoreSpy = spyOn(gradeStoreService, 'updateSubjectInGradeStore');

    let subject: Subject;
    subjectBackendServiceSpy.update.and.returnValue(asyncData(subjectTest));
    subjectStoreService.update(subjectTest).subscribe(data => subject = data);

    expect(isLoading).toBeTruthy();
    expect(subjects.length).toBe(1);
    tick();
    expect(updateSubjectInGradeStoreSpy).toHaveBeenCalledWith(subject);
    expect(subject).toEqual(subjectTest);
    expect(isLoading).toBeFalsy();
    expect(subjects.length).toBe(1);
    expect(subjects[0]).toEqual(subject);
  }));

  it('should delete Subject', fakeAsync(() => {
    let subjects: Subject[];
    subjectStoreService.subjects$.subscribe(data => subjects = data);

    const subjectsTest: Subject[] = [subjectTest];
    subjectBackendServiceSpy.getSubjects.and.returnValue(asyncData(subjectsTest));
    subjectStoreService.loadAllSubjects();
    tick();

    //let deleteSubjectInGradeStoreSpy = spyOn(gradeStoreService, 'deleteSubjectInGradeStore');

    let subject: Subject;
    subjectBackendServiceSpy.delete.and.returnValue(asyncData(subjectTest));
    subjectStoreService.delete(subjectTest).subscribe(data => subject = data);

    expect(subjects.length).toBe(1);
    tick();
    //expect(deleteSubjectInGradeStoreSpy).toHaveBeenCalledWith(subject);
    expect(subject).toEqual(subjectTest);
    expect(subjects.length).toBe(0);
  }));

  it('should updateTeacherInSubjectStore', fakeAsync(() => {
    let subjects: Subject[];
    subjectStoreService.subjects$.subscribe(data => subjects = data);

    let subjectCopy = deepCopy(subjectTest);
    let subjectCopy2 = deepCopy(subjectTest2);
    subjectCopy.teacher = teacherTest;
    subjectCopy2.teacher = teacherTest;
    const subjectsTest: Subject[] = [subjectCopy, subjectCopy2];
    subjectBackendServiceSpy.getSubjects.and.returnValue(asyncData(subjectsTest));
    subjectStoreService.loadAllSubjects();
    tick();

    expect(subjects.length).toBe(2);
    expect(subjects[0].teacher).toEqual(teacherTest);
    expect(subjects[1].teacher).toEqual(teacherTest);

    let teacherModif: User = deepCopy(teacherTest);
    teacherModif.firstName = 'I am a copy';
    subjectStoreService.updateTeacherInSubjectStore(teacherModif);

    expect(subjects[0].teacher).toEqual(teacherModif);
    expect(subjects[1].teacher).toEqual(teacherModif);
    expect(subjects[0].teacher).not.toEqual(teacherTest);
    expect(subjects[1].teacher).not.toEqual(teacherTest);

    //not found
    subjectStoreService.updateTeacherInSubjectStore(teacherTest2);
    expect(subjects[0].teacher).not.toEqual(teacherTest2);
    expect(subjects[1].teacher).not.toEqual(teacherTest2);

  }));

  it('should updateCourseInSubjectStore', fakeAsync(() => {
    let subjects: Subject[];
    subjectStoreService.subjects$.subscribe(data => subjects = data);

    let subjectCopy: Subject = deepCopy(subjectTest);
    let subjectCopy2: Subject = deepCopy(subjectTest2);
    subjectCopy.course = courseTest;
    subjectCopy2.course = courseTest;
    const subjectsTest: Subject[] = [subjectCopy, subjectCopy2];
    subjectBackendServiceSpy.getSubjects.and.returnValue(asyncData(subjectsTest));
    subjectStoreService.loadAllSubjects();
    tick();

    expect(subjects.length).toBe(2);
    expect(subjects[0].course).toEqual(courseTest);
    expect(subjects[1].course).toEqual(courseTest);

    let courseModf: Course = deepCopy(courseTest);
    courseModf.students = [];
    subjectStoreService.updateCourseInSubjectStore(courseModf);
    expect(subjects[0].course).toEqual(courseModf);
    expect(subjects[1].course).toEqual(courseModf);
    expect(subjects[0].course.students).toEqual([]);
    expect(subjects[1].course.students).toEqual([]);

    //not found
    subjectStoreService.updateCourseInSubjectStore(courseTest2);
    expect(subjects[0].course).not.toEqual(courseTest2);
    expect(subjects[1].course).not.toEqual(courseTest2);

  }));


});


