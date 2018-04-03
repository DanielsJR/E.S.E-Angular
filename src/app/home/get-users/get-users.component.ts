import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource, MatSort, MatPaginator, MatPaginatorIntl } from '@angular/material';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { ROLE_ADMIN, ROLE_MANAGER, ROLE_TEACHER, ROLE_STUDENT, LOCAL_STORAGE_TOKEN_KEY } from '../../app.config';
import { User } from '../../models/user';
import { GetUsersDialogRefComponent } from './get-users-dialog-ref/get-users-dialog-ref.component';
import { StudentStoreService } from './student-store.service';
import { TeacherStoreService } from './teacher-store.service';
import { ManagerStoreService } from './manger-store.service';
import { DialogService } from '../../services/dialog.service';
import { LocalStorageService } from '../../services/local-storage.service';


@Component({
  selector: 'nx-get-users',
  templateUrl: './get-users.component.html',
  styleUrls: ['./get-users.component.css']
})

export class GetUsersComponent implements OnInit, AfterViewInit {

  // mat table
  users: User[];
  displayedColumns = ['username', 'crud'];
  dataSource;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // mat dialog
  user: User;
  roles: string[];
  isDark = this.localstorage.getIsDarkTheme();
  styleClasses: {};
  @Input() uriRole;
    
  constructor(private managerStoreService: ManagerStoreService,
     private teacherStoreService: TeacherStoreService,
     private studentStoreService: StudentStoreService,
     private dialogService: DialogService,
     private localstorage: LocalStorageService) {
   
   }

  ngOnInit() {
    console.log('OnInit called');
    console.log('uriRole:' + this.uriRole);
    this.dialogService.uriRole = this.uriRole;
    this.managerStoreService.uriRole = this.uriRole;
    this.teacherStoreService.uriRole = this.uriRole;
    this.studentStoreService.uriRole = this.uriRole;
   
    this.dataSource = new MatTableDataSource();

    if(this.uriRole === '/managers'){
      this.managerStoreService.users$.subscribe(data => {
        if (data.toString() === '' && this.localstorage.isStored(LOCAL_STORAGE_TOKEN_KEY)) {
        console.log('store clean...getting users');
        this.managerStoreService.getUsers();
      }
      this.dataSource.data = data
    }
    );

    }else if(this.uriRole === '/teachers'){
      this.teacherStoreService.users$.subscribe(data => {
        if (data.toString() === '' && this.localstorage.isStored(LOCAL_STORAGE_TOKEN_KEY)) {
        console.log('store clean...getting users');
        this.teacherStoreService.getUsers();
      }
      this.dataSource.data = data
    }
    );
    }else if (this.uriRole === '/students'){
      this.studentStoreService.users$.subscribe(data => {
        if (data.toString() === '' && this.localstorage.isStored(LOCAL_STORAGE_TOKEN_KEY)) {
        console.log('store clean...getting users');
        this.studentStoreService.getUsers();
      }
      this.dataSource.data = data
    }
    );
    }


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
    this.dialogService.obj = this.user;
    this.dialogService.inputDialogRef = GetUsersDialogRefComponent;
    this.dialogService.openDialogDetail();
  }

  openDialogCreate(): void {
    this.user = new User();
    this.dialogService.obj = this.user;
    this.dialogService.inputDialogRef = GetUsersDialogRefComponent;
    this.dialogService.openDialogCreate();
  }

  openDialogEdit(user: User): void {
    this.user = user;
    this.dialogService.obj = this.user;
    this.dialogService.inputDialogRef = GetUsersDialogRefComponent;
    this.dialogService.openDialogEdit();
  }

  openDialogDelete(user: User): void {
    this.user = user;
    this.dialogService.obj = this.user;
    this.dialogService.inputDialogRef = GetUsersDialogRefComponent;
    this.dialogService.openDialogDelete();
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


