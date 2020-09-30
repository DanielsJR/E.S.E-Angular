import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CourseStoreService } from '../../../../services/course-store.service';
import { SessionStorageService } from '../../../../services/session-storage.service';
import { SnackbarService } from '../../../../shared/snackbars-ref/snackbar.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Course } from '../../../../models/course';
import { User } from '../../../../models/user';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { COURSE_LETTERS, COURSE_NUMBERS } from '../../../../models/course-names';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RESULT_ERROR, RESULT_CANCELED, RESULT_DETAIL, URI_MANAGER, URI_TEACHER, URI_STUDENT, RESULT_EDIT, RESULT_DELETE, ROLE_MANAGER, ROLE_STUDENT, ROLE_TEACHER, RESULT_ACTION1, RESULT_ACTION2, RESULT_ACTION3, RESULT_SUCCEED, COURSE_CREATE_SUCCEED, COURSE_CREATE_ERROR } from '../../../../app.config';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/internal/Subscription';
import { CardUserDialogRefComponent } from '../../../users/card-user-dialog/card-user-dialog-ref/card-user-dialog-ref.component';
import { CrudUserDialogComponent } from '../../../users/crud-user-dialog/crud-user-dialog.component';
import { SimpleDialogRefComponent } from '../../../../shared/dialogs/simple-dialog/simple-dialog-ref/simple-dialog-ref.component';
import { rowAnimation } from '../../../../shared/animations/animations';
import { SimpleDialogComponent } from '../../../../shared/dialogs/simple-dialog/simple-dialog.component';
import { MultiDatePickerService } from '../../../../shared/multi-date-picker/multy-date-picker.service';

@Component({
  templateUrl: './manager-courses-create.component.html',
  styleUrls: ['./manager-courses-create.component.css'],
  animations: [rowAnimation]
})
export class ManagerCoursesCreateComponent implements OnInit, AfterViewInit, OnDestroy {

  areaRole = ROLE_MANAGER;
  uriStudents = URI_STUDENT
  uriTeachers = URI_TEACHER;

  @ViewChild('crudTeacherDialog') crudTeacherDialog: CrudUserDialogComponent;
  @ViewChild('crudStudentDialog') crudStudentDialog: CrudUserDialogComponent;
  crudUserOnlyRead: boolean = true;


  course: Course;
  courseNumbers = COURSE_NUMBERS;
  courseLetters = COURSE_LETTERS;

  createForm: FormGroup;

  // mat table
  displayedColumns = ['student', 'crud'];
  dataSource;
  chiefTeacher: User;
  listStudents: User[] = [];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSize = 5;
  pageSizeOptions = [5, 10, 20];
  rowClasses: {};
  isLoading: boolean = false;

  private subscriptions = new Subscription();

  @ViewChild('duplicatedDialog') duplicatedDialog: SimpleDialogComponent;

  constructor(private route: ActivatedRoute, private router: Router, private courseStoreService: CourseStoreService,
    private multiDatePickerService: MultiDatePickerService, private formBuilder: FormBuilder,
    private snackbarService: SnackbarService, public dialog: MatDialog, private cdRef: ChangeDetectorRef,
  ) {

  }

  ngOnInit() {
    this.course = new Course();
    this.dataSource = new MatTableDataSource();
    this.buildForm();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.subscriptions.add(this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0));
    this.subscriptions.add(this.multiDatePickerService.date$.subscribe(date => this.year.setValue(date)));

    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  buildForm() {
    this.createForm = this.formBuilder.group({
      num: [null, Validators.required],
      letter: [null, Validators.required],
      year: [null, Validators.required],
      teacher: [null, Validators.required]
    });

  }

  get num() { return this.createForm.get('num'); }
  get letter() { return this.createForm.get('letter'); }
  get year() { return this.createForm.get('year'); }
  get teacher() { return this.createForm.get('teacher'); }

  gotoCourses() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onDateChange(date: Date) {
    this.year.setValue(date.getFullYear().toString());
  }

  addStudent(student: User) {
    let index = this.listStudents.findIndex(s => s.id === student.id);
    if (index == -1) {
      this.listStudents.push(student);
      this.dataSource.data = this.listStudents;
    } else {
      this.duplicatedDialog.openSimpleDialog(student, student.avatar);
    }
  }

  addTeacher(teacher: User) {
    this.chiefTeacher = teacher;
    this.teacher.setValue(teacher);
  }

  private setCourse() {
    this.course.name = `${this.num.value}-${this.letter.value}`;
    this.course.year = this.year.value.getFullYear().toString();
    this.course.students = this.listStudents;
    this.course.chiefTeacher = (this.chiefTeacher) ? this.chiefTeacher : null;
  }

  createCourse() {
    this.setCourse();
    this.subscriptions.add(this.courseStoreService.create(this.course)
      .subscribe(_ => {
        this.snackbarService.openSnackBar(COURSE_CREATE_SUCCEED, RESULT_SUCCEED);
        this.gotoCourses();
      }, err => this.snackbarService.openSnackBar((err?.error?.errors) ? err.error.errors : COURSE_CREATE_ERROR, RESULT_ERROR)
      ));

  }

  openUserCardCrud(dialogRef: MatDialogRef<CardUserDialogRefComponent>): void {
    let user = dialogRef.componentInstance.user;
    dialogRef.afterClosed().subscribe(result => {
      if (result === RESULT_CANCELED) {
        console.log(result);

      } else if (result === RESULT_DETAIL) {
        (user.roles.includes(ROLE_STUDENT)) ? this.crudStudentDialog.openDialogDetail(user) : this.crudTeacherDialog.openDialogDetail();

      } else if (result === RESULT_EDIT) {
        (user.roles.includes(ROLE_STUDENT)) ? this.crudStudentDialog.openDialogEdit(user) : this.crudTeacherDialog.openDialogEdit();

      } else if (result === RESULT_DELETE) {
        (user.roles.includes(ROLE_STUDENT)) ? this.crudStudentDialog.openDialogDelete(user) : this.crudTeacherDialog.openDialogDelete();

      }
    });
  }

  private deleteStudentFromDataSource(id: string) {
    this.listStudents = this.listStudents.filter(s => s.id !== (id));
    this.dataSource.data = this.listStudents;
  }

  deleteStudent(dialogRef: MatDialogRef<SimpleDialogRefComponent>): void {
    dialogRef.afterClosed().subscribe(result => {
      if (result === RESULT_CANCELED) {
        console.log(RESULT_CANCELED);

      } else if (result === RESULT_ACTION1) {
        console.log(RESULT_ACTION1);
        this.deleteStudentFromDataSource(dialogRef.componentInstance.obj.id);

      } else if (result === RESULT_ACTION2) {
        console.log(RESULT_ACTION2);

      } else if (result === RESULT_ACTION3) {
        console.log(RESULT_ACTION3);
      }
    });
  }


}
