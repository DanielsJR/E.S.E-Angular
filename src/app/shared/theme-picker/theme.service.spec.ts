import { TestBed, inject } from '@angular/core/testing';
// Http testing module and mocking controller
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { API_BACKEND_SERVER, URI_PREFERENCES, URI_THEME } from '../../app.config';
import { ThemeService } from './theme.service';
import { themeLightTest, themeDarkTest } from '../../testing/models';


const themeURL = API_BACKEND_SERVER + URI_PREFERENCES + URI_THEME;

describe('Theme Backend Service', () => {
  let httpTestingController: HttpTestingController;
  let themeService: ThemeService;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],

      providers: [
        ThemeService,
      ]

    });

    httpTestingController = TestBed.get(HttpTestingController);
    themeService = TestBed.get(ThemeService);

  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', inject([ThemeService], (service: ThemeService) => {
    expect(service).toBeTruthy();
  }));

  it('should get theme', () => {
     themeService.getTheme('red-indigo')
      .subscribe(data => {
        expect(data).toEqual(themeLightTest);
      });

    const req = httpTestingController.expectOne(themeURL + '/red-indigo');

    expect(req.request.method).toEqual('GET');

    req.flush(themeLightTest);

  });

  it('should save theme', () => {
    themeService.saveTheme('m01',themeLightTest)
      .subscribe(data => expect(data).toBeTruthy());

    const req = httpTestingController.expectOne(themeURL + '/m01');

    expect(req.request.method).toEqual('PUT');

    req.flush(themeLightTest);

  });



});


