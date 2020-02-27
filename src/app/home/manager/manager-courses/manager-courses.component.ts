import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatSort } from '../../../../../node_modules/@angular/material/sort';
import { MatPaginator } from '../../../../../node_modules/@angular/material/paginator';
import { DomSanitizer } from '../../../../../node_modules/@angular/platform-browser';
import { SessionStorageService } from '../../../services/session-storage.service';
import { MatTableDataSource } from '../../../../../node_modules/@angular/material/table';
import { CourseStoreService } from '../../../services/course-store.service';
import { Course } from '../../../models/course';
import { finalize } from 'rxjs/operators';
import { RESULT_ERROR, RESULT_CANCELED, RESULT_ACTION1, RESULT_ACTION2, RESULT_ACTION3, RESULT_SUCCEED, COURSE_DELETE_ERROR, COURSE_DELETE_SUCCEED, CANCEL_MESSAGE, RESULT_WARN } from '../../../app.config';
import { SnackbarService } from '../../../services/snackbar.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { SimpleDialogRefComponent } from '../../../shared/dialogs/simple-dialog/simple-dialog-ref/simple-dialog-ref.component';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'nx-manager-courses',
  templateUrl: './manager-courses.component.html',
  styleUrls: ['./manager-courses.component.css']
})
export class ManagerCoursesComponent implements OnInit, AfterViewInit, OnDestroy {

  // mat table
  displayedColumns = ['name', 'crud'];
  dataSource: MatTableDataSource<Course>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSize = 20;
  pageSizeOptions = [5, 10, 20];
  isDark: boolean;
  isLoading: boolean = false;
  courseYear;

  isThemeDarkSubscription: Subscription;
  coursesSubscription: Subscription;
  isLoadingGetCoursesSubscription: Subscription;

  constructor(private sessionStorage: SessionStorageService, private courseStoreService: CourseStoreService,
    public sanitizer: DomSanitizer, private snackbarService: SnackbarService) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Course>();
    this.isLoadingGetCoursesSubscription = this.courseStoreService.isLoadingGetCourses$.subscribe(isLoadding => setTimeout(() => this.isLoading = isLoadding));
    this.coursesSubscription = this.courseStoreService.courses$.subscribe(data => {
      this.courseYear = data[0];
      this.dataSource.data = data;
    }
    );

    this.isThemeDarkSubscription = this.sessionStorage.isThemeDark$.subscribe(isDark => this.isDark = isDark);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  }

  ngOnDestroy() {
    this.isThemeDarkSubscription.unsubscribe();
    this.coursesSubscription.unsubscribe();
    this.isLoadingGetCoursesSubscription.unsubscribe();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  dialogAction(dialogRef: MatDialogRef<SimpleDialogRefComponent>) {
    dialogRef.afterClosed()
      .subscribe(result => {
        if (result === RESULT_CANCELED) {
          this.snackbarService.openSnackBar(CANCEL_MESSAGE, RESULT_WARN);
          console.log(RESULT_CANCELED);

        } else if (result === RESULT_ACTION1) {
          console.log(RESULT_ACTION1);
          this.deleteCourse(dialogRef);
        }
      })

  }

  deleteCourse(dialogRef: MatDialogRef<SimpleDialogRefComponent>) {
    this.isLoading = true;
    this.courseStoreService.delete(dialogRef.componentInstance.obj)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((c: Course) => {
        this.snackbarService.openSnackBar(COURSE_DELETE_SUCCEED, RESULT_SUCCEED);
      }, err => {
        this.snackbarService.openSnackBar(COURSE_DELETE_ERROR, RESULT_ERROR);
        console.error(COURSE_DELETE_ERROR + ' ' + err);
      });
  }

}
