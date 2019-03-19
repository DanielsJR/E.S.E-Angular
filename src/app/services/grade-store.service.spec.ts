import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { gradeTest2, gradeTest } from '../testing/models';
import { HttpClient } from '@angular/common/http';
import { httpStub } from '../testing/stubs';
import { asyncData } from '../testing/async-helpers';
import { IsLoadingService } from './isLoadingService.service';
import { GradeStoreService } from './grade-store.service';
import { GradeBackendService } from './grade-backend.service';
import { Grade } from '../models/grade';



describe('Grade Store Service', () => {
  let gradeStoreService: GradeStoreService;
  let gradeBackendServiceSpy: jasmine.SpyObj<GradeBackendService>;
  let isLoadingService: IsLoadingService;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('GradeBackendService', ['getGrades', 'create', 'update', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        GradeStoreService,
        { provide: GradeBackendService, useValue: spy },
        { provide: HttpClient, useValue: httpStub },
        IsLoadingService,
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

  }));

  it('should create Grade', fakeAsync(() => {
    let isLoading;
    isLoadingService.isLoading$.subscribe(data => isLoading = data);

    let grade: Grade;
    gradeBackendServiceSpy.create.and.returnValue(asyncData(gradeTest));
    gradeStoreService.create(gradeTest).subscribe(data => grade = data);

    expect(isLoading).toBeTruthy();
    tick();
    expect(grade).toEqual(gradeTest);
    expect(isLoading).toBeFalsy();

  }));

  it('should update Grade', fakeAsync(() => {
    let isLoading;
    isLoadingService.isLoading$.subscribe(data => isLoading = data);

    let grade: Grade;
    gradeBackendServiceSpy.update.and.returnValue(asyncData(gradeTest));
    gradeStoreService.update(gradeTest).subscribe(data => grade = data);

    expect(isLoading).toBeTruthy();
    tick();
    expect(grade).toEqual(gradeTest);
    expect(isLoading).toBeFalsy();
  }));

  it('should delete Grade', fakeAsync(() => {
    let grade: Grade;
    gradeBackendServiceSpy.delete.and.returnValue(asyncData(gradeTest));
    gradeStoreService.delete(gradeTest).subscribe(data => grade = data);

    tick();
    expect(grade).toEqual(gradeTest);

  }));


});


