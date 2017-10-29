import { BookStoreService } from './book-store.service';
import { DialogOverviewBookComponent } from './dialog/dialog.component';
import { BookService2 } from './book2.service';
import { Book } from '../models/book';
import { Component, OnChanges, OnInit, Output } from '@angular/core';
import { BookService } from './book.service';
import { HttpClient } from '@angular/common/http';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/merge';
import { MatDialog } from '@angular/material';


@Component({
  selector: 'nx-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {

  books: Book[];
  displayedColumns = ['id', 'title', 'crud'];
  dataSource: MDDataSource | null;
  dialogC: DialogOverviewBookComponent;


  constructor(private service: BookStoreService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.dataSource = new MDDataSource(this.service);
    this.dialogC = new DialogOverviewBookComponent(this.dialog);
  }

  openDialog(book: Book): void {
    this.dialogC.book = book;
    this.dialogC.openDialogDetail();
  }

}

//  Data source to provide what data should be rendered in the table.
export class MDDataSource extends DataSource<any> {

  constructor(private service: BookStoreService) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
 connect(): Observable<Book[]> {
     this.service.loadInitialData();
     return this.service.books$;
  }

  disconnect() { }

}




