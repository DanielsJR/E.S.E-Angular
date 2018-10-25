import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { User } from "../models/user";
import { URI_MANAGERS, ROLE_MANAGER, URI_TEACHERS, ROLE_TEACHER, URI_STUDENTS, ROLE_STUDENT } from "../app.config";
import { UserBackendService } from "./user-backend.service";
import { Observable } from "rxjs/internal/Observable";
import { tap } from "rxjs/internal/operators/tap";
import { finalize } from "rxjs/internal/operators/finalize";
import { CourseStoreService } from "./course-store.service";


@Injectable({
    providedIn: 'root',
})
export class UserStoreService {
    private dataStore: { managers: User[], teachers: User[], students: User[] };

    private managersSource = <BehaviorSubject<User[]>>new BehaviorSubject([]);
    public readonly managers$ = this.managersSource.asObservable();
    private managerUriRole: string = URI_MANAGERS;
    private managerRole: string = ROLE_MANAGER;
    private isLoadingGetManagersSubject = <BehaviorSubject<boolean>>new BehaviorSubject(false);
    isLoadingGetManagers$ = this.isLoadingGetManagersSubject.asObservable();

    private teachersSource = <BehaviorSubject<User[]>>new BehaviorSubject([]);
    public readonly teachers$ = this.teachersSource.asObservable();
    private teacherUriRole: string = URI_TEACHERS;
    private teacherRole: string = ROLE_TEACHER;
    private isLoadingGetTeachersSubject = <BehaviorSubject<boolean>>new BehaviorSubject(false);
    isLoadingGetTeachers$ = this.isLoadingGetTeachersSubject.asObservable();

    private studentsSource = <BehaviorSubject<User[]>>new BehaviorSubject([]);
    public readonly students$ = this.studentsSource.asObservable();
    private studentUriRole: string = URI_STUDENTS;
    private studentRole: string = ROLE_STUDENT;
    private isLoadingGetStudentsSubject = <BehaviorSubject<boolean>>new BehaviorSubject(false);
    isLoadingGetStudents$ = this.isLoadingGetStudentsSubject.asObservable();


    constructor(private userBackendService: UserBackendService, private courseStoreService: CourseStoreService) {
        this.dataStore = { managers: [], teachers: [], students: [] }
    }


    /******************************MANAGERS***************************************************** */
    loadAllManagers() {
        if (this.managersSource.getValue().length) {
            console.log(`********GET-Managers-FROM-CACHE********`);
            this.managersSource.next(this.dataStore.managers);

        } else {
            console.log(`********GET-Managers-FROM-BACKEND********`);
            this.isLoadingGetManagersSubject.next(true);
            this.userBackendService.getUsers(this.managerUriRole).pipe(
                finalize(() => this.isLoadingGetManagersSubject.next(false)))
                .subscribe(users => {
                    if (users.length) {
                        this.dataStore.managers = users;
                        this.managersSource.next(Object.assign({}, this.dataStore).managers);
                    } else {
                        users = null;
                        console.error('Lista de Managers vacia');
                    }
                }, err => console.error("Error retrieving Manager" + err.message)
                );
        }

    }

    loadOneManager(id: string) {
        console.log(`********loadOneManager()-FROM-BACKEND********`);
        this.userBackendService.getUserById(id, this.managerUriRole)
            .subscribe(data => {
                let notFound = true;

                this.dataStore.managers.forEach((item, index) => {
                    if (item.id === data.id) {
                        this.dataStore.managers[index] = data;
                        notFound = false;
                    }
                });

                if (notFound) {
                    this.dataStore.managers.push(data);
                }

                this.managersSource.next(Object.assign({}, this.dataStore).managers);
            }, error => console.log('Could not load manager.'));
    }



    createManager(newUser: User): Observable<User> {
        return this.userBackendService.create(newUser, this.managerUriRole).pipe(
            tap(data => {
                this.dataStore.managers.push(data);
                this.managersSource.next(Object.assign({}, this.dataStore).managers);
            }, err => console.error("Error creating Manager" + err.message)
            ));
    }

