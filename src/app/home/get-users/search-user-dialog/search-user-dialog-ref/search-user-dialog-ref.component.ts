import { Component, OnInit, Inject, Input } from '@angular/core';
import { User } from '../../../../models/user';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { startWith } from 'rxjs/internal/operators/startWith';
import { FormControl } from '@angular/forms';
import { UserStoreService } from '../../../../services/user-store.service';
import { RESULT_CANCELED, RESULT_ACCEPT, ROLE_TEACHER, ROLE_STUDENT, ROLE_MANAGER } from '../../../../app.config';
import { shortNameSecondName } from '../../../../shared/functions/shortName';

@Component({
  templateUrl: './search-user-dialog-ref.component.html',
  styleUrls: ['./search-user-dialog-ref.component.css']
})
export class SearchUserDialogRefComponent implements OnInit {

  filteredUsers$: Observable<User[]>;
  users: User[];
  user: User;
  successButton;

  //user$: Observable<User>;
  stateCtrl = new FormControl();

  constructor(
    public dialogRef: MatDialogRef<SearchUserDialogRefComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public sanitizer: DomSanitizer,
    private userStoreService: UserStoreService
  ) {
    //this.user = data.user;
    console.log('Dialog*** uriRol: ' + data.uriRole + ' type: ' + data.type);
    if (data.user !== null) this.user = this.data.user;
    this.successButton = (!data.user) ? 'Agregar' : 'Eliminar';
    this.filteredUsers$ = this.stateCtrl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.firstName),
        map(value => value ? this._filterUsers(value) : this.users.slice()),
      );

    if (data.userRole === ROLE_MANAGER) {
      this.userStoreService.managers$.subscribe(data => this.users = data);
    } else if (data.userRole === ROLE_TEACHER) {
      this.userStoreService.teachers$.subscribe(data => this.users = data);
    } else if (data.userRole === ROLE_STUDENT) {
      this.userStoreService.students$.subscribe(data => this.users = data);
    } else {
      console.error('no user role!!');
    }
  }

  ngOnInit() {
  }

  cancel(): void {
    this.dialogRef.close(RESULT_CANCELED);
  }

  accept(): void {
    this.dialogRef.close(RESULT_ACCEPT);
  }

  selectedUser(value: User) {
    this.user = value;
  }

  private _filterUsers(value: string): User[] {
    const filterValue = value.toLowerCase();
    return this.users.filter(user => 
      (user.firstName.toLowerCase() +' '+  user.lastName.toLowerCase()).indexOf(filterValue) === 0 || 
      user.firstName.toLowerCase().indexOf(filterValue) === 0 || user.lastName.toLowerCase().indexOf(filterValue) === 0
      || shortNameSecondName(user).toLowerCase().indexOf(filterValue) === 0);
  }

  displayUser(user?: User): string | undefined {
    return user ? user.firstName + ' ' + user.lastName : undefined;
  }


}