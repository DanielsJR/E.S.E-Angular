import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ROLE_MANAGER, ROLE_TEACHER } from '../../../app.config';
import { User } from '../../../models/user';
import { Course } from '../../../models/course';
import { Subscription, empty, forkJoin, of, Observable } from 'rxjs';
import { SessionStorageService } from '../../../services/session-storage.service';
import { SubjectStoreService } from '../../../services/subject-store.service';
import { CourseStoreService } from '../../../services/course-store.service';
import { UserLoggedService } from '../../../services/user-logged.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '../../../services/snackbar.service';
import { DomSanitizer } from '@angular/platform-browser';
import { switchMap, finalize, tap } from 'rxjs/operators';
import { Subject } from '../../../models/subject';
import { CourseBackendService } from '../../../services/course-backend.service';
import { SubjectBackendService } from '../../../services/subject-backend.service';
import { take } from 'rxjs/internal/operators/take';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { rowAnimation } from '../../../shared/animations/animations';

@Component({
  selector: 'nx-student-subjects',
  templateUrl: './student-subjects.component.html',
  styleUrls: ['./student-subjects.component.css'],
  animations: [rowAnimation]
})
export class StudentSubjectsComponent implements OnInit {

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

  isLoadingGetSubjectsSubscription: Subscription;
  isThemeDarkSubscription: Subscription;
  subjectsSubscription: Subscription;
  isStlDisabled: boolean = true;
  isSeachDisabled: boolean = true;

  @ViewChild('matSelect') matSelect: MatSelect;
  courseId: string;

  constructor(private sessionStorage: SessionStorageService,
    private subjectStoreService: SubjectStoreService,
    private route: ActivatedRoute, private router: Router,
    public dialog: MatDialog, private snackbarService: SnackbarService, public sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Subject>();
    this.subjectsSubscription = this.subjectStoreService.subjects$
      .subscribe(subjects => {
        this.dataSource.data = subjects;
        if (subjects.length) {
          this.isSeachDisabled = false;
        }
      });


    this.isLoadingGetSubjectsSubscription = this.subjectStoreService.isLoadingGetSubjects$.subscribe(isLoadding => setTimeout(() => this.isLoading = isLoadding));

    this.isThemeDarkSubscription = this.sessionStorage.isThemeDark$.subscribe(isDark => this.isDark = isDark);

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  }


  ngOnDestroy(): void {
    this.isLoadingGetSubjectsSubscription.unsubscribe();
    this.isThemeDarkSubscription.unsubscribe();
    this.subjectsSubscription.unsubscribe();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }



}
