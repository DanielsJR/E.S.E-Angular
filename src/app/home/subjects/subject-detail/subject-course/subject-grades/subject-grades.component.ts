import { Component, OnInit, AfterViewInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { ROLE_TEACHER, RESULT_CANCELED, RESULT_ERROR, RESULT_EDIT, URI_STUDENT, RESULT_DETAIL, RESULT_DELETE, RESULT_SUCCEED, GRADE_UPDATE_ERROR, GRADE_CREATE_SUCCEED, CRUD_TYPE_EDIT, CRUD_TYPE_DETAIL, ROLE_STUDENT, ROLE_MANAGER, GRADE_UPDATE_SUCCEED } from '../../../../../app.config';
import { User } from '../../../../../models/user';
import { Subject } from '../../../../../models/subject';
import { Grade } from '../../../../../models/grade';
import { ActivatedRoute, Router } from '@angular/router';
import { GradeStoreService } from '../../../../../services/grade-store.service';
import { SessionStorageService } from '../../../../../services/session-storage.service';
import { SnackbarService } from '../../../../../shared/snackbars-ref/snackbar.service';
import { SubjectsGradesCrudDialogRefComponent } from './subjects-grades-crud-dialog-ref/subjects-grades-crud-dialog-ref.component';
import { CrudUserDialogComponent } from '../../../../users/crud-user-dialog/crud-user-dialog.component';
import { CardUserDialogRefComponent } from '../../../../users/card-user-dialog/card-user-dialog-ref/card-user-dialog-ref.component';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { rowAnimation } from '../../../../../shared/animations/animations';
import { Subscription } from 'rxjs/internal/Subscription';


@Component({
  selector: 'nx-subject-grades',
  templateUrl: './subject-grades.component.html',
  styleUrls: ['./subject-grades.component.css'],
  animations: [rowAnimation]
})
export class SubjectGradesComponent implements OnInit {

  @Input() areaRole: string;
  roleManager = ROLE_MANAGER;
  roleTeacher = ROLE_TEACHER;
  roleStudent = ROLE_STUDENT;

  student: User;
  subject: Subject;

  studentName: string;
  subjectId: string;

  uriStudents = URI_STUDENT
  @ViewChild('crudUserDialog') crudUserDialog: CrudUserDialogComponent;
  crudUserOnlyRead: boolean = true;

  // mat table
  displayedColumns = ['evaluation.title', 'evaluation.date', 'grade', 'crud'];
  dataSource;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSize = 5;
  pageSizeOptions = [5, 10, 20];
  isDark: boolean;
  isLoading: boolean = false;

  grade: Grade;
  colorGrade: string;

  private subscriptions = new Subscription();

  constructor(private route: ActivatedRoute, private router: Router, public dialog: MatDialog,
    private gradeStoreService: GradeStoreService, private sessionStorage: SessionStorageService,
    private snackbarService: SnackbarService) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Grade[]>();
    this.dataSource.filterPredicate = (grade: Grade, filterValue: string) =>
      grade.grade.toString().toLowerCase().indexOf(filterValue) === 0
      || grade.evaluation.title.toLowerCase().indexOf(filterValue) === 0
      || grade.evaluation.type.toLowerCase().indexOf(filterValue) === 0
      || grade.evaluation.date.toLowerCase().indexOf(filterValue) === 0;


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
      .subscribe(grades => {
        if (grades) {
          let filteredGrades = grades.filter(g => (g.student.username.indexOf(this.studentName) === 0) && (g.evaluation.subject.id.indexOf(this.subjectId) === 0))
          this.dataSource.data = filteredGrades;

          let grade = grades.find(g => (g.student.username.indexOf(this.studentName) === 0) && (g.evaluation.subject.id.indexOf(this.subjectId) === 0))
          if (grade) {
            this.subject = grade.evaluation.subject;
            this.student = grade.student;
          } else {
            this.subject = null;
          }
        }
      }));

    this.subscriptions.add(this.gradeStoreService.isLoadingGetGrades$.subscribe(isLoadding => this.isLoading = isLoadding));

    this.subscriptions.add(this.sessionStorage.isThemeDark$.subscribe(isDark => this.isDark = isDark));

  }

  ngAfterViewInit() {
    this.dataSource.sortingDataAccessor = (obj, property) => this.getPropertySorting(obj, property);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.subscriptions.add(this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0));
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

  getPropertySorting = (obj, path) => (
    path.split('.').reduce((o, p) => o && o[p], obj)
  )

  goBack() {
    this.router.navigate(['../../course/' + this.subjectId], { relativeTo: this.route });
  }

  quizDetailButton(grade: Grade): string {
    return (grade.quizStudent) ? 'visible' : 'hidden';
  }

  setQuizDetail(grade: Grade) {
    this.grade = grade;
  }

  openUserCardCrud(dialogRef: MatDialogRef<CardUserDialogRefComponent>): void {
    dialogRef.afterClosed().subscribe(result => {
      if (result === RESULT_CANCELED) {
        console.log(RESULT_CANCELED);
      } else if (result === RESULT_DETAIL) {
        this.crudUserDialog.openDialogDetail();
      } else if (result === RESULT_EDIT) {
        this.crudUserDialog.openDialogEdit();
      } else if (result === RESULT_DELETE) {
        this.crudUserDialog.openDialogDelete();
      }
    });
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
    dialogRef.afterClosed().subscribe(result => {
      if (result === RESULT_CANCELED) {
        console.log(RESULT_CANCELED);
      } else if (result === RESULT_ERROR) {
        console.error(RESULT_ERROR);
      } else if (result === RESULT_EDIT) {
        console.log(RESULT_EDIT);
        this.openDialogEdit(dialogRef.componentInstance.grade);
      }
    });
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
    dialogRef.afterClosed().subscribe(result => {
      if (result === RESULT_CANCELED) {
        console.log(RESULT_CANCELED);
      } else if (result === RESULT_ERROR) {
        console.error(RESULT_ERROR);
        this.snackbarService.openSnackBar(GRADE_UPDATE_ERROR, RESULT_ERROR);
      } else if (result === RESULT_SUCCEED) {
        console.log(RESULT_SUCCEED);
        this.snackbarService.openSnackBar(GRADE_UPDATE_SUCCEED, RESULT_SUCCEED);
      }
    });
  }


}