    updateManager(user: User): Observable<User> {
        return this.userBackendService.update(user, this.managerUriRole).pipe(
            tap(data => {
                let index = this.dataStore.managers.findIndex((u: User) => u.id === data.id);
                if (index != -1) {
                    this.dataStore.managers[index] = data;
                    this.managersSource.next(Object.assign({}, this.dataStore).managers);
                    this.updateInTeacherDataStore(data);
                    this.courseStoreService.updateChiefTeacher(data);
                } else {
                    console.error("not found in dataStore.namagers");
                }
            }, err => console.error("Error updating Manager" + err.message)
            ));
    }

    deleteManager(user: User): Observable<boolean> {
        return this.userBackendService.delete(user, this.managerUriRole).pipe(
            tap(_ => {
                let index = this.dataStore.managers.findIndex((u: User) => u.id === user.id);
                if (index != -1) {
                    this.dataStore.managers.splice(index, 1);
                    this.managersSource.next(Object.assign({}, this.dataStore).managers);
                    this.deleteInTeacherDataStore(user);
                } else {
                    console.error("not found in dataStore.namagers");
                }
            }, err => console.error("Error deleting Manager" + err.message)
            ));
    }

    setManagerRoles(user: User): Observable<User> {
        return this.userBackendService.setRoles(user.username, user.roles, this.managerUriRole).pipe(
            tap(data => {
                let index = this.dataStore.managers.findIndex((u: User) => u.id === data.id);
                if (index != -1) {
                    data.roles.includes(this.managerRole) ? this.dataStore.managers[index] = data : this.dataStore.managers.splice(index, 1);
                    this.managersSource.next(Object.assign({}, this.dataStore).managers);
                    this.updateInTeacherDataStore(data);
                }
            }, err => console.error("Error setting Roles Manager" + err.message)
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
            console.log("nothing to updateInManagerDataStore");
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
    loadAllTeachers() {
        if (this.teachersSource.getValue().length) {
            console.log(`********GET-Teachers-FROM-CACHE********`);
            this.teachersSource.next(this.dataStore.teachers);
        } else {
            console.log(`********GET-Teachers-FROM-BACKEND********`);
            this.isLoadingGetTeachersSubject.next(true);
            this.userBackendService.getUsers(this.teacherUriRole)
                .pipe(finalize(() => this.isLoadingGetTeachersSubject.next(false)))
                .subscribe(users => {
                    this.dataStore.teachers = users;
                    this.teachersSource.next(Object.assign({}, this.dataStore).teachers);
                }, err => console.error("Error retrieving teacher")
                );
        }

    }

    loadOneTeacher(id: string) {
        console.log(`********loadOneTeacher()-FROM-BACKEND********`);
        this.userBackendService.getUserById(id, this.teacherUriRole)
            .subscribe(data => {
                let notFound = true;

                this.dataStore.teachers.forEach((item, index) => {
                    if (item.id === data.id) {
                        this.dataStore.teachers[index] = data;
                        notFound = false;
                    }
                });

                if (notFound) {
                    this.dataStore.teachers.push(data);
                }

                this.teachersSource.next(Object.assign({}, this.dataStore).teachers);
            }, error => console.log('Could not load teacher.'));
    }

    createTeacher(newUser: User): Observable<User> {
        return this.userBackendService.create(newUser, this.teacherUriRole).pipe(
            tap(data => {
                this.dataStore.teachers.push(data);
                this.teachersSource.next(Object.assign({}, this.dataStore).teachers);
            }, err => console.error("Error creating teacher")
            ));
    }

    updateTeacher(user: User): Observable<User> {
        return this.userBackendService.update(user, this.teacherUriRole).pipe(
            tap(data => {
                let index = this.dataStore.teachers.findIndex((u: User) => u.id === data.id);
                if (index != -1) {
                    this.dataStore.teachers[index] = data;
                    this.teachersSource.next(Object.assign({}, this.dataStore).teachers);
                    this.updateInManagerDataStore(data);
                    this.courseStoreService.updateChiefTeacher(data);
                } else {
                    console.error("not found in dataStore.teachers");
                }
            }, err => console.error("Error updating teacher")
            ));
    }

    deleteTeacher(user: User): Observable<boolean> {
        return this.userBackendService.delete(user, this.teacherUriRole).pipe(
            tap(_ => {
                let index = this.dataStore.teachers.findIndex((u: User) => u.id === user.id);
                if (index != -1) {
                    this.dataStore.teachers.splice(index, 1);
                    this.teachersSource.next(Object.assign({}, this.dataStore).teachers);
                    this.deleteInManagerDataStore(user);
                } else {
                    console.error("not found in dataStore.teachers");
                }
            }, err => console.error("Error deleting teacher")
            ));
    }

    setTeacherRoles(user: User): Observable<User> {
        return this.userBackendService.setRoles(user.username, user.roles, this.teacherUriRole).pipe(
            tap(data => {
                let index = this.dataStore.teachers.findIndex((u: User) => u.id === data.id);
                if (index != -1) {
                    data.roles.includes(this.teacherRole) ? this.dataStore.teachers[index] = data : this.dataStore.teachers.splice(index, 1);
                    this.teachersSource.next(Object.assign({}, this.dataStore).teachers);
                    this.updateInManagerDataStore(data);
                }
            }, err => console.error("Error setting Roles teacher")
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
            console.log("nothing to updateInTeacherDataStore");
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
    loadAllStudents() {
        if (this.studentsSource.getValue().length) {
            console.log(`********GET-Students-FROM-CACHE********`);
            this.studentsSource.next(this.dataStore.students);
        } else {
            console.log(`********GET-Students-FROM-BACKEND********`);
            this.isLoadingGetStudentsSubject.next(true);
            this.userBackendService.getUsers(this.studentUriRole)
                .pipe(finalize(() => this.isLoadingGetStudentsSubject.next(false)))
                .subscribe(users => {
                    this.dataStore.students = users;
                    this.studentsSource.next(Object.assign({}, this.dataStore).students);
                }, err => console.error("Error retrieving student")
                );
        }

    }

    loadOneStudent(id: string) {
        console.log(`********loadOneStudent()-FROM-BACKEND********`);
        this.userBackendService.getUserById(id, this.studentUriRole)
            .subscribe(data => {
                let notFound = true;

                this.dataStore.students.forEach((item, index) => {
                    if (item.id === data.id) {
                        this.dataStore.students[index] = data;
                        notFound = false;
                    }
                });

                if (notFound) {
                    this.dataStore.students.push(data);
                }

                this.studentsSource.next(Object.assign({}, this.dataStore).students);
            }, error => console.log('Could not load student.'));
    }

    createStudent(newUser: User): Observable<User> {
        return this.userBackendService.create(newUser, this.studentUriRole).pipe(
            tap(data => {
                this.dataStore.students.push(data);
                this.studentsSource.next(Object.assign({}, this.dataStore).students);
            }, err => console.error("Error creating student")
            ));
    }

    updateStudent(user: User): Observable<User> {
        return this.userBackendService.update(user, this.studentUriRole).pipe(
            tap(data => {
                let index = this.dataStore.students.findIndex((u: User) => u.id === data.id);
                if (index != -1) {
                    this.dataStore.students[index] = data;
                    this.studentsSource.next(Object.assign({}, this.dataStore).students);
                    this.courseStoreService.updateStudentInCourse(data);
                } else {
                    console.error("not found in dataStore.students");
                }
            }, err => console.error("Error updating student")
            ));
    }

    deleteStudent(user: User): Observable<boolean> {
        return this.userBackendService.delete(user, this.studentUriRole).pipe(
            tap(_ => {
                let index = this.dataStore.students.findIndex((u: User) => u.id === user.id);
                if (index != -1) {
                    this.dataStore.students.splice(index, 1);
                    this.studentsSource.next(Object.assign({}, this.dataStore).students);
                    this.courseStoreService.deleteStudentInCourse(user);
                } else {
                    console.error("not found in dataStore.students");
                }
            }, err => console.error("Error deleting student")
            ));
    }


}