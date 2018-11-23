import { Component, OnInit, AfterViewInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Subject } from '../../../../../models/subject';
import { User } from '../../../../../models/user';
import { GradeStoreService } from '../../../../../services/grade-store.service';
import { UserStoreService } from '../../../../../services/user-store.service';
import { SubjectStoreService } from '../../../../../services/subject-store.service';
import { SessionStorageService } from '../../../../../services/session-storage.service';
import { Grade } from '../../../../../models/grade';


@Component({
  selector: 'nx-subject-grades',
  templateUrl: './subject-grades.component.html',
  styleUrls: ['./subject-grades.component.css']
})
export class SubjectGradesComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() areaRole;
  student: User;
  subject: Subject;

  studentName;
  subjectId;


  // mat table
  displayedColumns = ['grade', 'title', 'date', 'crud'];
  dataSource;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSize = 5;
  pageSizeOptions = [5, 10, 20];
  isDark = this.sessionStorage.isDarkTheme();
  rowClasses: {};
  isLoading: boolean = false;


  isThemeDarkSubscription: Subscription;
  usersSubscription: Subscription;
  subjectsSubscription: Subscription;
  isLoadingGetGradesSubscription: Subscription;
  gradesSubscription: Subscription;

  constructor(
    private route: ActivatedRoute, private router: Router, private gradeStoreService: GradeStoreService,
    private userStoreService: UserStoreService, private subjectStoreService: SubjectStoreService,
    private sessionStorage: SessionStorageService, public sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {

    this.dataSource = new MatTableDataSource<Grade[]>();
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    // snapshot doesn't re-use the component
    this.studentName = this.route.snapshot.paramMap.get('username');
    this.subjectId = this.route.snapshot.paramMap.get('sbjId');
    this.gradesSubscription = this.gradeStoreService.grades$
      .subscribe(grades => {
        let filteredGrades = grades.filter(g => (g.student.username.indexOf(this.studentName) === 0) && (g.subject.id.indexOf(this.subjectId) === 0))
        this.dataSource.data = filteredGrades;
      });

    this.isLoadingGetGradesSubscription = this.gradeStoreService.isLoadingGetGrades$.subscribe(isLoadding => setTimeout(() => this.isLoading = isLoadding));

    this.usersSubscription = this.userStoreService.students$
      .subscribe(data => this.student = data.find(user => user.username === this.studentName));

    this.subjectsSubscription = this.subjectStoreService.subjects$
      .subscribe(data => this.subject = data.find(s => s.id === this.subjectId));

    this.isThemeDarkSubscription = this.sessionStorage.isThemeDark$.subscribe(isDark => {
      this.isDark = isDark;
      this.setRowClass();
    });

    this.setRowClass();

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.isThemeDarkSubscription.unsubscribe();
    this.usersSubscription.unsubscribe();
    this.isLoadingGetGradesSubscription.unsubscribe();
    this.subjectsSubscription.unsubscribe();
    this.gradesSubscription.unsubscribe();
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


  goBack() {
    this.router.navigate(['../../' + this.subjectId], { relativeTo: this.route });
  }



}
