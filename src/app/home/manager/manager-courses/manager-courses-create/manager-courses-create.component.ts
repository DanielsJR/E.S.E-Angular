import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CourseStoreService } from '../../../../services/course-store.service';
import { SessionStorageService } from '../../../../services/session-storage.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Course } from '../../../../models/course';
import { User } from '../../../../models/user';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { COURSE_NAMES_GROUPS } from '../../../../models/course-names';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RESULT_ERROR, RESULT_CANCELED, RESULT_DETAIL, URI_MANAGERS, URI_TEACHERS, URI_STUDENTS, RESULT_EDIT, RESULT_DELETE, ROLE_MANAGER, ROLE_STUDENT, ROLE_TEACHER, RESULT_ACTION1, RESULT_ACTION2, RESULT_ACTION3, RESULT_SUCCEED, COURSE_CREATE_SUCCEED, COURSE_CREATE_ERROR } from '../../../../app.config';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/internal/Subscription';
import { CardUserDialogRefComponent } from '../../../users/card-user-dialog/card-user-dialog-ref/card-user-dialog-ref.component';
import { CrudUserDialogComponent } from '../../../users/crud-user-dialog/crud-user-dialog.component';
import { SimpleDialogRefComponent } from '../../../../shared/dialogs/simple-dialog/simple-dialog-ref/simple-dialog-ref.component';
import { rowAnimation } from '../../../../shared/animations/animations';

@Component({
  templateUrl: './manager-courses-create.component.html',
  styleUrls: ['./manager-courses-create.component.css'],
  animations: [rowAnimation]
})
export class ManagerCoursesCreateComponent implements OnInit, AfterViewInit, OnDestroy {

  areaRole = ROLE_MANAGER;
  uriStudents = URI_STUDENTS
  uriTeachers = URI_TEACHERS;

  @ViewChild('crudTeacherDialog') crudTeacherDialog: CrudUserDialogComponent;
  @ViewChild('crudStudentDialog') crudStudentDialog: CrudUserDialogComponent;
  crudUserOnlyRead: boolean = true;


  course: Course;
  coursesNamesGroups = COURSE_NAMES_GROUPS;

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

  constructor(private route: ActivatedRoute, private router: Router, private courseStoreService: CourseStoreService,
    private sessionStorage: SessionStorageService, private formBuilder: FormBuilder,
    private snackbarService: SnackbarService, public dialog: MatDialog) { }

  ngOnInit() {
    this.buildForm();
    this.course = new Course();
    this.dataSource = new MatTableDataSource();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.subscriptions.add(this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  buildForm() {
    this.createForm = this.formBuilder.group({
      name: [null, Validators.required],
      year: [null, Validators.required]
    });
  }

  get name() { return this.createForm.get('name'); }
  get year() { return this.createForm.get('year'); }

  gotoCourses() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  addStudent(student: User) {
    this.listStudents.push(student);
    this.dataSource.data = this.listStudents;
  }

  addTeacher(teacher: User) {
    this.chiefTeacher = teacher;
  }

  private setCourse() {
    this.course.name = this.createForm.value.name;
    this.course.year = this.createForm.value.year;
    this.course.students = this.listStudents;
    this.course.chiefTeacher = (this.chiefTeacher) ? this.chiefTeacher : null;
  }

  createCourse() {
    this.setCourse();
    this.subscriptions.add(this.courseStoreService.create(this.course)
      .subscribe(_ => {
        this.snackbarService.openSnackBar(COURSE_CREATE_SUCCEED, RESULT_SUCCEED);
        this.gotoCourses();
      }, error => {
        if (error instanceof HttpErrorResponse) {
          this.snackbarService.openSnackBar(error.error.message, RESULT_ERROR);
        } else {
          this.snackbarService.openSnackBar(COURSE_CREATE_ERROR, RESULT_ERROR);
        }
      }));

  }

  openUserCardCrud(dialogRef: MatDialogRef<CardUserDialogRefComponent>): void {
    let user = dialogRef.componentInstance.user;
    this.subscriptions.add(dialogRef.afterClosed().subscribe(result => {
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
    }));
  }

  private deleteStudentFromDataSource(id: string) {
    this.listStudents = this.listStudents.filter(s => s.id !== (id));
    this.dataSource.data = this.listStudents;
    // this.btnDisabled = false;
  }

  deleteStudent(dialogRef: MatDialogRef<SimpleDialogRefComponent>): void {
    this.subscriptions.add(dialogRef.afterClosed().subscribe(result => {
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
    }));
  }


}
