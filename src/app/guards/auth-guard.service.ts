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
import { UserLoggedService } from '../services/user-logged.service';
import { URI_LOGIN } from '../app.config';


@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
    constructor(private userLoggedService: UserLoggedService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        //console.log('AuthGuard#canActivate called');
        const url: string = state.url;
        return this.checkLogin(url);
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        //console.log('AuthGuard#canActivateChild called');
        return this.canActivate(route, state);
    }

    canLoad(route: Route): boolean {
        //console.log('AuthGuard#canLoad called');
        const navigation = this.router.getCurrentNavigation();
        let url = '/';

        if (navigation) {
            url = navigation.extractedUrl.toString();
        }
        return this.checkLogin(url);
    }

    checkLogin(url: string): boolean {
        if (this.userLoggedService.hasPrivileges()) {
            //console.log('checkLogin: true');
            return true;
        } else {
            console.error('checkLogin: false!!!');
            this.userLoggedService.redirectUrl = url;
            this.userLoggedService.redirectUser = this.userLoggedService.getTokenUsername();
            console.log('AuthGuard attempted url: ' + url + ' tokenUsername: ' + this.userLoggedService.redirectUser);
            this.router.navigate([URI_LOGIN]);
            return false;
        }
    }


}
