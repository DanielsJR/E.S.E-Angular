import { Injectable } from '@angular/core';
import { API_GENERIC_URI, LOCAL_STORAGE_TOKEN_KEY, API_SERVER, ROLE_ADMIN, ROLE_MANAGER, ROLE_TEACHER, ROLE_STUDENT, URI_TOKEN_AUTH } from '../app.config';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { TokenAuth } from '../models/token-auth';
//import { _throw } from 'rxjs/observable/throw';
//import 'rxjs/add/observable/throw'
// import 'rxjs/add/operator/catch';


@Injectable()
export class LoginService {
    private endpoint = API_SERVER + URI_TOKEN_AUTH;
    isAuth = false;
    isAdmin = false;
    isManager = false;
    isTeacher = false;
    isStudent = false;
    roles: string[];
    // store the URL so we can redirect after logging in (not in use)
    redirectUrl: string;

    constructor(
        private localStorageService: LocalStorageService,
        private httpCli: HttpClient
    ) {  }

    public handleError = (err: Response) => {
        return ErrorObservable.create(err);
    }

    login(userName: string, password: string): Observable<TokenAuth> {
        console.log('Login service called');
        return this.httpCli
            .post(this.endpoint, null, {
                headers: new HttpHeaders({ 'Authorization': 'Basic ' + btoa(userName + ':' + password) })
            })
            .pipe(catchError(this.handleError));
    }

    logout(): void {
        this.localStorageService.removeItem(LOCAL_STORAGE_TOKEN_KEY);
        this.isAuth = false;
        this.isAuth = false;
        this.isAdmin = false;
        this.isManager = false;
        this.isTeacher = false;
        this.isStudent = false;
    }

    hasPrivileges(): boolean {
        if (this.localStorageService.isStored(LOCAL_STORAGE_TOKEN_KEY)) {
            for (var i = 0; i < this.localStorageService.getRolesParsed().length; i++) {
                let role = this.localStorageService.getRolesParsed()[i];
                return role === ROLE_ADMIN ||
                    role === ROLE_MANAGER ||
                    role === ROLE_TEACHER ||
                    role === ROLE_STUDENT;
            }
        }
    }

    checkPrivileges(): void {
        if (this.localStorageService.isStored(LOCAL_STORAGE_TOKEN_KEY)) {
            console.log('checking privileges of: ' + this.localStorageService.getTokenParsed()
                + ' roles: ' + this.localStorageService.getRolesParsed().toString());
            console.log('is auth????: ' + this.hasPrivileges());
            this.isAuth = this.hasPrivileges();
        } else {
            console.log('unauthorized redirecting.....');
        }

    }

    getPrivilege(): string {
        if (this.localStorageService.isStored(LOCAL_STORAGE_TOKEN_KEY)) {
            for (var i = 0; i < this.localStorageService.getRolesParsed().length; i++) {
                let role = this.localStorageService.getRolesParsed()[i];
                if (role === ROLE_ADMIN) {
                    this.isAdmin = true;
                    return role.toString();
                }
                if (role === ROLE_MANAGER) {
                    this.isManager = true;
                    return role.toString();
                }
                if (role === ROLE_TEACHER) {
                    this.isTeacher = true;
                    return role.toString();
                }
                if (role === ROLE_STUDENT) {
                    this.isStudent = true;
                    return role.toString();
                };
            }
        }
    }

    getRoles(): string[]{
        if (this.localStorageService.isStored(LOCAL_STORAGE_TOKEN_KEY)) {
           return this.roles = this.localStorageService.getRolesParsed();
        }
    }



}
