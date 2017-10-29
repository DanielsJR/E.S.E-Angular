import { API_SERVER } from '../app.config';
import { Book } from '../models/book';
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';



@Injectable()
export class BookService2 {
    books$: Observable<Book[]>;
    private booksSource: BehaviorSubject<Book[]>;
    private baseUrl: string;
    private dataStore: { books: Book[] };
    private headers = new Headers({ 'Content-Type': 'application/json' });

    constructor(private http: Http) {
        this.baseUrl = API_SERVER + '/books';
        this.dataStore = { books: [] };
        this.booksSource = <BehaviorSubject<Book[]>>new BehaviorSubject([]);
        this.books$ = this.booksSource.asObservable();
    }

    getBooks() {
        this.http
            .get(this.baseUrl)
            .map(response => response.json())
            .subscribe(data => {
                this.dataStore.books = data;
                this.booksSource.next(Object.assign({}, this.dataStore).books);
            }, error => console.log('Could not load todos.'));
    }

    create(book: Book) {
        this.http
            .post(this.baseUrl, JSON.stringify(book), { headers: this.headers })
            .subscribe(() => {
               this.getBooks();
            }, error => console.log('Could not loadAll book ' + error));
    }

    update(book: Book) {
        this.http
            .put(this.baseUrl, JSON.stringify(book), { headers: this.headers })
            .subscribe(() => {
                this.getBooks();
            }, error => console.log('Could not loadAll book.'));
    }

    remove(bookId: number) {
        this.http
            .delete(`${this.baseUrl}/${bookId}`)
            .subscribe(() => {
                this.getBooks();
            }, error => console.log('Could not loadAll book.'));
    }
}
