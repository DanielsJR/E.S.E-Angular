import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Subject } from '../../../../../models/subject';
import { User } from '../../../../../models/user';
import { Grade } from '../../../../../models/grade';
import { ROLE_MANAGER, ROLE_STUDENT, ROLE_TEACHER } from '../../../../../app.config';
import { CrudUserDialogComponent } from '../../../../users/crud-user-dialog/crud-user-dialog.component';
import { MatSort, MatPaginator, MatDialog, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { GradeStoreService } from '../../../../../services/grade-store.service';
import { SubjectStoreService } from '../../../../../services/subject-store.service';
import { SessionStorageService } from '../../../../../services/session-storage.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SnackbarService } from '../../../../../services/snackbar.service';
import { switchMap } from 'rxjs/operators';
import { shortNameSecondName } from '../../../../../shared/functions/shortName';
import { Evaluation } from '../../../../../models/evaluation';

@Component({
  selector: 'nx-subject-evaluations-course',
  templateUrl: './subject-evaluations-course.component.html',
  styleUrls: ['./subject-evaluations-course.component.css']
})
export class SubjectEvaluationsCourseComponent implements OnInit {

  private _evaluation: Evaluation;
  colorGrade: any;
  quizStudentGrade: Grade;

  @Input() set evaluation(evaluation: Evaluation) {
    this._evaluation = evaluation;
    if (this.grades) this.setGrades();
  }

  get evaluation() {
    return this._evaluation;
  }

  subjectId: string;
  subject: Subject;

  @Input() areaRole;
  student: User;
  //@Input() subject: Subject;
  grades: Grade[];

  studentName;

  roleManager = ROLE_MANAGER;
  roleStudent = ROLE_STUDENT;
  roleTeacher = ROLE_TEACHER;
  //@ViewChild(CrudUserDialogComponent) crudUserDialog: CrudUserDialogComponent;

  // mat table
  displayedColumns = ['student.firstName', 'grade', 'crud'];
  dataSource;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSize = 5;
  pageSizeOptions = [5, 10, 20];
  isDark;
  rowClasses: {};
  isLoading: boolean = false;

  isThemeDarkSubscription: Subscription;
  subjectsSubscription: Subscription;
  isLoadingGetGradesSubscription: Subscription;
  gradesSubscription: Subscription;
  gradesSubscription2: Subscription;

  constructor(
    private route: ActivatedRoute, private router: Router, public dialog: MatDialog,
    private gradeStoreService: GradeStoreService, private subjectStoreService: SubjectStoreService,
    private sessionStorage: SessionStorageService, public sanitizer: DomSanitizer, private snackbarService: SnackbarService
  ) { }

  ngOnInit() {

    // paramMap re-uses the component
    this.subjectsSubscription = this.route.paramMap
      .pipe(
        switchMap(params => {
          this.subjectId = params.get('id');
          return this.subjectStoreService.subjects$;
        })
      )
      .subscribe(subjects => {
        let s = subjects.find(s => s.id === this.subjectId)
        if (s) {
          this.subject = s;
        }
      });

    this.dataSource = new MatTableDataSource<Grade[]>();

    this.dataSource.filterPredicate = (grade: Grade, filterValue: string) =>
      (grade.student.firstName.toLowerCase() + ' ' + grade.student.lastName.toLowerCase()).indexOf(filterValue) === 0 ||
      grade.student.firstName.toLowerCase().indexOf(filterValue) === 0 || grade.student.lastName.toLowerCase().indexOf(filterValue) === 0
      || shortNameSecondName(grade.student).toLowerCase().indexOf(filterValue) === 0;

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.gradesSubscription = this.gradeStoreService.grades$
      .subscribe(grades => {
        if (grades) {
          this.grades = grades;
          if (this.grades.length) this.setGrades();
        }

      });

    this.isLoadingGetGradesSubscription = this.gradeStoreService.isLoadingGetGrades$.subscribe(isLoadding => setTimeout(() => this.isLoading = isLoadding));

    this.isThemeDarkSubscription = this.sessionStorage.isThemeDark$.subscribe(isDark => this.isDark = isDark);

  }



  ngAfterViewInit() {
    this.dataSource.sortingDataAccessor = (obj, property) => this.getPropertySorting(obj, property);
    this.dataSource.sort = this.sort;

    this.dataSource.paginator = this.paginator;

  }

  ngOnDestroy(): void {
    this.isThemeDarkSubscription.unsubscribe();
    this.isLoadingGetGradesSubscription.unsubscribe();
    this.gradesSubscription.unsubscribe();
    if (this.gradesSubscription2) this.gradesSubscription2.unsubscribe();
    this.subjectsSubscription.unsubscribe();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  getPropertySorting = (obj, path) => (
    path.split('.').reduce((o, p) => o && o[p], obj)
  )

  setGrades() {
    console.log('*********setGrades')
    let filteredGrades = this.grades.filter(g => g.evaluation.id.indexOf(this.evaluation.id) === 0);
    this.dataSource.data = filteredGrades;
  }

  dinamicColorGrade(grade: Grade) {
    if (grade.grade > 4.0) {
      this.colorGrade = 'gradeColorHigh'
      if (this.isDark) {
        this.colorGrade = 'gradeColorHighDark'
      }
    } else {
      this.colorGrade = 'gradeColorLow'
      if (this.isDark) {
        this.colorGrade = 'gradeColorLowDark'
      }
    }
    return this.colorGrade;
  }

  setQuizStudent(grade: Grade) {
    this.quizStudentGrade = grade;
  }

}
