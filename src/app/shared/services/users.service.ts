import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_SERVER, URI_USERS, URI_MANAGERS, URI_TOKEN, URI_ID, URI_USERNAME} from '../../app.config';
import { User } from '../../models/user';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { catchError } from 'rxjs/operators';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
// import 'rxjs/add/operator/catch';


@Injectable()
export class UserService {

    private userURL = API_SERVER + URI_USERS;

    constructor(private httpCli: HttpClient) { }

    public handleError = (error: Response) => {
        return ErrorObservable.create(error);
    }

    getUsers(uriRole: string): Observable<User[]> {
        const url = `${this.userURL}${uriRole}`;
        console.log(`resource called: ${url}`);
        return this.httpCli
            .get<User[]>(url)
            .pipe(catchError(this.handleError));
    }

    create(user: User, uriRole: string): Observable<User> {
        const url = `${this.userURL}${uriRole}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli
            .post(url, JSON.stringify(user))
            .pipe(catchError(this.handleError));
    }

    update(user: User, uriRole: string): Observable<User> {
       const id = user.id;
        const url = `${this.userURL}${uriRole}/${id}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli
            .put(url, JSON.stringify(user))
            .pipe(catchError(this.handleError));
    }

    delete(id: string, uriRole: string): Observable<void> {
        const url = `${this.userURL}${uriRole}/${id}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli
            .delete(url)
            .pipe(catchError(this.handleError));
    }


    
    getUserById(id: number, uriRole: string): Observable<User> {
        const url = `${this.userURL}${uriRole}/${id}`;
        console.log(`resource called: ${url}`);
        return this.httpCli
            .get<User>(url)
            .pipe(catchError(this.handleError));
    }

    getUserByToken(token: string, uriRole: string): Observable<User> {
        const url = `${this.userURL}${uriRole}${URI_TOKEN}/${token}`;
        console.log(`resource called: ${url}`);
        return this.httpCli
            .get<User>(url)
            .pipe(catchError(this.handleError));
    }

    getUserByUserName(name: string, uriRole: string): Observable<User> {
        const url = `${this.userURL}${uriRole}${URI_USERNAME}/${name}`;
        console.log(`resource called: ${url}`);
        return this.httpCli
            .get<User>(url)
            .pipe(catchError(this.handleError));
    }

    

    

    getUsersByRole(role: string, uriRole: string): Observable<User[]> {
        const url = `${this.userURL}${uriRole}/${role}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli
            .get<User[]>(url)
            .pipe(catchError(this.handleError));
    }

}
