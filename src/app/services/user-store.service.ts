import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../models/user';
import { URI_MANAGERS, ROLE_MANAGER, URI_TEACHERS, URI_STUDENTS, ROLE_TEACHER, ROLE_STUDENT } from '../app.config';
import { UserBackendService } from './user-backend.service';
import { finalize } from 'rxjs/operators';


@Injectable({
    providedIn: 'root',
})
export class UserStoreService {

    private managersSource = <BehaviorSubject<User[]>>new BehaviorSubject([]);
    public readonly managers$ = this.managersSource.asObservable();
    private managersDataStore: { managers: User[] };

    private teachersSource = <BehaviorSubject<User[]>>new BehaviorSubject([]);
    public readonly teachers$ = this.teachersSource.asObservable();
    private teachersDataStore: { teachers: User[] };

    private studentsSource = <BehaviorSubject<User[]>>new BehaviorSubject([]);
    public readonly students$ = this.studentsSource.asObservable();
    private studentsDataStore: { students: User[] };


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

    private setRolesSubject = <Subject<User>>new Subject();
    setRoles$ = this.setRolesSubject.asObservable();


    private isLoadingSubject = <Subject<boolean>>new Subject();
    isLoading$ = this.isLoadingSubject.asObservable();

    private isLoadingGetUsersSubject = <Subject<boolean>>new Subject();
    isLoadingGetUsers$ = this.isLoadingGetUsersSubject.asObservable();

    private isLoadingRolesSubject = <Subject<boolean>>new Subject();
    isLoadingRoles$ = this.isLoadingRolesSubject.asObservable();


    managerUriRole: string = URI_MANAGERS;
    teacherUriRole: string = URI_TEACHERS;
    studentUriRole: string = URI_STUDENTS;

    managerRole: string = ROLE_MANAGER;
    teacherRole: string = ROLE_TEACHER;
    studentRole: string = ROLE_STUDENT;

    constructor(private userBackendService: UserBackendService) {
        this.managersDataStore = { managers: [] };
        this.teachersDataStore = { teachers: [] };
        this.studentsDataStore = { students: [] };
    }

