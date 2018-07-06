import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from '../models/user';
import { URI_MANAGERS, ROLE_MANAGER } from '../app.config';
import { UserBackendService } from './user-backend.service';
import { MatSnackBar } from '@angular/material';


import { TeacherStoreService } from './teacher-store.service';
import { finalize } from 'rxjs/operators';


@Injectable({
    providedIn: 'root',
})
export class ManagerStoreService {

    private usersSource = <BehaviorSubject<User[]>>new BehaviorSubject([]);
    public readonly users$ = this.usersSource.asObservable();
    private dataStore: { users: User[] };

    private errorSubject = <Subject<any>>new Subject();
    public readonly errorMessage$ = this.errorSubject.asObservable();

    private successSubject = <Subject<any>>new Subject();
    public readonly successMessage$ = this.successSubject.asObservable();

    private createSuccessSubject = <Subject<User>>new Subject();
    public readonly createSuccess$ = this.createSuccessSubject.asObservable();

    private updateSuccessSubject = <Subject<User>>new Subject();
    public readonly updateSuccess$ = this.updateSuccessSubject.asObservable();

    private deleteSuccessSubject = <Subject<User>>new Subject();
    public readonly deleteSuccess$ = this.deleteSuccessSubject.asObservable();

    private isLoadingSubject = <Subject<boolean>>new Subject();
    isLoading$ = this.isLoadingSubject.asObservable();


    private setRolesSubject = <Subject<User>>new Subject();
    setRoles$ = this.setRolesSubject.asObservable();

    private isLoadingRolesSubject = <Subject<boolean>>new Subject();
    isLoadingRoles$ = this.isLoadingRolesSubject.asObservable();

    private isLoadingGetUsersSubject = <Subject<boolean>>new Subject();
    isLoadingGetUsers$ = this.isLoadingGetUsersSubject.asObservable();

    uriRole: string = URI_MANAGERS;
    role: string = ROLE_MANAGER;

    constructor(private userBackendService: UserBackendService, private httpCli: HttpClient) {
        this.dataStore = { users: [] };
    }



    getUsers() {
        console.log(`************GET-${this.uriRole}************`);
        this.isLoadingGetUsersSubject.next(true);
        this.userBackendService
            .getUsers(this.uriRole)
            .pipe(finalize(() => this.isLoadingGetUsersSubject.next(false)))
            .subscribe(data => {
                if (data.length === 0) {
                    data = null;
                    this.successSubject.next('Lista Administradores vacia');
                } else {
                    this.dataStore.users = data;
                    this.usersSource.next(Object.assign({}, this.dataStore).users);
                }
            }, error => {
                if (error instanceof HttpErrorResponse) {
                    this.errorSubject.next(error.error.message);
                } else {
                    console.error('error retrieving users, ' + error.message);
                    this.errorSubject.next('Error al obtener lista Administradores');
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
                this.successSubject.next('Administrador Creado');
                this.createSuccessSubject.next(data);
            }, error => {
                if (error instanceof HttpErrorResponse) {
                    this.errorSubject.next(error.error.message);
                } else {
                    console.error('could not create User, ' + error.message);
                    this.errorSubject.next('Error al crear Administrador');
                }
            });

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
                this.successSubject.next('Administrador Actualizado');
                this.updateSuccessSubject.next(data);
            }, error => {
                if (error instanceof HttpErrorResponse) {
                    this.errorSubject.next(error.error.message);
                } else {
                    console.error('could not update user from store, ' + error.message);
                    this.errorSubject.next('Error al actualizar Administrador');
                }
            });
    }

    delete(user: User) {
        this.isLoadingSubject.next(true);
        this.userBackendService
            .delete(user, this.uriRole)
            .pipe(finalize(() => this.isLoadingSubject.next(false)))
            .subscribe(_ => {
                this.dataStore.users.forEach((u, i) => {
                    if (u.id === user.id) {
                        this.dataStore.users.splice(i, 1);
                    }
                });
                this.usersSource.next(Object.assign({}, this.dataStore).users);
                this.successSubject.next('Administrador Eliminado');
                this.deleteSuccessSubject.next(user);
            }, error => {
                if (error instanceof HttpErrorResponse) {
                    this.errorSubject.next(error.error.message);
                } else {
                    console.error('could not delete user from store, ' + error.message);
                    this.errorSubject.next('Error al borrar Administrador');
                }
            });
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
                    this.errorSubject.next('Error al obtener Administrador');
                }
            });
    }

    getUsersByRole(role: string) {
        this.userBackendService
            .getUsersByRole(role, this.uriRole)
            .subscribe(data => {
                this.dataStore.users = data;
                this.usersSource.next(Object.assign({}, this.dataStore).users);
                //  this.successSubject.next('success');
            }, error => {
                if (error instanceof HttpErrorResponse) {
                    this.errorSubject.next(error.error.message);
                } else {
                    console.error('error retrieving users by role' + error.message);
                    this.errorSubject.next('Error al obtener Administradores');
                }
            });
    }

    updateUserFromStore(user: User) {
        if (this.dataStore.users.length > 0) {
            let notFound = true;
            this.dataStore.users.forEach((u, i) => {
                if (u.id === user.id) {
                    notFound = false;
                    if (user.roles.includes(this.role)) {
                        this.dataStore.users[i] = user;
                        console.log('actualizado en la manager-store');
                    } else {
                        this.dataStore.users.splice(i, 1);
                        console.log('eliminado de la manager-store');
                    }
                }
            });
            if (notFound && user.roles.includes(this.role)) {
                this.dataStore.users.push(user);
                console.log('agregado a la manager-store');
            }
            this.usersSource.next(Object.assign({}, this.dataStore).users);
        }
    }

    deleteUserFromStore(user: User) {
        let notFound = true;
        this.dataStore.users.forEach((u, i) => {
            if (u.id === user.id) {
                let notFound = false;
                this.dataStore.users.splice(i, 1);
                console.log('eliminado en la manager-store');
            }
        });
        if (!notFound) {
            this.usersSource.next(Object.assign({}, this.dataStore).users);
        }

    }

    setRoles(user: User) {
        this.isLoadingRolesSubject.next(true);
        this.userBackendService
            .setRoles(user.username, user.roles, this.uriRole)
            .pipe(finalize(() => this.isLoadingRolesSubject.next(false)))
            .subscribe(data => {

                this.dataStore.users.forEach((u, i) => {
                    if (u.id === data.id) {
                        data.roles.includes(this.role) ? this.dataStore.users[i] = data : this.dataStore.users.splice(i, 1);
                    }
                });
                this.usersSource.next(Object.assign({}, this.dataStore).users);
                this.successSubject.next('Privilégios asignados');
                this.setRolesSubject.next(data);
            }, error => {
                if (error instanceof HttpErrorResponse) {
                    this.errorSubject.next(error.error.message);
                } else {
                    console.error('could not set user role from store, ' + error.message);
                    this.errorSubject.next('Error al asignar privilégios');
                }
            });
    }

    deleteStore(): void {
        this.dataStore = { users: [] };
        this.usersSource.next(Object.assign({}, this.dataStore).users);
    }


}
