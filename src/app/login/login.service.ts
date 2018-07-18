import { Injectable } from '@angular/core';
import { API_GENERIC_URI, API_SERVER, ROLE_ADMIN, ROLE_MANAGER, ROLE_TEACHER, ROLE_STUDENT, URI_TOKEN_AUTH, URI_ADMINS, URI_MANAGERS, URI_TEACHERS, URI_STUDENTS } from '../app.config';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { LocalStorageService } from '../services/local-storage.service';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../models/user';
import { SessionStorageService } from '../services/session-storage.service';


@Injectable()
export class LoginService {
    private endpoint = API_SERVER + URI_TOKEN_AUTH;
    isAuth = false;
    roles: string[];
    redirectUrl: string;
    tokenUsername;



    constructor(private localStorageService: LocalStorageService,
        private sessionStorageService: SessionStorageService,
        private httpCli: HttpClient) { }

    login(username: string, password: string): Observable<any> {
        const credentials = { username: username, password: password };
        console.log('login::...');
        return this.httpCli.post<any>(this.endpoint, credentials)
    }

    logout(): void {
        this.localStorageService.signOut();
        this.sessionStorageService.signOut();
        this.isAuth = false;
    }

    getToken(): string {
        return this.localStorageService.getFullToken();
    }

    getRoles(): string[] {
        return this.roles = this.localStorageService.getTokenRoles();
    }

    getTokenUsername(): string {
        return this.tokenUsername = this.localStorageService.getTokenUsername();
    }

    hasPrivileges(): boolean {
        for (var i = 0; i < this.getRoles().length; i++) {
            let role = this.getRoles()[i];
            return role === ROLE_ADMIN ||
                role === ROLE_MANAGER ||
                role === ROLE_TEACHER ||
                role === ROLE_STUDENT;
        }
    }

    getPrivilege(): string {
        for (var i = 0; i < this.getRoles().length; i++) {
            let role = this.getRoles()[i];
            if (role === ROLE_ADMIN) return role.toString();
            if (role === ROLE_MANAGER) return role.toString();
            if (role === ROLE_TEACHER) return role.toString();
            if (role === ROLE_STUDENT) return role.toString();
        }
        console.error('error no role');
        return 'no role';
    }

    private _uriRole: string;

    get uriRole(): string {
        if (this.getPrivilege() === ROLE_ADMIN) return this._uriRole = URI_ADMINS;
        if (this.getPrivilege() === ROLE_MANAGER) return this._uriRole = URI_MANAGERS;
        if (this.getPrivilege() === ROLE_TEACHER) return this._uriRole = URI_TEACHERS;
        if (this.getPrivilege() === ROLE_STUDENT) return this._uriRole = URI_STUDENTS;
        console.error('error no role');
        return this._uriRole = 'no role';
    }

}
