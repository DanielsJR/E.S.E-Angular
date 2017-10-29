import { BookStoreService } from './book-store.service';
import { BookService2 } from './book2.service';
import { Book } from '../models/book';
import { Component, OnInit, Output } from '@angular/core';
import { BookService } from './book.service';
import { Observable } from 'rxjs/Observable';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'nx-bookChild',
    template: `
    <h3>AsyncPipe using NgFor</h3>
    <ul *ngIf="books$">
      <li *ngFor="let book of books$ | async" >
        Id: {{book.id}}, Title: {{book.title}}
      </li>
    </ul>

  `,
    styles: [`

  `]
})
export class BookChildComponent implements OnInit {

    books$: Observable<Book[]>;

    constructor(private service: BookStoreService) { }

    ngOnInit(): void {
        this.books$ = this.service.books$;
    }


}
