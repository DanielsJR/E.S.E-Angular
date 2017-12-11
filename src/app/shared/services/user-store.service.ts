import { UserService } from './users.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User } from '../../models/user';

@Injectable()
export class UserStoreService {

    private usersSource = <BehaviorSubject<User[]>>new BehaviorSubject([]);
    public readonly users$ = this.usersSource.asObservable();
    private dataStore: { users: User[] };

    constructor(private userBackendService: UserService) {
        this.dataStore = { users: [] };
        console.log('************loadInitialData************');
        this.loadInitialData();
    }

    loadInitialData() {
        this.userBackendService
            .getUsers()
            .subscribe(data => {
                this.dataStore.users = data;
                this.usersSource.next(Object.assign({}, this.dataStore).users);
            }, error => console.log('Error retrieving users')
            );
    }

    findById(id: number) {
        this.userBackendService
            .getUserById(id)
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
            }, error => console.log('Could not load User.'));

    }

    create(user: User) {
        return this.userBackendService
            .create(user)
            .subscribe(() => {
                let userRecover: User;
                this.userBackendService.getUserByUserName(user.username).subscribe(resp => {
                    userRecover = resp;
                    console.log('userRecover:' + JSON.stringify(userRecover));
                    this.dataStore.users.push(userRecover);
                    this.usersSource.next(Object.assign({}, this.dataStore).users);
                }, error => console.log('Could not recover user or store it' + error));

            }, error => console.log('Could not create User ' + error));
    }

    update(user: User) {
        return this.userBackendService
            .update(user)
            .subscribe(data => {
                this.dataStore.users.forEach((u, i) => {
                    if (u.id === data.id) { this.dataStore.users[i] = data; }
                });
                this.usersSource.next(Object.assign({}, this.dataStore).users);

            }, error => console.log('Could not update user from store ' + error));
    }

    delete(id: number) {
        return this.userBackendService
            .delete(id)
            .subscribe(resp => {
                this.dataStore.users.forEach((u, i) => {
                    if (u.id === id) { this.dataStore.users.splice(i, 1); }
                });
                this.usersSource.next(Object.assign({}, this.dataStore).users);

            }, error => console.log('Could not delete user from store ' + error));
    }


}
