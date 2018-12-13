import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { take } from 'rxjs/internal/operators/take';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { of } from 'rxjs/internal/observable/of';
import { UserLoggedService } from './user-logged.service';
import { EMPTY } from 'rxjs/internal/observable/empty';
import { ThemeService } from '../shared/theme-picker/theme.service';
import { Theme } from '../shared/theme-picker/theme';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { finalize } from 'rxjs/internal/operators/finalize';
import { IsLoadingService } from './isLoadingService.service';
import { LocalStorageService } from './local-storage.service';
import { LoginService } from '../login/login.service';


@Injectable({
    providedIn: 'root',
})
export class HomeResolverService implements Resolve<Theme> {

    constructor(private userLoggedService: UserLoggedService,
        private themeService: ThemeService, private router: Router,
        private isLoadingService: IsLoadingService, private localStorageService: LocalStorageService,
    ) { }


    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Theme> | Observable<never> {

        return this.userLoggedService.getUserFromBackEnd(this.localStorageService.getTokenUsername())
            .pipe(
                switchMap(user => this.themeService.getTheme(user.id)),
                take(1),
                mergeMap(t => {
                    if (t) {
                        return of(t);
                    } else {
                        this.router.navigate(['/welcome']);
                        return EMPTY;
                    }
                }),
                finalize(() => this.isLoadingService.isLoadingFalse()),
            )


    }


}