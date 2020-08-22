import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { LocalStorageService } from './services/local-storage.service';
import { RESULT_ERROR, URI_TOKEN_AUTH, API_BACKEND_SERVER, URI_LOGIN } from './app.config';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SnackbarService } from './shared/snackbars-ref/snackbar.service';


@Injectable()
export class AppAuthInterceptor implements HttpInterceptor {
    constructor(
        private localStorageService: LocalStorageService,
        private router: Router,
        private snackbarService: SnackbarService,
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const loginUrl = API_BACKEND_SERVER + URI_TOKEN_AUTH;
        const csrfUrl = API_BACKEND_SERVER + '/csrf';

        if (!req.headers.has('Authorization') && (req.url.search(loginUrl) === -1)) {
            if ((!this.localStorageService.isTokenExpired())) {
                const authReq = req.clone({
                    setHeaders: {
                        'Authorization': 'Bearer ' + this.localStorageService.getToken(),
                        'Content-Type': 'application/json'
                    }
                });

                // Pass on the cloned request instead of the original request.
                return next.handle(authReq).pipe(tap((event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                        // do stuff with response if you want
                    }
                }, (err: any) => {
                    if (err instanceof HttpErrorResponse) {
                        console.error('**from interceptor** message: ' + err.message + '   status: ' + err.status);

                        if (err.status === 403) {
                           // this.snackbarService.openSnackBar('Role Insuficiente', RESULT_ERROR);
                            //this.router.navigate(['/login']);

                        } else if (err.status === 401) {
                           // this.snackbarService.openSnackBar('No Autorizado', RESULT_ERROR);
                        }

                    }

                }));
            } else {
                return next.handle(req).pipe(tap((event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                        // do stuff with response if you want
                    }
                }, (err: any) => {
                    console.error('**from interceptor** token expired or null', err.message);
                    this.router.navigate([URI_LOGIN]);
                }
                ));
            }
        } else {
            // console.log('**from interceptor** has authorization or it's logining');
            return next.handle(req);
        }
    }

}
