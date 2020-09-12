import { Injectable } from "@angular/core";
import { API_BACKEND_SERVER, URI_GRADE, URI_TITLE, URI_STUDENT, URI_EVALUATION, URI_SUBJECT, URI_USERNAME, URI_TEACHER } from "../app.config";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { retry } from "rxjs/internal/operators/retry";
import { tap } from "rxjs/internal/operators/tap";
import { Grade } from "../models/grade";




@Injectable({
    providedIn: 'root',
})
export class GradeBackendService {

    private gradeURL = API_BACKEND_SERVER + URI_GRADE;

    constructor(private httpCli: HttpClient) { }

    create(grade: Grade, username: string): Observable<Grade> {
        const url = `${this.gradeURL}${URI_TEACHER}/${username}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.post<Grade>(url, grade)
            .pipe(
                tap(g => console.log(`created Grade evaluation title=${g.evaluation.title}`)
                    , err => console.error('Error creating grade', err.error.exception)));
    }

    update(grade: Grade, username: string): Observable<Grade> {
        const gradeId = grade.id;
        const url = `${this.gradeURL}/${gradeId}${URI_TEACHER}/${username}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.put<Grade>(url, grade)
            .pipe(
                tap(g => console.log(`edited Grade Grade evaluation title=${g.evaluation.title}`)
                    , err => console.error('Error updating grade', err.error.exception)));
    }

    delete(grade: Grade | string, username: string): Observable<Grade> {
        const gradeId = (typeof grade === 'string') ? grade : grade.id;
        const url = `${this.gradeURL}/${gradeId}${URI_TEACHER}/${username}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.delete<Grade>(url)
            .pipe(
                tap(g => console.log(`deleted Grade id=${g.id}`)
                    , err => console.error('Error deleting grade', err.error.exception)));
    }

    getGradeById(id: string): Observable<Grade> {
        const url = `${this.gradeURL}/${id}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<Grade>(url)
            .pipe(retry(3),
                tap(g => console.log(`fetched Grade id=${g.id}`)
                    , err => console.error('Error getting grade', err.error.exception)));
    }

    getTeacherGradeById(id: string, username: string): Observable<Grade> {
        const url = `${this.gradeURL}/${id}`;
        console.log(`resource called: ${url}${URI_TEACHER}/${username}`);
        return this.httpCli.get<Grade>(url)
            .pipe(retry(3),
                tap(g => console.log(`fetched Grade id=${g.id}`)
                    , err => console.error('Error getting grade', err.error.exception)));
    }

    getGradesBySubject(id: string): Observable<Grade[]> {
        const url = `${this.gradeURL}${URI_SUBJECT}/${id}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<Grade[]>(url)
            .pipe(retry(3),
                tap(resp => console.log(`N° Grades: ${resp.length}`)
                    , err => console.error('Error getting grades', err.error.exception)));
    }

    getTeacherGradesBySubject(id: string, username: string): Observable<Grade[]> {
        const url = `${this.gradeURL}${URI_SUBJECT}/${id}${URI_TEACHER}/${username}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<Grade[]>(url)
            .pipe(retry(3),
                tap(resp => console.log(`N° Grades: ${resp.length}`)
                    , err => console.error('Error getting grades', err.error.exception)));
    }

    getStudentGradesBySubject(id: string, username: string): Observable<Grade[]> {
        const url = `${this.gradeURL}${URI_SUBJECT}/${id}${URI_STUDENT}/${username}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<Grade[]>(url)
            .pipe(retry(3),
                tap(resp => console.log(`N° Grades: ${resp.length}`)
                    , err => console.error('Error getting grades', err.error.exception)));
    }

    getGradesByEvaluation(id: string): Observable<Grade[]> {
        const url = `${this.gradeURL}${URI_EVALUATION}/${id}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<Grade[]>(url)
            .pipe(retry(3),
                tap(resp => console.log(`N° Grades: ${resp.length}`)
                    , err => console.error('Error getting grades', err.error.exception)));
    }

    getTeacherGradesByEvaluation(id: string, username: string): Observable<Grade[]> {
        const url = `${this.gradeURL}${URI_EVALUATION}/${id}${URI_TEACHER}/${username}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<Grade[]>(url)
            .pipe(retry(3),
                tap(resp => console.log(`N° Grades: ${resp.length}`)
                    , err => console.error('Error getting grades', err.error.exception)));
    }

}
