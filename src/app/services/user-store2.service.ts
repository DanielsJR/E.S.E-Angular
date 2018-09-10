import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { User } from "../models/user";
import { URI_MANAGERS, ROLE_MANAGER, URI_TEACHERS, ROLE_TEACHER, URI_STUDENTS, ROLE_STUDENT } from "../app.config";
import { UserBackendService } from "./user-backend.service";
import { Observable } from "rxjs/internal/Observable";
import { tap } from "rxjs/internal/operators/tap";
import { Subject } from "rxjs/internal/Subject";
import { finalize } from "rxjs/internal/operators/finalize";

@Injectable({
    providedIn: 'root',
})
export class UserStore2Service {
    private dataStore: { managers: User[], teachers: User[], students: User[] };

    private managersSource = <BehaviorSubject<User[]>>new BehaviorSubject([]);
    public readonly managers$ = this.managersSource.asObservable();
    private managerUriRole: string = URI_MANAGERS;
    private managerRole: string = ROLE_MANAGER;

    private teachersSource = <BehaviorSubject<User[]>>new BehaviorSubject([]);
    public readonly teachers$ = this.teachersSource.asObservable();
    private teacherUriRole: string = URI_TEACHERS;
    private teacherRole: string = ROLE_TEACHER;

    private studentsSource = <BehaviorSubject<User[]>>new BehaviorSubject([]);
    public readonly students$ = this.studentsSource.asObservable();
    private studentUriRole: string = URI_STUDENTS;
    private studentRole: string = ROLE_STUDENT;

    private isLoadingGetUsersSubject = <Subject<boolean>>new Subject();
    isLoadingGetUsers$ = this.isLoadingGetUsersSubject.asObservable();

    constructor(private userBackendService: UserBackendService) {
        this.dataStore = { managers: [], teachers: [], students: [] }
    }


    /******************************MANAGERS***************************************************** */
    loadInitialDataManagers() {
        if (this.managersSource.getValue().length) {
            console.log(`********INITIAL-DATA-${this.managerUriRole}-FROM-CACHE********`);
            this.managersSource.next(this.dataStore.managers);
        } else {
            console.log(`********INITIAL-DATA-${this.managerUriRole}-FROM-BACKEND********`);
            this.isLoadingGetUsersSubject.next(true);
            this.userBackendService.getUsers(this.managerUriRole)
            .pipe(finalize(() => this.isLoadingGetUsersSubject.next(false)))
                .subscribe(users => {
                    this.dataStore.managers = users;
                    this.managersSource.next(Object.assign({}, this.dataStore).managers);
                }, err => console.log("Error retrieving Manager")
                );
        }

    }

    createManager(newUser: User): Observable<User> {
        return this.userBackendService.create(newUser, this.managerUriRole).pipe(
            tap(data => {
                this.dataStore.managers.push(data);
                this.managersSource.next(Object.assign({}, this.dataStore).managers);
            }, err => console.log("Error creating Manager")
            ));
    }

    updateManager(user: User): Observable<User> {
        return this.userBackendService.update(user, this.managerUriRole).pipe(
            tap(data => {
                let index = this.dataStore.managers.findIndex((u: User) => u.id === data.id);
                if (index != -1) {
                    this.dataStore.managers[index] = data;
                    this.managersSource.next(Object.assign({}, this.dataStore).managers);
                }
            }, err => console.log("Error updating Manager")
            ));
    }

    deleteManager(user: User): Observable<boolean> {
        return this.userBackendService.delete(user, this.managerUriRole).pipe(
            tap(_ => {
                let index = this.dataStore.managers.findIndex((u: User) => u.id === user.id);
                if (index != -1) {
                    this.dataStore.managers.splice(index, 1);
                    this.managersSource.next(Object.assign({}, this.dataStore).managers);
                }
            }, err => console.log("Error deleting Manager")
            ));
    }

