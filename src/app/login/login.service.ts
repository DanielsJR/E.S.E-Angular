import { LocalStorageService } from '../services/local-storage.service';
import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Session } from '../models/session';
import { API_GENERIC_URI, LOCAL_STORAGE_TOKEN_ATTRIBUTE } from '../app.config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HTTPService } from '../services/http.service';

@Injectable()
export class LoginService {
    private endpoint = '/tokens';

    isAdmin = false;
    isManager = false;
    isTeacher = false;
    isStudent = false;

    // store the URL so we can redirect after logging in
    redirectUrl: string;

    constructor(private httpService: HTTPService, private localStorageService: LocalStorageService) { }

    login(userName: string, password: string): Observable<Session> {
        const headers = new Headers({ 'Authorization': 'Basic ' + btoa(userName + ':' + password) });
        return this.httpService.post(this.endpoint, null, headers);
    }

    checkPrivileges(): void {
        if (this.localStorageService.isStored(LOCAL_STORAGE_TOKEN_ATTRIBUTE)) {
            const sessionString: string = this.localStorageService.getItem(LOCAL_STORAGE_TOKEN_ATTRIBUTE);
            const parsedSession: any = JSON.parse(sessionString);
            const session: Session = new Session(parsedSession.token, parsedSession.rol.toString());

            console.log('session token: ' + session.token + ' session rol: ' + session.role);

            if (session.hasPrivileges()) {
                this.isAdmin = (session.role === 'ADMIN') ? true : false;
                this.isManager = (session.role === 'MANAGER') ? true : false;
                this.isTeacher = (session.role === 'TEACHER') ? true : false;
                this.isStudent = (session.role === 'STUDENT') ? true : false;
            }
        }
    }

    logout(): void {
        this.localStorageService.removeItem(LOCAL_STORAGE_TOKEN_ATTRIBUTE);
        this.isAdmin = false;
        this.isManager = false;
        this.isTeacher = false;
        this.isStudent = false;
    }
}
