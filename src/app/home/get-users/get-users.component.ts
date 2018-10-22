import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatPaginatorIntl, MatDialogRef } from '@angular/material';
import { ROLE_ADMIN, ROLE_MANAGER, ROLE_TEACHER, ROLE_STUDENT, URI_MANAGERS, URI_TEACHERS, URI_STUDENTS, ROLE_ADMIN_SPANISH, ROLE_MANAGER_SPANISH, ROLE_TEACHER_SPANISH, ROLE_STUDENT_SPANISH, RESULT_CANCELED, RESULT_EDIT, RESULT_DELETE, RESULT_DETAIL } from '../../app.config';
import { User } from '../../models/user';
import { CardUserDialogRefComponent } from './card-user-dialog/card-user-dialog-ref/card-user-dialog-ref.component';
import { CrudUserDialogComponent } from './crud-user-dialog/crud-user-dialog.component';
import { SessionStorageService } from '../../services/session-storage.service';
import { UserStoreService } from '../../services/user-store.service';
import { DomSanitizer } from '@angular/platform-browser';



@Component({
  selector: 'nx-get-users',
  templateUrl: './get-users.component.html',
  styleUrls: ['./get-users.component.css']
})

export class GetUsersComponent implements OnInit, AfterViewInit {

  userRole: string;
  usersRole: string;
  userLoggedRoles: String[] = [];
  @Input() areaRole;

  // mat table
  displayedColumns = ['firstName', 'crud'];
  dataSource;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSize = 20;
  pageSizeOptions = [5, 10, 20];
  isDark = this.sessionStorage.isDarkTheme();
  rowClasses: {};
  isLoading: boolean = false;

  // mat dialog
  user: User;
  @Input() uriRole;
  @ViewChild(CrudUserDialogComponent) crudUserDialog: CrudUserDialogComponent;

  constructor(private userStoreService: UserStoreService, private sessionStorage: SessionStorageService,
    public sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    //this.usersRole = this.uriRole.replace('/', '').slice(0, this.uriRole.length - 2);
    this.userLoggedRoles.push(this.areaRole.toLocaleUpperCase());
    console.log("AreaRole: " + this.areaRole);
    this.dataSource = new MatTableDataSource<User>();


    if (this.uriRole === URI_MANAGERS) {
      this.userStoreService.isLoadingGetManagers$.subscribe(isLoadding => setTimeout(() => this.isLoading = isLoadding));
      this.userStoreService.managers$.subscribe(data => this.dataSource.data = data);
      this.userRole = ROLE_MANAGER_SPANISH;
      this.usersRole = ROLE_MANAGER_SPANISH + 'res';

    } else if (this.uriRole === URI_TEACHERS) {
      this.userStoreService.isLoadingGetTeachers$.subscribe(isLoadding => setTimeout(() => this.isLoading = isLoadding));
      this.userStoreService.teachers$.subscribe(data => this.dataSource.data = data);
      this.userRole = ROLE_TEACHER_SPANISH;
      this.usersRole = ROLE_TEACHER_SPANISH + 's';

    } else if (this.uriRole === URI_STUDENTS) {
      this.userStoreService.isLoadingGetStudents$.subscribe(isLoadding => setTimeout(() => this.isLoading = isLoadding));
      this.userStoreService.students$.subscribe(data => this.dataSource.data = data);
      this.userRole = ROLE_STUDENT_SPANISH;
      this.usersRole = ROLE_STUDENT_SPANISH + 's';
    } else {
      console.error('NO uriRole');
    }


    this.sessionStorage.isThemeDark$.subscribe(isDark => {
      this.isDark = isDark;
      this.setRowClass();
    });
    this.setRowClass();

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  setRowClass() {
    this.rowClasses = {
      'fila': !this.isDark,
      'fila-dark': this.isDark
    };
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  dialogCardUserSubs(dialogRef: MatDialogRef<CardUserDialogRefComponent>): void {
    dialogRef.afterClosed().subscribe(result => {
      if (result === RESULT_CANCELED) {
        console.log(RESULT_CANCELED);
      } else if (result === RESULT_DETAIL) {
        this.crudUserDialog.openDialogDetail(dialogRef.componentInstance.user);
      } else if (result === RESULT_EDIT) {
        this.crudUserDialog.openDialogEdit(dialogRef.componentInstance.user);
      } else if (result === RESULT_DELETE) {
        this.crudUserDialog.openDialogDelete(dialogRef.componentInstance.user);
      }
    });
  }

  checkEqualOrGreaterPrivileges(userLoggedRoles: string[], userDbRoles: string[]): boolean {
    return userLoggedRoles.every(role => userDbRoles.includes(role));
  }

}





