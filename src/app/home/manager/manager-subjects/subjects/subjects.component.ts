import { Component, OnInit, ViewChild, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs/internal/operators/finalize';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { SubjectsCrudDialogRefComponent } from './subjects-crud-dialog-ref/subjects-crud-dialog-ref.component';
import { UserLoggedService } from '../../../../services/user-logged.service';
import { ROLE_MANAGER, ROLE_TEACHER, RESULT_CANCELED, RESULT_ERROR, RESULT_SUCCESS } from '../../../../app.config';
import { MatSort, MatPaginator } from '@angular/material';
import { SessionStorageService } from '../../../../services/session-storage.service';
import { SubjectStoreService } from '../../../../services/subject-store.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from '../../../../models/subject';
import { Subscription } from 'rxjs';
import { User } from '../../../../models/user';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'nx-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css']
})
export class SubjectsComponent implements OnInit, AfterViewInit, OnDestroy {


  @Input() areaRole;
  roleManager = ROLE_MANAGER;
  roleTeacher = ROLE_TEACHER;

  user: User;

  // mat table
  displayedColumns = ['name', 'crud'];
  dataSource;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSize = 5;
  pageSizeOptions = [5, 10, 20];
  rowClasses: {};
  isDark = this.sessionStorage.isDarkTheme();
  isLoading: boolean = false;

  subjectsSubscription: Subscription;
  isLoadingGetSubjectsSubscription: Subscription;
  isThemeDarkSubscription: Subscription;
  courseName: string;

  constructor(private sessionStorage: SessionStorageService, private subjectStoreService: SubjectStoreService,
    private userLoggedService: UserLoggedService, private route: ActivatedRoute, private router: Router,
    public dialog: MatDialog, private snackbarService: SnackbarService, public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Subject>();
    this.isLoadingGetSubjectsSubscription = this.subjectStoreService.isLoadingGetSubjects$.subscribe(isLoadding => setTimeout(() => this.isLoading = isLoadding));


    if (this.areaRole === this.roleManager) {
      this.subjectsSubscription = this.route.paramMap
        .pipe(switchMap(params => {
          this.courseName = params.get('name');
          return this.subjectStoreService.subjects$
        }))
        .subscribe(subjects => {
          let filteredSubjects = subjects.filter(sj => sj.course.name.indexOf(this.courseName) === 0)
          this.dataSource.data = filteredSubjects;
        });

    } else if (this.areaRole === this.roleTeacher) {
      this.subjectsSubscription = this.userLoggedService.userLogged$
        .pipe(
          switchMap(user => {
            this.user = user;
            return this.route.paramMap;
          }),
          switchMap(params => {
            this.courseName = params.get('name');
            return this.subjectStoreService.subjects$
          })

        )
        .subscribe(subjects => {
          let filteredSubjects = subjects.filter(sj => sj.teacher.username.indexOf(this.user.username) === 0 && sj.course.name.indexOf(this.courseName) === 0)
          this.dataSource.data = filteredSubjects;
        });

    } else {
      console.error('Area role: ', this.areaRole);
    }


    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

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
    this.subjectsSubscription.unsubscribe();
    this.isLoadingGetSubjectsSubscription.unsubscribe();
    this.isThemeDarkSubscription.unsubscribe();
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
    this.router.navigate(['../'], { relativeTo: this.route });
  }


  openDialogCreate(): void {
    let data = {
      subject: new Subject,
      type: 'create',

    };

    let config = new MatDialogConfig();
    config.data = data;
    config.panelClass = 'dialogService';
    config.width = '700px';
    config.disableClose = true;

    let dialogRef = this.dialog.open(SubjectsCrudDialogRefComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      if (result === RESULT_CANCELED) {
        console.log(RESULT_CANCELED);
      } else if (result === RESULT_ERROR) {
        this.snackbarService.openSnackBar("Error al Crear Asignatura", RESULT_ERROR);
        console.error(RESULT_ERROR);
      } else if (result === RESULT_SUCCESS) {
        this.snackbarService.openSnackBar("Asignatura Creada", RESULT_SUCCESS);
        console.log(RESULT_SUCCESS);
      }
    });
  }

  openDialogEdit(subject: Subject): void {
    let data = {
      subject: subject,
      type: 'edit',

    };

    let config = new MatDialogConfig();
    config.data = data;
    config.panelClass = 'dialogService';
    config.width = '700px';
    config.disableClose = true;

    let dialogRef = this.dialog.open(SubjectsCrudDialogRefComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      if (result === RESULT_CANCELED) {
        console.log(RESULT_CANCELED);
      } else if (result === RESULT_ERROR) {
        this.snackbarService.openSnackBar("Error al Editar Asignatura", RESULT_ERROR);
        console.error(RESULT_ERROR);
      } else if (result === RESULT_SUCCESS) {
        this.snackbarService.openSnackBar("Asignatura Editada", RESULT_SUCCESS);
        console.log(RESULT_SUCCESS);
      }
    });
  }



  deleteSubject(subject: Subject) {
    this.isLoading = true;
    this.subjectStoreService.delete(subject)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(_ => this.snackbarService.openSnackBar('Asignatura Eliminada', RESULT_SUCCESS)
        , err => {
          this.snackbarService.openSnackBar('Error al eliminar Asignatura', RESULT_ERROR);
          console.error("Error deleting subject: " + err);
        });
  }


}


