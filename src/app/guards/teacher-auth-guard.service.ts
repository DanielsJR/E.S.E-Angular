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
import { LocalStorageService } from '../shared/services/local-storage.service';


@Injectable()
export class TeacherAuthGuard implements CanActivate, CanActivateChild, CanLoad {
    constructor(private loginService: LoginService, private localStorageService: LocalStorageService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const url: string = state.url;
        console.log('TeacherAuthGuard#canActivate called');
        return this.checkLogin(url);
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

    canLoad(route: Route): boolean {
        const url = `/${route.path}`;
        return this.checkLogin(url);
    }

    checkLogin(url: string): boolean {
        const privilege = this.loginService.getPrivilege();
         if (privilege === 'TEACHER') {
             return true;
         }
         
         // Store the attempted URL for redirecting
         this.loginService.redirectUrl = url;
         this.router.navigate(['/login']);
         return false;
     }


}
