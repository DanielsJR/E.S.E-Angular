import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { subjectTest, subjectTest2 } from '../testing/models';
import { HttpClient } from '@angular/common/http';
import { httpStub } from '../testing/stubs';
import { asyncData } from '../testing/async-helpers';
import { IsLoadingService } from './isLoadingService.service';
import { SubjectStoreService } from './subject-store.service';
import { SubjectBackendService } from './subject-backend.service';
import { Subject } from '../models/subject';




describe('Subject Store Service', () => {
  let subjectStoreService: SubjectStoreService;
  let subjectBackendServiceSpy: jasmine.SpyObj<SubjectBackendService>;
  let isLoadingService: IsLoadingService;

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
        SubjectStoreService,
        { provide: SubjectBackendService, useValue: spy },
        { provide: HttpClient, useValue: httpStub },
        IsLoadingService,
      ]

    });

    subjectStoreService = TestBed.get(SubjectStoreService);
    subjectBackendServiceSpy = TestBed.get(SubjectBackendService);
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

  }));

  it('should get one Subject', fakeAsync(() => {
    let subjects: Subject[];
    subjectStoreService.subjects$.subscribe(data => subjects = data);

    //not found and adds
    subjectBackendServiceSpy.getSubjectByName.and.returnValue(asyncData(subjectTest));
    subjectStoreService.loadOneSubject(subjectTest.name);
    tick();

    expect(subjects.length).toEqual(1);

    //found and update
    subjectBackendServiceSpy.getSubjectByName.and.returnValue(asyncData(subjectTest));
    subjectStoreService.loadOneSubject(subjectTest.name);
    tick();

    expect(subjects.length).toEqual(1);

  }));

  it('should create Subject', fakeAsync(() => {
    let isLoading;
    isLoadingService.isLoading$.subscribe(data => isLoading = data);

    let subject: Subject;
    subjectBackendServiceSpy.create.and.returnValue(asyncData(subjectTest));
    subjectStoreService.create(subjectTest).subscribe(data => subject = data);

    expect(isLoading).toBeTruthy();
    tick();
    expect(subject).toEqual(subjectTest);
    expect(isLoading).toBeFalsy();

  }));

  it('should update Subject', fakeAsync(() => {
    let isLoading;
    isLoadingService.isLoading$.subscribe(data => isLoading = data);

    let subject: Subject;
    subjectBackendServiceSpy.update.and.returnValue(asyncData(subjectTest));
    subjectStoreService.update(subjectTest).subscribe(data => subject = data);

    expect(isLoading).toBeTruthy();
    tick();
    expect(subject).toEqual(subjectTest);
    expect(isLoading).toBeFalsy();
  }));

  it('should delete Subject', fakeAsync(() => {
    let subject: Subject;
    subjectBackendServiceSpy.delete.and.returnValue(asyncData(subjectTest));
    subjectStoreService.delete(subjectTest).subscribe(data => subject = data);

    tick();
    expect(subject).toEqual(subjectTest);

  }));


});


