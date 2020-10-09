import { Component, OnInit, Input, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { URI_MANAGER, URI_TEACHER, URI_STUDENT, ROLE_MANAGER_SPANISH, ROLE_TEACHER_SPANISH, ROLE_STUDENT_SPANISH, RESULT_CANCELED, RESULT_EDIT, RESULT_DELETE, RESULT_DETAIL, ROLE_ADMIN } from '../../app.config';
import { User } from '../../models/user';
import { CardUserDialogRefComponent } from './card-user-dialog/card-user-dialog-ref/card-user-dialog-ref.component';
import { CrudUserDialogComponent } from './crud-user-dialog/crud-user-dialog.component';
import { SessionStorageService } from '../../services/session-storage.service';
import { UserStoreService } from '../../services/user-store.service';
import { DomSanitizer } from '@angular/platform-browser';
import { shortNameSecondName } from '../../shared/functions/shortName';
import { Subscription } from 'rxjs/internal/Subscription';
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
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource<User>();
  pageSize = 5;
  pageSizeOptions = [5, 10, 20];
  rowClasses: {};
  isLoading: boolean = false;

  // mat dialog
  user: User;
  @Input() uriUsersRole;
  @ViewChild('crudUserDialog') crudUserDialog: CrudUserDialogComponent;

  private subscriptions = new Subscription();

  constructor(private userStoreService: UserStoreService, private sessionStorage: SessionStorageService,
    public sanitizer: DomSanitizer, private userLoggedService: UserLoggedService,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    //console.log("AreaRole: " + this.areaRole + "  userLoggedRoles: " + this.userLoggedService.getRoles());

    this.dataSource.filterPredicate = (user: User, filterValue: string) =>
      (user.firstName.toLowerCase() + ' ' + user.lastName.toLowerCase()).indexOf(filterValue) === 0 ||
      user.firstName.toLowerCase().indexOf(filterValue) === 0 || user.lastName.toLowerCase().indexOf(filterValue) === 0
      || shortNameSecondName(user).toLowerCase().indexOf(filterValue) === 0;

    if (this.uriUsersRole === URI_MANAGER) {
      this.userRole = ROLE_MANAGER_SPANISH;
      this.usersRole = ROLE_MANAGER_SPANISH + 'res';

    } else if (this.uriUsersRole === URI_TEACHER) {
      this.userRole = ROLE_TEACHER_SPANISH;
      this.usersRole = ROLE_TEACHER_SPANISH + 's';

    } else if (this.uriUsersRole === URI_STUDENT) {
      this.userRole = ROLE_STUDENT_SPANISH;
      this.usersRole = ROLE_STUDENT_SPANISH + 's';

    } else {
      console.error('NO uriUsersRole');
    }

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.subscriptions.add(this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0));
    this.setDataSource();
    this.cdRef.detectChanges();
  }

  setDataSource() {
    if (this.uriUsersRole === URI_MANAGER) {
      this.subscriptions.add(this.userStoreService.isLoadingGetManagers$.subscribe(isLoadding => this.isLoading = isLoadding));
      this.subscriptions.add(this.userStoreService.managers$.subscribe(data => this.dataSource.data = data));

    } else if (this.uriUsersRole === URI_TEACHER) {
      this.subscriptions.add(this.userStoreService.isLoadingGetTeachers$.subscribe(isLoadding => this.isLoading = isLoadding));
      this.subscriptions.add(this.userStoreService.teachers$.subscribe(data => this.dataSource.data = data));

    } else if (this.uriUsersRole === URI_STUDENT) {
      this.subscriptions.add(this.userStoreService.isLoadingGetStudents$.subscribe(isLoadding => this.isLoading = isLoadding));
      this.subscriptions.add(this.userStoreService.students$.subscribe(data => this.dataSource.data = data));

    } else {
      console.error('NO uriUsersRole');
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  dialogCardUserSubs(dialogRef: MatDialogRef<CardUserDialogRefComponent>): void {
    let user = dialogRef.componentInstance.user;
    dialogRef.afterClosed().subscribe(result => {

      if (result === RESULT_CANCELED) console.log(RESULT_CANCELED);

      else if (result === RESULT_DETAIL) this.crudUserDialog.openDialogDetail(user);

      else if (result === RESULT_EDIT) this.crudUserDialog.openDialogEdit(user);

      else if (result === RESULT_DELETE) this.crudUserDialog.openDialogDelete(user);

      else {
        console.error('NO Result');
      }
    });
  }

  checkEqualOrGreaterPrivileges(userLoggedRoles: string[], userDbRoles: string[]): boolean {
    return userLoggedRoles.every(role => userDbRoles.includes(role));
  }

  isAdminEditingTeacher() {
    if (this.isAdmin() && this.uriUsersRole === URI_TEACHER) return true;
    return false;
  }

  isAdmin() {
    return this.userLoggedService.isAdmin();
  }

  crudVisibility(user: User) {
    return (!this.checkEqualOrGreaterPrivileges(this.userLoggedService.getRoles(), user.roles) && !this.isAdminEditingTeacher()) ? 'visible' : 'hidden';
  }

  reloadUsers() {
    if (this.uriUsersRole === URI_MANAGER) this.userStoreService.loadAllManagers();
    else if (this.uriUsersRole === URI_TEACHER) this.userStoreService.loadAllTeachers();
    else if (this.uriUsersRole === URI_STUDENT) this.userStoreService.loadAllStudents();
  }


}





