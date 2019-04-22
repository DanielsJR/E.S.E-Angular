import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { Subject } from '../../../models/subject';
import { ROLE_MANAGER, ROLE_TEACHER } from '../../../app.config';
import { User } from '../../../models/user';
import { SessionStorageService } from '../../../services/session-storage.service';
import { CourseStoreService } from '../../../services/course-store.service';
import { UserLoggedService } from '../../../services/user-logged.service';
import { SubjectStoreService } from '../../../services/subject-store.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SnackbarService } from '../../../services/snackbar.service';
import { Course } from '../../../models/course';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'nx-subjects-courses',
  templateUrl: './subjects-courses.component.html',
  styleUrls: ['./subjects-courses.component.css']
})
export class SubjectsCoursesComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() areaRole;
  roleManager = ROLE_MANAGER;
  roleTeacher = ROLE_TEACHER;

  // mat table

  displayedColumns = ['name', 'crud'];
  dataSource;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSize = 5;
  pageSizeOptions = [5, 10, 20];
  rowClasses: {};
  isDark;
  isLoading: boolean = false;

  isThemeDarkSubscription: Subscription;
  coursesSubscription: Subscription;
  isLoadingGetCoursesSubscription: Subscription;
  user: User;
  //filteredCourses: Course[];
  filteredSubjects: Subject[];

  constructor(private sessionStorage: SessionStorageService,
    private courseStoreService: CourseStoreService, private userLoggedService: UserLoggedService,
    private subjectStoreService: SubjectStoreService,
    public sanitizer: DomSanitizer, private snackbarService: SnackbarService) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Course>();



    if (this.areaRole === this.roleManager) {
      this.isLoadingGetCoursesSubscription = this.courseStoreService.isLoadingGetCourses$.subscribe(isLoadding => setTimeout(() => this.isLoading = isLoadding));
      this.coursesSubscription = this.courseStoreService.courses$.subscribe(data => this.dataSource.data = data);

    } else if (this.areaRole === this.roleTeacher) {
      this.isLoadingGetCoursesSubscription = this.subjectStoreService.isLoadingGetSubjects$.subscribe(isLoadding => setTimeout(() => this.isLoading = isLoadding));
      this.coursesSubscription = this.userLoggedService.userLogged$
        .pipe(
          switchMap(user => {
            this.user = user;
            return this.subjectStoreService.subjects$
          })
        ).subscribe(sjs => {
          this.filteredSubjects = sjs.filter(s => s.teacher.id.indexOf(this.user.id) === 0)

          let courses: Course[] = [];
          
          this.filteredSubjects.forEach((item, index) => courses[index] = item.course);

          courses = courses.filter((item, index, self) =>
            index === self.findIndex((c) => (
              c.id === item.id
            ))
          )

          this.dataSource = courses;
        }

        );
    }

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.isThemeDarkSubscription = this.sessionStorage.isThemeDark$.subscribe(isDark => this.isDark = isDark);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.isThemeDarkSubscription.unsubscribe();
    this.coursesSubscription.unsubscribe();
    this.isLoadingGetCoursesSubscription.unsubscribe();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}
