import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatTableDataSource, MatSort, MatPaginator, MatPaginatorIntl, MatButton, MatDialogRef } from '@angular/material';
import { ROLE_ADMIN, ROLE_MANAGER, ROLE_TEACHER, ROLE_STUDENT, LOCAL_STORAGE_TOKEN_KEY, URI_MANAGERS, URI_TEACHERS, URI_STUDENTS, ROLE_ADMIN_SPANISH, ROLE_MANAGER_SPANISH, ROLE_TEACHER_SPANISH, ROLE_STUDENT_SPANISH } from '../../app.config';
import { User } from '../../models/user';
import { LocalStorageService } from '../../services/local-storage.service';
import { ManagerStoreService } from '../../services/manger-store.service';
import { TeacherStoreService } from '../../services/teacher-store.service';
import { StudentStoreService } from '../../services/student-store.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SnackbarService } from '../../services/snackbar.service';
import { CardUserDialogRefComponent } from './card-user-dialog/card-user-dialog-ref/card-user-dialog-ref.component';
import { CrudUserDialogComponent } from './crud-user-dialog/crud-user-dialog.component';
import { SessionStorageService } from '../../services/session-storage.service';


@Component({
  selector: 'nx-get-users',
  templateUrl: './get-users.component.html',
  styleUrls: ['./get-users.component.css']
})

export class GetUsersComponent implements OnInit, AfterViewInit {

  privilege: string;

  // mat table
  users: User[];
  displayedColumns = ['username', 'crud'];
  dataSource;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSize = 5;
  pageSizeOptions = [5, 10, 20];

  // mat dialog
  user: User;
  roles: string[];
  isDark = this.sessionStorage.isDarkTheme();
  rowClasses: {};
  @Input() uriRole;
  @ViewChild(CrudUserDialogComponent) crudUserDialog: CrudUserDialogComponent;

  constructor(private managerStoreService: ManagerStoreService,
    private teacherStoreService: TeacherStoreService, private studentStoreService: StudentStoreService,
    private localstorage: LocalStorageService, private sessionStorage: SessionStorageService,
    private snackbarService: SnackbarService, public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.privilege = this.uriRole.replace('/', '').slice(0, this.uriRole.length - 2);
    this.dataSource = new MatTableDataSource();

    if (this.uriRole === URI_MANAGERS) {
      this.managerStoreService.users$.subscribe(data => {
        if (data != null && data.length === 0 && this.localstorage.isStored(LOCAL_STORAGE_TOKEN_KEY)) {
          console.log('store empty...getting ' + this.uriRole);
          this.managerStoreService.getUsers();
        }
        this.dataSource.data = data;
      });
      this.managerStoreService.successMessage$.subscribe(message => setTimeout(() => this.openSnackBar(message, 'success')));
      this.managerStoreService.errorMessage$.subscribe(message => setTimeout(() => this.openSnackBar(message, 'error')));

    } else if (this.uriRole === URI_TEACHERS) {
      this.teacherStoreService.users$.subscribe(data => {
        if (data != null && data.length === 0 && this.localstorage.isStored(LOCAL_STORAGE_TOKEN_KEY)) {
          console.log('store empty...getting ' + this.uriRole);
          this.teacherStoreService.getUsers();
        }
        this.dataSource.data = data;
      });
      this.teacherStoreService.successMessage$.subscribe(message => setTimeout(() => this.openSnackBar(message, 'success')));
      this.teacherStoreService.errorMessage$.subscribe(message => setTimeout(() => this.openSnackBar(message, 'error')));

    } else if (this.uriRole === URI_STUDENTS) {
      this.studentStoreService.users$.subscribe(data => {
        if (data != null && data.length === 0 && this.localstorage.isStored(LOCAL_STORAGE_TOKEN_KEY)) {
          console.log('store empty...getting ' + this.uriRole);
          this.studentStoreService.getUsers();
        }
        this.dataSource.data = data;
      });
      this.studentStoreService.successMessage$.subscribe(message => setTimeout(() => this.openSnackBar(message, 'success')));
      this.studentStoreService.errorMessage$.subscribe(message => setTimeout(() => this.openSnackBar(message, 'error')));

    } else {
      console.error('NO uriRole');
    }

    this.sessionStorage.isThemeDark$.subscribe(isDark => {
      this.isDark = isDark;
      this.setRowClass();
    });

    this.setRowClass();

  }

  setRowClass() {
    this.rowClasses = {
      'fila': !this.isDark,
      'fila-dark': this.isDark
    };
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

  openDialogCardUser(dialogRef: MatDialogRef<CardUserDialogRefComponent>, user: User): void {
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'canceled') {
        console.log('canceled!');
      } else if (result === 'detail') {
        this.crudUserDialog.openDialogDetail(user);
      } else if (result === 'edit') {
        this.crudUserDialog.openDialogEdit(user);
      } else if (result === 'delete') {
        this.crudUserDialog.openDialogDelete(user);
      }
    });
  }

  openSnackBar(message: string, type: any): void {
    let data = {
      message: message,
      uriRole: this.uriRole,
      type: type
    };

    let snackBarRef = this.snackbarService.openSnackBar(data);
    //snackBarRef.afterOpened().subscribe(() => console.log('The snack-bar afterOpened!!!!'));
    //snackBarRef.afterDismissed().subscribe(() => console.log('The snack-bar was dismissed!!!'));
    //snackBarRef.onAction().subscribe(() => console.log('The snack-bar action was triggered!!!!'));
  }

  privilegeToSpanish(privilege: string): string {
    let role = privilege.toUpperCase();

    if (role === ROLE_ADMIN) {
      return role = ROLE_ADMIN_SPANISH;
    }
    else if (role === ROLE_MANAGER) {
      return role = ROLE_MANAGER_SPANISH + 'es';
    }
    else if (role === ROLE_TEACHER) {
      return role = ROLE_TEACHER_SPANISH + 's';
    }
    else if (role === ROLE_STUDENT) {
      return role = ROLE_STUDENT_SPANISH + 's';
    }
    console.error('no privilege');
    return 'no privilege';
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


