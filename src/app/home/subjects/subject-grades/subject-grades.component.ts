import { Component, OnInit, AfterViewInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatDialogConfig, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Subject } from '../../../models/subject';
import { ROLE_TEACHER, RESULT_CANCELED, RESULT_ERROR, RESULT_SUCCESS, RESULT_EDIT } from '../../../app.config';
import { User } from '../../../models/user';
import { GradeStoreService } from '../../../services/grade-store.service';
import { SessionStorageService } from '../../../services/session-storage.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { Grade } from '../../../models/grade';
import { SubjectsGradesCrudDialogRefComponent } from './subjects-grades-crud-dialog-ref/subjects-grades-crud-dialog-ref.component';



@Component({
  selector: 'nx-subject-grades',
  templateUrl: './subject-grades.component.html',
  styleUrls: ['./subject-grades.component.css']
})
export class SubjectGradesComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() areaRole;
  roleTeacher = ROLE_TEACHER;
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
  isLoadingGetGradesSubscription: Subscription;
  gradesSubscription: Subscription;

  constructor(
    private route: ActivatedRoute, private router: Router, public dialog: MatDialog,
    private gradeStoreService: GradeStoreService, private sessionStorage: SessionStorageService,
    public sanitizer: DomSanitizer, private snackbarService: SnackbarService
  ) {

  }

  ngOnInit() {

    this.dataSource = new MatTableDataSource<Grade[]>();
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    // snapshot doesn't re-use the component
    this.studentName = this.route.snapshot.paramMap.get('username');
    this.subjectId = this.route.snapshot.paramMap.get('sbjId');
    this.gradesSubscription = this.gradeStoreService.grades$
      .subscribe(grades => {
        if (grades) {
          let filteredGrades = grades.filter(g => (g.student.username.indexOf(this.studentName) === 0) && (g.subject.id.indexOf(this.subjectId) === 0))
          this.dataSource.data = filteredGrades;

          let grade = grades.find(g => (g.student.username.indexOf(this.studentName) === 0) && (g.subject.id.indexOf(this.subjectId) === 0))
          if (grade) {
            this.subject = grade.subject;
            this.student = grade.student;
          }
        }
      });

    this.isLoadingGetGradesSubscription = this.gradeStoreService.isLoadingGetGrades$.subscribe(isLoadding => setTimeout(() => this.isLoading = isLoadding));

    this.isThemeDarkSubscription = this.sessionStorage.isThemeDark$.subscribe(isDark => {
      this.isDark = isDark;
      this.setRowClass();
    });

    this.setRowClass();

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
   // if (this.areaRole === this.roleTeacher) this.displayedColumns.push('crud');
  }

  ngOnDestroy(): void {
    this.isThemeDarkSubscription.unsubscribe();
    this.isLoadingGetGradesSubscription.unsubscribe();
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
    this.router.navigate(['../../detail/' + this.subjectId], { relativeTo: this.route });
  }

  openDialogCreate(student: User, subject: Subject): void {
    let data = {
      student: student,
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

  openDialogDetail(grade: Grade): void {
    let data = {
      grade: grade,
      type: 'detail',
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



}
