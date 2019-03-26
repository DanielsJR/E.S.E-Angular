import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';
import { LOCAL_STORAGE_TOKEN_KEY, ROLE_ADMIN, ROLE_MANAGER, ROLE_TEACHER } from '../app.config';
import { tokenTest } from '../testing/token-test';



describe('Local Storage Service Token', () => {
  let localStorageService: LocalStorageService;
  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        LocalStorageService,
      ]

    });

    localStorageService = TestBed.get(LocalStorageService);

  });

  afterEach(() => {
    localStorageService.clearLocalStorage();
  });

  it('should be created', () => {
    expect(localStorageService).toBeTruthy();
  });

  it('should tell if is TokenStored', () => {
    expect(localStorageService.isTokenStored()).toBeFalsy();
    localStorageService.setItem(LOCAL_STORAGE_TOKEN_KEY, tokenTest);
    expect(localStorageService.isTokenStored()).toBeTruthy();
  });

  it('should getToken', () => {
    expect(localStorageService.getToken()).toBeNull();
    localStorageService.setItem(LOCAL_STORAGE_TOKEN_KEY, tokenTest);
    expect(localStorageService.getToken()).toEqual(tokenTest);
  });

  it('should getExpireDate', () => {
    expect(localStorageService.getExpireDate()).toBeNull();
    localStorageService.setItem(LOCAL_STORAGE_TOKEN_KEY,tokenTest);
    expect(localStorageService.getExpireDate()).toEqual(1553013062);
  });

  it('should tell if is TokenExpired', () => {
    expect(localStorageService.isTokenExpired()).toBeTruthy();
    localStorageService.setItem(LOCAL_STORAGE_TOKEN_KEY,tokenTest);
    expect(localStorageService.isTokenExpired()).toBeTruthy();
  });

  it('should getTokenUsername', () => {
    expect(localStorageService.getTokenUsername()).toBeNull();
    localStorageService.setItem(LOCAL_STORAGE_TOKEN_KEY,tokenTest);
    expect(localStorageService.getTokenUsername()).toEqual('111');
  });

  it('should getTokenRoles', () => {
    expect(localStorageService.getTokenRoles()).toEqual([]);
    localStorageService.setItem(LOCAL_STORAGE_TOKEN_KEY,tokenTest);
    expect(localStorageService.getTokenRoles()).toEqual([]); // tokenTest expired

    spyOn(localStorageService, 'isTokenExpired').and.returnValue(false);
    expect(localStorageService.getTokenRoles()).toEqual([ROLE_ADMIN]);
  });

  it('should sortRoles', () => {
    expect(localStorageService.sortRoles([ROLE_MANAGER, ROLE_ADMIN])).toEqual([ROLE_ADMIN, ROLE_MANAGER]);
    expect(localStorageService.sortRoles([ROLE_MANAGER, ROLE_ADMIN, ROLE_TEACHER])).toEqual([ROLE_ADMIN, ROLE_MANAGER, ROLE_TEACHER]);
    expect(localStorageService.sortRoles([ROLE_TEACHER, ROLE_MANAGER])).toEqual([ROLE_MANAGER, ROLE_TEACHER]);
  });



});


