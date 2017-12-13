import { LocalStorageService } from '../../shared/services/local-storage.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { User } from '../../models/user';

import { DialogService } from '../dialog.service';
import { UserStoreService } from '../../shared/services/user-store.service';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource, MatSort, MatPaginator, MatPaginatorIntl } from '@angular/material';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { UsersDialogRefComponent } from '../admin-get-users/dialog/users-dialog-ref.component';

@Component({
  templateUrl: './admin-get-mangers.component.html',
  styleUrls: ['./admin-get-mangers.component.css']
})

export class AdminGetMangersComponent implements OnInit, AfterViewInit {

  // mat table
  users: User[];
  displayedColumns = ['userName'];
  dataSource;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // mat dialog
  user: User;
  isDark = this.localstorage.getIsDarkTheme();
  styleClasses: {};


  constructor(private userStoreService: UserStoreService, private dialogServ: DialogService, private localstorage: LocalStorageService) { }

  ngOnInit() {
    console.log('OnInit called');
    this.dataSource = new MatTableDataSource();
    this.userStoreService.managers$.subscribe(data => this.dataSource.data = data);

    this.localstorage.isThemeDark$.subscribe(
      isDark => {
        this.isDark = isDark;
        this.setDarkClass();
      }
    );
    this.setDarkClass();

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  openDialogDetail(user: User): void {
    this.user = user;
    this.dialogServ.obj = this.user;
    this.dialogServ.inputDialogRef = UsersDialogRefComponent;
    this.dialogServ.openDialogDetail();
  }

  openDialogCreate(): void {
    this.user = new User();
    this.dialogServ.obj = this.user;
    this.dialogServ.inputDialogRef = UsersDialogRefComponent;
    this.dialogServ.openDialogCreate();
  }

  setDarkClass() {
    // [ngClass]="{'fila': !isDark, 'fila-dark': isDark}" other way in the template

    // CSS classes: added/removed per current state of component properties
    this.styleClasses = {
      'fila': !this.isDark,
      'fila-dark': this.isDark
    };
  }

}

export class MatPaginatorIntlSpa extends MatPaginatorIntl {
  itemsPerPageLabel = 'Items por pagina:';
  nextPageLabel = 'Página Siguiente';
  previousPageLabel = 'Página Anterior';

  /** A label for the range of items within the current page and the length of the whole list. */
  getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length == 0 || pageSize == 0) {
      return `0 de ${length}`;
    } length = Math.max(length, 0); const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} de ${length}`;
  }
}



