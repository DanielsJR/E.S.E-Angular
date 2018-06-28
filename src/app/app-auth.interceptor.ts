import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { LocalStorageService } from './services/local-storage.service';
import { LOCAL_STORAGE_TOKEN_KEY } from './app.config';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable()
export class AppAuthInterceptor implements HttpInterceptor {
    constructor(private localStorageService: LocalStorageService, private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!req.headers.has('Authorization')) {
            if (this.localStorageService.isStored(LOCAL_STORAGE_TOKEN_KEY)) {
                let token = this.localStorageService.getFullToken();
                const authReq = req.clone({
                    setHeaders: {
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json'
                    }
                });

              // const authReq = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token)});

                // Pass on the cloned request instead of the original request.
                return next.handle(authReq).pipe(tap((event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                        // do stuff with response if you want
                    }
                }, (err: any) => {
                    if (err instanceof HttpErrorResponse) {
                        console.error('message: ' + err.message +'   status: ' + err.status);
                        if (err.status === 401) this.router.navigate(['/login']);
                    }
                }));
            }

            return next.handle(req).pipe(tap((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    // do stuff with response if you want
                }
            }, (err: any) => {
                if (err instanceof HttpErrorResponse) {
                    //no token in local storage!
                    console.error('message: ' + err.message +'   status: ' + err.status);
                    if (err.status === 401) this.router.navigate(['/login']);
                }
            }));
        }
        // has authorization (login)
        console.error('it already has authorization!');
        return next.handle(req);
    }

}
