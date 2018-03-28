import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User } from '../../models/user';
import { UserService } from '../../shared/services/users.service';
import { HttpClient } from '@angular/common/http';
import { URI_MANAGERS, URI_TEACHERS } from '../../app.config';

@Injectable()
export class ManagerGetTeachersStoreService {

    private usersSource = <BehaviorSubject<User[]>>new BehaviorSubject([]);
    public readonly users$ = this.usersSource.asObservable();
    private dataStore: { users: User[] };


    constructor(private userBackendService: UserService, private httpCli: HttpClient) {
        this.dataStore = { users: [] };
        console.log('************initial-data************');
        this.getUsers();
        //this.getUsersByRole('teacher');
    }

    getUsers() {
        this.userBackendService
            .getUsers(URI_TEACHERS)
            .subscribe(data => {
                this.dataStore.users = data;
                this.usersSource.next(Object.assign({}, this.dataStore).users);
            }, error => console.log('Error retrieving users')
            );
    }

    getUsersByRole(role: string) {
        this.userBackendService
            .getUsersByRole(role, URI_TEACHERS)
            .subscribe(data => {
                this.dataStore.users = data;
                this.usersSource.next(Object.assign({}, this.dataStore).users);
            }, error => console.log(`Error retrieving ${role}s`)
            );
    }

    findById(id: number) {
        this.userBackendService
            .getUserById(id, URI_TEACHERS)
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
        this.userBackendService
            .create(user, URI_TEACHERS)
            .subscribe(data => {
                this.dataStore.users.push(data);
                this.usersSource.next(Object.assign({}, this.dataStore).users);

            }, error => console.log('Could not create User ' + error));
    }

    update(user: User) {
        this.userBackendService
            .update(user, URI_TEACHERS)
            .subscribe(data => {
                this.dataStore.users.forEach((u, i) => {
                    if (u.id === data.id) {
                        this.dataStore.users[i] = data;
                    }
                });
                this.usersSource.next(Object.assign({}, this.dataStore).users);

            }, error => console.log('Could not update user from store ' + error));
    }

    delete(username: string) {
        this.userBackendService
            .delete(username, URI_TEACHERS)
            .subscribe(() => {
                this.dataStore.users.forEach((u, i) => {
                    if (u.username === username) { this.dataStore.users.splice(i, 1); }
                });
                this.usersSource.next(Object.assign({}, this.dataStore).users);

            }, error => console.log('Could not delete user from store ' + error));
    }


}
