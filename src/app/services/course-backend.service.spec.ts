import { TestBed, inject } from '@angular/core/testing';
// Http testing module and mocking controller
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { API_SERVER, URI_COURSES, URI_YEAR, URI_NAME } from '../app.config';
import { Course } from '../models/course';
import { CourseBackendService } from './course-backend.service';
import { courseTest, courseTest2 } from '../testing/models';

const courseURL = API_SERVER + URI_COURSES;

describe('Course Backend Service', () => {
  let httpTestingController: HttpTestingController;
  let courseBackendService: CourseBackendService;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],

      providers: [
        CourseBackendService,
      ]

    });

    httpTestingController = TestBed.get(HttpTestingController);
    courseBackendService = TestBed.get(CourseBackendService);

  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', inject([CourseBackendService], (service: CourseBackendService) => {
    expect(service).toBeTruthy();
  }));

  it('should get courses', () => {
    const coursesTest: Course[] = [courseTest, courseTest2];

    courseBackendService.getCourses('2019')
      .subscribe(data => {
        expect(data).toEqual(coursesTest);
        expect(data.length).toEqual(2);
      });

    const req = httpTestingController.expectOne(courseURL + URI_YEAR + '/2019');

    expect(req.request.method).toEqual('GET');

    req.flush(coursesTest);

  });

  it('should create course', () => {
    courseBackendService.create(courseTest)
      .subscribe(data => expect(data).toEqual(courseTest));

    const req = httpTestingController.expectOne(courseURL);

    expect(req.request.method).toEqual('POST');

    req.flush(courseTest);

  });

  it('should update course', () => {
    courseBackendService.update(courseTest)
      .subscribe(data => expect(data).toEqual(courseTest));

    const req = httpTestingController.expectOne(courseURL + '/c01');

    expect(req.request.method).toEqual('PUT');

    req.flush(courseTest);

  });

  it('should delete course', () => {
    courseBackendService.delete(courseTest)
      .subscribe(data => expect(data).toBeTruthy());

    const req = httpTestingController.expectOne(courseURL + '/c01');

    expect(req.request.method).toEqual('DELETE');

    req.flush(courseTest);

  });

  it('should get course by id', () => {
    courseBackendService.getCourseById('c01')
      .subscribe(data => expect(data).toEqual(courseTest));

    const req = httpTestingController.expectOne(courseURL + '/c01');

    expect(req.request.method).toEqual('GET');

    req.flush(courseTest);

  });

  it('should get course by name', () => {
    courseBackendService.getCourseByName('1A', '2019')
      .subscribe(data => expect(data).toEqual(courseTest));

    const req = httpTestingController.expectOne(courseURL + URI_NAME + '/1A' + '/2019');
    expect(req.request.method).toEqual('GET');

    req.flush(courseTest);

  });


});


