import { AdminService } from '../admin.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { Observable } from 'rxjs/Observable';
import { DataSource } from '@angular/cdk/collections';

@Component({
  selector: 'nx-admin-get-users',
  templateUrl: './admin-get-users.component.html',
  styleUrls: ['./admin-get-users.component.css']
})
export class AdminGetUsersComponent implements OnInit {

  users: User[];
  displayedColumns = ['userName'];
  dataSource: MDDataSource | null;

  constructor(private service: AdminService) { }

  ngOnInit() {
    this.dataSource = new MDDataSource(this.service);
  }

}

//  Data source to provide what data should be rendered in the table.
export class MDDataSource extends DataSource<any> {

  constructor(private service: AdminService) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<User[]> {
    // this.service.loadInitialData();
    return this.service.getUsers();
  }

  disconnect() { }

}

