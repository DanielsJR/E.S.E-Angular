import { Component, OnInit, Input, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Subject } from '../../../../models/subject';
import { User } from '../../../../models/user';
import { ROLE_MANAGER, ROLE_TEACHER, ROLE_STUDENT, URI_STUDENTS, URI_TEACHERS, RESULT_CANCELED, RESULT_DETAIL, RESULT_EDIT, RESULT_DELETE } from '../../../../app.config';
import { CrudUserDialogComponent } from '../../../users/crud-user-dialog/crud-user-dialog.component';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { SubjectStoreService } from '../../../../services/subject-store.service';
import { SessionStorageService } from '../../../../services/session-storage.service';
import { switchMap } from 'rxjs/operators';
import { shortNameSecondName } from '../../../../shared/functions/shortName';
import { CardUserDialogRefComponent } from '../../../users/card-user-dialog/card-user-dialog-ref/card-user-dialog-ref.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { rowAnimation } from '../../../../shared/animations/animations';

@Component({
  selector: 'nx-subject-book',
  templateUrl: './subject-book.component.html',
  styleUrls: ['./subject-book.component.css'],
  animations: [rowAnimation]
})
export class SubjectBookComponent implements OnInit, OnDestroy, AfterViewInit {

  subjectId: string;
  subject: Subject;
  teacher: User;

  @Input() areaRole: string;
  roleManager = ROLE_MANAGER;
  roleTeacher = ROLE_TEACHER;
  roleStudent = ROLE_STUDENT;

  uriStudents = URI_STUDENTS
  uriTeachers = URI_TEACHERS;
  @ViewChild('crudTeacherDialog') crudTeacherDialog: CrudUserDialogComponent;
  @ViewChild('crudStudentDialog') crudStudentDialog: CrudUserDialogComponent;

  crudUserOnlyRead: boolean = true;

  // mat table
  displayedColumns = ['firstName', 'crud'];
  dataSource;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSize = 5;
  pageSizeOptions = [5, 10, 20];
  isDark: boolean;
  rowClasses: {};
  isLoading: boolean = false;
  btnDisabled = true;

  isThemeDarkSubscription: Subscription;
  subjectSubscription: Subscription;
  isLoadingSubscription: Subscription;

  constructor(private route: ActivatedRoute, public sanitizer: DomSanitizer,
    private subjectStoreService: SubjectStoreService,
    public dialog: MatDialog, private sessionStorage: SessionStorageService) {

  }

  ngOnInit() {
    //this.crudUserOnlyRead = (this.areaRole === this.roleManager) ? false : true;
    this.dataSource = new MatTableDataSource<User[]>();

    this.subjectSubscription = this.route.paramMap
      .pipe(
        switchMap(params => {
          this.subjectId = params.get('id');
          return this.subjectStoreService.loadOneSubject(this.subjectId);
        })
      )
      .subscribe(s => {
        if (s) {
          this.subject = s;
          this.teacher = this.subject.teacher;
          this.dataSource.data = this.subject.course.students;
        }
      });

    this.dataSource.filterPredicate = (user: User, filterValue: string) =>
      (user.firstName.toLowerCase() + ' ' + user.lastName.toLowerCase()).indexOf(filterValue) === 0
      || user.firstName.toLowerCase().indexOf(filterValue) === 0 || user.lastName.toLowerCase().indexOf(filterValue) === 0
      || shortNameSecondName(user).toLowerCase().indexOf(filterValue) === 0;

    this.isLoadingSubscription = this.subjectStoreService.isLoadingGetSubjects$.subscribe(isLoadding => setTimeout(() => this.isLoading = isLoadding));

    this.isThemeDarkSubscription = this.sessionStorage.isThemeDark$.subscribe(isDark => this.isDark = isDark);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  }

  ngOnDestroy(): void {
    this.isThemeDarkSubscription.unsubscribe();
    this.subjectSubscription.unsubscribe();
    this.isLoadingSubscription.unsubscribe();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  openUserCardCrud(dialogRef: MatDialogRef<CardUserDialogRefComponent>): void {
    let user = dialogRef.componentInstance.user;
    dialogRef.afterClosed().subscribe(result => {
      if (result === RESULT_CANCELED) {
        console.log(RESULT_CANCELED);
      } else if (result === RESULT_DETAIL) {
        if (user.roles.includes(ROLE_STUDENT)) {
          this.crudStudentDialog.openDialogDetail(user);
        } else {
          this.crudTeacherDialog.openDialogDetail();
        }
      } else if (result === RESULT_EDIT) {
        if (user.roles.includes(ROLE_STUDENT)) {
          this.crudStudentDialog.openDialogEdit(user);
        } else {
          this.crudTeacherDialog.openDialogEdit();
        }
      } else if (result === RESULT_DELETE) {
        if (user.roles.includes(ROLE_STUDENT)) {
          this.crudStudentDialog.openDialogDelete(user);
        } else {
          this.crudTeacherDialog.openDialogDelete();
        }
      }
    });
  }



}
