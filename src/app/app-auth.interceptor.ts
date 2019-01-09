import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { LocalStorageService } from './services/local-storage.service';
import { LOCAL_STORAGE_TOKEN_KEY, RESULT_ERROR, URI_TOKEN_AUTH, API_SERVER } from './app.config';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SnackbarService } from './services/snackbar.service';


@Injectable()
export class AppAuthInterceptor implements HttpInterceptor {
    constructor(private localStorageService: LocalStorageService, private router: Router, private snackbarService: SnackbarService, ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const loginUrl = API_SERVER + URI_TOKEN_AUTH;
        if (!req.headers.has('Authorization') && (req.url.search(loginUrl) === -1)) {
            if ((this.localStorageService.isStored(LOCAL_STORAGE_TOKEN_KEY))) {
                let token = this.localStorageService.getFullToken();
                const authReq = req.clone({
                    setHeaders: {
                        'Authorization': 'Bearer ' + token,
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
                            this.snackbarService.openSnackBar('Role Insuficiente', RESULT_ERROR);
                            this.router.navigate(['/login']);

                        } else {
                            this.snackbarService.openSnackBar('Error! session expirada', RESULT_ERROR);
                            this.router.navigate(['/login']);
                        }
                    }

                }));
            } else {
                return next.handle(req).pipe(tap((event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                        // do stuff with response if you want
                    }
                }, (err: any) => {
                    console.error('**from interceptor** no token in local storage!', err.message);
                    this.router.navigate(['/login']);
                }
                ));
            }
        } else {
            // has authorization or it's logining
           // console.log('**from interceptor** go on');
            return next.handle(req);
        }
    }

}
