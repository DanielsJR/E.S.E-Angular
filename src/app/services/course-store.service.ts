import { Injectable } from "../../../node_modules/@angular/core";
import { BehaviorSubject, Subject } from "../../../node_modules/rxjs";
import { Course } from "../models/course";
import { HttpClient, HttpErrorResponse } from "../../../node_modules/@angular/common/http";
import { finalize } from "../../../node_modules/rxjs/internal/operators/finalize";
import { CourseBackendService } from "./course-backend.service";



@Injectable({
    providedIn: 'root',
})
export class CourseStoreService {

    private coursesSource = <BehaviorSubject<Course[]>>new BehaviorSubject([]);
    public readonly courses$ = this.coursesSource.asObservable();
    private dataStore: { courses: Course[] };

    private errorSubject = <Subject<any>>new Subject();
    public readonly errorMessage$ = this.errorSubject.asObservable();

    private successSubject = <Subject<any>>new Subject();
    public readonly successMessage$ = this.successSubject.asObservable();

    private isLoadingGetCoursesSubject = <Subject<boolean>>new Subject();
    isLoadingGetCourses$ = this.isLoadingGetCoursesSubject.asObservable();

    private isLoadingSubject = <Subject<boolean>>new Subject();
    isLoading$ = this.isLoadingSubject.asObservable();

    private courseCreatedSubject = <Subject<Course>>new Subject();
    public readonly courseCreated$ = this.courseCreatedSubject.asObservable();

    constructor(private courseBackendService: CourseBackendService, private httpCli: HttpClient) {
        this.dataStore = { courses: [] };


    }

    getCourses(year: number) {
        this.isLoadingGetCoursesSubject.next(true);

        if (this.dataStore.courses.length) {
            console.log(`********GET-Courses-CACHE********`);
            this.coursesSource.next(this.dataStore.courses);
        } else {
            console.log(`********GET-Courses-BACKEND********`);
            this.courseBackendService
                .getCourses(year)
                .pipe(finalize(() => this.isLoadingGetCoursesSubject.next(false)))
                .subscribe(data => {
                    if (data.length === 0) {
                        data = null;
                        this.successSubject.next('Lista de Cursos vacia');
                    } else {
                        this.dataStore.courses = data;
                        this.coursesSource.next(Object.assign({}, this.dataStore).courses);
                    }
                }, error => {
                    if (error instanceof HttpErrorResponse) {
                        this.errorSubject.next(error.error.message);
                    } else {
                        console.error('error retrieving cursos, ' + error.message);
                        this.errorSubject.next('Error al obtener lista de Cursos');
                    }
                });
        }

    }

    create(course: Course, year:number) {
        this.isLoadingSubject.next(true);
        this.courseBackendService
            .create(course, year)
            .pipe(finalize(() => this.isLoadingSubject.next(false)))
            .subscribe(data => {
                this.dataStore.courses.push(data);
                this.coursesSource.next(Object.assign({}, this.dataStore).courses);
                this.courseCreatedSubject.next(data);
            }, error => {
                if (error instanceof HttpErrorResponse) {
                    this.errorSubject.next(error.error.message);
                } else {
                    console.error('could not create User, ' + error.message);
                    this.errorSubject.next('Error al crear Alumno');
                }
            }, () => this.successSubject.next('Alumno Creado'));
    }

}