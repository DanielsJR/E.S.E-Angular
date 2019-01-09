import { Component, OnInit, AfterViewInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { MatSort, MatPaginator, MatDialog, MatTableDataSource, MatDialogConfig, MatDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Subject } from '../../../models/subject';
import { Course } from '../../../models/course';
import { User } from '../../../models/user';
import { ROLE_TEACHER, RESULT_CANCELED, RESULT_ERROR, RESULT_SUCCESS, URI_MANAGERS, URI_TEACHERS, URI_STUDENTS, RESULT_DETAIL, RESULT_EDIT, RESULT_DELETE, ROLE_MANAGER, ROLE_STUDENT } from '../../../app.config';
import { SubjectStoreService } from '../../../services/subject-store.service';
import { SessionStorageService } from '../../../services/session-storage.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { shortNameSecondName } from '../../../shared/functions/shortName';
import { Grade } from '../../../models/grade';
import { SubjectsGradesCrudDialogRefComponent } from '../subject-grades/subjects-grades-crud-dialog-ref/subjects-grades-crud-dialog-ref.component';
import { CardUserDialogRefComponent } from '../../users/card-user-dialog/card-user-dialog-ref/card-user-dialog-ref.component';
import { CrudUserDialogComponent } from '../../users/crud-user-dialog/crud-user-dialog.component';



@Component({
  selector: 'nx-subject-detail',
  templateUrl: './subject-detail.component.html',
  styleUrls: ['./subject-detail.component.css']
})
export class SubjectDetailComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() areaRole;
  subjectId: string;
  subject: Subject;
  course: Course;
  teacher: User;
  listStudents: User[] = [];

  roleManager = ROLE_MANAGER;
  roleStudent = ROLE_STUDENT;
  roleTeacher = ROLE_TEACHER;
  @ViewChild(CrudUserDialogComponent) crudUserDialog: CrudUserDialogComponent;

  btnDisabled = true;

  // mat table
  displayedColumns = ['firstName','crud'];
  dataSource;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSize = 5;
  pageSizeOptions = [5, 10, 20];
  isDark = this.sessionStorage.isDarkTheme();
  rowClasses: {};
  isLoading: boolean = false;

  isThemeDarkSubscription: Subscription;
  isLoadingGetSubjectsSubscription: Subscription;
  subjectsSubscription: Subscription;

  constructor(
    private route: ActivatedRoute, private router: Router, private subjectStoreService: SubjectStoreService,
    private sessionStorage: SessionStorageService, public sanitizer: DomSanitizer,
    private snackbarService: SnackbarService, public dialog: MatDialog
  ) { }

  ngOnInit() {

    if (this.areaRole === this.roleTeacher){

    }
      
    this.dataSource = new MatTableDataSource<Course>();
    this.dataSource.filterPredicate = (user: User, filterValue: string) =>
      (user.firstName.toLowerCase() + ' ' + user.lastName.toLowerCase()).indexOf(filterValue) === 0 ||
      user.firstName.toLowerCase().indexOf(filterValue) === 0 || user.lastName.toLowerCase().indexOf(filterValue) === 0
      || shortNameSecondName(user).toLowerCase().indexOf(filterValue) === 0;

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    // paramMap re-uses the component
    this.subjectsSubscription = this.route.paramMap
      .pipe(
        switchMap(params => {
          this.subjectId = params.get('id');
          return this.subjectStoreService.subjects$;
        })
      )
      .subscribe(subjects => {
        let s = subjects.find(s => s.id === this.subjectId)
        if (s) {
          this.subject = s;
          this.teacher = s.teacher;
          this.dataSource.data = s.course.students;
          this.listStudents = this.dataSource.data;
        }
      });

    this.isLoadingGetSubjectsSubscription = this.subjectStoreService.isLoadingGetSubjects$.subscribe(isLoadding => setTimeout(() => this.isLoading = isLoadding));

    this.isThemeDarkSubscription = this.sessionStorage.isThemeDark$.subscribe(isDark => {
      this.isDark = isDark;
      this.setRowClass();
    });

    this.setRowClass();

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.isThemeDarkSubscription.unsubscribe();
    this.isLoadingGetSubjectsSubscription.unsubscribe();
    this.subjectsSubscription.unsubscribe();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  setRowClass() {
    this.rowClasses = {
      'fila': !this.isDark,
      'fila-dark': this.isDark
    };
  }


  goBack() {
    this.router.navigate(['../../courses/',this.subject.course.name], { relativeTo: this.route });
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
