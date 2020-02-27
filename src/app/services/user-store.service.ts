import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { User } from "../models/user";
import { URI_MANAGERS, ROLE_MANAGER, URI_TEACHERS, ROLE_TEACHER, URI_STUDENTS, ROLE_STUDENT } from "../app.config";
import { UserBackendService } from "./user-backend.service";
import { Observable } from "rxjs/internal/Observable";
import { tap } from "rxjs/internal/operators/tap";
import { finalize } from "rxjs/internal/operators/finalize";
import { CourseStoreService } from "./course-store.service";
import { GradeStoreService } from "./grade-store.service";
import { map } from "rxjs/internal/operators/map";
import { SubjectStoreService } from "./subject-store.service";


@Injectable({
    providedIn: 'root',
})
export class UserStoreService {
    private dataStore: { managers: User[], teachers: User[], students: User[] };

    private managersSource = <BehaviorSubject<User[]>>new BehaviorSubject([]);
    private managerUriRole: string = URI_MANAGERS;
    private managerRole: string = ROLE_MANAGER;
    private isLoadingGetManagers = <BehaviorSubject<boolean>>new BehaviorSubject(false);

    private teachersSource = <BehaviorSubject<User[]>>new BehaviorSubject([]);
    private teacherUriRole: string = URI_TEACHERS;
    private teacherRole: string = ROLE_TEACHER;
    private isLoadingGetTeachers = <BehaviorSubject<boolean>>new BehaviorSubject(false);

    private studentsSource = <BehaviorSubject<User[]>>new BehaviorSubject([]);
    private studentUriRole: string = URI_STUDENTS;
    private studentRole: string = ROLE_STUDENT;
    private isLoadingGetStudents = <BehaviorSubject<boolean>>new BehaviorSubject(false);

    constructor(private userBackendService: UserBackendService,
        private courseStoreService: CourseStoreService,
        private subjectStoreService: SubjectStoreService,
        private gradeStoreService: GradeStoreService) {
        this.dataStore = { managers: [], teachers: [], students: [] }
    }


    /******************************MANAGERS***************************************************** */

    get managers$() {
        return this.managersSource.asObservable();
    }

    get isLoadingGetManagers$() {
        return this.isLoadingGetManagers.asObservable();
    }

