import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource, MatSort, MatPaginator, MatPaginatorIntl, MatSnackBar, MatButton } from '@angular/material';
import { ROLE_ADMIN, ROLE_MANAGER, ROLE_TEACHER, ROLE_STUDENT, LOCAL_STORAGE_TOKEN_KEY, URI_MANAGERS, URI_TEACHERS, URI_STUDENTS } from '../../app.config';
import { User } from '../../models/user';
import { GetUsersDialogRefComponent } from './get-users-dialog-ref/get-users-dialog-ref.component';
import { DialogService } from '../../services/dialog.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { ManagerStoreService } from '../../services/manger-store.service';
import { TeacherStoreService } from '../../services/teacher-store.service';
import { StudentStoreService } from '../../services/student-store.service';

@Component({
  selector: 'nx-get-users',
  templateUrl: './get-users.component.html',
  styleUrls: ['./get-users.component.css']
})

export class GetUsersComponent implements OnInit, AfterViewInit {

  // mat table
  users: User[];
  displayedColumns = ['username', 'crud'];
  dataSource;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // mat dialog
  user: User;
  roles: string[];
  isDark = this.localstorage.getIsDarkTheme();
  styleClasses: {};
  @Input() uriRole;


  constructor(private managerStoreService: ManagerStoreService,
    private teacherStoreService: TeacherStoreService,
    private studentStoreService: StudentStoreService,
    private dialogService: DialogService,
    private localstorage: LocalStorageService,
    public snackBar: MatSnackBar) { }

  ngOnInit() {
    console.log('OnInit called');
    console.log('uriRole:' + this.uriRole);
    this.dialogService.uriRole = this.uriRole;
    this.dataSource = new MatTableDataSource();


    if (this.uriRole === URI_MANAGERS) {
      this.managerStoreService.success$.subscribe(message => setTimeout(() => this.openSnackBar(message, 'info')));
      this.managerStoreService.error$.subscribe(error => setTimeout(() => this.openSnackBar(error, 'error')));
      this.managerStoreService.users$.subscribe(data => {
        if (data != null && data.length === 0 && this.localstorage.isStored(LOCAL_STORAGE_TOKEN_KEY)) {
          console.log('store clean...getting users');
          this.managerStoreService.getUsers();
        }
        this.dataSource.data = data;
      }
      );

    } else if (this.uriRole === URI_TEACHERS) {
      this.teacherStoreService.success$.subscribe(message => setTimeout(() => this.openSnackBar(message, 'info')));
      this.teacherStoreService.error$.subscribe(error => setTimeout(() => this.openSnackBar(error, 'error')));
      this.teacherStoreService.users$.subscribe(data => {
        if (data != null && data.length === 0 && this.localstorage.isStored(LOCAL_STORAGE_TOKEN_KEY)) {
          console.log('store clean...getting users');
          this.teacherStoreService.getUsers();
        }
        this.dataSource.data = data;
      }
      );
    } else if (this.uriRole === URI_STUDENTS) {
      this.studentStoreService.success$.subscribe(message => setTimeout(() => this.openSnackBar(message, 'info')));
      this.studentStoreService.error$.subscribe(error => setTimeout(() => this.openSnackBar(error, 'error')));
      this.studentStoreService.users$.subscribe(data => {
        if (data != null && data.length === 0 && this.localstorage.isStored(LOCAL_STORAGE_TOKEN_KEY)) {
          console.log('store clean...getting users');
          this.studentStoreService.getUsers();
        }
        this.dataSource.data = data;
      }
      );
    }


    this.localstorage.isThemeDark$.subscribe(
      isDark => {
        this.isDark = isDark;
        this.setDarkClass();
      }
    );
    this.setDarkClass();

  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
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

 private setDialogService(): void {
    this.dialogService.obj = this.user;
    this.dialogService.inputDialogRef = GetUsersDialogRefComponent;
  }

  openDialogDetail(user: User): void {
    this.user = user;
    this.setDialogService();
    this.dialogService.openDialogDetail();
  }

  openDialogCreate(): void {
    this.user = new User();
    this.setDialogService();
    this.dialogService.openDialogCreate();
  }

  openDialogEdit(user: User): void {
    this.user = user;
    this.setDialogService();
    this.dialogService.openDialogEdit();
  }

  openDialogDelete(user: User): void {
    this.user = user;
    this.setDialogService();
    this.dialogService.openDialogDelete();
  }

  setDarkClass() {
    // [ngClass]="{'fila': !isDark, 'fila-dark': isDark}" other way in the template

    // CSS classes: added/removed per current state of component properties
    this.styleClasses = {
      'fila': !this.isDark,
      'fila-dark': this.isDark
    };
  }

}

export class MatPaginatorIntlSpa extends MatPaginatorIntl {
  itemsPerPageLabel = 'Items por pagina:';
  nextPageLabel = 'Página Siguiente';
  previousPageLabel = 'Página Anterior';

  /** A label for the range of items within the current page and the length of the whole list. */
  getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length == 0 || pageSize == 0) {
      return `0 de ${length}`;
    } length = Math.max(length, 0); const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} de ${length}`;
  }
}


