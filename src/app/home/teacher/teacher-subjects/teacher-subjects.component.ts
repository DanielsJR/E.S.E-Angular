import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatDialog, MatTableDataSource } from '@angular/material';
import { SessionStorageService } from '../../../services/session-storage.service';
import { SubjectStoreService } from '../../../services/subject-store.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from '../../../models/subject';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/internal/operators/tap';
import { UserLoggedService } from '../../../services/user-logged.service';
import { User } from '../../../models/user';
import { switchMap } from 'rxjs/internal/operators/switchMap';


@Component({
  selector: 'nx-teacher-subjects',
  templateUrl: './teacher-subjects.component.html',
  styleUrls: ['./teacher-subjects.component.css']
})
export class TeacherSubjectsComponent implements OnInit, AfterViewInit {

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

  subjects: Subject[] = [];
  filteredSubjects$: Observable<Subject[]>;
  teacher: User;

  constructor(private sessionStorage: SessionStorageService, private subjectStoreService: SubjectStoreService,
    public dialog: MatDialog, private snackbarService: SnackbarService, public sanitizer: DomSanitizer,
    private userLoggedService: UserLoggedService) { }

  ngOnInit() {

    this.dataSource = new MatTableDataSource<Subject[]>();

    this.userLoggedService.userLogged$
      .pipe(switchMap(user => this.getFilteredSubjects(user.username)))
      .subscribe();

    this.subjectStoreService.isLoadingGetSubjects$.subscribe(isLoadding => setTimeout(() => this.isLoading = isLoadding));

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.sessionStorage.isThemeDark$.subscribe(isDark => {
      this.isDark = isDark;
      this.setRowClass();
    });

    this.setRowClass();
  }


  getFilteredSubjects(teacherUsername: string): Observable<Subject[]> {
    return this.subjectStoreService.subjects$
      .pipe(
        tap(subjects => {
          this.dataSource.data = subjects.filter(sj => sj.teacher.username.indexOf(teacherUsername) === 0);
        })
      );
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
}
