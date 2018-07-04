import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Subject } from 'rxjs';
import { UserBackendService } from './user-backend.service';
import { LoginService } from '../login/login.service';
import { LocalStorageService } from './local-storage.service';
import { LOCAL_STORAGE_TOKEN_KEY } from '../app.config';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class UserLoggedService {


    private userLoggedSource = new Subject<User>();
    userLogged$ = this.userLoggedSource.asObservable();
    user: User;


    constructor(private userBackendService: UserBackendService, private loginService: LoginService,
        private router: Router) {

    }


    userLogged(user: User) {
        console.log('userLogged NEXT....');
        this.userLoggedSource.next(user);
        this.user = user;
    }

    getUserFromBackEnd(username: string, redirect: boolean): boolean {
        let isLoading = true;
        this.userBackendService
            .getUserByUsernameSecured(username)
            .pipe(finalize(() => isLoading = false))
            .subscribe(user => {
                this.userLogged(user)
                const endPoint = this.loginService.getPrivilege().toLocaleLowerCase();
                if (redirect) this.router.navigate(['/home/' + endPoint]);
               
            }, error => {
                console.error(`could not load user, ${error.message}`);
               
            });
            return  isLoading;
    }

}