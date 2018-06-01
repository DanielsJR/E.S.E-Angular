import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Subject } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class UserLoggedService {

    private userLoggedSource = new Subject<User>();
    userLogged$ = this.userLoggedSource.asObservable();

    user:User;


    constructor() { }

    userLogged(user: User) {
        console.log('userLogged NEXT....');
        this.userLoggedSource.next(user);
        this.user = user;
    }



}