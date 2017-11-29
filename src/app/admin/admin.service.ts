import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { API_SERVER } from '../app.config';
import { HTTPService } from '../services/http.service';
import { Book } from '../models/book';
import { User } from '../models/user';


@Injectable()
export class AdminService {

    private apiUrl = API_SERVER + '/users';  // URL to web api
    private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

    constructor(
        private httpCli: HttpClient,
        private httpToken: HTTPService
    ) { }


    private handleError(error: any): Promise<any> {
        console.error('An error occurred!!!!!!', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    getBooksHttpToken(): Promise<Book[]> {
        return this.httpToken
            .get(this.apiUrl)
            .toPromise()
            .catch(this.handleError);
    }

    getUsers(): Observable<User[]> {
        return this.httpCli
            .get<User[]>(this.apiUrl)
            .catch(this.handleError);
    }

    getUser(id: number): Observable<User> {
        const url = `${this.apiUrl}/${id}`;
        return this.httpCli
            .get<User>(url)
            .catch(this.handleError);
    }


    createUser(user: User): Observable<User> {
        console.log(this.apiUrl);
        return this.httpCli
            .post(this.apiUrl + '/managers', JSON.stringify(user), { headers: this.httpHeaders, responseType: 'text' })
            .catch(this.handleError);
    }


    updateUser(user: User): Observable<User> {
        return this.httpCli
            .put(this.apiUrl, JSON.stringify(user), { headers: this.httpHeaders, responseType: 'text' })
            .catch(this.handleError);
    }

    deleteUser(id: number): Observable<void> {
        const url = `${this.apiUrl}/${id}`;
        return this.httpCli
            .delete(url, { headers: this.httpHeaders, responseType: 'text' })
            .catch(this.handleError);
    }



}
