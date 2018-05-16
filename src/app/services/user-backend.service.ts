import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { API_SERVER, URI_USERS, URI_MANAGERS, URI_TOKEN, URI_ID, URI_USERNAME } from '../app.config';


@Injectable({
    providedIn: 'root',
})
export class UserBackendService {

    private userURL = API_SERVER + URI_USERS;

    constructor(private httpCli: HttpClient) { }


    getUsers(uriRole: string): Observable<User[]> {
        const url = `${this.userURL}${uriRole}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<User[]>(url)
        .pipe(
            catchError(this.handleError('getUsers', []))
          );
    }

    create(user: User, uriRole: string): Observable<User> {
        const url = `${this.userURL}${uriRole}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.post<User>(url, user)
        .pipe(
            catchError(this.handleError<User>(`createUser`))
          );
    }

    update(user: User, uriRole: string): Observable<User> {
        const id = user.id;
        const url = `${this.userURL}${uriRole}/${id}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.put<User>(url, user)
        .pipe(
            catchError(this.handleError<User>(`updateUser`))
          );
    }

    delete(id: string, uriRole: string): Observable<{}> {
        const url = `${this.userURL}${uriRole}/${id}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.delete<{}>(url)
        .pipe(
            catchError(this.handleError<{}>(`deleteUser`))
          );
    }

    getUserById(id: string, uriRole: string): Observable<User> {
        const url = `${this.userURL}${uriRole}/${id}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<User>(url)
        .pipe(
            catchError(this.handleError<User>(`getUser id=${id}`))
          );
    }

    getUserByToken(token: string, uriRole: string): Observable<User> {
        const url = `${this.userURL}${uriRole}${URI_TOKEN}/${token}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<User>(url)
        .pipe(
            catchError(this.handleError<User>(`getUser token=${token}`))
          );
    }

    getUserByUserName(name: string, uriRole: string): Observable<User> {
        const url = `${this.userURL}${uriRole}${URI_USERNAME}/${name}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<User>(url)
        .pipe(
            catchError(this.handleError<User>(`getUser name=${name}`))
          );
    }

    /*  TODO
    getUserByRole(role: string, uriRole: string): Observable<User> {
          const url = `${this.userURL}${uriRole}/${role}`;
          console.log(`resource called:  ${url}`);
          return this.httpCli.get<User>(url);
      }*/

    getUsersByRole(role: string, uriRole: string): Observable<User[]> {
        const url = `${this.userURL}${uriRole}/${role}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.get<User[]>(url)
        .pipe(
            catchError(this.handleError(`getUsersByRole`,[]))
          );
    }

    resetUserPassword(id: string, resetedPass: string, uriRole: string): Observable<boolean> {
        const url = `${this.userURL}${uriRole}/${id}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.patch<boolean>(url, resetedPass)
        .pipe(
            catchError(this.handleError<boolean>(`resetUserPassword id=${id}`))
          );

    }

    setRoles(id: string, roles: string[], uriRole: string): Observable<User> {
        const url = `${this.userURL}${uriRole}/role/${id}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.patch<User>(url, roles)
        .pipe(
            catchError(this.handleError<User>(`setRoles id=${id}`))
          );
    }


    /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            console.error(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

}
