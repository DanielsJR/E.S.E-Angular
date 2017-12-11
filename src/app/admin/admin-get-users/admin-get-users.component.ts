import { LocalStorageService } from '../../shared/services/local-storage.service';
import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/user';
import { DataSource } from '@angular/cdk/collections';
import { UsersDialogRefComponent } from './dialog/users-dialog-ref.component';
import { DialogService } from '../dialog.service';
import { UserStoreService } from '../../shared/services/user-store.service';


import { Observable } from 'rxjs/Observable';

@Component({
  templateUrl: './admin-get-users.component.html',
  styleUrls: ['./admin-get-users.component.css']
})

export class AdminGetUsersComponent implements OnInit {

  // mat table
  users: User[];
  displayedColumns = ['userName'];
  dataSource: MDDataSource | null;

  // mat dialog
  user: User;
  isDark = this.localstorage.getIsDarkTheme();
  styleClasses: {};


  constructor(private userStoreService: UserStoreService, private dialogServ: DialogService, private localstorage: LocalStorageService) { }

  ngOnInit() {
    console.log('OnInit called');
    this.dataSource = new MDDataSource(this.userStoreService);

    this.localstorage.isThemeDark$.subscribe(
      isDark => {
        this.isDark = isDark;
        this.setDarkClass();
      }
    );
    this.setDarkClass();

  }

  openDialogDetail(user: User): void {
    this.user = user;
    this.dialogServ.obj = this.user;
    this.dialogServ.inputDialogRef = UsersDialogRefComponent;
    this.dialogServ.openDialogDetail();
  }

  openDialogCreate(): void {
    this.user = new User();
    this.dialogServ.obj = this.user;
    this.dialogServ.inputDialogRef = UsersDialogRefComponent;
    this.dialogServ.openDialogCreate();
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




//  Data source to provide what data should be rendered in the table.
export class MDDataSource extends DataSource<any> {

  constructor(private userStoreService: UserStoreService) {
    super();
  }


  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<User[]> {
    //  this.userStoreservice.loadInitialData();
    console.log('connect called');
    return this.userStoreService.users$;
  }

  disconnect() { }

}
