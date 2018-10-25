import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CourseStoreService } from '../../../../services/course-store.service';
import { SessionStorageService } from '../../../../services/session-storage.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
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
import { RESULT_SUCCESS, RESULT_ERROR } from '../../../../app.config';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  templateUrl: './manager-courses-create.component.html',
  styleUrls: ['./manager-courses-create.component.css']
})
export class ManagerCoursesCreateComponent implements OnInit, AfterViewInit {

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

  constructor(private route: ActivatedRoute, private router: Router, private courseStoreService: CourseStoreService,
    private sessionStorage: SessionStorageService, public sanitizer: DomSanitizer, private formBuilder: FormBuilder,
    private snackbarService: SnackbarService, public dialog: MatDialog) { }

  ngOnInit() {
    this.buildForm();
    this.course = new Course();
    this.dataSource = new MatTableDataSource();


    this.sessionStorage.isThemeDark$.subscribe(isDark => {
      this.isDark = isDark;
      this.setRowClass();
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
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

    this.isLoading = true;
    this.courseStoreService.create(this.course)
      .pipe(finalize(() => this.isLoading = false))
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


}
