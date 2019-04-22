import { Component, OnInit, AfterViewInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { ROLE_TEACHER, RESULT_CANCELED, RESULT_ERROR, RESULT_EDIT, RESULT_SUCCESS, URI_MANAGERS, URI_TEACHERS, URI_STUDENTS, RESULT_DETAIL, RESULT_DELETE, ROLE_MANAGER, ROLE_STUDENT } from '../../../app.config';
import { User } from '../../../models/user';
import { Subscription } from 'rxjs';
import { MatSort, MatPaginator, MatDialog, MatTableDataSource, MatDialogConfig, MatDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { GradeStoreService } from '../../../services/grade-store.service';
import { SessionStorageService } from '../../../services/session-storage.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SnackbarService } from '../../../services/snackbar.service';
import { Grade } from '../../../models/grade';
import { Subject } from '../../../models/subject';
import { shortNameSecondName } from '../../../shared/functions/shortName';
import { SubjectsGradesCrudDialogRefComponent } from '../subject-grades/subjects-grades-crud-dialog-ref/subjects-grades-crud-dialog-ref.component';
import { CardUserDialogRefComponent } from '../../users/card-user-dialog/card-user-dialog-ref/card-user-dialog-ref.component';
import { CrudUserDialogComponent } from '../../users/crud-user-dialog/crud-user-dialog.component';

@Component({
  selector: 'nx-subjects-quiz',
  templateUrl: './subjects-quiz.component.html',
  styleUrls: ['./subjects-quiz.component.css']
})
export class SubjectsQuizComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() areaRole;
  student: User;
  @Input() subject: Subject;
  grades: Grade[];

  studentName;
  subjectId;

  roleManager = ROLE_MANAGER;
  roleStudent = ROLE_STUDENT;
  roleTeacher = ROLE_TEACHER;
  @ViewChild(CrudUserDialogComponent) crudUserDialog: CrudUserDialogComponent;

  // mat table
  displayedColumns = ['student.firstName', 'grade'];
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
    private route: ActivatedRoute, private router: Router, public dialog: MatDialog, private gradeStoreService: GradeStoreService,
    private sessionStorage: SessionStorageService, public sanitizer: DomSanitizer, private snackbarService: SnackbarService
  ) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Grade[]>();

    this.dataSource.filterPredicate = (grade: Grade, filterValue: string) =>
      (grade.student.firstName.toLowerCase() + ' ' + grade.student.lastName.toLowerCase()).indexOf(filterValue) === 0 ||
      grade.student.firstName.toLowerCase().indexOf(filterValue) === 0 || grade.student.lastName.toLowerCase().indexOf(filterValue) === 0
      || shortNameSecondName(grade.student).toLowerCase().indexOf(filterValue) === 0;

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.gradesSubscription = this.gradeStoreService.grades$
      .subscribe(grades => {
        let filteredGrades = grades.filter(g => g.subject.id.indexOf(this.subject.id) === 0)
        this.grades = filteredGrades.filter((item, index, self) =>
          index === self.findIndex(g => g.title === item.title)
        )
      });

    this.isLoadingGetGradesSubscription = this.gradeStoreService.isLoadingGetGrades$.subscribe(isLoadding => setTimeout(() => this.isLoading = isLoadding));

    this.isThemeDarkSubscription = this.sessionStorage.isThemeDark$.subscribe(isDark => this.isDark = isDark);

  }



  ngAfterViewInit() {
    this.dataSource.sortingDataAccessor = (obj, property) => this.getPropertySorting(obj, property);
    this.dataSource.sort = this.sort;

    this.dataSource.paginator = this.paginator;

    if (this.areaRole === this.roleTeacher)
      this.displayedColumns.push('crud');
  }

  ngOnDestroy(): void {
    this.isThemeDarkSubscription.unsubscribe();
    this.isLoadingGetGradesSubscription.unsubscribe();
    this.gradesSubscription.unsubscribe();
    if (this.gradesSubscription2) this.gradesSubscription2.unsubscribe();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  getPropertySorting = (obj, path) => (
    path.split('.').reduce((o, p) => o && o[p], obj)
  )

  selectQuiz(selectedQuiz) {
    this.gradesSubscription2 = this.gradeStoreService.grades$
      .subscribe(grades => {
        let filteredGrades = grades.filter(g => ((g.title.indexOf(selectedQuiz) === 0) && (g.subject.id.indexOf(this.subject.id) === 0)))
        this.dataSource.data = filteredGrades;
      });
  }

  goBack() {
    this.router.navigate(['../../courses/', this.subject.course.name], { relativeTo: this.route });
  }

  openDialogDetail(grade: Grade): void {
    let data = {
      grade: grade,
      type: 'detail',

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
      type: 'edit',

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
        this.snackbarService.openSnackBar("Error al Editar Calificación", RESULT_ERROR);
      } else if (result === RESULT_SUCCESS) {
        console.log(RESULT_SUCCESS);
        this.snackbarService.openSnackBar("Calificación Editada", RESULT_SUCCESS);
      }
    });
  }

  openDialogCreateEvaluation(subject: Subject): void {
    let data = {
      subject: subject,
      grade: new Grade,
      type: 'create',

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
        this.snackbarService.openSnackBar("Error al Crear Evaluación", RESULT_ERROR);
        console.error(RESULT_ERROR);
      } else if (result === RESULT_SUCCESS) {
        this.snackbarService.openSnackBar("Evaluación Creada", RESULT_SUCCESS);
        console.log(RESULT_SUCCESS);
      }
    });
  }

  userCardCrud(dialogRef: MatDialogRef<CardUserDialogRefComponent>): void {
    dialogRef.afterClosed().subscribe(result => {
      let user = dialogRef.componentInstance.user;
      this.crudUserDialog.areaRole = this.areaRole;
      this.crudUserDialog.uriRole = user.roles.includes(this.roleManager) ? URI_MANAGERS : user.roles.includes(this.roleTeacher) ? URI_TEACHERS : URI_STUDENTS;
      if (result === RESULT_CANCELED) {
        console.log(RESULT_CANCELED);
      } else if (result === RESULT_DETAIL) {
        this.crudUserDialog.openDialogDetail(user);
      } else if (result === RESULT_EDIT) {
        this.crudUserDialog.openDialogEdit(user);
      } else if (result === RESULT_DELETE) {
        this.crudUserDialog.openDialogDelete(user);
      }
    });
  }

}
