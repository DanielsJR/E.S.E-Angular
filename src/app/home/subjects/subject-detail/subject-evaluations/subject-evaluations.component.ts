import { Component, OnInit, Input, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Subject } from '../../../../models/subject';
import { ROLE_MANAGER, ROLE_TEACHER, ROLE_STUDENT } from '../../../../app.config';
import { MatSort, MatPaginator, MatDialog, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { SubjectStoreService } from '../../../../services/subject-store.service';
import { SessionStorageService } from '../../../../services/session-storage.service';
import { switchMap } from 'rxjs/internal/operators/switchMap';

import { take } from 'rxjs/internal/operators/take';
import { finalize } from 'rxjs/internal/operators/finalize';
import { EvaluationBackendService } from '../../../../services/evaluation-backend.service';
import { EvaluationStoreService } from '../../../../services/evaluation-store.service';

@Component({
  selector: 'nx-subject-evaluations',
  templateUrl: './subject-evaluations.component.html',
  styleUrls: ['./subject-evaluations.component.css']
})
export class SubjectEvaluationsComponent implements OnInit, OnDestroy, AfterViewInit {


  @Input() areaRole: string;
  subjectId: string;
  subject: Subject;

  roleManager = ROLE_MANAGER;
  roleTeacher = ROLE_TEACHER;


  // mat table
  displayedColumns = ['title', 'crud'];
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

  constructor(private route: ActivatedRoute, private router: Router, public sanitizer: DomSanitizer,
    private evaluationStoreService: EvaluationStoreService, private subjectStoreService: SubjectStoreService,
    public dialog: MatDialog, private sessionStorage: SessionStorageService) {

    /* this.subjectId = this.route.snapshot.paramMap.get('id');
     this.evaluationStoreService.getEvaluationsBySubject(this.subjectId);
 
     this.subjectSubscription = this.subjectStoreService.loadOneSubject(this.subjectId)
       .subscribe(s => this.subject = s); */

    this.subjectSubscription = this.route.paramMap
      .pipe(
        switchMap(params => {
          this.subjectId = params.get('id');
          //this.evaluationStoreService.getEvaluationsBySubject(this.subjectId);
          return this.subjectStoreService.loadOneSubject(this.subjectId);
        })
      )
      .subscribe(s => this.subject = s);


  }

  ngOnInit() {
    console.log('************SubjectEvaluationsComponent-ngOnInit()************');
    this.dataSource = new MatTableDataSource<any[]>();

    this.evaluationsSubscription = this.evaluationStoreService.evaluations$.subscribe(es => this.dataSource.data = es);

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.isLoadingSubscription = this.evaluationStoreService.isLoadingGetEvaluations$.subscribe(isLoadding => setTimeout(() => this.isLoading = isLoadding));

    this.isThemeDarkSubscription = this.sessionStorage.isThemeDark$.subscribe(isDark => this.isDark = isDark);

  }


  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.isLoadingSubscription.unsubscribe();
    this.isThemeDarkSubscription.unsubscribe();
    this.evaluationsSubscription.unsubscribe();
    this.subjectSubscription.unsubscribe();
  }

}
