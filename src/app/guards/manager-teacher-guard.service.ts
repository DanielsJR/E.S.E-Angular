import { LoginService } from '../login/login.service';
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
import { ROLE_TEACHER, ROLE_MANAGER } from '../app.config';


@Injectable()
export class ManagerTeacherGuard implements CanActivate, CanActivateChild, CanLoad {
    constructor(private loginService: LoginService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        console.log('ManagerTeacherGuard#canActivate called');
        const url: string = state.url;
        return this.checkLogin(url);
        //return true;
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        console.log('ManagerTeacherGuard#canActivateChild called');
        return this.canActivate(route, state);
    }

    canLoad(route: Route): boolean {
        console.log('ManagerTeacherGuard#canLoad called');
        const url = `/${route.path}`;
        return this.checkLogin(url);
    }

    checkLogin(url: string): boolean {
        const roles = this.loginService.getRoles();
        if (roles.includes(ROLE_MANAGER) || roles.includes(ROLE_TEACHER)) {
            console.log('checkLogin: true');
            return true;
        } else {
            console.error('checkLogin: false');
            this.loginService.getTokenUsername();
            this.loginService.redirectUrl = url;
            console.log('ManagerTeacherGuard#attempted url: ' + url + ' tokenUsername: '+ this.loginService.tokenUsername);
            this.router.navigate(['/login']);
            return false;
        }
    }


}
