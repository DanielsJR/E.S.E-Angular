import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Theme } from '../shared/theme-picker/theme';
import { SessionStorageService } from './session-storage.service';
import { LOCAL_STORAGE_THEME_KEY } from '../app.config';


describe('Session Storage Service Theme', () => {
  let sessionStorageService: SessionStorageService;
  let themeTest: Theme = { name: 'red-indigo', color: '#F44336', isDark: false };

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        SessionStorageService,
      ]

    });

    sessionStorageService = TestBed.get(SessionStorageService);

  });

  afterEach(() => {
    sessionStorageService.clearSessionStorage();
  });

  it('should be created', () => {
    expect(sessionStorageService).toBeTruthy();
  });

  it('should get Theme', () => {
    expect(sessionStorageService.getTheme()).toBeNull();
    sessionStorageService.setTheme(LOCAL_STORAGE_THEME_KEY, themeTest);
    expect(sessionStorageService.getTheme()).toBeTruthy();
  });

  it('should tell if it is DarkTheme ', () => {
    sessionStorageService.setTheme(LOCAL_STORAGE_THEME_KEY, themeTest);
    expect(sessionStorageService.isDarkTheme()).toBeFalsy();
  });

  it('should emit darkTheme observable', fakeAsync(() => {
    sessionStorageService.setTheme(LOCAL_STORAGE_THEME_KEY, themeTest);
    sessionStorageService.isThemeDark$.subscribe(data => expect(data).toBeFalsy());
    tick();

  }));




});


