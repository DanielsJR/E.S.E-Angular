import { Book } from '../../models/book';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogOverviewBookDialogComponent } from './dialog-overview-dialog.component';

/**
 * @title Dialog Overview
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-overview',
  templateUrl: './dialog-overview.html',
  // encapsulation: ViewEncapsulation.None
})

export class DialogOverviewBookComponent {

  @Input() book: Book;
  @Input() type: string;

  constructor(public dialog: MatDialog) { }

  openDialogDetail(): void {
    const dialogRef = this.dialog.open(DialogOverviewBookDialogComponent, {
      width: '250px',
      data: {
        id: this.book.id,
        isbn: this.book.isbn,
        title: this.book.title,
        authorList: this.book.authorList,
        themeList: this.book.themeList,
        type: 'detail'
      },
      panelClass: 'myDialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog detail was closed');
      console.log(`Dialog result: ${result}`);
      if (result === 'edit') {
        this.openDialogEdit();
      } else if (result === 'delete') {
        this.openDialogDelete();
      }
    });
  }

  openDialogCreate(): void {
    const dialogRef = this.dialog.open(DialogOverviewBookDialogComponent, {
      width: '250px',
      data: {
        id: '',
        isbn: '',
        title: '',
        authorList: [],
        themeList: [],
        type: 'create'
      },
      disableClose: true,
      panelClass: 'myDialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog create was closed');
      console.log(`Dialog result: ${result}`);
    });

  }

  openDialogEdit(): void {
    const dialogRef = this.dialog.open(DialogOverviewBookDialogComponent, {
      width: '250px',
      data: {
        id: this.book.id,
        isbn: this.book.isbn,
        title: this.book.title,
        authorList: this.book.authorList,
        themeList: this.book.themeList,
        type: 'edit'
      },
      disableClose: true,
      panelClass: 'myDialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog edit was closed');
      console.log(`Dialog result: ${result}`);
    });
  }

  openDialogDelete(): void {
    const dialogRef = this.dialog.open(DialogOverviewBookDialogComponent, {
      width: '250px',
      data: {
        id: this.book.id,
        isbn: this.book.isbn,
        title: this.book.title,
        authorList: this.book.authorList,
        themeList: this.book.themeList,
        type: 'delete'
      },
      disableClose: true,
      panelClass: 'myDialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog delete was closed');
      console.log(`Dialog result: ${result}`);
    });

  }


}

