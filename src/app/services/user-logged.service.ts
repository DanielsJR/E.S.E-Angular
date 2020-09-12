import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { ReplaySubject, Observable } from 'rxjs';
import { UserBackendService } from './user-backend.service';
import { tap } from 'rxjs/operators';
import { IsLoadingService } from './isLoadingService.service';
import { LocalStorageService } from './local-storage.service';
import { ROLE_ADMIN, ROLE_MANAGER, ROLE_TEACHER, ROLE_STUDENT, URI_ADMIN, URI_MANAGER, URI_TEACHER, URI_STUDENT } from '../app.config';
 

@Injectable({
    providedIn: 'root',
})
export class UserLoggedService {

    private userLoggedSource = new ReplaySubject<User>(1);

    redirectUrl: string;
    redirectUser: string;


    constructor(
        private userBackendService: UserBackendService,
        private isLoadingService: IsLoadingService,
        private localStorageService: LocalStorageService,
    ) { }

    //manual
    get userLogged$() {
        return this.userLoggedSource.asObservable();
    }

    userLoggedNext(user: User) {
        //console.log('userLogged NEXT=======>');
        this.userLoggedSource.next(user);
    }

    getUserFromBackEnd(): Observable<User> {
        this.isLoadingService.isLoadingTrue();
        return this.userBackendService.getUserByUsernameSecured(this.getTokenUsername())
            .pipe(
                tap(user => this.userLoggedNext(user)
                    , err => console.error(`could not load user, ${err.error.errors}`))
            );
    }

    getRoles(): string[] {
        return this.localStorageService.getTokenRoles();
    }

    getTokenUsername(): string {
        return this.localStorageService.getTokenUsername();
    }

    isAdmin(): boolean {
        return (this.getRoles().includes(ROLE_ADMIN));
    }

    isManager(): boolean {
        return (this.getRoles().includes(ROLE_MANAGER));
    }

    isTeacher(): boolean {
        return (this.getRoles().includes(ROLE_TEACHER));
    }

    isStudent(): boolean {
        return (this.getRoles().includes(ROLE_STUDENT));
    }

    hasPrivileges(): boolean {
        for (var i = 0; i < this.getRoles().length; i++) {
            let role = this.getRoles()[i];
            return role === ROLE_ADMIN ||
                role === ROLE_MANAGER ||
                role === ROLE_TEACHER ||
                role === ROLE_STUDENT;
        }
    }

    getPrivilege(): string {
        for (var i = 0; i < this.getRoles().length; i++) {
            let role = this.getRoles()[i];
            if (role === ROLE_ADMIN) return ROLE_ADMIN;
            if (role === ROLE_MANAGER) return ROLE_MANAGER;
            if (role === ROLE_TEACHER) return ROLE_TEACHER;
            if (role === ROLE_STUDENT) return ROLE_STUDENT;
        }
        console.error('error no role');
        return 'no role';
    }

    getUriRole(): string {
        if (this.getPrivilege() === ROLE_ADMIN) return URI_ADMIN;
        if (this.getPrivilege() === ROLE_MANAGER) return URI_MANAGER;
        if (this.getPrivilege() === ROLE_TEACHER) return URI_TEACHER;
        if (this.getPrivilege() === ROLE_STUDENT) return URI_STUDENT;
        console.error('error no role');
        return 'no role';
    }





}