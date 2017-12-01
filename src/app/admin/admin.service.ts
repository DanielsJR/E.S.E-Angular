import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { API_SERVER, ROLE_ADMIN, LOCAL_STORAGE_TOKEN_KEY } from '../app.config';
import { HTTPService } from '../services/http.service';
import { Book } from '../models/book';
import { User } from '../models/user';
import { LocalStorageService } from '../services/local-storage.service';


@Injectable()
export class AdminService {

    private apiUrl = API_SERVER + '/users';


    constructor(
        private httpCli: HttpClient,

    ) {


    }


    private handleError(error: any): Promise<any> {
        console.error('An error occurred!!!!!!', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    getUser(id: number): Observable<User> {
        const url = `${this.apiUrl}/${id}`;
        return this.httpCli
            .get<User>(url)
            .catch(this.handleError);
    }

    getUsers(): Observable<User[]> {
        return this.httpCli
            .get<User[]>(this.apiUrl)
            .catch(this.handleError);
    }

    createUser(user: User): Observable<User> {
        return this.httpCli
            .post(this.apiUrl + '/managers', JSON.stringify(user), { responseType: 'text' })
            .catch(this.handleError);
    }


    updateUser(user: User): Observable<User> {
        return this.httpCli
            .put(this.apiUrl, JSON.stringify(user), {  responseType: 'text' })
            .catch(this.handleError);
    }

    deleteUser(id: number): Observable<void> {
        const url = `${this.apiUrl}/${id}`;
        return this.httpCli
            .delete(url, { responseType: 'text' })
            .catch(this.handleError);
    }



}
