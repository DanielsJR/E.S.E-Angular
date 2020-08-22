import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatSort } from '../../../../../node_modules/@angular/material/sort';
import { MatPaginator } from '../../../../../node_modules/@angular/material/paginator';
import { SessionStorageService } from '../../../services/session-storage.service';
import { MatTableDataSource } from '../../../../../node_modules/@angular/material/table';
import { CourseStoreService } from '../../../services/course-store.service';
import { Course } from '../../../models/course';
import { finalize, delay } from 'rxjs/operators';
import { RESULT_ERROR, RESULT_CANCELED, RESULT_ACTION1, RESULT_ACTION2, RESULT_ACTION3, RESULT_SUCCEED, COURSE_DELETE_ERROR, COURSE_DELETE_SUCCEED, CANCEL_MESSAGE, RESULT_WARN } from '../../../app.config';
import { SnackbarService } from '../../../shared/snackbars-ref/snackbar.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { SimpleDialogRefComponent } from '../../../shared/dialogs/simple-dialog/simple-dialog-ref/simple-dialog-ref.component';
import { MatDialogRef } from '@angular/material/dialog';
import { rowAnimation } from '../../../shared/animations/animations';


@Component({
  selector: 'nx-manager-courses',
  templateUrl: './manager-courses.component.html',
  styleUrls: ['./manager-courses.component.css'],
  animations: [rowAnimation]
})
export class ManagerCoursesComponent implements OnInit, AfterViewInit, OnDestroy {

  // mat table
  displayedColumns = ['name', 'crud'];
  dataSource = new MatTableDataSource<Course>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSize = 5;
  pageSizeOptions = [5, 10, 20];
  isLoading: boolean = false;
  courseYear;

  private subscriptions = new Subscription();

  constructor(private sessionStorage: SessionStorageService, private courseStoreService: CourseStoreService,
    private snackbarService: SnackbarService,
    private cdRef: ChangeDetectorRef,) { }

  ngOnInit() {
    this.subscriptions.add(this.courseStoreService.isLoadingGetCourses$.subscribe(isLoadding => this.isLoading = isLoadding));
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.subscriptions.add(this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0));

    this.subscriptions.add(this.courseStoreService.courses$
      .subscribe(data => {
        this.courseYear = data[0];
        this.dataSource.data = data;
      }));

    this.cdRef.detectChanges();

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
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
      });

  }

  deleteCourse(dialogRef: MatDialogRef<SimpleDialogRefComponent>) {
    this.isLoading = true;
    this.subscriptions.add(this.courseStoreService.delete(dialogRef.componentInstance.obj)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(_ => this.snackbarService.openSnackBar(COURSE_DELETE_SUCCEED, RESULT_SUCCEED),
        err => this.snackbarService.openSnackBar((err.error.errors) ? err.error.errors : COURSE_DELETE_ERROR, RESULT_ERROR)
      ));
  }

}
