import { Observable, of } from 'rxjs';
import { tap, retry, share } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { API_BACKEND_SERVER, URI_USER, URI_USERNAME, URI_PASS, URI_ROLE } from '../app.config';
import { Avatar } from '../models/avatar';


@Injectable({
    providedIn: 'root',
})
export class UserBackendService {


    private userURL = API_BACKEND_SERVER + URI_USER;

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
            tap(u => console.log(`created user name=${u.firstName}`)
                , err => console.error('Error creating user', err.error.exception)));
    }

    update(user: User, uriRole: string): Observable<User> {
        const username = user.username;
        const url = `${this.userURL}${uriRole}/${username}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.put<User>(url, user).pipe(
            tap(u => console.log(`edited user username=${u.username}`)
                , err => console.error('Error updating user', err.error.exception)));
    }

    delete(user: User, uriRole: string): Observable<User> {
        const username = user.username;
        const url = `${this.userURL}${uriRole}/${username}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.delete<User>(url).pipe(
            tap(u => console.log(`deleted user username=${u.username}`)
                , err => console.error('Error deleting user', err.error.exception)));
    }

    getUserById(id: string, uriRole: string): Observable<User> {
        const url = `${this.userURL}${uriRole}/${id}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<User>(url).pipe(
            retry(3),
            tap(u => console.log(`fetched user id=${u.id}`)
                , err => console.error('Error getting user', err.error.exception)));
    }

    getUserByUsername(name: string, uriRole: string): Observable<User> {
        const url = `${this.userURL}${uriRole}${URI_USERNAME}/${name}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<User>(url).pipe(
            retry(3),
            tap(u => console.log(`fetched user username=${u.username}`)
                , err => console.error('Error getting user', err.error.exception)));
    }

    getUsersByRole(role: string, uriRole: string): Observable<User[]> {
        const url = `${this.userURL}${uriRole}/${role}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.get<User[]>(url).pipe(
            retry(3),
            tap(_ => console.log(`fetched users by role=${role}`)
                , err => console.error('Error getting user', err.error.exception)));
    }

    resetUserPassword(username: string, resetedPass: string, uriRole: string): Observable<boolean> {
        const url = `${this.userURL}${uriRole}${URI_PASS}/${username}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.patch<boolean>(url, resetedPass).pipe(
            tap(result => console.log(`pass reseted: ${result}`)
                , err => console.error('Error setting user pass', err.error.exception)));

    }

    setRoles(user: User, uriRole: string): Observable<User> {
        const url = `${this.userURL}${uriRole}${URI_ROLE}/${user.username}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.patch<User>(url, user).pipe(
            tap(u => console.log(`fetched user username=${u.username} new roles=${u.roles}`)
                , err => console.error('Error setting user roles', err.error.exception)));
    }

    getUserByUsernameSecured(name: string): Observable<User> {
        const url = `${this.userURL}/${name}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<User>(url).pipe(
            retry(3),
            tap(u => console.log(`fetched user username=${u.username}`)
                , err => console.error('Error getting user', err.error.exception)));
    }

    updateSecured(user: User): Observable<User> {
        const username = user.username;
        const url = `${this.userURL}/${username}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.put<User>(url, user).pipe(
            tap(u => console.log(`edited user username=${u.username}`)
                , err => console.error('Error updating user', err.error.exception)));
    }

    setUserPasswordSecured(username: string, pass: string[]): Observable<boolean> {
        const url = `${this.userURL}/${username}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.patch<boolean>(url, pass).pipe(
            tap(result => console.log(`pass set: ${result}`)
                , err => console.error('Error setting user pass', err.error.exception)));
    }


}
