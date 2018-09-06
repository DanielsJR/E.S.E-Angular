import { Component, OnInit, ViewChild } from '@angular/core';
import { Course } from '../../../../models/course';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { Observable } from 'rxjs/internal/Observable';
import { CourseStoreService } from '../../../../services/course-store.service';
import { map } from 'rxjs/internal/operators/map';
import { of } from 'rxjs/internal/observable/of';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SessionStorageService } from '../../../../services/session-storage.service';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'nx-manager-courses-detail',
  templateUrl: './manager-courses-detail.component.html',
  styleUrls: ['./manager-courses-detail.component.css']
})
export class ManagerCoursesDetailComponent implements OnInit {

  course$: Observable<Course>;
  courseName = "";

  // mat table
  displayedColumns = ['student', 'crud'];
  dataSource;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSize = 20;
  pageSizeOptions = [5, 10, 20];
  isDark = this.sessionStorage.isDarkTheme();
  rowClasses: {};

  constructor(
    private route: ActivatedRoute, private router: Router,
    private courseStoreService: CourseStoreService,
    private sessionStorage: SessionStorageService,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();

    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => of(params.get('name')))
    ).subscribe(d => this.courseName = d)
    console.log("Curso nombre: " + this.courseName);

    this.course$ = this.courseStoreService.courses$.pipe(
      map(courses => courses.find(c => c.name === this.courseName))
    );

    this.dataSource = this.courseStoreService.courses$.pipe(
      map(courses => courses.find(c => c.name === this.courseName).students)
    );

    //this.courseStoreService.getCourses(2018);

    this.sessionStorage.isThemeDark$.subscribe(isDark => {
      this.isDark = isDark;
      this.setRowClass();
    });

    this.setRowClass();

  }



  setRowClass() {
    this.rowClasses = {
      'fila': !this.isDark,
      'fila-dark': this.isDark
    };
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  gotoCourses(course: Course) {
    let courseName = course ? course.name : null;
    // Pass along the hero id if available
    // so that the HeroList component can select that hero.
    // Include a junk 'foo' property for fun.
    this.router.navigate(['home/manager/courses', { name: courseName, foo: 'foo' }]);
  }


}
