import { Component, OnInit, Input, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { URI_MANAGERS, URI_TEACHERS, URI_STUDENTS, ROLE_MANAGER_SPANISH, ROLE_TEACHER_SPANISH, ROLE_STUDENT_SPANISH, RESULT_CANCELED, RESULT_EDIT, RESULT_DELETE, RESULT_DETAIL, ROLE_ADMIN } from '../../app.config';
import { User } from '../../models/user';
import { CardUserDialogRefComponent } from './card-user-dialog/card-user-dialog-ref/card-user-dialog-ref.component';
import { CrudUserDialogComponent } from './crud-user-dialog/crud-user-dialog.component';
import { SessionStorageService } from '../../services/session-storage.service';
import { UserStoreService } from '../../services/user-store.service';
import { DomSanitizer } from '@angular/platform-browser';
import { shortNameSecondName } from '../../shared/functions/shortName';
import { Subscription } from 'rxjs/internal/Subscription';
import { SnackbarService } from '../../services/snackbar.service';
import { UserLoggedService } from '../../services/user-logged.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogRef } from '@angular/material/dialog';
import { rowAnimation } from '../../shared/animations/animations';



@Component({
  selector: 'nx-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  animations: [rowAnimation]
})

export class UsersComponent implements OnInit, AfterViewInit, OnDestroy {

  userRole: string;
  usersRole: string;
  @Input() areaRole;

  // mat table
  displayedColumns = ['firstName', 'crud'];
  dataSource;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSize = 20;
  pageSizeOptions = [5, 10, 20];
  isDark;
  rowClasses: {};
  isLoading: boolean = false;

  // mat dialog
  user: User;
  @Input() uriRole;
  @ViewChild('crudUserDialog') crudUserDialog: CrudUserDialogComponent;

  isThemeDarkSubscription: Subscription;
  usersSubscription: Subscription;
  isLoadingGetSubscription: Subscription;

  constructor(private userStoreService: UserStoreService, private sessionStorage: SessionStorageService,
    public sanitizer: DomSanitizer, private userLoggedService: UserLoggedService,
  ) { }

  ngOnInit() {
    console.log("AreaRole: " + this.areaRole + "  userLoggedRoles: " + this.userLoggedService.getRoles());

    this.dataSource = new MatTableDataSource<User[]>();
    this.dataSource.filterPredicate = (user: User, filterValue: string) =>
      (user.firstName.toLowerCase() + ' ' + user.lastName.toLowerCase()).indexOf(filterValue) === 0 ||
      user.firstName.toLowerCase().indexOf(filterValue) === 0 || user.lastName.toLowerCase().indexOf(filterValue) === 0
      || shortNameSecondName(user).toLowerCase().indexOf(filterValue) === 0;




    if (this.uriRole === URI_MANAGERS) {
      this.isLoadingGetSubscription = this.userStoreService.isLoadingGetManagers$.subscribe(isLoadding => setTimeout(() => this.isLoading = isLoadding));
      this.usersSubscription = this.userStoreService.managers$.subscribe(data => this.dataSource.data = data);
      this.userRole = ROLE_MANAGER_SPANISH;
      this.usersRole = ROLE_MANAGER_SPANISH + 'res';

    } else if (this.uriRole === URI_TEACHERS) {
      this.isLoadingGetSubscription = this.userStoreService.isLoadingGetTeachers$.subscribe(isLoadding => setTimeout(() => this.isLoading = isLoadding));
      this.usersSubscription = this.userStoreService.teachers$.subscribe(data => this.dataSource.data = data);
      this.userRole = ROLE_TEACHER_SPANISH;
      this.usersRole = ROLE_TEACHER_SPANISH + 's';

    } else if (this.uriRole === URI_STUDENTS) {
      this.isLoadingGetSubscription = this.userStoreService.isLoadingGetStudents$.subscribe(isLoadding => setTimeout(() => this.isLoading = isLoadding));
      this.usersSubscription = this.userStoreService.students$.subscribe(data => this.dataSource.data = data);
      this.userRole = ROLE_STUDENT_SPANISH;
      this.usersRole = ROLE_STUDENT_SPANISH + 's';

    } else {
      console.error('NO uriRole');
    }

    this.isThemeDarkSubscription = this.sessionStorage.isThemeDark$.subscribe(isDark => this.isDark = isDark);

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  }

  ngOnDestroy(): void {
    this.isThemeDarkSubscription.unsubscribe();
    this.usersSubscription.unsubscribe();
    this.isLoadingGetSubscription.unsubscribe();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  dialogCardUserSubs(dialogRef: MatDialogRef<CardUserDialogRefComponent>): void {
    let user = dialogRef.componentInstance.user;
    dialogRef.afterClosed().subscribe(result => {
      if (result === RESULT_CANCELED) {
        console.log(RESULT_CANCELED);
      } else if (result === RESULT_DETAIL) {
        this.crudUserDialog.openDialogDetail(user);
      } else if (result === RESULT_EDIT) {
        this.crudUserDialog.openDialogEdit(user);
      } else if (result === RESULT_DELETE) {
        this.crudUserDialog.openDialogDelete(user);
      }
    });
  }


  checkEqualOrGreaterPrivileges(userLoggedRoles: string[], userDbRoles: string[]): boolean {
    return userLoggedRoles.every(role => userDbRoles.includes(role));
  }

  isAdminEditingTeacher() {
    if (this.isAdmin() && this.uriRole === URI_TEACHERS) return true;
    return false;
  }

  isAdmin() {
    return this.userLoggedService.isAdmin();
  }

  crudVisibility(user: User) {
    return (!this.checkEqualOrGreaterPrivileges(this.userLoggedService.getRoles(), user.roles) && !this.isAdminEditingTeacher()) ? 'visible' : 'hidden';
  }


}





