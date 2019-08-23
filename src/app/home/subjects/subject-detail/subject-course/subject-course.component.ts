import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatDialogRef, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { Course } from '../../../../models/course';
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

  @Input() areaRole: string;
  teacher: User;
  roleManager = ROLE_MANAGER;
  roleTeacher = ROLE_TEACHER;
  roleStudent = ROLE_STUDENT;

  @ViewChild(CrudUserDialogComponent) crudUserDialog: CrudUserDialogComponent;

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

    this.dataSource = new MatTableDataSource<User[]>();

 /*   this.subjectId = this.route.snapshot.paramMap.get('id');
    this.subjectSubscription = this.subjectStoreService.loadOneSubject(this.subjectId)
      .subscribe(s => {
        if (s) {
          this.subject = s;
          this.teacher = this.subject.teacher;
          this.dataSource.data = this.subject.course.students;
        }
      }); */

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

  userCardCrud(dialogRef: MatDialogRef<CardUserDialogRefComponent>): void {
    dialogRef.afterClosed().subscribe(result => {
      let user = dialogRef.componentInstance.user;
      this.crudUserDialog.areaRole = this.areaRole;
      this.crudUserDialog.uriRole = user.roles.includes(this.roleManager) ? URI_MANAGERS : user.roles.includes(this.roleTeacher) ? URI_TEACHERS : URI_STUDENTS;
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



}
