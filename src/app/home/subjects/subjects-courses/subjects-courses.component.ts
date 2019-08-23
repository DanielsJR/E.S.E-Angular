import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ROLE_MANAGER, ROLE_TEACHER } from '../../../app.config';
import { User } from '../../../models/user';
import { Course } from '../../../models/course';
import { SessionStorageService } from '../../../services/session-storage.service';
import { CourseStoreService } from '../../../services/course-store.service';
import { UserLoggedService } from '../../../services/user-logged.service';
import { SubjectStoreService } from '../../../services/subject-store.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from '../../../models/subject';


@Component({
  selector: 'nx-subjects-courses',
  templateUrl: './subjects-courses.component.html',
  styleUrls: ['./subjects-courses.component.css']
})
export class SubjectsCoursesComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() areaRole: string;
  roleManager = ROLE_MANAGER;
  roleTeacher = ROLE_TEACHER;

  // mat table
  displayedColumns = ['name', 'crud'];
  dataSource;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSize = 5;
  pageSizeOptions = [5, 10, 20];
  isDark: boolean;
  isLoading: boolean = false;

  isThemeDarkSubscription: Subscription;
  coursesSubscription: Subscription;
  isLoadingGetCoursesSubscription: Subscription;

  user: User;

  constructor(private sessionStorage: SessionStorageService, private userLoggedService: UserLoggedService,
    private subjectStoreService: SubjectStoreService, private courseStoreService: CourseStoreService, public sanitizer: DomSanitizer) {

  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Course>();

    if (this.areaRole === this.roleManager) {
      this.isLoadingGetCoursesSubscription = this.courseStoreService.isLoadingGetCourses$.subscribe(isLoadding => setTimeout(() => this.isLoading = isLoadding));
      this.coursesSubscription = this.courseStoreService.courses$.subscribe(data => this.dataSource.data = data);

    } else if (this.areaRole === this.roleTeacher) {
      this.isLoadingGetCoursesSubscription = this.subjectStoreService.isLoadingGetSubjects$.subscribe(isLoadding => setTimeout(() => this.isLoading = isLoadding));

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
              this.dataSource = teacherSubjects.map(s => s.course).filter((c, i, cs) => cs.findIndex(v => v.id === c.id) === i);
            }
          });


      } else {
        this.coursesSubscription = this.subjectStoreService.subjects$
          .subscribe(subjects => this.dataSource = subjects.map(s => s.course).filter((c, i, cs) => cs.findIndex(v => v.id === c.id) === i));
      }

    } else {
      console.error('No area role');
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
