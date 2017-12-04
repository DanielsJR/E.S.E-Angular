import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_SERVER, URI_USERS, URI_MANAGERS, BY_TOKEN, BY_ID } from '../../app.config';
import { User } from '../../models/user';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';


@Injectable()
export class UserService {

    private usersURL = API_SERVER + URI_USERS;
    // private apiUrl = API_SERVER + '/users';

    constructor(private httpCli: HttpClient) { }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred!!!!!!', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    getUserById(id: number): Observable<User> {
        const url = `${this.usersURL}${BY_ID}/${id}`;
        return this.httpCli
            .get<User>(url)
            .catch(this.handleError);
    }
    getUserByToken(token: string): Observable<User> {
        const url = `${this.usersURL}${BY_TOKEN}/${token}`;
        return this.httpCli
            .get<User>(url)
            .catch(this.handleError);
    }

    getUsers(): Observable<User[]> {
        return this.httpCli
            .get<User[]>(this.usersURL)
            .catch(this.handleError);
    }

    create(user: User): Observable<User> {
        console.log(this.usersURL + URI_MANAGERS);
        return this.httpCli
            .post(this.usersURL + URI_MANAGERS, JSON.stringify(user), { responseType: 'text' })
            .catch(this.handleError);
    }

    update(user: User): Observable<User> {
        console.log(this.usersURL);
        return this.httpCli
            .put(this.usersURL, JSON.stringify(user), { responseType: 'text' })
            .catch(this.handleError);
    }

    delete(id: number): Observable<void> {
        const url = `${this.usersURL}/${id}`;
        return this.httpCli
            .delete(url, { responseType: 'text' })
            .catch(this.handleError);
    }


}
