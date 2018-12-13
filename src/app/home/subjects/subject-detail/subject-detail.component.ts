import { Component, OnInit, AfterViewInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { MatSort, MatPaginator, MatDialog, MatTableDataSource, MatDialogConfig } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Subject } from '../../../models/subject';
import { Course } from '../../../models/course';
import { User } from '../../../models/user';
import { ROLE_TEACHER, RESULT_CANCELED, RESULT_ERROR, RESULT_SUCCESS } from '../../../app.config';
import { SubjectStoreService } from '../../../services/subject-store.service';
import { SessionStorageService } from '../../../services/session-storage.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { shortNameSecondName } from '../../../shared/functions/shortName';
import { Grade } from '../../../models/grade';
import { SubjectsGradesCrudDialogRefComponent } from '../subject-grades/subjects-grades-crud-dialog-ref/subjects-grades-crud-dialog-ref.component';



@Component({
  selector: 'nx-subject-detail',
  templateUrl: './subject-detail.component.html',
  styleUrls: ['./subject-detail.component.css']
})
export class SubjectDetailComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() areaRole;
  subjectId: string;
  subject: Subject;
  course: Course;
  teacher: User;
  listStudents: User[] = [];

  btnDisabled = true;

  // mat table
  displayedColumns = ['firstName','crud'];
  dataSource;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSize = 5;
  pageSizeOptions = [5, 10, 20];
  isDark = this.sessionStorage.isDarkTheme();
  rowClasses: {};
  isLoading: boolean = false;

  isThemeDarkSubscription: Subscription;
  isLoadingGetSubjectsSubscription: Subscription;
  subjectsSubscription: Subscription;
  roleTeacher = ROLE_TEACHER;


  constructor(
    private route: ActivatedRoute, private router: Router, private subjectStoreService: SubjectStoreService,
    private sessionStorage: SessionStorageService, public sanitizer: DomSanitizer,
    private snackbarService: SnackbarService, public dialog: MatDialog
  ) { }

  ngOnInit() {

    if (this.areaRole === this.roleTeacher){

    }
      
    this.dataSource = new MatTableDataSource<Course>();
    this.dataSource.filterPredicate = (user: User, filterValue: string) =>
      (user.firstName.toLowerCase() + ' ' + user.lastName.toLowerCase()).indexOf(filterValue) === 0 ||
      user.firstName.toLowerCase().indexOf(filterValue) === 0 || user.lastName.toLowerCase().indexOf(filterValue) === 0
      || shortNameSecondName(user).toLowerCase().indexOf(filterValue) === 0;

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

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
          this.teacher = s.teacher;
          this.dataSource.data = s.course.students;
          this.listStudents = this.dataSource.data;
        }
      });

    this.isLoadingGetSubjectsSubscription = this.subjectStoreService.isLoadingGetSubjects$.subscribe(isLoadding => setTimeout(() => this.isLoading = isLoadding));

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
    this.isLoadingGetSubjectsSubscription.unsubscribe();
    this.subjectsSubscription.unsubscribe();
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
    this.router.navigate(['../../courses/',this.subject.course.name], { relativeTo: this.route });
  }

  openDialogCreate(subject: Subject): void {
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
        this.snackbarService.openSnackBar("Error al Crear Nota", RESULT_ERROR);
        console.error(RESULT_ERROR);
      } else if (result === RESULT_SUCCESS) {
        this.snackbarService.openSnackBar("Nota Creada", RESULT_SUCCESS);
        console.log(RESULT_SUCCESS);
      }
    });
  }

}
