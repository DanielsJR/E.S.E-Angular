import { Component, OnInit, Inject } from '@angular/core';
import { User } from '../../../../models/user';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { startWith } from 'rxjs/internal/operators/startWith';
import { FormControl } from '@angular/forms';
import { UserStoreService } from '../../../../services/user-store.service';

@Component({
  selector: 'nx-search-user-dialog-ref',
  templateUrl: './search-user-dialog-ref.component.html',
  styleUrls: ['./search-user-dialog-ref.component.css']
})
export class SearchUserDialogRefComponent implements OnInit {

  filteredUsers$: Observable<User[]>;
  users: User[];
  userLoggedRoles: String[] = [];// this.localStorage.getTokenRoles();
  user$: Observable<User>;
  stateCtrl = new FormControl();

  constructor(public dialogRef: MatDialogRef<SearchUserDialogRefComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public sanitizer: DomSanitizer,
    private userStoreService: UserStoreService
  ) {
    //this.user = data.user;
    console.log('Dialog*** uriRol: ' + data.uriRole + ' type: ' + data.type);

    this.filteredUsers$ = this.stateCtrl.valueChanges
      .pipe(
        startWith(''),
        map(username => username ? this._filterUsers(username) : this.users.slice()),
      );
  }

  ngOnInit() {
    this.userStoreService.students$.subscribe(data => this.users = data);
  }

  cancel(): void {
    this.dialogRef.close('canceled');
  }
  accept(): void {
    this.dialogRef.close('accept');
  }
  setUser(name) {
    this.user$ = this.userStoreService.students$.pipe(
      map(users => users.find(u => u.firstName === name))
    );
  }

  private _filterUsers(value: string): User[] {
    const filterValue = value.toLowerCase();

    return this.users.filter(user => user.firstName.toLowerCase().indexOf(filterValue) === 0);
  }



}