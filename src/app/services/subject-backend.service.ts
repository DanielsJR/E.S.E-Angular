import { Injectable } from "@angular/core";
import { API_BACKEND_SERVER, URI_SUBJECT, URI_NAME, URI_TEACHER, URI_YEAR, URI_COURSE, URI_USER, URI_USERNAME } from "../app.config";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { retry } from "rxjs/internal/operators/retry";
import { tap } from "rxjs/internal/operators/tap";
import { Subject } from "../models/subject";


@Injectable({
    providedIn: 'root',
})
export class SubjectBackendService {

    private subjectURL = API_BACKEND_SERVER + URI_SUBJECT;

    constructor(private httpCli: HttpClient) { }


    getSubjectsByYear(year: string): Observable<Subject[]> {
        const url = `${this.subjectURL}${URI_YEAR}/${year}`;
        console.log(`resource called: ${url}`)
        return this.httpCli.get<Subject[]>(url)
            .pipe(retry(3),
                tap(resp => console.log(`N° Subjects: ${resp.length}`)
                    , err => console.error('Error getting subjects', err?.error?.exception)));
    }

    create(subject: Subject): Observable<Subject> {
        const url = `${this.subjectURL}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.post<Subject>(url, subject)
            .pipe(
                tap(s => console.log(`created Subject name=${s.name}`)
                    , err => console.error('Error creating subject', err?.error?.exception)));
    }

    update(subject: Subject): Observable<Subject> {
        const subjectId = subject.id;
        const url = `${this.subjectURL}/${subjectId}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.put<Subject>(url, subject)
            .pipe(
                tap(s => console.log(`edited Subject Subjectname=${s.name}`)
                    , err => console.error('Error updating subject', err?.error?.exception)));
    }

    delete(subject: Subject): Observable<Subject> {
        const subjectId = subject.id;
        const url = `${this.subjectURL}/${subjectId}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.delete<Subject>(url)
            .pipe(
                tap(s => console.log(`deleted Subject id=${s.id}`)
                    , err => console.error('Error deleting subject', err?.error?.exception)));
    }

    getSubjectById(id: string): Observable<Subject> {
        const url = `${this.subjectURL}/${id}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<Subject>(url)
            .pipe(retry(3),
                tap(s => console.log(`fetched Subject id=${s.id}`)
                    , err => console.error('Error getting subject', err?.error?.exception)));
    }

    getSubjectByName(name: string): Observable<Subject> {
        const url = `${this.subjectURL}${URI_NAME}/${name}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<Subject>(url)
            .pipe(retry(3),
                tap(s => console.log(`fetched Subject name=${s.name}`)
                    , err => console.error('Error getting subject', err?.error?.exception)));
    }

    getSubjectsByTeacherAndYear(username: string, year: string): Observable<Subject[]> {
        const url = `${this.subjectURL}${URI_TEACHER}/${username}/${year}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<Subject[]>(url)
            .pipe(retry(3),
                tap(resp => console.log(`N° Subjects: ${resp.length}`)
                    , err => console.error('Error getting subjects', err?.error?.exception)));
    }

    getStudentSubjectsByCourse(id: string, username: string,): Observable<Subject[]> {
        const url = `${this.subjectURL}${URI_COURSE}/${id}/${username}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<Subject[]>(url)
            .pipe(retry(3),
                tap(resp => console.log(`N° Subjects: ${resp.length}`)
                    , err => console.error('Error getting subjects', err?.error?.exception)));
    }
}
