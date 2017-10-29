import { BookService } from './book.service';
import { Book } from '../models/book';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class BookStoreService {

    private booksSource = <BehaviorSubject<Book[]>>new BehaviorSubject([]);
    books$ = this.booksSource.asObservable();
    private dataStore: { books: Book[] };

    constructor(private bookBackendService: BookService) {
        this.dataStore = { books: [] };
        this.loadInitialData();
    }

    loadInitialData() {
        this.bookBackendService
            .getBooks()
            .subscribe(data => {
                this.dataStore.books = data;
                this.booksSource.next(Object.assign({}, this.dataStore).books);
            },
            err => console.log('Error retrieving Todos')
            );
    }

    create(newBook: Book) {
        return this.bookBackendService
            .create(newBook)
            .subscribe(() => {
                this.loadInitialData();
            }, error => console.log('Could not loadAll book ' + error));
    }

    update(newBook: Book) {
        return this.bookBackendService
            .update(newBook)
            .subscribe(() => {
                this.loadInitialData();
            }, error => console.log('Could not loadAll book ' + error));
    }

    remove(id: number) {
        return this.bookBackendService
            .delete(id)
            .subscribe(() => {
                this.loadInitialData();
            }, error => console.log('Could not loadAll book ' + error));
    }


}