    setManagerRoles(user: User): Observable<User> {
        return this.userBackendService.setRoles(user.username, user.roles, this.managerUriRole).pipe(
            tap(data => {
                let index = this.dataStore.managers.findIndex((u: User) => u.id === data.id);
                if (index != -1) {
                    data.roles.includes(this.managerRole) ? this.dataStore.managers[index] = data : this.dataStore.managers.splice(index, 1);
                    this.managersSource.next(Object.assign({}, this.dataStore).managers);
                }
            }, err => console.log("Error setting Roles Manager")
            ));
    }

    updateInManagerDataStore(user: User): void {
        let index = this.dataStore.managers.findIndex((u: User) => u.id === user.id);

        if ((index != -1) && user.roles.includes(this.managerRole)) {
            this.dataStore.managers[index] = user;
            this.managersSource.next(Object.assign({}, this.dataStore).managers);
            console.log('actualizado en la manager-store');

        } else if ((index != -1)) {
            this.dataStore.managers.splice(index, 1);
            this.managersSource.next(Object.assign({}, this.dataStore).managers);
            console.log('eliminado de la manager-store');

        } else if ((index = -1) && user.roles.includes(this.managerRole)) {
            this.dataStore.managers.push(user);
            this.managersSource.next(Object.assign({}, this.dataStore).managers);
            console.log('agregado a la manager-store');

        } else {
            console.log("nothing to do");
        }

    }

    deleteInManagerDataStore(user: User): void {
        let index = this.dataStore.managers.findIndex((u: User) => u.id === user.id);

        if ((index != -1)) {
            this.dataStore.managers.splice(index, 1);
            this.managersSource.next(Object.assign({}, this.dataStore).managers);
            console.log('eliminado de la manager-store');

        } else {
            console.log("nothing to delete");
        }

    }




    /******************************TEACHERS***************************************************** */
    loadInitialDataTeachers() {
        if (this.teachersSource.getValue().length) {
            console.log(`********INITIAL-DATA-${this.teacherUriRole}-FROM-CACHE********`);
            this.teachersSource.next(this.dataStore.teachers);
        } else {
            console.log(`********INITIAL-DATA-${this.teacherUriRole}-FROM-BACKEND********`);
            this.isLoadingGetUsersSubject.next(true);
            this.userBackendService.getUsers(this.teacherUriRole)
            .pipe(finalize(() => this.isLoadingGetUsersSubject.next(false)))
                .subscribe(users => {
                    this.dataStore.teachers = users;
                    this.teachersSource.next(Object.assign({}, this.dataStore).teachers);
                }, err => console.log("Error retrieving teacher")
                );
        }

    }

    createTeacher(newUser: User): Observable<User> {
        return this.userBackendService.create(newUser, this.teacherUriRole).pipe(
            tap(data => {
                this.dataStore.teachers.push(data);
                this.teachersSource.next(Object.assign({}, this.dataStore).teachers);
            }, err => console.log("Error creating teacher")
            ));
    }

    updateTeacher(user: User): Observable<User> {
        return this.userBackendService.update(user, this.teacherUriRole).pipe(
            tap(data => {
                let index = this.dataStore.teachers.findIndex((u: User) => u.id === data.id);
                if (index != -1) {
                    this.dataStore.teachers[index] = data;
                    this.teachersSource.next(Object.assign({}, this.dataStore).teachers);
                }
            }, err => console.log("Error updating teacher")
            ));
    }

    deleteTeacher(user: User): Observable<boolean> {
        return this.userBackendService.delete(user, this.teacherUriRole).pipe(
            tap(_ => {
                let index = this.dataStore.teachers.findIndex((u: User) => u.id === user.id);
                if (index != -1) {
                    this.dataStore.teachers.splice(index, 1);
                    this.teachersSource.next(Object.assign({}, this.dataStore).teachers);
                }
            }, err => console.log("Error deleting teacher")
            ));
    }

