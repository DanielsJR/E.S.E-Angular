import { TestBed, inject } from '@angular/core/testing';
// Http testing module and mocking controller
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { API_BACKEND_SERVER, URI_NAME, URI_SUBJECT, URI_TEACHER } from '../app.config';
import { SubjectBackendService } from './subject-backend.service';
import { Subject } from '../models/subject';
import { subjectTest, subjectTest2 } from '../testing/models';

const subjectURL = API_BACKEND_SERVER + URI_SUBJECT;

describe('Subject Backend Service', () => {
  let httpTestingController: HttpTestingController;
  let subjectBackendService: SubjectBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],

      providers: [
        SubjectBackendService,
      ]

    });

    httpTestingController = TestBed.get(HttpTestingController);
    subjectBackendService = TestBed.get(SubjectBackendService);

  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', inject([SubjectBackendService], (service: SubjectBackendService) => {
    expect(service).toBeTruthy();
  }));

  it('should get subjects', () => {
    const subjecsTest: Subject[] = [subjectTest, subjectTest2];

    subjectBackendService.getSubjectsByYear('2018')
      .subscribe(data => {
        expect(data).toEqual(subjecsTest);
        expect(data.length).toEqual(2);
      });

    const req = httpTestingController.expectOne(subjectURL);

    expect(req.request.method).toEqual('GET');

    req.flush(subjecsTest);

  });

  it('should create subject', () => {
    subjectBackendService.create(subjectTest)
      .subscribe(data => expect(data).toEqual(subjectTest));

    const req = httpTestingController.expectOne(subjectURL);

    expect(req.request.method).toEqual('POST');

    req.flush(subjectTest);

  });

  it('should update course', () => {
    subjectBackendService.update(subjectTest)
      .subscribe(data => expect(data).toEqual(subjectTest));

    const req = httpTestingController.expectOne(subjectURL + '/s01');

    expect(req.request.method).toEqual('PUT');

    req.flush(subjectTest);

  });

  it('should delete subject', () => {
    subjectBackendService.delete(subjectTest)
      .subscribe(data => expect(data).toEqual(subjectTest));

    const req = httpTestingController.expectOne(subjectURL + '/s01');

    expect(req.request.method).toEqual('DELETE');

    req.flush(subjectTest);

  });

  it('should get subject by id', () => {
    subjectBackendService.getSubjectById('s01')
      .subscribe(data => expect(data).toEqual(subjectTest));

    const req = httpTestingController.expectOne(subjectURL + '/s01');

    expect(req.request.method).toEqual('GET');

    req.flush(subjectTest);

  });

  it('should get subject by name', () => {
    subjectBackendService.getSubjectByName('MATEMATICAS')
      .subscribe(data => expect(data).toEqual(subjectTest));

    const req = httpTestingController.expectOne(subjectURL + URI_NAME + '/MATEMATICAS');
    expect(req.request.method).toEqual('GET');

    req.flush(subjectTest);

  });

 /* it('should get subjects by teacher id', () => {
    const subjecsTest: Subject[] = [subjectTest];
    subjectBackendService.getSubjectsByTeacherAndYear('t01')
      .subscribe(data => expect(data).toEqual(subjecsTest));

    const req = httpTestingController.expectOne(subjectURL + URI_TEACHER + '/t01');
    expect(req.request.method).toEqual('GET');

    req.flush(subjecsTest);

  }); */


});


