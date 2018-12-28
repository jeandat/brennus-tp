import { HttpErrorResponse, HttpEvent, HttpHandler } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http/src/request';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SnackBarService } from '../snackbar/snackbar.service';
import { CommonErrorsFilter } from './common-errors-filter.service';
import SpyObj = jasmine.SpyObj;


describe('CommonErrorsFilter', () => {

    let service:CommonErrorsFilter;
    const snackbar:SpyObj<SnackBarService> = jasmine.createSpyObj('SnackBarService', ['showError']);

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports:[RouterTestingModule],
            providers:[CommonErrorsFilter, {provide:SnackBarService, useValue:snackbar}]
        }).compileComponents();
    });

    beforeEach(() => {
        service = TestBed.get(CommonErrorsFilter);
        snackbar.showError.calls.reset();
    });

    it('should process a timeout error', fakeAsync(() => {
        const request = {} as HttpRequest<any>;
        const next = {} as HttpHandler;
        next.handle = () => of({} as HttpEvent<any>).pipe(delay(35000));
        service.intercept(request, next).subscribe(
            () => fail('should have timed out'),
            () => {
                expect(snackbar.showError).toHaveBeenCalled();
                expect(snackbar.showError.calls.count()).toBe(1);
            }
        );
        tick(35000);
    }));

    it('should process a 504 error code', fakeAsync(() => {
        const request = {} as HttpRequest<any>;
        const next = {} as HttpHandler;
        next.handle = () => throwError(new HttpErrorResponse({status:504}));
        service.intercept(request, next).subscribe(
            () => fail('should have failed w/ 504 error code'),
            () => {
                expect(snackbar.showError).toHaveBeenCalled();
                expect(snackbar.showError.calls.count()).toBe(1);
            }
        );
        tick(35000);
    }));

    it('should process a 503 error code', fakeAsync(() => {
        const request = {} as HttpRequest<any>;
        const next = {} as HttpHandler;
        next.handle = () => throwError(new HttpErrorResponse({status:503}));
        service.intercept(request, next).subscribe(
            () => fail('should have failed w/ 503 error code'),
            () => {
                expect(snackbar.showError).toHaveBeenCalled();
                expect(snackbar.showError.calls.count()).toBe(1);
            }
        );
        tick(35000);
    }));

    it('should process a 0 error code', fakeAsync(() => {
        const request = {} as HttpRequest<any>;
        const next = {} as HttpHandler;
        next.handle = () => throwError(new HttpErrorResponse({status:0}));
        service.intercept(request, next).subscribe(
            () => fail('should have failed w/ 0 error code'),
            () => {
                expect(snackbar.showError).toHaveBeenCalled();
                expect(snackbar.showError.calls.count()).toBe(1);
            }
        );
        tick(35000);
    }));

});
