import { Observable, of } from 'rxjs';
import { tap, retry, share } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { API_SERVER, URI_USERS, URI_USERNAME, URI_PASS, URI_ROLE } from '../app.config';
import { Avatar } from '../models/avatar';


@Injectable({
    providedIn: 'root',
})
export class UserBackendService {


    private userURL = API_SERVER + URI_USERS;

    constructor(private httpCli: HttpClient) { }


    getUsers(uriRole: string): Observable<User[]> {
        const url = `${this.userURL}${uriRole}`;
        console.log(`resource called: ${url}`)
        return this.httpCli.get<User[]>(url).pipe(
            retry(3),
            tap(users => console.log(`N° Users: ${users.length}`))
        );
    }

    create(user: User, uriRole: string): Observable<User> {
        const url = `${this.userURL}${uriRole}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.post<User>(url, user).pipe(
            tap(resp => console.log(`created user name=${resp.firstName}`))
        );
    }

    update(user: User, uriRole: string): Observable<User> {
        const username = user.username;
        const url = `${this.userURL}${uriRole}/${username}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.put<User>(url, user).pipe(
            tap(resp => console.log(`edited user username=${resp.username}`))
        );
    }

    delete(user: User, uriRole: string): Observable<boolean> {
        const username = user.username;
        const url = `${this.userURL}${uriRole}/${username}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.delete<boolean>(url).pipe(
            tap(_ => console.log(`deleted user username=${username}`))
        );
    }

    getUserById(id: string, uriRole: string): Observable<User> {
        const url = `${this.userURL}${uriRole}/${id}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<User>(url).pipe(
            retry(3),
            tap(_ => console.log(`fetched user id=${id}`))
        );
    }

    getUserByUsername(name: string, uriRole: string): Observable<User> {
        const url = `${this.userURL}${uriRole}${URI_USERNAME}/${name}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<User>(url).pipe(
            retry(3),
            tap(resp => console.log(`fetched user username=${resp.username}`))
        );
    }

    getUsersByRole(role: string, uriRole: string): Observable<User[]> {
        const url = `${this.userURL}${uriRole}/${role}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.get<User[]>(url).pipe(
            retry(3),
            tap(_ => console.log(`fetched users by role=${role}`))
        );
    }

    resetUserPassword(username: string, resetedPass: string, uriRole: string): Observable<boolean> {
        const url = `${this.userURL}${uriRole}${URI_PASS}/${username}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.patch<boolean>(url, resetedPass).pipe(
            tap(result => console.log(`pass reseted: ${result}`))
        );

    }

    setRoles(user: User, uriRole: string): Observable<User> {
        const url = `${this.userURL}${uriRole}${URI_ROLE}/${user.username}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.patch<User>(url, user).pipe(
            tap(user => console.log(`fetched user username=${user.username} new roles=${user.roles}`))
        );
    }

    getUserByUsernameSecured(name: string): Observable<User> {
        const url = `${this.userURL}/${name}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<User>(url).pipe(
            retry(3),
            tap(resp => console.log(`fetched user username=${resp.username}`))
        );
    }

    updateSecured(user: User): Observable<User> {
        const username = user.username;
        const url = `${this.userURL}/${username}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.put<User>(url, user).pipe(
            tap(resp => console.log(`edited user username=${resp.username}`))
        );
    }

    setUserPasswordSecured(username: string, pass: string[]): Observable<boolean> {
        const url = `${this.userURL}/${username}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.patch<boolean>(url, pass).pipe(
            tap(result => console.log(`pass set: ${result}`))
        );
    }


}
