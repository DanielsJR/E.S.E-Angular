import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { LOCAL_STORAGE_TOKEN_KEY } from '../../app.config';
import 'rxjs/add/operator/do';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private localStorageService: LocalStorageService,
        private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!req.headers.has('Authorization')) {
            if (this.localStorageService.isStored(LOCAL_STORAGE_TOKEN_KEY)) {
                const base64Token: string = this.localStorageService.getToken64();
                const authReq = req.clone({
                    setHeaders: {
                        'Authorization': `Basic ${base64Token}`,
                        'Content-Type': 'application/json'
                    }
                });

                // Pass on the cloned request instead of the original request.
                return next.handle(authReq).do((event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                        // do stuff with response if you want
                    }
                }
                    // token expired
                    , (err: any) => {

                        if (err instanceof HttpErrorResponse) {
                            if (err.status === 401) {
                                this.router.navigate(['/login']);
                            }
                        }
                    });
            }

            return next.handle(req).do((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    // do stuff with response if you want
                }
            }
                // no local storage
                , (err: any) => {
                    if (err instanceof HttpErrorResponse) {
                        if (err.status === 401) {
                            // redirect to the login route
                            this.router.navigate(['/login']);
                        }
                    }
                });
        }
        // has authorization (login)
        return next.handle(req);
    }

}
