import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { URI_STUDENTS } from '../app.config';
import { UserBackendService } from './user-backend.service';
import { MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class StudentStoreService {

    private usersSource = <BehaviorSubject<User[]>>new BehaviorSubject([]);
    public readonly users$ = this.usersSource.asObservable();
    private dataStore: { users: User[] };

    private errorSubject = <Subject<any>>new Subject();
    error$ = this.errorSubject.asObservable();

    private successSubject = <Subject<any>>new Subject();
    public readonly success$ = this.successSubject.asObservable();

    uriRole: string = URI_STUDENTS;

    constructor(private userBackendService: UserBackendService, private httpCli: HttpClient,
    ) {
        this.dataStore = { users: [] };
    }


    getUsers() {
        console.log(`************GET-${this.uriRole}************`);
        this.userBackendService
            .getUsers(this.uriRole)
            .subscribe(data => {
                if (data.length === 0) {
                    data = null;
                    this.successSubject.next('lista vacia');
                } else {
                    this.dataStore.users = data;
                    this.usersSource.next(Object.assign({}, this.dataStore).users);
                  //  this.successSubject.next('retrieve users ok');
                }
            }, error => {
                console.error('error retrieving users, ' + error.message);
                this.errorSubject.next('error retrieving users');
            }
            );
    }

    create(user: User) {
        this.userBackendService
            .create(user, this.uriRole)
            .subscribe(data => {
                this.dataStore.users.push(data);
                this.usersSource.next(Object.assign({}, this.dataStore).users);
                this.successSubject.next('user created');
            }, error => {
                console.error('could not create User, ' + error.message);
                this.errorSubject.next('could not create user');
            }
            );
    }

    update(user: User) {
        this.userBackendService
            .update(user, this.uriRole)
            .subscribe(data => {
                this.dataStore.users.forEach((u, i) => {
                    if (u.id === data.id) {
                        this.dataStore.users[i] = data;
                    }
                });
                this.usersSource.next(Object.assign({}, this.dataStore).users);
                this.successSubject.next('user updated');
            }, error => {
                console.error('could not update user from store, ' + error.message);
                this.errorSubject.next('could not update user');
            })
    }

    delete(id: string) {
        this.userBackendService
            .delete(id, this.uriRole)
            .subscribe(() => {
                this.dataStore.users.forEach((u, i) => {
                    if (u.id === id) { this.dataStore.users.splice(i, 1); }
                });
                this.usersSource.next(Object.assign({}, this.dataStore).users);
                this.successSubject.next('user deleted');
            }, error => {
                console.error('could not delete user from store, ' + error.message);
                this.errorSubject.next('could not delete user');
            }
            );
    }


    getUserById(id: number) {
        this.userBackendService
            .getUserById(id, this.uriRole)
            .subscribe(data => {
                let notFound = true;
                this.dataStore.users.forEach((item, index) => {
                    if (item.id === data.id) {
                        this.dataStore.users[index] = data;
                        notFound = false;
                    }
                });

                if (notFound) {
                    this.dataStore.users.push(data);
                }

                this.usersSource.next(Object.assign({}, this.dataStore).users);
               // this.successSubject.next('success');
            }, error => {
                console.error(`could not load user, ${error.message}`);
                this.errorSubject.next('could not load user');
            });

    }

    getUsersByRole(role: string) {
        this.userBackendService
            .getUsersByRole(role, this.uriRole)
            .subscribe(data => {
                this.dataStore.users = data;
                this.usersSource.next(Object.assign({}, this.dataStore).users);
               // this.successSubject.next('success');
            }, error => {
                console.error('error retrieving users' + error.message);
                this.errorSubject.next('error retrieving users');
            }
            );
    }


    deleteStore(): void {
        this.dataStore = { users: [] };
        this.usersSource.next(Object.assign({}, this.dataStore).users);
    }


}
