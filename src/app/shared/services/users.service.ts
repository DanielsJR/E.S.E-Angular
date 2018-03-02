import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_SERVER, URI_USER, URI_MANAGERS_REGISTER, URI_BY_TOKEN, URI_BY_ID, URI_BY_NAME, URI_STUDENTS_LIST, URI_USERS_LIST } from '../../app.config';
import { User } from '../../models/user';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { catchError } from 'rxjs/operators';
// import 'rxjs/add/operator/catch';


@Injectable()
export class UserService {

    private userURL = API_SERVER + URI_USER;

    constructor(private httpCli: HttpClient) { }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred!!!!!!', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    getUserById(id: number): Observable<User> {
        const url = `${this.userURL}${URI_BY_ID}/${id}`;
        console.log(`resource called: ${url}`);
        return this.httpCli
            .get<User>(url)
            .pipe(catchError(this.handleError));
    }

    getUserByToken(token: string): Observable<User> {
        const url = `${this.userURL}${URI_BY_TOKEN}/${token}`;
        console.log(`resource called: ${url}`);
        return this.httpCli
            .get<User>(url)
            .pipe(catchError(this.handleError));
    }
    
    getUserByUserName(name: string): Observable<User> {
        const url = `${this.userURL}${URI_BY_NAME}/${name}`;
        console.log(`resource called: ${url}`);
        return this.httpCli
            .get<User>(url)
            .pipe(catchError(this.handleError));
    }

    getUsers(): Observable<User[]> {
        const url = `${this.userURL}${URI_USERS_LIST}`;
        console.log(`resource called: ${url}`);
        return this.httpCli
            .get<User[]>(url)
            .pipe(catchError(this.handleError));
    }

    getUsersByRole(role: string): Observable<User[]> {
        const url = `${this.userURL}/${role}s-list`;
        console.log(`resource called:  ${url}`);
        return this.httpCli
            .get<User[]>(url)
            .pipe(catchError(this.handleError));
    }

    create(user: User): Observable<User> {
        const url = `${this.userURL}${URI_MANAGERS_REGISTER}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli
            .post(url, JSON.stringify(user))
            .pipe(catchError(this.handleError));
    }

    update(user: User): Observable<User> {
        console.log('resource called: ' + this.userURL);
        return this.httpCli
            .put(this.userURL, JSON.stringify(user))
            .pipe(catchError(this.handleError));
    }

    delete(id: number): Observable<void> {
        const url = `${this.userURL}/${id}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli
            .delete(url, { responseType: 'text' })
            .pipe(catchError(this.handleError));
    }


}