    loadAllManagers() {
        if (this.managersSource.getValue().length) {
            console.log(`********GET-Managers-FROM-CACHE********`);
            this.managersSource.next(this.dataStore.managers);

        } else {
            console.log(`********GET-Managers-FROM-BACKEND********`);
            this.isLoadingGetManagers.next(true);
            this.userBackendService.getUsers(this.managerUriRole).pipe(
                finalize(() => this.isLoadingGetManagers.next(false)))
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
        return this.managers$
            .pipe(map(managers => managers.find(manager => manager.id === id)));
    }

    createManager(user: User): Observable<User> {
        return this.userBackendService.create(user, this.managerUriRole).pipe(
            tap(data => {
                this.dataStore.managers.push(data);
                this.managersSource.next(Object.assign({}, this.dataStore).managers);
            }, err => console.error("Error creating Manager" + err.message)
            ));

    }

    updateManager(user: User): Observable<User> {
        return this.userBackendService.update(user, this.managerUriRole).pipe(
            tap(data => {
                this.updateInManagerDataStore(data);
                this.updateInTeacherDataStore(data);

            }, err => console.error('Error updating Manager', err.message)
            ));
    }

    deleteManager(user: User): Observable<boolean> {
        return this.userBackendService.delete(user, this.managerUriRole).pipe(
            tap(_ => {
                this.deleteInManagerDataStore(user);
                this.deleteInTeacherDataStore(user);

            }, err => console.error("Error deleting Manager" + err.message)
            ));
    }

    setManagerRoles(user: User): Observable<User> {
        return this.userBackendService.setRoles(user, this.managerUriRole).pipe(
            tap(data => {
                this.updateInManagerDataStore(data);
                this.updateInTeacherDataStore(data);

            }, err => console.error('Error setting Roles Manager', err.message)
            ));
    }

    updateInManagerDataStore(user: User): void {
        let index = this.dataStore.managers.findIndex((u: User) => u.id === user.id);

        if ((index != -1) && user.roles.includes(this.managerRole)) {
            console.log('found and includes role (it updates)');
            this.dataStore.managers[index] = user;
            this.managersSource.next(Object.assign({}, this.dataStore).managers);

        } else if (index != -1) {
            console.log('found and not includes role (it deletes)');
            this.dataStore.managers.splice(index, 1);
            this.managersSource.next(Object.assign({}, this.dataStore).managers);

        } else if ((index = -1) && user.roles.includes(this.managerRole)) {
            console.log('not found and includes role (it adds)');
            this.dataStore.managers.push(user);
            this.managersSource.next(Object.assign({}, this.dataStore).managers);
        } else {
            console.log('not found and not includes role (it does nothing)')
        }

    }

    deleteInManagerDataStore(user: User): void {
        let index = this.dataStore.managers.findIndex((u: User) => u.id === user.id);

        if (index != -1) {
            this.dataStore.managers.splice(index, 1);
            this.managersSource.next(Object.assign({}, this.dataStore).managers);
        }
        else {
            console.error('not found in deleteInManagerDataStore()');
        }
    }




    /******************************TEACHERS***************************************************** */

    get teachers$() {
        return this.teachersSource.asObservable();
    }

    get isLoadingGetTeachers$() {
        return this.isLoadingGetTeachers.asObservable();
    }

    loadAllTeachers() {
        if (this.teachersSource.getValue().length) {
            console.log(`********GET-Teachers-FROM-CACHE********`);
            this.teachersSource.next(this.dataStore.teachers);
        } else {
            console.log(`********GET-Teachers-FROM-BACKEND********`);
            this.isLoadingGetTeachers.next(true);
            this.userBackendService.getUsers(this.teacherUriRole)
                .pipe(finalize(() => this.isLoadingGetTeachers.next(false)))
                .subscribe(users => {
                    this.dataStore.teachers = users;
                    this.teachersSource.next(Object.assign({}, this.dataStore).teachers);
                }, err => console.error("Error retrieving teacher")
                );
        }

    }

    loadOneTeacher(id: string) {
        return this.teachers$
            .pipe(map(teachers => teachers.find(teacher => teacher.id === id)));
    }

    createTeacher(user: User): Observable<User> {
        return this.userBackendService.create(user, this.teacherUriRole).pipe(
            tap(data => {
                this.dataStore.teachers.push(data);
                this.teachersSource.next(Object.assign({}, this.dataStore).teachers);
            }, err => console.error("Error creating teacher")
            ));
    }

    updateTeacher(user: User): Observable<User> {
        return this.userBackendService.update(user, this.teacherUriRole).pipe(
            tap(data => {
                this.updateInManagerDataStore(data);
                this.updateInTeacherDataStore(data);

            }, err => console.error("Error updating teacher", err.message)
            ));
    }

    deleteTeacher(user: User): Observable<boolean> {
        return this.userBackendService.delete(user, this.teacherUriRole).pipe(
            tap(_ => {
                this.deleteInTeacherDataStore(user);
                this.deleteInManagerDataStore(user);

            }, err => console.error('Error deleting teacher', err.message)
            ));
    }

    setTeacherRoles(user: User): Observable<User> {
        return this.userBackendService.setRoles(user, this.teacherUriRole).pipe(
            tap(data => {
                this.updateInManagerDataStore(data);
                this.updateInTeacherDataStore(data);

            }, err => console.error('Error setting Roles teacher', err.message)
            ));
    }

    updateInTeacherDataStore(user: User): void {
        let index = this.dataStore.teachers.findIndex((u: User) => u.id === user.id);

        if ((index != -1) && user.roles.includes(this.teacherRole)) {
            console.log('found and includes role (it updates)');
            this.dataStore.teachers[index] = user;
            this.teachersSource.next(Object.assign({}, this.dataStore).teachers);
            this.courseStoreService.updateChiefTeacherInCourseStoreOneToOne(user);
            this.subjectStoreService.updateTeacherInSubjectStore(user);

        } else if (index != -1) {
            console.log('found and not includes role (it deletes)');
            this.dataStore.teachers.splice(index, 1);
            this.teachersSource.next(Object.assign({}, this.dataStore).teachers);
            this.courseStoreService.updateChiefTeacherInCourseStoreOneToOne(user);
            this.subjectStoreService.updateTeacherInSubjectStore(user);

        } else if ((index = -1) && user.roles.includes(this.teacherRole)) {
            console.log('not found and includes role (it adds)');
            this.dataStore.teachers.push(user);
            this.teachersSource.next(Object.assign({}, this.dataStore).teachers);
            this.courseStoreService.updateChiefTeacherInCourseStoreOneToOne(user);
            this.subjectStoreService.updateTeacherInSubjectStore(user);

        } else {
            console.log('not found and not includes role (it does nothing)');
        }

    }

    deleteInTeacherDataStore(user: User): void {
        let index = this.dataStore.teachers.findIndex((u: User) => u.id === user.id);
        if (index != -1) {
            this.dataStore.teachers.splice(index, 1);
            this.teachersSource.next(Object.assign({}, this.dataStore).teachers);
        } else {
            console.error('not found in deleteInTeacherDataStore()');
        }

    }





    /******************************STUDENTS***************************************************** */

    get students$() {
        return this.studentsSource.asObservable();
    }

    get isLoadingGetStudents$() {
        return this.isLoadingGetStudents.asObservable();
    }

    loadAllStudents() {
        if (this.studentsSource.getValue().length) {
            console.log(`********GET-Students-FROM-CACHE********`);
            this.studentsSource.next(this.dataStore.students);
        } else {
            console.log(`********GET-Students-FROM-BACKEND********`);
            this.isLoadingGetStudents.next(true);
            this.userBackendService.getUsers(this.studentUriRole)
                .pipe(finalize(() => this.isLoadingGetStudents.next(false)))
                .subscribe(users => {
                    this.dataStore.students = users;
                    this.studentsSource.next(Object.assign({}, this.dataStore).students);
                }, err => console.error("Error retrieving student")
                );
        }

    }

    loadOneStudent(id: string) {
        return this.students$
            .pipe(map(students => students.find(student => student.id === id)));
    }

    createStudent(user: User): Observable<User> {
        return this.userBackendService.create(user, this.studentUriRole).pipe(
            tap(data => {
                this.dataStore.students.push(data);
                this.studentsSource.next(Object.assign({}, this.dataStore).students);
            }, err => console.error("Error creating student")
            ));
    }

    updateStudent(user: User): Observable<User> {
        return this.userBackendService.update(user, this.studentUriRole).pipe(
            tap(data => {
                this.updateInStudentDataStore(data);

            }, err => console.error('Error updating student', err.message)
            ));
    }

    deleteStudent(user: User): Observable<boolean> {
        return this.userBackendService.delete(user, this.studentUriRole).pipe(
            tap(_ => {
                this.deleteInStudentDataStore(user);
            }, err => console.error('Error deleting student', err.message)
            ));
    }

    updateInStudentDataStore(user: User): void {
        let index = this.dataStore.students.findIndex((u: User) => u.id === user.id);

        if ((index != -1) && user.roles.includes(this.studentRole)) {
            //console.log('found and includes role (it updates)');
            this.dataStore.students[index] = user;
            this.studentsSource.next(Object.assign({}, this.dataStore).students);
            this.courseStoreService.updateStudentInCourseStoreOneToOne(user);
            this.gradeStoreService.updateStudentInGradeStore(user);
        } else {
            console.log('not found and not includes role (it does nothing)');
        }

    }

    deleteInStudentDataStore(user: User | string): void {
        let index = this.dataStore.students.findIndex((u: User) => u.id === ((typeof user === 'string') ? user : user.id));

        if (index != -1) {
            this.dataStore.students.splice(index, 1);
            this.studentsSource.next(Object.assign({}, this.dataStore).students);
            this.courseStoreService.deleteStudentInCourseStoreOneToOne(user);
        } else {
            console.error('not found in deleteInStudentDataStore()');
        }

    }



}