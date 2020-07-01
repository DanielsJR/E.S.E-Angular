import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ROLE_MANAGER, ROLE_TEACHER } from '../../../app.config';
import { User } from '../../../models/user';
import { Course } from '../../../models/course';
import { SessionStorageService } from '../../../services/session-storage.service';
import { SubjectStoreService } from '../../../services/subject-store.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '../../../services/snackbar.service';
import { Subject } from '../../../models/subject';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { rowAnimation } from '../../../shared/animations/animations';
import { Subscription } from 'rxjs/internal/Subscription';

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
  isLoading: boolean = false;

  isStlDisabled: boolean = true;
  isSeachDisabled: boolean = true;

  private subscriptions = new Subscription();

  @ViewChild('matSelect') matSelect: MatSelect;
  courseId: string;

  constructor(private sessionStorage: SessionStorageService,
    private subjectStoreService: SubjectStoreService,
    private route: ActivatedRoute, private router: Router,
    public dialog: MatDialog, private snackbarService: SnackbarService,
  ) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Subject>();
    this.subscriptions.add(this.subjectStoreService.subjects$
      .subscribe(subjects => {
        this.dataSource.data = subjects;
        if (subjects.length) {
          this.isSeachDisabled = false;
        }
      }));


    this.subscriptions.add(this.subjectStoreService.isLoadingGetSubjects$.subscribe(isLoadding => this.isLoading = isLoadding));

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.subscriptions.add(this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0));
  }


  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }



}