    setTeacherRoles(user: User): Observable<User> {
        return this.userBackendService.setRoles(user.username, user.roles, this.teacherUriRole).pipe(
            tap(data => {
                let index = this.dataStore.teachers.findIndex((u: User) => u.id === data.id);
                if (index != -1) {
                    data.roles.includes(this.teacherRole) ? this.dataStore.teachers[index] = data : this.dataStore.teachers.splice(index, 1);
                    this.teachersSource.next(Object.assign({}, this.dataStore).teachers);
                }
            }, err => console.log("Error setting Roles teacher")
            ));
    }

    updateInTeacherDataStore(user: User): void {
        let index = this.dataStore.teachers.findIndex((u: User) => u.id === user.id);

        if ((index != -1) && user.roles.includes(this.teacherRole)) {
            this.dataStore.teachers[index] = user;
            this.teachersSource.next(Object.assign({}, this.dataStore).teachers);
            console.log('actualizado en la teacher-store');

        } else if ((index != -1)) {
            this.dataStore.teachers.splice(index, 1);
            this.teachersSource.next(Object.assign({}, this.dataStore).teachers);
            console.log('eliminado de la teacher-store');

        } else if ((index = -1) && user.roles.includes(this.teacherRole)) {
            this.dataStore.teachers.push(user);
            this.teachersSource.next(Object.assign({}, this.dataStore).teachers);
            console.log('agregado a la teacher-store');

        } else {
            console.log("nothing to do");
        }

    }

    deleteInTeacherDataStore(user: User): void {
        let index = this.dataStore.teachers.findIndex((u: User) => u.id === user.id);

        if ((index != -1)) {
            this.dataStore.teachers.splice(index, 1);
            this.teachersSource.next(Object.assign({}, this.dataStore).teachers);
            console.log('eliminado de la teacher-store');

        } else {
            console.log("nothing to delete");
        }

    }



    /******************************STUDENTS***************************************************** */
    loadInitialDataStudents() {
        if (this.studentsSource.getValue().length) {
            console.log(`********INITIAL-DATA-${this.studentUriRole}-FROM-CACHE********`);
            this.studentsSource.next(this.dataStore.students);
        } else {
            console.log(`********INITIAL-DATA-${this.studentUriRole}-FROM-BACKEND********`);
            this.isLoadingGetUsersSubject.next(true);
            this.userBackendService.getUsers(this.studentUriRole)
            .pipe(finalize(() => this.isLoadingGetUsersSubject.next(false)))
                .subscribe(users => {
                    this.dataStore.students = users;
                    this.studentsSource.next(Object.assign({}, this.dataStore).students);
                }, err => console.log("Error retrieving student")
                );
        }

    }

    createStudent(newUser: User): Observable<User> {
        return this.userBackendService.create(newUser, this.studentUriRole).pipe(
            tap(data => {
                this.dataStore.students.push(data);
                this.studentsSource.next(Object.assign({}, this.dataStore).students);
            }, err => console.log("Error creating student")
            ));
    }

    updateStudent(user: User): Observable<User> {
        return this.userBackendService.update(user, this.studentUriRole).pipe(
            tap(data => {
                let index = this.dataStore.students.findIndex((u: User) => u.id === data.id);
                if (index != -1) {
                    this.dataStore.students[index] = data;
                    this.studentsSource.next(Object.assign({}, this.dataStore).students);
                }
            }, err => console.log("Error updating student")
            ));
    }

    deleteStudent(user: User): Observable<boolean> {
        return this.userBackendService.delete(user, this.studentUriRole).pipe(
            tap(_ => {
                let index = this.dataStore.students.findIndex((u: User) => u.id === user.id);
                if (index != -1) {
                    this.dataStore.students.splice(index, 1);
                    this.studentsSource.next(Object.assign({}, this.dataStore).students);
                }
            }, err => console.log("Error deleting student")
            ));
    }


}