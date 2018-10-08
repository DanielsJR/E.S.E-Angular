import { Injectable } from "../../../node_modules/@angular/core";
import { BehaviorSubject, Subject, Observable } from "../../../node_modules/rxjs";
import { Course } from "../models/course";
import { HttpClient, HttpErrorResponse } from "../../../node_modules/@angular/common/http";
import { finalize } from "../../../node_modules/rxjs/internal/operators/finalize";
import { CourseBackendService } from "./course-backend.service";
import { tap } from "rxjs/internal/operators/tap";
import { User } from "../models/user";



@Injectable({
    providedIn: 'root',
})
export class CourseStoreService {


    private coursesSource = <BehaviorSubject<Course[]>>new BehaviorSubject([]);
    public readonly courses$ = this.coursesSource.asObservable();
    private dataStore: { courses: Course[] };
    private isLoadingGetCoursesSubject = <BehaviorSubject<boolean>>new BehaviorSubject(false);
    isLoadingGetCourses$ = this.isLoadingGetCoursesSubject.asObservable();


    constructor(private courseBackendService: CourseBackendService, private httpCli: HttpClient) {
        this.dataStore = { courses: [] };
    }

    loadAllCourses(year: number) {
        if (this.coursesSource.getValue().length) {
            console.log(`********GET-Courses-CACHE********`);
            this.coursesSource.next(this.dataStore.courses);
        } else {
            console.log(`********GET-Courses-BACKEND********`);
            this.isLoadingGetCoursesSubject.next(true);
            this.courseBackendService.getCourses(year)
                .pipe(finalize(() => this.isLoadingGetCoursesSubject.next(false)))
                .subscribe(data => {
                    if (data.length) {
                        this.dataStore.courses = data;
                        this.coursesSource.next(Object.assign({}, this.dataStore).courses);
                    } else {
                        data = null;
                        console.error('Lista de Cursos vacia');
                    }
                }, error => console.error('error retrieving cursos, ' + error.message)
                );
        }

    }

    loadOneCourse(name: string, year: number) {
        console.log(`********loadOneCourse()-FROM-BACKEND********`);
        if (!this.coursesSource.getValue().length) this.isLoadingGetCoursesSubject.next(true);
        this.courseBackendService.getCourseByName(name, year)
            .pipe(finalize(() => this.isLoadingGetCoursesSubject.next(false)))
            .subscribe(data => {
                let notFound = true;

                this.dataStore.courses.forEach((item, index) => {
                    if (item.id === data.id) {
                        this.dataStore.courses[index] = data;
                        notFound = false;
                    }
                });

                if (notFound) {
                    this.dataStore.courses.push(data);
                }

                this.coursesSource.next(Object.assign({}, this.dataStore).courses);
            }, error => console.log('Could not load course.'));
    }


    create(course: Course): Observable<Course> {
        return this.courseBackendService.create(course)
            .pipe(
                tap(data => {
                    this.dataStore.courses.push(data);
                    this.coursesSource.next(Object.assign({}, this.dataStore).courses);
                }, error => console.error('could not create User, ' + error.message)
                ));
    }




    update(course: Course): Observable<Course> {
        return this.courseBackendService.update(course)
            .pipe(
                tap(data => {
                    let index = this.dataStore.courses.findIndex(c => c.id === data.id);
                    if (index != -1) {
                        this.dataStore.courses[index] = data;
                        this.coursesSource.next(Object.assign({}, this.dataStore).courses);
                    } else {
                        console.error("not found in dataStore.courses");
                    }
                }, err => console.error("Error updating Manager" + err.message)
                ));
    }

    delete(course: Course | string): Observable<boolean> {
        return this.courseBackendService.delete(course)
            .pipe(
                tap(_ => {
                    let index = this.dataStore.courses.findIndex((c: Course) => c.id === ((typeof course === 'string') ? course : course.name));
                    if (index != -1) {
                        this.dataStore.courses.splice(index, 1);
                        this.coursesSource.next(Object.assign({}, this.dataStore).courses);
                    } else {
                        console.error("not found in dataStore.courses");
                    }
                }, err => console.error("Error deleting Manager" + err.message)
                ));
    }

    //************CHIEF_TEACHER*/
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


    //************STUDENTS*/
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
                    curso.students.splice(index,1);
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