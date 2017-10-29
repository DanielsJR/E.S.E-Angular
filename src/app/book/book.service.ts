import { API_SERVER } from '../app.config';
import { Observable } from 'rxjs/Observable';
import { Book } from '../models/book';
import { Headers, Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HTTPService } from '../services/http.service';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';


@Injectable()
export class BookService {

    private apiUrl = API_SERVER + '/books';  // URL to web api
    private headers = new Headers({ 'Content-Type': 'application/json' });
    private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

    constructor(
        private http: Http,
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

    getBooks(): Observable<Book[]> {
        return this.httpCli
            .get<Book[]>(this.apiUrl)
            .catch(this.handleError);
    }

    getBook(id: number): Observable<Book> {
        const url = `${this.apiUrl}/${id}`;
        return this.httpCli
            .get<Book>(url)
            .catch(this.handleError);
    }


    create(book: Book): Observable<Book> {
        return this.httpCli
            .post(this.apiUrl, JSON.stringify(book), { headers: this.httpHeaders, responseType: 'text' })
            .catch(this.handleError);
    }


    update(book: Book): Observable<Book> {
        return this.httpCli
            .put(this.apiUrl, JSON.stringify(book), { headers: this.httpHeaders, responseType: 'text' })
            .catch(this.handleError);
    }

    delete(id: number): Observable<void> {
        const url = `${this.apiUrl}/${id}`;
        return this.httpCli
            .delete(url, { headers: this.httpHeaders, responseType: 'text' })
            .catch(this.handleError);
    }



}
