import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CourseStoreService } from '../../../../services/course-store.service';
import { SessionStorageService } from '../../../../services/session-storage.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Course } from '../../../../models/course';
import { User } from '../../../../models/user';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { COURSES_NAMES_GROUPS } from '../../../../models/courses-names';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RESULT_SUCCESS, RESULT_ERROR, RESULT_CANCELED, RESULT_DETAIL, URI_MANAGERS, URI_TEACHERS, URI_STUDENTS, RESULT_EDIT, RESULT_DELETE, ROLE_MANAGER, ROLE_STUDENT, ROLE_TEACHER, RESULT_ACTION1, RESULT_ACTION2, RESULT_ACTION3 } from '../../../../app.config';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/internal/Subscription';
import { CardUserDialogRefComponent } from '../../../users/card-user-dialog/card-user-dialog-ref/card-user-dialog-ref.component';
import { CrudUserDialogComponent } from '../../../users/crud-user-dialog/crud-user-dialog.component';
import { SimpleDialogRefComponent } from '../../../../shared/dialogs/simple-dialog/simple-dialog-ref/simple-dialog-ref.component';

@Component({
  templateUrl: './manager-courses-create.component.html',
  styleUrls: ['./manager-courses-create.component.css']
})
export class ManagerCoursesCreateComponent implements OnInit, AfterViewInit, OnDestroy {
  areaRole = ROLE_MANAGER;
  roleManager = ROLE_MANAGER;
  roleStudent  = ROLE_STUDENT;
  roleTeacher = ROLE_TEACHER;

  @ViewChild(CrudUserDialogComponent) crudUserDialog: CrudUserDialogComponent;

  course: Course;
  coursesNamesGroups = COURSES_NAMES_GROUPS;

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
  isDark = this.sessionStorage.isDarkTheme();
  rowClasses: {};
  isLoading: boolean = false;
  isThemeDarkSubscription: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, private courseStoreService: CourseStoreService,
    private sessionStorage: SessionStorageService, public sanitizer: DomSanitizer, private formBuilder: FormBuilder,
    private snackbarService: SnackbarService, public dialog: MatDialog) { }

  ngOnInit() {
    this.buildForm();
    this.course = new Course();
    this.dataSource = new MatTableDataSource();


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
  }

  setRowClass() {
    this.rowClasses = {
      'fila': !this.isDark,
      'fila-dark': this.isDark
    };
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

  createCourse() {
    this.course.name = this.createForm.value.name;
    this.course.year = this.createForm.value.year;
    this.course.students = this.listStudents;
    this.course.chiefTeacher = (this.chiefTeacher) ? this.chiefTeacher : null;

    this.courseStoreService.create(this.course)
      .subscribe(_ => {
        this.snackbarService.openSnackBar('Curso agregado', RESULT_SUCCESS);
        this.gotoCourses();
      }, error => {
        if (error instanceof HttpErrorResponse) {
          this.snackbarService.openSnackBar(error.error.message, RESULT_ERROR);
        } else {
          this.snackbarService.openSnackBar('Error al agregar curso', RESULT_ERROR);
        }
      });

  }

  userCardCrud(dialogRef: MatDialogRef<CardUserDialogRefComponent>): void {
    dialogRef.afterClosed().subscribe(result => {
       let user = dialogRef.componentInstance.user;
      if (result === RESULT_CANCELED) {
        console.log(RESULT_CANCELED);
      } else if (result === RESULT_DETAIL) {
        this.crudUserDialog.onlyRead = true;
        this.crudUserDialog.areaRole = this.areaRole;
        this.crudUserDialog.uriRole = user.roles.includes(this.roleManager) ? URI_MANAGERS : user.roles.includes(this.roleTeacher) ? URI_TEACHERS : URI_STUDENTS;
        this.crudUserDialog.openDialogDetail(user);
      } else if (result === RESULT_EDIT) {
        this.crudUserDialog.openDialogEdit(user);
      } else if (result === RESULT_DELETE) {
        this.crudUserDialog.openDialogDelete(user);
      }
    });
  }


  deleteStudent(dialogRef: MatDialogRef<SimpleDialogRefComponent>): void {
    dialogRef.afterClosed().subscribe(result => {
      if (result === RESULT_CANCELED) {
        console.log(RESULT_CANCELED);
      } else if (result === RESULT_ACTION1) {
        console.log(RESULT_ACTION1);
        this.listStudents = this.listStudents.filter(s => s.id !== (dialogRef.componentInstance.obj.id));
        this.dataSource.data = this.listStudents;
       // this.btnDisabled = false;
      } else if (result === RESULT_ACTION2) {
        console.log(RESULT_ACTION2);
      } else if (result === RESULT_ACTION3) {
        console.log(RESULT_ACTION3);
      }
    });
  }


}
