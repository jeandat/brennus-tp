import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { SnackBarService, SnackBarType } from '../snackbar/snackbar.service';
import { BaHttpErrorResponse } from './ba-http-error-response';
import { Router } from '@angular/router';

@Injectable()
export class CommonErrorsFilter implements HttpInterceptor {

    constructor(private snackbar:SnackBarService, private router:Router) {}

    intercept(req:HttpRequest<any>, next:HttpHandler):Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            timeout(30000),
            catchError((response:BaHttpErrorResponse) => {
                const status = response.status;
                let processed = false;
                if ((!navigator.onLine && !environment.mocks) || status === 0) {
                    this.displayOffline();
                    processed = true;
                } else if (status === 401) {
                    this.displaySignIn();
                    processed = true;
                } else if (status === 503) {
                    this.displayServiceDown();
                    processed = true;
                } else if (status === 504 || response instanceof TimeoutError) {
                    this.displayTimeOut();
                    processed = true;
                }
                response.processed = processed;
                return throwError(response);
            })
        );
    }

    displayOffline() {
        this.snackbar.showError('Offline.');
        console.log('Generic error "offline" processed in http interceptor');
    }

    displayServiceDown() {
        this.snackbar.showError('Service temporarily down.');
        console.log('Generic error "servicedown" processed in http interceptor');
    }

    displayTimeOut() {
        this.snackbar.showError('Service timed out.');
        console.log('Generic error "timeout" processed in http interceptor');
    }

    displaySignIn() {
        this.router.navigate(['/signin']);
        console.log('Sign in required to proceed further');
    }
}
