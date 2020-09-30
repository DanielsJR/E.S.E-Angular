import { Component, OnInit, ViewChild, AfterViewInit, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { SubjectsCrudDialogRefComponent } from './subjects-crud-dialog-ref/subjects-crud-dialog-ref.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from '../../models/subject';
import { ROLE_MANAGER, ROLE_TEACHER, RESULT_CANCELED, RESULT_ERROR, CRUD_TYPE_CREATE, RESULT_SUCCEED, SUBJECT_CREATE_ERROR, SUBJECT_CREATE_SUCCEED, CRUD_TYPE_EDIT, SUBJECT_UPDATE_ERROR, SUBJECT_UPDATE_SUCCEED, SUBJECT_DELETE_SUCCEED, SUBJECT_DELETE_ERROR, CANCEL_MESSAGE, RESULT_WARN, CRUD_TYPE_DELETE, ROLE_STUDENT } from '../../app.config';
import { User } from '../../models/user';
import { SessionStorageService } from '../../services/session-storage.service';
import { SubjectStoreService } from '../../services/subject-store.service';
import { UserLoggedService } from '../../services/user-logged.service';
import { SnackbarService } from '../../shared/snackbars-ref/snackbar.service';
import { Course } from '../../models/course';
import { CourseStoreService } from '../../services/course-store.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { rowAnimation } from '../../shared/animations/animations';
import { Subscription } from 'rxjs/internal/Subscription';
import { SimpleDialogComponent } from '../../shared/dialogs/simple-dialog/simple-dialog.component';
import { MultiDatePickerService } from '../../shared/multi-date-picker/multy-date-picker.service';
import { skip } from 'rxjs/internal/operators/skip';
import { skipWhile } from 'rxjs/internal/operators/skipWhile';


@Component({
  selector: 'nx-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css'],
  animations: [rowAnimation]
})
export class SubjectsComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() areaRole: string;
  roleManager = ROLE_MANAGER;
  roleTeacher = ROLE_TEACHER;
  roleStudent = ROLE_STUDENT;

  user: User;
  courseName: string;
  course: Course;
  courses: Course[] = [];
  subjects: Subject[];

  // mat table
  displayedColumns = ['name', 'crud'];
  pageSize = 5;
  pageSizeOptions = [5, 10, 20];
  rowClasses: {};
  isLoadingGet: boolean = false;

  isBtnAddDisabled: boolean = true;
  isSelectCourseDisabled: boolean = true;
  isSearchDisabled: boolean = true;

  dataSource = new MatTableDataSource<Subject>();
  @ViewChild('select') select: MatSelect;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  currentUrl: string;
  userLogged: User;
  subjectId: any;

  courseYear: Date;

  private subscriptions = new Subscription();
  @ViewChild('emptyCoursesDialog') emptyCoursesDialog: SimpleDialogComponent;

  constructor(
    private subjectStoreService: SubjectStoreService, private courseStoreService: CourseStoreService,
    private userLoggedService: UserLoggedService, private router: Router,
    public dialog: MatDialog, private snackbarService: SnackbarService,
    private cdRef: ChangeDetectorRef, private multiDatePickerService: MultiDatePickerService

  ) {
    this.subscriptions.add(this.multiDatePickerService.date$.subscribe(date => this.courseYear = date));
  }

  ngOnInit() {
    this.subscriptions.add(this.subjectStoreService.isLoadingGetSubjects$.subscribe(value => this.isLoadingGet = value));
    this.currentUrl = this.router.url;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.subscriptions.add(this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0));
    this.setDataSource(this.select);

    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  setDataSourceManager(matSelect: MatSelect) {
    this.subscriptions.add(this.userLoggedService.userLogged$
      .pipe(
        switchMap(user => {
          this.user = user;
          return this.courseStoreService.courses$
        }),
        switchMap(courses => {
          this.courses = courses;
          return this.subjectStoreService.subjects$
        }),
        switchMap(subjects => {
          //console.log('+++++++subjects+++++++++ ', subjects)
          if (subjects != null && this.courses != null) {//first emission from BehaviorSubject is null  
            this.subjects = subjects;

            if (this.areaRole === this.roleTeacher && this.userLoggedService.isManager) {
              let teacherSubjects = this.subjects.filter(s => s.teacher.id.indexOf(this.user.id) === 0);
              this.courses = teacherSubjects.map(s => s.course).filter((c, i, cs) => cs.findIndex(v => v.id === c.id) === i);

              if ((!this.courses.length) && (!this.emptyCoursesDialog.isOpen())) this.emptyCoursesDialog.openSimpleDialog();

            } else {
              if ((!this.subjects.length) && (!this.emptyCoursesDialog.isOpen())) this.emptyCoursesDialog.openSimpleDialog();
            }

            if (!this.courses.length) {
              this.isSelectCourseDisabled = true;
              this.isBtnAddDisabled = true;
            } else {
              this.isSelectCourseDisabled = false;
            }

            if (this.isLoadingGet) {
              this.select.value = null;
              this.isSearchDisabled = true;
              this.isBtnAddDisabled = true;
            }

            this.dataSource.data = this.subjects.filter(sj => sj.course.name.indexOf(matSelect?.value) === 0);
            this.isSearchDisabled = (!this.dataSource.data.length) ? true : false;
          }

          return matSelect.valueChange;
        }))
      .subscribe((value: string) => {
        this.courseName = value;
        this.course = this.courses.find(c => c.name.indexOf(this.courseName) === 0);
        this.isBtnAddDisabled = false;

        if (this.areaRole === this.roleTeacher && this.userLoggedService.isManager)
          this.dataSource.data = this.subjects.filter(sj => sj.teacher.username.indexOf(this.user.username) === 0 && sj.course.name.indexOf(this.courseName) === 0);
        else
          this.dataSource.data = this.subjects.filter(sj => sj.course.name.indexOf(this.courseName) === 0);
        this.isSearchDisabled = (!this.dataSource.data.length) ? true : false;
      }));
  }

  setDataSourceTeacher(matSelect: MatSelect) {
    this.subscriptions.add(this.subjectStoreService.subjects$
      .pipe(
        switchMap(subjects => {
          if (subjects != null) {//first emission from BehaviorSubject is null
            this.subjects = subjects;
            this.courses = subjects.map(s => s.course).filter((c, i, cs) => cs.findIndex(v => v.id === c.id) === i);

            if (!this.courses.length) {
              this.isSelectCourseDisabled = true;
              this.isBtnAddDisabled = true;
            } else {
              this.isSelectCourseDisabled = false;
            }

            if (this.isLoadingGet) {
              this.select.value = null;
              this.isSearchDisabled = true;
              this.isBtnAddDisabled = true;
            }

            if ((!subjects.length) && (!this.emptyCoursesDialog.isOpen())) this.emptyCoursesDialog.openSimpleDialog();

            this.dataSource.data = this.subjects.filter(sj => sj.course.name.indexOf(matSelect?.value) === 0);
            this.isSearchDisabled = (!this.dataSource.data.length) ? true : false;
          }

          return matSelect.valueChange;
        }))
      .subscribe((value: string) => {
        this.courseName = value;
        this.course = this.courses.find(c => c.name.indexOf(this.courseName) === 0);

        this.dataSource.data = this.subjects.filter(sj => sj.course.name.indexOf(this.courseName) === 0);
        this.isSearchDisabled = (!this.dataSource.data.length) ? true : false;
      }));
  }

  setDataSource(matSelect: MatSelect) {
    if ((this.areaRole === this.roleManager) || (this.roleTeacher && this.userLoggedService.isManager())) this.setDataSourceManager(matSelect);
    else if (this.areaRole === this.roleTeacher) this.setDataSourceTeacher(matSelect)
    else console.error('No areaRole!!');
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  openDialogCreate(): void {
    let subject: Subject = new Subject();
    subject.course = this.course;
    let data = {
      subject: subject,
      type: CRUD_TYPE_CREATE,
    };

    let config = new MatDialogConfig();
    config.data = data;
    config.panelClass = 'dialogService';
    config.width = '700px';
    config.disableClose = true;

    let dialogRef = this.dialog.open(SubjectsCrudDialogRefComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      if (result === RESULT_CANCELED) {
        this.snackbarService.openSnackBar(CANCEL_MESSAGE, RESULT_WARN);
        console.log(RESULT_CANCELED);

      } else if (result === RESULT_ERROR) {
        this.snackbarService.openSnackBar(SUBJECT_CREATE_ERROR, RESULT_ERROR);
        console.error(RESULT_ERROR);

      } else if (result === RESULT_SUCCEED) {
        this.snackbarService.openSnackBar(SUBJECT_CREATE_SUCCEED, RESULT_SUCCEED);
        console.log(RESULT_SUCCEED);
      }
    });
  }

  openDialogEdit(subject: Subject): void {
    let data = {
      subject: subject,
      type: CRUD_TYPE_EDIT,
    };

    let config = new MatDialogConfig();
    config.data = data;
    config.panelClass = 'dialogService';
    config.width = '700px';
    config.disableClose = true;

    let dialogRef = this.dialog.open(SubjectsCrudDialogRefComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      if (result === RESULT_CANCELED) {
        this.snackbarService.openSnackBar(CANCEL_MESSAGE, RESULT_WARN);
        console.log(RESULT_CANCELED);

      } else if (result === RESULT_ERROR) {
        this.snackbarService.openSnackBar(SUBJECT_UPDATE_ERROR, RESULT_ERROR);
        console.error(RESULT_ERROR);

      } else if (result === RESULT_SUCCEED) {
        this.snackbarService.openSnackBar(SUBJECT_UPDATE_SUCCEED, RESULT_SUCCEED);
        console.log(RESULT_SUCCEED);
      }
    });
  }

  openDialogDelete(subject: Subject): void {
    let data = {
      subject: subject,
      type: CRUD_TYPE_DELETE,

    };

    let config = new MatDialogConfig();
    config.data = data;
    config.panelClass = 'dialogService';
    config.width = '500px';
    config.disableClose = true;

    let dialogRef = this.dialog.open(SubjectsCrudDialogRefComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      if (result === RESULT_CANCELED) {
        this.snackbarService.openSnackBar(CANCEL_MESSAGE, RESULT_WARN);
        console.log(RESULT_CANCELED);

      } else if (result === RESULT_ERROR) {
        this.snackbarService.openSnackBar(SUBJECT_DELETE_ERROR, RESULT_ERROR);
        console.error(RESULT_ERROR);

      } else if (result === RESULT_SUCCEED) {
        this.snackbarService.openSnackBar(SUBJECT_DELETE_SUCCEED, RESULT_SUCCEED);
        console.log(RESULT_SUCCEED);
      }
    });
  }


}


