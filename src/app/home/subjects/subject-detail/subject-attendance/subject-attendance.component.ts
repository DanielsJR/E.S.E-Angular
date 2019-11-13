import { Component, OnInit, Input, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Subject } from '../../../../models/subject';
import { User } from '../../../../models/user';
import { ROLE_MANAGER, ROLE_TEACHER, ROLE_STUDENT, URI_STUDENTS, URI_TEACHERS, RESULT_CANCELED, RESULT_DETAIL, RESULT_EDIT, RESULT_DELETE, RESULT_SUCCEED, RESULT_ERROR, QUIZ_CREATE_ERROR, ATTENDANCE_CREATE_ERROR, ATTENDANCE_CREATE_SUCCEED, DD_MM_YYYY, BTN_ACTION_CREATE, BTN_ACTION_UPDATE, ATTENDANCE_UPDATE_SUCCEED, ATTENDANCE_UPDATE_ERROR, ATTENDANCE_DELETE_SUCCEED, ATTENDANCE_DELETE_ERROR, RESULT_ACTION1, RESULT_ACTION2, RESULT_ACTION3 } from '../../../../app.config';
import { CrudUserDialogComponent } from '../../../users/crud-user-dialog/crud-user-dialog.component';
import { MatSort, MatPaginator, MatDialog, MatTableDataSource, MatDialogRef } from '@angular/material';
import { Subscription, EMPTY, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { SubjectStoreService } from '../../../../services/subject-store.service';
import { SessionStorageService } from '../../../../services/session-storage.service';
import { switchMap, finalize, tap } from 'rxjs/operators';
import { shortNameSecondName } from '../../../../shared/functions/shortName';
import { CardUserDialogRefComponent } from '../../../users/card-user-dialog/card-user-dialog-ref/card-user-dialog-ref.component';
import { SelectionModel } from '@angular/cdk/collections';
import { Attendance, StudentAtendance } from '../../../../models/attendance';
import { AttendanceStoreService } from '../../../../services/attendance-store.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IsLoadingService } from '../../../../services/isLoadingService.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import * as moment from 'moment';
import { SimpleDialogRefComponent } from '../../../../shared/dialogs/simple-dialog/simple-dialog-ref/simple-dialog-ref.component';

@Component({
  selector: 'nx-subject-attendance',
  templateUrl: './subject-attendance.component.html',
  styleUrls: ['./subject-attendance.component.css']
})
export class SubjectAttendanceComponent implements OnInit, OnDestroy, AfterViewInit {

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
  displayedColumns = ['select', 'firstName', 'crud'];
  dataSource;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSize = 40;
  pageSizeOptions = [10, 20, 40];
  isDark: boolean;
  rowClasses: {};
  isLoading: boolean = false;
  btnDisabled = true;

  isThemeDarkSubscription: Subscription;
  subjectSubscription: Subscription;
  isLoadingSubscription: Subscription;

  selection = new SelectionModel<User>(true, []);

  date;
  isCreating: boolean;
  btnAction: string;
  attendance: Attendance;

  constructor(private route: ActivatedRoute, public sanitizer: DomSanitizer,
    private subjectStoreService: SubjectStoreService, private attendanceStoreService: AttendanceStoreService,
    private isLoadingService: IsLoadingService, private snackbarService: SnackbarService,
    public dialog: MatDialog, private sessionStorage: SessionStorageService) {

    this.date = moment(new Date(), DD_MM_YYYY); //;
  }

  ngOnInit() {
    //this.crudUserOnlyRead = (this.areaRole === this.roleManager) ? false : true;
    this.attendanceStoreService.attendances$.subscribe();
    this.dataSource = new MatTableDataSource<User[]>();

    this.subjectSubscription = this.route.paramMap
      .pipe(
        switchMap(params => {
          this.subjectId = params.get('id');
          return this.subjectStoreService.loadOneSubject(this.subjectId);
        }),

        switchMap(s => {
          if (s) {
            this.subject = s;
            this.teacher = this.subject.teacher;
            this.dataSource.data = this.subject.course.students;

            return this.attendanceStoreService.loadOneAttendanceByDate(moment(new Date()).format(DD_MM_YYYY));

          } else {
            return EMPTY;
          }
        }
        ))
      .subscribe(a => {
        console.log('subscribe');
        this.setStudentsList(a);
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

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  loadAttendanceByDate(date): void {
    let fDate = moment(date).format(DD_MM_YYYY);
    console.log('date ', fDate);
    this.attendanceStoreService.loadOneAttendanceByDate(fDate)
      .subscribe(a => {
        console.log('this.setStudentsList(a)');
        this.setStudentsList(a);
      });
  }

  setStudentsList(attendance: Attendance) {
    if (attendance) {
      this.dataSource.data.forEach((row: User) => {
        //if (attendance.students.findIndex(sa => sa.id === row.id && sa.didAttend) != -1)
        console.log('this.selection.select(row) : this.selection.deselect(row)');
        if (attendance.students) {
          (attendance.students.findIndex(s => s.id === row.id) != -1) ? this.selection.select(row) : this.selection.deselect(row);
        } else {
          this.selection.deselect(row);
        }
      });
      this.isCreating = false;
      this.btnAction = BTN_ACTION_UPDATE;
      this.attendance = Object.assign({}, attendance);
    } else {
      this.selection.clear();
      console.log('this.selection.clear()');
      this.isCreating = true;
      this.btnAction = BTN_ACTION_CREATE;
      this.attendance = null;
    }

    this.dataSource.data = this.subject.course.students;

  }

  saveAttendance() {
    let attendance: Attendance = new Attendance();
    /* attendance.students = [];
   
     this.dataSource.data.forEach(row => {
       let studentAtendance: StudentAtendance = new StudentAtendance(row.id, this.selection.isSelected(row));
       attendance.students.push(studentAtendance);
     }
   
     ); */
    attendance.id = (!this.isCreating) ? this.attendance.id : null;
    attendance.students = this.selection.selected; //(!this.selection.isEmpty()) ? this.selection.selected : [];
    attendance.subjectId = this.subjectId;
    attendance.date = moment(this.date).format(DD_MM_YYYY);

    let messageSucced = this.isCreating ? ATTENDANCE_CREATE_SUCCEED : ATTENDANCE_UPDATE_SUCCEED;
    let messageError = this.isCreating ? ATTENDANCE_CREATE_ERROR : ATTENDANCE_UPDATE_ERROR;

    let obs: Observable<Attendance> = (this.isCreating) ? this.attendanceStoreService.create(attendance) : this.attendanceStoreService.update(attendance);
    obs
      .pipe(finalize(() => this.isLoadingService.isLoadingFalse()))
      .subscribe(_ => {
        this.snackbarService.openSnackBar(messageSucced, RESULT_SUCCEED);
        this.btnAction = BTN_ACTION_UPDATE;
      }, error => {
        if (error instanceof HttpErrorResponse) {
          this.snackbarService.openSnackBar(error.error.message, RESULT_ERROR);
        } else {
          this.snackbarService.openSnackBar(messageError, RESULT_ERROR);
        }
      });

  }

  deleteAttendance() {
    this.attendanceStoreService.delete(this.attendance)
      .pipe(finalize(() => this.isLoadingService.isLoadingFalse()))
      .subscribe(_ => {
        this.snackbarService.openSnackBar(ATTENDANCE_DELETE_SUCCEED, RESULT_SUCCEED);
        this.btnAction = BTN_ACTION_CREATE;
      }, error => {
        if (error instanceof HttpErrorResponse) {
          this.snackbarService.openSnackBar(error.error.message, RESULT_ERROR);
        } else {
          this.snackbarService.openSnackBar(ATTENDANCE_DELETE_ERROR, RESULT_ERROR);
        }
      });


  }

  deleteAttendanceDialog(dialogRef: MatDialogRef<SimpleDialogRefComponent>): void {
    dialogRef.afterClosed().subscribe(result => {
      if (result === RESULT_CANCELED) {
        console.log(RESULT_CANCELED);
      } else if (result === RESULT_ACTION1) {
        console.log(RESULT_ACTION1);
        this.deleteAttendance();
      } else {
        console.log('no result');
      }
    });
  }

  updateAttendanceDialog(dialogRef: MatDialogRef<SimpleDialogRefComponent>): void {
    dialogRef.afterClosed().subscribe(result => {
      if (result === RESULT_CANCELED) {
        console.log(RESULT_CANCELED);
      } else if (result === RESULT_ACTION1) {
        console.log(RESULT_ACTION1);
        this.saveAttendance();
      } else {
        console.log('no result');
      }
    });
  }

}