import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Subject } from '../../../../../models/subject';
import { ROLE_MANAGER, ROLE_TEACHER, ROLE_STUDENT, URI_STUDENTS, RESULT_CANCELED, RESULT_DETAIL, RESULT_EDIT, RESULT_DELETE, CRUD_TYPE_DETAIL, RESULT_ERROR, CRUD_TYPE_EDIT, GRADE_UPDATE_ERROR, RESULT_SUCCEED, GRADE_CREATE_SUCCEED } from '../../../../../app.config';
import { User } from '../../../../../models/user';
import { CrudUserDialogComponent } from '../../../../users/crud-user-dialog/crud-user-dialog.component';
import { Subscription } from 'rxjs';
import { Grade } from '../../../../../models/grade';
import { ActivatedRoute, Router } from '@angular/router';
import { GradeStoreService } from '../../../../../services/grade-store.service';
import { SessionStorageService } from '../../../../../services/session-storage.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SnackbarService } from '../../../../../services/snackbar.service';
import { switchMap } from 'rxjs/operators';
import { CardUserDialogRefComponent } from '../../../../users/card-user-dialog/card-user-dialog-ref/card-user-dialog-ref.component';
import { SubjectsGradesCrudDialogRefComponent } from '../../subject-course/subject-grades/subjects-grades-crud-dialog-ref/subjects-grades-crud-dialog-ref.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'nx-subject-book-detail',
  templateUrl: './subject-book-detail.component.html',
  styleUrls: ['./subject-book-detail.component.css']
})
export class SubjectBookDetailComponent implements OnInit {

  @Input() areaRole: string;
  roleManager = ROLE_MANAGER;
  roleTeacher = ROLE_TEACHER;
  roleStudent = ROLE_STUDENT;

  student: User;
  subject: Subject;

  studentName: string;
  subjectId: string;

  uriStudents = URI_STUDENTS
  @ViewChild('crudUserDialog') crudUserDialog: CrudUserDialogComponent;
  crudUserOnlyRead: boolean = true;

  // mat table
  displayedColumns = ['evaluation.title', 'crud'];
  dataSource;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSize = 5;
  pageSizeOptions = [5, 10, 20];
  isDark: boolean;
  isLoading: boolean = false;

  private subscriptions = new Subscription();
  grade: Grade;
  colorGrade: string;

  constructor(private route: ActivatedRoute, private router: Router, public dialog: MatDialog,
    private gradeStoreService: GradeStoreService, private sessionStorage: SessionStorageService,
    public sanitizer: DomSanitizer, private snackbarService: SnackbarService) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Grade[]>();

    this.subscriptions.add(this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0));

    // snapshot doesn't re-use the component
    //this.studentName = this.route.snapshot.paramMap.get('username');
    //this.subjectId = this.route.snapshot.paramMap.get('id');
    //this.gradesSubscription = this.gradeStoreService.grades$

    this.subscriptions.add(this.route.paramMap
      .pipe(
        switchMap(params => {
          this.studentName = params.get('username');
          this.subjectId = params.get('id');

          return this.gradeStoreService.grades$
        }),

      )
      .subscribe());

    this.subscriptions.add(this.gradeStoreService.isLoadingGetGrades$.subscribe(isLoadding => this.isLoading = isLoadding));

    this.subscriptions.add(this.sessionStorage.isThemeDark$.subscribe(isDark => this.isDark = isDark));

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    // if (this.areaRole === this.roleTeacher) this.displayedColumns.push('crud');
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  goBack() {
    this.router.navigate(['../../book/' + this.subjectId], { relativeTo: this.route });
  }

  openUserCardCrud(dialogRef: MatDialogRef<CardUserDialogRefComponent>): void {
    this.subscriptions.add(dialogRef.afterClosed().subscribe(result => {
      if (result === RESULT_CANCELED) {
        console.log(RESULT_CANCELED);
      } else if (result === RESULT_DETAIL) {
        this.crudUserDialog.openDialogDetail();
      } else if (result === RESULT_EDIT) {
        this.crudUserDialog.openDialogEdit();
      } else if (result === RESULT_DELETE) {
        this.crudUserDialog.openDialogDelete();
      }
    }));
  }

  openDialogDetail(grade: Grade): void {
    let data = {
      grade: grade,
      type: CRUD_TYPE_DETAIL,
      areaRole: this.areaRole

    };

    let config = new MatDialogConfig();
    config.data = data;
    config.panelClass = 'dialogService';
    config.width = '700px';
    config.disableClose = true;

    let dialogRef = this.dialog.open(SubjectsGradesCrudDialogRefComponent, config);
    this.subscriptions.add(dialogRef.afterClosed().subscribe(result => {
      if (result === RESULT_CANCELED) {
        console.log(RESULT_CANCELED);
      } else if (result === RESULT_ERROR) {
        console.error(RESULT_ERROR);
      } else if (result === RESULT_EDIT) {
        console.log(RESULT_EDIT);
        this.openDialogEdit(dialogRef.componentInstance.grade);
      }
    }));
  }

  openDialogEdit(grade: Grade): void {
    let data = {
      grade: grade,
      type: CRUD_TYPE_EDIT,

    };

    let config = new MatDialogConfig();
    config.data = data;
    config.panelClass = 'dialogService';
    config.width = '500px';
    config.disableClose = true;

    let dialogRef = this.dialog.open(SubjectsGradesCrudDialogRefComponent, config);
    this.subscriptions.add(dialogRef.afterClosed().subscribe(result => {
      if (result === RESULT_CANCELED) {
        console.log(RESULT_CANCELED);
      } else if (result === RESULT_ERROR) {
        console.error(RESULT_ERROR);
        this.snackbarService.openSnackBar(GRADE_UPDATE_ERROR, RESULT_ERROR);
      } else if (result === RESULT_SUCCEED) {
        console.log(RESULT_SUCCEED);
        this.snackbarService.openSnackBar(GRADE_CREATE_SUCCEED, RESULT_SUCCEED);
      }
    }));
  }




}