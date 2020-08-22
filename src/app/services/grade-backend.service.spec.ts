import { TestBed, inject } from '@angular/core/testing';
// Http testing module and mocking controller
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { API_BACKEND_SERVER, URI_GRADE, URI_TITLE, URI_STUDENT } from '../app.config';
import { gradeTest2, gradeTest } from '../testing/models';
import { GradeBackendService } from './grade-backend.service';
import { Grade } from '../models/grade';

const gradeURL = API_BACKEND_SERVER + URI_GRADE;

describe('Grade Backend Service', () => {
  let httpTestingController: HttpTestingController;
  let gradeBackendService: GradeBackendService;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],

      providers: [
        GradeBackendService,
      ]

    });

    httpTestingController = TestBed.get(HttpTestingController);
    gradeBackendService = TestBed.get(GradeBackendService);

  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', inject([GradeBackendService], (service: GradeBackendService) => {
    expect(service).toBeTruthy();
  }));

  it('should get grades', () => {
    const gradesTest: Grade[] = [gradeTest, gradeTest2];

    gradeBackendService.getGrades()
      .subscribe(data => {
        expect(data).toEqual(gradesTest);
        expect(data.length).toEqual(2);
      });

    const req = httpTestingController.expectOne(gradeURL);

    expect(req.request.method).toEqual('GET');

    req.flush(gradesTest);

  });

  it('should create grade', () => {
    gradeBackendService.create(gradeTest)
      .subscribe(data => expect(data).toEqual(gradeTest));

    const req = httpTestingController.expectOne(gradeURL);

    expect(req.request.method).toEqual('POST');

    req.flush(gradeTest);

  });

  it('should update grade', () => {
    gradeBackendService.update(gradeTest)
      .subscribe(data => expect(data).toEqual(gradeTest));

    const req = httpTestingController.expectOne(gradeURL + '/g01');

    expect(req.request.method).toEqual('PUT');

    req.flush(gradeTest);

  });

  it('should delete grade', () => {
    gradeBackendService.delete(gradeTest)
      .subscribe(data => expect(data).toEqual(gradeTest));

    const req = httpTestingController.expectOne(gradeURL + '/g01');

    expect(req.request.method).toEqual('DELETE');

    req.flush(gradeTest);

  });

  it('should get grade by id', () => {
    gradeBackendService.getGradeById('g01')
      .subscribe(data => expect(data).toEqual(gradeTest));

    const req = httpTestingController.expectOne(gradeURL + '/g01');

    expect(req.request.method).toEqual('GET');

    req.flush(gradeTest);

  });

  it('should get grade by title', () => {
    gradeBackendService.getGradeByTitle('examen01')
      .subscribe(data => expect(data).toEqual(gradeTest));

    const req = httpTestingController.expectOne(gradeURL + URI_TITLE + '/examen01');

    expect(req.request.method).toEqual('GET');

    req.flush(gradeTest);

  });

  it('should get grade by student', () => {
    const gradesTest: Grade[] = [gradeTest];
    gradeBackendService.getGradesByStudent('s01')
      .subscribe(data => expect(data).toEqual(gradesTest));

    const req = httpTestingController.expectOne(gradeURL + URI_STUDENT + '/s01');

    expect(req.request.method).toEqual('GET');

    req.flush(gradesTest);

  });

});


