import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatTableDataSource, MatSort, MatPaginator, MatPaginatorIntl, MatSnackBar, MatButton, MatDialogConfig } from '@angular/material';
import { ROLE_ADMIN, ROLE_MANAGER, ROLE_TEACHER, ROLE_STUDENT, LOCAL_STORAGE_TOKEN_KEY, URI_MANAGERS, URI_TEACHERS, URI_STUDENTS, ROLE_ADMIN_SPANISH, ROLE_MANAGER_SPANISH, ROLE_TEACHER_SPANISH, ROLE_STUDENT_SPANISH } from '../../app.config';
import { User } from '../../models/user';
import { GetUsersDialogRefComponent } from './get-users-dialog-ref/get-users-dialog-ref.component';
import { DialogService } from '../../services/dialog.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { ManagerStoreService } from '../../services/manger-store.service';
import { TeacherStoreService } from '../../services/teacher-store.service';
import { StudentStoreService } from '../../services/student-store.service';

import { DomSanitizer } from '@angular/platform-browser';
import { ImageUserDialogRefComponent } from './image-user-dialog-ref/image-user-dialog-ref.component';

@Component({
  selector: 'nx-get-users',
  templateUrl: './get-users.component.html',
  styleUrls: ['./get-users.component.css']
})

export class GetUsersComponent implements OnInit, AfterViewInit {

  privilege: string;
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
    public snackBar: MatSnackBar, public sanitizer: DomSanitizer) {
      
     }

  ngOnInit() {
    this.privilege = this.uriRole.replace('/', '').slice(0, this.uriRole.length - 2);
    // console.log('uriRole:' + this.uriRole);
    //this.dialogService.uriRole = this.uriRole;
    this.dataSource = new MatTableDataSource();

    if (this.uriRole === URI_MANAGERS) {
      this.managerStoreService.users$.subscribe(data => {
        if (data != null && data.length === 0 && this.localstorage.isStored(LOCAL_STORAGE_TOKEN_KEY)) {
          console.log('store empty...getting ' + this.uriRole);
          this.managerStoreService.getUsers();
        }
        this.dataSource.data = data;
      });
      this.managerStoreService.success$.subscribe(message => setTimeout(() => this.openSnackBar(message, 'info')));
      this.managerStoreService.error$.subscribe(error => setTimeout(() => this.openSnackBar(error, 'error')));

    } else if (this.uriRole === URI_TEACHERS) {
      this.teacherStoreService.users$.subscribe(data => {
        if (data != null && data.length === 0 && this.localstorage.isStored(LOCAL_STORAGE_TOKEN_KEY)) {
          console.log('store empty...getting ' + this.uriRole);
          this.teacherStoreService.getUsers();
        }
        this.dataSource.data = data;
      });
      this.teacherStoreService.success$.subscribe(message => setTimeout(() => this.openSnackBar(message, 'info')));
      this.teacherStoreService.error$.subscribe(error => setTimeout(() => this.openSnackBar(error, 'error')));

    } else if (this.uriRole === URI_STUDENTS) {
      this.studentStoreService.users$.subscribe(data => {
        if (data != null && data.length === 0 && this.localstorage.isStored(LOCAL_STORAGE_TOKEN_KEY)) {
          console.log('store empty...getting ' + this.uriRole);
          this.studentStoreService.getUsers();
        }
        this.dataSource.data = data;
      });
      this.studentStoreService.success$.subscribe(message => setTimeout(() => this.openSnackBar(message, 'info')));
      this.studentStoreService.error$.subscribe(error => setTimeout(() => this.openSnackBar(error, 'error')));

    } else {
      console.error('NO uriRole');
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

  openDialog(DialogType: string, user?: User): void {
    let config = new MatDialogConfig();
    config.data = {
      model: (DialogType === 'create') ? this.user = new User() : user,
      uriRole: this.uriRole,
    };
    config.panelClass = 'dialogService';
    config.width = '700px';// (DialogType === 'delete') ? '500px' : '700px';

    if (DialogType === 'detail') {
      this.dialogService.openDialogDetail(GetUsersDialogRefComponent, config);
    } else if (DialogType === 'edit') {
      this.dialogService.openDialogEdit(GetUsersDialogRefComponent, config);
    } else if (DialogType === 'delete') {
      this.dialogService.openDialogDelete(GetUsersDialogRefComponent, config);
    } else if (DialogType === 'create') {
      this.dialogService.openDialogCreate(GetUsersDialogRefComponent, config);
    } else {
      console.error('NO TYPE!!!');
    }

  }

  openDialogImage(user: User): void {
    let config = new MatDialogConfig();
    config.data = {
        model: user,
        uriRole: this.uriRole,
    };
    config.panelClass = 'dialogService';
    //config.width = 'auto';
    //config.height = 'auto';
    config.maxWidth = '420px';
    config.maxHeight = '420px';
    config.minWidth = '300px';
    config.minHeight = '300px';

    this.dialogService.openDialogImage(ImageUserDialogRefComponent, config);
}

privilegeToSpanish(privilege: string): string {
  let role = privilege.toUpperCase();

  if (role === ROLE_ADMIN) {
      return role = ROLE_ADMIN_SPANISH;
  }
  else if (role === ROLE_MANAGER) {
      return role = ROLE_MANAGER_SPANISH +'es';
  }
  else if (role === ROLE_TEACHER) {
      return role = ROLE_TEACHER_SPANISH +'s';
  }
  else if (role === ROLE_STUDENT) {
      return role = ROLE_STUDENT_SPANISH +'s';
  }
  console.error('no privilege');
  return 'no privilege';
}


  setDarkClass() {
    // [ngClass]="{'fila': !isDark, 'fila-dark': isDark}" other way in the template

    // CSS classes: added/removed per current state of component properties
    this.styleClasses = {
      'fila': !this.isDark,
      'fila-dark': this.isDark
    };
  }

  shortName(user: User): string {
    const n1 = user.firstName.substr(0, user.firstName.indexOf(' ')) || user.firstName;
    const n2 = user.lastName.substr(0, user.lastName.indexOf(' ')) || user.lastName;
    return n1 + ' ' + n2;
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


