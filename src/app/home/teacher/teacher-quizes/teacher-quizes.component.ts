import { Component, OnInit, ViewChild } from '@angular/core';
import { QuizBackendService } from '../../../services/quiz-backend.service';
import { Quiz } from '../../../models/quiz';
import { UserLoggedService } from '../../../services/user-logged.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionStorageService } from '../../../services/session-storage.service';
import { MatDialog, MatTableDataSource, MatSort, MatPaginator, MatDialogRef } from '@angular/material';
import { SnackbarService } from '../../../services/snackbar.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs/internal/Subscription';
import { SimpleDialogRefComponent } from '../../../shared/dialogs/simple-dialog/simple-dialog-ref/simple-dialog-ref.component';
import { RESULT_CANCELED, RESULT_ACTION1, RESULT_ACTION2, RESULT_ACTION3, RESULT_SUCCESS, RESULT_ERROR } from '../../../app.config';
import { IsLoadingService } from '../../../services/isLoadingService.service';
import { finalize } from 'rxjs/internal/operators/finalize';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'nx-teacher-quizes',
  templateUrl: './teacher-quizes.component.html',
  styleUrls: ['./teacher-quizes.component.css']
})
export class TeacherQuizesComponent implements OnInit {

  displayedColumns = ['title', 'crud'];
  dataSource: MatTableDataSource<Quiz>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSize = 5;
  pageSizeOptions = [5, 10, 20];
  isDark: boolean;
  isLoading: boolean = false;
  isThemeDarkSubscription: Subscription;

  constructor(private quizBackendService: QuizBackendService,
    private sessionStorage: SessionStorageService,
    public dialog: MatDialog, private snackbarService: SnackbarService, public sanitizer: DomSanitizer,
    private isLoadingService: IsLoadingService, ) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Quiz>();
    this.isLoading = true;
    this.quizBackendService.getQuizes()
      .pipe(finalize(() => setTimeout(() => this.isLoading = false)))
      .subscribe(qs => this.dataSource.data = qs);

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.isThemeDarkSubscription = this.sessionStorage.isThemeDark$.subscribe(isDark => this.isDark = isDark);
  }


  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.isThemeDarkSubscription.unsubscribe();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }


  deleteQuizDialog(dialogRef: MatDialogRef<SimpleDialogRefComponent>) {
    dialogRef.afterClosed().subscribe(result => {
      if (result === RESULT_CANCELED) {
        console.log(RESULT_CANCELED);
      } else if (result === RESULT_ACTION1) {
        console.log(RESULT_ACTION1);
        this.deleteQuiz(dialogRef.componentInstance.obj);
      } else if (result === RESULT_ACTION2) {
        console.log(RESULT_ACTION2);
      } else if (result === RESULT_ACTION3) {
        console.log(RESULT_ACTION3);
      }
    });
  }

  deleteQuizFromDataSource(id: string) {
    let quizes: Quiz[] = this.dataSource.data.filter(q => q.id !== (id));
    this.dataSource.data = quizes;
  }

  deleteQuiz(quiz: Quiz) {
    this.isLoadingService.isLoadingTrue();
    this.quizBackendService.delete(quiz)
      .pipe(finalize(() => this.isLoadingService.isLoadingFalse()))
      .subscribe(quiz => {
        this.deleteQuizFromDataSource(quiz.id);
        this.snackbarService.openSnackBar('Prueba Eliminda', RESULT_SUCCESS);
      }
        , error => {
          if (error instanceof HttpErrorResponse) {
            this.snackbarService.openSnackBar(error.error.message, RESULT_ERROR);

          } else {
            this.snackbarService.openSnackBar('Error al Eliminar Prueba', RESULT_ERROR);

          }
        });

  }

}
