import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Course } from '../../../../models/course';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { CourseStoreService } from '../../../../services/course-store.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SessionStorageService } from '../../../../services/session-storage.service';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { User } from '../../../../models/user';
import { finalize } from 'rxjs/internal/operators/finalize';
import { SnackbarService } from '../../../../services/snackbar.service';
import { RESULT_SUCCESS, RESULT_ERROR, RESULT_ACTION1, RESULT_ACTION2, RESULT_ACTION3, RESULT_CANCELED, RESULT_DETAIL, RESULT_EDIT, RESULT_DELETE, ROLE_MANAGER, ROLE_STUDENT, ROLE_TEACHER, URI_TEACHERS, URI_STUDENTS, URI_MANAGERS } from '../../../../app.config';
import { MatDialog, MatDialogRef } from '@angular/material';
import { shortNameSecondName } from '../../../../shared/functions/shortName';
import { Subscription } from 'rxjs/internal/Subscription';
import { SimpleDialogRefComponent } from '../../../../shared/dialogs/simple-dialog/simple-dialog-ref/simple-dialog-ref.component';
import { CrudUserDialogComponent } from '../../../users/crud-user-dialog/crud-user-dialog.component';
import { CardUserDialogRefComponent } from '../../../users/card-user-dialog/card-user-dialog-ref/card-user-dialog-ref.component';


@Component({
  selector: 'nx-manager-courses-detail',
  templateUrl: './manager-courses-detail.component.html',
  styleUrls: ['./manager-courses-detail.component.css']
})
export class ManagerCoursesDetailComponent implements OnInit, AfterViewInit, OnDestroy {

  courseName: string;
  course: Course;
  chiefTeacher: User;
  listStudents: User[] = [];

  areaRole = ROLE_MANAGER;
  roleManager = ROLE_MANAGER;
  roleStudent = ROLE_STUDENT;
  roleTeacher = ROLE_TEACHER;
  @ViewChild(CrudUserDialogComponent) crudUserDialog: CrudUserDialogComponent;
  
  btnDisabled = true;

 

  // mat table
  displayedColumns = ['firstName', 'crud'];
  dataSource;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSize = 5;
  pageSizeOptions = [5, 10, 20];
  isDark = this.sessionStorage.isDarkTheme();
  rowClasses: {};
  isLoading: boolean = false;

  isThemeDarkSubscription: Subscription;
  isLoadingGetCoursesSubscription: Subscription;
  coursesSubscription: Subscription;

  constructor(
    private route: ActivatedRoute, private router: Router, private courseStoreService: CourseStoreService,
    private sessionStorage: SessionStorageService, public sanitizer: DomSanitizer,
    private snackbarService: SnackbarService, public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Course>();
    this.dataSource.filterPredicate = (user: User, filterValue: string) =>
      (user.firstName.toLowerCase() + ' ' + user.lastName.toLowerCase()).indexOf(filterValue) === 0 ||
      user.firstName.toLowerCase().indexOf(filterValue) === 0 || user.lastName.toLowerCase().indexOf(filterValue) === 0
      || shortNameSecondName(user).toLowerCase().indexOf(filterValue) === 0;

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    // paramMap re-uses the component
    this.coursesSubscription = this.route.paramMap
      .pipe(switchMap(params => {
        this.courseName = params.get('name');
        return this.courseStoreService.courses$
      }))
      .subscribe(courses => {
        let c = courses.find(course => course.name === this.courseName);
        if (c) {
          this.course = c;
          this.chiefTeacher = c.chiefTeacher;
          this.dataSource.data = c.students;
          this.listStudents = this.dataSource.data;
        }
      }
      );

    // snapshot doesn't re-use the component
    /*this.courseName = this.route.snapshot.paramMap.get('name');
    this.courseStoreService.courses$
    .subscribe(courses => {
      let c = courses.find(course => course.name === this.courseName);
      if (c) {
        this.course = c;
        this.chiefTeacher = c.chiefTeacher;
        this.dataSource.data = c.students;
        this.listStudents = this.dataSource.data;
      }
    }); */

    this.isLoadingGetCoursesSubscription = this.courseStoreService.isLoadingGetCourses$.subscribe(isLoadding => setTimeout(() => this.isLoading = isLoadding));

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
    this.isLoadingGetCoursesSubscription.unsubscribe();
    this.coursesSubscription.unsubscribe();
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

  gotoCourses() {
    this.router.navigate(['../'], { relativeTo: this.route });
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




  addStudent(student: User) {
    let list = this.listStudents.slice();
    list.push(student);
    this.listStudents = list;
    this.dataSource.data = this.listStudents;
    this.btnDisabled = false;
  }


  deleteStudent(dialogRef: MatDialogRef<SimpleDialogRefComponent>): void {
    dialogRef.afterClosed().subscribe(result => {
      if (result === RESULT_CANCELED) {
        console.log(RESULT_CANCELED);
      } else if (result === RESULT_ACTION1) {
        console.log(RESULT_ACTION1);
        this.listStudents = this.listStudents.filter(s => s.id !== (dialogRef.componentInstance.obj.id));
        this.dataSource.data = this.listStudents;
        this.btnDisabled = false;
      } else if (result === RESULT_ACTION2) {
        console.log(RESULT_ACTION2);
      } else if (result === RESULT_ACTION3) {
        console.log(RESULT_ACTION3);
      }
    });
  }

  changeTeacher(teacher: User) {
    this.chiefTeacher = teacher;
    this.btnDisabled = false;
  }

  saveCourse() {
    let courseEdit: Course = Object.assign({}, this.course);
    courseEdit.chiefTeacher = this.chiefTeacher;
    courseEdit.students = this.listStudents;

    this.courseStoreService.update(courseEdit)
      .pipe(finalize(() => this.btnDisabled = true))
      .subscribe(_ => this.snackbarService.openSnackBar('Curso Actualizado', RESULT_SUCCESS)
        , err => {
          this.snackbarService.openSnackBar('Error al Actualizar Curso', RESULT_ERROR);
          console.error("Error editing Course: " + err);
        });

  }




}
