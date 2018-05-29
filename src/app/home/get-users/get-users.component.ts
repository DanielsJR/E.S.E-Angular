import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatTableDataSource, MatSort, MatPaginator, MatPaginatorIntl, MatButton, MatDialogRef } from '@angular/material';
import { ROLE_ADMIN, ROLE_MANAGER, ROLE_TEACHER, ROLE_STUDENT, LOCAL_STORAGE_TOKEN_KEY, URI_MANAGERS, URI_TEACHERS, URI_STUDENTS, ROLE_ADMIN_SPANISH, ROLE_MANAGER_SPANISH, ROLE_TEACHER_SPANISH, ROLE_STUDENT_SPANISH } from '../../app.config';
import { User } from '../../models/user';
import { DialogService } from '../../services/dialog.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { ManagerStoreService } from '../../services/manger-store.service';
import { TeacherStoreService } from '../../services/teacher-store.service';
import { StudentStoreService } from '../../services/student-store.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SnackbarService } from '../../services/snackbar.service';
import { CardUserDialogRefComponent } from './card-user-dialog/card-user-dialog-ref/card-user-dialog-ref.component';
import { CrudUserDialogComponent } from './crud-user-dialog/crud-user-dialog.component';


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

  // mat dialog
  user: User;
  roles: string[];
  isDark = this.localstorage.getIsDarkTheme();
  rowClasses: {};
  @Input() uriRole;
  @ViewChild(CrudUserDialogComponent) private crudUserDialog: CrudUserDialogComponent;

  constructor(private managerStoreService: ManagerStoreService,
    private teacherStoreService: TeacherStoreService,
    private studentStoreService: StudentStoreService,
    private dialogService: DialogService, private localstorage: LocalStorageService,
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

    this.localstorage.isThemeDark$.subscribe(isDark => {
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
      this.crudUserDialog.user = user;
      if (result === 'canceled') {
        console.log('canceled!');
      } else if (result === 'detail') {
        this.crudUserDialog.openDialogDetail();
      } else if (result === 'edit') {
        this.crudUserDialog.openDialogEdit();
      } else if (result === 'delete') {
        this.crudUserDialog.openDialogDelete();
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
    snackBarRef.afterOpened().subscribe(() => console.log('The snack-bar afterOpened!!!!'));
    snackBarRef.afterDismissed().subscribe(() => console.log('The snack-bar was dismissed!!!'));
    snackBarRef.onAction().subscribe(() => console.log('The snack-bar action was triggered!!!!'));
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

  shortName(user: User): string {
    const n1 = user.firstName.substr(0, user.firstName.indexOf(' ')) || user.firstName;
    const n2 = user.lastName.substr(0, user.lastName.indexOf(' ')) || user.lastName;
    return n1 + ' ' + n2;
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


