import { BookStoreService } from '../book-store.service';
import { BookService2 } from '../book2.service';
import { Book } from '../../models/book';
import { Data } from '@angular/router';
import { BookService } from '../book.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'dialog-overview-dialog',
    templateUrl: './dialog-overview-dialog.html',
    styles: [`
    .app-input-icon {
        font-size: 16px;
      },

    `]
})

export class DialogOverviewBookDialogComponent implements OnInit {

    createForm: FormGroup;
    editForm: FormGroup;
    book: Book;

    constructor(
        public dialogRef: MatDialogRef<DialogOverviewBookDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private service: BookStoreService,
        private service2: BookService2,
        private formBuilder: FormBuilder
    ) {
        this.book = new Book();
    }

    ngOnInit(): void {
        this.buildForm();
        console.log('OnInit data:' + JSON.stringify(this.data));
    }

    buildForm() {
        this.createForm = this.formBuilder.group({
            isbn: [this.data.isbn, Validators.required],
            title: [this.data.title, Validators.required],
            author: [this.data.authorList],
            theme: [this.data.themeList]
        });
        this.editForm = this.formBuilder.group({
            id: [this.data.id],
            isbn: [this.data.isbn, Validators.required],
            title: [this.data.title, Validators.required],
            author: [this.data.authorList],
            theme: [this.data.themeList]
        });
    }

    // getters
    get cIsbn() { return this.createForm.get('isbn'); }
    get cTitle() { return this.createForm.get('title'); }
    get cAuthor() { return this.createForm.get('author'); }
    get cTheme() { return this.createForm.get('theme'); }

    // getters
    get eIsbn() { return this.editForm.get('isbn'); }
    get eTitle() { return this.editForm.get('title'); }
    get eAuthor() { return this.editForm.get('author'); }
    get eTheme() { return this.editForm.get('theme'); }


    cancel(): void {
        this.dialogRef.close('canceled');
    }

    detailEdit(): void {
        this.dialogRef.close('edit');
    }

    detailDelete(): void {
        this.dialogRef.close('delete');
    }


    create(): void {
        this.book = this.createForm.value;
        console.log('creating... ' + JSON.stringify(this.book));
        this.service.create(this.book);
        this.dialogRef.close('created');
    }

    save(): void {
        this.book = this.editForm.value;
        console.log('saving... ' + JSON.stringify(this.book));
        this.service.update(this.book);
        this.dialogRef.close('saved');
    }

    delete(): void {
        this.book = this.editForm.value;
        console.log('deleting... ' + JSON.stringify(this.data));
        this.service.remove(this.book.id);
        this.dialogRef.close('deleted');
    }


}
