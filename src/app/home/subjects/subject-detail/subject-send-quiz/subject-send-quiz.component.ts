import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Subscription, empty } from 'rxjs';
import { ROLE_MANAGER, ROLE_TEACHER, CRUD_TYPE_DETAIL, RESULT_CANCELED, RESULT_ERROR, RESULT_EDIT } from '../../../../app.config';
import { Subject } from '../../../../models/subject';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { EvaluationStoreService } from '../../../../services/evaluation-store.service';
import { SubjectStoreService } from '../../../../services/subject-store.service';
import { SessionStorageService } from '../../../../services/session-storage.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { switchMap } from 'rxjs/operators';
import { Evaluation } from '../../../../models/evaluation';
import { SubjectEvaluationsCrudDialogRefComponent } from '../subject-evaluations/subject-evaluations-crud-dialog-ref/subject-evaluations-crud-dialog-ref.component';
import { RxStompService } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';
import { Grade } from '../../../../models/grade';
import { GradeBackendService } from '../../../../services/grade-backend.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { rowAnimation } from '../../../../shared/animations/animations';

@Component({
  selector: 'nx-subject-send-quiz',
  templateUrl: './subject-send-quiz.component.html',
  styleUrls: ['./subject-send-quiz.component.css'],
  animations: [rowAnimation]
})
export class SubjectSendQuizComponent implements OnInit {

  @Input() areaRole: string;
  subjectId: string;
  subject: Subject;

  roleManager = ROLE_MANAGER;
  roleTeacher = ROLE_TEACHER;

  // mat table
  displayedColumns = ['date', 'type', 'title', 'crud'];
  dataSource;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSize = 5;
  pageSizeOptions = [5, 10, 20];
  isDark: boolean;
  rowClasses: {};
  isLoading: boolean = false;
  btnDisabled = true;

  isThemeDarkSubscription: Subscription;
  evaluationsSubscription: Subscription;
  subjectSubscription: Subscription;
  isLoadingSubscription: Subscription;

  evaluationQuizDetail: Evaluation;

  quizFromWebSocket: Grade;
  gradeToTeacher: Grade;

  notificationSubscription: Subscription;
  gradeNotificationSubscription: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, public sanitizer: DomSanitizer,
    private evaluationStoreService: EvaluationStoreService, private subjectStoreService: SubjectStoreService,
    public dialog: MatDialog, private sessionStorage: SessionStorageService, private snackbarService: SnackbarService,
    private rxStompService: RxStompService, private gradeBackendService: GradeBackendService, ) {

    this.subjectSubscription = this.route.paramMap
      .pipe(
        switchMap(params => {
          this.subjectId = params.get('id');
          return this.subjectStoreService.loadOneSubject(this.subjectId);
        }),
        switchMap(s => {
          this.subject = s
          return (this.subject) ? this.rxStompService.watch(`/topic/grade-to-teacher/course/${this.subject.course.id}`) : empty();
        }),
        switchMap((message: Message) => {
          this.gradeToTeacher = JSON.parse(message.body);
          return this.gradeBackendService.create(this.gradeToTeacher)
        })
      ).subscribe(g => this.sendGradeToStudent(g));
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<any[]>();

    this.evaluationsSubscription = this.evaluationStoreService.evaluations$.subscribe(es => this.dataSource.data = es);

    this.isLoadingSubscription = this.evaluationStoreService.isLoadingGetEvaluations$.subscribe(isLoadding => setTimeout(() => this.isLoading = isLoadding));

    this.isThemeDarkSubscription = this.sessionStorage.isThemeDark$.subscribe(isDark => this.isDark = isDark);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  }

  ngOnDestroy(): void {
    this.isLoadingSubscription.unsubscribe();
    this.isThemeDarkSubscription.unsubscribe();
    this.evaluationsSubscription.unsubscribe();
    this.subjectSubscription.unsubscribe();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
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
    dialogRef.afterClosed().subscribe(result => {
      if (result === RESULT_CANCELED) {
        console.log(RESULT_CANCELED);

      } else if (result === RESULT_ERROR) {
        console.error(RESULT_ERROR);

      } else if (result === RESULT_EDIT) {
        console.log(RESULT_EDIT);
        //this.openDialogEdit(dialogRef.componentInstance.evaluation);
      }
    });
  }

  setEvaluationQuizDetail(evaluation: Evaluation) {
    this.evaluationQuizDetail = evaluation;
  }

  sendQuiz(evaluation: Evaluation) {
    this.rxStompService.publish({ destination: `/app/send-quiz/course/${evaluation.subject.course.id}`, body: evaluation.id });
  }

  sendGradeToStudent(grade: Grade) {
    let sId = grade.student.id;
    let gId = grade.id;

    this.rxStompService.publish({ destination: `/app/grade-to-student/student/${sId}/grade/${gId}` });
  }

}

