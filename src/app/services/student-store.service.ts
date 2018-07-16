import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from '../models/user';
import { URI_STUDENTS } from '../app.config';
import { UserBackendService } from './user-backend.service';
import { MatSnackBar } from '@angular/material';
import { finalize, retry } from 'rxjs/operators';


@Injectable({
    providedIn: 'root',
})
export class StudentStoreService {

    private usersSource = <BehaviorSubject<User[]>>new BehaviorSubject([]);
    public readonly users$ = this.usersSource.asObservable();
    private dataStore: { users: User[] };

    private errorSubject = <Subject<any>>new Subject();
    public readonly errorMessage$ = this.errorSubject.asObservable();

    private successSubject = <Subject<any>>new Subject();
    public readonly successMessage$ = this.successSubject.asObservable();

    private userCreatedSubject = <Subject<User>>new Subject();
    public readonly userCreated$ = this.userCreatedSubject.asObservable();

    private userUpdatedSubject = <Subject<User>>new Subject();
    public readonly userUpdated$ = this.userUpdatedSubject.asObservable();

    private userDeletedSubject = <Subject<User>>new Subject();
    public readonly userDeleted$ = this.userDeletedSubject.asObservable();

    private isLoadingSubject = <Subject<boolean>>new Subject();
    isLoading$ = this.isLoadingSubject.asObservable();

    private isLoadingGetUsersSubject = <Subject<boolean>>new Subject();
    isLoadingGetUsers$ = this.isLoadingGetUsersSubject.asObservable();

    uriRole: string = URI_STUDENTS;

    constructor(private userBackendService: UserBackendService, private httpCli: HttpClient,
    ) {
        this.dataStore = { users: [] };
    }


    getUsers() {
        console.log(`************GET-${this.uriRole}************`);
        this.isLoadingGetUsersSubject.next(true);
        this.userBackendService
            .getUsers(this.uriRole)
            .pipe(retry(3),finalize(() => this.isLoadingGetUsersSubject.next(false)))
            .subscribe(data => {
                if (data.length === 0) {
                    data = null;
                    this.successSubject.next('Lista de Alumnos vacia');
                } else {
                    this.dataStore.users = data;
                    this.usersSource.next(Object.assign({}, this.dataStore).users);
                    //  this.successSubject.next('retrieve users ok');
                }
            }, error => {
                if (error instanceof HttpErrorResponse) {
                    this.errorSubject.next(error.error.message);
                } else {
                    console.error('error retrieving users, ' + error.message);
                    this.errorSubject.next('Error al conseguir lista de Alumnos');
                }
            });
    }

    create(user: User) {
        this.isLoadingSubject.next(true);
        this.userBackendService
            .create(user, this.uriRole)
            .pipe(finalize(() => this.isLoadingSubject.next(false)))
            .subscribe(data => {
                this.dataStore.users.push(data);
                this.usersSource.next(Object.assign({}, this.dataStore).users);
                this.userCreatedSubject.next(data);
            }, error => {
                if (error instanceof HttpErrorResponse) {
                    this.errorSubject.next(error.error.message);
                } else {
                    console.error('could not create User, ' + error.message);
                    this.errorSubject.next('Error al crear Alumno');
                }
            }, () => this.successSubject.next('Alumno Creado'));
    }

    update(user: User) {
        this.isLoadingSubject.next(true);
        this.userBackendService
            .update(user, this.uriRole)
            .pipe(finalize(() => this.isLoadingSubject.next(false)))
            .subscribe(data => {
                this.dataStore.users.forEach((u, i) => {
                    if (u.id === data.id) {
                        this.dataStore.users[i] = data;
                    }
                });
                this.usersSource.next(Object.assign({}, this.dataStore).users);
                this.userUpdatedSubject.next(data);
            }, error => {
                if (error instanceof HttpErrorResponse) {
                    this.errorSubject.next(error.error.message);
                } else {
                    console.error('could not update user from store, ' + error.message);
                    this.errorSubject.next('Error al actualizar Alumno');
                }
            }, () => this.successSubject.next('Alumno Actualizado'));
    }

    delete(user: User) {
        this.isLoadingSubject.next(true);
        this.userBackendService
            .delete(user, this.uriRole)
            .pipe(finalize(() => this.isLoadingSubject.next(false)))
            .subscribe(_ => {
                this.dataStore.users.forEach((u, i) => {
                    if (u.id === user.id) { this.dataStore.users.splice(i, 1); }
                });
                this.usersSource.next(Object.assign({}, this.dataStore).users);
                this.userDeletedSubject.next(user);
            }, error => {
                if (error instanceof HttpErrorResponse) {
                    this.errorSubject.next(error.error.message);
                } else {
                    console.error('could not delete user from store, ' + error.message);
                    this.errorSubject.next('Error al borrar Alumno');
                }
            }, () => this.successSubject.next('Alumno Eliminado'));
    }


    getUserById(id: string) {
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
                if (error instanceof HttpErrorResponse) {
                    this.errorSubject.next(error.error.message);
                } else {
                    console.error(`could not load user, ${error.message}`);
                    this.errorSubject.next('could not load user');
                }
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
                if (error instanceof HttpErrorResponse) {
                    this.errorSubject.next(error.error.message);
                } else {
                    console.error('error retrieving users' + error.message);
                    this.errorSubject.next('error retrieving users');
                }
            });
    }

    deleteStore(): void {
        this.dataStore = { users: [] };
        this.usersSource.next(Object.assign({}, this.dataStore).users);
    }


}
