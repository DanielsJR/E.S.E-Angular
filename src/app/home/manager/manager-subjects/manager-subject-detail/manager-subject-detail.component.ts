import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Course } from '../../../../models/course';
import { User } from '../../../../models/user';
import { MatSort, MatPaginator, MatDialog, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseStoreService } from '../../../../services/course-store.service';
import { SessionStorageService } from '../../../../services/session-storage.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SnackbarService } from '../../../../services/snackbar.service';
import { shortNameSecondName } from '../../../../shared/functions/shortName';
import { switchMap, tap, finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RESULT_SUCCESS, RESULT_ERROR } from '../../../../app.config';
import { SubjectStoreService } from '../../../../services/subject-store.service';
import { Subject } from '../../../../models/subject';

@Component({
  selector: 'nx-manager-subject-detail',
  templateUrl: './manager-subject-detail.component.html',
  styleUrls: ['./manager-subject-detail.component.css']
})
export class ManagerSubjectDetailComponent implements OnInit, AfterViewInit {

  courseName: string;
  subject: Subject;
  course: Course;
  teacher: User;
  listStudents: User[] = [];

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

  constructor(
    private route: ActivatedRoute, private router: Router, private subjectStoreService: SubjectStoreService,
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
    this.route.paramMap
      .pipe(switchMap(params => this.getSubject(params.get('id'))))
      .subscribe();

    // snapshot doesn't re-uses the component
    /* this.getCurso(this.route.snapshot.paramMap.get('id'))
    .subscribe();*/

    this.subjectStoreService.isLoadingGetSubjects$.subscribe(isLoadding => setTimeout(() => this.isLoading = isLoadding));

    this.sessionStorage.isThemeDark$.subscribe(isDark => {
      this.isDark = isDark;
      this.setRowClass();
    });

    this.setRowClass();

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
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

  getSubject(id): Observable<Subject[]> {
    return this.subjectStoreService.subjects$
      .pipe(
        tap(subjects => {
          this.subject = subjects.find(s => s.id === id);
          if (this.subject) {
            this.teacher = this.subject.teacher;
            this.dataSource.data = this.subject.course.students;
            this.listStudents = this.dataSource.data;
          }
        })
      );
  }


  goBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }



}
