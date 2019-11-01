import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatDialogRef, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { User } from '../../../../models/user';
import { shortNameSecondName } from '../../../../shared/functions/shortName';
import { CardUserDialogRefComponent } from '../../../users/card-user-dialog/card-user-dialog-ref/card-user-dialog-ref.component';
import { ROLE_MANAGER, ROLE_STUDENT, ROLE_TEACHER, URI_MANAGERS, URI_TEACHERS, URI_STUDENTS, RESULT_CANCELED, RESULT_DETAIL, RESULT_EDIT, RESULT_DELETE } from '../../../../app.config';
import { CrudUserDialogComponent } from '../../../users/crud-user-dialog/crud-user-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from '../../../../models/subject';
import { DomSanitizer } from '@angular/platform-browser';
import { SessionStorageService } from '../../../../services/session-storage.service';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { SubjectStoreService } from '../../../../services/subject-store.service';

@Component({
  selector: 'nx-subject-course',
  templateUrl: './subject-course.component.html',
  styleUrls: ['./subject-course.component.css']
})
export class SubjectCourseComponent implements OnInit, OnDestroy, AfterViewInit {

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
      (user.firstName.toLowerCase() + ' ' + user.lastName.toLowerCase()).indexOf(filterValue) === 0 ||
      user.firstName.toLowerCase().indexOf(filterValue) === 0 || user.lastName.toLowerCase().indexOf(filterValue) === 0
      || shortNameSecondName(user).toLowerCase().indexOf(filterValue) === 0;

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.isLoadingSubscription = this.subjectStoreService.isLoadingGetSubjects$.subscribe(isLoadding => setTimeout(() => this.isLoading = isLoadding));

    this.isThemeDarkSubscription = this.sessionStorage.isThemeDark$.subscribe(isDark => this.isDark = isDark);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
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
