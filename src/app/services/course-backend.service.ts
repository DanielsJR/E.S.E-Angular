
import { API_SERVER, URI_COURSES, URI_YEAR, URI_NAME } from "../app.config";

import { Observable } from "../../../node_modules/rxjs";
import { Course } from "../models/course";
import { retry } from "../../../node_modules/rxjs/internal/operators/retry";
import { tap } from "../../../node_modules/rxjs/internal/operators/tap";
import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root',
})
export class CourseBackendService {

    private courseURL = API_SERVER + URI_COURSES;

    constructor(private httpCli: HttpClient) { }

    getCourses(year:string): Observable<Course[]> {
        const url = `${this.courseURL}${URI_YEAR}/${year}`;
        console.log(`resource called: ${url}`)
        return this.httpCli.get<Course[]>(url)
            .pipe(retry(3),
                tap(courses => console.log(`N° courses: ${courses.length}`))
                // ,catchError(this.handleError('getcourses', []))
            );
    }

    create(course: Course): Observable<Course> {
        const url = `${this.courseURL}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.post<Course>(url, course)
            .pipe(
                tap(resp => console.log(`created course name=${resp.name}`))
                // ,catchError(this.handleError<User>(`createUser`))
            );
    }

    update(course: Course): Observable<Course> {
        const courseId = course.id;
        const url = `${this.courseURL}/${courseId}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.put<Course>(url, course)
            .pipe(
                tap(resp => console.log(`edited course coursename=${resp.name}`))
                // ,catchError(this.handleError<course>(`updatecourse`))
            );
    }

    delete(course: Course | string): Observable<Course> {
        const courseId= (typeof course === 'string') ? course : course.id;
        const url = `${this.courseURL}/${courseId}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.delete<Course>(url)
            .pipe(
                tap(_ => console.log(`deleted course id=${courseId}`))
                // ,catchError(this.handleError<{}>(`deletecourse`))
            );
    }

    getCourseById(id: string): Observable<Course> {
        const url = `${this.courseURL}/${id}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<Course>(url)
            .pipe(retry(3),
                tap(_ => console.log(`fetched course id=${id}`))
                // ,catchError(this.handleError<course>(`getcourse id=${id}`))
            );
    }

    getCourseByName(name: string, year: string): Observable<Course> {
        const url = `${this.courseURL}${URI_NAME}/${name}/${year}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<Course>(url)
            .pipe(retry(3),
                tap(_ => console.log(`fetched course name=${name}`))
                // ,catchError(this.handleError<course>(`getcourse id=${id}`))
            );
    }

    getCourseIdByStudent(studentName: string, year: string): Observable<string> {
        const url = `${this.courseURL}/studentName/${studentName}/${year}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get(url, {responseType: 'text'})
            .pipe(retry(3),
                tap(id => console.log(`fetched course id=${id}`))
            );
    }
}
