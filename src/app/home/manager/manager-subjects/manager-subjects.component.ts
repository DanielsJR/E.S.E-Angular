import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort } from '../../../../../node_modules/@angular/material/sort';
import { MatPaginator } from '../../../../../node_modules/@angular/material/paginator';
import { DomSanitizer } from '../../../../../node_modules/@angular/platform-browser';
import { SessionStorageService } from '../../../services/session-storage.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from '../../../models/subject';
import { SubjectStoreService } from '../../../services/subject-store.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { RESULT_SUCCESS, RESULT_CANCELED, RESULT_ERROR } from '../../../app.config';
import { ManagerSubjectsCrudDialogRefComponent } from './manager-subjects-crud-dialog-ref/manager-subjects-crud-dialog-ref.component';

@Component({
  selector: 'nx-manager-subjects',
  templateUrl: './manager-subjects.component.html',
  styleUrls: ['./manager-subjects.component.css']
})
export class ManagerSubjectsComponent implements OnInit, AfterViewInit {

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

  constructor(private sessionStorage: SessionStorageService, private subjectStoreService: SubjectStoreService,
    public dialog: MatDialog, private snackbarService: SnackbarService, public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Subject>();
    this.subjectStoreService.isLoadingGetSubjects$.subscribe(isLoadding => setTimeout(() => this.isLoading = isLoadding));
    this.subjectStoreService.subjects$.subscribe(data => this.dataSource.data = data);

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

  openDialogCreate(): void {
    let data = {
        user: new Subject,
        type: 'create',
        
    };

    let config = new MatDialogConfig();
    config.data = data;
    config.panelClass = 'dialogService';
    config.width = '700px';
    config.disableClose = true;

    let dialogRef = this.dialog.open(ManagerSubjectsCrudDialogRefComponent, config);
    dialogRef.afterClosed().subscribe(result => {
        if (result === RESULT_CANCELED) {
            console.log(RESULT_CANCELED);
        } else if (result === RESULT_ERROR) {
            this.snackbarService.openSnackBar("Error al Crear Asignatura", RESULT_ERROR);
            console.error(RESULT_ERROR);
        } else if (result === RESULT_SUCCESS) {
            this.snackbarService.openSnackBar("Asignatura Creada", RESULT_SUCCESS);
            console.log(RESULT_SUCCESS);
        }
    });
}


}
