import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { gradeTest2, gradeTest, subjectTest, teacherTest, studentTest, subjectTest2, studentTest3 } from '../testing/models';
import { HttpClient } from '@angular/common/http';
import { httpStub } from '../testing/stubs';
import { asyncData } from '../testing/async-helpers';
import { IsLoadingService } from './isLoadingService.service';
import { GradeStoreService } from './grade-store.service';
import { GradeBackendService } from './grade-backend.service';
import { Grade } from '../models/grade';
import { deepCopy } from '../shared/functions/deepCopy';
import { User } from '../models/user';
import { Subject } from '../models/subject';



describe('Grade Store Service', () => {
  let gradeStoreService: GradeStoreService;
  let gradeBackendServiceSpy: jasmine.SpyObj<GradeBackendService>;
  let isLoadingService: IsLoadingService;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('GradeBackendService', ['getGrades', 'create', 'update', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        { provide: GradeBackendService, useValue: spy },
        { provide: HttpClient, useValue: httpStub },

      ]

    });

    gradeStoreService = TestBed.get(GradeStoreService);
    gradeBackendServiceSpy = TestBed.get(GradeBackendService);
    isLoadingService = TestBed.get(IsLoadingService);

  });

  afterEach(() => {

  });

  it('should be created', inject([GradeStoreService], (service: GradeStoreService) => {
    expect(service).toBeTruthy();
  }));

  it('should get Grades', fakeAsync(() => {
    let grades: Grade[];
    gradeStoreService.grades$.subscribe(data => grades = data);

    let isLoading;
    gradeStoreService.isLoadingGetGrades$.subscribe(data => isLoading = data);

    const gradesTest: Grade[] = [gradeTest, gradeTest2];
    gradeBackendServiceSpy.getGrades.and.returnValue(asyncData(gradesTest));
    gradeStoreService.loadAllGrades();

    expect(isLoading).toBeTruthy();
    tick();
    expect(grades).toEqual(gradesTest);
    expect(grades.length).toEqual(2);
    expect(isLoading).toBeFalsy();
    expect(gradeBackendServiceSpy.getGrades).toHaveBeenCalledTimes(1);

    gradeStoreService.loadAllGrades();
    expect(gradeBackendServiceSpy.getGrades).toHaveBeenCalledTimes(1);

  }));

  it('should get one Grade', fakeAsync(() => {
    let grades: Grade[];
    gradeStoreService.grades$.subscribe(data => grades = data);

    const gradesTest: Grade[] = [gradeTest, gradeTest2];
    gradeBackendServiceSpy.getGrades.and.returnValue(asyncData(gradesTest));
    gradeStoreService.loadAllGrades();

    let grade: Grade;
    gradeStoreService.loadOneGrade(gradeTest.id).subscribe(data => grade = data);

    expect(grade).not.toEqual(gradeTest);
    expect(grades.length).toEqual(0);
    tick();
    expect(grades[0]).toEqual(grade);
    expect(grades.length).toEqual(2);

  }));

  it('should create Grade', fakeAsync(() => {
    let grades: Grade[];
    gradeStoreService.grades$.subscribe(data => grades = data);

    const gradesTest: Grade[] = [gradeTest];
    gradeBackendServiceSpy.getGrades.and.returnValue(asyncData(gradesTest));
    gradeStoreService.loadAllGrades();
    tick();

    let isLoading;
    isLoadingService.isLoading$.subscribe(data => isLoading = data);

    let grade: Grade;
    gradeBackendServiceSpy.create.and.returnValue(asyncData(gradeTest2));
    gradeStoreService.create(gradeTest2).subscribe(data => grade = data);

    expect(isLoading).toBeTruthy();
    expect(grades.length).toBe(1);
    tick();
    expect(grade).toEqual(gradeTest2);
    expect(isLoading).toBeFalsy();
    expect(grades[1]).toEqual(grade);
    expect(grades.length).toBe(2);

  }));

  it('should update Grade', fakeAsync(() => {
    let grades: Grade[];
    gradeStoreService.grades$.subscribe(data => grades = data);

    const gradesTest: Grade[] = [gradeTest];
    gradeBackendServiceSpy.getGrades.and.returnValue(asyncData(gradesTest));
    gradeStoreService.loadAllGrades();
    tick();

    let isLoading;
    isLoadingService.isLoading$.subscribe(data => isLoading = data);

    let grade: Grade;
    gradeBackendServiceSpy.update.and.returnValue(asyncData(gradeTest));
    gradeStoreService.update(gradeTest).subscribe(data => grade = data);

    expect(isLoading).toBeTruthy();
    tick();
    expect(grade).toEqual(gradeTest);
    expect(isLoading).toBeFalsy();
    expect(grades[0]).toEqual(grade);
  }));

  it('should delete Grade', fakeAsync(() => {
    let grades: Grade[];
    gradeStoreService.grades$.subscribe(data => grades = data);

    const gradesTest: Grade[] = [gradeTest];
    gradeBackendServiceSpy.getGrades.and.returnValue(asyncData(gradesTest));
    gradeStoreService.loadAllGrades();
    tick();

    let grade: Grade;
    gradeBackendServiceSpy.delete.and.returnValue(asyncData(gradeTest));
    gradeStoreService.delete(gradeTest).subscribe(data => grade = data);

    expect(grades.length).toEqual(1);
    tick();
    expect(grade).toEqual(gradeTest);
    expect(grades.length).toEqual(0);

  }));

  it('updateSubjectInGradeStore', fakeAsync(() => {
    let grades: Grade[];
    gradeStoreService.grades$.subscribe(data => grades = data);

    let gradeCopy: Grade = deepCopy(gradeTest);
    let gradeCopy2: Grade = deepCopy(gradeTest2);
    gradeCopy.subject = subjectTest;
    gradeCopy2.subject = subjectTest;
    const gradesTest: Grade[] = [gradeCopy, gradeCopy2];
    gradeBackendServiceSpy.getGrades.and.returnValue(asyncData(gradesTest));
    gradeStoreService.loadAllGrades();
    tick();

    expect(grades.length).toBe(2);
    expect(grades[0].subject).toEqual(subjectTest);
    expect(grades[1].subject).toEqual(subjectTest);

    let subjectModif: Subject = deepCopy(subjectTest);
    subjectModif.name = 'copy';
    subjectModif.teacher = null;
    gradeStoreService.updateSubjectInGradeStore(subjectModif);

    expect(grades[0].subject).toEqual(subjectModif);
    expect(grades[1].subject).toEqual(subjectModif);
    expect(grades[0].subject.name).toEqual('copy');
    expect(grades[1].subject.name).toEqual('copy');
    expect(grades[0].subject.teacher).toEqual(null);
    expect(grades[1].subject.teacher).toEqual(null);

    //not found
    gradeStoreService.updateSubjectInGradeStore(subjectTest2);
    expect(grades[0].subject).not.toEqual(subjectTest2);
    expect(grades[1].subject).not.toEqual(subjectTest2);

  }));

  it('updateStudentInGradeStore', fakeAsync(() => {
    let grades: Grade[];
    gradeStoreService.grades$.subscribe(data => grades = data);

    let gradeCopy: Grade = deepCopy(gradeTest);
    let gradeCopy2: Grade = deepCopy(gradeTest2);
    gradeCopy.student = studentTest;
    gradeCopy2.student = studentTest;
    const gradesTest: Grade[] = [gradeCopy, gradeCopy2];
    gradeBackendServiceSpy.getGrades.and.returnValue(asyncData(gradesTest));
    gradeStoreService.loadAllGrades();
    tick();

    expect(grades.length).toBe(2);

    let studentModif: User = deepCopy(studentTest);
    studentModif.firstName = 'copy';

    expect(grades[0].student).toEqual(studentTest);
    expect(grades[1].student).toEqual(studentTest);

    gradeStoreService.updateStudentInGradeStore(studentModif);

    expect(grades[0].student).toEqual(studentModif);
    expect(grades[1].student).toEqual(studentModif);
    expect(grades[0].student.firstName).toEqual('copy');
    expect(grades[1].student.firstName).toEqual('copy');
    expect(grades[0].student).not.toEqual(studentTest);
    expect(grades[1].student).not.toEqual(studentTest);

    //not found
    gradeStoreService.updateStudentInGradeStore(studentTest3);
    expect(grades[0].student).not.toEqual(studentTest3);
    expect(grades[1].student).not.toEqual(studentTest3);

  }));


});


