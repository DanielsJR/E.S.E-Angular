import { Injectable } from '@angular/core';
import { API_GENERIC_URI, LOCAL_STORAGE_TOKEN_KEY, API_SERVER, ROLE_ADMIN, ROLE_MANAGER, ROLE_TEACHER, ROLE_STUDENT, URI_TOKEN_AUTH, URI_ADMINS, URI_MANAGERS, URI_TEACHERS, URI_STUDENTS } from '../app.config';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { LocalStorageService } from '../services/local-storage.service';
import { Observable, throwError } from 'rxjs';
import { catchError, tap} from 'rxjs/operators';
import { User } from '../models/user';
import { SessionStorageService } from '../services/session-storage.service';


@Injectable()
export class LoginService {
    private endpoint = API_SERVER + URI_TOKEN_AUTH;
    isAuth = false;
    roles: string[];
    // store the URL so we can redirect after logging in (TODO)
    redirectUrl: string;



    constructor(private localStorageService: LocalStorageService,
        private sessionStorageService: SessionStorageService,
        private httpCli: HttpClient) { }

    login(username: string, password: string): Observable<any> {
        const credentials = { username: username, password: password };
        console.log('login::...');
        return this.httpCli.post<any>(this.endpoint, credentials)
           // .pipe(tap(val => this.isAuth = true));
    }

    handleError = (error: Response) => {
        return throwError(error);
    }

    logout(): void {
        this.localStorageService.signOut();
        this.sessionStorageService.signOut();
        this.isAuth = false;
    }

    getToken(): string {
        return this.localStorageService.getFullToken();
    }

    isTokenStored(): boolean {
        return this.localStorageService.isStored(LOCAL_STORAGE_TOKEN_KEY);
    }

    hasPrivileges(): boolean {
        if (this.isTokenStored() && !this.localStorageService.isTokenExpired()) {
            for (var i = 0; i < this.localStorageService.getTokenRoles().length; i++) {
                let role = this.localStorageService.getTokenRoles()[i];
                return role === ROLE_ADMIN ||
                    role === ROLE_MANAGER ||
                    role === ROLE_TEACHER ||
                    role === ROLE_STUDENT;
            }
        }
    }

    checkPrivileges(): void {
        if (this.isTokenStored() && !this.localStorageService.isTokenExpired()) {
            console.log('checking privileges of: ' + this.localStorageService.getTokenUsername()
                + ' roles: ' + this.localStorageService.getTokenRoles());
            console.log('is auth????: ' + this.hasPrivileges());
            this.isAuth = this.hasPrivileges();
        } else {
            console.log('unauthorized redirecting.....');
        }

    }

    getPrivilege(): string {
        if (this.isTokenStored() && !this.localStorageService.isTokenExpired()) {
            for (var i = 0; i < this.localStorageService.getTokenRoles().length; i++) {
                let role = this.localStorageService.getTokenRoles()[i];
                if (role === ROLE_ADMIN) {
                    return role.toString();
                }
                if (role === ROLE_MANAGER) {
                    return role.toString();
                }
                if (role === ROLE_TEACHER) {
                    return role.toString();
                }
                if (role === ROLE_STUDENT) {
                    return role.toString();
                };
            }
        } else {
            console.error('isStore: false');
            return 'no role';

        }
    }

    getRoles(): string[] {
        if (this.isTokenStored() && !this.localStorageService.isTokenExpired()) {
            return this.roles = this.localStorageService.getTokenRoles();
        } else {
            console.error('isTokenStored: false');
            return this.roles = [];
        }
    }

    private _uriRole: string;

    get uriRole(): string {
  
      if (this.getPrivilege() === ROLE_ADMIN) {
        return this._uriRole = URI_ADMINS;
      } else if (this.getPrivilege()=== ROLE_MANAGER) {
        return this._uriRole = URI_MANAGERS;
      } else if (this.getPrivilege() === ROLE_TEACHER) {
        return this._uriRole = URI_TEACHERS;
      } else if (this.getPrivilege() === ROLE_STUDENT) {
        return this._uriRole = URI_STUDENTS;
      } else {
        console.error('error no role');
        return this._uriRole = "";
  
      }
    }

}
