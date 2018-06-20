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



@Injectable()
export class StudentAuthGuard implements CanActivate, CanActivateChild, CanLoad {
    constructor(private loginService: LoginService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const url: string = state.url;
        console.log('StudentAuthGuard#canActivate called');
        //return this.checkLogin(url);
        return true;
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

    canLoad(route: Route): boolean {
        const url = `/${route.path}`;
        return this.checkLogin(url);
    }

    checkLogin(url: string): boolean {
        const roles = this.loginService.getRoles();
        if (roles.includes('STUDENT')) {
            return true;
        }
         
         // Store the attempted URL for redirecting
         this.loginService.redirectUrl = url;
         this.router.navigate(['/login']);
         return false;
     }


}
