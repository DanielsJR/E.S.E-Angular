import { Component, OnInit, Input, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Subject } from '../../../../models/subject';
import { ROLE_MANAGER, ROLE_TEACHER, ROLE_STUDENT, RESULT_CANCELED, RESULT_ERROR, RESULT_EDIT, CRUD_TYPE_DETAIL, CRUD_TYPE_CREATE, CRUD_TYPE_EDIT, EVALUATION_UPDATE_ERROR, EVALUATION_CREATE_ERROR, RESULT_SUCCEED, EVALUATION_CREATE_SUCCEED, EVALUATION_UPDATE_SUCCEED, CRUD_TYPE_DELETE, EVALUATION_DELETE_ERROR, EVALUATION_DELETE_SUCCEED, RESULT_WARN, CANCEL_MESSAGE, RESULT_ACTION1, RESULT_ACTION2, RESULT_ACTION3 } from '../../../../app.config';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { SubjectStoreService } from '../../../../services/subject-store.service';
import { SessionStorageService } from '../../../../services/session-storage.service';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { EvaluationStoreService } from '../../../../services/evaluation-store.service';
import { Evaluation } from '../../../../models/evaluation';
import { SnackbarService } from '../../../../services/snackbar.service';
import { SubjectEvaluationsCrudDialogRefComponent } from './subject-evaluations-crud-dialog-ref/subject-evaluations-crud-dialog-ref.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { rowAnimation } from '../../../../shared/animations/animations';
import { Subscription } from 'rxjs/internal/Subscription';


@Component({
  selector: 'nx-subject-evaluations',
  templateUrl: './subject-evaluations.component.html',
  styleUrls: ['./subject-evaluations.component.css'],
  animations: [rowAnimation]
})

