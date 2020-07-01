import { Component, OnInit, Inject, Input, OnDestroy } from '@angular/core';
import { User } from '../../../../models/user';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { startWith } from 'rxjs/internal/operators/startWith';
import { FormControl, Validators } from '@angular/forms';
import { UserStoreService } from '../../../../services/user-store.service';
import { RESULT_CANCELED, RESULT_ACCEPT, ROLE_TEACHER, ROLE_STUDENT, ROLE_MANAGER } from '../../../../app.config';
import { shortNameSecondName } from '../../../../shared/functions/shortName';


@Component({
  templateUrl: './search-user-dialog-ref.component.html',
  styleUrls: ['./search-user-dialog-ref.component.css']
})
export class SearchUserDialogRefComponent implements OnInit, OnDestroy {

  filteredUsers$: Observable<User[]>;
  users: User[];
  user: User;
  actionButton;

  //user$: Observable<User>;
  stateCtrl = new FormControl();
  private subscriptions = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<SearchUserDialogRefComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userStoreService: UserStoreService
  ) {

    //console.log('Dialog*** uriRol: ' + data.uriRole + ' type: ' + data.type);
    if (data.user !== null) this.user = this.data.user;
    this.stateCtrl.setValidators(Validators.required);
    this.subscriptions.add(this.stateCtrl.statusChanges.subscribe(status => {
      if (status === "INVALID")
        this.user = null;
    }));
    this.actionButton = (data.actionButton) ? data.actionButton : 'Aceptar';
    this.filteredUsers$ = this.stateCtrl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.firstName),
        map(value => value ? this._filterUsers(value) : this.users.slice()),

      );

    if (data.userRole === ROLE_MANAGER) {
      this.subscriptions.add(this.userStoreService.managers$.subscribe(data => this.users = data));
    } else if (data.userRole === ROLE_TEACHER) {
      this.subscriptions.add(this.userStoreService.teachers$.subscribe(data => this.users = data));
    } else if (data.userRole === ROLE_STUDENT) {
      this.subscriptions.add(this.userStoreService.students$.subscribe(data => this.users = data));
    } else {
      console.error('no user role!!');
    }
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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
      (user.firstName.toLowerCase() + ' ' + user.lastName.toLowerCase()).indexOf(filterValue) === 0 ||
      user.firstName.toLowerCase().indexOf(filterValue) === 0 || user.lastName.toLowerCase().indexOf(filterValue) === 0
      || shortNameSecondName(user).toLowerCase().indexOf(filterValue) === 0);
  }

  displayUser(user?: User): string | undefined {
    return user ? user.firstName + ' ' + user.lastName : undefined;
  }


}