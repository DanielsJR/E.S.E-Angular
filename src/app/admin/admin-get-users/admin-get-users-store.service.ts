import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User } from '../../models/user';
import { UserService } from '../../shared/services/users.service';
import { HttpClient } from '@angular/common/http';
import { URI_MANAGERS } from '../../app.config';

@Injectable()
export class AdminGetUsersStoreService {

    private usersSource = <BehaviorSubject<User[]>>new BehaviorSubject([]);
    public readonly users$ = this.usersSource.asObservable();
    private dataStore: { users: User[] };

    error: any;

    constructor(private userBackendService: UserService, private httpCli: HttpClient) {
        this.dataStore = { users: [] };
        console.log('************GET_MANAGERS************');
        this.getUsers();
    }

    getUsers() {
        this.userBackendService
            .getUsers(URI_MANAGERS)
            .subscribe(data => {
                this.dataStore.users = data;
                this.usersSource.next(Object.assign({}, this.dataStore).users);
            }, error => console.error('Error retrieving users')
            );
    }

    create(user: User) {
        this.userBackendService
            .create(user, URI_MANAGERS)
            .subscribe(data => {
                this.dataStore.users.push(data);
                this.usersSource.next(Object.assign({}, this.dataStore).users);

            }, error => console.error('Could not create User ' + error));
    }

    update(user: User) {
        this.userBackendService
            .update(user, URI_MANAGERS)
            .subscribe(data => {
                this.dataStore.users.forEach((u, i) => {
                    if (u.id === data.id) {
                        this.dataStore.users[i] = data;
                    }
                });
                this.usersSource.next(Object.assign({}, this.dataStore).users);
            }, error => {
                this.error = error;
                console.error('Could not update user from store ');
            })
    }

    delete(id: string) {
        this.userBackendService
            .delete(id, URI_MANAGERS)
            .subscribe(() => {
                this.dataStore.users.forEach((u, i) => {
                    if (u.id === id) { this.dataStore.users.splice(i, 1); }
                });
                this.usersSource.next(Object.assign({}, this.dataStore).users);

            }, error => console.error('Could not delete user from store ' + error));
    }


    getUsersByRole(role: string) {
        this.userBackendService
            .getUsersByRole(role, URI_MANAGERS)
            .subscribe(data => {
                this.dataStore.users = data;
                this.usersSource.next(Object.assign({}, this.dataStore).users);
            }, error => console.error(`Error retrieving ${role}s`)
            );
    }

    findById(id: number) {
        this.userBackendService
            .getUserById(id, URI_MANAGERS)
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
            }, error => console.error('Could not load User.'));

    }


}
