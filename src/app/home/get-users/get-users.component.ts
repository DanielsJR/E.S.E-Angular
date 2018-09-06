import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatPaginatorIntl, MatDialogRef } from '@angular/material';
import { ROLE_ADMIN, ROLE_MANAGER, ROLE_TEACHER, ROLE_STUDENT, URI_MANAGERS, URI_TEACHERS, URI_STUDENTS, ROLE_ADMIN_SPANISH, ROLE_MANAGER_SPANISH, ROLE_TEACHER_SPANISH, ROLE_STUDENT_SPANISH } from '../../app.config';
import { User } from '../../models/user';
import { DomSanitizer } from '@angular/platform-browser';
import { SnackbarService } from '../../services/snackbar.service';
import { CardUserDialogRefComponent } from './card-user-dialog/card-user-dialog-ref/card-user-dialog-ref.component';
import { CrudUserDialogComponent } from './crud-user-dialog/crud-user-dialog.component';
import { SessionStorageService } from '../../services/session-storage.service';
import { UserStoreService } from '../../services/user-store.service';

@Component({
  selector: 'nx-get-users',
  templateUrl: './get-users.component.html',
  styleUrls: ['./get-users.component.css']
})

export class GetUsersComponent implements OnInit, AfterViewInit {

  usersRole: string;
  userLoggedRoles: String[] = [];//=this.localStorage.getTokenRoles();
  @Input() areaRole;

  // mat table
  displayedColumns = ['username', 'crud'];
  dataSource;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSize = 20;
  pageSizeOptions = [5, 10, 20];
  isDark = this.sessionStorage.isDarkTheme();
  rowClasses: {};

  // mat dialog
  user: User;
  @Input() uriRole;
  @ViewChild(CrudUserDialogComponent) crudUserDialog: CrudUserDialogComponent;


  constructor(
    private userStoreService: UserStoreService,
    private sessionStorage: SessionStorageService,
    private snackbarService: SnackbarService, public sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.usersRole = this.uriRole.replace('/', '').slice(0, this.uriRole.length - 2);
    this.userLoggedRoles.push(this.areaRole.toLocaleUpperCase());
    console.log("AreaRole: " + this.areaRole);
    this.dataSource = new MatTableDataSource<User>();

    this.userStoreService.successMessage$.subscribe(message => setTimeout(() => this.openSnackBar(message, 'success')));
    this.userStoreService.errorMessage$.subscribe(message => setTimeout(() => this.openSnackBar(message, 'error')));

    if (this.uriRole === URI_MANAGERS) {
      this.userStoreService.managers$.subscribe(data => this.dataSource.data = data);

    } else if (this.uriRole === URI_TEACHERS) {
      this.userStoreService.teachers$.subscribe(data => this.dataSource.data = data);

    } else if (this.uriRole === URI_STUDENTS) {
      this.userStoreService.students$.subscribe(data => this.dataSource.data = data);

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

  usersRoleToSpanish(usersRole: string): string {
    let role = usersRole.toUpperCase();

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
    console.error('no usersRole');
    return 'no usersRole';
  }

  checkEqualOrGreaterPrivileges(userLoggedRoles: string[], userDbRoles: string[]): boolean {
    return userLoggedRoles.every(role => userDbRoles.includes(role));
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


