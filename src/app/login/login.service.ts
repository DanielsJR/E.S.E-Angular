
import { Injectable } from '@angular/core';
import { Session } from '../models/session';
import { API_GENERIC_URI, LOCAL_STORAGE_TOKEN_KEY, API_SERVER, ROLE_ADMIN, ROLE_MANAGER, ROLE_TEACHER, ROLE_STUDENT, URI_TOKEN_AUTH } from '../app.config';
import { Observable } from 'rxjs/Observable';
import { HTTPService } from '../services/http.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { catchError } from 'rxjs/operators';
// import 'rxjs/add/operator/catch';


@Injectable()
export class LoginService {
    private endpoint = API_SERVER + URI_TOKEN_AUTH;

    isAdmin = false;
    isManager = false;
    isTeacher = false;
    isStudent = false;

    // store the URL so we can redirect after logging in
    redirectUrl: string;

    constructor(
        private localStorageService: LocalStorageService,
        private httpCli: HttpClient
    ) { }

 /*   private handleError(error: any): Promise<any> {
        console.error('An error occurred!!!!!!', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
    */

    public handleError = (err: Response) => {
   
    return Observable.throw(err);
}

    login(userName: string, password: string): Observable<Session> {
        console.log('Login called');
        return this.httpCli
            .post(this.endpoint, null, { headers: new HttpHeaders({ 'Authorization': 'Basic ' + btoa(userName + ':' + password) }) })
            .pipe(catchError(this.handleError));
    }

    logout(): void {
        this.localStorageService.removeItem(LOCAL_STORAGE_TOKEN_KEY);
        this.isAdmin = false;
        this.isManager = false;
        this.isTeacher = false;
        this.isStudent = false;
    }

    checkPrivileges(): void {
        if (this.localStorageService.isStored(LOCAL_STORAGE_TOKEN_KEY)) {
            console.log('checking privileges of: ' + this.localStorageService.getToken()
                + ' rol: ' + this.localStorageService.getRole());
            this.isAdmin = (this.localStorageService.getRole() === ROLE_ADMIN) ? true : false;
            this.isManager = (this.localStorageService.getRole() === ROLE_MANAGER) ? true : false;
            this.isTeacher = (this.localStorageService.getRole() === ROLE_TEACHER) ? true : false;
            this.isStudent = (this.localStorageService.getRole() === ROLE_STUDENT) ? true : false;
        } else {
            console.log('unauthorized redirecting.....');
        }

    }
}