    /******************************MANAGERS***************************************************** */
    getManagers() {
        if (this.managersDataStore.managers.length) {
            console.log(`********GET-${this.managerRole}-CACHE********`);
            this.managersSource.next(this.managersDataStore.managers);
        } else {
            console.log(`********GET-${this.managerRole}-BACKEND********`);
            this.isLoadingGetUsersSubject.next(true);
            this.userBackendService
                .getUsers(this.managerUriRole)
                .pipe(finalize(() => this.isLoadingGetUsersSubject.next(false)))
                .subscribe(data => {
                    if (data.length === 0) {
                        data = null;
                        this.successSubject.next('Lista Administradores vacia');
                    } else {
                        this.managersDataStore.managers = data;
                        this.managersSource.next(Object.assign({}, this.managersDataStore).managers);
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
    }

    createManager(user: User) {
        this.isLoadingSubject.next(true);
        this.userBackendService
            .create(user, this.managerUriRole)
            .pipe(finalize(() => this.isLoadingSubject.next(false)))
            .subscribe(data => {
                this.managersDataStore.managers.push(data);
                this.managersSource.next(Object.assign({}, this.managersDataStore).managers);
                this.userCreatedSubject.next(data);
            }, error => {
                if (error instanceof HttpErrorResponse) {
                    this.errorSubject.next(error.error.message);

                } else {
                    console.error('could not create User, ' + error.message);
                    this.errorSubject.next('Error al crear Administrador');
                }
            }, () => this.successSubject.next('Administrador Creado')
            );

    }

    updateManager(user: User) {
        this.isLoadingSubject.next(true);
        this.userBackendService
            .update(user, this.managerUriRole)
            .pipe(finalize(() => this.isLoadingSubject.next(false)))
            .subscribe(data => {
                this.managersDataStore.managers.forEach((u, i) => {
                    if (u.id === data.id) {
                        this.managersDataStore.managers[i] = data;
                    }
                });
                this.managersSource.next(Object.assign({}, this.managersDataStore).managers);
                this.userUpdatedSubject.next(data);
            }, error => {
                if (error instanceof HttpErrorResponse) {
                    this.errorSubject.next(error.error.message);
                } else {
                    console.error('could not update user from store, ' + error.message);
                    this.errorSubject.next('Error al actualizar Administrador');
                }
            }, () => this.successSubject.next('Administrador Actualizado')
            );
    }

    deleteManager(user: User) {
        this.isLoadingSubject.next(true);
        this.userBackendService
            .delete(user, this.managerUriRole)
            .pipe(finalize(() => this.isLoadingSubject.next(false)))
            .subscribe(_ => {
                this.managersDataStore.managers.forEach((u, i) => {
                    if (u.id === user.id) {
                        this.managersDataStore.managers.splice(i, 1);
                    }
                });
                this.managersSource.next(Object.assign({}, this.managersDataStore).managers);
                this.userDeletedSubject.next(user);
            }, error => {
                if (error instanceof HttpErrorResponse) {
                    this.errorSubject.next(error.error.message);
                } else {
                    console.error('could not delete user from store, ' + error.message);
                    this.errorSubject.next('Error al borrar Administrador');
                }
            }, () => this.successSubject.next('Administrador Eliminado')
            );
    }

    setManagerRoles(user: User) {
        this.isLoadingRolesSubject.next(true);
        this.userBackendService
            .setRoles(user.username, user.roles, this.managerUriRole)
            .pipe(finalize(() => this.isLoadingRolesSubject.next(false)))
            .subscribe(data => {
                this.managersDataStore.managers.forEach((u, i) => {
                    if (u.id === data.id) {
                        data.roles.includes(this.managerRole) ? this.managersDataStore.managers[i] = data : this.managersDataStore.managers.splice(i, 1);
                    }
                });
                this.managersSource.next(Object.assign({}, this.managersDataStore).managers);
                this.setRolesSubject.next(data);
            }, error => {
                if (error instanceof HttpErrorResponse) {
                    this.errorSubject.next(error.error.message);
                } else {
                    console.error('could not set user role from store, ' + error.message);
                    this.errorSubject.next('Error al asignar privilégios');
                }
            }, () => this.successSubject.next('Privilégios asignados')
            );
    }

    updateManagerInStore(user: User) {
        if (this.managersDataStore.managers.length) {
            let notFound = true;
            this.managersDataStore.managers.forEach((u, i) => {
                if (u.id === user.id) {
                    notFound = false;
                    if (user.roles.includes(this.managerRole)) {
                        this.managersDataStore.managers[i] = user;
                        console.log('actualizado en la manager-store');
                        this.managersSource.next(Object.assign({}, this.managersDataStore).managers);
                    } else {
                        this.managersDataStore.managers.splice(i, 1);
                        console.log('eliminado de la manager-store');
                        this.managersSource.next(Object.assign({}, this.managersDataStore).managers);
                    }
                }
            });
            if (notFound && user.roles.includes(this.managerRole)) {
                this.managersDataStore.managers.push(user);
                console.log('agregado a la manager-store');
                this.managersSource.next(Object.assign({}, this.managersDataStore).managers);
            }

        }
    }

    deleteManagerInStore(user: User) {

        this.managersDataStore.managers.forEach((u, i) => {
            if (u.id === user.id) {
                this.managersDataStore.managers.splice(i, 1);
                console.log('eliminado en la manager-store');
            }
        });


    }

    clearManagerStore(): void {
        this.managersDataStore = { managers: [] };
        this.managersSource.next(Object.assign({}, this.managersDataStore).managers);
    }


    /******************************TEACHERS***************************************************** */
    getTeachers() {
        if (this.teachersDataStore.teachers.length) {
            console.log(`********GET-${this.teacherRole}-CACHE********`);
            this.teachersSource.next(this.teachersDataStore.teachers);
        } else {
            console.log(`********GET-${this.teacherRole}-BACKEND********`);
            this.isLoadingGetUsersSubject.next(true);
            this.userBackendService
                .getUsers(this.teacherUriRole)
                .pipe(finalize(() => this.isLoadingGetUsersSubject.next(false)))
                .subscribe(data => {
                    if (data.length === 0) {
                        data = null;
                        this.successSubject.next('Lista de Docentes vacia');
                    } else {
                        this.teachersDataStore.teachers = data;
                        this.teachersSource.next(Object.assign({}, this.teachersDataStore).teachers);
                        // this.successSubject.next('retrieve users ok');
                    }
                }, error => {
                    if (error instanceof HttpErrorResponse) {
                        this.errorSubject.next(error.error.message);
                    } else {
                        console.error('error retrieving users, ' + error.message);
                        this.errorSubject.next('Error al obtener lista de Docentes');
                    }
                });
        }
    }

    createTeacher(user: User) {
        this.isLoadingSubject.next(true);
        this.userBackendService
            .create(user, this.teacherUriRole)
            .pipe(finalize(() => this.isLoadingSubject.next(false)))
            .subscribe(data => {
                this.teachersDataStore.teachers.push(data);
                this.teachersSource.next(Object.assign({}, this.teachersDataStore).teachers);
                this.userCreatedSubject.next(data);
            }, error => {
                if (error instanceof HttpErrorResponse) {
                    this.errorSubject.next(error.error.message);
                } else {
                    console.error('could not create User, ' + error.message);
                    this.errorSubject.next('Error al crear Docente');
                }
            }, () => this.successSubject.next('Docente Creado')
            );
    }

    updateTeacher(user: User) {
        this.isLoadingSubject.next(true);
        this.userBackendService
            .update(user, this.teacherUriRole)
            .pipe(finalize(() => this.isLoadingSubject.next(false)))
            .subscribe(data => {
                this.teachersDataStore.teachers.forEach((u, i) => {
                    if (u.id === data.id) {
                        this.teachersDataStore.teachers[i] = data;
                    }
                });
                this.teachersSource.next(Object.assign({}, this.teachersDataStore).teachers);
                this.userUpdatedSubject.next(data);
            }, error => {
                if (error instanceof HttpErrorResponse) {
                    this.errorSubject.next(error.error.message);
                } else {
                    console.error('could not update user from store, ' + error.message);
                    this.errorSubject.next('Error al actualizar Docente');
                }
            }, () => this.successSubject.next('Docente Actualizado')
            );
    }

    deleteTeacher(user: User) {
        this.isLoadingSubject.next(true);
        this.userBackendService
            .delete(user, this.teacherUriRole)
            .pipe(finalize(() => this.isLoadingSubject.next(false)))
            .subscribe(_ => {
                this.teachersDataStore.teachers.forEach((u, i) => {
                    if (u.id === user.id) { this.teachersDataStore.teachers.splice(i, 1); }
                });
                this.teachersSource.next(Object.assign({}, this.teachersDataStore).teachers);
                this.userDeletedSubject.next(user);
            }, error => {
                if (error instanceof HttpErrorResponse) {
                    this.errorSubject.next(error.error.message);
                } else {
                    console.error('could not delete user from store, ' + error.message);
                    this.errorSubject.next('Error al borrar Docente');
                }
            }, () => this.successSubject.next('Docente Eliminado')
            );
    }

    setTeacherRoles(user: User) {
        this.isLoadingRolesSubject.next(true);
        this.userBackendService
            .setRoles(user.username, user.roles, this.teacherUriRole)
            .pipe(finalize(() => this.isLoadingRolesSubject.next(false)))
            .subscribe(data => {

                this.teachersDataStore.teachers.forEach((u, i) => {
                    if (u.id === data.id) {
                        data.roles.includes(this.teacherRole) ? this.teachersDataStore.teachers[i] = data : this.teachersDataStore.teachers.splice(i, 1);
                    }
                });
                this.teachersSource.next(Object.assign({}, this.teachersDataStore).teachers);
                this.setRolesSubject.next(data);
            }, error => {
                if (error instanceof HttpErrorResponse) {
                    this.errorSubject.next(error.error.message);
                } else {
                    console.error('could not set user role from store, ' + error.message);
                    this.errorSubject.next('Error al asignar privilégios');
                }
            }, () => this.successSubject.next('Privilégios asignados'));
    }

    updateTeacherInStore(user: User) {
        if (this.teachersDataStore.teachers.length) {
            let notFound = true;
            this.teachersDataStore.teachers.forEach((u, i) => {
                if (u.id === user.id) {
                    notFound = false;
                    if (user.roles.includes(this.teacherRole)) {
                        this.teachersDataStore.teachers[i] = user;
                        console.log('actualizado en la teacher-store');
                        this.teachersSource.next(Object.assign({}, this.teachersDataStore).teachers);
                    } else {
                        this.teachersDataStore.teachers.splice(i, 1);
                        console.log('eliminado de la teacher-store');
                        this.teachersSource.next(Object.assign({}, this.teachersDataStore).teachers);
                    }
                }
            });
            if (notFound && user.roles.includes(this.teacherRole)) {
                this.teachersDataStore.teachers.push(user);
                console.log('agregado a la teacher-store');
                this.teachersSource.next(Object.assign({}, this.teachersDataStore).teachers);
            }
        }
    }

    deleteTeacherInStore(user: User) {
        this.teachersDataStore.teachers.forEach((u, i) => {
            if (u.id === user.id) {
                this.teachersDataStore.teachers.splice(i, 1);
                console.log('eliminado en la teacher-store');
                this.teachersSource.next(Object.assign({}, this.teachersDataStore).teachers);
            }
        });
    }

    clearTeacherStore(): void {
        this.teachersDataStore = { teachers: [] };
        this.teachersSource.next(Object.assign({}, this.teachersDataStore).teachers);
    }


    /******************************STUDENTS***************************************************** */
    getStudents() {
        if (this.studentsDataStore.students.length) {
            console.log(`********GET-${this.studentRole}-CACHE********`);
            this.studentsSource.next(this.studentsDataStore.students);
        } else {
            console.log(`********GET-${this.studentRole}-BACKEND********`);
            this.isLoadingGetUsersSubject.next(true);
            this.userBackendService
                .getUsers(this.studentUriRole)
                .pipe(finalize(() => this.isLoadingGetUsersSubject.next(false)))
                .subscribe(data => {
                    if (data.length === 0) {
                        data = null;
                        this.successSubject.next('Lista de Alumnos vacia');
                    } else {
                        this.studentsDataStore.students = data;
                        this.studentsSource.next(Object.assign({}, this.studentsDataStore).students);
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
    }

    createStudent(user: User) {
        this.isLoadingSubject.next(true);
        this.userBackendService
            .create(user, this.studentUriRole)
            .pipe(finalize(() => this.isLoadingSubject.next(false)))
            .subscribe(data => {
                this.studentsDataStore.students.push(data);
                this.studentsSource.next(Object.assign({}, this.studentsDataStore).students);
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

    updateStudent(user: User) {
        this.isLoadingSubject.next(true);
        this.userBackendService
            .update(user, this.studentUriRole)
            .pipe(finalize(() => this.isLoadingSubject.next(false)))
            .subscribe(data => {
                this.studentsDataStore.students.forEach((u, i) => {
                    if (u.id === data.id) {
                        this.studentsDataStore.students[i] = data;
                    }
                });
                this.studentsSource.next(Object.assign({}, this.studentsDataStore).students);
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

    deleteStudent(user: User) {
        this.isLoadingSubject.next(true);
        this.userBackendService
            .delete(user, this.studentUriRole)
            .pipe(finalize(() => this.isLoadingSubject.next(false)))
            .subscribe(_ => {
                this.studentsDataStore.students.forEach((u, i) => {
                    if (u.id === user.id) { this.studentsDataStore.students.splice(i, 1); }
                });
                this.studentsSource.next(Object.assign({}, this.studentsDataStore).students);
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

    clearStudentStore(): void {
        this.studentsDataStore = { students: [] };
        this.studentsSource.next(Object.assign({}, this.studentsDataStore).students);
    }
}
