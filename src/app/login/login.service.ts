import { Injectable } from '@angular/core';
import { API_GENERIC_URI, LOCAL_STORAGE_TOKEN_KEY, API_SERVER, ROLE_ADMIN, ROLE_MANAGER, ROLE_TEACHER, ROLE_STUDENT, URI_TOKEN_AUTH } from '../app.config';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { TokenAuth } from '../models/token-auth';
import { LocalStorageService } from '../services/local-storage.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user';
import { SessionStorageService } from '../services/session-storage.service';


@Injectable()
export class LoginService {
    private endpoint = API_SERVER + URI_TOKEN_AUTH + '/login';
    isAuth = false;
    roles: string[];
    // store the URL so we can redirect after logging in (not in use)
    redirectUrl: string;

    

    constructor(private localStorageService: LocalStorageService, private sessionStorageService: SessionStorageService,
        private httpCli: HttpClient) { }

    public handleError = (error: Response) => {
        return throwError(error);
    }

    getToken(): string {
        return this.localStorageService.getItem(LOCAL_STORAGE_TOKEN_KEY);
    }

    isTokenStored(): boolean {
        return this.localStorageService.isStored(LOCAL_STORAGE_TOKEN_KEY);
    }

    login(username: string, password: string): Observable<User> {
        console.log('Login service called');
        return this.httpCli.post<User>(this.endpoint, null, {
            headers: new HttpHeaders({
                'Authorization': 'Basic ' + btoa(username + ':' + password)
            })
        })
            .pipe(catchError(this.handleError));
    }

    attemptAuth(username: string, password: string): Observable<any> {
        const credentials = { username: username, password: password };
        console.log('attempAuth ::');
        return this.httpCli.post<any>(API_SERVER + '/token/generate-token', credentials);
    }

    logout(): void {
        this.localStorageService.signOut();
        this.sessionStorageService.signOut();
        this.isAuth = false;
        this.isAuth = false;
    }

    hasPrivileges(): boolean {
        if (this.isTokenStored()) {
            for (var i = 0; i < this.localStorageService.getTokenRoles().length; i++) {
                let role = this.localStorageService.getTokenRoles()[i];
                console.log('Role::: '+ role);
                return role === ROLE_ADMIN ||
                    role === ROLE_MANAGER ||
                    role === ROLE_TEACHER ||
                    role === ROLE_STUDENT;
            }
        }
    }

    checkPrivileges(): void {
        if (this.isTokenStored()) {
            console.log('checking privileges of: ' + this.localStorageService.getTokenUsername()
                + ' roles: ' + this.localStorageService.getTokenRoles());
            console.log('is auth????: ' + this.hasPrivileges());
            this.isAuth = this.hasPrivileges();
        } else {
            console.log('unauthorized redirecting.....');
        }

    }

    getPrivilege(): string {
        if (this.isTokenStored()) {
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
        if (this.isTokenStored()) {
            return this.roles = this.localStorageService.getTokenRoles();
        } else {
            console.error('isStore: false');
            return this.roles = [];
        }
    }



}
