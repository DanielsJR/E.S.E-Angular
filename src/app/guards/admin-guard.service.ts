import { LoginService } from '../login/login.service';
import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanActivateChild,
    CanLoad,
    Route,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { ROLE_ADMIN } from '../app.config';



@Injectable()
export class AdminGuard implements CanActivate, CanActivateChild, CanLoad {
    constructor(private loginService: LoginService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        //console.log('AdminGuard#canActivate called');
        const url: string = state.url;
        return this.checkLogin(url);
        //return true;
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        //console.log('AdminGuard#canActivateChild called');
        return this.canActivate(route, state);
    }

    canLoad(route: Route): boolean {
        //console.log('AdminGuard#canLoad called');
        const url = `/${route.path}`;
        return this.checkLogin(url);
    }

    checkLogin(url: string): boolean {
        const roles = this.loginService.getRoles();
        if (roles.includes(ROLE_ADMIN)) {
            //console.log('checkLogin: true');
            return true;
        } else {
            console.error('checkLogin: false');
            this.loginService.getTokenUsername();
            this.loginService.redirectUrl = url;
            console.log('AdminGuard#attempted url: ' + url + ' tokenUsername: '+ this.loginService.tokenUsername);
            this.router.navigate(['/login']);
            return false;
        }
    }

}
