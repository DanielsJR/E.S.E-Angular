import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { ReplaySubject, BehaviorSubject, Observable } from 'rxjs';
import { UserBackendService } from './user-backend.service';
import { LoginService } from '../login/login.service';
import { Router } from '@angular/router';
import { tap, finalize } from 'rxjs/operators';
import { IsLoadingService } from './isLoadingService.service';

@Injectable({
    providedIn: 'root',
})
export class UserLoggedService {

    private userLoggedSource = new ReplaySubject<User>(1);//<BehaviorSubject<User>>new BehaviorSubject(null);// new Subject<User>();
    userLogged$ = this.userLoggedSource.asObservable();

    constructor(private userBackendService: UserBackendService, private loginService: LoginService,
        private isLoadingService: IsLoadingService, private router: Router) { }

    userLoggedNext(user: User) {
        console.log('userLogged NEXT=======>');
        this.userLoggedSource.next(user);
    }

    getUserFromBackEnd(username: string): Observable<User> {
        this.isLoadingService.isLoadingTrue();
        return this.userBackendService.getUserByUsernameSecured(username)
            .pipe(
                tap(user => {
                    this.userLoggedNext(user);
                }, error => {
                    console.error(`could not load user, ${error.message}`);
                })
            );


    }

}