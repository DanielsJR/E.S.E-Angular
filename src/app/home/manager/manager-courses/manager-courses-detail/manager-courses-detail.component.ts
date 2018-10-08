import { Component, OnInit, ViewChild } from '@angular/core';
import { Course } from '../../../../models/course';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { Observable } from 'rxjs/internal/Observable';
import { CourseStoreService } from '../../../../services/course-store.service';
import { map } from 'rxjs/internal/operators/map';
import { of } from 'rxjs/internal/observable/of';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SessionStorageService } from '../../../../services/session-storage.service';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { User } from '../../../../models/user';
import { finalize } from 'rxjs/internal/operators/finalize';
import { SnackbarService } from '../../../../services/snackbar.service';
import { RESULT_SUCCESS, RESULT_ERROR, RESULT_CANCELED, RESULT_ACCEPT } from '../../../../app.config';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { CrudUserDialogRefComponent } from '../../../../shared/dialogs/crud-user-dialog-ref/crud-user-dialog-ref.component';


@Component({
  selector: 'nx-manager-courses-detail',
  templateUrl: './manager-courses-detail.component.html',
  styleUrls: ['./manager-courses-detail.component.css']
})
export class ManagerCoursesDetailComponent implements OnInit {

  courseName = "";
  course: Course;

  // mat table
  displayedColumns = ['student', 'crud'];
  dataSource;
  chiefTeacher: User;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSize = 20;
  pageSizeOptions = [5, 10, 20];
  isDark = this.sessionStorage.isDarkTheme();
  rowClasses: {};
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute, private router: Router, private courseStoreService: CourseStoreService,
    private sessionStorage: SessionStorageService, public sanitizer: DomSanitizer,
    private snackbarService: SnackbarService, public dialog: MatDialog
  ) {
    this.route.paramMap
      .pipe(switchMap((params: ParamMap) => of(params.get('name'))))
      .subscribe(d => this.courseName = d)
    console.log("Curso nombre: " + this.courseName);
    this.dataSource = new MatTableDataSource();

    this.courseStoreService.courses$
      .subscribe(courses => {
        this.course = courses.find(c => c.name === this.courseName)
        if (this.course) {
          this.chiefTeacher = this.course.chiefTeacher;
          this.dataSource.data = this.course.students;
        }
      });

   // this.courseStoreService.loadOneCourse(this.courseName, 2018);

    /*     
        this.dataSource = this.courseStoreService.courses$
          .pipe(map(courses => courses.find(c => c.name === this.courseName).students)); */
  }

  ngOnInit() {
    this.courseStoreService.isLoadingGetCourses$.subscribe(isLoadding => setTimeout(() => this.isLoading = isLoadding));
    this.sessionStorage.isThemeDark$.subscribe(isDark => {
      this.isDark = isDark;
      this.setRowClass();
    });

    this.setRowClass();

  }

  setRowClass() {
    this.rowClasses = {
      'fila': !this.isDark,
      'fila-dark': this.isDark
    };
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  gotoCourses(course: Course) {
    let courseName = course ? course.name : null;
    // Pass along the hero id if available
    // so that the HeroList component can select that hero.
    // Include a junk 'foo' property for fun.
    this.router.navigate(['home/manager/courses', { name: courseName, foo: 'foo' }]);
  }


  addStudent(user: User) {
    let listStudents: User[] = this.course.students.slice();
    listStudents.push(user);
    let courseEdit: Course = Object.assign({}, this.course);
    courseEdit.students = listStudents;
    this.isLoading = true;
    this.courseStoreService.update(courseEdit)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(_ => this.snackbarService.openSnackBar('Alumno Agregado', RESULT_SUCCESS)
        , err => {
          this.snackbarService.openSnackBar('Error al agregar Alumno', RESULT_ERROR);
          console.error("Error editing Course: " + err);
        });
  }

  changeTeacher(teacher: User) {
    let courseEdit: Course = Object.assign({}, this.course);
    courseEdit.chiefTeacher = teacher;
    this.isLoading = true;
    this.courseStoreService.update(courseEdit)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(_ => this.snackbarService.openSnackBar('Profesor Cambiado', RESULT_SUCCESS)
        , err => {
          this.snackbarService.openSnackBar('Error al cambiar profesor', RESULT_ERROR);
          console.error("Error editing Course: " + err);
        });
  }



  deleteStudent(user: User) {
    console.log('nombre: ' + user.firstName);
    let listStudents: User[] = this.course.students.slice();
    listStudents = listStudents.filter(s => s.id !== (user.id));
    let courseEdit: Course = Object.assign({}, this.course);
    courseEdit.students = listStudents;
    this.isLoading = true;
    this.courseStoreService.update(courseEdit)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(_ => this.snackbarService.openSnackBar('Alumno Eliminado', RESULT_SUCCESS)
        , err => {
          this.snackbarService.openSnackBar('Error al eliminar Alumno', RESULT_ERROR);
          console.error("Error editing Course: " + err);
        });
  }
}
