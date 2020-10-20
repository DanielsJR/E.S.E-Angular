import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { QuizBackendService } from '../../../services/quiz-backend.service';
import { Quiz } from '../../../models/quiz';
import { UserLoggedService } from '../../../services/user-logged.service';
import { SessionStorageService } from '../../../services/session-storage.service';
import { SnackbarService } from '../../../shared/snackbars-ref/snackbar.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { SimpleDialogRefComponent } from '../../../shared/dialogs/simple-dialog/simple-dialog-ref/simple-dialog-ref.component';
import { RESULT_CANCELED, RESULT_ACTION1, RESULT_ACTION2, RESULT_ACTION3, RESULT_ERROR, RESULT_SUCCEED, QUIZ_DELETE_SUCCEED, QUIZ_DELETE_ERROR, QUIZ_GET_ERROR, SIMPLE_DIALOG_CLASSIC } from '../../../app.config';
import { IsLoadingService } from '../../../services/isLoadingService.service';
import { finalize } from 'rxjs/internal/operators/finalize';
import { HttpErrorResponse } from '@angular/common/http';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { take } from 'rxjs/internal/operators/take';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { rowAnimation } from '../../../shared/animations/animations';
import { User } from '../../../models/user';

@Component({
  selector: 'nx-teacher-quizes',
  templateUrl: './teacher-quizes.component.html',
  styleUrls: ['./teacher-quizes.component.css'],
  animations: [rowAnimation]
})

export class TeacherQuizesComponent implements OnInit {

  displayedColumns = ['title', 'crud'];
  dataSource = new MatTableDataSource<Quiz>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSize = 5;
  pageSizeOptions = [5, 10, 20];
  isLoading: boolean = false;
  private subscriptions = new Subscription();

  simpleDialogDeleteType = SIMPLE_DIALOG_CLASSIC;
  userLogged: User;

  constructor(private quizBackendService: QuizBackendService,
    public dialog: MatDialog, private snackbarService: SnackbarService,
    private isLoadingService: IsLoadingService, private userLoggedService: UserLoggedService,
    private cdRef: ChangeDetectorRef,) { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.subscriptions.add(this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0));
    this.setDataSource();

    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  setDataSource() {
    this.subscriptions.add(this.userLoggedService.userLogged$
      .pipe(
        switchMap(user => {
          this.userLogged = user;
          this.isLoading = true;
          return this.quizBackendService.getTeacherQuizes(user?.username);
        }),
        take(1),
        finalize(() => this.isLoading = false)
      )
      .subscribe(qs => { this.dataSource.data = qs }
        , err => this.snackbarService.openSnackBar((err?.error?.errors) ? err.error.errors : QUIZ_GET_ERROR, RESULT_ERROR)
      ));
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  deleteQuizDialog(dialogRef: MatDialogRef<SimpleDialogRefComponent>) {
    dialogRef.afterClosed().subscribe(result => {
      if (result === RESULT_CANCELED) console.log(RESULT_CANCELED);
      else if (result === RESULT_ACTION1) {
        console.log(RESULT_ACTION1);
        this.deleteQuiz(dialogRef.componentInstance.obj);
      } else if (result === RESULT_ACTION2) console.log(RESULT_ACTION2);
      else if (result === RESULT_ACTION3) console.log(RESULT_ACTION3);

    });
  }

  deleteQuizFromDataSource(id: string) {
    let quizes: Quiz[] = this.dataSource.data.filter(q => q.id !== (id));
    this.dataSource.data = quizes;
  }

  deleteQuiz(quiz: Quiz) {
    this.isLoadingService.isLoadingTrue();
    this.subscriptions.add(this.quizBackendService.delete(quiz, this.userLogged.username)
      .pipe(finalize(() => this.isLoadingService.isLoadingFalse()))
      .subscribe(quiz => {
        this.deleteQuizFromDataSource(quiz.id);
        this.snackbarService.openSnackBar(QUIZ_DELETE_SUCCEED, RESULT_SUCCEED);
      }
        , err => this.snackbarService.openSnackBar((err?.error?.errors) ? err.error.errors : QUIZ_DELETE_ERROR, RESULT_ERROR)
      ));
  }

}
