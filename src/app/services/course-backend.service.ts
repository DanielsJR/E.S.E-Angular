
import { API_BACKEND_SERVER, URI_COURSE, URI_YEAR, URI_NAME, URI_STUDENT, URI_TEACHER } from "../app.config";

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

    private courseURL = API_BACKEND_SERVER + URI_COURSE;

    constructor(private httpCli: HttpClient) { }

    getCourses(year: string): Observable<Course[]> {
        const url = `${this.courseURL}${URI_YEAR}/${year}`;
        console.log(`resource called: ${url}`)
        return this.httpCli.get<Course[]>(url)
            .pipe(retry(3),
                tap(cs => console.log(`N° courses: ${cs.length}`)
                    , err => console.error('Error getting courses', err?.error?.exception)));
    }

    create(course: Course): Observable<Course> {
        const url = `${this.courseURL}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.post<Course>(url, course)
            .pipe(
                tap(c => console.log(`created course name=${c.name}`)
                    , err => console.error('Error creating course', err?.error?.exception)));
    }

    update(course: Course): Observable<Course> {
        const courseId = course.id;
        const url = `${this.courseURL}/${courseId}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.put<Course>(url, course)
            .pipe(
                tap(c => console.log(`edited course coursename=${c.name}`)
                    , err => console.error('Error editing course', err?.error?.exception)));
    }

    delete(course: Course): Observable<Course> {
        const courseId = course.id;
        const url = `${this.courseURL}/${courseId}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.delete<Course>(url)
            .pipe(
                tap(c => console.log(`deleted course id=${c.id}`)
                    , err => console.error('Error deleting course', err?.error?.exception)));
    }

    getCourseById(id: string): Observable<Course> {
        const url = `${this.courseURL}/${id}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<Course>(url)
            .pipe(retry(3),
                tap(c => console.log(`fetched course id=${c.id}`)
                    , err => console.error('Error getting course', err?.error?.exception)));
    }

    getCourseByName(name: string, year: string): Observable<Course> {
        const url = `${this.courseURL}${URI_NAME}/${name}/${year}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<Course>(url)
            .pipe(retry(3),
                tap(c => console.log(`fetched course name=${c.name}`)
                    , err => console.error('Error getting course', err?.error?.exception)));
    }

    getCourseByChiefTeacherAndYear(username: string, year: string): Observable<Course> {
        const url = `${this.courseURL}${URI_TEACHER}/${username}/${year}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<Course>(url)
            .pipe(retry(3),
                tap(c => console.log(`fetched course name=${c.name}`)
                    , err => console.error('Error getting course', err?.error?.exception)));
    }

    getCourseIdByStudent(username: string, year: string): Observable<string> {
        const url = `${this.courseURL}${URI_STUDENT}/${username}/${year}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get(url, { responseType: 'text' })
            .pipe(retry(3),
                tap(id => console.log(`fetched course id=${id}`)
                    , err => console.error('Error getting course', err?.error?.exception)));
    }
}
