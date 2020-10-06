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
import { URI_WELCOME } from '../app.config';


@Injectable({
    providedIn: 'root',
})
export class HomeResolverService implements Resolve<Theme> {

    constructor(private userLoggedService: UserLoggedService,
        private themeService: ThemeService, private router: Router,
        private isLoadingService: IsLoadingService,
    ) { }


    resolve(): Observable<Theme> | Observable<never> {
        return this.userLoggedService.getUserFromBackEnd()
            .pipe(
                switchMap(user => this.themeService.getTheme(user.username)),
                take(1),
                mergeMap(theme => {
                    if (theme) {
                        return of(theme);
                    } else {
                        this.router.navigate([URI_WELCOME]);
                        return EMPTY;
                    }
                }),
                finalize(() => this.isLoadingService.isLoadingFalse()),
            )
    }


}