import { Component, OnInit, ViewChild } from '@angular/core';
import { Course } from '../../../../models/course';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { Observable } from 'rxjs/internal/Observable';
import { CourseStoreService } from '../../../../services/course-store.service';
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
import { tap } from 'rxjs/internal/operators/tap';


@Component({
  selector: 'nx-manager-courses-detail',
  templateUrl: './manager-courses-detail.component.html',
  styleUrls: ['./manager-courses-detail.component.css']
})
export class ManagerCoursesDetailComponent implements OnInit {

  courseName: string;
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

    this.dataSource = new MatTableDataSource();

  }

  ngOnInit() {

    // paramMap re-uses the component
    this.route.paramMap
      .pipe(switchMap(params => this.getCurso(params.get('name'))))
      .subscribe();

    // snapshot doesn't re-uses the component
    /*   this.getCurso(this.route.snapshot.paramMap.get('name'))
       .subscribe();*/

    this.courseStoreService.isLoadingGetCourses$.subscribe(isLoadding => setTimeout(() => this.isLoading = isLoadding));
    this.sessionStorage.isThemeDark$.subscribe(isDark => {
      this.isDark = isDark;
      this.setRowClass();
    });

    this.setRowClass();

  }

  getCurso(name): Observable<Course[]> {
    return this.courseStoreService.courses$
      .pipe(
        tap(courses => {
          this.course = courses.find(c => c.name === name)
          if (this.course) {
            this.chiefTeacher = this.course.chiefTeacher;
            this.dataSource.data = this.course.students;
          }
        })
      );
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

  gotoCourses() {
    this.router.navigate(['../../'], { relativeTo: this.route });
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
