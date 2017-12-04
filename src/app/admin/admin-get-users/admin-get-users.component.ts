import { LocalStorageService } from '../../shared/services/local-storage.service';
import { UserService } from '../../shared/services/users.service';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { User } from '../../models/user';
import { Observable } from 'rxjs/Observable';
import { DataSource } from '@angular/cdk/collections';
import { UsersDialogRefComponent } from './dialog/users-dialog-ref.component';
import { DialogService } from '../dialog.service';

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
  usersDialogRef: UsersDialogRefComponent;
  user: User;
  isDark = this.localstorage.getIsDarkTheme();

  @ViewChild(UsersDialogRefComponent) dialogRef: UsersDialogRefComponent;

  constructor(private service: UserService, private dialogServ: DialogService, private localstorage: LocalStorageService) { }

  ngOnInit() {
    this.dataSource = new MDDataSource(this.service);

    this.localstorage.isThemeDark$.subscribe(
      isDark => this.isDark = isDark
    );

  }

  openDialogDetail(user: User): void {
    this.user = user;
    this.dialogServ.obj = this.user;
    this.dialogServ.inputDialogRef = UsersDialogRefComponent;
    this.dialogServ.openDialogDetail();
  }


}




//  Data source to provide what data should be rendered in the table.
export class MDDataSource extends DataSource<any> {

  constructor(private service: UserService) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<User[]> {
    // this.service.loadInitialData();
    return this.service.getUsers();
  }

  disconnect() { }

}

