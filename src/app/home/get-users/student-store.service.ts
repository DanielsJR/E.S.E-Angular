import { Injectable} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/user';
import { URI_STUDENTS } from '../../app.config';
import { UserBackendService } from '../../services/user-backend.service';


@Injectable()
export class StudentStoreService{

    private usersSource = <BehaviorSubject<User[]>>new BehaviorSubject([]);
    public readonly users$ = this.usersSource.asObservable();
    private dataStore: { users: User[] };

    error: any;
    uriRole: string = URI_STUDENTS;

    constructor(private userBackendService: UserBackendService, private httpCli: HttpClient) {
        this.dataStore = { users: [] };
    }

    getUsers() {
        console.log(`************GET-${this.uriRole}************`);
        this.userBackendService
            .getUsers(this.uriRole)
            .subscribe(data => {
                this.dataStore.users = data;
                this.usersSource.next(Object.assign({}, this.dataStore).users);
            }, error => console.error('Error retrieving users')
            );
    }

    create(user: User) {
        this.userBackendService
            .create(user, this.uriRole)
            .subscribe(data => {
                this.dataStore.users.push(data);
                this.usersSource.next(Object.assign({}, this.dataStore).users);

            }, error => console.error('Could not create User ' + error));
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
            }, error => {
                this.error = error;
                console.error('Could not update user from store ');
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

            }, error => console.error('Could not delete user from store ' + error));
    }


    getUsersByRole(role: string) {
        this.userBackendService
            .getUsersByRole(role, this.uriRole)
            .subscribe(data => {
                this.dataStore.users = data;
                this.usersSource.next(Object.assign({}, this.dataStore).users);
            }, error => console.error(`Error retrieving ${role}s`)
            );
    }

    findById(id: number) {
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
            }, error => console.error('Could not load User.'));

    }

    deleteStore(): void{
        this.dataStore = { users: [] };
        this.usersSource.next(Object.assign({}, this.dataStore).users);
    }


}
