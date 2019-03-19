import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanActivateChild,
    CanLoad,
    NavigationExtras,
    Route,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { ROLE_TEACHER, URI_LOGIN } from '../app.config';
import { LoginService } from '../login/login-form/login.service';
import { UserLoggedService } from '../services/user-logged.service';


@Injectable()
export class TeacherGuard implements CanActivate, CanActivateChild, CanLoad {
    constructor(private userLoggedService: UserLoggedService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        //console.log('TeacherGuard#canActivate called');
        const url: string = state.url;
        return this.checkLogin(url);
        //return true;
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        //console.log('TeacherGuard#canActivateChild called');
        return this.canActivate(route, state);
    }

    canLoad(route: Route): boolean {
        //console.log('TeacherGuard#canLoad called');
        const url = `/${route.path}`;
        return this.checkLogin(url);
    }

    checkLogin(url: string): boolean {
        const roles = this.userLoggedService.getRoles();
        if (roles.includes(ROLE_TEACHER)) {
            //console.log('checkLogin: true');
            return true;
        } else {
            console.error('checkLogin: false');
            this.userLoggedService.redirectUrl = url;
            console.log('TeacherGuard#attempted url: ' + url + ' tokenUsername: ' + this.userLoggedService.getTokenUsername());
            this.router.navigate([URI_LOGIN]);
            return false;
        }
    }


}
