import { HttpErrorResponse, HttpEvent, HttpHandler } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http/src/request';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SnackBar } from '../snackbar/snackbar.service';
import { CommonErrorsFilter } from './common-errors-filter.service';
import { RouterTestingModule } from '@angular/router/testing';
import Spy = jasmine.Spy;


describe('CommonErrorsFilter', () => {

    let service:CommonErrorsFilter;
    const snackbar = {} as SnackBar;
    snackbar.show = jasmine.createSpy('show');
    const createErrorResponse = (status) => ({ status } as HttpErrorResponse);

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports:[ RouterTestingModule ],
            providers:[ CommonErrorsFilter, { provide:SnackBar, useValue:snackbar } ]
        }).compileComponents();
    });

    beforeEach(() => {
        service = TestBed.get(CommonErrorsFilter);
        (snackbar.show as Spy).calls.reset();
    });

    it('should process a timeout error', fakeAsync(() => {
        const request = {} as HttpRequest<any>;
        const next = {} as HttpHandler;
        next.handle = () => of({} as HttpEvent<any>).pipe(delay(35000));
        service.intercept(request, next).subscribe(
            () => fail('should have timed out'),
            () => {
                expect(snackbar.show).toHaveBeenCalled();
                expect((snackbar.show as Spy).calls.count()).toBe(1);
            }
        );
        tick(35000);
    }));

    it('should process a 504 error code', fakeAsync(() => {
        const request = {} as HttpRequest<any>;
        const next = {} as HttpHandler;
        next.handle = () => throwError(createErrorResponse(504));
        service.intercept(request, next).subscribe(
            () => fail('should have failed w/ 504 error code'),
            () => {
                expect(snackbar.show).toHaveBeenCalled();
                expect((snackbar.show as Spy).calls.count()).toBe(1);
            }
        );
        tick(35000);
    }));

    it('should process a 503 error code', fakeAsync(() => {
        const request = {} as HttpRequest<any>;
        const next = {} as HttpHandler;
        next.handle = () => throwError(createErrorResponse(503));
        service.intercept(request, next).subscribe(
            () => fail('should have failed w/ 503 error code'),
            () => {
                expect(snackbar.show).toHaveBeenCalled();
                expect((snackbar.show as Spy).calls.count()).toBe(1);
            }
        );
        tick(35000);
    }));

    it('should process a 0 error code', fakeAsync(() => {
        const request = {} as HttpRequest<any>;
        const next = {} as HttpHandler;
        next.handle = () => throwError(createErrorResponse(0));
        service.intercept(request, next).subscribe(
            () => fail('should have failed w/ 0 error code'),
            () => {
                expect(snackbar.show).toHaveBeenCalled();
                expect((snackbar.show as Spy).calls.count()).toBe(1);
            }
        );
        tick(35000);
    }));

});
