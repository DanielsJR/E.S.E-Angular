import { Component, OnInit, ViewChild, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogConfig, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs/internal/operators/finalize';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { SubjectsCrudDialogRefComponent } from './subjects-crud-dialog-ref/subjects-crud-dialog-ref.component';
import { MatSort, MatPaginator, MatSelect } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from '../../models/subject';
import { ROLE_MANAGER, ROLE_TEACHER, RESULT_CANCELED, RESULT_ERROR, RESULT_SUCCESS, RESULT_ACTION1, RESULT_ACTION2, RESULT_ACTION3 } from '../../app.config';
import { User } from '../../models/user';
import { SessionStorageService } from '../../services/session-storage.service';
import { SubjectStoreService } from '../../services/subject-store.service';
import { UserLoggedService } from '../../services/user-logged.service';
import { SnackbarService } from '../../services/snackbar.service';
import { Course } from '../../models/course';
import { CourseStoreService } from '../../services/course-store.service';
import { SimpleDialogRefComponent } from '../../shared/dialogs/simple-dialog/simple-dialog-ref/simple-dialog-ref.component';


@Component({
  selector: 'nx-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css']
})
export class SubjectsComponent implements OnInit, AfterViewInit, OnDestroy {


  @Input() areaRole: string;
  roleManager = ROLE_MANAGER;
  roleTeacher = ROLE_TEACHER;

  user: User;
  courseName: string;
  course: Course;

  courses: Course[];

  // mat table
  displayedColumns = ['name', 'crud'];
  dataSource;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSize = 5;
  pageSizeOptions = [5, 10, 20];
  rowClasses: {};
  isDark: boolean;
  isLoading: boolean = false;

  subjectsSubscription: Subscription;
  isLoadingGetSubjectsSubscription: Subscription;
  isThemeDarkSubscription: Subscription;
  coursesSubscription: Subscription;

  @ViewChild('matSelect') matSelect: MatSelect;


  constructor(private sessionStorage: SessionStorageService,
    private subjectStoreService: SubjectStoreService, private courseStoreService: CourseStoreService,
    private userLoggedService: UserLoggedService, private route: ActivatedRoute, private router: Router,
    public dialog: MatDialog, private snackbarService: SnackbarService, public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Subject>();
    this.isLoadingGetSubjectsSubscription = this.subjectStoreService.isLoadingGetSubjects$.subscribe(isLoadding => setTimeout(() => this.isLoading = isLoadding));




    if (this.areaRole === this.roleManager) {

      this.coursesSubscription = this.courseStoreService.courses$.subscribe(data => this.courses = data);

      this.subjectsSubscription = this.matSelect.valueChange
        .pipe(
          switchMap(value => {
            this.courseName = value;
            return this.courseStoreService.courses$;
          }), switchMap(cs => {
            this.course = cs.find(c => c.name.indexOf(this.courseName) === 0);
            return this.subjectStoreService.subjects$;
          })
        )
        .subscribe(subjects => {
          let filteredSubjects = subjects.filter(sj => sj.course.name.indexOf(this.courseName) === 0)
          this.dataSource.data = filteredSubjects;
        });


    } else if (this.areaRole === this.roleTeacher) {

      if (this.userLoggedService.isManager) {

        this.coursesSubscription = this.userLoggedService.userLogged$
          .pipe(
            switchMap(user => {
              this.user = user;
              return this.subjectStoreService.subjects$
            }))
          .subscribe(subjects => {
            if (subjects) {
              let teacherSubjects = subjects.filter(s => s.teacher.id.indexOf(this.user.id) === 0);
              this.courses = teacherSubjects.map(s => s.course).filter((c, i, cs) => cs.findIndex(v => v.id === c.id) === i);
            }
          });

        this.subjectsSubscription = this.userLoggedService.userLogged$
          .pipe(
            switchMap(user => {
              this.user = user;
              return this.matSelect.valueChange;
            }),
            switchMap((value: any) => {
              this.courseName = value;
              return this.subjectStoreService.subjects$
            })

          )
          .subscribe(subjects => {
            let filteredSubjects = subjects.filter(sj => sj.teacher.username.indexOf(this.user.username) === 0 && sj.course.name.indexOf(this.courseName) === 0)
            this.dataSource.data = filteredSubjects;
          });

      } else {

        this.coursesSubscription = this.subjectStoreService.subjects$
          .subscribe(subjects => this.courses = subjects.map(s => s.course).filter((c, i, cs) => cs.findIndex(v => v.id === c.id) === i));


        this.subjectsSubscription = this.matSelect.valueChange
          .pipe(switchMap(value => {
            this.courseName = value;
            return this.subjectStoreService.subjects$;
          }
          ))
          .subscribe(subjects => {
            let filteredSubjects = subjects.filter(sj => sj.course.name.indexOf(this.courseName) === 0)
            this.dataSource.data = filteredSubjects;
          });

      }

    } else {
      console.error('Area role: ', this.areaRole);
    }


    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.isThemeDarkSubscription = this.sessionStorage.isThemeDark$.subscribe(isDark => this.isDark = isDark);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;


  }

  ngOnDestroy(): void {
    this.subjectsSubscription.unsubscribe();
    this.isLoadingGetSubjectsSubscription.unsubscribe();
    this.isThemeDarkSubscription.unsubscribe();
    this.coursesSubscription.unsubscribe();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }


  openDialogCreate(): void {
    let subject: Subject = new Subject();
    subject.course = this.course;
    let data = {
      subject: subject,
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

  deleteSubject(dialogRef: MatDialogRef<SimpleDialogRefComponent>): void {
    dialogRef.afterClosed().subscribe(result => {
      if (result === RESULT_CANCELED) {
        console.log(RESULT_CANCELED);
      } else if (result === RESULT_ACTION1) {
        console.log(RESULT_ACTION1);

        this.isLoading = true;
        this.subjectStoreService.delete(dialogRef.componentInstance.obj)
          .pipe(finalize(() => this.isLoading = false))
          .subscribe(_ => this.snackbarService.openSnackBar('Asignatura Eliminada', RESULT_SUCCESS)
            , err => {
              this.snackbarService.openSnackBar('Error al eliminar Asignatura', RESULT_ERROR);
              console.error("Error deleting subject: " + err);
            });

      } else if (result === RESULT_ACTION2) {
        console.log(RESULT_ACTION2);
      } else if (result === RESULT_ACTION3) {
        console.log(RESULT_ACTION3);
      }
    });
  }


}


