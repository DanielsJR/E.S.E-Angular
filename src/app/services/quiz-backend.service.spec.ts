import { TestBed, inject } from '@angular/core/testing';
// Http testing module and mocking controller
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { API_SERVER, URI_QUIZES } from '../app.config';
import { QuizBackendService } from './quiz-backend.service';
import { Quiz } from '../models/quiz';
import { quizTest, quizTest2 } from '../testing/models';

const quizURL = API_SERVER + URI_QUIZES;

describe('Quiz Backend Service', () => {
  let httpTestingController: HttpTestingController;
  let quizBackendService: QuizBackendService;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],

      providers: [
        QuizBackendService,
      ]

    });

    httpTestingController = TestBed.get(HttpTestingController);
    quizBackendService = TestBed.get(QuizBackendService);

  });

  afterEach(() => {
    httpTestingController.verify();
  });

  fit('should be created', inject([QuizBackendService], (service: QuizBackendService) => {
    expect(service).toBeTruthy();
  }));

  fit('should get quizes', () => {
    const quizsesTest: Quiz[] = [quizTest, quizTest2];

    quizBackendService.getQuizes()
      .subscribe(data => {
        expect(data).toEqual(quizsesTest);
        expect(data.length).toEqual(2);
      });

    const req = httpTestingController.expectOne(quizURL);

    expect(req.request.method).toEqual('GET');

    req.flush(quizsesTest);

  });

  fit('should create quiz', () => {
    quizBackendService.create(quizTest)
      .subscribe(data => expect(data).toEqual(quizTest));

    const req = httpTestingController.expectOne(quizURL);

    expect(req.request.method).toEqual('POST');

    req.flush(quizTest);

  });

  fit('should update quiz', () => {
    quizBackendService.update(quizTest)
      .subscribe(data => expect(data).toEqual(quizTest));

    const req = httpTestingController.expectOne(quizURL + '/q01');

    expect(req.request.method).toEqual('PUT');

    req.flush(quizTest);

  });

  fit('should delete quiz', () => {
    quizBackendService.delete(quizTest)
      .subscribe(data => expect(data).toBeTruthy());

    const req = httpTestingController.expectOne(quizURL + '/q01');

    expect(req.request.method).toEqual('DELETE');

    req.flush(quizTest);

  });

  fit('should get quiz by id', () => {
    quizBackendService.getQuizById('q01')
      .subscribe(data => expect(data).toEqual(quizTest));

    const req = httpTestingController.expectOne(quizURL + '/q01');

    expect(req.request.method).toEqual('GET');

    req.flush(quizTest);

  });


});





