import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionStorageService } from '../../../../services/session-storage.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { Grade } from '../../../../models/grade';
import { GradeStoreService } from '../../../../services/grade-store.service';
import { User } from '../../../../models/user';
import { UserStoreService } from '../../../../services/user-store.service';
import { SubjectStoreService } from '../../../../services/subject-store.service';
import { Subject } from '../../../../models/subject';
import { tap } from 'rxjs/internal/operators/tap';

@Component({
  selector: 'nx-manager-subject-grades',
  templateUrl: './manager-subject-grades.component.html',
  styleUrls: ['./manager-subject-grades.component.css']
})
export class ManagerSubjectGradesComponent implements OnInit, AfterViewInit {

  student: User;
  subject: Subject;

  // mat table
  displayedColumns = ['grade','title','date'];
  dataSource;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSize = 5;
  pageSizeOptions = [5, 10, 20];
  isDark = this.sessionStorage.isDarkTheme();
  rowClasses: {};
  isLoading: boolean = false;

  studentName;
  sbjId;

  constructor(
    private route: ActivatedRoute, private router: Router, private gradeStoreService: GradeStoreService,
    private userStoreService: UserStoreService, private subjectStoreService: SubjectStoreService,
    private sessionStorage: SessionStorageService, public sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {

    this.dataSource = new MatTableDataSource<Grade[]>();
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    // paramMap re-uses the component
    /*  this.route.paramMap
        .pipe(switchMap(params => this.getFilteredGrades(params.get('username'), params.get('sbjId'))))
        .subscribe();
  
      this.route.paramMap
        .subscribe(params => {
          this.studentName = params.get('username');
          this.sbjId = params.get('sbjId');
        }
        );*/

    // snapshot doesn't re-use the component
    this.studentName = this.route.snapshot.paramMap.get('username');
    this.sbjId = this.route.snapshot.paramMap.get('sbjId');
    this.getFilteredGrades(this.studentName, this.sbjId)
      .subscribe();

    this.gradeStoreService.isLoadingGetGrades$.subscribe(isLoadding => setTimeout(() => this.isLoading = isLoadding));

    //this.gradeStoreService.loadAllGrades();


    this.userStoreService.students$
      .subscribe(data => this.student = data.find(user => user.username === this.studentName));

    this.subjectStoreService.subjects$
      .subscribe(data => this.subject = data.find(s => s.id === this.sbjId));

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

  getFilteredGrades(username: string, subjectid: string): Observable<Grade[]> {
    return this.gradeStoreService.grades$
      .pipe(
        tap(grades => {
          this.dataSource.data = grades.filter(g => (g.student.username.indexOf(username) === 0) && (g.subject.id.indexOf(subjectid) === 0));
        })
      );
  }


  goBack() {
    this.router.navigate(['../../' + this.sbjId], { relativeTo: this.route });
  }



}
