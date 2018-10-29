import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort } from '../../../../../node_modules/@angular/material/sort';
import { MatPaginator } from '../../../../../node_modules/@angular/material/paginator';
import { DomSanitizer } from '../../../../../node_modules/@angular/platform-browser';
import { SessionStorageService } from '../../../services/session-storage.service';
import { MatTableDataSource } from '../../../../../node_modules/@angular/material/table';
import { CourseStoreService } from '../../../services/course-store.service';
import { Course } from '../../../models/course';
import { finalize } from 'rxjs/operators';
import { RESULT_SUCCESS, RESULT_ERROR } from '../../../app.config';
import { SnackbarService } from '../../../services/snackbar.service';


@Component({
  selector: 'nx-manager-courses',
  templateUrl: './manager-courses.component.html',
  styleUrls: ['./manager-courses.component.css']
})
export class ManagerCoursesComponent implements OnInit, AfterViewInit {

  // mat table

  displayedColumns = ['name', 'crud'];
  dataSource;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSize = 5;
  pageSizeOptions = [5, 10, 20];
  rowClasses: {};
  isDark = this.sessionStorage.isDarkTheme();
  isLoading: boolean = false;

  constructor(private sessionStorage: SessionStorageService, private courseStoreService: CourseStoreService,
    public sanitizer: DomSanitizer,private snackbarService: SnackbarService) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Course>();
    this.courseStoreService.isLoadingGetCourses$.subscribe(isLoadding => setTimeout(() => this.isLoading = isLoadding));
    this.courseStoreService.courses$.subscribe(data => this.dataSource.data = data);

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.sessionStorage.isThemeDark$.subscribe(isDark => {
      this.isDark = isDark;
      this.setRowClass();
    });

    this.setRowClass();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
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

  deleteCourse(course: Course) {
    this.isLoading = true;
    this.courseStoreService.delete(course)
    .pipe(finalize(() => this.isLoading = false))
    .subscribe(_ => this.snackbarService.openSnackBar('Curso Eliminado', RESULT_SUCCESS)
    , err => {
      this.snackbarService.openSnackBar('Error al eliminar Curso', RESULT_ERROR);
      console.error("Error deleting Course: " + err);
    });

  }

}