export class SubjectEvaluationsComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() areaRole: string;
  subjectId: string;
  subject: Subject;

  roleManager = ROLE_MANAGER;
  roleTeacher = ROLE_TEACHER;

  // mat table
  displayedColumns = ['title', 'type', 'date', 'crud'];
  dataSource;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSize = 5;
  pageSizeOptions = [5, 10, 20];
  isDark: boolean;
  rowClasses: {};
  isLoading: boolean = false;
  btnDisabled = true;
  evaluationQuizDetail: Evaluation;
  evaluationCourse: Evaluation;

  private subscriptions = new Subscription();


  constructor(private route: ActivatedRoute, private router: Router, public sanitizer: DomSanitizer,
    private evaluationStoreService: EvaluationStoreService, private subjectStoreService: SubjectStoreService,
    public dialog: MatDialog, private sessionStorage: SessionStorageService, private snackbarService: SnackbarService) {

    this.subscriptions.add(this.route.paramMap
      .pipe(
        switchMap(params => {
          this.subjectId = params.get('id');
          return this.subjectStoreService.loadOneSubject(this.subjectId);
        })
      )
      .subscribe(s => this.subject = s));
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<any[]>();

    this.subscriptions.add(this.evaluationStoreService.evaluations$.subscribe(es => this.dataSource.data = es));

    this.subscriptions.add(this.evaluationStoreService.isLoadingGetEvaluations$.subscribe(isLoadding => this.isLoading = isLoadding));

    this.subscriptions.add(this.sessionStorage.isThemeDark$.subscribe(isDark => this.isDark = isDark));

  }


  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.subscriptions.add(this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  quizDetailButton(evaluation: Evaluation): string {
    return (evaluation.quiz) ? 'visible' : 'hidden';
  }

  setEvaluationQuizDetail(evaluation: Evaluation) {
    this.evaluationQuizDetail = evaluation;
  }

  setEvaluationCourse(evaluation: Evaluation) {
    this.evaluationCourse = evaluation;
  }

  openDialogDetail(evaluation: Evaluation): void {
    let data = {
      evaluation: evaluation,
      type: CRUD_TYPE_DETAIL,
      areaRole: this.areaRole

    };

    let config = new MatDialogConfig();
    config.data = data;
    config.panelClass = 'dialogService';
    config.width = '700px';
    config.disableClose = true;

    let dialogRef = this.dialog.open(SubjectEvaluationsCrudDialogRefComponent, config);
    this.subscriptions.add(dialogRef.afterClosed().subscribe(result => {
      if (result === RESULT_CANCELED) {
        console.log(RESULT_CANCELED);

      } else if (result === RESULT_ERROR) {
        console.error(RESULT_ERROR);

      } else if (result === RESULT_EDIT) {
        console.log(RESULT_EDIT);
        this.openDialogEdit(dialogRef.componentInstance.evaluation);
      }
    }));
  }

  openDialogCreate(): void {
    let evaluation = new Evaluation();
    evaluation.subject = this.subject;
    let data = {
      evaluation: evaluation,
      type: CRUD_TYPE_CREATE,
      areaRole: this.areaRole

    };

    let config = new MatDialogConfig();
    config.data = data;
    config.panelClass = 'dialogService';
    config.width = '700px';
    config.disableClose = true;

    let dialogRef = this.dialog.open(SubjectEvaluationsCrudDialogRefComponent, config);
    this.subscriptions.add(dialogRef.afterClosed().subscribe(result => {
      if (result === RESULT_CANCELED) {
        this.snackbarService.openSnackBar(CANCEL_MESSAGE, RESULT_WARN);
        console.log(RESULT_CANCELED);

      } else if (result === RESULT_ERROR) {
        this.snackbarService.openSnackBar(EVALUATION_CREATE_ERROR, RESULT_ERROR);
        console.error(RESULT_ERROR);

      } else if (result === RESULT_SUCCEED) {
        this.snackbarService.openSnackBar(EVALUATION_CREATE_SUCCEED, RESULT_SUCCEED);
        console.log(RESULT_SUCCEED);
      }
    }));
  }

  openDialogEdit(evaluation: Evaluation): void {
    let data = {
      evaluation: evaluation,
      type: CRUD_TYPE_EDIT,
      areaRole: this.areaRole

    };

    let config = new MatDialogConfig();
    config.data = data;
    config.panelClass = 'dialogService';
    config.width = '700px';
    config.disableClose = true;

    let dialogRef = this.dialog.open(SubjectEvaluationsCrudDialogRefComponent, config);
    this.subscriptions.add(dialogRef.afterClosed().subscribe(result => {
      if (result === RESULT_CANCELED) {
        this.snackbarService.openSnackBar(CANCEL_MESSAGE, RESULT_WARN);
        console.log(RESULT_CANCELED);

      } else if (result === RESULT_ERROR) {
        this.snackbarService.openSnackBar(EVALUATION_UPDATE_ERROR, RESULT_ERROR);
        console.error(RESULT_ERROR);

      } else if (result === RESULT_SUCCEED) {
        this.snackbarService.openSnackBar(EVALUATION_UPDATE_SUCCEED, RESULT_SUCCEED);
        console.log(RESULT_SUCCEED);
      }
    }));
  }

  openDialogDelete(evaluation: Evaluation): void {
    let data = {
      evaluation: evaluation,
      type: CRUD_TYPE_DELETE,
      areaRole: this.areaRole

    };

    let config = new MatDialogConfig();
    config.data = data;
    config.panelClass = 'dialogService';
    config.width = '500px';
    config.disableClose = true;

    let dialogRef = this.dialog.open(SubjectEvaluationsCrudDialogRefComponent, config);
    this.subscriptions.add(dialogRef.afterClosed().subscribe(result => {
      if (result === RESULT_CANCELED) {
        this.snackbarService.openSnackBar(CANCEL_MESSAGE, RESULT_WARN);
        console.log(RESULT_CANCELED);

      } else if (result === RESULT_ERROR) {
        this.snackbarService.openSnackBar(EVALUATION_DELETE_ERROR, RESULT_ERROR);
        console.error(RESULT_ERROR);

      } else if (result === RESULT_SUCCEED) {
        this.snackbarService.openSnackBar(EVALUATION_DELETE_SUCCEED, RESULT_SUCCEED);
        console.log(RESULT_SUCCEED);
      }
    }));
  }


}
