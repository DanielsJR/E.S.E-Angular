import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Course } from "../models/course";
import { finalize } from "rxjs/internal/operators/finalize";
import { tap } from "rxjs/internal/operators/tap";
import { IsLoadingService } from "./isLoadingService.service";
import { Subject } from "../models/subject";
import { SubjectBackendService } from "./subject-backend.service";



@Injectable({
    providedIn: 'root',
})
export class SubjectStoreService {


    private subjectsSource = <BehaviorSubject<Course[]>>new BehaviorSubject([]);
    public readonly subjects$ = this.subjectsSource.asObservable();
    private dataStore: { subjects: Subject[] };
    private isLoadingGet = <BehaviorSubject<boolean>>new BehaviorSubject(false);
    isLoadingGetSubjects$ = this.isLoadingGet.asObservable();


    constructor(private subjectBackendService: SubjectBackendService, private isLoadingService: IsLoadingService) {
        this.dataStore = { subjects: [] };
    }

    loadAllSubjects() {
        if (this.subjectsSource.getValue().length) {
            console.log(`********GET-Subjects-FROM-CACHE********`);
            this.subjectsSource.next(this.dataStore.subjects);
        } else {
            console.log(`********GET-Subjects-FROM-BACKEND********`);
            this.isLoadingGet.next(true);
            this.subjectBackendService.getSubjects()
                .pipe(finalize(() => this.isLoadingGet.next(false)))
                .subscribe(data => {
                    if (data.length) {
                        this.dataStore.subjects = data;
                        this.subjectsSource.next(Object.assign({}, this.dataStore).subjects);
                    } else {
                        data = null;
                        console.error('Lista de subject vacia');
                    }
                }, error => console.error('error retrieving subjects, ' + error.message)
                );
        }

    }

    loadOneSubject(name: string) {
        console.log(`********loadOneCourse()-FROM-BACKEND********`);
        if (!this.subjectsSource.getValue().length) this.isLoadingGet.next(true);
        this.subjectBackendService.getSubjectByName(name)
            .pipe(finalize(() => this.isLoadingGet.next(false)))
            .subscribe(data => {
                let notFound = true;

                this.dataStore.subjects.forEach((item, index) => {
                    if (item.id === data.id) {
                        this.dataStore.subjects[index] = data;
                        notFound = false;
                    }
                });

                if (notFound) {
                    this.dataStore.subjects.push(data);
                }

                this.subjectsSource.next(Object.assign({}, this.dataStore).subjects);
            }, error => console.log('Could not load subject.'));
    }

    create(subject: Subject): Observable<Subject> {
        return this.subjectBackendService.create(subject)
            .pipe(
                tap(data => {
                    this.dataStore.subjects.push(data);
                    this.subjectsSource.next(Object.assign({}, this.dataStore).subjects);
                }, error => console.error('could not create subject, ' + error.message)
                ));
    }

    update(subject: Subject): Observable<Subject> {
        this.isLoadingService.isLoadingTrue();
        return this.subjectBackendService.update(subject)
            .pipe(
                finalize(() => this.isLoadingService.isLoadingFalse()),
                tap(data => {
                    let index = this.dataStore.subjects.findIndex(c => c.id === data.id);
                    if (index != -1) {
                        this.dataStore.subjects[index] = data;
                        this.subjectsSource.next(Object.assign({}, this.dataStore).subjects);
                    } else {
                        console.error("not found in dataStore.subjects");
                    }
                }, err => console.error("Error updating subject" + err.message)
                ));
    }

    delete(subject: Subject | string): Observable<boolean> {
        return this.subjectBackendService.delete(subject)
            .pipe(
                tap(_ => {
                    let index = this.dataStore.subjects.findIndex((c: Course) => c.id === ((typeof subject === 'string') ? subject : subject.id));
                    if (index != -1) {
                        this.dataStore.subjects.splice(index, 1);
                        this.subjectsSource.next(Object.assign({}, this.dataStore).subjects);
                    } else {
                        console.error("not found in dataStore.subjects");
                    }
                }, err => console.error("Error deleting subject" + err.message)
                ));
    }

}


/* 

    //************CHIEF_TEACHER**
    updateChiefTeacher(teacher: User) {
        let curso = this.dataStore.courses.find(c => c.chiefTeacher.id === teacher.id);
        if (curso) {
            curso.chiefTeacher = teacher;
            let index = this.dataStore.courses.findIndex(c => c.id === curso.id);
            if (index != -1) {
                this.dataStore.courses[index] = curso;
                this.coursesSource.next(Object.assign({}, this.dataStore).courses);
            } else {
                console.error("not found in dataStore.courses");
            }
        }
    }


    //************STUDENTS**
    private isStudentInACourse(student: User, students: User[]): boolean {
        let found = false;
        students.forEach((s) => {
            if (s.id === student.id)
                found = true;
        });
        return found;
    }

    updateStudentInCourse(student: User) {
        let curso = this.dataStore.courses.find(c => this.isStudentInACourse(student, c.students));
        if (curso) {
            let list = curso.students.slice();
            list.forEach((item, index) => {
                if (item.id === student.id) {
                    curso.students[index] = student;
                }
            });

            let index = this.dataStore.courses.findIndex(c => c.id === curso.id);
            if (index != -1) {
                this.dataStore.courses[index] = curso;
                this.coursesSource.next(Object.assign({}, this.dataStore).courses);
            } else {
                console.error("not found in dataStore.courses");
            }
        }

    }

    deleteStudentInCourse(student: User) {
        let curso = this.dataStore.courses.find(c => this.isStudentInACourse(student, c.students));
        if (curso) {
            let list = curso.students.slice();
            list.forEach((item, index) => {
                if (item.id === student.id) {
                    curso.students.splice(index, 1);
                }
            });

            let index = this.dataStore.courses.findIndex(c => c.id === curso.id);
            if (index != -1) {
                this.dataStore.courses[index] = curso;
                this.coursesSource.next(Object.assign({}, this.dataStore).courses);
            } else {
                console.error("not found in dataStore.courses");
            }
        }

    }
}

*/