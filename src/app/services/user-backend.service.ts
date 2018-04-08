import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { catchError } from 'rxjs/operators';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { User } from '../models/user';
import { API_SERVER, URI_USERS, URI_MANAGERS, URI_TOKEN, URI_ID, URI_USERNAME } from '../app.config';
// import 'rxjs/add/operator/catch';


@Injectable()
export class UserBackendService {

    private userURL = API_SERVER + URI_USERS;

    constructor(private httpCli: HttpClient) { }


    getUsers(uriRole: string): Observable<User[]> {
        const url = `${this.userURL}${uriRole}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<User[]>(url)
    }

    create(user: User, uriRole: string): Observable<User> {
        const url = `${this.userURL}${uriRole}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.post<User>(url, user);
    }

    update(user: User, uriRole: string): Observable<User> {
        const id = user.id;
        const url = `${this.userURL}${uriRole}/${id}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.put<User>(url, user);
    }

    delete(id: string, uriRole: string): Observable<{}> {
        const url = `${this.userURL}${uriRole}/${id}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.delete<{}>(url);
    }

    getUserById(id: number, uriRole: string): Observable<User> {
        const url = `${this.userURL}${uriRole}/${id}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<User>(url);
    }

    getUserByToken(token: string, uriRole: string): Observable<User> {
        const url = `${this.userURL}${uriRole}${URI_TOKEN}/${token}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<User>(url);
    }

    getUserByUserName(name: string, uriRole: string): Observable<User> {
        const url = `${this.userURL}${uriRole}${URI_USERNAME}/${name}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<User>(url);
    }

    getUsersByRole(role: string, uriRole: string): Observable<User[]> {
        const url = `${this.userURL}${uriRole}/${role}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.get<User[]>(url);
    }

}
